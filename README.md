# SommEvents Chatbot

A lightweight, embeddable chat widget for [SommEvents](https://sommevents.com) — Ontario's premier corporate event planning and wine experience company.

---

## Overview

The chatbot guides website visitors through a structured conversation tree (state machine), helping them explore services, capture leads, book consultations via Calendly, and search a built-in FAQ. All interactions are tracked in Supabase for analytics.

**Key capabilities:**
- 🗺️ Guided conversation flow (multi-level menu)
- 📅 Calendly booking integration
- 🔍 Keyword-based FAQ search
- 📋 Lead capture form with Supabase persistence
- 📊 Session analytics (paths, drop-offs, ratings)
- ⚡ Escalation detection (pricing loops, frustration keywords)
- ♿ Accessible (ARIA labels, focus trap, keyboard navigation)

---

## File Structure

```
├── index.html          # Chat widget markup (bubble + panel)
├── style.css           # All widget styles (responsive, dark-themed)
├── knowledge.js        # Conversation tree — all nodes, messages, and options
├── ui.js               # DOM helpers — renders messages, buttons, forms, Calendly prompt
├── analytics.js        # Session tracking — Supabase inserts, escalation callbacks
├── chatbot.js          # Orchestrator — state machine, NLP input handling, event listeners
└── supabase/
    ├── config.toml
    └── migrations/
        ├── 20260319204530_create_chatbot_tables.sql   # Creates leads, sessions, dropoffs tables
        └── 20260331000000_enable_rls_policies.sql     # RLS: anon insert-only access
```

---

## Architecture

```
User interaction
      │
      ▼
 chatbot.js  ◄──── knowledge.js  (conversation tree / content)
      │
      ├──► ui.js        (render messages, buttons, forms, Calendly)
      └──► analytics.js (track nodes, leads, drop-offs → Supabase)
```

`chatbot.js` is the single orchestrator. It reads nodes from `knowledge.js`, delegates all DOM rendering to `ui.js`, and delegates all tracking to `analytics.js`.

---

## Conversation Node Schema

Each key in `knowledge.js` is a **node**:

| Property | Type | Description |
|---|---|---|
| `message` | `string` | Bot message displayed when the node is entered |
| `options` | `{label, next?, tag?}[]` | Quick-reply buttons. `next` is the target node key. |
| `next` | `string` | Default next node (used when options share the same destination) |
| `tag` | `string` | Analytics tag for the node (e.g. `"Sales_Event"`) |
| `capture` | `boolean` | If `true`, renders a checklist instead of buttons |
| `fields` | `string[]` | Checklist field labels (used when `capture: true`) |
| `form` | `boolean` | If `true`, renders the lead-capture form |
| `formFields` | `string[]` | Lead form fields (e.g. `["name","email","phone"]`) |
| `calendly` | `string` | Calendly scheduling URL; triggers the booking prompt |

---

## Supabase Setup

### Tables

The migration at `supabase/migrations/20260319204530_create_chatbot_tables.sql` creates:

- **`leads`** — captured contact details (name, email, phone, consultation time)
- **`sessions`** — completed conversation data (path, tags, rating, message count)
- **`dropoffs`** — records when users close the chat mid-conversation

### Row Level Security

`supabase/migrations/20260331000000_enable_rls_policies.sql` locks down access:
- The **anon** (publishable) key can only **INSERT** — no reads or deletes from the browser.
- The **service_role** key (used from the Supabase dashboard or a backend) bypasses RLS and can read everything.

### Environment Variables

Update the Supabase credentials at the top of `analytics.js`:

```js
const supabaseUrl = 'https://<your-project>.supabase.co';
const supabaseKey = '<your-anon-publishable-key>';
```

> ⚠️ The anon/publishable key is safe to expose client-side because RLS restricts it to insert-only. Never use the `service_role` key in the browser.

---

## Embedding

1. Include the Supabase JS CDN before your scripts:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ```
2. Load scripts in this order (dependencies first):
   ```html
   <script src="knowledge.js"></script>
   <script src="ui.js"></script>
   <script src="analytics.js"></script>
   <script src="chatbot.js"></script>
   ```
3. Copy the `#chat-bubble` and `#chat-panel` markup from `index.html` into your page.
4. Include `style.css`.

---

## Calendly Integration

Set the `calendly` property on any node in `knowledge.js` to a Calendly scheduling URL:

```js
consultation_booking: {
  message: "Pick a time that works for you!",
  calendly: "https://calendly.com/your-handle/consultation",
  tag: "Sales_Booking"
}
```

The widget will display a **"Book a Time on Calendly"** button (opens in a new tab) and a **"I'd rather leave my details"** fallback that routes to the lead-capture form.

---

## Analytics Events

| Event | Trigger |
|---|---|
| `trackNode` | Every time a conversation node is rendered |
| `trackFAQSearch` | When a user submits a free-text or FAQ search |
| `trackHandoff` | When escalation to a human is triggered |
| `trackLead` | When the lead-capture form is submitted |
| `trackRating` | When the user submits a star rating at the end |
| `trackDropoff` | When the chat panel is closed mid-conversation |

Escalation is auto-triggered when:
- Pricing asked **3+ times** (`repeated_pricing`)
- **3+ FAQ views** with no lead captured (`faq_loop_no_conversion`)

---

## Local Development

No build step required — all files are plain HTML/CSS/JS.

1. Clone the repo.
2. Open `index.html` directly in a browser, or serve with any static file server:
   ```bash
   npx serve .
   # or
   python3 -m http.server
   ```
3. Open the browser console to see `[SommEvents Analytics]` log output.
