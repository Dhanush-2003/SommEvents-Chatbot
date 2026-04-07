/* =========================================================
   SommEvents – Chatbot Logic (State Machine)
   =========================================================
   Orchestrates conversation flow, routing, and escalation.

   Architecture:
   - Reads conversation nodes from knowledge.js
   - Delegates all DOM rendering to ui.js
   - Delegates all analytics/persistence to analytics.js
   - Wrapped in an IIFE to avoid polluting the global scope

   State model:
   - `currentNodeKey`       – which knowledge.js node is active
   - `nodeHistory`          – stack enabling the Back button
   - `conversationHistory`  – full message log (bot + user)
   ========================================================= */

(function () {
  "use strict";

  /* ---- Element refs ---- */
  // Pulled via UI.$ so all element lookups go through the same cache
  const bubble   = UI.$("chat-bubble");
  const panel    = UI.$("chat-panel");
  const closeBtn = UI.$("chat-close");
  const resetBtn = UI.$("chat-reset");
  const backBtn  = UI.$("chat-back");
  const inputEl  = UI.$("chat-input");
  const sendBtn  = UI.$("chat-send");
  const faqSearch       = UI.$("faq-search");
  const faqSearchClose  = UI.$("faq-search-close");
  const faqSearchToggle = UI.$("faq-search-toggle");
  const searchWrapper   = UI.$("search-wrapper");
  const unreadBadge     = UI.$("unread-badge");

  /* ---- State ---- */
  let currentNodeKey = "mainMenu";
  /** @type {Array<{text: string, who: string, at: number}>} */
  let conversationHistory = [];
  /**
   * Navigation stack. Each entry records which node was rendered and
   * how many messages were in conversationHistory at that point, so
   * the Back button can restore the exact prior state.
   * @type {Array<{nodeKey: string, historyLength: number}>}
   */
  let nodeHistory = [];

  // Delay between showing the typing indicator and displaying the bot message
  const TYPING_DELAY = 500; // ms

  // ---- Intent keyword lists used by the free-text input handler ----

  // Triggers immediate escalation to the human handoff node
  const URGENCY_KEYWORDS = ["urgent", "asap", "immediately", "rush", "last minute", "tomorrow", "next week"];
  // Triggers routing to the human contact node
  const HUMAN_KEYWORDS = ["talk", "human", "person", "someone", "agent", "call", "speak", "representative"];
  // Triggers an empathetic response + immediate escalation
  const FRUSTRATION_KEYWORDS = ["confused", "frustrat", "don't understand", "doesn't work", "not helpful", "terrible", "horrible", "waste", "stupid"];

  /* ======================================================
     CONVERSATION HISTORY (SESSION PERSISTENCE)
     ====================================================== */

  /**
   * Persist the current message log to sessionStorage.
   * Allows history to survive chat panel close/reopen within the same tab.
   */
  function saveHistory() {
    try { sessionStorage.setItem("somm_history", JSON.stringify(conversationHistory)); } catch (e) { /* silent */ }
  }

  /**
   * Restore the message log from sessionStorage if it exists.
   */
  function loadHistory() {
    try {
      const h = sessionStorage.getItem("somm_history");
      if (h) conversationHistory = JSON.parse(h);
    } catch (e) { /* silent */ }
  }

  /* ======================================================
     BACK BUTTON
     ====================================================== */

  /**
   * Enable or disable the Back button based on navigation stack depth.
   * The button is disabled when there is nothing to go back to (stack ≤ 1).
   */
  function updateBackButton() {
    if (!backBtn) return;
    backBtn.disabled = nodeHistory.length <= 1;
  }

  /**
   * Remove messages from the DOM and conversationHistory that were added
   * after a given history length, effectively undoing them visually.
   *
   * @param {number} length - Target conversationHistory.length to revert to
   */
  function trimToHistoryLength(length) {
    while (conversationHistory.length > length) {
      conversationHistory.pop();
      // Keep the DOM in sync: remove the last rendered message element
      if (UI.messagesEl.lastElementChild) UI.messagesEl.removeChild(UI.messagesEl.lastElementChild);
    }
    saveHistory();
  }

  /**
   * Navigate to the previous node in the history stack.
   * Pops the current entry, restores the message thread to the prior snapshot,
   * then re-renders the actions for the previous node without replaying its message.
   */
  function goBack() {
    if (nodeHistory.length <= 1) return;

    // Drop current node state
    nodeHistory.pop();
    const prev = nodeHistory[nodeHistory.length - 1];

    // Restore messages to the state for the previous node
    trimToHistoryLength(prev.historyLength);

    currentNodeKey = prev.nodeKey;
    updateBackButton();

    // Rebuild actions for the previous node (does not re-send bot message)
    UI.clearActions();
    const node = knowledge[currentNodeKey];
    if (node) renderNodeActions(node, currentNodeKey);
  }

  /* ======================================================
     OPEN / CLOSE
     ====================================================== */

  /**
   * Open the chat panel, restore or start a conversation, and focus the input.
   */
  /* ---- Welcome nudge ---- */
  const nudge = UI.$("welcome-nudge");
  const nudgeCloseBtn = UI.$("nudge-close");

  function dismissNudge() {
    if (nudge) nudge.classList.add("hidden");
    sessionStorage.setItem("somm_nudge_shown", "1");
  }

  if (nudge && nudgeCloseBtn && !sessionStorage.getItem("somm_nudge_shown")) {
    setTimeout(() => {
      if (panel.classList.contains("hidden")) nudge.classList.remove("hidden");
    }, 5000);
    nudgeCloseBtn.addEventListener("click", dismissNudge);
  }

  function openChat() {
    panel.classList.remove("hidden");
    panel.classList.remove("closing");
    bubble.style.display = "none";
    dismissNudge();
    if (unreadBadge) unreadBadge.classList.add("hidden");

    if (UI.messagesEl.childElementCount === 0) {
      // Load previous history or start fresh
      loadHistory();
      if (conversationHistory.length > 0) {
        replayHistory();
      } else {
        renderNode("mainMenu");
      }
    }
    updateBackButton();
    inputEl.focus();
  }

  /**
   * Close the chat panel with a CSS transition.
   * Records a drop-off event so we can analyse which nodes users leave from.
   */
  function closeChat() {
    // Track drop-off point before closing
    Analytics.trackDropoff(currentNodeKey, { reason: "user_closed" });

    panel.classList.add("closing");
    // Wait for the CSS transition to finish before hiding the element
    setTimeout(() => {
      panel.classList.add("hidden");
      panel.classList.remove("closing");
      bubble.style.display = "flex";
    }, 200);
  }

  /**
   * Reset the conversation to a blank state and return to the main menu.
   * Clears the DOM, clears sessionStorage, and resets the analytics session.
   */
  function resetChat() {
    UI.messagesEl.innerHTML = "";
    UI.clearActions();
    UI.hideRating();
    conversationHistory = [];
    nodeHistory = [];
    saveHistory();
    Analytics.resetSession();
    currentNodeKey = "mainMenu";
    updateBackButton();
    renderNode("mainMenu");
  }

  /* ======================================================
     SESSION HISTORY REPLAY
     ====================================================== */

  /**
   * Re-render all previously recorded messages into the DOM after
   * the chat panel is reopened (without triggering analytics again).
   * Also rebuilds the actions area for the current node.
   */
  function replayHistory() {
    conversationHistory.forEach(entry => {
      UI.addMessage(entry.text, entry.who);
    });
    // Ensure back button state is correct and actions are rendered
    const node = knowledge[currentNodeKey];
    if (node) {
      renderNodeActions(node, currentNodeKey);
    }
    // Seed the navigation stack with a single entry so Back is initially disabled
    nodeHistory = [{ nodeKey: currentNodeKey, historyLength: conversationHistory.length }];
    updateBackButton();
  }

  /* ======================================================
     CORE RENDER
     ====================================================== */

  /**
   * Navigate to a knowledge.js node: show typing, display the bot message,
   * then render the appropriate action controls.
   *
   * @param {string} nodeKey            - Key in the `knowledge` object to render
   * @param {{ skipHistory?: boolean }} [opts]
   *   skipHistory: true suppresses pushing to nodeHistory (used by goBack)
   */
  function renderNode(nodeKey, { skipHistory = false } = {}) {
    const node = knowledge[nodeKey];

    currentNodeKey = nodeKey;
    updateBackButton();

    UI.clearActions();

    if (!node) {
      // Unknown node key — gracefully fall back rather than breaking the flow
      addBotMessage("I want to make sure I help you properly. Let me take you back to the main menu.");
      renderNode("mainMenu");
      return;
    }

    // Track in analytics
    Analytics.trackNode(nodeKey, node.tag);

    // Show typing indicator, then reveal the message after TYPING_DELAY
    UI.showTyping();
    setTimeout(() => {
      UI.hideTyping();
      addBotMessage(node.message, { image: node.image, imageAlt: node.imageAlt });
      renderNodeActions(node, nodeKey);

      if (!skipHistory) {
        // Push to navigation stack — deduplicate consecutive identical keys
        const last = nodeHistory[nodeHistory.length - 1];
        if (!last || last.nodeKey !== nodeKey) {
          nodeHistory.push({ nodeKey, historyLength: conversationHistory.length });
        }
        updateBackButton();
      }
    }, TYPING_DELAY);
  }

  /**
   * Render the interactive controls (buttons, form, Calendly prompt, checklist)
   * appropriate for the given node. Called after the bot message is shown.
   *
   * Priority order for node types:
   *   1. capture + fields → checklist
   *   2. calendly         → Calendly booking prompt
   *   3. form             → lead-capture form
   *   4. options          → quick-reply buttons
   *   5. fallback         → single "Back to menu" button
   *
   * @param {Object} node    - The knowledge node object
   * @param {string} nodeKey - The node's key (used for analytics / routing)
   */
  function renderNodeActions(node, nodeKey) {
    // 1. Checklist (optional multi-select detail gathering)
    if (node.capture && node.fields && node.next) {
      UI.addMessage("Select any that you already know:", "bot");
      recordMessage("Select any that you already know:", "bot");
      UI.renderChecklist(node.fields, (selected) => {
        const text = selected.length ? selected.join(", ") : "No details yet";
        addUserMessage(text);
        renderNode(node.next);
      });
      return;
    }

    // 2. Calendly booking prompt
    if (node.calendly) {
      UI.renderCalendlyPrompt(node.calendly, () => {
        addBotMessage("Your booking page is open in a new tab. Once you've picked a time, you're all set! Is there anything else I can help with?");
        UI.renderButtons(
          [{ label: "Back to main menu", next: "mainMenu" }, { label: "I'm all set!", next: "_end" }],
          (opt) => {
            addUserMessage(opt.label);
            if (opt.next === "_end") {
              endConversation();
            } else {
              renderNode(opt.next);
            }
          }
        );
      }, () => {
        // Fallback: route to the phone-optional lead capture form
        renderNode("lead_capture_phone");
      });
      return;
    }

    // 3. Lead capture form
    if (node.form) {
      const fields = node.formFields || ["name", "email"];
      UI.renderLeadForm(fields, (data) => {
        UI.clearActions();
        // Build a human-readable summary to echo back as the user "message"
        const summary = data.phone
          ? `${data.name} — ${data.email} — ${data.phone}`
          : `${data.name} — ${data.email}`;
        addUserMessage(summary);

        Analytics.trackLead(data);

        const confirmMsg = "✅ Thanks! Our team will follow up within 24 hours. Is there anything else I can help with?";

        addBotMessage(confirmMsg);
        UI.renderButtons(
          [{ label: "Back to main menu", next: "mainMenu" }, { label: "I'm all set!", next: "_end" }],
          (opt) => {
            addUserMessage(opt.label);
            if (opt.next === "_end") {
              endConversation();
            } else {
              renderNode(opt.next);
            }
          }
        );
      });
      return;
    }

    // 4. Standard quick-reply buttons
    if (node.options) {
      UI.renderButtons(node.options, (opt) => {
        addUserMessage(opt.label);

        // Check for human/urgent intent in the selected option label
        // This allows knowledge nodes to trigger escalation via button text
        const lower = opt.label.toLowerCase();
        if (HUMAN_KEYWORDS.some(kw => lower.includes(kw))) {
          Analytics.trackHandoff("user_requested");
          renderNode("human");
          return;
        }
        if (URGENCY_KEYWORDS.some(kw => lower.includes(kw))) {
          Analytics.trackHandoff("urgency_detected");
          renderNode("human");
          return;
        }

        if (opt.next === "_whatsapp") {
          window.open("https://wa.me/14164643575", "_blank", "noopener");
          addBotMessage("WhatsApp is open in a new tab! Our team will reply shortly. Is there anything else I can help with?");
          UI.renderButtons(
            [{ label: "Back to main menu", next: "mainMenu" }, { label: "I'm all set!", next: "_end" }],
            (o) => { addUserMessage(o.label); o.next === "_end" ? endConversation() : renderNode(o.next); }
          );
          return;
        }

        // Option-level `next` takes priority over node-level `next`
        if (opt.next) renderNode(opt.next);
        else if (node.next) renderNode(node.next);
      });
      return;
    }

    // 5. Fallback — should only occur if a node has no options/form/calendly
    UI.renderButtons([{ label: "Back to menu", next: "mainMenu" }], (opt) => {
      addUserMessage(opt.label);
      renderNode(opt.next);
    });
  }

  /* ===============================
     NOTIFICATION SOUND
     =============================== */
  const notifAudio = document.getElementById("notif-sound");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function playNotificationSound() {
    if (prefersReducedMotion.matches) return;
    if (panel.classList.contains("hidden")) return;
    if (!notifAudio) return;
    notifAudio.currentTime = 0;
    notifAudio.play().catch(() => {});
  }

  /* ===============================
     MESSAGE HELPERS
     ====================================================== */

  /**
   * Add a bot message to the DOM and record it in conversation history.
   * @param {string} text
   */
  function addBotMessage(text, options = {}) {
    UI.addMessage(text, "bot", options);
    recordMessage(text, "bot");
    Analytics.trackMessage("bot");
    playNotificationSound();
    if (panel.classList.contains("hidden") && unreadBadge) {
      unreadBadge.classList.remove("hidden");
    }
  }

  /**
   * Add a user message to the DOM and record it in conversation history.
   * @param {string} text
   */
  function addUserMessage(text) {
    UI.addMessage(text, "user");
    recordMessage(text, "user");
    Analytics.trackMessage("user");
  }

  /**
   * Append a message entry to the in-memory history array and save to sessionStorage.
   * @param {string}          text
   * @param {"bot"|"user"}    who
   */
  function recordMessage(text, who) {
    conversationHistory.push({ text, who, at: Date.now() });
    saveHistory();
  }

  /* ======================================================
     FREE-TEXT INPUT HANDLING
     ====================================================== */

  /*
   * Pattern dictionaries for natural language matching.
   * Each array is tested with String.includes() against the lowercased input.
   * Order within handleTypedInput() determines which intent wins on ambiguous input.
   */
  const GREETING_PATTERNS = [
    "hey", "hello", "hi", "hiya", "howdy", "yo", "sup", "what's up", "whats up",
    "good morning", "good afternoon", "good evening", "hola", "greetings", "heya"
  ];
  const THANKS_PATTERNS = [
    "thank", "thanks", "thx", "appreciate", "cheers", "ty", "great help", "awesome help"
  ];
  const BYE_PATTERNS = [
    "bye", "goodbye", "see ya", "see you", "later", "cya", "take care", "peace",
    "gotta go", "ttyl", "have a good"
  ];
  const YES_PATTERNS = [
    "yes", "yeah", "yep", "yup", "sure", "absolutely", "of course", "definitely",
    "ok", "okay", "sounds good", "let's do it", "go ahead", "please", "yea"
  ];
  const NO_PATTERNS = [
    "no", "nope", "nah", "not really", "never mind", "nevermind", "i'm good",
    "im good", "no thanks", "not interested", "not now", "pass"
  ];
  const ABOUT_PATTERNS = [
    "who are you", "what is sommevents", "what do you do", "tell me about",
    "what's this", "about you", "about somm", "company info", "about the company",
    "what services", "what can you do", "how can you help"
  ];
  const LOCATION_PATTERNS = [
    "where are you", "location", "based", "ontario", "canada", "where do you operate",
    "service area", "do you serve", "city", "office"
  ];
  const CONTACT_PATTERNS = [
    "email", "phone", "contact", "reach you", "get in touch", "info@"
  ];
  const HOURS_PATTERNS = [
    "hours", "open", "available", "when are you", "business hours", "working hours"
  ];
  const COOKING_PATTERNS = [
    "cook", "culinary", "chef", "food", "kitchen", "recipe", "cuisine"
  ];
  const RETREAT_PATTERNS = [
    "retreat", "offsite", "off-site", "getaway", "company trip"
  ];
  const VIRTUAL_PATTERNS = [
    "virtual", "remote", "online", "zoom", "at home"
  ];
  const HOLIDAY_PATTERNS = [
    "holiday", "christmas", "end of year", "new year", "festive", "xmas"
  ];

  /**
   * Return true if the text includes any of the given patterns.
   * @param {string}   text
   * @param {string[]} patterns
   * @returns {boolean}
   */
  function matchesAny(text, patterns) {
    return patterns.some(p => text.includes(p));
  }

  /**
   * Process free-text typed by the user.
   *
   * Intent detection runs in a fixed priority order:
   *   1. Human handoff keywords
   *   2. Urgency keywords
   *   3. Frustration keywords
   *   4. Greetings
   *   5. Thanks
   *   6. Goodbye
   *   7. Yes (context-dependent)
   *   8. No / decline
   *   9. About / company info
   *   10. Location
   *   11. Contact info
   *   12. Business hours
   *   13. Specific service keywords (cooking, retreat, virtual, holiday)
   *   14. General service keywords (event, team, gift, wine, price, book, FAQ)
   *   15. FAQ full-text search against knowledge base
   *   16. Graceful fallback to main menu
   */
  function handleTypedInput() {
    const text = inputEl.value.trim();
    if (!text) return;

    addUserMessage(text);
    inputEl.value = "";

    // Strip punctuation for cleaner matching (keep apostrophes and hyphens)
    const lower = text.toLowerCase().replace(/[^\w\s''-]/g, "").trim();

    // --- 1. Human handoff intent ---
    if (HUMAN_KEYWORDS.some(kw => lower.includes(kw))) {
      Analytics.trackHandoff("typed_request");
      renderNode("human");
      return;
    }

    // --- 2. Urgency ---
    if (URGENCY_KEYWORDS.some(kw => lower.includes(kw))) {
      Analytics.trackHandoff("urgency_typed");
      renderNode("human");
      return;
    }

    // --- 3. Frustration ---
    if (FRUSTRATION_KEYWORDS.some(kw => lower.includes(kw))) {
      Analytics.trackHandoff("frustration_detected");
      addBotMessage("I'm sorry you're having trouble. Let me connect you with our team right away.");
      renderNode("human");
      return;
    }

    // --- 4. Greeting ---
    if (matchesAny(lower, GREETING_PATTERNS)) {
      const greetings = [
        "Hey there! 👋 Welcome to SommEvents. How can I help you today?",
        "Hi! Great to see you! What can I help you with?",
        "Hello! Welcome — I'm here to help you plan something amazing. What are you looking for?",
        "Hey! 😊 Ready to help you with events, gifting, wine experiences, and more. What's on your mind?"
      ];
      // Pick a random greeting to keep the bot feeling dynamic
      addBotMessage(greetings[Math.floor(Math.random() * greetings.length)]);
      renderNodeActions(knowledge["mainMenu"], "mainMenu");
      return;
    }

    // --- 5. Thanks ---
    if (matchesAny(lower, THANKS_PATTERNS)) {
      const replies = [
        "You're welcome! 😊 Is there anything else I can help with?",
        "Happy to help! Let me know if there's anything else.",
        "Anytime! Feel free to ask if you need anything more.",
        "Glad I could help! Want to explore anything else?"
      ];
      addBotMessage(replies[Math.floor(Math.random() * replies.length)]);
      UI.renderButtons(
        [{ label: "Back to main menu", next: "mainMenu" }, { label: "I'm all set!", next: "_end" }],
        (opt) => { addUserMessage(opt.label); opt.next === "_end" ? endConversation() : renderNode(opt.next); }
      );
      return;
    }

    // --- 6. Goodbye ---
    if (matchesAny(lower, BYE_PATTERNS)) {
      endConversation();
      return;
    }

    // --- 7. Yes (context-dependent) ---
    if (matchesAny(lower, YES_PATTERNS) && !matchesAny(lower, NO_PATTERNS)) {
      // If on human node, treat as "connect me"
      if (currentNodeKey === "human") {
        renderNode("lead_capture");
        return;
      }
      // If on a CTA or node with a next, follow through
      const node = knowledge[currentNodeKey];
      if (node && node.next) {
        addBotMessage("Great! Let's keep going.");
        renderNode(node.next);
        return;
      }
      addBotMessage("Awesome! Here are your options:");
      renderNode("mainMenu");
      return;
    }

    // --- 8. No / decline ---
    if (matchesAny(lower, NO_PATTERNS)) {
      addBotMessage("No problem at all! Feel free to come back anytime. Is there anything else I can help with?");
      UI.renderButtons(
        [{ label: "Back to main menu", next: "mainMenu" }, { label: "I'm all set!", next: "_end" }],
        (opt) => { addUserMessage(opt.label); opt.next === "_end" ? endConversation() : renderNode(opt.next); }
      );
      return;
    }

    // --- 9. About / who are you ---
    if (matchesAny(lower, ABOUT_PATTERNS)) {
      addBotMessage("SommEvents is Ontario's premier corporate event planning and wine experience company! With 10+ years of experience, we specialize in creating thoughtful, elevated events — no generic experiences here. We handle everything from corporate retreats and team building to custom gifting and sommelier-led wine tastings. 🍷\n\nWhat would you like to explore?");
      renderNodeActions(knowledge["mainMenu"], "mainMenu");
      return;
    }

    // --- 10. Location ---
    if (matchesAny(lower, LOCATION_PATTERNS)) {
      addBotMessage("We're based in Ontario, Canada, and serve clients across the country! We can plan in-person events throughout Ontario and offer virtual experiences Canada-wide. For specific location questions, our team can give you the details.\n\nWant to explore our services or connect with our team?");
      UI.renderButtons(
        [{ label: "Explore services", next: "mainMenu" }, { label: "Talk to our team", next: "human" }],
        (opt) => { addUserMessage(opt.label); renderNode(opt.next); }
      );
      return;
    }

    // --- 11. Contact info ---
    if (matchesAny(lower, CONTACT_PATTERNS)) {
      addBotMessage("You can reach us at info@sommevents.com — or I can have our team reach out to you directly! Would you like to leave your details?");
      UI.renderButtons(
        [{ label: "Leave my details", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
        (opt) => { addUserMessage(opt.label); renderNode(opt.next); }
      );
      return;
    }

    // --- 12. Business hours ---
    if (matchesAny(lower, HOURS_PATTERNS)) {
      addBotMessage("Our team is typically available Monday–Friday, 9 AM – 6 PM ET. But don't worry — leave your info here anytime and we'll get back to you within 24 hours!");
      UI.renderButtons(
        [{ label: "Leave my info", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
        (opt) => { addUserMessage(opt.label); renderNode(opt.next); }
      );
      return;
    }

    // --- 13. Specific service keywords (more granular) ---
    if (matchesAny(lower, COOKING_PATTERNS)) {
      addBotMessage("Our culinary experiences are a huge hit! From cooking competitions to chef-led workshops, it's a fantastic way to bond as a team. Let me show you our team building options.");
      renderNode("team_building");
      return;
    }
    if (matchesAny(lower, RETREAT_PATTERNS)) {
      addBotMessage("Corporate retreats are one of our specialties! Let's plan something unforgettable.");
      renderNode("plan_event");
      return;
    }
    if (matchesAny(lower, VIRTUAL_PATTERNS)) {
      addBotMessage("We offer amazing virtual experiences — curated tasting kits shipped right to participants! Let me show you the options.");
      renderNode("team_building");
      return;
    }
    if (matchesAny(lower, HOLIDAY_PATTERNS)) {
      addBotMessage("Holiday planning is our jam! 🎄 Whether it's a party, gifting program, or both — we've got you covered.");
      UI.renderButtons(
        [{ label: "Plan a holiday event", next: "plan_event" }, { label: "Holiday gifting", next: "gifting" }, { label: "Both!", next: "plan_event" }],
        (opt) => { addUserMessage(opt.label); renderNode(opt.next); }
      );
      return;
    }

    // --- 14. General service keywords ---
    if (lower.includes("event") || lower.includes("plan") || lower.includes("party") || lower.includes("conference") || lower.includes("meeting")) {
      addBotMessage("We'd love to help you plan an event! Let's get started.");
      renderNode("plan_event");
      return;
    }
    if (lower.includes("team") || lower.includes("build") || lower.includes("activity") || lower.includes("bonding")) {
      addBotMessage("Team experiences are what we do best! Let's find the perfect fit.");
      renderNode("team_building");
      return;
    }
    if (lower.includes("gift") || lower.includes("present") || lower.includes("hamper") || lower.includes("basket") || lower.includes("corporate gift")) {
      addBotMessage("A thoughtful gift goes a long way! Let's explore your gifting options.");
      renderNode("gifting");
      return;
    }
    if (lower.includes("wine") || lower.includes("sip") || lower.includes("tasting") || lower.includes("sommelier") || lower.includes("vineyard")) {
      addBotMessage("Ah, a fellow wine lover! 🍷 Let me show you what we offer.");
      renderNode("wine");
      return;
    }
    if (lower.includes("price") || lower.includes("cost") || lower.includes("budget") || lower.includes("how much") || lower.includes("affordable") || lower.includes("expensive") || lower.includes("rate")) {
      addBotMessage("Great question! Our pricing is customized based on your needs. Let me walk you through it.");
      renderNode("pricing");
      return;
    }
    if (lower.includes("book") || lower.includes("reserve") || lower.includes("schedule") || lower.includes("appointment") || lower.includes("availability")) {
      addBotMessage("Let's get you booked in!");
      renderNode("consultation_booking");
      return;
    }
    if (lower.includes("faq") || lower.includes("question") || lower.includes("help") || lower.includes("info") || lower.includes("information")) {
      addBotMessage("Happy to help! Let me pull up our FAQ.");
      renderNode("faq_main");
      return;
    }
    if (lower.includes("menu") || lower.includes("start") || lower.includes("home") || lower.includes("back") || lower.includes("reset") || lower.includes("beginning")) {
      renderNode("mainMenu");
      return;
    }

    // --- 15. FAQ search (try to match against knowledge base) ---
    const results = searchFAQ(lower);
    if (results.length > 0) {
      Analytics.trackFAQSearch(text);
      addBotMessage(`I found ${results.length} related answer${results.length > 1 ? "s" : ""} that might help:`);
      UI.renderFAQResults(results, (faqKey) => {
        renderNode(faqKey);
      });
      return;
    }

    // --- 16. Fallback (graceful) ---
    // Rotate through several messages so repeated unknowns don't feel robotic
    const fallbacks = [
      "I'm not quite sure I follow, but no worries! Here are some ways I can help:",
      "Hmm, I want to make sure I get this right. How about picking from these options?",
      "I appreciate you typing that! I'm best with the options below — pick one and I'll guide you from there.",
      "Not sure I caught that, but I'm here to help! Try one of these options:"
    ];
    addBotMessage(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    renderNodeActions(knowledge["mainMenu"], "mainMenu");
  }

  /* ======================================================
     FAQ SEARCH
     ====================================================== */

  /**
   * Score and rank knowledge nodes against a free-text query.
   * Each word in the query that appears in a node's text earns one point.
   * Only nodes with score > 0 are returned, sorted best-first.
   *
   * @param {string} query - Lowercased search string (from typed input or search bar)
   * @returns {Array<{key: string, text: string, score: number}>}
   */
  function searchFAQ(query) {
    if (!query || query.length < 2) return [];
    // Filter out very short words (stopwords, articles) that would inflate scores
    const words = query.split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return [];

    return faqSearchIndex
      .map(entry => {
        let score = 0;
        words.forEach(w => {
          if (entry.text.includes(w)) score++;
        });
        return { ...entry, score };
      })
      .filter(e => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // cap results to keep the UI manageable
  }

  /**
   * Handle a submission from the dedicated FAQ search bar in the chat header.
   * Clears and hides the search input after dispatching results.
   */
  function handleFAQSearch() {
    const query = faqSearch.value.trim().toLowerCase();
    if (!query) return;

    Analytics.trackFAQSearch(query);
    addUserMessage(`Search: ${query}`);

    const results = searchFAQ(query);
    if (results.length > 0) {
      addBotMessage(`Found ${results.length} matching FAQ${results.length > 1 ? "s" : ""}:`);
      UI.renderFAQResults(results, (faqKey) => {
        renderNode(faqKey);
      });
    } else {
      addBotMessage("No results found. Try different keywords or browse FAQ categories.");
      UI.renderButtons(
        [{ label: "Browse FAQs", next: "faq_main" }, { label: "Talk to a human", next: "human" }],
        (opt) => { addUserMessage(opt.label); renderNode(opt.next); }
      );
    }

    faqSearch.value = "";
    toggleFAQSearch(false);
  }

  /**
   * Show or hide the FAQ search bar overlay in the chat header.
   * @param {boolean} show - true to reveal and focus, false to hide
   */
  function toggleFAQSearch(show) {
    if (show) {
      searchWrapper.classList.remove("hidden");
      faqSearch.focus();
    } else {
      searchWrapper.classList.add("hidden");
    }
  }

  /* ======================================================
     END CONVERSATION / RATING
     ====================================================== */

  /**
   * Wrap up the conversation: show a farewell message and the star rating widget.
   * Called when the user selects "I'm all set!" or types a goodbye phrase.
   */
  function endConversation() {
    addBotMessage("Thanks for chatting with SommEvents! If you need anything else, just open the chat again. Have a great day! 🍷");
    UI.clearActions();
    UI.showRating((rating) => {
      Analytics.trackRating(rating);
      addBotMessage(`Thanks for the ${rating}-star rating! We appreciate your feedback.`);
    });
  }

  /* ======================================================
     ESCALATION LISTENERS
     ====================================================== */

  /**
   * React to automatic escalation events raised by Analytics.
   * Prompts the user to speak with a human when engagement thresholds are crossed.
   */
  Analytics.onEscalation((reason) => {
    if (reason === "repeated_pricing") {
      // User has visited pricing nodes 3+ times — they likely need a custom quote
      Analytics.trackDropoff(currentNodeKey, { reason: "escalation_pricing_loop" });

      addBotMessage("It looks like you have a lot of pricing questions — totally understandable. Would you like to speak with someone from our team for a detailed quote?");
      UI.renderButtons(
        [{ label: "Yes, connect me", next: "human" }, { label: "Not yet", next: "mainMenu" }],
        (opt) => { addUserMessage(opt.label); renderNode(opt.next); }
      );
    } else if (reason === "faq_loop_no_conversion") {
      // User has read 3+ FAQs without leaving contact details
      Analytics.trackDropoff(currentNodeKey, { reason: "escalation_faq_loop" });

      addBotMessage("You've been exploring a lot of great questions! Would it help to chat with someone from our team directly?");
      UI.renderButtons(
        [{ label: "Yes, please!", next: "human" }, { label: "I'm okay", next: "mainMenu" }],
        (opt) => { addUserMessage(opt.label); renderNode(opt.next); }
      );
    }
  });

  /* ======================================================
     EVENT LISTENERS
     ====================================================== */

  // Chat panel open/close/reset
  bubble.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);
  resetBtn.addEventListener("click", resetChat);
  if (backBtn) backBtn.addEventListener("click", goBack);

  // Free-text input — send on button click or Enter key
  sendBtn.addEventListener("click", handleTypedInput);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleTypedInput();
  });

  // FAQ search bar
  if (faqSearch) {
    faqSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleFAQSearch();
    });
  }
  if (faqSearchClose) {
    faqSearchClose.addEventListener("click", () => toggleFAQSearch(false));
  }
  if (faqSearchToggle) {
    faqSearchToggle.addEventListener("click", () => toggleFAQSearch(true));
  }

  // Keyboard: Escape closes the panel
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.classList.contains("hidden")) {
      closeChat();
    }
  });

  // Focus trap — keep keyboard focus inside the panel while it is open
  // (meets WCAG 2.1 SC 2.1.2 for modal dialogs)
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const focusable = panel.querySelectorAll("button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex='-1'])");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        // Shift+Tab on first element → wrap to last
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        // Tab on last element → wrap to first
        e.preventDefault();
        first.focus();
      }
    }
  });

})();
