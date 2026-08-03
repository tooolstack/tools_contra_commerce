import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sql } from './db';

export type CourierConnectionSummary = {
  courierId: string;
  displayName: string;
  connectionType: 'builtin' | 'custom_history' | 'custom_order_status';
  enabled: boolean;
  syncEnabled: boolean;
  credentialsConfigured: boolean;
  updatedAt?: string;
};

type StoredConnection = Omit<CourierConnectionSummary, 'credentialsConfigured'> & {
  workspaceId: string;
  encryptedCredentials: string;
};

type ConnectionInput = {
  displayName: string;
  connectionType: CourierConnectionSummary['connectionType'];
  enabled: boolean;
  syncEnabled: boolean;
  credentials: Record<string, unknown>;
};

const dataDirectory = resolve(process.cwd(), '.data');
const dataPath = resolve(dataDirectory, 'courier-connections.json');
const keyPath = resolve(dataDirectory, 'courier-connections.key');

let localWriteQueue = Promise.resolve();
let cachedKey: Promise<Buffer> | undefined;
const WORKSPACE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function requireDurableProductionStorage(): void {
  if (!sql && process.env.NODE_ENV === 'production') {
    throw new Error('Production courier storage requires DATABASE_URL');
  }
}

function configuredKey(): Buffer | null {
  const source =
    process.env.COURIER_CONNECTION_ENCRYPTION_KEY?.trim() ||
    process.env.PHONE_HASH_SECRET?.trim();
  return source ? createHash('sha256').update(source).digest() : null;
}

async function encryptionKey(): Promise<Buffer> {
  const configured = configuredKey();
  if (configured) return configured;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Courier credential encryption is not configured');
  }
  cachedKey ??= (async () => {
    await mkdir(dataDirectory, { recursive: true });
    try {
      const saved = (await readFile(keyPath, 'utf8')).trim();
      const key = Buffer.from(saved, 'hex');
      if (key.length === 32) return key;
    } catch {
      // Create a development-only key below.
    }
    const key = randomBytes(32);
    await writeFile(keyPath, key.toString('hex'), { mode: 0o600 });
    return key;
  })();
  return cachedKey;
}

async function encryptCredentials(
  workspaceId: string,
  credentials: Record<string, unknown>,
): Promise<string> {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', await encryptionKey(), iv);
  cipher.setAAD(Buffer.from(workspaceId));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(credentials), 'utf8'),
    cipher.final(),
  ]);
  return [
    'v1',
    iv.toString('base64url'),
    cipher.getAuthTag().toString('base64url'),
    encrypted.toString('base64url'),
  ].join('.');
}

async function decryptCredentials(
  workspaceId: string,
  payload: string,
): Promise<Record<string, unknown>> {
  const [version, ivValue, tagValue, encryptedValue] = payload.split('.');
  if (version !== 'v1' || !ivValue || !tagValue || !encryptedValue) {
    throw new Error('Invalid encrypted courier credentials');
  }
  const decipher = createDecipheriv(
    'aes-256-gcm',
    await encryptionKey(),
    Buffer.from(ivValue, 'base64url'),
  );
  decipher.setAAD(Buffer.from(workspaceId));
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64url')),
    decipher.final(),
  ]);
  const parsed = JSON.parse(decrypted.toString('utf8'));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid courier credentials');
  }
  return parsed;
}

