/* =========================================================
   SommEvents – Chatbot Logic (State Machine)
   Orchestrates conversation flow, routing, and escalation.
   ========================================================= */

(function () {
  "use strict";

  /* ---- Element refs ---- */
  const bubble   = UI.$("chat-bubble");
  const panel    = UI.$("chat-panel");
  const closeBtn = UI.$("chat-close");
  const resetBtn = UI.$("chat-reset");
  const inputEl  = UI.$("chat-input");
  const sendBtn  = UI.$("chat-send");
  const faqSearch      = UI.$("faq-search");
  const faqSearchClose = UI.$("faq-search-close");
  const searchWrapper  = UI.$("search-wrapper");

  /* ---- State ---- */
  let currentNodeKey = "mainMenu";
  let conversationHistory = [];
  const TYPING_DELAY = 500;  // ms typing indicator
  const URGENCY_KEYWORDS = ["urgent", "asap", "immediately", "rush", "last minute", "tomorrow", "next week"];
  const HUMAN_KEYWORDS = ["talk", "human", "person", "someone", "agent", "call", "speak", "representative"];
  const FRUSTRATION_KEYWORDS = ["confused", "frustrat", "don't understand", "doesn't work", "not helpful", "terrible", "horrible", "waste", "stupid"];

  /* ---- Conversation history (session) ---- */
  function saveHistory() {
    try { sessionStorage.setItem("somm_history", JSON.stringify(conversationHistory)); } catch (e) { /* silent */ }
  }
  function loadHistory() {
    try {
      const h = sessionStorage.getItem("somm_history");
      if (h) conversationHistory = JSON.parse(h);
    } catch (e) { /* silent */ }
  }

  /* ===============================
     OPEN / CLOSE
     =============================== */
  function openChat() {
    panel.classList.remove("hidden");
    panel.classList.remove("closing");
    bubble.style.display = "none";

    if (UI.messagesEl.childElementCount === 0) {
      // Load previous history or start fresh
      loadHistory();
      if (conversationHistory.length > 0) {
        replayHistory();
      } else {
        renderNode("mainMenu");
      }
    }
    inputEl.focus();
  }

  function closeChat() {
    panel.classList.add("closing");
    setTimeout(() => {
      panel.classList.add("hidden");
      panel.classList.remove("closing");
      bubble.style.display = "flex";
    }, 200);
  }

  function resetChat() {
    UI.messagesEl.innerHTML = "";
    UI.clearActions();
    UI.hideRating();
    conversationHistory = [];
    saveHistory();
    Analytics.resetSession();
    currentNodeKey = "mainMenu";
    renderNode("mainMenu");
  }

  /* ---- Replay session history ---- */
  function replayHistory() {
    conversationHistory.forEach(entry => {
      UI.addMessage(entry.text, entry.who);
    });
    // Re-render the last node's actions
    const node = knowledge[currentNodeKey];
    if (node) {
      renderNodeActions(node, currentNodeKey);
    }
  }

  /* ===============================
     CORE RENDER
     =============================== */
  function renderNode(nodeKey) {
    currentNodeKey = nodeKey;
    const node = knowledge[nodeKey];

    UI.clearActions();

    if (!node) {
      addBotMessage("I want to make sure I help you properly. Let me take you back to the main menu.");
      renderNode("mainMenu");
      return;
    }

    // Track in analytics
    Analytics.trackNode(nodeKey, node.tag);

    // Show typing then message
    UI.showTyping();
    setTimeout(() => {
      UI.hideTyping();
      addBotMessage(node.message);
      renderNodeActions(node, nodeKey);
    }, TYPING_DELAY);
  }

  function renderNodeActions(node, nodeKey) {
    // Checklist capture
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

    // Lead form
    if (node.form) {
      const fields = node.formFields || ["name", "email"];
      UI.renderLeadForm(fields, (data) => {
        UI.clearActions();
        const summary = data.phone
          ? `${data.name} — ${data.email} — ${data.phone}`
          : `${data.name} — ${data.email}`;
        addUserMessage(summary);

        // Track lead
        Analytics.trackLead(data);

        addBotMessage("✅ Thanks! Our team will follow up within 24 hours. Is there anything else I can help with?");
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

    // Standard options
    if (node.options) {
      UI.renderButtons(node.options, (opt) => {
        addUserMessage(opt.label);

        // Check for human/urgent intent in selected option
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

        if (opt.next) renderNode(opt.next);
        else if (node.next) renderNode(node.next);
      });
      return;
    }

    // Fallback
    UI.renderButtons([{ label: "Back to menu", next: "mainMenu" }], (opt) => {
      addUserMessage(opt.label);
      renderNode(opt.next);
    });
  }

  /* ===============================
     MESSAGE HELPERS
     =============================== */
  function addBotMessage(text) {
    UI.addMessage(text, "bot");
    recordMessage(text, "bot");
    Analytics.trackMessage("bot");
  }

  function addUserMessage(text) {
    UI.addMessage(text, "user");
    recordMessage(text, "user");
    Analytics.trackMessage("user");
  }

  function recordMessage(text, who) {
    conversationHistory.push({ text, who, at: Date.now() });
    saveHistory();
  }

  /* ===============================
     FREE-TEXT INPUT HANDLING
     =============================== */

  /* -- Pattern dictionaries for natural language matching -- */
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

  function matchesAny(text, patterns) {
    return patterns.some(p => text.includes(p));
  }

  function handleTypedInput() {
    const text = inputEl.value.trim();
    if (!text) return;

    addUserMessage(text);
    inputEl.value = "";

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
      addBotMessage("Let's get you booked in! Here's how our process works.");
      renderNode("booking_stage");
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
    const fallbacks = [
      "I'm not quite sure I follow, but no worries! Here are some ways I can help:",
      "Hmm, I want to make sure I get this right. How about picking from these options?",
      "I appreciate you typing that! I'm best with the options below — pick one and I'll guide you from there.",
      "Not sure I caught that, but I'm here to help! Try one of these options:"
    ];
    addBotMessage(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    renderNodeActions(knowledge["mainMenu"], "mainMenu");
  }

  /* ===============================
     FAQ SEARCH
     =============================== */
  function searchFAQ(query) {
    if (!query || query.length < 2) return [];
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
      .slice(0, 5);
  }

  /* ---- Dedicated FAQ search bar ---- */
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

  function toggleFAQSearch(show) {
    if (show) {
      searchWrapper.classList.remove("hidden");
      faqSearch.focus();
    } else {
      searchWrapper.classList.add("hidden");
    }
  }

  /* ===============================
     END CONVERSATION / RATING
     =============================== */
  function endConversation() {
    addBotMessage("Thanks for chatting with SommEvents! If you need anything else, just open the chat again. Have a great day! 🍷");
    UI.clearActions();
    UI.showRating((rating) => {
      Analytics.trackRating(rating);
      addBotMessage(`Thanks for the ${rating}-star rating! We appreciate your feedback.`);
    });
  }

  /* ===============================
     ESCALATION LISTENERS
     =============================== */
  Analytics.onEscalation((reason) => {
    if (reason === "repeated_pricing") {
      addBotMessage("It looks like you have a lot of pricing questions — totally understandable. Would you like to speak with someone from our team for a detailed quote?");
      UI.renderButtons(
        [{ label: "Yes, connect me", next: "human" }, { label: "Not yet", next: "mainMenu" }],
        (opt) => { addUserMessage(opt.label); renderNode(opt.next); }
      );
    } else if (reason === "faq_loop_no_conversion") {
      addBotMessage("You've been exploring a lot of great questions! Would it help to chat with someone from our team directly?");
      UI.renderButtons(
        [{ label: "Yes, please!", next: "human" }, { label: "I'm okay", next: "mainMenu" }],
        (opt) => { addUserMessage(opt.label); renderNode(opt.next); }
      );
    }
  });

  /* ===============================
     EVENT LISTENERS
     =============================== */
  bubble.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);
  resetBtn.addEventListener("click", resetChat);

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

  // Keyboard: Escape to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.classList.contains("hidden")) {
      closeChat();
    }
  });

  // Trap focus inside panel when open (basic implementation)
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const focusable = panel.querySelectorAll("button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex='-1'])");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

})();
