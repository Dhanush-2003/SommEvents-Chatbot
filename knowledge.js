const knowledge = {
  mainMenu: {
    message: "Hi! Welcome to SommEvents. How can I help you today?",
    options: [
      { label: "Plan an Event", next: "plan_event", tag: "Sales_Event" },
      { label: "Team Building or Experiences", next: "team_building", tag: "Sales_Event" },
      { label: "Corporate or Custom Gifting", next: "gifting", tag: "Sales_Gifting" },
      { label: "Wine Experiences or Sip Club", next: "wine", tag: "Sales_SipClub" },
      { label: "Pricing, Booking, or Logistics", next: "pricing", tag: "Support_Pricing" },
      { label: "Talk to a Human", next: "human", tag: "Support_Logistics" }
    ]
  },

  plan_event: {
    message: "What kind of event are you planning?",
    options: [
      { label: "Meeting or Conference" },
      { label: "Corporate Retreat" },
      { label: "Client or Executive Event" },
      { label: "Holiday or Celebration Event" },
      { label: "Not Sure Yet" }
    ],
    next: "planning_scope"
  },

  planning_scope: {
    message: "How much support are you looking for?",
    options: [
      { label: "Full-service event planning" },
      { label: "Partial planning or support" },
      { label: "On-site coordination only" },
      { label: "Just exploring options" }
    ],
    next: "event_details"
  },

  event_details: {
    message: "To help us guide you better, which details do you have?",
    capture: true,
    fields: ["Event date or timeframe", "Number of guests", "Location or city", "Budget range"],
    next: "event_cta"
  },

  event_cta: {
    message: "Thanks! We can absolutely support this. Would you like to request a proposal or book a consultation?",
    options: [
      { label: "Request a proposal", next: "lead_capture" },
      { label: "Book a consultation", next: "lead_capture" },
      { label: "Ask another question", next: "mainMenu" }
    ]
  },

  gifting: {
    message: "What’s the gifting for?",
    options: [
      { label: "Holiday gifting" },
      { label: "Client appreciation" },
      { label: "Employee recognition" },
      { label: "Event-related gifting" },
      { label: "Special occasion" }
    ],
    next: "gifting_scale"
  },

  gifting_scale: {
    message: "How many recipients are you gifting?",
    options: [{ label: "1–10" }, { label: "11–50" }, { label: "51–200" }, { label: "200+" }],
    next: "lead_capture"
  },

  pricing: {
    message: "Pricing is customized based on scope, goals, and scale. We don’t use one-size-fits-all packages.",
    options: [
      { label: "Request a quote", next: "lead_capture" },
      { label: "Talk to a human", next: "human" }
    ]
  },

  wine: {
    message: "What are you interested in?",
    options: [
      { label: "Wine tasting or workshop" },
      { label: "Corporate wine experience" },
      { label: "Sip Club subscription" },
      { label: "Wine gifting" },
      { label: "Just learning more" }
    ],
    next: "lead_capture"
  },

  team_building: {
    message: "What kind of team building or experience are you looking for?",
    options: [
      { label: "Wine tasting or workshop" },
      { label: "Cooking or culinary experience" },
      { label: "Outdoor or adventure activity" },
      { label: "Virtual team experience" },
      { label: "Custom or unique experience" }
    ],
    next: "team_building_scope"
  },

  team_building_scope: {
    message: "How large is your group?",
    options: [
      { label: "Small (2–15 people)" },
      { label: "Medium (16–40 people)" },
      { label: "Large (41–100 people)" },
      { label: "100+ people" }
    ],
    next: "lead_capture"
  },

  human: {
    message: "I can connect you with our team. Would you like us to reach out?",
    options: [
      { label: "Yes, connect me", next: "lead_capture" },
      { label: "Not right now", next: "mainMenu" }
    ]
  },

  lead_capture: {
    message: "Please share your name and email, and we’ll follow up shortly.",
    form: true
  }
};
