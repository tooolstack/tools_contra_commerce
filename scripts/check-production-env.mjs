const full = process.argv.includes('--full');

const required = [
  ['NEXT_PUBLIC_TOOLS_DOMAIN', 4],
  ['DATABASE_URL', 20],
  ['PHONE_HASH_SECRET', 32],
  ['COURIER_CONNECTION_ENCRYPTION_KEY', 32],
  ['COURIER_WORKSPACE_SECRET', 32],
  ['CRON_SECRET', 32],
];

const fullIntegrations = [
  'ANTHROPIC_API_KEY',
  'PAGESPEED_API_KEY',
  'COURIER_RATES_API_URL',
  'LEAD_WEBHOOK_URL',
  'LEAD_WEBHOOK_SECRET',
];

const placeholder = /(?:localhost|example\.com|your-|change-?me|<.+>|user:password)/i;
const errors = [];
for (const [name, minimum] of required) {
  const value = String(process.env[name] || '').trim();
  if (value.length < minimum) errors.push(`${name} is missing or too short`);
  else if (placeholder.test(value)) errors.push(`${name} still contains a development placeholder`);
}
if (process.env.NEXT_PUBLIC_TOOLS_DOMAIN?.includes('://')) {
  errors.push('NEXT_PUBLIC_TOOLS_DOMAIN must not include http:// or https://');
}
for (const name of full ? fullIntegrations : []) {
  if (!String(process.env[name] || '').trim()) errors.push(`${name} is required in --full mode`);
}

const optional = {
  llm: Boolean(process.env.ANTHROPIC_API_KEY),
  pageSpeed: Boolean(process.env.PAGESPEED_API_KEY),
  liveRates: Boolean(process.env.COURIER_RATES_API_URL),
  leadDelivery: Boolean(process.env.LEAD_WEBHOOK_URL && process.env.LEAD_WEBHOOK_SECRET),
};

if (errors.length) {
  console.error('Deployment configuration is not ready:');
  for (const error of errors) console.error(`- ${error}`);
  console.error(`Optional integration status: ${JSON.stringify(optional)}`);
  process.exitCode = 1;
} else {
  console.log(`Deployment configuration ready. Optional integration status: ${JSON.stringify(optional)}`);
}
