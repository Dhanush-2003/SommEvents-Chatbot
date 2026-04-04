/* =========================================================
   SommEvents – Comprehensive Knowledge Base
   =========================================================
   Defines the full conversation tree consumed by chatbot.js.

   Each key is a NODE that the state machine can navigate to.
   chatbot.js calls renderNode(key) to display a node.

   NODE SCHEMA
   -----------
   message      {string}    Bot message shown when entering this node.
   options      {Array}     Quick-reply buttons:
                              label  {string}  Button text
                              next   {string}  Target node key (optional)
                              tag    {string}  Analytics tag (optional)
   next         {string}    Default destination when options share one target.
   tag          {string}    Analytics tag recorded on every visit to this node.
   capture      {boolean}   Render a multi-select checklist instead of buttons.
   fields       {string[]}  Checklist labels (requires capture: true).
   form         {boolean}   Render the lead-capture form.
   formFields   {string[]}  Field keys for the form (default: ["name","email"]).
   calendly     {string}    Calendly URL — renders the booking prompt widget.

   ANALYTICS TAGS (conventions)
   ----------------------------
   Sales_Event    – event planning intent
   Sales_Gifting  – gifting intent
   Sales_SipClub  – wine / Sip Club intent
   Support_Pricing – pricing / booking questions
   Support_FAQ     – FAQ browsing
   Support_General – human handoff / general support
   ========================================================= */

