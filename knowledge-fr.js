/* =========================================================
   SommEvents – Base de connaissances en français
   ========================================================= */

const knowledgeFr = {

  /* -------------------------------------------------------
     MENU PRINCIPAL
     ------------------------------------------------------- */
  mainMenu: {
    message: "Bonjour ! 👋 Bienvenue chez SommEvents — la référence en planification d'événements corporatifs et en expériences vinicoles en Ontario. Comment puis-je vous aider ?",
    options: [
      { label: "🎉 Planifier un événement",         next: "plan_event",    tag: "Sales_Event" },
      { label: "🤝 Activités de groupe",             next: "team_building", tag: "Sales_Event" },
      { label: "🎁 Cadeaux corporatifs",             next: "gifting",       tag: "Sales_Gifting" },
      { label: "🍷 Expériences vinicoles & Sip Club", next: "wine",         tag: "Sales_SipClub" },
      { label: "💰 Tarifs, réservations & logistique", next: "pricing",     tag: "Support_Pricing" },
      { label: "💬 Parler à un humain",              next: "human",         tag: "Support_General" }
    ]
  },

  mainMenu_return: {
    message: "Bon retour parmi nous ! 😊 Comment puis-je vous aider aujourd'hui ?",
    options: [
      { label: "🎉 Planifier un événement",         next: "plan_event",    tag: "Sales_Event" },
      { label: "🤝 Activités de groupe",             next: "team_building", tag: "Sales_Event" },
      { label: "🎁 Cadeaux corporatifs",             next: "gifting",       tag: "Sales_Gifting" },
      { label: "🍷 Expériences vinicoles & Sip Club", next: "wine",         tag: "Sales_SipClub" },
      { label: "💰 Tarifs, réservations & logistique", next: "pricing",     tag: "Support_Pricing" },
      { label: "💬 Parler à un humain",              next: "human",         tag: "Support_General" }
    ]
  },

  /* -------------------------------------------------------
     1. PLANIFIER UN ÉVÉNEMENT
     ------------------------------------------------------- */
  plan_event: {
    message: "Excellent ! Nous adorons donner vie aux événements. Quel type d'événement planifiez-vous ?",
    options: [
      { label: "Réunion ou conférence" },
      { label: "Retraite d'entreprise" },
      { label: "Événement client ou exécutif" },
      { label: "Fête ou célébration" },
      { label: "Pas encore sûr(e)" }
    ],
    next: "planning_scope",
    tag: "Sales_Event"
  },

  planning_scope: {
    message: "Quel niveau de soutien recherchez-vous ?",
    options: [
      { label: "Planification complète" },
      { label: "Planification partielle" },
      { label: "Coordination sur place uniquement" },
      { label: "J'explore mes options" }
    ],
    next: "event_details",
    tag: "Sales_Event"
  },

  event_details: {
    message: "Super ! Pour personnaliser nos recommandations, quels détails avez-vous déjà ?",
    capture: true,
    fields: ["Date ou période de l'événement", "Nombre d'invités", "Lieu ou ville", "Fourchette budgétaire"],
    next: "event_cta",
    tag: "Sales_Event"
  },

  event_cta: {
    message: "Merci pour ces informations ! Nous pouvons certainement vous accompagner. Que souhaitez-vous faire ensuite ?",
    options: [
      { label: "Demander une proposition",   next: "lead_capture" },
      { label: "Réserver une consultation",  next: "lead_capture" },
      { label: "Poser une autre question",   next: "mainMenu" }
    ],
    tag: "Sales_Event"
  },

  /* -------------------------------------------------------
     2. ACTIVITÉS DE GROUPE
     ------------------------------------------------------- */
  team_building: {
    message: "Les expériences d'équipe sont notre spécialité — pas de brise-glace gênants, promis ! Quel type d'expérience vous intéresse ?",
    options: [
      { label: "Activité de consolidation d'équipe" },
      { label: "Développement du leadership" },
      { label: "Atelier ou formation" },
      { label: "Activité complémentaire de retraite" }
    ],
    next: "tb_format",
    tag: "Sales_Event"
  },

  tb_format: {
    message: "Quel format convient le mieux à votre groupe ?",
    options: [
      { label: "En personne" },
      { label: "Virtuel" },
      { label: "Hybride" },
      { label: "Ouvert aux suggestions" }
    ],
    next: "tb_goals",
    tag: "Sales_Event"
  },

  tb_goals: {
    message: "Quel est l'objectif principal ou l'ambiance souhaitée ?",
    options: [
      { label: "Connexion et liens d'équipe" },
      { label: "Célébration ou récompense" },
      { label: "Apprentissage et développement" },
      { label: "Engagement client ou partenaire" }
    ],
    next: "tb_cta",
    tag: "Sales_Event"
  },

  tb_cta: {
    message: "Parfait ! Voici ce que nous pouvons faire :",
    options: [
      { label: "Voir des exemples d'expériences", next: "tb_examples" },
      { label: "Demander un devis",               next: "lead_capture" },
      { label: "Parler à notre équipe",            next: "human" }
    ],
    tag: "Sales_Event"
  },

  tb_examples: {
    message: "Voici nos expériences les plus populaires :\n\n🍷 Accords mets & vins — dégustations guidées par un sommelier certifié\n🍳 Défis culinaires — compétitions de cuisine en équipe\n🧠 Ateliers stratégie & innovation — résolution créative de problèmes\n🎨 Soirées art & vin — peinture + dégustation pour souder l'équipe\n🌿 Aventures en plein air — visites de vignobles, chasses au trésor\n💻 Dégustations virtuelles — kits expédiés à chaque participant\n\nVoulez-vous en savoir plus ?",
    options: [
      { label: "Demander un devis",    next: "lead_capture" },
      { label: "Poser une question",   next: "faq_team_building" },
      { label: "Retour au menu",       next: "mainMenu" }
    ],
    tag: "Sales_Event"
  },

  /* -------------------------------------------------------
     3. CADEAUX CORPORATIFS
     ------------------------------------------------------- */
  gifting: {
    message: "Excellent choix — un cadeau attentionné fait toute la différence ! Quelle est l'occasion ?",
    options: [
      { label: "Cadeaux des fêtes" },
      { label: "Remerciement client" },
      { label: "Reconnaissance des employés" },
      { label: "Cadeaux liés à un événement" },
      { label: "Occasion spéciale" }
    ],
    next: "gifting_alcohol",
    tag: "Sales_Gifting"
  },

  gifting_alcohol: {
    message: "Souhaitez-vous inclure de l'alcool dans les cadeaux ?",
    options: [
      { label: "Oui — vin ou spiritueux" },
      { label: "Non — sans alcool uniquement" },
      { label: "Mixte — un peu des deux" }
    ],
    next: "gifting_scale",
    tag: "Sales_Gifting"
  },

  gifting_scale: {
    message: "Combien de destinataires avez-vous ?",
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
    message: "Nous préparerons quelque chose de spécial. Que souhaitez-vous faire ?",
    options: [
      { label: "Explorer les options cadeaux",    next: "gifting_options" },
      { label: "Démarrer un programme cadeaux",   next: "lead_capture" },
      { label: "Parler à un spécialiste",         next: "human" }
    ],
    tag: "Sales_Gifting"
  },

  gifting_options: {
    message: "Voici un aperçu de ce que nous offrons :\n\n🎁 Coffrets cadeaux — vin, produits artisanaux, articles griffés\n🍷 Collections de vins — sélections choisies par nos sommeliers\n🧀 Ensembles charcuterie & vin — accords prêts à déguster\n🌿 Bien-être & sans alcool — thés, gourmandises, soins personnels\n✨ Personnalisés — votre logo, votre style, notre expertise\n📦 Programmes en volume — cadeaux d'entreprise à grande échelle\n\nTous les cadeaux peuvent être personnalisés et livrés partout au Canada.",
    options: [
      { label: "Démarrer un programme cadeaux",  next: "lead_capture" },
      { label: "Poser une question",             next: "faq_gifting" },
      { label: "Retour au menu",                 next: "mainMenu" }
    ],
    tag: "Sales_Gifting"
  },

  /* -------------------------------------------------------
     4. EXPÉRIENCES VINICOLES & SIP CLUB
     ------------------------------------------------------- */
  wine: {
    message: "Le vin est au cœur de tout ce que nous faisons ! Qu'est-ce qui vous intéresse le plus ?",
    options: [
      { label: "Expérience de dégustation",     next: "wine_route" },
      { label: "Événement vinicole corporatif", next: "wine_corporate" },
      { label: "Abonnement Sip Club",           next: "sip_club" },
      { label: "Cadeaux de vin",                next: "gifting" },
      { label: "En savoir plus",                next: "faq_wine" }
    ],
    tag: "Sales_SipClub"
  },

  wine_route: {
    message: "Est-ce pour un groupe corporatif ou une occasion privée / personnelle ?",
    options: [
      { label: "Groupe corporatif",       next: "wine_corporate" },
      { label: "Privé / personnel",       next: "wine_private" }
    ],
    tag: "Sales_SipClub"
  },

  wine_corporate: {
    message: "Nos expériences vinicoles corporatives sont conçues pour impressionner. Nous gérons tout — des dégustations guidées aux retraites complètes dans les vignobles. Quelle est la taille de votre groupe ?",
    options: [
      { label: "Petit (2–15)" },
      { label: "Moyen (16–40)" },
      { label: "Grand (41–100)" },
      { label: "100+" }
    ],
    next: "wine_cta",
    tag: "Sales_SipClub"
  },

  wine_private: {
    message: "Merveilleux ! Nous organisons aussi des dégustations privées intimes, des soirées romantiques et des célébrations spéciales. Voulez-vous en savoir plus ?",
    options: [
      { label: "Oui, dites-m'en plus",  next: "wine_cta" },
      { label: "Voir le Sip Club",       next: "sip_club" },
      { label: "Retour au menu",         next: "mainMenu" }
    ],
    tag: "Sales_SipClub"
  },

  wine_cta: {
    message: "Voici ce que nous pouvons faire :",
    options: [
      { label: "Personnaliser une expérience",  next: "lead_capture" },
      { label: "Poser une question",            next: "faq_wine" },
      { label: "Contacter notre équipe",        next: "human" }
    ],
    tag: "Sales_SipClub"
  },

  sip_club: {
    message: "Le Sip Club de SommEvents est un abonnement de vins sélectionnés — livré à votre porte. Comment souhaitez-vous l'utiliser ?",
    options: [
      { label: "Abonnement personnel" },
      { label: "Cadeau corporatif" },
      { label: "Avantage employé / programme" }
    ],
    next: "sip_club_cta",
    tag: "Sales_SipClub"
  },

  sip_club_cta: {
    message: "Chaque coffret Sip Club comprend des vins soigneusement sélectionnés, des notes de dégustation, des guides d'accords mets-vins et l'accès à des événements virtuels exclusifs. Prêt(e) à commencer ?",
    options: [
      { label: "Inscrivez-moi !",       next: "lead_capture" },
      { label: "En savoir plus",         next: "faq_sip_club" },
      { label: "Retour au menu",         next: "mainMenu" }
    ],
    tag: "Sales_SipClub"
  },

  /* -------------------------------------------------------
     5. TARIFS, RÉSERVATION & LOGISTIQUE
     ------------------------------------------------------- */
  pricing: {
    message: "Tout ce que nous faisons est personnalisé — pas de formules toutes faites ici. Que souhaitez-vous savoir ?",
    options: [
      { label: "Comment fonctionnent les tarifs" },
      { label: "Flexibilité budgétaire" },
      { label: "Dépôts et paiements" },
      { label: "Forfaits vs sur mesure" }
    ],
    next: "pricing_info",
    tag: "Support_Pricing"
  },

  pricing_info: {
    message: "Nos tarifs sont personnalisés selon la portée de votre événement, vos objectifs, le nombre d'invités, le lieu et le niveau de personnalisation.\n\nComme chaque expérience est différente, nous n'affichons pas de prix fixes. Partagez quelques détails (date, taille du groupe, ville et vos souhaits), et nous vous enverrons un devis clair — en respectant votre budget autant que possible.",
    options: [
      { label: "Demander un devis personnalisé", next: "lead_capture" },
      { label: "Comment réserver ?",             next: "booking_stage" },
      { label: "Logistique & politiques",        next: "logistics" },
      { label: "Parler à notre équipe",          next: "human" },
      { label: "Poser une autre question",       next: "mainMenu" }
    ],
    tag: "Support_Pricing"
  },

  booking_stage: {
    message: "Où en êtes-vous dans le processus de réservation ?",
    options: [
      { label: "Je fais des recherches" },
      { label: "Prêt(e) à réserver" },
      { label: "En attente d'approbation interne" },
      { label: "Urgent — j'en ai besoin bientôt !" }
    ],
    next: "booking_cta",
    tag: "Support_Pricing"
  },

  booking_cta: {
    message: "Compris ! Faisons avancer les choses.",
    options: [
      { label: "Obtenir les tarifs détaillés",  next: "lead_capture" },
      { label: "Réserver une consultation",     next: "lead_capture" },
      { label: "Parler à un humain",            next: "human" }
    ],
    tag: "Support_Pricing"
  },

  /* -------------------------------------------------------
     6. AUTRE / REPLI
     ------------------------------------------------------- */
  something_else: {
    message: "Pas de problème ! Voici quelques sujets que je peux aborder. Ou tapez votre question ci-dessous.",
    options: [
      { label: "Parcourir la FAQ",       next: "faq_main" },
      { label: "Parler à notre équipe",  next: "human" },
      { label: "Retour au menu",         next: "mainMenu" }
    ],
    tag: "Support_General"
  },

  /* -------------------------------------------------------
     TRANSFERT HUMAIN
     ------------------------------------------------------- */
  human: {
    message: "Bien sûr ! Notre équipe est là pour vous. Comment souhaitez-vous nous contacter ?",
    options: [
      { label: "📧 Qu'on me contacte par courriel",  next: "lead_capture" },
      { label: "📞 Demander un rappel",               next: "lead_capture_phone" },
      { label: "📅 Réserver une consultation",         next: "consultation_booking" },
      { label: "Pas maintenant",                       next: "mainMenu" }
    ],
    tag: "Support_General"
  },

  /* -------------------------------------------------------
     FORMULAIRES DE CAPTURE
     ------------------------------------------------------- */
  lead_capture: {
    message: "Veuillez partager vos coordonnées et nous vous contacterons dans les 24 heures.",
    form: true,
    formFields: ["name", "email"],
    tag: "Lead_Capture"
  },

  lead_capture_phone: {
    message: "Nous serions ravis de discuter ! Partagez vos infos et votre créneau préféré pour un appel.",
    form: true,
    formFields: ["name", "email", "phone", "company"],
    tag: "Lead_Capture"
  },

  /* -------------------------------------------------------
     RÉSERVATION CONSULTATION
     ------------------------------------------------------- */
  consultation_booking: {
    message: "Trouvons un moment pour discuter ! Choisissez une date et une heure qui vous conviennent :",
    calendar: true,
    tag: "Lead_Capture"
  },

  /* -------------------------------------------------------
     LOGISTIQUE & POLITIQUES
     ------------------------------------------------------- */
  logistics: {
    message: "Nous pouvons vous aider avec l'assurance, l'accessibilité, la confidentialité et les approbations. Que souhaitez-vous savoir ?",
    options: [
      { label: "Avez-vous une assurance ?",             next: "faq_l1" },
      { label: "Aménagements d'accessibilité ?",        next: "faq_l2" },
      { label: "Événements confidentiels ?",            next: "faq_l3" },
      { label: "Approbations internes ?",               next: "faq_l4" },
      { label: "Demander des détails",                  next: "lead_capture" },
      { label: "Parler à un humain",                    next: "human" }
    ],
    tag: "Support_Logistics"
  },

  faq_l1: {
    message: "Oui — SommEvents détient une assurance responsabilité civile complète pour tous les événements que nous coordonnons. Si votre lieu nécessite un certificat d'assurance, nous pouvons en fournir un.",
    options: [{ label: "Plus de questions", next: "logistics" }, { label: "Obtenir des détails", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },
  faq_l2: {
    message: "Absolument. L'accessibilité est au cœur de notre planification. Nous évaluons les lieux pour l'accès en fauteuil roulant, organisons des accommodations alimentaires et adaptons les expériences pour que tout le monde puisse participer pleinement.",
    options: [{ label: "Plus de questions", next: "logistics" }, { label: "Obtenir des détails", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },
  faq_l3: {
    message: "Oui. Nous comprenons que de nombreux événements corporatifs exigent la discrétion. Nous opérons sous stricte confidentialité et sommes prêts à signer des accords de non-divulgation.",
    options: [{ label: "Plus de questions", next: "logistics" }, { label: "Obtenir des détails", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },
  faq_l4: {
    message: "Nous travaillons régulièrement avec les processus d'approvisionnement et d'approbation internes. Nous fournissons des propositions formelles, des devis détaillés, des informations fournisseur et toute documentation nécessaire.",
    options: [{ label: "Plus de questions", next: "logistics" }, { label: "Obtenir des détails", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_Logistics"
  },

  /* -------------------------------------------------------
     FAQ PRINCIPAL
     ------------------------------------------------------- */
  faq_main: {
    message: "Quel sujet souhaitez-vous explorer ?",
    options: [
      { label: "À propos de SommEvents",      next: "faq_general" },
      { label: "Planification d'événements",   next: "faq_events" },
      { label: "Activités de groupe",          next: "faq_team_building" },
      { label: "Vin & cuisine",               next: "faq_wine" },
      { label: "Cadeaux",                     next: "faq_gifting" },
      { label: "Sip Club",                    next: "faq_sip_club" },
      { label: "Réservation & processus",     next: "faq_booking" },
      { label: "Tarifs & politiques",         next: "faq_pricing" }
    ],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Général ----------- */
  faq_general: {
    message: "Voici les questions fréquentes sur SommEvents :",
    options: [
      { label: "Qu'est-ce que SommEvents ?",         next: "faq_g1" },
      { label: "Où êtes-vous situés ?",               next: "faq_g2" },
      { label: "Depuis combien de temps ?",            next: "faq_g3" },
      { label: "Qu'est-ce qui vous distingue ?",       next: "faq_g4" },
      { label: "Opérez-vous partout au Canada ?",      next: "faq_g5" },
      { label: "Qui fait partie de l'équipe ?",        next: "faq_g6" },
      { label: "Comment vous contacter ?",             next: "faq_g7" }
    ],
    tag: "Support_FAQ"
  },
  faq_g1: {
    message: "SommEvents est une entreprise premium de planification d'événements corporatifs, de consolidation d'équipe et d'expériences vinicoles basée en Ontario, Canada. Nous nous spécialisons dans la création d'expériences élevées et réfléchies.",
    options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g2: {
    message: "Nous sommes basés en Ontario, Canada, et servons principalement la région du Grand Toronto et les environs. Nous coordonnons aussi des événements à travers le Canada.",
    options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g3: {
    message: "SommEvents est en activité depuis plus de 10 ans. Notre équipe apporte une expertise approfondie en hôtellerie, production d'événements, services de sommellerie et expériences corporatives.",
    options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g4: {
    message: "Ce qui nous distingue :\n\n✦ Rien de générique — chaque expérience est sur mesure\n✦ Des sommeliers certifiés guident chaque expérience vinicole\n✦ 10+ ans d'expertise en événements corporatifs\n✦ Inclusif par nature — options sans alcool, accommodations alimentaires\n✦ Service complet — planification, logistique et exécution\n✦ Personnel et non standardisé",
    options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g5: {
    message: "Oui ! Bien que basés en Ontario, nous coordonnons des événements et livrons des cadeaux partout au Canada. Pour les événements hors province, nous travaillons avec des partenaires locaux de confiance.",
    options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g6: {
    message: "Notre équipe comprend des sommeliers certifiés, des planificateurs d'événements, des experts culinaires et des concepteurs d'expériences. Nous sommes passionnés par la création de moments mémorables.",
    options: [{ label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_g7: {
    message: "Vous pouvez nous joindre à :\n\n📧 Courriel : info@sommevents.com\n🌐 Site web : sommevents.com\n\nOu laissez-moi vous mettre en contact avec notre équipe !",
    options: [{ label: "Me connecter", next: "human" }, { label: "Plus de questions", next: "faq_general" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Événements ----------- */
  faq_events: {
    message: "Questions fréquentes sur la planification d'événements :",
    options: [
      { label: "Quels événements planifiez-vous ?",     next: "faq_e1" },
      { label: "Combien de temps à l'avance ?",         next: "faq_e2" },
      { label: "Grands événements possibles ?",          next: "faq_e3" },
      { label: "Gérez-vous les lieux ?",                 next: "faq_e4" },
      { label: "Qu'est-ce qui est inclus ?",             next: "faq_e5" },
      { label: "Événements thématiques ?",               next: "faq_e6" }
    ],
    tag: "Support_FAQ"
  },
  faq_e1: {
    message: "Nous planifions une large gamme d'événements corporatifs :\n\n• Réunions et conférences\n• Retraites d'entreprise\n• Événements d'appréciation client\n• Fêtes de fin d'année et galas\n• Lancements de produits\n• Dîners exécutifs\n• Cérémonies de remise de prix\n• Jalons d'entreprise",
    options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_e2: {
    message: "Nous recommandons de réserver 4 à 8 semaines à l'avance pour la plupart des événements, et 3 à 6 mois pour les événements d'envergure. Cela dit, nous avons réalisé des événements de dernière minute incroyables aussi !",
    options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_e3: {
    message: "Absolument ! Nous avons coordonné des événements pour des groupes de 10 à plus de 500 personnes. Que ce soit un dîner intime ou un grand gala corporatif, nous adaptons nos services.",
    options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_e4: {
    message: "Oui — nous pouvons aider à trouver et gérer des lieux, ou travailler avec celui que vous avez déjà choisi. Nous avons des partenariats avec certains des meilleurs espaces en Ontario.",
    options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_e5: {
    message: "Notre planification complète couvre :\n\n• Concept et développement du thème\n• Recherche et gestion de lieu\n• Traiteur et coordination du bar\n• Divertissement et conférenciers\n• Décor, audiovisuel et logistique\n• Gestion sur place\n• Communication et RSVP\n• Suivi post-événement",
    options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_e6: {
    message: "Oui ! Les événements thématiques sont l'une de nos spécialités. Nous avons réalisé des thèmes allant des vendanges au Gatsby le Magnifique, en passant par des merveilles hivernales et des tours culinaires du monde.",
    options: [{ label: "Plus de questions", next: "faq_events" }, { label: "Planifier mon événement", next: "plan_event" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Activités de groupe ----------- */
  faq_team_building: {
    message: "Questions sur les activités de groupe et expériences :",
    options: [
      { label: "Quelles expériences offrez-vous ?",   next: "faq_tb1" },
      { label: "Options virtuelles ?",                  next: "faq_tb2" },
      { label: "Taille de groupe min / max ?",          next: "faq_tb3" },
      { label: "Durée des expériences ?",               next: "faq_tb4" },
      { label: "Activités personnalisables ?",           next: "faq_tb5" },
      { label: "Options sans alcool ?",                  next: "faq_tb6" }
    ],
    tag: "Support_FAQ"
  },
  faq_tb1: {
    message: "Nos expériences de groupe comprennent :\n\n🍷 Ateliers d'accords mets & vins\n🍳 Défis culinaires en équipe\n🎨 Soirées art & vin\n🧀 Masterclass fromage & charcuterie\n🎯 Jeux de stratégie & innovation\n🌿 Visites de vignobles & aventures en plein air\n💻 Expériences de dégustation virtuelles\n🧠 Ateliers leadership & communication\n\nChaque expérience est conçue pour être engageante, inclusive et vraiment amusante !",
    options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_tb2: {
    message: "Oui ! Nos expériences virtuelles sont parmi nos offres les plus populaires. Nous expédions des kits de dégustation à chaque participant et animons des sessions interactives en direct dirigées par un sommelier certifié.",
    options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_tb3: {
    message: "La plupart des expériences conviennent à des groupes de 8 à 100+ personnes. Pour les petits groupes (2–7), nous arrangeons des sessions intimes. Pour les très grands groupes (200+), nous créons des stations simultanées.",
    options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_tb4: {
    message: "La plupart des expériences durent 1,5 à 3 heures. Nous ajustons la durée selon votre emploi du temps — sessions courtes (45 min) ou programmes d'une demi-journée / journée complète.",
    options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_tb5: {
    message: "Absolument ! Chaque expérience est personnalisée selon vos objectifs, la taille du groupe, les besoins alimentaires et les préférences. Compétitif ? Éducatif ? Festif ? Nous adaptons tout.",
    options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_tb6: {
    message: "Toujours ! L'inclusivité est au cœur de nos valeurs. Chaque expérience comprend des options sans alcool, et nous accommodons tous les besoins alimentaires (végétalien, sans gluten, halal, kosher, allergies).",
    options: [{ label: "Plus de questions", next: "faq_team_building" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Vin & Cuisine ----------- */
  faq_wine: {
    message: "Questions sur les expériences vin & cuisine :",
    options: [
      { label: "Quelles expériences vinicoles ?",       next: "faq_w1" },
      { label: "Faut-il s'y connaître en vin ?",        next: "faq_w2" },
      { label: "Où ont lieu les dégustations ?",         next: "faq_w3" },
      { label: "Vous déplacez-vous au bureau ?",         next: "faq_w4" },
      { label: "Nourriture incluse ?",                   next: "faq_w5" },
      { label: "Événements privés ?",                    next: "faq_w6" }
    ],
    tag: "Support_FAQ"
  },
  faq_w1: {
    message: "Nos expériences vin & cuisine comprennent :\n\n🍷 Dégustations guidées (débutant à avancé)\n🧀 Accords vin & fromage / charcuterie\n🍳 Cours de cuisine avec accords de vins\n🍾 Ateliers vins mousseux & cocktails\n🏞️ Visites de vignobles en Ontario\n🍕 Soirées pizza & vin\n🌍 Tours vinicoles du monde\n📚 Formation et préparation à la certification",
    options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver une expérience", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_w2: {
    message: "Pas du tout ! Nos expériences sont conçues pour tous les niveaux — des débutants aux amateurs chevronnés. Nos sommeliers rendent tout accessible, amusant et sans jargon.",
    options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver une expérience", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_w3: {
    message: "Nous organisons des dégustations en divers lieux :\n\n• Vignobles et domaines partenaires en Ontario\n• Salles privées et espaces événementiels\n• Votre bureau ou lieu de choix\n• Virtuel (kits expédiés aux participants)\n\nNous trouverons le cadre parfait pour votre groupe.",
    options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver une expérience", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_w4: {
    message: "Absolument ! Nous apportons tout chez vous — vin, verrerie, accords alimentaires et un sommelier hôte. Vous n'avez besoin que d'un espace, nous nous occupons du reste.",
    options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver une expérience", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_w5: {
    message: "La plupart de nos dégustations incluent des accords alimentaires — fromage, charcuterie ou bouchées sélectionnées pour compléter les vins. Nous accommodons tous les besoins alimentaires.",
    options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver une expérience", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_w6: {
    message: "Oui ! Nous organisons des expériences vinicoles privées pour anniversaires, soirées romantiques, enterrements de vie de jeune fille et toute célébration. Entièrement personnalisables.",
    options: [{ label: "Plus de questions", next: "faq_wine" }, { label: "Réserver une expérience", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Cadeaux ----------- */
  faq_gifting: {
    message: "Questions sur les cadeaux corporatifs et personnalisés :",
    options: [
      { label: "Que contient un coffret ?",            next: "faq_gf1" },
      { label: "Puis-je personnaliser ?",              next: "faq_gf2" },
      { label: "Quantité minimale ?",                  next: "faq_gf3" },
      { label: "Où livrez-vous ?",                     next: "faq_gf4" },
      { label: "Délai de commande ?",                  next: "faq_gf5" },
      { label: "Cadeaux sans alcool ?",                next: "faq_gf6" }
    ],
    tag: "Support_FAQ"
  },
  faq_gf1: {
    message: "Nos coffrets cadeaux sont des collections soigneusement composées :\n\n🍷 Vins sélectionnés\n🧀 Fromages artisanaux & charcuterie\n🍫 Chocolats & friandises gourmandes\n☕ Café & thé premium\n🫒 Huiles d'olive, tartinades & garde-manger\n🕯️ Bougies & produits de bien-être\n📝 Articles personnalisés (votre logo !)\n\nChaque coffret est magnifiquement présenté avec une carte personnalisée.",
    options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_gf2: {
    message: "Absolument ! La personnalisation est notre spécialité. Choisissez des articles spécifiques, ajoutez un emballage griffé, incluez des messages personnalisés, sélectionnez des thèmes de couleur et plus encore.",
    options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_gf3: {
    message: "Il n'y a pas de minimum strict — nous pouvons créer un cadeau unique sur mesure ou des centaines pour un programme corporatif. Pour le meilleur prix unitaire, les commandes de 10+ fonctionnent le mieux.",
    options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_gf4: {
    message: "Nous livrons partout au Canada ! Pour les commandes en Ontario, nous pouvons livrer dans la semaine. Les envois à travers le pays prennent 3 à 7 jours ouvrables.",
    options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_gf5: {
    message: "Pour les commandes personnalisées, nous recommandons 2 à 3 semaines de délai. En haute saison (novembre–décembre), 4 à 6 semaines est idéal. Les commandes urgentes peuvent être possibles — demandez-nous !",
    options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_gf6: {
    message: "Bien sûr ! Nous avons une magnifique sélection de cadeaux sans alcool : thés gourmets, café artisanal, chocolats, produits de bien-être et spécialités alimentaires.",
    options: [{ label: "Plus de questions", next: "faq_gifting" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Sip Club ----------- */
  faq_sip_club: {
    message: "Questions sur l'abonnement Sip Club :",
    options: [
      { label: "Qu'est-ce que le Sip Club ?",          next: "faq_sc1" },
      { label: "Comment ça fonctionne ?",               next: "faq_sc2" },
      { label: "Qu'est-ce qui est inclus ?",             next: "faq_sc3" },
      { label: "Offrir un abonnement ?",                 next: "faq_sc4" },
      { label: "Combien ça coûte ?",                     next: "faq_sc5" },
      { label: "Annulation possible ?",                  next: "faq_sc6" }
    ],
    tag: "Support_FAQ"
  },
  faq_sc1: {
    message: "Le Sip Club est le service d'abonnement vinicole de SommEvents. Chaque mois (ou trimestre), vous recevez des vins sélectionnés par nos sommeliers certifiés, avec notes de dégustation, guides d'accords et accès à des événements virtuels exclusifs.",
    options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "Rejoindre le Sip Club", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_sc2: {
    message: "Voici comment ça fonctionne :\n\n1️⃣ Choisissez votre formule (mensuelle ou trimestrielle)\n2️⃣ Indiquez vos préférences (rouge, blanc, rosé, mousseux, mixte)\n3️⃣ Nous composons une sélection pour vous\n4️⃣ Les vins sont livrés à votre porte\n5️⃣ Participez à nos événements de dégustation exclusifs\n\nC'est comme avoir un sommelier personnel !",
    options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "Rejoindre le Sip Club", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_sc3: {
    message: "Chaque livraison Sip Club comprend :\n\n🍷 2 à 4 vins soigneusement sélectionnés\n📝 Notes de dégustation détaillées\n🍽️ Suggestions d'accords mets-vins\n🎥 Accès aux événements de dégustation virtuels\n💡 Anecdotes sur le vin\n🎉 Rabais exclusifs sur les événements et cadeaux",
    options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "Rejoindre le Sip Club", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_sc4: {
    message: "Oui ! Le Sip Club fait un cadeau incroyable. Nous offrons des abonnements cadeaux de 1, 3, 6 ou 12 mois, avec une belle carte de bienvenue.",
    options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "Offrir un abonnement", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_sc5: {
    message: "Les tarifs du Sip Club varient selon votre formule (mensuelle vs trimestrielle), le nombre de bouteilles, les préférences et les détails de livraison.\n\nPartagez ce que vous recherchez et nous recommanderons une option adaptée — incluant les tarifs pour programmes corporatifs.",
    options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "Rejoindre le Sip Club", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_sc6: {
    message: "Oui — aucun engagement à long terme. Vous pouvez mettre en pause, sauter ou annuler votre abonnement à tout moment. Nous demandons simplement un préavis avant votre prochain cycle de facturation.",
    options: [{ label: "Plus de questions", next: "faq_sip_club" }, { label: "Rejoindre le Sip Club", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Réservation ----------- */
  faq_booking: {
    message: "Questions sur notre processus de réservation :",
    options: [
      { label: "Comment réserver ?",                    next: "faq_b1" },
      { label: "Quel est le processus ?",               next: "faq_b2" },
      { label: "Combien de temps à l'avance ?",         next: "faq_b3" },
      { label: "Modifier ma réservation ?",              next: "faq_b4" },
      { label: "Politique d'annulation ?",               next: "faq_b5" },
      { label: "Dépôt requis ?",                         next: "faq_b6" }
    ],
    tag: "Support_FAQ"
  },
  faq_b1: {
    message: "Réserver est facile !\n\n1️⃣ Contactez-nous via ce chat, par courriel (info@sommevents.com) ou notre site web\n2️⃣ Nous planifions un appel découverte rapide\n3️⃣ Recevez une proposition et un devis personnalisés\n4️⃣ Approuvez et réservez votre date avec un dépôt\n5️⃣ Nous nous occupons du reste !\n\nLa plupart des réservations sont confirmées sous 48 heures.",
    options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_b2: {
    message: "Notre processus :\n\n📞 Découverte — Nous apprenons votre vision, vos objectifs et la logistique\n📋 Proposition — Proposition détaillée avec options et tarifs\n✅ Confirmation — Vous approuvez et nous réservons votre date\n🎨 Planification — Nous concevons et coordonnons tout\n🎉 Exécution — Nous donnons vie au jour J\n💬 Suivi — Bilan et retours post-événement",
    options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_b3: {
    message: "Délais recommandés :\n\n• Petites expériences (dégustations, ateliers) : 2–4 semaines\n• Événements moyens (activités de groupe, dîners) : 4–8 semaines\n• Grands événements (galas, retraites) : 3–6 mois\n• Haute saison / fêtes : Réservez tôt !",
    options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_b4: {
    message: "Oui ! Nous comprenons que les plans changent. Nous travaillerons avec vous pour ajuster les dates, le nombre d'invités ou les détails. Prévenez-nous le plus tôt possible.",
    options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_b5: {
    message: "Notre politique d'annulation dépend du type et de l'envergure de votre événement :\n\n• 30+ jours : Remboursement complet (moins le dépôt)\n• 15–29 jours : Remboursement de 50 %\n• Moins de 15 jours : Non remboursable\n\nLes termes spécifiques sont détaillés dans votre contrat.",
    options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_b6: {
    message: "Oui, nous demandons généralement un dépôt pour réserver votre date — habituellement 25–50 % du total. Le solde est dû avant la date de l'événement. Nous acceptons les virements, cartes de crédit et facturation corporative.",
    options: [{ label: "Plus de questions", next: "faq_booking" }, { label: "Commencer", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },

  /* ----------- FAQ: Tarifs ----------- */
  faq_pricing: {
    message: "Questions sur les tarifs et politiques :",
    options: [
      { label: "Comment sont déterminés les tarifs ?",  next: "faq_p1" },
      { label: "Forfaits disponibles ?",                next: "faq_p2" },
      { label: "Adapter à mon budget ?",                next: "faq_p3" },
      { label: "Qu'est-ce qui est inclus ?",            next: "faq_p4" },
      { label: "Méthodes de paiement ?",                next: "faq_p5" },
      { label: "Frais cachés ?",                        next: "faq_p6" }
    ],
    tag: "Support_FAQ"
  },
  faq_p1: {
    message: "Les tarifs sont personnalisés selon :\n\n• Type d'expérience ou événement\n• Taille du groupe\n• Niveau de personnalisation\n• Lieu\n• Durée\n• Exigences spéciales\n\nNous fournissons des devis transparents et détaillés.",
    options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_p2: {
    message: "Nous offrons des forfaits de base qui servent de point de départ, mais tout est personnalisable. Nous préférons créer quelque chose de parfait pour vous plutôt qu'une approche universelle.",
    options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_p3: {
    message: "Absolument ! Nous travaillons avec une large gamme de budgets. Indiquez votre fourchette et nous concevrons quelque chose de spectaculaire en conséquence.",
    options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_p4: {
    message: "Nos tarifs incluent généralement :\n\n✓ Planification et coordination\n✓ Nourriture et boissons (le cas échéant)\n✓ Animation par un sommelier / hôte\n✓ Matériel et fournitures\n✓ Installation et démontage\n✓ TPS/TVH\n\nLa location de lieu ou les extras premium sont cotés séparément. Tout est transparent.",
    options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_p5: {
    message: "Nous acceptons :\n\n💳 Cartes de crédit (Visa, Mastercard, Amex)\n🏦 Virement électronique\n📄 Facturation corporative (NET 15/30)\n\nNous nous adaptons volontiers à votre processus d'approvisionnement.",
    options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  },
  faq_p6: {
    message: "Aucun frais caché — jamais. Nos devis sont transparents et détaillés. Les ajouts optionnels sont clairement listés comme postes séparés.",
    options: [{ label: "Plus de questions", next: "faq_pricing" }, { label: "Obtenir un devis", next: "lead_capture" }, { label: "Retour au menu", next: "mainMenu" }],
    tag: "Support_FAQ"
  }
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
