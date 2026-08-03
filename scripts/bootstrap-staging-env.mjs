import { randomBytes } from 'node:crypto';
import { chmod, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const baseDomain = String(process.env.BASE_DOMAIN || '').trim().toLowerCase();
if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(baseDomain)) {
  console.error('Set BASE_DOMAIN to the staging base domain, for example staging.example.com.');
  process.exit(1);
}

function parseEnv(contents) {
  const result = {};
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const index = line.indexOf('=');
    result[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return result;
}

const toolsEnv = parseEnv(await readFile(resolve(root, 'apps/web/.env.local'), 'utf8'));
const databaseUrl = toolsEnv.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL must be configured in apps/web/.env.local.');
  process.exit(1);
}

const randomSecret = () => randomBytes(32).toString('hex');
const stagingSessionSecret = randomSecret();

const webOutput = [
  `NEXT_PUBLIC_TOOLS_DOMAIN=${baseDomain}`,
  `DATABASE_URL=${databaseUrl}`,
  `PHONE_HASH_SECRET=${randomSecret()}`,
  `COURIER_CONNECTION_ENCRYPTION_KEY=${randomSecret()}`,
  `COURIER_WORKSPACE_SECRET=${randomSecret()}`,
  'NEXT_PUBLIC_TRACK_ENDPOINT=/api/event',
  'DEPLOYMENT_STAGE=staging',
  `STAGING_AUTH_BYPASS_SECRET=${stagingSessionSecret}`,
  `CRON_SECRET=${randomSecret()}`,
  '',
].join('\n');

const deployOutput = [
  `BASE_DOMAIN=${baseDomain}`,
  `ACME_EMAIL=${process.env.ACME_EMAIL || `ops@${baseDomain}`}`,
  `CLOUDFLARE_API_TOKEN=${process.env.CLOUDFLARE_API_TOKEN || ''}`,
  'TOOLS_IMAGE=contra-commerce-tools:staging',
  `STAGING_ORIGIN=https://tools.${baseDomain}`,
  `STAGING_COOKIE=contra-staging-session=${encodeURIComponent(stagingSessionSecret)}`,
  'SMOKE_COURIER_BOOKING=false',
  'CONFIRM_SANDBOX_COURIER=false',
  'SANDBOX_COURIER_ID=',
  'SANDBOX_CUSTOMER_PHONE=01700001111',
  'SANDBOX_CUSTOMER_NAME=Contra Commerce Sandbox',
  'SANDBOX_DELIVERY_ADDRESS=Sandbox test address, Dhaka',
  'SANDBOX_COD_AMOUNT=0',
  'SANDBOX_WEIGHT_KG=0.5',
  'REQUIRE_LIVE_HISTORY=false',
  'SANDBOX_HISTORY_PHONE=01700001111',
  '',
].join('\n');

const webEnvPath = resolve(root, 'apps/web/.env.staging');
const deployEnvPath = resolve(root, 'deploy/staging.env');
await writeFile(webEnvPath, webOutput, { mode: 0o600 });
await writeFile(deployEnvPath, deployOutput, { mode: 0o600 });
await Promise.all([
  chmod(webEnvPath, 0o600),
  chmod(deployEnvPath, 0o600),
]);
const envPaths = [webEnvPath, deployEnvPath];
const modes = await Promise.all(
  envPaths.map(async (filePath) => (await stat(filePath)).mode & 0o777),
);
if (modes.every((mode) => mode === 0o600)) {
  console.log('Staging environment files created with mode 0600.');
} else {
  console.warn(
    'WARNING: This filesystem did not preserve mode 0600. Move the project to a POSIX filesystem or protect these ignored env files at the host level before deployment.',
  );
}
console.log('Provider credentials were intentionally not copied; add sandbox credentials through Courier Settings.');
