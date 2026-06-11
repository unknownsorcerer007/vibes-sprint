// ============================================================
// VIBEBUILD — SUPABASE CLIENT  (supabase-client.js)
// ============================================================
// Prerequisites:
//   1. Load the Supabase CDN *before* this script:
//      <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   2. Load config.js *before* this script:
//      <script src="config.js"></script>
//   3. Then load this file:
//      <script src="supabase-client.js"></script>
//
// Usage:
//   await VB.init();                              // call once on page load
//   await VB.saveRating(0, 8, 7);                 // slide 0, design 8, content 7
//   await VB.saveEmailSignup('a@b.com', 'Name');  // capture email
//   VB.trackPageView(3);                          // fire-and-forget
// ============================================================

(function () {
    'use strict';

    // ── Supabase client singleton ───────────────────────────
    let supabaseClient = null;

    // ── In-memory state ─────────────────────────────────────
    let visitorDbId = null;          // UUID of the visitor row in Supabase
    let currentSlideTracker = null;  // { slideIndex, enterTime }
    let lastMascotEventTime = 0;     // timestamp of last mascot event (ms)

    const MASCOT_DEBOUNCE_MS = 3000; // 3-second debounce for mascot events
    const LOCAL_STORAGE_KEY = 'vb_visitor_id'; // localStorage fingerprint key

    // ────────────────────────────────────────────────────────
    // Helpers
    // ────────────────────────────────────────────────────────

    /**
     * Generate a RFC-4122 v4 UUID using crypto.randomUUID when
     * available, with a Math.random fallback for older browsers.
     */
    function generateUUID() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        // Fallback: pseudo-random UUID v4
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Retrieve or create the visitor fingerprint from localStorage.
     * @returns {string} A stable UUID representing this browser.
     */
    function getOrCreateFingerprint() {
        let fp = null;
        try {
            fp = localStorage.getItem(LOCAL_STORAGE_KEY);
        } catch (_) {
            // localStorage may be blocked (private browsing, etc.)
        }
        if (!fp) {
            fp = generateUUID();
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, fp);
            } catch (_) {
                // Silently continue — fingerprint lives in memory only
            }
        }
        return fp;
    }

    /**
     * Resolve the slide name from VIBE_CONFIG for a given index.
     * @param {number} index
     * @returns {string|null}
     */
    function slideName(index) {
        if (
            typeof VIBE_CONFIG !== 'undefined' &&
            Array.isArray(VIBE_CONFIG.SLIDE_NAMES) &&
            VIBE_CONFIG.SLIDE_NAMES[index]
        ) {
            return VIBE_CONFIG.SLIDE_NAMES[index];
        }
        return null;
    }

    // ────────────────────────────────────────────────────────
    // Public API — exposed as window.VB
    // ────────────────────────────────────────────────────────
    const VB = {};

    // ── isConfigured ────────────────────────────────────────
    /**
     * Returns true when the user has replaced the placeholder
     * Supabase URL in config.js with a real project URL.
     */
    VB.isConfigured = function () {
        return (
            typeof VIBE_CONFIG !== 'undefined' &&
            typeof VIBE_CONFIG.SUPABASE_URL === 'string' &&
            VIBE_CONFIG.SUPABASE_URL !== '' &&
            VIBE_CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE'
        );
    };

    // ── init ────────────────────────────────────────────────
    /**
     * Initialise the Supabase client and upsert the visitor
     * record.  Call once on page load.
     *
     * @returns {Promise<{success: boolean, error: string|null}>}
     */
    VB.init = async function () {
        // Skip silently when not configured
        if (!VB.isConfigured()) {
            console.info('[VB] Supabase not configured — running in offline mode.');
            return { success: false, error: 'not_configured' };
        }

        try {
            // Initialise the Supabase client (once)
            if (!supabaseClient) {
                const { createClient } = supabase; // global from CDN
                supabaseClient = createClient(
                    VIBE_CONFIG.SUPABASE_URL,
                    VIBE_CONFIG.SUPABASE_ANON_KEY
                );
            }

            const fingerprint = getOrCreateFingerprint();

            // Attempt to find existing visitor by fingerprint
            const { data: existing, error: selectErr } = await supabaseClient
                .from('visitors')
                .select('id')
                .eq('fingerprint', fingerprint)
                .maybeSingle();

            if (selectErr) {
                console.error('[VB] Visitor lookup failed:', selectErr.message);
                return { success: false, error: selectErr.message };
            }

            if (existing) {
                // Returning visitor — update last_seen
                visitorDbId = existing.id;
                await supabaseClient
                    .from('visitors')
                    .update({ last_seen: new Date().toISOString() })
                    .eq('id', visitorDbId);
            } else {
                // New visitor — insert
                const { data: inserted, error: insertErr } = await supabaseClient
                    .from('visitors')
                    .insert({
                        fingerprint: fingerprint,
                        user_agent: navigator.userAgent || null,
                        ip_hint: null // can be enriched server-side if needed
                    })
                    .select('id')
                    .single();

                if (insertErr) {
                    console.error('[VB] Visitor insert failed:', insertErr.message);
                    return { success: false, error: insertErr.message };
                }
                visitorDbId = inserted.id;
            }

            console.info('[VB] Initialised — visitor:', visitorDbId);
            return { success: true, error: null };
        } catch (err) {
            console.error('[VB] init() error:', err);
            return { success: false, error: err.message };
        }
    };

    // ── saveRating ──────────────────────────────────────────
    /**
     * Upsert a design + content rating for a specific slide.
     * If the visitor has already rated this slide the existing
     * row is overwritten.
     *
     * @param {number} slideIndex   0-9
     * @param {number} designRating 1-10
     * @param {number} contentRating 1-10
     * @returns {Promise<{success: boolean, error: string|null}>}
     */
    VB.saveRating = async function (slideIndex, designRating, contentRating) {
        if (!VB.isConfigured() || !supabaseClient) {
            return { success: false, error: 'not_configured' };
        }
        if (!visitorDbId) {
            return { success: false, error: 'visitor_not_initialised' };
        }

        try {
            const { error } = await supabaseClient
                .from('ratings')
                .upsert(
                    {
                        visitor_id: visitorDbId,
                        slide_index: slideIndex,
                        slide_name: slideName(slideIndex),
                        design_rating: designRating,
                        content_rating: contentRating
                    },
                    { onConflict: 'visitor_id,slide_index' }
                );

            if (error) {
                console.error('[VB] saveRating error:', error.message);
                return { success: false, error: error.message };
            }

            console.info(`[VB] Rating saved — slide ${slideIndex}: design=${designRating}, content=${contentRating}`);
            return { success: true, error: null };
        } catch (err) {
            console.error('[VB] saveRating() error:', err);
            return { success: false, error: err.message };
        }
    };

    // ── saveEmailSignup ─────────────────────────────────────
    /**
     * Insert an email signup. Duplicates are caught gracefully.
     *
     * @param {string}      email
     * @param {string|null} name
     * @param {number|null} sourceSlide  Index of the slide the signup came from
     * @returns {Promise<{success: boolean, error: string|null, duplicate: boolean}>}
     */
    VB.saveEmailSignup = async function (email, name, sourceSlide) {
        if (!VB.isConfigured() || !supabaseClient) {
            return { success: false, error: 'not_configured', duplicate: false };
        }

        try {
            const { error } = await supabaseClient
                .from('email_signups')
                .insert({
                    email: email,
                    name: name || null,
                    source_slide: typeof sourceSlide === 'number' ? sourceSlide : null,
                    referral_source: document.referrer || null
                });

            if (error) {
                // Supabase returns code 23505 for unique constraint violations
                const isDuplicate = error.code === '23505';
                if (isDuplicate) {
                    console.info('[VB] Email already signed up:', email);
                    return { success: false, error: 'duplicate_email', duplicate: true };
                }
                console.error('[VB] saveEmailSignup error:', error.message);
                return { success: false, error: error.message, duplicate: false };
            }

            console.info('[VB] Email signup saved:', email);
            return { success: true, error: null, duplicate: false };
        } catch (err) {
            console.error('[VB] saveEmailSignup() error:', err);
            return { success: false, error: err.message, duplicate: false };
        }
    };

    // ── saveFeedback ────────────────────────────────────────
    /**
     * Save the end-of-session feedback form.
     *
     * @param {Object} data
     * @param {number|null}  data.bestPage
     * @param {string|null}  data.bestPageName
     * @param {string|null}  data.suggestions
     * @param {string|null}  data.questions
     * @param {string|null}  data.socialLink
     * @returns {Promise<{success: boolean, error: string|null}>}
     */
    VB.saveFeedback = async function (data) {
        if (!VB.isConfigured() || !supabaseClient) {
            return { success: false, error: 'not_configured' };
        }

        try {
            const payload = {
                visitor_id: visitorDbId || null,
                email: data.email || null,
                best_page: typeof data.bestPage === 'number' ? data.bestPage : null,
                best_page_name: data.bestPageName || null,
                suggestions: data.suggestions || null,
                questions: data.questions || null,
                social_link: data.socialLink || null
            };

            const { error } = await supabaseClient
                .from('feedback')
                .insert(payload);

            if (error) {
                console.error('[VB] saveFeedback error:', error.message);
                return { success: false, error: error.message };
            }

            console.info('[VB] Feedback saved.');
            return { success: true, error: null };
        } catch (err) {
            console.error('[VB] saveFeedback() error:', err);
            return { success: false, error: err.message };
        }
    };

    // ── trackPageView ───────────────────────────────────────
    /**
     * Track a slide view.  Call each time the user navigates
     * to a new slide.  The previous slide's time-on-page is
     * calculated and persisted automatically.
     *
     * This function is fire-and-forget — it does not block UI.
     *
     * @param {number} slideIndex  0-9
     */
    VB.trackPageView = function (slideIndex) {
        if (!VB.isConfigured() || !supabaseClient || !visitorDbId) return;

        // ── Finalise previous slide ─────────────────────────
        if (currentSlideTracker) {
            const secondsSpent = Math.round((Date.now() - currentSlideTracker.enterTime) / 1000);
            // Fire-and-forget: persist time spent on previous slide
            supabaseClient
                .from('page_views')
                .insert({
                    visitor_id: visitorDbId,
                    slide_index: currentSlideTracker.slideIndex,
                    time_spent_seconds: secondsSpent
                })
                .then(({ error }) => {
                    if (error) console.error('[VB] trackPageView insert error:', error.message);
                });
        }

        // ── Start tracking the new slide ────────────────────
        currentSlideTracker = {
            slideIndex: slideIndex,
            enterTime: Date.now()
        };
    };

    // ── trackMascotEvent ────────────────────────────────────
    /**
     * Log a mascot interaction (click, mood change, etc.).
     * Debounced: only one event every 3 seconds to avoid spam.
     *
     * Fire-and-forget — never blocks the UI.
     *
     * @param {string}      eventType   e.g. 'click', 'mood_change', 'hover'
     * @param {string|null} mood        e.g. 'happy', 'thinking', 'excited'
     * @param {number|null} slideIndex
     */
    VB.trackMascotEvent = function (eventType, mood, slideIndex) {
        if (!VB.isConfigured() || !supabaseClient || !visitorDbId) return;

        // Debounce: enforce minimum interval between events
        const now = Date.now();
        if (now - lastMascotEventTime < MASCOT_DEBOUNCE_MS) return;
        lastMascotEventTime = now;

        supabaseClient
            .from('mascot_events')
            .insert({
                visitor_id: visitorDbId,
                event_type: eventType,
                mood: mood || null,
                slide_index: typeof slideIndex === 'number' ? slideIndex : null
            })
            .then(({ error }) => {
                if (error) console.error('[VB] trackMascotEvent error:', error.message);
            });
    };

    // ── Flush on page unload ────────────────────────────────
    // Persist the last slide's time-on-page when the user
    // leaves.  Uses sendBeacon for reliability when available.
    function flushLastPageView() {
        if (!currentSlideTracker || !VB.isConfigured() || !supabaseClient || !visitorDbId) return;

        const secondsSpent = Math.round((Date.now() - currentSlideTracker.enterTime) / 1000);
        const payload = {
            visitor_id: visitorDbId,
            slide_index: currentSlideTracker.slideIndex,
            time_spent_seconds: secondsSpent
        };

        // Best-effort: try sendBeacon first; fall back to fetch
        try {
            const url = `${VIBE_CONFIG.SUPABASE_URL}/rest/v1/page_views`;
            const headers = {
                'Content-Type': 'application/json',
                apikey: VIBE_CONFIG.SUPABASE_ANON_KEY,
                Authorization: `Bearer ${VIBE_CONFIG.SUPABASE_ANON_KEY}`
            };

            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                // sendBeacon can't set custom headers, so fall back to fetch keepalive
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(() => {});
            } else {
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(() => {});
            }
        } catch (_) {
            // Silently fail — we're unloading
        }

        currentSlideTracker = null;
    }

    window.addEventListener('beforeunload', flushLastPageView);
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') flushLastPageView();
    });

    // ── Expose on window ────────────────────────────────────
    window.VB = VB;
})();
