/* =========================================================
   SommEvents – Analytics Tracking Module
   Lightweight client-side tracking for conversation metrics.
   ========================================================= */

const Analytics = (() => {
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
    log("LEAD_CAPTURED", data);
  }

  function trackRating(value) {
    session.rating = value;
    session.conversationLength = Math.round((Date.now() - session.startedAt) / 1000);
    save();
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

  /* ---- Init ---- */
  loadSession();

  return {
    trackNode,
    trackFAQSearch,
    trackHandoff,
    trackLead,
    trackRating,
    trackMessage,
    onEscalation,
    resetSession,
    getSession,
    getHistory,
    log
  };
})();
