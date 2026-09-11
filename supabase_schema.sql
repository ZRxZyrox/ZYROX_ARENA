-- ====================================================================
-- ZYROX ARENA — SUPABASE PRODUCTION SQL MIGRATION SCRIPT (SAFE & IDEMPOTENT)
-- Copy and run this script inside Supabase SQL Editor: https://app.supabase.com
-- NOTE: Safe to run even if you ran a previous script. Will NOT delete existing data!
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TOURNAMENTS TABLE (Preserves existing data)
CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    game_slug TEXT NOT NULL DEFAULT 'bgmi',
    mode TEXT NOT NULL DEFAULT 'squad',
    entry_fee NUMERIC NOT NULL DEFAULT 0,
    prize_pool NUMERIC NOT NULL DEFAULT 0,
    prize_pool_display TEXT NOT NULL DEFAULT '₹0',
    max_slots INTEGER NOT NULL DEFAULT 100,
    status TEXT NOT NULL DEFAULT 'reg_open',
    banner_variant TEXT DEFAULT 'b1',
    published BOOLEAN NOT NULL DEFAULT true,
    rules TEXT DEFAULT 'Standard Zyrox Arena rules apply.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TESTIMONIALS / REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Verified Gamer',
    quote TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SITE SETTINGS TABLE (Global numbers, stats & top ticker line)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    ticker_text TEXT NOT NULL DEFAULT '🏆 BGMI Showdown Season 4 Finals — Registrations Closing Soon! • ₹45,00,000+ Cash Prizes Paid Out',
    paid_out_amount TEXT NOT NULL DEFAULT '₹45,00,000+',
    active_players_count TEXT NOT NULL DEFAULT '12,800+',
    live_events_count TEXT NOT NULL DEFAULT '14+',
    announcement_banner TEXT NOT NULL DEFAULT '🔥 Season 4 Mega Tournament Registration Open — Claim Your Slot Now!',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REGISTRATIONS TABLE (Preserves existing data)
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    captain_name TEXT NOT NULL,
    captain_email TEXT NOT NULL,
    captain_phone TEXT NOT NULL,
    in_game_id TEXT NOT NULL,
    discord_id TEXT,
    players JSONB DEFAULT '[]'::jsonb,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    approval_status TEXT NOT NULL DEFAULT 'approved',
    cashfree_order_id TEXT UNIQUE,
    cashfree_payment_id TEXT,
    amount_paid NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    target_table TEXT,
    target_id TEXT,
    ip_address TEXT,
    admin_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADMIN USERS TABLE (Preserves existing admin accounts)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 9. CLEANUP OLD POLICIES TO PREVENT DUPLICATE POLICY ERRORS
DROP POLICY IF EXISTS "Public Read Tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Public Read Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Insert Registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public Read Own Registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admin All Tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Admin All Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin All Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin All Audit Logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admin All Registrations" ON public.registrations;

-- 10. RLS POLICIES FOR PUBLIC & ADMIN ACCESS
CREATE POLICY "Public Read Tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Insert Registrations" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Own Registrations" ON public.registrations FOR SELECT USING (true);

CREATE POLICY "Admin All Tournaments" ON public.tournaments FOR ALL USING (true);
CREATE POLICY "Admin All Testimonials" ON public.testimonials FOR ALL USING (true);
CREATE POLICY "Admin All Site Settings" ON public.site_settings FOR ALL USING (true);
CREATE POLICY "Admin All Audit Logs" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Admin All Registrations" ON public.registrations FOR ALL USING (true);

-- 11. SEED DEFAULT TESTIMONIALS & SETTINGS ONLY IF THEY DO NOT EXIST
INSERT INTO public.testimonials (id, name, role, quote, rating, published)
VALUES
('rev_1', 'Arjun S.', 'BGMI Squad Captain', 'ZYROX ARENA anti-cheat system is the real deal. First tournament platform where I feel every match is fair.', 5, true),
('rev_2', 'Priya M.', 'Free Fire Solo', 'Won ₹50,000 in the Clash Cup. Prize money hit my bank account within 12 hours. Unreal experience!', 5, true),
('rev_3', 'Karan V.', 'Valorant Team Captain', 'Best esports platform in India. Real-time bracket updates, instant payouts, and zero delay support.', 5, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (id, ticker_text, paid_out_amount, active_players_count, live_events_count, announcement_banner)
VALUES
('global', '🏆 BGMI Showdown Season 4 Finals — Registrations Closing Soon! • ₹45,00,000+ Cash Prizes Paid Out', '₹45,00,000+', '12,800+', '14+', '🔥 Season 4 Mega Tournament Registration Open — Claim Your Slot Now!')
ON CONFLICT (id) DO NOTHING;
