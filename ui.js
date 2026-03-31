/* =========================================================
   SommEvents – UI Rendering Module
   =========================================================
   Pure DOM helpers — no business logic, no analytics calls.

   All functions operate on the two persistent container
   elements inside #chat-panel:
     #chat-messages  – scrollable message thread
     #chat-actions   – quick-reply buttons / forms area

   Consumers (chatbot.js) should call these helpers instead
   of touching the DOM directly so layout concerns stay here.
   ========================================================= */

const UI = (() => {
  /* ---- Element cache ---- */
  // Short alias for getElementById — keeps render calls concise
  const $ = (id) => document.getElementById(id);

  const messagesEl = $("chat-messages");
  const actionsEl  = $("chat-actions");

  /* ======================================================
     TYPING INDICATOR
     ====================================================== */

  // Reference kept so we can remove the exact element without a query
  let typingEl = null;

  /**
   * Append an animated three-dot typing indicator to the message thread.
   * Removes any existing indicator first to avoid duplicates.
   */
  function showTyping() {
    hideTyping();
    const div = document.createElement("div");
    div.className = "msg bot typing-indicator";
    div.setAttribute("aria-label", "SommEvents is typing");
    // Three dots animate via CSS; hidden from screen readers individually
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span");
      dot.className = "typing-dot";
      dot.setAttribute("aria-hidden", "true");
      div.appendChild(dot);
    }
    messagesEl.appendChild(div);
    scrollToBottom();
    typingEl = div;
  }

  /**
   * Remove the typing indicator if it is currently visible.
   */
  function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  /* ======================================================
     MESSAGES
     ====================================================== */

  /**
   * Append a text message bubble to the message thread.
   *
   * @param {string} text         - Message text (newlines rendered as line breaks via CSS white-space)
   * @param {"bot"|"user"} [who]  - Determines bubble alignment and colour
   * @returns {HTMLDivElement}    - The created element (callers rarely need this)
   */
  function addMessage(text, who = "bot") {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    // role="log" tells screen readers this region receives updates
    div.setAttribute("role", "log");

    // Use textContent (not innerHTML) to prevent XSS from user-typed input
    div.textContent = text;

    messagesEl.appendChild(div);
    scrollToBottom();
    return div;
  }

  /**
   * Scroll the message thread to its bottom.
   *
   * Uses three approaches in sequence to handle cross-browser quirks and
   * layout changes that happen after the call returns (e.g. button reflow):
   *   1. Direct scrollTop assignment (most reliable)
   *   2. scrollTo with smooth behaviour (nicer UX where supported)
   *   3. A 50 ms setTimeout fallback for late-layout paints
   */
  function scrollToBottom() {
    if (!messagesEl) return;

    const doScroll = () => {
      // Setting scrollTop is the most reliable cross-browser approach
      messagesEl.scrollTop = messagesEl.scrollHeight;
      try {
        messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "auto" });
      } catch (e) {
        /* ignore — older browsers without scrollTo support */
      }
    };

    // Run now + after layout settles (buttons/messages can change height)
    doScroll();
    requestAnimationFrame(doScroll);
    setTimeout(doScroll, 50);
  }

  /* ======================================================
     ACTIONS AREA
     ====================================================== */

  /**
   * Clear all content from the actions container.
   * Called before rendering any new set of buttons or forms.
   */
  function clearActions() { actionsEl.innerHTML = ""; }

  /**
   * Render a row of quick-reply buttons in the actions area.
   *
   * Once any button is clicked, all buttons in the group are disabled
   * immediately to prevent duplicate submissions.
   *
   * @param {Array<{label: string, next?: string, tag?: string}>} options
   *   Button definitions. `next` is the target node key; `tag` is optional.
   * @param {function(option): void} onSelect
   *   Callback invoked with the chosen option object.
   * @param {{ primaryLast?: boolean }} [opts]
   *   Rendering hints. `primaryLast` styles the last button as the CTA.
   * @returns {HTMLButtonElement[]} The rendered button elements
   */
  function renderButtons(options, onSelect, { primaryLast = false } = {}) {
    clearActions();
    const buttons = [];

    options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quick";
      btn.type = "button";
      btn.textContent = opt.label;
      btn.setAttribute("aria-label", opt.label);

      // Make last button primary style if requested (e.g. "Book Now" CTAs)
      if (primaryLast && idx === options.length - 1) {
        btn.classList.add("primary");
      }

      btn.onclick = () => {
        // Disable the entire group before firing the callback to prevent
        // race conditions if the user double-clicks
        buttons.forEach(b => { b.disabled = true; });
        onSelect(opt);
      };

      buttons.push(btn);
      actionsEl.appendChild(btn);
    });

    return buttons;
  }

  /**
   * Render a multi-select checklist followed by a "Continue →" button.
   * Used for optional detail-gathering steps (e.g. "which details do you have?").
   *
   * Buttons toggle between selected/deselected states and update ARIA attributes
   * so screen readers announce checkbox state changes.
   *
   * @param {string[]} fields     - Display labels for each checkbox option
   * @param {function(string[]): void} onSubmit - Called with the array of selected labels
   */
  function renderChecklist(fields, onSubmit) {
    clearActions();
    const selected = new Set();

    fields.forEach(f => {
      const btn = document.createElement("button");
      btn.className = "quick";
      btn.type = "button";
      btn.textContent = f;
      // Buttons act as checkboxes — expose state to assistive technology
      btn.setAttribute("role", "checkbox");
      btn.setAttribute("aria-checked", "false");

      btn.onclick = () => {
        if (selected.has(f)) {
          selected.delete(f);
          btn.classList.remove("active");
          btn.setAttribute("aria-checked", "false");
        } else {
          selected.add(f);
          btn.classList.add("active");
          btn.setAttribute("aria-checked", "true");
        }
      };

      actionsEl.appendChild(btn);
    });

    // "Continue" is always last and always rendered, even with zero selections
    const cont = document.createElement("button");
    cont.className = "quick primary";
    cont.type = "button";
    cont.textContent = "Continue →";
    cont.onclick = () => {
      // Pass an empty array if nothing was selected — callers handle both cases
      const arr = Array.from(selected);
      onSubmit(arr.length ? arr : []);
    };
    actionsEl.appendChild(cont);
  }

  /**
   * Render an inline lead-capture form.
   *
   * Supported field keys: "name", "email", "phone", "company".
   * "name" and "email" are validated on submit; "phone" and "company" are optional.
   *
   * @param {string[]} [fieldNames=["name","email"]]
   *   Ordered list of field keys to render.
   * @param {function({ name?: string, email?: string, phone?: string, company?: string }): void} onSubmit
   *   Called with the collected (and validated) form data.
   */
  function renderLeadForm(fieldNames = ["name", "email"], onSubmit) {
    clearActions();

    const inputs = {};
    // Centralised field metadata — keeps the loop below clean
    const fieldConfig = {
      name:    { placeholder: "Your name",                    type: "text",  autocomplete: "name" },
      email:   { placeholder: "Email address",                type: "email", autocomplete: "email" },
      phone:   { placeholder: "Phone (optional)",             type: "tel",   autocomplete: "tel" },
      company: { placeholder: "Company name (optional)",      type: "text",  autocomplete: "organization" }
    };

    fieldNames.forEach(key => {
      const cfg = fieldConfig[key] || { placeholder: key, type: "text" };
      const input = document.createElement("input");
      input.className = "form-input";
      input.type = cfg.type;
      input.placeholder = cfg.placeholder;
      input.autocomplete = cfg.autocomplete || "off";
      input.setAttribute("aria-label", cfg.placeholder);

      // Remove error highlight as soon as the user starts correcting the field
      input.addEventListener("input", () => input.classList.remove("error"));

      inputs[key] = input;
      actionsEl.appendChild(input);
    });

    const submit = document.createElement("button");
    submit.className = "quick primary";
    submit.type = "button";
    submit.textContent = "Submit";

    submit.onclick = () => {
      // Simple regex — covers the vast majority of valid addresses without false negatives
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const data = {};

      // Required: name
      if (inputs.name) {
        const v = inputs.name.value.trim();
        if (!v) { inputs.name.classList.add("error"); inputs.name.focus(); return; }
        data.name = v;
      }
      // Required: email (validated against regex)
      if (inputs.email) {
        const v = inputs.email.value.trim();
        if (!v || !emailRegex.test(v)) { inputs.email.classList.add("error"); inputs.email.focus(); return; }
        data.email = v;
      }
      // Optional: phone — included as empty string if blank
      if (inputs.phone) { data.phone = inputs.phone.value.trim(); }

      // Optional: company — omitted from payload if blank
      if (inputs.company) {
        const v = inputs.company.value.trim();
        if (v) data.company = v;
      }

      onSubmit(data);
    };

    actionsEl.appendChild(submit);

    // Auto-focus the first visible field for faster form completion
    const first = fieldNames[0];
    if (inputs[first]) inputs[first].focus();
  }

  /**
   * Render a Calendly booking prompt with a primary CTA and a "leave details" fallback.
   *
   * The booking link opens in a new tab. A short delay before calling `onBooked`
   * gives the browser time to open the tab before the chatbot UI transitions.
   *
   * @param {string}   calendlyUrl - Calendly scheduling page URL
   * @param {function(): void} onBooked    - Called ~300 ms after the user clicks "Book a Time"
   * @param {function(): void} onFallback  - Called when the user prefers to leave their details
   */
  function renderCalendlyPrompt(calendlyUrl, onBooked, onFallback) {
    clearActions();

    const wrap = document.createElement("div");
    wrap.className = "calendly-prompt";

    // Primary CTA — anchor tag so middle-click / Ctrl+click also works
    const bookBtn = document.createElement("a");
    bookBtn.href = calendlyUrl;
    bookBtn.target = "_blank";
    bookBtn.rel = "noopener noreferrer"; // prevent tab-napping
    bookBtn.className = "quick primary calendly-book-btn";
    bookBtn.textContent = "📅 Book a Time on Calendly";
    bookBtn.onclick = () => {
      // Small delay so the new tab opens before the UI transitions
      setTimeout(onBooked, 300);
    };
    wrap.appendChild(bookBtn);

    // Fallback for users who can't or don't want to use Calendly
    const fallbackBtn = document.createElement("button");
    fallbackBtn.className = "quick";
    fallbackBtn.type = "button";
    fallbackBtn.textContent = "I'd rather leave my details";
    fallbackBtn.onclick = () => {
      clearActions();
      onFallback();
    };
    wrap.appendChild(fallbackBtn);

    actionsEl.appendChild(wrap);
  }

  /**
   * Render a list of FAQ search result buttons.
   * Capped at 5 results to keep the actions area manageable.
   * Each button shows the first 80 characters of the answer as a preview.
   *
   * @param {Array<{key: string, text: string}>} results - Matched FAQ entries
   * @param {function(string): void} onSelect            - Called with the selected FAQ node key
   */
  function renderFAQResults(results, onSelect) {
    clearActions();
    if (results.length === 0) {
      addMessage("No matching FAQs found. Try a different keyword or browse categories.", "bot");
      return;
    }

    const wrap = document.createElement("div");
    wrap.className = "faq-results";

    // Show at most 5 results to avoid overwhelming the user
    results.slice(0, 5).forEach(r => {
      const btn = document.createElement("button");
      btn.className = "faq-result-btn";
      btn.type = "button";
      // Truncate long answers to 80 chars for a clean preview
      btn.textContent = r.text.substring(0, 80) + (r.text.length > 80 ? "…" : "");
      btn.onclick = () => onSelect(r.key);
      wrap.appendChild(btn);
    });

    actionsEl.appendChild(wrap);
  }

  /* ======================================================
     STAR RATING
     ====================================================== */

  /**
   * Reveal the star rating widget and attach click handlers.
   * The widget is hidden by default via CSS; this function removes that class.
   * Stars highlight cumulatively (1 through N) on click.
   *
   * @param {function(number): void} onRate - Called with the selected rating value (1–5)
   */
  function showRating(onRate) {
    const ratingEl = $("chat-rating");
    if (!ratingEl) return;
    ratingEl.classList.remove("hidden");

    const stars = ratingEl.querySelectorAll(".star");
    stars.forEach(star => {
      star.classList.remove("active"); // reset any previous highlight
      star.onclick = () => {
        const val = parseInt(star.dataset.value);
        // Highlight all stars up to and including the selected one
        stars.forEach(s => {
          s.classList.toggle("active", parseInt(s.dataset.value) <= val);
        });
        onRate(val);
        // Auto-hide the widget after a short delay so the user sees the result
        setTimeout(() => { ratingEl.classList.add("hidden"); }, 1200);
      };
    });
  }

  /**
   * Hide the star rating widget (e.g. after a chat reset).
   */
  function hideRating() {
    const ratingEl = $("chat-rating");
    if (ratingEl) ratingEl.classList.add("hidden");
  }

  /* ---- Public API ---- */
  return {
    $,
    messagesEl,
    actionsEl,
    showTyping,
    hideTyping,
    addMessage,
    scrollToBottom,
    clearActions,
    renderButtons,
    renderChecklist,
    renderLeadForm,
    renderCalendlyPrompt,
    renderFAQResults,
    showRating,
    hideRating
  };
})();
