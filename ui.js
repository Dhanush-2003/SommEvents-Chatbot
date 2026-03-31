/* =========================================================
   SommEvents – UI Rendering Module
   Pure DOM helpers; no business logic.
   ========================================================= */

const UI = (() => {
  /* ---- Element cache ---- */
  const $ = (id) => document.getElementById(id);
  const messagesEl = $("chat-messages");
  const actionsEl  = $("chat-actions");

  /* ---- Typing indicator ---- */
  let typingEl = null;

  function showTyping() {
    hideTyping();
    const div = document.createElement("div");
    div.className = "msg bot typing-indicator";
    div.setAttribute("aria-label", "SommEvents is typing");
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

  function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  /* ---- Messages ---- */
  function addMessage(text, who = "bot") {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.setAttribute("role", "log");

    // Support newlines in knowledge base text
    div.textContent = text;

    messagesEl.appendChild(div);
    scrollToBottom();
    return div;
  }

  function scrollToBottom() {
    if (!messagesEl) return;

    const doScroll = () => {
      // Setting scrollTop is the most reliable cross-browser approach.
      messagesEl.scrollTop = messagesEl.scrollHeight;
      try {
        messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "auto" });
      } catch (e) {
        /* ignore */
      }
    };

    // Run now + after layout settles (buttons/messages can change height).
    doScroll();
    requestAnimationFrame(doScroll);
    setTimeout(doScroll, 50);
  }

  /* ---- Actions area ---- */
  function clearActions() { actionsEl.innerHTML = ""; }

  /**
   * Render quick-reply buttons.
   * @param {Array} options  – [{label, next?, tag?}]
   * @param {Function} onSelect – callback(opt)
   * @param {string|null} fallbackNextKey – key when opt has no .next
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

      // Make last button primary style if requested
      if (primaryLast && idx === options.length - 1) {
        btn.classList.add("primary");
      }

      btn.onclick = () => {
        buttons.forEach(b => { b.disabled = true; });
        onSelect(opt);
      };

      buttons.push(btn);
      actionsEl.appendChild(btn);
    });

    return buttons;
  }

  /**
   * Render a multi-select checklist with a Continue button.
   * @param {string[]} fields
   * @param {Function} onSubmit – callback(selectedArray)
   */
  function renderChecklist(fields, onSubmit) {
    clearActions();
    const selected = new Set();

    fields.forEach(f => {
      const btn = document.createElement("button");
      btn.className = "quick";
      btn.type = "button";
      btn.textContent = f;
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

    const cont = document.createElement("button");
    cont.className = "quick primary";
    cont.type = "button";
    cont.textContent = "Continue →";
    cont.onclick = () => {
      const arr = Array.from(selected);
      onSubmit(arr.length ? arr : []);
    };
    actionsEl.appendChild(cont);
  }

  /**
   * Render a lead-capture form.
   * @param {string[]} fieldNames – ["name","email"] or ["name","email","phone"]
   * @param {Function} onSubmit – callback({name, email, phone?})
   */
  function renderLeadForm(fieldNames = ["name", "email"], onSubmit) {
    clearActions();

    const inputs = {};
    const fieldConfig = {
      name:  { placeholder: "Your name",       type: "text",  autocomplete: "name" },
      email: { placeholder: "Email address",    type: "email", autocomplete: "email" },
      phone: { placeholder: "Phone (optional)", type: "tel",   autocomplete: "tel" },
      company: { placeholder: "Company name (optional)", type: "text", autocomplete: "organization" }
    };

    fieldNames.forEach(key => {
      const cfg = fieldConfig[key] || { placeholder: key, type: "text" };
      const input = document.createElement("input");
      input.className = "form-input";
      input.type = cfg.type;
      input.placeholder = cfg.placeholder;
      input.autocomplete = cfg.autocomplete || "off";
      input.setAttribute("aria-label", cfg.placeholder);

      input.addEventListener("input", () => input.classList.remove("error"));

      inputs[key] = input;
      actionsEl.appendChild(input);
    });

    const submit = document.createElement("button");
    submit.className = "quick primary";
    submit.type = "button";
    submit.textContent = "Submit";

    submit.onclick = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const data = {};

      // Validate name
      if (inputs.name) {
        const v = inputs.name.value.trim();
        if (!v) { inputs.name.classList.add("error"); inputs.name.focus(); return; }
        data.name = v;
      }
      // Validate email
      if (inputs.email) {
        const v = inputs.email.value.trim();
        if (!v || !emailRegex.test(v)) { inputs.email.classList.add("error"); inputs.email.focus(); return; }
        data.email = v;
      }
      // Phone (optional)
      if (inputs.phone) { data.phone = inputs.phone.value.trim(); }

      // Company (optional)
      if (inputs.company) {
        const v = inputs.company.value.trim();
        if (v) data.company = v;
      }

      onSubmit(data);
    };

    actionsEl.appendChild(submit);

    // Focus first field
    const first = fieldNames[0];
    if (inputs[first]) inputs[first].focus();
  }

  /**
   * Render a Calendly booking prompt with a primary CTA and a fallback.
   * @param {string} calendlyUrl – the Calendly scheduling link
   * @param {Function} onBooked  – called after the user clicks "Book Now"
   * @param {Function} onFallback – called if the user prefers to leave details instead
   */
  function renderCalendlyPrompt(calendlyUrl, onBooked, onFallback) {
    clearActions();

    const wrap = document.createElement("div");
    wrap.className = "calendly-prompt";

    const bookBtn = document.createElement("a");
    bookBtn.href = calendlyUrl;
    bookBtn.target = "_blank";
    bookBtn.rel = "noopener noreferrer";
    bookBtn.className = "quick primary calendly-book-btn";
    bookBtn.textContent = "📅 Book a Time on Calendly";
    bookBtn.onclick = () => {
      setTimeout(onBooked, 300);
    };
    wrap.appendChild(bookBtn);

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
   * Render FAQ search results.
   * @param {Array} results – [{key, text}]
   * @param {Function} onSelect – callback(faqKey)
   */
  function renderFAQResults(results, onSelect) {
    clearActions();
    if (results.length === 0) {
      addMessage("No matching FAQs found. Try a different keyword or browse categories.", "bot");
      return;
    }

    const wrap = document.createElement("div");
    wrap.className = "faq-results";

    results.slice(0, 5).forEach(r => {
      const btn = document.createElement("button");
      btn.className = "faq-result-btn";
      btn.type = "button";
      // Show first 80 chars of the answer as preview
      btn.textContent = r.text.substring(0, 80) + (r.text.length > 80 ? "…" : "");
      btn.onclick = () => onSelect(r.key);
      wrap.appendChild(btn);
    });

    actionsEl.appendChild(wrap);
  }

  /**
   * Show star rating UI.
   * @param {Function} onRate – callback(rating 1-5)
   */
  function showRating(onRate) {
    const ratingEl = $("chat-rating");
    if (!ratingEl) return;
    ratingEl.classList.remove("hidden");

    const stars = ratingEl.querySelectorAll(".star");
    stars.forEach(star => {
      star.classList.remove("active");
      star.onclick = () => {
        const val = parseInt(star.dataset.value);
        stars.forEach(s => {
          s.classList.toggle("active", parseInt(s.dataset.value) <= val);
        });
        onRate(val);
        setTimeout(() => { ratingEl.classList.add("hidden"); }, 1200);
      };
    });
  }

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
