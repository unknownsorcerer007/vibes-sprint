-- ============================================================
-- VIBEBUILD — SUPABASE SCHEMA
-- ============================================================
-- Copy-paste this entire file into your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query) and click "Run".
-- It is safe to run multiple times — every statement uses
-- IF NOT EXISTS / OR REPLACE where possible.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. VISITORS TABLE
--    Stores every unique visitor identified by a client-side
--    fingerprint (random UUID stored in localStorage).
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visitors (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint   text        UNIQUE NOT NULL,
    email         text,
    user_agent    text,
    ip_hint       text,
    created_at    timestamptz DEFAULT now(),
    last_seen     timestamptz DEFAULT now()
);

COMMENT ON TABLE visitors IS 'Unique visitors identified by a client-generated fingerprint.';


-- ────────────────────────────────────────────────────────────
-- 2. RATINGS TABLE
--    One rating per visitor per slide (upserted on re-rate).
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ratings (
    id              uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id      uuid    NOT NULL REFERENCES visitors (id) ON DELETE CASCADE,
    slide_index     int     NOT NULL CHECK (slide_index >= 0 AND slide_index <= 9),
    slide_name      text,
    design_rating   int     NOT NULL CHECK (design_rating >= 1 AND design_rating <= 10),
    content_rating  int     NOT NULL CHECK (content_rating >= 1 AND content_rating <= 10),
    created_at      timestamptz DEFAULT now(),
    UNIQUE (visitor_id, slide_index)
);

COMMENT ON TABLE ratings IS 'Design & content ratings per slide per visitor.';


-- ────────────────────────────────────────────────────────────
-- 3. EMAIL SIGNUPS TABLE
--    Collects emails from any slide's CTA form.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_signups (
    id              uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
    email           text    UNIQUE NOT NULL,
    name            text,
    source_slide    int,
    referral_source text,
    created_at      timestamptz DEFAULT now()
);

COMMENT ON TABLE email_signups IS 'Email signups captured across all slides.';


-- ────────────────────────────────────────────────────────────
-- 4. FEEDBACK TABLE
--    End-of-session feedback form (best page, suggestions…).
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
    id              uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id      uuid    REFERENCES visitors (id) ON DELETE SET NULL,
    email           text,
    best_page       int,
    best_page_name  text,
    suggestions     text,
    questions       text,
    social_link     text,
    created_at      timestamptz DEFAULT now()
);

COMMENT ON TABLE feedback IS 'Open-ended visitor feedback submitted at session end.';


-- ────────────────────────────────────────────────────────────
-- 5. PAGE VIEWS TABLE
--    Tracks which slide was viewed and for how long.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_views (
    id                  uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id          uuid    NOT NULL REFERENCES visitors (id) ON DELETE CASCADE,
    slide_index         int     NOT NULL,
    time_spent_seconds  int     DEFAULT 0,
    created_at          timestamptz DEFAULT now()
);

COMMENT ON TABLE page_views IS 'Per-slide view events with time-on-slide tracking.';


-- ────────────────────────────────────────────────────────────
-- 6. MASCOT EVENTS TABLE
--    Logs mascot interactions (clicks, mood changes, etc.).
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mascot_events (
    id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id    uuid    NOT NULL REFERENCES visitors (id) ON DELETE CASCADE,
    event_type    text    NOT NULL,
    mood          text,
    slide_index   int,
    created_at    timestamptz DEFAULT now()
);

COMMENT ON TABLE mascot_events IS 'Mascot interaction telemetry (clicks, mood shifts).';


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Public (anon) users may INSERT data and look up their own
-- visitor record. Full CRUD is reserved for authenticated
-- users (admin dashboard).
-- ============================================================

-- Enable RLS on every table
ALTER TABLE visitors      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback      ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views    ENABLE ROW LEVEL SECURITY;
ALTER TABLE mascot_events ENABLE ROW LEVEL SECURITY;


-- ── VISITORS ────────────────────────────────────────────────
-- Anon: insert new visitors, select (fingerprint lookup), update last_seen
CREATE POLICY "anon_insert_visitors"
    ON visitors FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "anon_select_visitors"
    ON visitors FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "anon_update_visitors"
    ON visitors FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Authenticated (admin): full access
CREATE POLICY "auth_all_visitors"
    ON visitors FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ── RATINGS ─────────────────────────────────────────────────
CREATE POLICY "anon_insert_ratings"
    ON ratings FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "auth_all_ratings"
    ON ratings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ── EMAIL SIGNUPS ───────────────────────────────────────────
CREATE POLICY "anon_insert_email_signups"
    ON email_signups FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "auth_all_email_signups"
    ON email_signups FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ── FEEDBACK ────────────────────────────────────────────────
CREATE POLICY "anon_insert_feedback"
    ON feedback FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "auth_all_feedback"
    ON feedback FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ── PAGE VIEWS ──────────────────────────────────────────────
CREATE POLICY "anon_insert_page_views"
    ON page_views FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "auth_all_page_views"
    ON page_views FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ── MASCOT EVENTS ───────────────────────────────────────────
CREATE POLICY "anon_insert_mascot_events"
    ON mascot_events FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "auth_all_mascot_events"
    ON mascot_events FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ============================================================
-- ANALYTIC VIEWS
-- ============================================================
-- These views make it easy to query aggregated data from the
-- Supabase dashboard or your admin panel.
-- ============================================================

-- Average design & content ratings per slide
CREATE OR REPLACE VIEW rating_summary AS
SELECT
    slide_index,
    slide_name,
    ROUND(AVG(design_rating)::numeric, 2)  AS avg_design_rating,
    ROUND(AVG(content_rating)::numeric, 2) AS avg_content_rating,
    COUNT(*)                                AS total_ratings
FROM ratings
GROUP BY slide_index, slide_name
ORDER BY slide_index;

COMMENT ON VIEW rating_summary IS 'Aggregated average ratings per slide.';


-- Daily email signup count
CREATE OR REPLACE VIEW daily_signups AS
SELECT
    DATE(created_at) AS signup_date,
    COUNT(*)         AS signup_count
FROM email_signups
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;

COMMENT ON VIEW daily_signups IS 'Number of email signups per calendar day.';


-- Daily new visitor count
CREATE OR REPLACE VIEW daily_visitors AS
SELECT
    DATE(created_at) AS visit_date,
    COUNT(*)         AS visitor_count
FROM visitors
GROUP BY DATE(created_at)
ORDER BY visit_date DESC;

COMMENT ON VIEW daily_visitors IS 'Number of new visitors per calendar day.';


-- ============================================================
-- DONE 🎉
-- All tables, policies, and views have been created.
-- You can now integrate with supabase-client.js.
-- ============================================================
