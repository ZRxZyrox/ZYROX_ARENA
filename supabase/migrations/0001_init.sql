-- ============================================================================
-- ZYROX ARENA — Initial schema + Row Level Security
-- Run via `supabase db push` or the Supabase SQL editor.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- ADMIN USERS & ROLES  (separate from Supabase Auth used by players)
-- ---------------------------------------------------------------------------
create table admin_roles (
  id            uuid primary key default uuid_generate_v4(),
  name          text unique not null,        -- 'super_admin' | 'tournament_manager' | 'finance' | 'support'
  permissions   jsonb not null default '{}'   -- e.g. {"tournaments.write": true, "payments.verify": true}
);

create table admin_users (
  id              uuid primary key default uuid_generate_v4(),
  email           text unique not null,
  password_hash   text not null,              -- bcrypt/argon2, hashed in the Worker — never store plaintext
  role_id         uuid references admin_roles(id) not null,
  is_active       boolean not null default true,
  last_login_at   timestamptz,
  created_at      timestamptz not null default now()
);

-- Admin auth never goes through the anon/authenticated Supabase Auth roles.
-- The Worker uses the service_role key for all admin_users reads/writes,
-- so RLS on this table just needs to deny everyone else outright.
alter table admin_users enable row level security;
alter table admin_roles enable row level security;
-- No policies created = default deny for anon/authenticated. Only
-- service_role (used server-side only) bypasses RLS.

-- ---------------------------------------------------------------------------
-- GAMES
-- ---------------------------------------------------------------------------
create table games (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,   -- 'bgmi', 'freefire', 'valorant', 'fc', 'cricket'
  name        text not null,
  icon        text,
  is_active   boolean not null default true,
  sort_order  int not null default 0
);

alter table games enable row level security;
create policy "games are publicly readable" on games
  for select using (is_active = true);