async function readLocalConnections(): Promise<StoredConnection[]> {
  try {
    const parsed = JSON.parse(await readFile(dataPath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeLocalConnections(connections: StoredConnection[]): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryPath = `${dataPath}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(connections, null, 2)}\n`, { mode: 0o600 });
  await rename(temporaryPath, dataPath);
}

function summary(connection: StoredConnection): CourierConnectionSummary {
  return {
    courierId: connection.courierId,
    displayName: connection.displayName,
    connectionType: connection.connectionType,
    enabled: connection.enabled,
    syncEnabled: connection.syncEnabled,
    credentialsConfigured: Boolean(connection.encryptedCredentials),
    updatedAt: connection.updatedAt,
  };
}

export async function listCourierConnections(workspaceId: string): Promise<{
  encryptionReady: boolean;
  connections: CourierConnectionSummary[];
}> {
  requireDurableProductionStorage();
  await encryptionKey();
  if (sql) {
    const rows = await sql`
      select courier_id, display_name, connection_type, enabled, sync_enabled,
             encrypted_credentials, updated_at
        from courier_workspace_connections
       where workspace_id = ${workspaceId} and expires_at > now()
       order by display_name asc`;
    return {
      encryptionReady: true,
      connections: rows.map((row) =>
        summary({
          workspaceId,
          courierId: String(row.courier_id),
          displayName: String(row.display_name),
          connectionType: row.connection_type as CourierConnectionSummary['connectionType'],
          enabled: row.enabled === true,
          syncEnabled: row.sync_enabled === true,
          encryptedCredentials: String(row.encrypted_credentials || ''),
          updatedAt: row.updated_at ? new Date(String(row.updated_at)).toISOString() : undefined,
        }),
      ),
    };
  }
  return {
    encryptionReady: true,
    connections: (await readLocalConnections())
      .filter(
        (connection) =>
          connection.workspaceId === workspaceId &&
          Date.parse(connection.updatedAt || '') > Date.now() - WORKSPACE_TTL_MS,
      )
      .map(summary),
  };
}

export async function saveCourierConnection(
  workspaceId: string,
  courierId: string,
  connection: ConnectionInput,
): Promise<{ ok: true; connection: CourierConnectionSummary }> {
  requireDurableProductionStorage();
  const encryptedCredentials = await encryptCredentials(workspaceId, connection.credentials);
  const updatedAt = new Date().toISOString();
  const stored: StoredConnection = {
    workspaceId,
    courierId,
    displayName: connection.displayName,
    connectionType: connection.connectionType,
    enabled: connection.enabled,
    syncEnabled: connection.syncEnabled,
    encryptedCredentials,
    updatedAt,
  };

  if (sql) {
    await sql`
      insert into courier_workspace_connections (
        workspace_id, courier_id, display_name, connection_type, enabled, sync_enabled,
        encrypted_credentials, updated_at, expires_at
      )
      values (
        ${workspaceId}, ${courierId}, ${connection.displayName}, ${connection.connectionType},
        ${connection.enabled}, ${connection.syncEnabled}, ${encryptedCredentials}, now(),
        now() + interval '30 days'
      )
      on conflict (workspace_id, courier_id) do update set
        display_name = excluded.display_name,
        connection_type = excluded.connection_type,
        enabled = excluded.enabled,
        sync_enabled = excluded.sync_enabled,
        encrypted_credentials = excluded.encrypted_credentials,
        updated_at = now(),
        expires_at = now() + interval '30 days'`;
  } else {
    let saved: Promise<void> = Promise.resolve();
    localWriteQueue = localWriteQueue.then(async () => {
      const connections = await readLocalConnections();
      const index = connections.findIndex(
        (item) => item.workspaceId === workspaceId && item.courierId === courierId,
      );
      if (index >= 0) connections[index] = stored;
      else connections.push(stored);
      await writeLocalConnections(connections);
    });
    saved = localWriteQueue;
    await saved;
  }

  return { ok: true, connection: summary(stored) };
}

export async function getCourierConnection(
  workspaceId: string,
  courierId: string,
): Promise<
  | (CourierConnectionSummary & { credentials: Record<string, unknown> })
  | null
> {
  requireDurableProductionStorage();
  let stored: StoredConnection | undefined;
  if (sql) {
    const rows = await sql`
      select courier_id, display_name, connection_type, enabled, sync_enabled,
             encrypted_credentials, updated_at
        from courier_workspace_connections
       where workspace_id = ${workspaceId} and courier_id = ${courierId}
         and expires_at > now()
       limit 1`;
    const row = rows[0];
    if (row) {
      stored = {
        workspaceId,
        courierId: String(row.courier_id),
        displayName: String(row.display_name),
        connectionType: row.connection_type as CourierConnectionSummary['connectionType'],
        enabled: row.enabled === true,
        syncEnabled: row.sync_enabled === true,
        encryptedCredentials: String(row.encrypted_credentials || ''),
        updatedAt: row.updated_at ? new Date(String(row.updated_at)).toISOString() : undefined,
      };
    }
  } else {
    stored = (await readLocalConnections()).find(
      (connection) =>
        connection.workspaceId === workspaceId && connection.courierId === courierId,
    );
  }
  if (!stored) return null;
  return {
    ...summary(stored),
    credentials: await decryptCredentials(workspaceId, stored.encryptedCredentials),
  };
}

export async function listActiveCourierConnections(
  workspaceId: string,
): Promise<Array<CourierConnectionSummary & { credentials: Record<string, unknown> }>> {
  const summaries = (await listCourierConnections(workspaceId)).connections.filter(
    (connection) => connection.enabled,
  );
  const connections = await Promise.all(
    summaries.map((connection) => getCourierConnection(workspaceId, connection.courierId)),
  );
  return connections.filter(
    (
      connection,
    ): connection is CourierConnectionSummary & { credentials: Record<string, unknown> } =>
      connection != null,
  );
}

export async function deleteCourierConnection(
  workspaceId: string,
  courierId: string,
): Promise<boolean> {
  requireDurableProductionStorage();
  if (sql) {
    const rows = await sql`
      delete from courier_workspace_connections
       where workspace_id = ${workspaceId} and courier_id = ${courierId}
       returning courier_id`;
    return rows.length > 0;
  }
  let deleted = false;
  localWriteQueue = localWriteQueue.then(async () => {
    const connections = await readLocalConnections();
    const remaining = connections.filter((connection) => {
      const match =
        connection.workspaceId === workspaceId && connection.courierId === courierId;
      if (match) deleted = true;
      return !match;
    });
    if (deleted) await writeLocalConnections(remaining);
  });
  await localWriteQueue;
  return deleted;
}
