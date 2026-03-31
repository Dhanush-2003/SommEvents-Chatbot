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
  function addMessage(text, who = "bot", options = {}) {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.setAttribute("role", "log");

    if (options.image) {
      const img = document.createElement("img");
      img.src = options.image;
      img.alt = options.imageAlt || "";
      img.loading = "lazy";
      div.appendChild(img);
    }

    const span = document.createElement("span");
    span.textContent = text;
    div.appendChild(span);

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
   * Render a consultation calendar (date + time slot picker).
   * @param {Function} onSelect – callback(dateTimeString)
   */
  function renderCalendarWidget(onSelect) {
    clearActions();

    const days = getNextBusinessDays(5);
    const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

    // Date picker label
    const dateLabel = document.createElement("p");
    dateLabel.className = "cal-label";
    dateLabel.textContent = "Select a date:";
    actionsEl.appendChild(dateLabel);

    const dateGrid = document.createElement("div");
    dateGrid.className = "cal-date-grid";

    days.forEach(day => {
      const btn = document.createElement("button");
      btn.className = "cal-date-btn";
      btn.type = "button";
      btn.innerHTML = `<strong>${day.dayName}</strong><br/>${day.monthDay}`;
      btn.setAttribute("aria-label", day.full);

      btn.onclick = () => {
        clearActions();

        const timeLabel = document.createElement("p");
        timeLabel.className = "cal-label";
        timeLabel.textContent = `${day.dayName} ${day.monthDay} — choose a time:`;
        actionsEl.appendChild(timeLabel);

        const timeGrid = document.createElement("div");
        timeGrid.className = "cal-time-grid";

        times.forEach(time => {
          const tbtn = document.createElement("button");
          tbtn.className = "cal-time-btn";
          tbtn.type = "button";
          tbtn.textContent = time;
          tbtn.setAttribute("aria-label", `${day.full} at ${time}`);
          tbtn.onclick = () => onSelect(`${day.full} at ${time}`);
          timeGrid.appendChild(tbtn);
        });

        actionsEl.appendChild(timeGrid);

        const back = document.createElement("button");
        back.className = "cal-back-btn";
        back.type = "button";
        back.textContent = "← Choose a different date";
        back.onclick = () => renderCalendarWidget(onSelect);
        actionsEl.appendChild(back);
      };

      dateGrid.appendChild(btn);
    });

    actionsEl.appendChild(dateGrid);
  }

  /** Generate the next N business days (Mon–Fri) starting tomorrow. */
  function getNextBusinessDays(count) {
    const days = [];
    const DAY_NAMES  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const FULL_DAYS  = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MONTHS     = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const FULL_MONTHS= ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const cursor = new Date();
    cursor.setDate(cursor.getDate() + 1);

    while (days.length < count) {
      const d = cursor.getDay();
      if (d !== 0 && d !== 6) {
        days.push({
          dayName:  DAY_NAMES[d],
          monthDay: `${MONTHS[cursor.getMonth()]} ${cursor.getDate()}`,
          full:     `${FULL_DAYS[d]}, ${FULL_MONTHS[cursor.getMonth()]} ${cursor.getDate()}`
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
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
    renderCalendarWidget,
    renderFAQResults,
    showRating,
    hideRating
  };
})();
