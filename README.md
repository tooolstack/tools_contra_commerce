# Contra Commerce — Free Business Tools

বাংলাদেশের অনলাইন ব্যবসায়ীদের জন্য ফ্রি ই-কমার্স টুলের একটা সংগ্রহ, যেগুলো একই সাথে
**(১) Google/Facebook থেকে ট্রাফিক আনা marketing site** আর **(২) Contra Commerce SaaS-এ
বসানোর মতো drop-in component** — দুটোই।

> **এক codebase, দুই output।** টুলের হিসাব একবার লেখা হয়, দুই জায়গায় reuse হয়।

## Structure

```
contra-tools/
├── apps/
│   └── web/                 # ① Public marketing site (Next.js 16 + Tailwind)
│       ├── proxy.ts         #    hostname দেখে প্রতি tool-কে নিজের subdomain-এ serve করে
│       ├── lib/
│       │   ├── tools.ts     #    tool registry — single source (hub + proxy + link)
│       │   └── domain.ts    #    subdomain URL helper + Host parsing
│       └── app/
│           ├── page.tsx                    # hub (tools.<domain>) — সব tool বাটন হিসেবে
│           └── profit-calculator/page.tsx  # (profit-calculator.<domain>)
│
└── packages/
    └── tools-kit/           # ② Boss কে দেওয়ার drop-in package (@contra/tools-kit)
        ├── src/logic/       #    pure function — কোনো React নেই (server-safe, testable)
        │   ├── profit.ts
        │   └── profit.test.ts
        ├── src/components/  #    'use client' React component (Tailwind UI)
        │   └── ProfitCalculator.tsx
        └── README.md        #    👉 boss-এর integration গাইড এখানে
```

- **apps/web** → আলাদা domain-এ deploy (যেমন `tools.contracommerce.com`) — SEO + lead magnet।
- **packages/tools-kit** → boss `npm install` করে SaaS-এ বসান। integration ধাপ:
  [`packages/tools-kit/README.md`](packages/tools-kit/README.md)।

## Dev

```bash
npm install          # workspace-এর সব dependency
npm run dev          # marketing site → http://localhost:3000
npm run test         # tools-kit logic-এর unit test (vitest)
```

খোলো (browser *.localhost সাপোর্ট করে, তাই দুটোই কাজ করবে):
- hub → `http://tools.localhost:3000`
- tool → `http://profit-calculator.localhost:3000`

## Subdomain routing (per-tool subdomain)

প্রতিটি tool নিজের subdomain-এ খোলে — কিন্তু **এক app, এক deploy**:

| URL | কী দেখায় |
| --- | --- |
| `tools.contracommerce.com` | hub — সব tool বাটন |
| `profit-calculator.contracommerce.com` | প্রফিট ক্যালকুলেটর |
| `<slug>.contracommerce.com` | ঐ tool |

- **কীভাবে:** `proxy.ts` Host header দেখে subdomain বের করে ভেতরে সঠিক route rewrite করে।
  আলাদা deploy লাগে না।
- **DNS:** wildcard `*.contracommerce.com` (+ `tools.contracommerce.com`) একই deployment-এ
  point করাও (Vercel-এ wildcard domain যোগ করলেই হয়)।
- **Env:** `NEXT_PUBLIC_TOOLS_DOMAIN` সেট করো — prod-এ `contracommerce.com`, dev-এ `localhost:3000`
  (`.env.example` দেখো)।
- **Single-host deploy:** wildcard subdomain routing না থাকলে
  `NEXT_PUBLIC_TOOLS_DOMAIN=tools.example.com` এবং
  `NEXT_PUBLIC_TOOLS_PATH_ROUTING=true` সেট করলে tools `tools.example.com/<slug>`-এ খুলবে।
- **SEO:** প্রতি-tool subdomain-এ authority ভাগ হয়; প্রতিটি tool page-এ subdomain-কে
  `canonical` করা আছে আর hub-এর path-based access subdomain-এ 308 redirect হয় — duplicate
  content ঠেকাতে।

## Data storage (Neon PostgreSQL)

প্রতিটি tool-এর data Neon-এ জমা হয় (ঐচ্ছিক — `DATABASE_URL` না দিলে tool ঠিকঠাক চলে, শুধু জমা হয় না)।

- **Setup:** `DATABASE_URL` রাখো `apps/web/.env.local`-এ (gitignored), তারপর schema apply করো:
  ```bash
  psql "$DATABASE_URL" -f db/schema.sql
  ```
- **Tables:** `tool_events` (প্রতিটি deliberate tool action), `leads` (contact capture),
  `survey_votes`, `fraud_checks`, encrypted `courier_workspace_connections`, এবং idempotent
  `courier_bookings`।
