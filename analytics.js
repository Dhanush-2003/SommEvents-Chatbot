/* =========================================================
   SommEvents – Analytics Tracking Module
   Lightweight client-side tracking for conversation metrics.
   ========================================================= */

const Analytics = (() => {
  // Initialize Supabase client (remote project)
  const supabaseUrl = 'https://sxaisrcdheafiqerqwyu.supabase.co';
  const supabaseKey = 'sb_publishable_CGGrMdFyYFKYukpHoxXNhg_NCU7Q92j';
  const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

  const SESSION_KEY = "somm_session";
  const HISTORY_KEY = "somm_analytics";

  /* ---- Session state ---- */
  let session = {
    id: generateId(),
    startedAt: Date.now(),
    path: [],            // nodeKey sequence
    tags: [],            // intent tags
    faqSearches: [],     // user search terms
    pricingAsks: 0,      // count pricing-related interactions
    handoffTriggered: false,
    handoffReason: null,
    leadCaptured: false,
    leadData: null,
    rating: null,
    messageCount: 0,
    conversationLength: 0  // seconds
  };

  /* ---- Helpers ---- */
  function generateId() {
    return "s_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function save() {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) { /* silent */ }
  }

  function loadSession() {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) session = JSON.parse(stored);
    } catch (e) { /* silent */ }
  }

  /* ---- Tracking methods ---- */

  function trackNode(nodeKey, tag) {
    session.path.push(nodeKey);
    if (tag) session.tags.push(tag);
    session.messageCount++;

    // Count pricing interactions
    if (nodeKey.includes("pricing") || nodeKey.includes("faq_p")) {
      session.pricingAsks++;
    }

    save();
    checkEscalationTriggers();
  }

  function trackFAQSearch(query) {
    session.faqSearches.push({ query, at: Date.now() });
    save();
  }

  function trackHandoff(reason) {
    session.handoffTriggered = true;
    session.handoffReason = reason;
    save();
    log("HANDOFF", reason);
  }

  function trackLead(data) {
    session.leadCaptured = true;
    session.leadData = { ...data, capturedAt: Date.now() };
    save();

    // Send to Supabase
    if (supabase) {
      supabase.from('leads').insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        consultation_time: data.consultationTime,
        captured_at: new Date(data.capturedAt || Date.now()).toISOString()
      }]).then(({ error }) => {
        if (error) log('SUPABASE_ERROR', error);
      });
    }

    log("LEAD_CAPTURED", data);
  }

  function trackRating(value) {
    session.rating = value;
    session.conversationLength = Math.round((Date.now() - session.startedAt) / 1000);
    save();

    // Archive session to Supabase
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
    archiveSession();
  }

  function trackMessage(who) {
    session.messageCount++;
    save();
  }

  /* ---- Escalation detection ---- */
  let escalationCallbacks = [];

  function onEscalation(callback) {
    escalationCallbacks.push(callback);
  }

  function checkEscalationTriggers() {
    let reason = null;

    // Pricing asked 3+ times
    if (session.pricingAsks >= 3) {
      reason = "repeated_pricing";
    }

    // 3+ FAQ views without conversion
    const faqViews = session.path.filter(p => p.startsWith("faq_")).length;
    if (faqViews >= 3 && !session.leadCaptured) {
      reason = "faq_loop_no_conversion";
    }

    if (reason && !session.handoffTriggered) {
      escalationCallbacks.forEach(cb => cb(reason));
    }
  }

  /* ---- Archive completed session ---- */
  function archiveSession() {
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      history.push({ ...session });
      // Keep last 50 sessions
      if (history.length > 50) history.shift();
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) { /* silent */ }
  }

  /* ---- Drop-off tracking ---- */
  const DROPOFF_KEY = "somm_dropoffs";

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

    // Store locally (fallback)
    try {
      const dropoffs = JSON.parse(localStorage.getItem(DROPOFF_KEY) || "[]");
      dropoffs.push(dropoff);
      if (dropoffs.length > 100) dropoffs.shift();
      localStorage.setItem(DROPOFF_KEY, JSON.stringify(dropoffs));
    } catch (e) { /* silent */ }

    // Send to Supabase
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

  /* ---- Session reset ---- */
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

  /* ---- Console logging (dev) ---- */
  function log(event, data) {
    if (typeof console !== "undefined") {
      console.log(`[SommEvents Analytics] ${event}`, data || "");
    }
  }

  /* ---- Getters ---- */
  function getSession() { return { ...session }; }
  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
  }
  function getDropoffs() {
    try { return JSON.parse(localStorage.getItem(DROPOFF_KEY) || "[]"); } catch { return []; }
  }

  /* ---- Init ---- */
  loadSession();

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
