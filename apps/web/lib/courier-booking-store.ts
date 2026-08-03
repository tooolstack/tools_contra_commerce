import { randomBytes } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sql } from './db';
import type { CourierBookingResult } from './courier-adapters';

type StoredBooking = {
  workspaceId: string;
  idempotencyKey: string;
  result: CourierBookingResult;
  createdAt: string;
};

const dataDirectory = resolve(process.cwd(), '.data');
const dataPath = resolve(dataDirectory, 'courier-bookings.json');
let writeQueue = Promise.resolve();

async function readLocal(): Promise<StoredBooking[]> {
  try {
    const parsed = JSON.parse(await readFile(dataPath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeLocal(rows: StoredBooking[]): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  const temporary = `${dataPath}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
  await writeFile(temporary, `${JSON.stringify(rows, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, dataPath);
}

export async function findCourierBooking(
  workspaceId: string,
  idempotencyKey: string,
): Promise<CourierBookingResult | null> {
  if (sql) {
    const rows = await sql`
      select result
        from courier_bookings
       where workspace_id = ${workspaceId} and idempotency_key = ${idempotencyKey}
       limit 1`;
    return (rows[0]?.result as CourierBookingResult | undefined) ?? null;
  }
  return (
    (await readLocal()).find(
      (row) => row.workspaceId === workspaceId && row.idempotencyKey === idempotencyKey,
    )?.result ?? null
  );
}

export async function saveCourierBooking(
  workspaceId: string,
  idempotencyKey: string,
  result: CourierBookingResult,
): Promise<void> {
  if (sql) {
    await sql`
      insert into courier_bookings (workspace_id, idempotency_key, result)
      values (${workspaceId}, ${idempotencyKey}, ${JSON.stringify(result)}::jsonb)
      on conflict (workspace_id, idempotency_key) do nothing`;
    return;
  }
  writeQueue = writeQueue.then(async () => {
    const rows = await readLocal();
    if (
      rows.some(
        (row) => row.workspaceId === workspaceId && row.idempotencyKey === idempotencyKey,
      )
    ) {
      return;
    }
    rows.push({ workspaceId, idempotencyKey, result, createdAt: new Date().toISOString() });
    await writeLocal(rows.slice(-500));
  });
  await writeQueue;
}
