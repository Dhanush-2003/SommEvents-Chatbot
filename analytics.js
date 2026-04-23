/* =========================================================
   SommEvents – Analytics Tracking Module
   =========================================================
   Lightweight client-side tracking for conversation metrics.

   Responsibilities:
   - Maintain a per-page-session object in sessionStorage so
     data survives chat resets but not full page reloads.
   - Persist completed sessions, leads, and drop-offs to
     Supabase using the anon (insert-only) key.
   - Fire escalation callbacks when engagement thresholds are
     crossed (repeated pricing asks, FAQ loops without a lead).

   Public API:
     trackNode(nodeKey, tag)          – call on every node render
     trackFAQSearch(query)            – call on every FAQ search
     trackHandoff(reason)             – call when routing to human
     trackLead(data)                  – call on lead form submit
     trackRating(value)               – call on star-rating submit
     trackMessage(who)                – call on every message added
     trackDropoff(nodeKey, context)   – call when the panel closes
     onEscalation(callback)           – register an escalation handler
     resetSession()                   – start a fresh session object
     getSession()                     – read-only snapshot of session
     getHistory()                     – array of archived sessions
     getDropoffs()                    – array of recorded drop-offs
   ========================================================= */

const Analytics = (() => {
  // ---------------------------------------------------------------------------
  // Supabase client
  // The anon key is safe to expose client-side because RLS restricts the anon
  // role to INSERT-only (see supabase/migrations/..._enable_rls_policies.sql).
  // ---------------------------------------------------------------------------
  const supabaseUrl = 'https://sxaisrcdheafiqerqwyu.supabase.co';
  const supabaseKey = 'sb_publishable_CGGrMdFyYFKYukpHoxXNhg_NCU7Q92j';

  // Guard: Supabase JS SDK must be loaded via CDN before this script.
  const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

  // sessionStorage key – survives chat open/close within the same tab
  const SESSION_KEY = "somm_session";
  // localStorage key – accumulates up to 50 completed sessions across tabs
  const HISTORY_KEY = "somm_analytics";

  /* ---- Session state ---- */
  /**
   * @typedef {Object} SessionState
   * @property {string}   id                 - Unique session ID ("s_" + timestamp + random)
   * @property {number}   startedAt          - Unix ms when the session was created
   * @property {string[]} path               - Ordered list of nodeKeys visited
   * @property {string[]} tags               - Analytics tags collected along the path
   * @property {Array}    faqSearches        - [{query, at}] user search terms with timestamps
   * @property {number}   pricingAsks        - Number of pricing-related nodes visited
   * @property {boolean}  handoffTriggered   - Whether human escalation was triggered
   * @property {string|null} handoffReason   - Reason string passed to trackHandoff()
   * @property {boolean}  leadCaptured       - Whether the lead-capture form was submitted
   * @property {Object|null} leadData        - Submitted lead payload
   * @property {number|null} rating          - 1–5 star rating (set on conversation end)
   * @property {number}   messageCount       - Total messages (bot + user) in this session
   * @property {number}   conversationLength - Duration in seconds (set on rating)
   */

  /** @type {SessionState} */
  let session = {
    id: generateId(),
    startedAt: Date.now(),
    path: [],            // nodeKey sequence visited
    tags: [],            // intent tags collected
    faqSearches: [],     // user search terms
    pricingAsks: 0,      // count pricing-related interactions
    handoffTriggered: false,
    handoffReason: null,
    leadCaptured: false,
    leadData: null,
    rating: null,
    messageCount: 0,
    conversationLength: 0  // seconds; computed at rating time
  };

  /* ======================================================
     HELPERS
     ====================================================== */

  /**
   * Generate a collision-resistant session ID.
   * Combines the current timestamp (base-36) with 6 random chars.
   * @returns {string}
   */
  function generateId() {
    return "s_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /**
   * Persist the current session to sessionStorage.
   * Failures are swallowed — analytics should never break the UI.
   */
  function save() {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) { /* silent */ }
  }

  /**
   * Restore a previous session from sessionStorage (e.g. after chat panel reopens).
   * If no stored session exists, the default session object is kept.
   */
  function loadSession() {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) session = JSON.parse(stored);
    } catch (e) { /* silent */ }
  }

  /* ======================================================
     TRACKING METHODS
     ====================================================== */

  /**
   * Record a conversation node visit.
   * Called by chatbot.js every time a new node is rendered.
   *
   * @param {string} nodeKey - The knowledge.js key of the rendered node
   * @param {string} [tag]   - Optional analytics tag (e.g. "Sales_Event")
   */
  function trackNode(nodeKey, tag) {
    session.path.push(nodeKey);
    if (tag) session.tags.push(tag);
    // Increment total message count — one message per node render
    session.messageCount++;

    // Detect pricing-interest visits for escalation threshold
    if (nodeKey.includes("pricing") || nodeKey.includes("faq_p")) {
      session.pricingAsks++;
    }

    save();
    // Check if any escalation threshold has been crossed after each node
    checkEscalationTriggers();
  }

  /**
   * Record a free-text or dedicated FAQ bar search query.
   *
   * @param {string} query - Raw search string entered by the user
   */
  function trackFAQSearch(query) {
    session.faqSearches.push({ query, at: Date.now() });
    save();
  }

  /**
   * Mark the session as handed off to a human agent.
   * Once triggered, escalation callbacks will no longer fire for this session.
   *
   * @param {string} reason - Human-readable reason code (e.g. "user_requested", "urgency_detected")
   */
  function trackHandoff(reason) {
    session.handoffTriggered = true;
    session.handoffReason = reason;
    save();
    log("HANDOFF", reason);
  }

  /**
   * Record a submitted lead and insert it into the Supabase `leads` table.
   *
   * @param {{ name: string, email: string, phone?: string, consultationTime?: string }} data
   */
  function trackLead(data) {
    session.leadCaptured = true;
    // Spread to avoid mutating the caller's object, then stamp with capture time
    session.leadData = { ...data, capturedAt: Date.now() };
    save();

    // Persist to Supabase — fire-and-forget (failures logged, not surfaced to user)
    if (supabase) {
      supabase.from('leads').insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        consultation_time: data.consultationTime,
        captured_at: new Date(data.capturedAt || Date.now()).toISOString(),
        context: {
          path: session.path,
          tags: session.tags,
          messageCount: session.messageCount,
          duration: Math.round((Date.now() - session.startedAt) / 1000)
        }
      }]).then(({ error }) => {
        if (error) log('SUPABASE_ERROR', error);
      });
    }

    log("LEAD_CAPTURED", data);
  }

  /**
   * Record the user's star rating and archive the full session to Supabase.
   * This is the "conversation end" event — called once per session at most.
   *
   * @param {number} value - Star rating 1–5
   */
  function trackRating(value) {
    session.rating = value;
    // Compute total conversation duration now that we have a definitive end time
    session.conversationLength = Math.round((Date.now() - session.startedAt) / 1000);
    save();

    // Archive the completed session row to Supabase
    if (supabase) {
      supabase.from('sessions').insert([{
        id: session.id,
        started_at: new Date(session.startedAt).toISOString(),
        path: session.path,
        tags: session.tags,
        faq_searches: session.faqSearches,
        pricing_asks: session.pricingAsks,
        handoff_triggered: session.handoffTriggered,
        handoff_reason: session.handoffReason,
        lead_captured: session.leadCaptured,
        lead_data: session.leadData,
        rating: session.rating,
        message_count: session.messageCount,
        conversation_length: session.conversationLength
      }]).then(({ error }) => {
        if (error) log('SUPABASE_ERROR', error);
      });
    }

    log("RATING", value);
    // Also archive locally so the history is available offline / without Supabase
    archiveSession();
  }

  /**
   * Increment the message counter.
   * Called for every bot and user message added to the DOM.
   * The `who` parameter is accepted for API symmetry with other track* methods
   * and may be used in future to separate bot vs. user message counts.
   *
   * @param {"bot"|"user"} who
   */
  function trackMessage(who) {
    session.messageCount++;
    save();
  }

  /* ======================================================
     ESCALATION DETECTION
     ====================================================== */

  /** @type {Function[]} Registered escalation callback functions */
  let escalationCallbacks = [];

  /**
   * Register a callback to fire when an escalation threshold is crossed.
   * Multiple callbacks can be registered; all will be called.
   *
   * @param {function(string): void} callback - Receives the escalation reason string
   */
  function onEscalation(callback) {
    escalationCallbacks.push(callback);
  }

  /**
   * Evaluate escalation thresholds after every node visit.
   * Thresholds:
   *   - 3+ pricing nodes visited  → "repeated_pricing"
   *   - 3+ FAQ nodes without lead → "faq_loop_no_conversion"
   *
   * Only fires once per session (guarded by handoffTriggered).
   */
  function checkEscalationTriggers() {
    let reason = null;

    // Threshold 1: user repeatedly browses pricing without booking
    if (session.pricingAsks >= 3) {
      reason = "repeated_pricing";
    }

    // Threshold 2: user reads many FAQs but hasn't left their details
    const faqViews = session.path.filter(p => p.startsWith("faq_")).length;
    if (faqViews >= 3 && !session.leadCaptured) {
      reason = "faq_loop_no_conversion";
    }

    // Avoid repeated escalation calls within the same session
    if (reason && !session.handoffTriggered) {
      escalationCallbacks.forEach(cb => cb(reason));
    }
  }

  /* ======================================================
     LOCAL ARCHIVE
     ====================================================== */

  /**
   * Push the current session into the localStorage history ring-buffer.
   * Keeps the most recent 50 sessions; older entries are dropped (FIFO).
   */
  function archiveSession() {
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      history.push({ ...session });
      // Limit storage footprint — drop the oldest record when over capacity
      if (history.length > 50) history.shift();
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) { /* silent */ }
  }

  /* ---- Drop-off tracking ---- */

  // Separate localStorage key so drop-offs don't interfere with session history
  const DROPOFF_KEY = "somm_dropoffs";

  /**
   * Record a mid-conversation exit and insert a row into the Supabase `dropoffs` table.
   * Called whenever the chat panel is closed before the conversation ends naturally.
   *
   * @param {string} currentNodeKey - The node the user was on when they left
   * @param {Object} [context={}]   - Extra metadata (e.g. { reason: "user_closed" })
   */
  function trackDropoff(currentNodeKey, context = {}) {
    const dropoff = {
      sessionId: session.id,
      droppedAtNode: currentNodeKey,
      droppedAt: Date.now(),
      messageCount: session.messageCount,
      conversationLength: Math.round((Date.now() - session.startedAt) / 1000),
      pathTaken: session.path,
      tags: session.tags,
      leadCaptured: session.leadCaptured,
      context: context
    };

    // Store locally first as a fallback in case the Supabase insert fails
    try {
      const dropoffs = JSON.parse(localStorage.getItem(DROPOFF_KEY) || "[]");
      dropoffs.push(dropoff);
      // Cap at 100 records to avoid unbounded localStorage growth
      if (dropoffs.length > 100) dropoffs.shift();
      localStorage.setItem(DROPOFF_KEY, JSON.stringify(dropoffs));
    } catch (e) { /* silent */ }

    // Persist to Supabase asynchronously
    if (supabase) {
      supabase.from('dropoffs').insert([{
        session_id: dropoff.sessionId,
        dropped_at_node: dropoff.droppedAtNode,
        dropped_at: new Date(dropoff.droppedAt).toISOString(),
        message_count: dropoff.messageCount,
        conversation_length: dropoff.conversationLength,
        path_taken: dropoff.pathTaken,
        tags: dropoff.tags,
        lead_captured: dropoff.leadCaptured,
        context: dropoff.context
      }]).then(({ error }) => {
        if (error) log('SUPABASE_ERROR', error);
      });
    }

    log("DROPOFF", { node: currentNodeKey, context });
  }

  /* ======================================================
     SESSION RESET
     ====================================================== */

  /**
   * Discard the current session and create a fresh one.
   * Called when the user clicks the reset button in the chat header.
   */
  function resetSession() {
    session = {
      id: generateId(),
      startedAt: Date.now(),
      path: [],
      tags: [],
      faqSearches: [],
      pricingAsks: 0,
      handoffTriggered: false,
      handoffReason: null,
      leadCaptured: false,
      leadData: null,
      rating: null,
      messageCount: 0,
      conversationLength: 0
    };
    save();
  }

  /* ======================================================
     LOGGING
     ====================================================== */

  /**
   * Write a labelled analytics event to the browser console.
   * Intentionally verbose to aid debugging; no-op in environments without console.
   *
   * @param {string} event - Event name (e.g. "HANDOFF", "LEAD_CAPTURED")
   * @param {*}      [data] - Optional payload to log alongside the event name
   */
  function log(event, data) {
    if (typeof console !== "undefined") {
      console.log(`[SommEvents Analytics] ${event}`, data || "");
    }
  }

  /* ======================================================
     GETTERS (read-only snapshots)
     ====================================================== */

  /** @returns {SessionState} Shallow copy of the current session state */
  function getSession() { return { ...session }; }

  /** @returns {SessionState[]} All archived completed sessions from localStorage */
  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
  }

  /** @returns {Object[]} All recorded drop-off events from localStorage */
  function getDropoffs() {
    try { return JSON.parse(localStorage.getItem(DROPOFF_KEY) || "[]"); } catch { return []; }
  }

  /* ---- Init ---- */
  // Restore any existing in-progress session from this browser tab
  loadSession();

  /* ---- Public API ---- */
  return {
    trackNode,
    trackFAQSearch,
    trackHandoff,
    trackLead,
    trackRating,
    trackMessage,
    trackDropoff,
    onEscalation,
    resetSession,
    getSession,
    getHistory,
    getDropoffs,
    log
  };
})();
