# ZYROX ARENA

Standalone esports tournament platform — separate from the main Zyrox Studioz
site. React + TypeScript + Vite + Tailwind + Framer Motion frontend,
Cloudflare Worker API, Supabase (Postgres + Auth + Storage, RLS enabled),
Razorpay payments.

## What's in this scaffold vs. what's still to build

**Built and working:**
- Full project structure, routing (public + separate admin route tree), design system
- Landing page with live Supabase queries (Hero, ticker, game categories, tournament grid)
- Tournament detail, listing, register, payment status pages, per-page SEO tags (`react-helmet-async`)
- Route-level page transitions (Framer Motion, respects `prefers-reduced-motion`)
- Admin: login (real bcrypt password check), JWT access + refresh token rotation, tournament list + publish toggle, registrations list + manual payment re-verify + CSV export, audit log viewer — all role-permission gated
- Full Supabase schema + RLS policies + default role/permission seed (`supabase/migrations/`)
- Worker API: security headers, CSRF (double-submit cookie), rate-limit hook, registration creation (server-computed pricing), Razorpay webhook with signature verification + server-side re-check, admin CRUD routes with audit logging on every mutation

**You need to fill in before this is production-ready:**
- Admin "create tournament" and "edit tournament" **forms** (the API routes exist — `admin-tournaments.ts` — the modal/form UI doesn't yet)
- Bracket editor UI + match auto-generation logic
- Cloudflare's `RATE_LIMITER` binding provisioned in `wrangler.toml` (the middleware is ready, currently no-ops with a warning if unbound)
- File upload validation for banners/gallery (Supabase Storage bucket policies)
- Email/notification sending (registration confirmation, payment receipts)
- A one-off local script to bcrypt-hash the first `super_admin` password and insert it — never insert plaintext via SQL
- `sitemap.xml` generation (a build step that queries published tournament slugs) — `robots.txt` already points to it

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

Push the schema to your Supabase project:
```bash
supabase db push   # or run supabase/migrations/0001_init.sql in the SQL editor
```

Deploy the Worker:
```bash
cd workers
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put JWT_SECRET
wrangler secret put JWT_REFRESH_SECRET
wrangler secret put RAZORPAY_KEY_SECRET
wrangler secret put RAZORPAY_WEBHOOK_SECRET
wrangler deploy
```

**Before going live:** change `VITE_ADMIN_PATH` in your production env to a
random, unguessable slug — never leave the `control-panel-dev` fallback in
production, and never link to it from the public site.

## Design tokens

Colors, fonts, and animation tokens live centrally in `tailwind.config.ts`.
Change them there, not per-component.
