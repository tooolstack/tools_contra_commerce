-- Contra Commerce free-tools — data storage schema (Neon PostgreSQL).
-- Apply with: psql "$DATABASE_URL" -f db/schema.sql

-- Every deliberate tool action (server-backed tools + client calculators).
create table if not exists tool_events (
  id          bigserial primary key,
  tool        text not null,
  payload     jsonb,
  demo        boolean,
  ip          text,
  user_agent  text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_tool_events_tool    on tool_events (tool);
create index if not exists idx_tool_events_created on tool_events (created_at);

-- Captured leads (the funnel goal): contact info + which tool produced it.
create table if not exists leads (
  id          bigserial primary key,
  tool        text,
  name        text,
  phone       text,
  email       text,
  meta        jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists idx_leads_phone on leads (phone);

-- Durable hand-off of captured leads to a CRM/email/webhook provider. The app
-- writes here before attempting delivery, so a temporary provider outage never
-- loses a consented lead.
create table if not exists lead_outbox (
  id              bigserial primary key,
  lead_id         bigint not null references leads(id) on delete cascade,
  payload         jsonb not null,
  status          text not null default 'pending',
  attempts        integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  delivered_at    timestamptz,
  last_error      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create unique index if not exists idx_lead_outbox_lead on lead_outbox (lead_id);
create index if not exists idx_lead_outbox_due
  on lead_outbox (next_attempt_at)
  where status = 'pending';

-- Demand-survey votes (the one tool that genuinely needs stored responses).
create table if not exists survey_votes (
  id           bigserial primary key,
  survey_hash  text not null,
  question     text,
  choice       text not null,
  ip           text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_survey_votes_hash on survey_votes (survey_hash);

-- Operational order-risk analytics. The `phone` value is a one-way identifier,
-- never the raw customer number.
create table if not exists fraud_checks (
  id            bigserial primary key,
  phone         text not null,
  risk_level    text,
  success_rate  integer,
  source        text,
  created_at    timestamptz not null default now()
);
create index if not exists idx_fraud_checks_phone on fraud_checks (phone);

-- Distributed API rate-limit buckets. Keys are SHA-256 hashes of
-- route + client IP + time window; raw IP addresses are never stored here.
create table if not exists api_rate_limits (
  bucket_key     text primary key,
  request_count integer not null default 1,
  expires_at     timestamptz not null
);
create index if not exists idx_api_rate_limits_expiry on api_rate_limits (expires_at);

-- Encrypted merchant courier credentials. Only non-secret connection metadata is
-- returned to the browser; encrypted_credentials is consumed server-side.
create table if not exists courier_workspace_connections (
  workspace_id          uuid not null,
  courier_id            text not null,
  display_name          text not null,
  connection_type       text not null
    check (connection_type in ('builtin', 'custom_history', 'custom_order_status')),
  enabled               boolean not null default true,
  sync_enabled          boolean not null default true,
  encrypted_credentials text not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  expires_at            timestamptz not null default (now() + interval '30 days'),
  primary key (workspace_id, courier_id)
);
create index if not exists idx_courier_workspace_connections_enabled
  on courier_workspace_connections (workspace_id, enabled);
create index if not exists idx_courier_workspace_connections_expiry
  on courier_workspace_connections (expires_at);

-- Idempotent courier bookings prevent browser retries from creating duplicate
-- merchant orders.
create table if not exists courier_bookings (
  workspace_id    uuid not null,
  idempotency_key text not null,
  result          jsonb not null,
  created_at      timestamptz not null default now(),
  primary key (workspace_id, idempotency_key)
);