-- ---------------------------------------------------------------------------
-- TOURNAMENTS
-- ---------------------------------------------------------------------------
create table tournaments (
  id                       uuid primary key default uuid_generate_v4(),
  slug                     text unique not null,
  title                    text not null,
  game_id                  uuid references games(id) not null,
  game                     text not null,             -- denormalized display name
  game_slug                text not null,
  description              text,
  rules_text               text,
  banner_url               text,
  banner_variant           text default 'b1',
  mode                     text not null check (mode in ('solo','squad')),
  team_size                int default 1,
  entry_fee_paise          int not null default 0,    -- amount in paise; server is the only writer of price-affecting fields
  prize_pool_paise         int not null default 0,
  prize_pool_display       text not null,              -- formatted string for display, e.g. '₹2,00,000'
  status                   text not null default 'upcoming'
                             check (status in ('draft','upcoming','reg_open','live','completed','cancelled')),
  published                boolean not null default false,
  registration_opens_at    timestamptz,
  registration_closes_at   timestamptz,
  starts_at                timestamptz,
  max_participants         int,
  discord_url              text,
  whatsapp_url             text,
  created_by               uuid references admin_users(id),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

alter table tournaments enable row level security;

-- Public can only ever see published tournaments. Draft/unpublished rows
-- (still being configured by an admin) are invisible to anon requests.
create policy "published tournaments are publicly readable" on tournaments
  for select using (published = true);

-- No insert/update/delete policy for anon/authenticated — all writes go
-- through the Worker using service_role, which also runs validation and
-- writes to audit_logs in the same transaction.

-- ---------------------------------------------------------------------------
-- TEAMS
-- ---------------------------------------------------------------------------
create table teams (
  id             uuid primary key default uuid_generate_v4(),
  tournament_id  uuid references tournaments(id) not null,
  name           text not null,
  captain_user_id uuid references auth.users(id) not null,
  status         text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at     timestamptz not null default now()
);

alter table teams enable row level security;

-- A player can see their own team; captains can see/manage their team.
create policy "captain can view own team" on teams
  for select using (auth.uid() = captain_user_id);

create policy "captain can create own team" on teams
  for insert with check (auth.uid() = captain_user_id);

create policy "captain can update own pending team" on teams
  for update using (auth.uid() = captain_user_id and status = 'pending');

create table team_members (
  id           uuid primary key default uuid_generate_v4(),
  team_id      uuid references teams(id) not null,
  player_name  text not null,
  in_game_id   text not null,
  user_id      uuid references auth.users(id),
  created_at   timestamptz not null default now()
);

alter table team_members enable row level security;
create policy "team members visible to captain" on team_members
  for select using (
    exists (select 1 from teams t where t.id = team_id and t.captain_user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- REGISTRATIONS  (solo or squad — payment status is server-controlled only)
-- ---------------------------------------------------------------------------
create table registrations (
  id                 uuid primary key default uuid_generate_v4(),
  tournament_id      uuid references tournaments(id) not null,
  team_id            uuid references teams(id),          -- null for solo
  user_id            uuid references auth.users(id),
  player_name        text not null,
  in_game_id         text not null,
  email              text not null,
  phone              text not null,
  mode               text not null check (mode in ('solo','squad')),
  amount_paise       int not null,
  payment_status     text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  cashfree_order_id  text unique,
  approval_status    text not null default 'pending' check (approval_status in ('pending','approved','rejected')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table registrations enable row level security;

-- Players can see their own registrations only.
create policy "user can view own registrations" on registrations
  for select using (auth.uid() = user_id);

-- Registrations are NEVER inserted directly by the browser (the entry fee
-- amount would then be client-supplied, which is exactly the "no
-- client-side trust for payments" rule this platform requires). The
-- Worker inserts using service_role after computing amount_paise itself
-- from tournaments.entry_fee_paise. No insert/update policy = anon/
-- authenticated cannot write here at all.

-- ---------------------------------------------------------------------------
-- MATCHES / BRACKETS
-- ---------------------------------------------------------------------------
create table matches (
  id             uuid primary key default uuid_generate_v4(),
  tournament_id  uuid references tournaments(id) not null,
  round          int not null,
  match_number   int not null,
  team_a_id      uuid references teams(id),
  team_b_id      uuid references teams(id),
  score_a        int,
  score_b        int,
  winner_id      uuid references teams(id),
  scheduled_at   timestamptz,
  status         text not null default 'scheduled' check (status in ('scheduled','live','completed')),
  created_at     timestamptz not null default now()
);

alter table matches enable row level security;
create policy "matches publicly readable for published tournaments" on matches
  for select using (
    exists (select 1 from tournaments t where t.id = tournament_id and t.published = true)
  );

-- ---------------------------------------------------------------------------
-- ANNOUNCEMENTS  (powers the ticker + announcements section)
-- ---------------------------------------------------------------------------
create table announcements (
  id            uuid primary key default uuid_generate_v4(),
  message       text not null,
  is_live_flag  boolean not null default false,
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table announcements enable row level security;
create policy "published announcements are publicly readable" on announcements
  for select using (published = true);

-- ---------------------------------------------------------------------------
-- COUPONS
-- ---------------------------------------------------------------------------
create table coupons (
  id                uuid primary key default uuid_generate_v4(),
  code              text unique not null,
  discount_percent  int check (discount_percent between 1 and 100),
  max_uses          int,
  used_count        int not null default 0,
  valid_from        timestamptz,
  valid_until       timestamptz,
  is_active         boolean not null default true
);

alter table coupons enable row level security;
-- No public select policy: coupon validity is checked server-side (Worker
-- endpoint /api/coupons/validate), which returns only a boolean + discount
-- amount — never the full coupons table — so codes can't be enumerated.

-- ---------------------------------------------------------------------------
-- AUDIT LOGS  (every admin mutation, written by the Worker)
-- ---------------------------------------------------------------------------
create table audit_logs (
  id            uuid primary key default uuid_generate_v4(),
  admin_id      uuid references admin_users(id),
  action        text not null,        -- e.g. 'tournament.update', 'payment.verify'
  target_table  text,
  target_id     uuid,
  metadata      jsonb,
  ip_address    text,
  created_at    timestamptz not null default now()
);

alter table audit_logs enable row level security;
-- No policies — service_role (Worker) only. Never exposed to the frontend
-- directly; the admin panel reads audit logs through a Worker endpoint
-- that paginates and redacts as needed.

-- ---------------------------------------------------------------------------
-- Indexes for the query patterns the app actually uses
-- ---------------------------------------------------------------------------
create index idx_tournaments_status on tournaments(status) where published = true;
create index idx_tournaments_game on tournaments(game_slug);
create index idx_registrations_tournament on registrations(tournament_id);
create index idx_registrations_user on registrations(user_id);
create index idx_matches_tournament on matches(tournament_id);
create index idx_audit_logs_admin on audit_logs(admin_id, created_at desc);
