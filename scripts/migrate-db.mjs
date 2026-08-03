import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error('DATABASE_URL is not configured.');
  process.exit(1);
}

let connection;
try {
  connection = new URL(databaseUrl);
} catch {
  console.error('DATABASE_URL is invalid.');
  process.exit(1);
}
if (!['postgres:', 'postgresql:'].includes(connection.protocol)) {
  console.error('DATABASE_URL must use postgres:// or postgresql://.');
  process.exit(1);
}

const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
const statements = schema
  .split(';')
  .map((statement) =>
    statement
      .split(/\r?\n/)
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n')
      .trim(),
  )
  .filter(Boolean);

const sql = neon(databaseUrl);
for (const statement of statements) {
  await sql.query(statement);
}
console.log(`Applied ${statements.length} database schema statements.`);