const knowledge = {

  /* -------------------------------------------------------
     MAIN MENU
     ------------------------------------------------------- */
  mainMenu: {
    message: "Hi there! 👋 Welcome to SommEvents — Ontario's premier corporate event planning & wine experience company. How can I help you today?",
    options: [
      { label: "🎉 Plan an Event",               next: "plan_event",    tag: "Sales_Event" },
      { label: "🤝 Team Building & Experiences",  next: "team_building", tag: "Sales_Event" },
      { label: "🎁 Corporate & Custom Gifting",   next: "gifting",       tag: "Sales_Gifting" },
      { label: "🍷 Wine Experiences & Sip Club",  next: "wine",          tag: "Sales_SipClub" },
      { label: "💰 Pricing, Booking & Logistics", next: "pricing",       tag: "Support_Pricing" },
      { label: "💬 Talk to a Human",              next: "human",         tag: "Support_General" }
    ]
  },

  /* -------------------------------------------------------
     1. PLAN AN EVENT
     ------------------------------------------------------- */
  plan_event: {
    message: "Excellent! We love bringing events to life. What kind of event are you planning?",
    options: [
      { label: "Meeting or Conference" },
      { label: "Corporate Retreat" },
      { label: "Client or Executive Event" },
      { label: "Holiday or Celebration" },
      { label: "Not Sure Yet" }
    ],
    next: "planning_scope",
    tag: "Sales_Event"
  },

  planning_scope: {
    message: "How much support are you looking for?",
    options: [
      { label: "Full-service planning" },
      { label: "Partial planning / support" },
      { label: "On-site coordination only" },
      { label: "Just exploring options" }
    ],
    next: "event_details",
    tag: "Sales_Event"
  },

  event_details: {
    message: "Great! To tailor our recommendations, which details do you already have?",
    capture: true,
    fields: ["Event date or timeframe", "Number of guests", "Location or city", "Budget range"],
    next: "event_cta",
    tag: "Sales_Event"
  },

  event_cta: {
    message: "Thanks for sharing! We can absolutely support this. What would you like to do next?",
    options: [
      { label: "Request a proposal",        next: "lead_capture" },
      { label: "📅 Book a consultation",     next: "consultation_booking" },
      { label: "Ask another question",       next: "mainMenu" }
    ],
    tag: "Sales_Event"
  },

  /* -------------------------------------------------------
     2. TEAM BUILDING & EXPERIENCES
     ------------------------------------------------------- */
  team_building: {
    message: "Team experiences are what we do best — no awkward icebreakers, we promise! What type of experience interests you?",
    options: [
      { label: "Team Building Activity" },
      { label: "Leadership Development" },
      { label: "Workshop or Learning" },
      { label: "Retreat Add-on Activity" }
    ],
    next: "tb_format",
    tag: "Sales_Event"
  },

  tb_format: {
    message: "What format works best for your group?",
    options: [
      { label: "In-person" },
      { label: "Virtual" },
      { label: "Hybrid" },
      { label: "Open to ideas" }
    ],
    next: "tb_goals",
    tag: "Sales_Event"
  },

  tb_goals: {
    message: "What's the primary goal or tone you're going for?",
    options: [
      { label: "Team connection & bonding" },
      { label: "Celebration or reward" },
      { label: "Learning & development" },
      { label: "Client or partner engagement" }
    ],
    next: "tb_cta",
    tag: "Sales_Event"
  },

  tb_cta: {
    message: "Love it! Here's what we can do next:",
    options: [
      { label: "See experience examples", next: "tb_examples" },
      { label: "Request a quote",         next: "lead_capture" },
      { label: "Talk to our team",        next: "human" }
    ],
    tag: "Sales_Event"
  },

  tb_examples: {
    message: "Here are some of our most popular experiences:\n\n🍷 Wine & Food Pairing — guided tastings with a certified sommelier\n🍳 Culinary Challenges — hands-on team cooking competitions\n🧠 Strategy & Innovation Workshops — creative problem-solving\n🎨 Art & Wine Nights — paint + sip for team bonding\n🌿 Outdoor Adventures — vineyard tours, scavenger hunts\n💻 Virtual Tastings — curated kits shipped to each participant\n\nWant to explore any of these further?",
    options: [
      { label: "Request a quote",  next: "lead_capture" },
      { label: "Ask a question",   next: "faq_team_building" },
      { label: "Back to menu",     next: "mainMenu" }
    ],
    tag: "Sales_Event"
  },

  /* -------------------------------------------------------
     3. CORPORATE & CUSTOM GIFTING
     ------------------------------------------------------- */
  gifting: {
    message: "Great choice — a thoughtful gift goes a long way! What's the occasion?",
    options: [
      { label: "Holiday gifting" },
      { label: "Client appreciation" },
      { label: "Employee recognition" },
      { label: "Event-related gifting" },
      { label: "Special occasion" }
    ],
    next: "gifting_alcohol",
    tag: "Sales_Gifting"
  },

  gifting_alcohol: {
    message: "Do you want to include alcohol in the gifts?",
    options: [
      { label: "Yes — wine or spirits" },
      { label: "No — non-alcoholic only" },
      { label: "Mix — some of each" }
    ],
    next: "gifting_scale",
    tag: "Sales_Gifting"
  },

  gifting_scale: {
    message: "How many recipients are you gifting?",
    options: [
      { label: "1–10" },
      { label: "11–50" },
      { label: "51–200" },
      { label: "200+" }
    ],
    next: "gifting_cta",
    tag: "Sales_Gifting"
  },

  gifting_cta: {
    message: "We'll curate something special. What would you like to do?",
    options: [
      { label: "Explore gift options",      next: "gifting_options" },
      { label: "Start a gifting program",   next: "lead_capture" },
      { label: "Speak with a specialist",   next: "human" }
    ],
    tag: "Sales_Gifting"
  },

  gifting_options: {
    message: "Here's a taste of what we offer:\n\n🎁 Curated Gift Boxes — wine, artisanal foods, branded items\n🍷 Wine Collections — hand-picked selections by our sommeliers\n🧀 Charcuterie & Wine Sets — ready-to-enjoy pairings\n🌿 Wellness & Non-Alcoholic — teas, gourmet treats, self-care\n✨ Custom Branded — your logo, your style, our expertise\n📦 Bulk Programs — corporate gifting at scale with delivery logistics\n\nAll gifts can be customized and shipped anywhere in Canada.",
    options: [
      { label: "Start a gifting program",  next: "lead_capture" },
      { label: "Ask a question",           next: "faq_gifting" },
      { label: "Back to menu",             next: "mainMenu" }
    ],
    tag: "Sales_Gifting"
  },

  /* -------------------------------------------------------
     4. WINE EXPERIENCES & SIP CLUB
     ------------------------------------------------------- */
  wine: {
    message: "Wine is at the heart of everything we do! What interests you most?",
    options: [
      { label: "Wine Tasting Experience", next: "wine_route" },
      { label: "Corporate Wine Event",    next: "wine_corporate" },
      { label: "Sip Club Subscription",  next: "sip_club" },
      { label: "Wine Gifting",           next: "gifting" },
      { label: "Just Learning More",     next: "faq_wine" }
    ],
    tag: "Sales_SipClub"
  },

  wine_route: {
    message: "Is this for a corporate group or a private / personal occasion?",
    options: [
      { label: "Corporate group",      next: "wine_corporate" },
      { label: "Private / personal",   next: "wine_private" }
    ],
    tag: "Sales_SipClub"
  },

  wine_corporate: {
    message: "Our corporate wine experiences are designed to impress. We handle everything — from curated tastings to full vineyard retreats. What size group are you working with?",
    options: [
      { label: "Small (2–15)" },
      { label: "Medium (16–40)" },
      { label: "Large (41–100)" },
      { label: "100+" }
    ],
    next: "wine_cta",
    tag: "Sales_SipClub"
  },

  wine_private: {
    message: "Love it! We also do intimate private tastings, date nights, and special celebrations. Want to hear more?",
    options: [
      { label: "Yes, tell me more",  next: "wine_cta" },
      { label: "Go to Sip Club",     next: "sip_club" },
      { label: "Back to menu",       next: "mainMenu" }
    ],
    tag: "Sales_SipClub"
  },

  wine_cta: {
    message: "Here's what we can do next:",
    options: [
      { label: "Customize an experience",  next: "lead_capture" },
      { label: "Ask a question",           next: "faq_wine" },
      { label: "Contact our team",         next: "human" }
    ],
    tag: "Sales_SipClub"
  },

  sip_club: {
    message: "The SommEvents Sip Club is a curated wine subscription — delivered to your door. How are you interested in using it?",
    options: [
      { label: "Personal subscription" },
      { label: "Corporate gift" },
      { label: "Employee perk / program" }
    ],
    next: "sip_club_cta",
    tag: "Sales_SipClub"
  },

  sip_club_cta: {
    message: "Each Sip Club box includes hand-selected wines, tasting notes, food pairing guides, and access to exclusive virtual events. Ready to get started?",
    options: [
      { label: "Sign me up!",        next: "lead_capture" },
      { label: "Learn more",         next: "faq_sip_club" },
      { label: "Back to menu",       next: "mainMenu" }
    ],
    tag: "Sales_SipClub"
  },

  /* -------------------------------------------------------
     5. PRICING, BOOKING & LOGISTICS
     ------------------------------------------------------- */
  pricing: {
    message: "Everything we do is customized — no cookie-cutter packages here. What would you like to know?",
    options: [
      { label: "How pricing works" },
      { label: "Budget flexibility" },
      { label: "Deposits & payments" },
      { label: "Packages vs. custom" }
    ],
    next: "pricing_info",
    tag: "Support_Pricing"
  },

  pricing_info: {
    message: "Our pricing is customized based on your event scope, goals, guest count, location, and customization level.\n\nBecause every experience is different, we don’t list fixed prices in-chat. If you share a few details (date/timeframe, group size, city, and what you’re aiming for), we’ll put together a clear custom quote — and we’ll work within your budget wherever possible.",
    options: [
      { label: "Request a custom quote",   next: "lead_capture" },
      { label: "How does booking work?",   next: "booking_stage" },
      { label: "Logistics & policies",     next: "logistics" },
      { label: "Talk to our team",         next: "human" },
      { label: "Ask another question",     next: "mainMenu" }
    ],
    tag: "Support_Pricing"
  },

  booking_stage: {
    message: "Where are you in the booking process?",
    options: [
      { label: "Just researching" },
      { label: "Ready to book" },
      { label: "Need internal approval first" },
      { label: "Urgent — need this soon!" }
    ],
    next: "booking_cta",
    tag: "Support_Pricing"
  },

  booking_cta: {
    message: "Got it! Let's move things forward.",
    options: [
      { label: "Request detailed pricing",  next: "lead_capture" },
      { label: "📅 Book a consultation",     next: "consultation_booking" },
      { label: "Talk to a human",            next: "human" }
    ],
    tag: "Support_Pricing"
  },

  /* -------------------------------------------------------
     6. SOMETHING ELSE / FALLBACK
     ------------------------------------------------------- */
  something_else: {
    message: "No problem! Here are a few things I can help with. Or feel free to type your question below.",
    options: [
      { label: "Browse FAQs",         next: "faq_main" },
      { label: "Talk to our team",    next: "human" },
      { label: "Back to main menu",   next: "mainMenu" }
    ],
    tag: "Support_General"
  },

  /* -------------------------------------------------------
     HUMAN HANDOFF
     ------------------------------------------------------- */
  human: {
    message: "Absolutely! Our team is here for you. How would you like to connect?",
    options: [
      { label: "📧 Have someone email me",    next: "lead_capture" },
      { label: "📞 Request a call back",       next: "lead_capture_phone" },
      { label: "📅 Book a consultation",       next: "consultation_booking" },
      { label: "💬 Chat on WhatsApp",          next: "_whatsapp" },
      { label: "Not right now",                next: "mainMenu" }
    ],
    tag: "Support_General"
  },

  /* -------------------------------------------------------
     LEAD CAPTURE FORMS
     ------------------------------------------------------- */
  lead_capture: {
    message: "Please share your details and we'll follow up within 24 hours.",
    form: true,
    formFields: ["name", "email"],
    tag: "Lead_Capture"
  },

  lead_capture_phone: {
    message: "We'd love to chat! Please share your info and preferred call time.",
    form: true,
    formFields: ["name", "email", "phone", "company"],
    tag: "Lead_Capture"
  },

  /* -------------------------------------------------------
     CONSULTATION BOOKING (Calendly)
     ------------------------------------------------------- */
  consultation_booking: {
    message: "Let's find a time to chat! You can book a consultation directly on our calendar — pick whatever time works best for you:",
    calendly: "https://calendly.com/marte",
    tag: "Lead_Capture"
  },

  /* -------------------------------------------------------
     LOGISTICS & POLICIES
     ------------------------------------------------------- */
  logistics: {
    message: "We can help with insurance, accessibility, confidentiality, and approvals. What would you like to know?",
    options: [
      { label: "Do you carry insurance?",          next: "faq_l1" },
      { label: "Accessibility accommodations?",     next: "faq_l2" },
      { label: "Handle confidential events?",       next: "faq_l3" },
      { label: "Work with internal approvals?",     next: "faq_l4" },
      { label: "Request details",                   next: "lead_capture" },
      { label: "Talk to a human",                   next: "human" }
    ],
    tag: "Support_Logistics"
  },

  faq_l1: {
    message: "Yes — SommEvents carries full general liability insurance for all events we coordinate. If your venue requires a certificate of insurance (COI), we can provide one. We're happy to meet any insurance requirements your organization has.",
    options: [{ label: "More questions", next: "logistics" }, { label: "Get details", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },
  faq_l2: {
    message: "Absolutely. Accessibility is core to our planning process. We assess venues for wheelchair access, arrange dietary accommodations, and tailor experiences so everyone can fully participate — regardless of ability or dietary needs.",
    options: [{ label: "More questions", next: "logistics" }, { label: "Get details", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },
  faq_l3: {
    message: "Yes. We understand that many corporate events require discretion. We operate under strict confidentiality and are happy to sign NDAs. Guest lists, event details, and organizational information stay completely private.",
    options: [{ label: "More questions", next: "logistics" }, { label: "Get details", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },
  faq_l4: {
    message: "We work with internal procurement and approval processes all the time. We provide formal proposals, itemized quotes, vendor information, and any documentation your team needs to get sign-off. We're comfortable with PO processes and corporate invoicing.",
    options: [{ label: "More questions", next: "logistics" }, { label: "Get details", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },


  faq_main: {
    message: "What topic would you like to explore?",
    options: [
      { label: "About SommEvents",       next: "faq_general" },
      { label: "Event Planning",          next: "faq_events" },
      { label: "Team Building",           next: "faq_team_building" },
      { label: "Wine & Culinary",         next: "faq_wine" },
      { label: "Gifting",                 next: "faq_gifting" },
      { label: "Sip Club",               next: "faq_sip_club" },
      { label: "Booking & Process",       next: "faq_booking" },
      { label: "Pricing & Policies",      next: "faq_pricing" }
    ],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: General / About ----------- */
  faq_general: {
    message: "Here are common questions about SommEvents:",
    options: [
      { label: "What is SommEvents?",           next: "faq_g1" },
      { label: "Where are you located?",         next: "faq_g2" },
      { label: "How long in business?",          next: "faq_g3" },
      { label: "What makes you different?",      next: "faq_g4" },
      { label: "Do you operate across Canada?",  next: "faq_g5" },
      { label: "Who is on the team?",            next: "faq_g6" },
      { label: "How do I contact you?",          next: "faq_g7" }
    ],
    tag: "Support_FAQ"
  },
  faq_g1: {
    message: "SommEvents is a premium corporate event planning, team building, and wine experience company based in Ontario, Canada. We specialize in creating elevated, thoughtful experiences — from intimate tastings and team offsites to large-scale corporate events and curated gifting programs.",
    options: [{ label: "More questions", next: "faq_general" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g2: {
    message: "We're based in Ontario, Canada, and primarily serve the Greater Toronto Area and surrounding regions. We also coordinate events across Canada and can arrange experiences in other provinces.",
    options: [{ label: "More questions", next: "faq_general" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g3: {
    message: "SommEvents has been in business for over 10 years. Our team brings deep expertise in hospitality, event production, sommelier services, and corporate experiences.",
    options: [{ label: "More questions", next: "faq_general" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g4: {
    message: "What sets us apart:\n\n✦ We don't do generic — every experience is custom-designed\n✦ Certified sommeliers on staff guide every wine experience\n✦ 10+ years of corporate event expertise\n✦ Inclusive by design — non-alcoholic options, dietary accommodations, accessibility focus\n✦ End-to-end service — we handle planning, logistics, and execution\n✦ We make it personal, not cookie-cutter",
    options: [{ label: "More questions", next: "faq_general" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g5: {
    message: "Yes! While we're based in Ontario, we coordinate events and ship gifts across Canada. For out-of-province events, we work with trusted local partners to ensure a seamless experience.",
    options: [{ label: "More questions", next: "faq_general" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g6: {
    message: "Our team includes certified sommeliers, event planners, culinary experts, and experience designers. We're a tight-knit crew passionate about creating moments people actually enjoy.",
    options: [{ label: "More questions", next: "faq_general" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g7: {
    message: "You can reach us at:\n\n📧 Email: info@sommevents.com\n🌐 Website: sommevents.com\n\nOr just let me know here and I'll connect you with our team!",
    options: [{ label: "Connect me", next: "human" }, { label: "More questions", next: "faq_general" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Corporate Event Planning ----------- */
  faq_events: {
    message: "Common questions about corporate event planning:",
    options: [
      { label: "What events do you plan?",       next: "faq_e1" },
      { label: "How far in advance to book?",    next: "faq_e2" },
      { label: "Can you handle large events?",   next: "faq_e3" },
      { label: "Do you manage venues?",          next: "faq_e4" },
      { label: "What's included?",               next: "faq_e5" },
      { label: "Can you do themed events?",      next: "faq_e6" }
    ],
    tag: "Support_FAQ"
  },
  faq_e1: {
    message: "We plan a wide range of corporate events including:\n\n• Meetings & conferences\n• Corporate retreats & offsites\n• Client appreciation events\n• Holiday parties & galas\n• Product launches\n• Executive dinners\n• Award ceremonies\n• Company milestones\n\nIf it's a corporate gathering, we can make it exceptional.",
    options: [{ label: "More questions", next: "faq_events" }, { label: "Plan my event", next: "plan_event" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_e2: {
    message: "We recommend booking 4–8 weeks in advance for most events, and 3–6 months for large-scale events or galas. That said, we've pulled off incredible last-minute events too — just reach out and we'll see what's possible!",
    options: [{ label: "More questions", next: "faq_events" }, { label: "Plan my event", next: "plan_event" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_e3: {
    message: "Absolutely! We've coordinated events for groups of 10 to 500+. Whether it's an intimate dinner or a large corporate gala, we scale our services to match your needs.",
    options: [{ label: "More questions", next: "faq_events" }, { label: "Plan my event", next: "plan_event" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_e4: {
    message: "Yes — we can help source and manage venues, or work with a venue you've already selected. We have partnerships with some of the best spaces in Ontario, from boutique wineries to downtown event halls.",
    options: [{ label: "More questions", next: "faq_events" }, { label: "Plan my event", next: "plan_event" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_e5: {
    message: "Our full-service planning covers:\n\n• Concept & theme development\n• Venue sourcing & management\n• Catering & bar coordination\n• Entertainment & speakers\n• Décor, AV & logistics\n• On-site event management\n• Guest communication & RSVP\n• Post-event follow-up\n\nWe can also provide partial support if you just need help with specific areas.",
    options: [{ label: "More questions", next: "faq_events" }, { label: "Plan my event", next: "plan_event" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_e6: {
    message: "Yes! Themed events are one of our specialties. We've done everything from vineyard harvest themes to Great Gatsby galas, winter wonderlands, and around-the-world culinary tours. Tell us your vision and we'll bring it to life.",
    options: [{ label: "More questions", next: "faq_events" }, { label: "Plan my event", next: "plan_event" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Team Building ----------- */
  faq_team_building: {
    message: "Questions about team building & experiences:",
    options: [
      { label: "What experiences do you offer?",   next: "faq_tb1" },
      { label: "Virtual options available?",        next: "faq_tb2" },
      { label: "Min / max group size?",             next: "faq_tb3" },
      { label: "How long are experiences?",         next: "faq_tb4" },
      { label: "Can you customize activities?",     next: "faq_tb5" },
      { label: "Non-alcoholic options?",            next: "faq_tb6" }
    ],
    tag: "Support_FAQ"
  },
  faq_tb1: {
    message: "Our team building experiences include:\n\n🍷 Wine & food pairing workshops\n🍳 Culinary team challenges\n🎨 Art & wine nights\n🧀 Cheese & charcuterie masterclasses\n🎯 Strategy & innovation games\n🌿 Vineyard tours & outdoor adventures\n💻 Virtual tasting experiences\n🧠 Leadership & communication workshops\n\nEvery experience is designed to be engaging, inclusive, and actually fun — no awkward icebreakers!",
    options: [{ label: "More questions", next: "faq_team_building" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_tb2: {
    message: "Yes! Our virtual experiences are one of our most popular offerings. We ship curated tasting kits to each participant and host live, interactive sessions led by a certified sommelier. They work great for remote teams and multi-city groups.",
    options: [{ label: "More questions", next: "faq_team_building" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_tb3: {
    message: "Most experiences work well for groups of 8–100+. For smaller groups (2–7), we can arrange intimate, customized sessions. For very large groups (200+), we create multiple concurrent stations or breakout sessions.",
    options: [{ label: "More questions", next: "faq_team_building" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_tb4: {
    message: "Most experiences run 1.5–3 hours. We can adjust timing based on your schedule — shorter sessions for conference add-ons (45 min), or full half-day / full-day programs for retreats.",
    options: [{ label: "More questions", next: "faq_team_building" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_tb5: {
    message: "Absolutely! Every experience is customized to your goals, group size, dietary needs, and preferences. Want a competitive twist? A learning focus? A pure celebration vibe? We'll tailor it.",
    options: [{ label: "More questions", next: "faq_team_building" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_tb6: {
    message: "Always! Inclusivity is core to what we do. Every experience includes non-alcoholic beverage options, and we accommodate all dietary requirements (vegan, gluten-free, halal, kosher, allergies). Nobody gets left out.",
    options: [{ label: "More questions", next: "faq_team_building" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Wine & Culinary ----------- */
  faq_wine: {
    message: "Questions about wine & culinary experiences:",
    options: [
      { label: "What wine experiences?",           next: "faq_w1" },
      { label: "Do I need to know about wine?",    next: "faq_w2" },
      { label: "Where are tastings held?",          next: "faq_w3" },
      { label: "Can you come to our office?",      next: "faq_w4" },
      { label: "Food included?",                    next: "faq_w5" },
      { label: "Private events?",                   next: "faq_w6" }
    ],
    tag: "Support_FAQ"
  },
  faq_w1: {
    message: "Our wine & culinary experiences include:\n\n🍷 Guided wine tastings (beginner to advanced)\n🧀 Wine & cheese / charcuterie pairings\n🍳 Cooking classes with wine pairing\n🍾 Sparkling wine & cocktail workshops\n🏞️ Vineyard tours in Ontario wine country\n🍕 Pizza & wine nights\n🌍 Around-the-world wine tours\n📚 Wine education & certification prep",
    options: [{ label: "More questions", next: "faq_wine" }, { label: "Book an experience", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_w2: {
    message: "Not at all! Our experiences are designed for all levels — from total beginners to seasoned wine enthusiasts. Our sommeliers make everything approachable, fun, and jargon-free.",
    options: [{ label: "More questions", next: "faq_wine" }, { label: "Book an experience", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_w3: {
    message: "We host tastings at various locations:\n\n• Partner wineries & vineyards in Ontario\n• Private dining rooms & event spaces\n• Your office or venue of choice\n• Virtual (kits shipped to participants)\n\nWe'll help find the perfect setting for your group.",
    options: [{ label: "More questions", next: "faq_wine" }, { label: "Book an experience", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_w4: {
    message: "Absolutely! We bring the full experience to you — wine, glassware, food pairings, and a sommelier host. All you need is a space and we handle the rest.",
    options: [{ label: "More questions", next: "faq_wine" }, { label: "Book an experience", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_w5: {
    message: "Most of our tastings include food pairings — cheese, charcuterie, or light bites selected to complement the wines. For culinary experiences, food is the star! We accommodate all dietary needs.",
    options: [{ label: "More questions", next: "faq_wine" }, { label: "Book an experience", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_w6: {
    message: "Yes! We host private wine experiences for birthdays, anniversaries, date nights, bachelorettes, and any celebration. These can be customized to your preferences, group size, and budget.",
    options: [{ label: "More questions", next: "faq_wine" }, { label: "Book an experience", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Gifting ----------- */
  faq_gifting: {
    message: "Questions about corporate & custom gifting:",
    options: [
      { label: "What's in a gift box?",         next: "faq_gf1" },
      { label: "Can I customize gifts?",        next: "faq_gf2" },
      { label: "Minimum order quantity?",       next: "faq_gf3" },
      { label: "Where do you ship?",            next: "faq_gf4" },
      { label: "How far ahead to order?",       next: "faq_gf5" },
      { label: "Non-alcoholic gifts?",          next: "faq_gf6" }
    ],
    tag: "Support_FAQ"
  },
  faq_gf1: {
    message: "Our gift boxes are curated collections that can include:\n\n🍷 Hand-selected wines\n🧀 Artisanal cheeses & charcuterie\n🍫 Gourmet chocolates & treats\n☕ Premium coffee & tea\n🫒 Olive oils, spreads & pantry items\n🕯️ Candles & self-care products\n📝 Branded items (your logo!)\n\nEvery box is beautifully presented and can include a personalized card.",
    options: [{ label: "More questions", next: "faq_gifting" }, { label: "Start gifting", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_gf2: {
    message: "Absolutely! Customization is our specialty. You can choose specific items, add branded packaging, include personalized messages, select colour themes, and more. We'll work with you to create something that feels truly special.",
    options: [{ label: "More questions", next: "faq_gifting" }, { label: "Start gifting", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_gf3: {
    message: "There's no strict minimum — we can create a single bespoke gift or hundreds for a corporate program. For the best per-unit pricing, orders of 10+ tend to work best.",
    options: [{ label: "More questions", next: "faq_gifting" }, { label: "Start gifting", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_gf4: {
    message: "We ship anywhere in Canada! For Ontario orders, we can handle same-week delivery. Cross-country shipments typically take 3–7 business days. We also coordinate direct-to-recipient delivery for corporate programs.",
    options: [{ label: "More questions", next: "faq_gifting" }, { label: "Start gifting", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_gf5: {
    message: "For custom orders, we recommend 2–3 weeks lead time. During peak seasons (November–December), 4–6 weeks is ideal. Rush orders may be possible — just ask!",
    options: [{ label: "More questions", next: "faq_gifting" }, { label: "Start gifting", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_gf6: {
    message: "Of course! We have a wonderful selection of non-alcoholic gift options including gourmet teas, artisanal coffee, chocolates, wellness products, and specialty food items. Everyone deserves a thoughtful gift.",
    options: [{ label: "More questions", next: "faq_gifting" }, { label: "Start gifting", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Sip Club ----------- */
  faq_sip_club: {
    message: "Questions about the Sip Club wine subscription:",
    options: [
      { label: "What is Sip Club?",             next: "faq_sc1" },
      { label: "How does it work?",             next: "faq_sc2" },
      { label: "What's included?",              next: "faq_sc3" },
      { label: "Can I gift a subscription?",    next: "faq_sc4" },
      { label: "How much does it cost?",        next: "faq_sc5" },
      { label: "Can I cancel anytime?",         next: "faq_sc6" }
    ],
    tag: "Support_FAQ"
  },
  faq_sc1: {
    message: "Sip Club is SommEvents' curated wine subscription service. Each month (or quarter), you receive hand-selected wines chosen by our certified sommeliers, along with tasting notes, food pairing guides, and access to exclusive virtual tasting events.",
    options: [{ label: "More questions", next: "faq_sip_club" }, { label: "Join Sip Club", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_sc2: {
    message: "Here's how it works:\n\n1️⃣ Choose your plan (monthly or quarterly)\n2️⃣ Tell us your preferences (red, white, rosé, sparkling, mixed)\n3️⃣ We curate a selection just for you\n4️⃣ Wines are delivered to your door\n5️⃣ Join our exclusive virtual tasting events\n\nIt's like having a personal sommelier!",
    options: [{ label: "More questions", next: "faq_sip_club" }, { label: "Join Sip Club", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_sc3: {
    message: "Each Sip Club delivery includes:\n\n🍷 2–4 hand-selected wines\n📝 Detailed tasting notes for each bottle\n🍽️ Food pairing suggestions\n🎥 Access to virtual tasting events\n💡 Wine education tidbits\n🎉 Exclusive member discounts on events & gifting",
    options: [{ label: "More questions", next: "faq_sip_club" }, { label: "Join Sip Club", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_sc4: {
    message: "Yes! Sip Club makes an incredible gift — for clients, employees, or wine-loving friends. We offer gift subscriptions for 1, 3, 6, or 12 months, complete with a beautiful welcome card.",
    options: [{ label: "More questions", next: "faq_sip_club" }, { label: "Gift a subscription", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_sc5: {
    message: "Sip Club pricing depends on factors like your plan (monthly vs. quarterly), number of bottles, wine style preferences, and delivery details.\n\nFor the most accurate info, share what you’re looking for and we’ll recommend an option that fits — including corporate/employee program pricing if that applies.",
    options: [{ label: "More questions", next: "faq_sip_club" }, { label: "Join Sip Club", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_sc6: {
    message: "Yes — there are no long-term commitments. You can pause, skip, or cancel your subscription at any time. We just ask for notice before your next billing cycle.",
    options: [{ label: "More questions", next: "faq_sip_club" }, { label: "Join Sip Club", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Booking & Process ----------- */
  faq_booking: {
    message: "Questions about our booking process:",
    options: [
      { label: "How do I book?",                   next: "faq_b1" },
      { label: "What's the process like?",         next: "faq_b2" },
      { label: "How far in advance?",              next: "faq_b3" },
      { label: "Can I change my booking?",         next: "faq_b4" },
      { label: "Cancellation policy?",             next: "faq_b5" },
      { label: "Do you require a deposit?",        next: "faq_b6" }
    ],
    tag: "Support_FAQ"
  },
  faq_b1: {
    message: "Booking is easy! Here's how:\n\n1️⃣ Reach out via this chat, email (info@sommevents.com), or our website\n2️⃣ We'll schedule a quick discovery call\n3️⃣ Receive a custom proposal & quote\n4️⃣ Approve and secure your date with a deposit\n5️⃣ We handle the rest!\n\nMost bookings are confirmed within 48 hours.",
    options: [{ label: "More questions", next: "faq_booking" }, { label: "Start booking", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_b2: {
    message: "Our process:\n\n📞 Discovery — We learn about your vision, goals, and logistics\n📋 Proposal — Detailed custom proposal with options and pricing\n✅ Confirmation — You approve and we lock in your date\n🎨 Planning — We design and coordinate everything\n🎉 Execution — We bring it to life on event day\n💬 Follow-up — Post-event debrief and feedback",
    options: [{ label: "More questions", next: "faq_booking" }, { label: "Start booking", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_b3: {
    message: "Recommended lead times:\n\n• Small experiences (tastings, workshops): 2–4 weeks\n• Medium events (team building, dinners): 4–8 weeks\n• Large events (galas, retreats): 3–6 months\n• Holiday / peak season: Book early!\n\nWe can accommodate shorter timelines when possible.",
    options: [{ label: "More questions", next: "faq_booking" }, { label: "Start booking", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_b4: {
    message: "Yes! We understand plans change. We'll work with you to adjust dates, guest counts, or details as needed. Just give us as much notice as possible so we can accommodate changes smoothly.",
    options: [{ label: "More questions", next: "faq_booking" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_b5: {
    message: "Our cancellation policy depends on the type and scale of your event. Generally:\n\n• 30+ days: Full refund (minus deposit)\n• 15–29 days: 50% refund\n• Under 15 days: Non-refundable\n\nSpecific terms are outlined in your contract. We always try to be fair and flexible.",
    options: [{ label: "More questions", next: "faq_booking" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_b6: {
    message: "Yes, we typically require a deposit to secure your date — usually 25–50% of the total, depending on the event scope. The remaining balance is due before the event date. We accept e-transfer, credit card, and corporate invoicing.",
    options: [{ label: "More questions", next: "faq_booking" }, { label: "Start booking", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Pricing & Policies ----------- */
  faq_pricing: {
    message: "Questions about pricing & policies:",
    options: [
      { label: "How is pricing determined?",     next: "faq_p1" },
      { label: "Do you have set packages?",      next: "faq_p2" },
      { label: "Can you work with my budget?",   next: "faq_p3" },
      { label: "What's included in the price?",  next: "faq_p4" },
      { label: "Payment methods?",               next: "faq_p5" },
      { label: "Are there hidden fees?",         next: "faq_p6" }
    ],
    tag: "Support_FAQ"
  },
  faq_p1: {
    message: "Pricing is customized based on:\n\n• Type of experience or event\n• Group size\n• Level of customization\n• Venue and location\n• Duration\n• Special requirements\n\nWe provide transparent, itemized quotes so you know exactly what you're paying for.",
    options: [{ label: "More questions", next: "faq_pricing" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_p2: {
    message: "We offer starting-point packages that serve as a foundation, but everything is customizable. We'd rather create something perfect for you than force a one-size-fits-all approach.",
    options: [{ label: "More questions", next: "faq_pricing" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_p3: {
    message: "Absolutely! We work with a wide range of budgets. Just let us know your range and we'll design something spectacular within it. There's always a way to create an amazing experience.",
    options: [{ label: "More questions", next: "faq_pricing" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_p4: {
    message: "Our pricing typically includes:\n\n✓ Event planning & coordination\n✓ All food & beverage (where applicable)\n✓ Sommelier / host facilitation\n✓ Materials & supplies\n✓ Setup & teardown\n✓ GST/HST\n\nVenue rental, special equipment, or premium add-ons may be quoted separately. Everything is transparent — no surprises.",
    options: [{ label: "More questions", next: "faq_pricing" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_p5: {
    message: "We accept:\n\n💳 Credit cards (Visa, Mastercard, Amex)\n🏦 E-transfer\n📄 Corporate invoicing (NET 15/30)\n\nWe're happy to work with your company's procurement process.",
    options: [{ label: "More questions", next: "faq_pricing" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_p6: {
    message: "No hidden fees — ever. Our quotes are transparent and itemized. If there are any optional add-ons, they're clearly listed as separate line items. What you see is what you get.",
    options: [{ label: "More questions", next: "faq_pricing" }, { label: "Get a quote", next: "lead_capture" }, { label: "Back to menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  }
};

/* -------------------------------------------------------
   FAQ SEARCH INDEX
   -------------------------------------------------------
   Flat array built once at load time from all nodes whose
   key starts with "faq_". Each entry stores the lowercased
   node message for fast substring matching in chatbot.js.
   ------------------------------------------------------- */
const faqSearchIndex = [];
(function buildFaqIndex() {
  for (const [key, node] of Object.entries(knowledge)) {
    if (key.startsWith("faq_") && node.message) {
      faqSearchIndex.push({ key, text: node.message.toLowerCase() });
    }
  }
})();