- **কীভাবে:** `apps/web/lib/db.ts` (`@neondatabase/serverless`) — সব write **best-effort** (DB ডাউন থাকলেও tool ভাঙে না)। ৬টি tool API route `tool_events`-এ log করে; survey vote `/api/survey-vote`-এ; client calculator গুলো `useResultTracking` hook দিয়ে `/api/event`-এ (debounced), `NEXT_PUBLIC_TRACK_ENDPOINT` সেট থাকলে।
- **নোট:** Claude sandbox থেকে Node → Neon পৌঁছায় না (psql পৌঁছায়) — তাই schema psql দিয়ে apply; আসল deploy-এ app-এর write ঠিকঠাক জমা হবে।

## নতুন টুল যোগ করার নিয়ম (template)

প্রতিটা নতুন টুল এই ৩ ধাপে Profit Calculator-এর মতো করেই বানানো হবে:

1. `packages/tools-kit/src/logic/<tool>.ts` — শুধু হিসাব, pure function + `<tool>.test.ts`।
2. `packages/tools-kit/src/components/<Tool>.tsx` — `'use client'` UI, branding/CTA props সহ।
3. `packages/tools-kit/src/index.ts`-এ export যোগ করো, আর
   `apps/web/app/<tool>/page.tsx`-এ একটা SEO page বানাও, তারপর
   `apps/web/lib/tools.ts`-এর `TOOLS[]` অ্যারেতে entry যোগ করো (`ready: true`) — এতে
   hub-এর বাটন, `<tool>.<domain>` subdomain routing, আর cross-link সব একসাথে চালু হবে।

**Live tools (22):** registry-এর ২২টি tool page এখন চালু। Calculator/generator tools shared
`@contra/tools-kit` package ব্যবহার করে; fraud, tracking, courier connection এবং booking
server-side proxy দিয়ে credential গোপন রেখে চলে।

## Data-driven টুল (Fraud checker, courier tracking)

এগুলোর logic client-side নয়। Merchant courier credentials Courier Settings-এ নেওয়া হয়,
server-side encrypt করে workspace অনুযায়ী রাখা হয়, এবং এই Next.js app-এর API routes
provider API call করে। আলাদা courier backend service লাগে না।

## Production deployment

Codebase এখন একটিমাত্র standalone Next.js container, health checks,
security headers, sitemap/robots, encrypted courier credentials, idempotent booking এবং
durable lead-webhook outboxসহ deploy করা যায়।

1. `apps/web/.env.example` থেকে `apps/web/.env.production` বানাও এবং কোনো secret git-এ
   commit কোরো না।
2. `DATABASE_URL`, `PHONE_HASH_SECRET`, `COURIER_CONNECTION_ENCRYPTION_KEY`,
   `COURIER_WORKSPACE_SECRET` এবং `CRON_SECRET` configure করো।
3. database schema apply করো: `npm run db:migrate`।
4. `npm run deploy:check` চালিয়ে minimum production config যাচাই করো। সব optional
   provider activate করতে `node --env-file=apps/web/.env.production
   scripts/check-production-env.mjs --full` চালাও।
5. `docker compose --env-file apps/web/.env.production -f docker-compose.production.yml
   up -d --build` চালাও। Compose schema idempotently migrate করে তারপর web service চালায়।
   Reverse proxy থেকে `tools.<domain>` এবং wildcard `*.<domain>` port 3000-এ পাঠাও।
6. platform scheduler দিয়ে প্রতি মিনিটে `POST /api/internal/lead-outbox` call করো,
   header `Authorization: Bearer $CRON_SECRET`।

Liveness endpoint: `GET /api/health`; strict readiness endpoint: `GET /api/ready`।
Database reachable এবং credential encryption/workspace signing configured হলে readiness 200,
otherwise 503; response
কোনো secret প্রকাশ করে না।

### Repeatable staging bundle

1. `BASE_DOMAIN=staging.example.com npm run staging:bootstrap` চালাও। এটি ignored,
   permission-0600 web/edge env files তৈরি করে এবং live courier credentials copy
   করে না। Host filesystem POSIX permission support না করলে script warning দেবে; সেক্ষেত্রে
   deploy host-এ files owner-only করতে হবে।
2. `docker compose --env-file deploy/staging.env -f docker-compose.staging.yml up -d
   --build` চালাও। Caddy Cloudflare DNS challenge দিয়ে wildcard HTTPS নেয়; Prometheus ও
   Blackbox exporter readiness monitor করে।
3. `node --env-file=deploy/staging.env scripts/staging-smoke.mjs` চালাও।
4. Non-billable courier sandbox নিশ্চিত করার পরেই
   `SMOKE_COURIER_BOOKING=true` এবং `CONFIRM_SANDBOX_COURIER=true` ব্যবহার করো।

Staging-only session simulator `/api/internal/staging-auth` শুধু
`DEPLOYMENT_STAGE=staging` এবং 32+ character secret থাকলে চালু হয়। Production Contra
Commerce authentication configure করলে internal URL-এর বদলে production auth status URL
ব্যবহার করতে হবে।
