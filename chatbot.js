let currentNodeKey = "mainMenu";
let faqAnswerCount = 0;

const bubble = document.getElementById("chat-bubble");
const panel = document.getElementById("chat-panel");
const closeBtn = document.getElementById("chat-close");
const messagesEl = document.getElementById("chat-messages");
const actionsEl = document.getElementById("chat-actions");

const inputEl = document.getElementById("chat-input");
const sendBtn = document.getElementById("chat-send");

function openChat() {
  panel.classList.remove("hidden");
  // Start only once
  if (messagesEl.childElementCount === 0) renderNode("mainMenu");
}

function closeChat() {
  panel.classList.add("hidden");
}

bubble.addEventListener("click", openChat);
closeBtn.addEventListener("click", closeChat);

function addMessage(text, who = "bot") {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function clearActions() {
  actionsEl.innerHTML = "";
}

function addQuickReplies(options, fallbackNext = null) {
  clearActions();
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "quick";
    btn.type = "button";
    btn.textContent = opt.label;

    btn.onclick = () => {
      addMessage(opt.label, "user");

      // Basic handoff triggers (match your spec)
      const lower = opt.label.toLowerCase();
      if (lower.includes("talk") || lower.includes("human") || lower.includes("urgent")) {
        renderNode("human");
        return;
      }

      // Move to next
      if (opt.next) renderNode(opt.next);
      else if (fallbackNext) renderNode(fallbackNext);
    };

    actionsEl.appendChild(btn);
  });
}

function renderLeadForm() {
  clearActions();

  // Simple lead capture (no backend yet, still $0)
  const name = document.createElement("input");
  name.placeholder = "Name";
  name.className = "quick";
  name.style.borderRadius = "12px";
  name.style.flex = "1";
  name.style.whiteSpace = "normal";

  const email = document.createElement("input");
  email.placeholder = "Email";
  email.className = "quick";
  email.style.borderRadius = "12px";
  email.style.flex = "1";
  email.style.whiteSpace = "normal";

  const submit = document.createElement("button");
  submit.className = "quick";
  submit.type = "button";
  submit.textContent = "Submit";

  submit.onclick = () => {
    const n = name.value.trim();
    const e = email.value.trim();

    if (!n || !e || !e.includes("@")) {
      addMessage("Quick check—please enter a name and a valid email.", "bot");
      return;
    }

    addMessage(`Submitted: ${n} (${e})`, "user");
    addMessage("Thanks! Our team will follow up shortly. Anything else you’d like help with?", "bot");
    renderNode("mainMenu");
  };

  actionsEl.appendChild(name);
  actionsEl.appendChild(email);
  actionsEl.appendChild(submit);
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
        btn.style.opacity = "0.6";
      } else {
        selected.add(f);
        btn.style.opacity = "1";
      }
    };

    btn.style.opacity = "0.6";
    actionsEl.appendChild(btn);
  });

  const cont = document.createElement("button");
  cont.className = "quick";
  cont.type = "button";
  cont.textContent = "Continue";

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

  if (!node) {
    addMessage("I want to make sure I help you properly. Please pick an option below.", "bot");
    renderNode("mainMenu");
    return;
  }

  addMessage(node.message, "bot");

  // Count “FAQ-like” answers lightly (you can tune this)
  if (nodeKey === "pricing") faqAnswerCount++;
  if (faqAnswerCount >= 3) {
    addMessage("Want me to connect you with our team to help further?", "bot");
    renderNode("human");
    faqAnswerCount = 0;
    return;
  }

  if (node.capture && node.fields && node.next) {
    renderChecklist(node.fields, node.next);
    return;
  }

  if (node.form) {
    renderLeadForm();
    return;
  }

  if (node.options) {
    // node.next is the default next node for all options
    addQuickReplies(node.options, node.next || null);
    return;
  }

  // If no options, go back
  addQuickReplies([{ label: "Back to menu", next: "mainMenu" }]);
}

// Optional typing input (basic fallback -> routes to human)
function handleTyped() {
  const text = inputEl.value.trim();
  if (!text) return;

  addMessage(text, "user");
  inputEl.value = "";

  const lower = text.toLowerCase();
  const triggers = ["talk to someone", "talk to a human", "human", "urgent", "call", "price", "pricing"];
  const hit = triggers.some(t => lower.includes(t));

  if (hit) {
    renderNode("human");
  } else {
    addMessage("I can help fastest if you pick one of the options below.", "bot");
    renderNode("mainMenu");
  }
}

sendBtn.addEventListener("click", handleTyped);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleTyped();
});
