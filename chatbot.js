let currentNodeKey = "mainMenu";
let typingEl = null;

const bubble = document.getElementById("chat-bubble");
const panel = document.getElementById("chat-panel");
const closeBtn = document.getElementById("chat-close");
const messagesEl = document.getElementById("chat-messages");
const actionsEl = document.getElementById("chat-actions");

const inputEl = document.getElementById("chat-input");
const sendBtn = document.getElementById("chat-send");

function openChat() {
  panel.classList.remove("hidden");
  if (messagesEl.childElementCount === 0) renderNode("mainMenu");
}
function closeChat() { panel.classList.add("hidden"); }

bubble.addEventListener("click", openChat);
closeBtn.addEventListener("click", closeChat);

function addMessage(text, who = "bot") {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
}

function showTypingIndicator() {
  hideTypingIndicator();
  const div = document.createElement("div");
  div.className = "msg bot typing-indicator";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    dot.className = "typing-dot";
    div.appendChild(dot);
  }
  messagesEl.appendChild(div);
  messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
  typingEl = div;
}

function hideTypingIndicator() {
  if (typingEl) {
    typingEl.remove();
    typingEl = null;
  }
}

function clearActions() { actionsEl.innerHTML = ""; }

function addQuickReplies(options, fallbackNext = null) {
  clearActions();
  const buttons = [];
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "quick";
    btn.type = "button";
    btn.textContent = opt.label;

    btn.onclick = () => {
      buttons.forEach(b => { b.disabled = true; });

      addMessage(opt.label, "user");

      const lower = opt.label.toLowerCase();
      if (lower.includes("talk") || lower.includes("human") || lower.includes("urgent")) {
        renderNode("human");
        return;
      }

      if (opt.next) renderNode(opt.next);
      else if (fallbackNext) renderNode(fallbackNext);
    };

    buttons.push(btn);
    actionsEl.appendChild(btn);
  });
}

function renderLeadForm() {
  clearActions();

  const nameInput = document.createElement("input");
  nameInput.placeholder = "Your name";
  nameInput.className = "form-input";
  nameInput.type = "text";

  const emailInput = document.createElement("input");
  emailInput.placeholder = "Your email address";
  emailInput.className = "form-input";
  emailInput.type = "email";

  const submit = document.createElement("button");
  submit.className = "quick";
  submit.type = "button";
  submit.textContent = "Submit";

  nameInput.addEventListener("input", () => nameInput.classList.remove("error"));
  emailInput.addEventListener("input", () => emailInput.classList.remove("error"));

  submit.onclick = () => {
    const n = nameInput.value.trim();
    const e = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!n) {
      nameInput.classList.add("error");
      nameInput.focus();
      return;
    }
    if (!e || !emailRegex.test(e)) {
      emailInput.classList.add("error");
      emailInput.focus();
      return;
    }

    clearActions();
    addMessage(`${n} (${e})`, "user");
    addMessage("✅ Thanks! Our team will follow up shortly. Anything else I can help with?", "bot");
    renderNode("mainMenu");
  };

  actionsEl.appendChild(nameInput);
  actionsEl.appendChild(emailInput);
  actionsEl.appendChild(submit);
  nameInput.focus();
}

function renderChecklist(fields, nextKey) {
  clearActions();
  addMessage("Select any that you already know:", "bot");

  const selected = new Set();
  fields.forEach(f => {
    const btn = document.createElement("button");
    btn.className = "quick";
    btn.type = "button";
    btn.textContent = f;

    btn.onclick = () => {
      if (selected.has(f)) {
        selected.delete(f);
        btn.classList.remove("active");
      } else {
        selected.add(f);
        btn.classList.add("active");
      }
    };

    actionsEl.appendChild(btn);
  });

  const cont = document.createElement("button");
  cont.className = "quick";
  cont.type = "button";
  cont.textContent = "Continue \u2192";

  cont.onclick = () => {
    const picked = selected.size ? Array.from(selected).join(", ") : "No details yet";
    addMessage(picked, "user");
    renderNode(nextKey);
  };

  actionsEl.appendChild(cont);
}

function renderNode(nodeKey) {
  currentNodeKey = nodeKey;
  const node = knowledge[nodeKey];

  clearActions();

  if (!node) {
    addMessage("I want to make sure I help you properly. Please pick an option below.", "bot");
    renderNode("mainMenu");
    return;
  }

  showTypingIndicator();

  setTimeout(() => {
    hideTypingIndicator();
    addMessage(node.message, "bot");

    if (node.capture && node.fields && node.next) {
      renderChecklist(node.fields, node.next);
      return;
    }

    if (node.form) {
      renderLeadForm();
      return;
    }

    if (node.options) {
      addQuickReplies(node.options, node.next || null);
      return;
    }

    addQuickReplies([{ label: "Back to menu", next: "mainMenu" }]);
  }, 600);
}

function handleTyped() {
  const text = inputEl.value.trim();
  if (!text) return;

  addMessage(text, "user");
  inputEl.value = "";

  addMessage("I can help fastest if you pick one of the options below.", "bot");
  renderNode("mainMenu");
}

sendBtn.addEventListener("click", handleTyped);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleTyped();
});
