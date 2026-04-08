/* =========================================================
   SommEvents – Base de connaissances en français
   ========================================================= */

const knowledgeFr = {

  /* -------------------------------------------------------
     MENU PRINCIPAL
     ------------------------------------------------------- */
  mainMenu: {
    message: "Vous planifiez un événement corporatif, une activité d'équipe ou une opération client ? Créons quelque chose d'inoubliable — que souhaitez-vous organiser ?",
    options: [
      { label: "🎉 Planifier un événement corporatif",         next: "plan_event",    tag: "Sales_Event" },
      { label: "🤝 Activités de groupe",                        next: "team_building", tag: "Sales_Event" },
      { label: "🎁 Cadeaux clients & personnalisés",            next: "gifting",       tag: "Sales_Gifting" },
      { label: "🍷 Dégustations & Sip Club",                    next: "wine",          tag: "Sales_SipClub" },
      { label: "❓ Pas encore sûr(e) — Aidez-moi à choisir",   next: "not_sure",      tag: "Sales_Event" },
      { label: "💬 Parler à un humain",                         next: "human",         tag: "Support_General" }
    ]
  },

  mainMenu_return: {
    message: "Content de vous revoir ! Comment puis-je vous aider aujourd'hui ?",
    options: [
      { label: "🎉 Planifier un événement corporatif",         next: "plan_event",    tag: "Sales_Event" },
      { label: "🤝 Activités de groupe",                        next: "team_building", tag: "Sales_Event" },
      { label: "🎁 Cadeaux clients & personnalisés",            next: "gifting",       tag: "Sales_Gifting" },
      { label: "🍷 Dégustations & Sip Club",                    next: "wine",          tag: "Sales_SipClub" },
      { label: "❓ Pas encore sûr(e) — Aidez-moi à choisir",   next: "not_sure",      tag: "Sales_Event" },
      { label: "💬 Parler à un humain",                         next: "human",         tag: "Support_General" }
    ]
  },

  /* -------------------------------------------------------
     1. PLANIFIER UN ÉVÉNEMENT CORPORATIF
     ------------------------------------------------------- */
  plan_event: {
    message: "Super ! Quel type d'événement planifiez-vous ?",
    options: [
      { label: "Événement d'équipe interne" },
      { label: "Réunion ou conférence" },
      { label: "Événement client" },
      { label: "Retraite d'entreprise" },
      { label: "Fête / Célébration" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "event_date_check",
    tag: "Sales_Event"
  },

  event_date_check: {
    message: "Avez-vous une date en tête, ou êtes-vous encore en exploration ?",
    options: [
      { label: "J'ai une date précise" },
      { label: "J'ai un mois / une saison" },
      { label: "J'explore encore" }
    ],
    next: "event_guests",
    tag: "Sales_Event"
  },

  event_guests: {
    message: "Environ combien d'invités prévoyez-vous ?",
    options: [
      { label: "10–25" },
      { label: "25–50" },
      { label: "50–100" },
      { label: "100+" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "event_location",
    tag: "Sales_Event"
  },

  event_location: {
    message: "Y a-t-il une ville, un lieu ou une région que vous envisagez ?",
    options: [
      { label: "GTA / Toronto" },
      { label: "Région du Niagara" },
      { label: "Ailleurs en Ontario" },
      { label: "Autre province" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "event_support",
    tag: "Sales_Event"
  },

  event_support: {
    message: "Quel niveau d'accompagnement recherchez-vous ?",
    options: [
      { label: "Planification complète" },
      { label: "Lieu + expérience" },
      { label: "J'explore des idées" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "event_budget",
    tag: "Sales_Event"
  },

  event_budget: {
    message: "Pour bien adapter notre proposition, avez-vous un budget en tête ?",
    options: [
      { label: "5 000 $ – 10 000 $" },
      { label: "10 000 $ – 25 000 $" },
      { label: "25 000 $+" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "event_atmosphere",
    tag: "Sales_Event"
  },

  event_atmosphere: {
    message: "Parfait — quel type d'ambiance souhaitez-vous créer ?",
    options: [
      { label: "Élégant & raffiné" },
      { label: "Amusant & interactif" },
      { label: "Décontracté & convivial" },
      { label: "Sur mesure / pas encore sûr(e)" }
    ],
    next: "event_lead_capture",
    tag: "Sales_Event"
  },

  event_lead_capture: {
    message: "C'est un excellent point de départ. Où devrions-nous envoyer nos recommandations personnalisées ?",
    form: true,
    formFields: ["name", "company", "email", "phone"],
    tag: "Lead_Capture"
  },

  /* -------------------------------------------------------
     2. ACTIVITÉS DE GROUPE
     ------------------------------------------------------- */
  team_building: {
    message: "Quel type d'expérience d'équipe recherchez-vous ?",
    options: [
      { label: "Interactif / Pratique" },
      { label: "Décontracté / Social" },
      { label: "Éducatif / Atelier" },
      { label: "Pas sûr(e)" }
    ],
    next: "tb_group_size",
    tag: "Sales_Event"
  },

  tb_group_size: {
    message: "Combien de personnes prévoyons-nous ?",
    options: [
      { label: "5–15" },
      { label: "15–30" },
      { label: "30–50" },
      { label: "50+" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "tb_setting",
    tag: "Sales_Event"
  },

  tb_setting: {
    message: "Est-ce au bureau, hors site, virtuel ou flexible ?",
    options: [
      { label: "Au bureau" },
      { label: "Hors site" },
      { label: "Virtuel" },
      { label: "Flexible" }
    ],
    next: "tb_budget",
    tag: "Sales_Event"
  },

  tb_budget: {
    message: "Avez-vous un budget approximatif par personne ou global en tête ?",
    options: [
      { label: "Moins de 50 $ / personne" },
      { label: "50 $ – 100 $ / personne" },
      { label: "100 $ – 200 $ / personne" },
      { label: "200 $+ / personne" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "tb_timeline",
    tag: "Sales_Event"
  },

  tb_timeline: {
    message: "Quand espérez-vous organiser cela ?",
    options: [
      { label: "Ce mois-ci" },
      { label: "Dans 1 à 3 mois" },
      { label: "Dans 3 à 6 mois" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "tb_lead_capture",
    tag: "Sales_Event"
  },

  tb_lead_capture: {
    message: "Parfait — c'est exactement notre spécialité. Où devrions-nous envoyer quelques options sur mesure ?",
    form: true,
    formFields: ["email"],
    tag: "Lead_Capture"
  },

  /* -------------------------------------------------------
     3. CADEAUX CLIENTS & PERSONNALISÉS
     ------------------------------------------------------- */
  gifting: {
    message: "À qui sont destinés les cadeaux ?",
    options: [
      { label: "Clients" },
      { label: "Employés" },
      { label: "Participants à un événement" },
      { label: "Cadeaux des fêtes" },
      { label: "Occasion spéciale" }
    ],
    next: "gifting_quantity",
    tag: "Sales_Gifting"
  },

  gifting_quantity: {
    message: "Combien de destinataires ?",
    options: [
      { label: "1–10" },
      { label: "10–25" },
      { label: "25–50" },
      { label: "50–100" },
      { label: "100+" }
    ],
    next: "gifting_style",
    tag: "Sales_Gifting"
  },

  gifting_style: {
    message: "Recherchez-vous des cadeaux entièrement personnalisés ou des options prêtes à envoyer ?",
    options: [
      { label: "Entièrement sur mesure" },
      { label: "Sélection curatée" },
      { label: "Pas sûr(e)" }
    ],
    next: "gifting_budget",
    tag: "Sales_Gifting"
  },

  gifting_budget: {
    message: "Avez-vous un budget par cadeau en tête ?",
    options: [
      { label: "100 $ minimum" },
      { label: "100 $ – 150 $" },
      { label: "150 $ – 250 $" },
      { label: "250 $+" }
    ],
    next: "gifting_alcohol",
    tag: "Sales_Gifting"
  },

  gifting_alcohol: {
    message: "Souhaitez-vous inclure de l'alcool dans les cadeaux ?",
    options: [
      { label: "Oui — vin ou spiritueux" },
      { label: "Non — sans alcool seulement" },
      { label: "Un mélange des deux" }
    ],
    next: "gifting_delivery",
    tag: "Sales_Gifting"
  },

  gifting_delivery: {
    message: "Quand avez-vous besoin de ces cadeaux ?",
    options: [
      { label: "Dans 2 semaines" },
      { label: "2 à 4 semaines" },
      { label: "1 à 2 mois" },
      { label: "3+ mois" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "gifting_lead_capture",
    tag: "Sales_Gifting"
  },

  gifting_lead_capture: {
    message: "Parfait — nous allons concevoir quelques concepts de cadeaux personnalisés pour vous. Où devrions-nous les envoyer ?",
    form: true,
    formFields: ["email"],
    tag: "Lead_Capture"
  },

  /* -------------------------------------------------------
     4. DÉGUSTATIONS & SIP CLUB
     ------------------------------------------------------- */
  wine: {
    message: "Est-ce pour un groupe privé, une équipe corporative ou un programme continu ?",
    options: [
      { label: "Groupe privé",               next: "wine_participants" },
      { label: "Événement vinicole corporatif", next: "wine_participants" },
      { label: "Abonnement Sip Club",         next: "sip_club" },
      { label: "Cadeau vinicole",             next: "gifting" },
      { label: "J'aimerais en savoir plus",   next: "faq_wine" }
    ],
    tag: "Sales_SipClub"
  },

  wine_participants: {
    message: "Combien de participants ?",
    options: [
      { label: "2–10" },
      { label: "10–25" },
      { label: "25–50" },
      { label: "50+" }
    ],
    next: "wine_format",
    tag: "Sales_SipClub"
  },

  wine_format: {
    message: "Recherchez-vous une expérience en personne, virtuelle ou hybride ?",
    options: [
      { label: "En personne" },
      { label: "Virtuelle" },
      { label: "Hybride" }
    ],
    next: "wine_date",
    tag: "Sales_SipClub"
  },

  wine_date: {
    message: "Avez-vous une date ou une période préférée ?",
    options: [
      { label: "J'ai une date en tête" },
      { label: "Dans 1 à 3 mois" },
      { label: "Dans 3 à 6 mois" },
      { label: "J'explore encore" }
    ],
    next: "wine_preferences",
    tag: "Sales_SipClub"
  },

  wine_preferences: {
    message: "Des préférences ? (régions, styles, débutant vs expérimenté)",
    options: [
      { label: "Adapté aux débutants" },
      { label: "Intermédiaire" },
      { label: "Avancé / connaisseur" },
      { label: "Pas de préférence" }
    ],
    next: "wine_lead_capture",
    tag: "Sales_SipClub"
  },

  wine_lead_capture: {
    message: "Magnifique ! Nous allons créer une expérience de dégustation sur mesure pour votre groupe. Où envoyer les détails ?",
    form: true,
    formFields: ["email"],
    tag: "Lead_Capture"
  },

  sip_club: {
    message: "Le Sip Club de SommEvents est un abonnement de vins soigneusement sélectionnés — livré à votre porte. Comment souhaitez-vous l'utiliser ?",
    options: [
      { label: "Abonnement personnel" },
      { label: "Cadeau corporatif" },
      { label: "Avantage employé / programme" }
    ],
    next: "sip_club_cta",
    tag: "Sales_SipClub"
  },

  sip_club_cta: {
    message: "Chaque boîte Sip Club comprend des vins sélectionnés à la main, des notes de dégustation, des guides d'accords et un accès à des événements virtuels exclusifs. Prêt(e) à commencer ?",
    options: [
      { label: "Je m'inscris !",         next: "lead_capture" },
      { label: "En savoir plus",          next: "faq_sip_club" },
      { label: "Retour au menu",          next: "mainMenu" }
    ],
    tag: "Sales_SipClub"
  },

  /* -------------------------------------------------------
     5. PAS ENCORE SÛR(E) — AIDEZ-MOI À CHOISIR
     ------------------------------------------------------- */
  not_sure: {
    message: "Pas de problème — c'est pour ça qu'on est là. Quel est l'objectif principal ?",
    options: [
      { label: "Cohésion d'équipe" },
      { label: "Engagement client" },
      { label: "Célébration" },
      { label: "Cadeaux" },
      { label: "Pas sûr(e)" }
    ],
    next: "not_sure_size",
    tag: "Sales_Event"
  },

  not_sure_size: {
    message: "Environ combien de personnes ?",
    options: [
      { label: "Moins de 15" },
      { label: "15–30" },
      { label: "30–50" },
      { label: "50–100" },
      { label: "100+" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "not_sure_timeline",
    tag: "Sales_Event"
  },

  not_sure_timeline: {
    message: "Avez-vous une période en tête ?",
    options: [
      { label: "Ce mois-ci" },
      { label: "Dans 1 à 3 mois" },
      { label: "Dans 3 à 6 mois" },
      { label: "Pas encore" }
    ],
    next: "not_sure_vibe",
    tag: "Sales_Event"
  },

  not_sure_vibe: {
    message: "Préférez-vous quelque chose de plus décontracté ou de plus structuré ?",
    options: [
      { label: "Décontracté" },
      { label: "Structuré" },
      { label: "Un mélange des deux" },
      { label: "Ouvert aux idées" }
    ],
    next: "not_sure_lead_capture",
    tag: "Sales_Event"
  },

  not_sure_lead_capture: {
    message: "En fonction de cela, j'ai déjà quelques bonnes idées pour vous. Où devrions-nous les envoyer ?",
    form: true,
    formFields: ["email"],
    tag: "Lead_Capture"
  },

  /* -------------------------------------------------------
     CONTACT HUMAIN
     ------------------------------------------------------- */
  human: {
    message: "Avec plaisir ! Préférez-vous un appel rapide ou un suivi par courriel ?",
    options: [
      { label: "📞 Appel",                next: "human_contact" },
      { label: "📧 Courriel",             next: "human_contact" },
      { label: "💬 Clavardage WhatsApp",   next: "_whatsapp" }
    ],
    tag: "Support_General"
  },

  human_contact: {
    message: "Quelles sont vos coordonnées ?",
    form: true,
    formFields: ["name", "email", "phone"],
    tag: "Lead_Capture"
  },

  /* -------------------------------------------------------
     DIVERS / REPLI
     ------------------------------------------------------- */
  something_else: {
    message: "Pas de problème ! Voici quelques options. Ou n'hésitez pas à taper votre question ci-dessous.",
    options: [
      { label: "Parcourir les FAQ",       next: "faq_main" },
      { label: "Parler à notre équipe",   next: "human" },
      { label: "Retour au menu",          next: "mainMenu" }
    ],
    tag: "Support_General"
  },

  /* -------------------------------------------------------
     FORMULAIRES DE CAPTURE
     ------------------------------------------------------- */
  lead_capture: {
    message: "Veuillez partager vos coordonnées et nous vous recontacterons dans les 24 heures.",
    form: true,
    formFields: ["name", "email"],
    tag: "Lead_Capture"
  },

  lead_capture_phone: {
    message: "Nous serions ravis de discuter ! Partagez vos informations et votre heure d'appel préférée.",
    form: true,
    formFields: ["name", "email", "phone", "company"],
    tag: "Lead_Capture"
  },

  consultation_booking: {
    message: "Trouvons un moment pour discuter ! Vous pouvez réserver une consultation directement — choisissez l'heure qui vous convient :",
    calendly: "https://calendly.com/marte",
    tag: "Lead_Capture"
  },

  /* -------------------------------------------------------
     TARIFICATION, RÉSERVATION & LOGISTIQUE
     ------------------------------------------------------- */
  pricing: {
    message: "Tout ce que nous faisons est personnalisé — pas de formule toute faite ici. Que souhaitez-vous savoir ?",
    options: [
      { label: "Comment fonctionne la tarification" },
      { label: "Flexibilité budgétaire" },
      { label: "Dépôts & paiements" },
      { label: "Forfaits vs sur mesure" }
    ],
    next: "pricing_info",
    tag: "Support_Pricing"
  },

  pricing_info: {
    message: "Nos tarifs sont personnalisés selon la portée de votre événement, les objectifs, le nombre d'invités, le lieu et le niveau de personnalisation.\n\nComme chaque expérience est différente, nous n'affichons pas de prix fixes. Partagez quelques détails et nous vous préparerons un devis clair — en respectant votre budget autant que possible.",
    options: [
      { label: "Demander un devis",         next: "lead_capture" },
      { label: "Comment fonctionne la réservation ?", next: "booking_stage" },
      { label: "Logistique & politiques",   next: "logistics" },
      { label: "Parler à notre équipe",     next: "human" },
      { label: "Poser une autre question",  next: "mainMenu" }
    ],
    tag: "Support_Pricing"
  },

  booking_stage: {
    message: "Où en êtes-vous dans le processus de réservation ?",
    options: [
      { label: "Je fais des recherches" },
      { label: "Prêt(e) à réserver" },
      { label: "Besoin d'une approbation interne d'abord" },
      { label: "Urgent — j'en ai besoin bientôt !" }
    ],
    next: "booking_cta",
    tag: "Support_Pricing"
  },

  booking_cta: {
    message: "Compris ! Faisons avancer les choses.",
    options: [
      { label: "Demander un devis détaillé",  next: "lead_capture" },
      { label: "📅 Réserver une consultation", next: "consultation_booking" },
      { label: "Parler à un humain",           next: "human" }
    ],
    tag: "Support_Pricing"
  },

  /* -------------------------------------------------------
     LOGISTIQUE & POLITIQUES
     ------------------------------------------------------- */
  logistics: {
    message: "Nous pouvons vous aider avec l'assurance, l'accessibilité, la confidentialité et les approbations. Que souhaitez-vous savoir ?",
    options: [
      { label: "Avez-vous une assurance ?",              next: "faq_l1" },
      { label: "Accommodements d'accessibilité ?",        next: "faq_l2" },
      { label: "Événements confidentiels ?",              next: "faq_l3" },
      { label: "Approbations internes ?",                 next: "faq_l4" },
      { label: "Demander des détails",                    next: "lead_capture" },
      { label: "Parler à un humain",                      next: "human" }
    ],
    tag: "Support_Logistics"
  },

  faq_l1: {
    message: "Oui — SommEvents détient une assurance responsabilité civile complète pour tous les événements que nous coordonnons. Si votre lieu exige un certificat d'assurance, nous pouvons en fournir un.",
    options: [{ label: "Plus de questions", next: "logistics" }, { label: "Obtenir des détails", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },
  faq_l2: {
    message: "Absolument. L'accessibilité est au cœur de notre processus de planification. Nous évaluons l'accès en fauteuil roulant, les accommodements alimentaires et adaptons les expériences pour que tous puissent participer pleinement.",
    options: [{ label: "Plus de questions", next: "logistics" }, { label: "Obtenir des détails", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },
  faq_l3: {
    message: "Oui. Nous comprenons que de nombreux événements corporatifs exigent de la discrétion. Nous respectons une stricte confidentialité et sommes prêts à signer des ententes de non-divulgation.",
    options: [{ label: "Plus de questions", next: "logistics" }, { label: "Obtenir des détails", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },
  faq_l4: {
    message: "Nous travaillons régulièrement avec les processus d'approvisionnement et d'approbation internes. Nous fournissons des propositions formelles, des devis détaillés et toute documentation nécessaire.",
    options: [{ label: "Plus de questions", next: "logistics" }, { label: "Obtenir des détails", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },

  faq_main: {
    message: "Quel sujet souhaitez-vous explorer ?",
    options: [
      { label: "À propos de SommEvents",   next: "faq_general" },
      { label: "Planification d'événements", next: "faq_events" },
      { label: "Activités de groupe",        next: "faq_team_building" },
      { label: "Vin & gastronomie",          next: "faq_wine" },
      { label: "Cadeaux",                    next: "faq_gifting" },
      { label: "Sip Club",                   next: "faq_sip_club" },
      { label: "Réservation & processus",    next: "faq_booking" },
      { label: "Tarifs & politiques",        next: "faq_pricing" }
    ],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ : Général ----------- */
  faq_general: {
    message: "Questions fréquentes sur SommEvents :",
    options: [
      { label: "Qu'est-ce que SommEvents ?",      next: "faq_g1" },
      { label: "Où êtes-vous situés ?",            next: "faq_g2" },
      { label: "Depuis combien de temps ?",        next: "faq_g3" },
      { label: "Qu'est-ce qui vous distingue ?",   next: "faq_g4" },
      { label: "Partout au Canada ?",              next: "faq_g5" },
      { label: "Qui fait partie de l'équipe ?",    next: "faq_g6" },
      { label: "Comment vous contacter ?",         next: "faq_g7" }
    ],
    tag: "Support_FAQ"
  },
  faq_g1: { message: "SommEvents est une entreprise premium de planification d'événements corporatifs, de consolidation d'équipe et d'expériences vinicoles basée en Ontario, Canada.", options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_g2: { message: "Nous sommes basés en Ontario et desservons principalement la région du Grand Toronto. Nous coordonnons aussi des événements partout au Canada.", options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_g3: { message: "SommEvents est en activité depuis plus de 10 ans, avec une expertise en hôtellerie, production d'événements et services de sommelier.", options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_g4: { message: "Ce qui nous distingue :\n\n✦ Chaque expérience est conçue sur mesure\n✦ Sommeliers certifiés au sein de l'équipe\n✦ 10+ ans d'expertise corporative\n✦ Inclusif par conception — options sans alcool, accommodements alimentaires\n✦ Service complet — planification, logistique et exécution", options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_g5: { message: "Oui ! Bien que basés en Ontario, nous coordonnons des événements et expédions des cadeaux partout au Canada.", options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_g6: { message: "Notre équipe comprend des sommeliers certifiés, des planificateurs d'événements, des experts culinaires et des concepteurs d'expériences.", options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_g7: { message: "Vous pouvez nous joindre à :\n\n📧 Courriel : info@sommevents.com\n🌐 Site web : sommevents.com\n\nOu dites-le-moi ici et je vous mettrai en contact !", options: [{ label: "Me connecter", next: "human" }, { label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },

  /* ----------- FAQ : Événements ----------- */
  faq_events: {
    message: "Questions sur la planification d'événements corporatifs :",
    options: [
      { label: "Quels événements planifiez-vous ?", next: "faq_e1" },
      { label: "Combien de temps à l'avance ?",     next: "faq_e2" },
      { label: "Grands événements ?",                next: "faq_e3" },
      { label: "Gestion de lieux ?",                 next: "faq_e4" },
      { label: "Qu'est-ce qui est inclus ?",         next: "faq_e5" },
      { label: "Événements thématiques ?",           next: "faq_e6" }
    ],
    tag: "Support_FAQ"
  },
  faq_e1: { message: "Nous planifions une large gamme d'événements corporatifs :\n\n• Réunions & conférences\n• Retraites & hors-site\n• Événements d'appréciation client\n• Fêtes & galas\n• Lancements de produits\n• Dîners exécutifs\n• Cérémonies de remise de prix", options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_e2: { message: "Nous recommandons de réserver 4 à 8 semaines à l'avance pour la plupart des événements, et 3 à 6 mois pour les grands événements. Cela dit, nous avons réussi des événements de dernière minute — contactez-nous !", options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_e3: { message: "Absolument ! Nous avons coordonné des événements de 10 à 500+ personnes.", options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_e4: { message: "Oui — nous pouvons trouver et gérer des lieux, ou travailler avec un lieu que vous avez déjà choisi.", options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_e5: { message: "Notre planification complète couvre : concept, lieu, traiteur, divertissement, décor, AV, gestion sur place, suivi post-événement.", options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_e6: { message: "Oui ! Les événements thématiques sont l'une de nos spécialités — des vendanges aux galas Gatsby.", options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },

  /* ----------- FAQ : Activités de groupe ----------- */
  faq_team_building: {
    message: "Questions sur les activités de groupe :",
    options: [
      { label: "Quelles expériences offrez-vous ?", next: "faq_tb1" },
      { label: "Options virtuelles ?",               next: "faq_tb2" },
      { label: "Taille min / max ?",                 next: "faq_tb3" },
      { label: "Durée des expériences ?",            next: "faq_tb4" },
      { label: "Personnalisation possible ?",        next: "faq_tb5" },
      { label: "Options sans alcool ?",              next: "faq_tb6" }
    ],
    tag: "Support_FAQ"
  },
  faq_tb1: { message: "Nos expériences incluent :\n\n🍷 Ateliers d'accords mets-vins\n🍳 Défis culinaires\n🎨 Soirées art & vin\n🧀 Maîtreclasses charcuterie\n🎯 Jeux de stratégie\n🌿 Aventures plein air\n💻 Dégustations virtuelles", options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_tb2: { message: "Oui ! Nos expériences virtuelles sont très populaires. Nous expédions des kits de dégustation et animons des sessions en direct avec un sommelier certifié.", options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_tb3: { message: "La plupart des expériences fonctionnent bien pour des groupes de 8 à 100+. Pour les petits groupes (2-7), nous proposons des sessions personnalisées.", options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_tb4: { message: "La plupart durent 1,5 à 3 heures. Nous ajustons selon votre horaire — sessions courtes (45 min) ou programmes d'une demi-journée / journée complète.", options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_tb5: { message: "Absolument ! Chaque expérience est personnalisée selon vos objectifs, la taille du groupe et les besoins alimentaires.", options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_tb6: { message: "Toujours ! L'inclusivité est essentielle. Chaque expérience comprend des options sans alcool et nous accommodons tous les besoins alimentaires.", options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },

  /* ----------- FAQ : Vin ----------- */
  faq_wine: {
    message: "Questions sur les expériences vinicoles :",
    options: [
      { label: "Quelles expériences ?",         next: "faq_w1" },
      { label: "Besoin de connaître le vin ?",  next: "faq_w2" },
      { label: "Où ont lieu les dégustations ?", next: "faq_w3" },
      { label: "Pouvez-vous venir au bureau ?",  next: "faq_w4" },
      { label: "Nourriture incluse ?",           next: "faq_w5" },
      { label: "Événements privés ?",            next: "faq_w6" }
    ],
    tag: "Support_FAQ"
  },
  faq_w1: { message: "Nos expériences vinicoles incluent :\n\n🍷 Dégustations guidées\n🧀 Accords vins & fromages\n🍳 Cours de cuisine\n🍾 Ateliers vins mousseux & cocktails\n🏞️ Visites de vignobles\n🍕 Soirées pizza & vin\n🌍 Tours du monde vinicoles", options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_w2: { message: "Pas du tout ! Nos expériences sont conçues pour tous les niveaux — des débutants aux connaisseurs.", options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_w3: { message: "Nous organisons des dégustations dans divers lieux :\n\n• Vignobles partenaires en Ontario\n• Salles privées\n• Votre bureau\n• Virtuel (kits expédiés)", options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_w4: { message: "Absolument ! Nous apportons tout — vin, verrerie, accords et un sommelier. Tout ce dont vous avez besoin est un espace.", options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_w5: { message: "La plupart de nos dégustations incluent des accords — fromages, charcuterie ou bouchées légères.", options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_w6: { message: "Oui ! Nous organisons des expériences privées pour anniversaires, soirées en amoureux, et toute célébration.", options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },

  /* ----------- FAQ : Cadeaux ----------- */
  faq_gifting: {
    message: "Questions sur les cadeaux corporatifs :",
    options: [
      { label: "Contenu d'un coffret ?",       next: "faq_gf1" },
      { label: "Personnalisation possible ?",   next: "faq_gf2" },
      { label: "Quantité minimale ?",           next: "faq_gf3" },
      { label: "Où livrez-vous ?",              next: "faq_gf4" },
      { label: "Délai de commande ?",           next: "faq_gf5" },
      { label: "Cadeaux sans alcool ?",         next: "faq_gf6" }
    ],
    tag: "Support_FAQ"
  },
  faq_gf1: { message: "Nos coffrets peuvent inclure :\n\n🍷 Vins sélectionnés\n🧀 Fromages & charcuterie artisanaux\n🍫 Chocolats gourmands\n☕ Café & thé premium\n✨ Articles personnalisés avec votre logo\n📦 Programmes en volume", options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_gf2: { message: "Absolument ! Vous pouvez choisir les articles, l'emballage personnalisé, les messages et les thèmes de couleur.", options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_gf3: { message: "Pas de minimum strict — d'un cadeau unique à des centaines pour un programme corporatif.", options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_gf4: { message: "Nous livrons partout au Canada ! Livraison dans la même semaine en Ontario, 3-7 jours pour le reste du pays.", options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_gf5: { message: "2-3 semaines pour les commandes personnalisées. En haute saison (novembre-décembre), 4-6 semaines idéalement.", options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_gf6: { message: "Bien sûr ! Nous offrons une belle sélection de cadeaux sans alcool — thés, café, chocolats, produits bien-être.", options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },

  /* ----------- FAQ : Sip Club ----------- */
  faq_sip_club: {
    message: "Questions sur l'abonnement Sip Club :",
    options: [
      { label: "Qu'est-ce que le Sip Club ?",   next: "faq_sc1" },
      { label: "Comment ça fonctionne ?",        next: "faq_sc2" },
      { label: "Qu'est-ce qui est inclus ?",     next: "faq_sc3" },
      { label: "Offrir un abonnement ?",         next: "faq_sc4" },
      { label: "Combien ça coûte ?",             next: "faq_sc5" },
      { label: "Annulation possible ?",          next: "faq_sc6" }
    ],
    tag: "Support_FAQ"
  },
  faq_sc1: { message: "Le Sip Club est un service d'abonnement de vins soigneusement sélectionnés par nos sommeliers certifiés, avec des notes de dégustation et des accès à des événements exclusifs.", options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "S'inscrire", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_sc2: { message: "Voici comment ça fonctionne :\n\n1️⃣ Choisissez votre forfait\n2️⃣ Indiquez vos préférences\n3️⃣ Nous sélectionnons pour vous\n4️⃣ Livraison à votre porte\n5️⃣ Accès aux événements virtuels", options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "S'inscrire", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_sc3: { message: "Chaque livraison inclut :\n\n🍷 2-4 vins sélectionnés\n📝 Notes de dégustation\n🍽️ Suggestions d'accords\n🎥 Accès aux événements virtuels\n🎉 Rabais membres exclusifs", options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "S'inscrire", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_sc4: { message: "Oui ! Le Sip Club fait un cadeau incroyable. Nous offrons des abonnements cadeaux de 1, 3, 6 ou 12 mois.", options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "Offrir", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_sc5: { message: "Les tarifs dépendent du forfait, du nombre de bouteilles et des préférences. Contactez-nous pour des options adaptées à votre budget.", options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "S'inscrire", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_sc6: { message: "Oui — aucun engagement à long terme. Vous pouvez mettre en pause, sauter ou annuler à tout moment.", options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "S'inscrire", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },

  /* ----------- FAQ : Réservation ----------- */
  faq_booking: {
    message: "Questions sur notre processus de réservation :",
    options: [
      { label: "Comment réserver ?",             next: "faq_b1" },
      { label: "Comment ça se passe ?",          next: "faq_b2" },
      { label: "Combien de temps à l'avance ?",  next: "faq_b3" },
      { label: "Modifier ma réservation ?",      next: "faq_b4" },
      { label: "Politique d'annulation ?",       next: "faq_b5" },
      { label: "Dépôt requis ?",                 next: "faq_b6" }
    ],
    tag: "Support_FAQ"
  },
  faq_b1: { message: "C'est simple :\n\n1️⃣ Contactez-nous par clavardage, courriel ou site web\n2️⃣ Appel découverte rapide\n3️⃣ Proposition personnalisée\n4️⃣ Confirmation avec dépôt\n5️⃣ On s'occupe du reste !", options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_b2: { message: "Notre processus :\n\n📞 Découverte\n📋 Proposition détaillée\n✅ Confirmation\n🎨 Planification\n🎉 Exécution\n💬 Suivi post-événement", options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_b3: { message: "Délais recommandés :\n\n• Petites expériences : 2-4 semaines\n• Événements moyens : 4-8 semaines\n• Grands événements : 3-6 mois", options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_b4: { message: "Oui ! Nous comprenons que les plans changent. Donnez-nous le plus de préavis possible.", options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_b5: { message: "En général :\n\n• 30+ jours : remboursement complet (moins le dépôt)\n• 15-29 jours : 50 %\n• Moins de 15 jours : non remboursable", options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_b6: { message: "Oui, nous demandons un dépôt de 25-50 % selon l'événement. Le solde est dû avant la date de l'événement.", options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },

  /* ----------- FAQ : Tarifs ----------- */
  faq_pricing: {
    message: "Questions sur les tarifs et politiques :",
    options: [
      { label: "Comment sont déterminés les prix ?", next: "faq_p1" },
      { label: "Forfaits fixes ?",                   next: "faq_p2" },
      { label: "Respectez-vous mon budget ?",        next: "faq_p3" },
      { label: "Qu'est-ce qui est inclus ?",         next: "faq_p4" },
      { label: "Modes de paiement ?",                next: "faq_p5" },
      { label: "Frais cachés ?",                     next: "faq_p6" }
    ],
    tag: "Support_FAQ"
  },
  faq_p1: { message: "Les prix sont personnalisés selon : le type d'expérience, la taille du groupe, la personnalisation, le lieu, la durée et les exigences spéciales.", options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_p2: { message: "Nous offrons des forfaits de base, mais tout est personnalisable. Nous préférons créer quelque chose de parfait pour vous.", options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_p3: { message: "Absolument ! Nous travaillons avec une large gamme de budgets. Il y a toujours moyen de créer une expérience incroyable.", options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_p4: { message: "Nos prix incluent généralement :\n\n✓ Planification & coordination\n✓ Nourriture & boissons\n✓ Animation par un sommelier\n✓ Matériel & fournitures\n✓ Installation & démontage\n✓ TPS/TVH", options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_p5: { message: "Nous acceptons :\n\n💳 Cartes de crédit\n🏦 Virement électronique\n📄 Facturation corporative (NET 15/30)", options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" },
  faq_p6: { message: "Aucun frais caché — jamais. Nos devis sont transparents et détaillés.", options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }], tag: "Support_FAQ" }
};

/* -------------------------------------------------------
   INDEX DE RECHERCHE FAQ (français)
   ------------------------------------------------------- */
const faqSearchIndexFr = [];
(function buildFaqIndexFr() {
  for (const [key, node] of Object.entries(knowledgeFr)) {
    if (key.startsWith("faq_") && node.message) {
      faqSearchIndexFr.push({ key, text: node.message.toLowerCase() });
    }
  }
})();
