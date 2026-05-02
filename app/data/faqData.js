export const faqs = [
  {
    question: "How much does house cleaning cost in Sydney?",
    answer:
      "Regular house cleaning with PureGlim starts from $110 weekly, $130 fortnightly, $150 monthly, or $170 for a one-time / first visit on a 1-bedroom, 1-bathroom home. Fortnightly starting rates are $130 for 1 bedroom, $140 for 2 bedrooms, $165 for 3 bedrooms, and $200 for 4-bedroom homes. Larger homes, extra bathrooms, and first visits are quoted a little higher. You can get an instant price on our website — no call required.",
  },
  {
    question: "What's included in a regular clean?",
    answer:
      "A regular clean covers: kitchen surfaces and sink, bathroom wipe-down and fixtures, dusting of furniture and ledges, bins emptied and reset, vacuuming throughout, hard floors mopped, beds and sofas straightened, and a general surface wipe-over. It's designed to keep your home consistently fresh between visits.",
  },
  {
    question: "How much does end of lease (bond) cleaning cost in Sydney?",
    answer:
      "End of lease cleaning starts from $280 for a 1-bedroom home, $320 for 2 bedrooms, $360 for 3 bedrooms, $530 for 4 bedrooms, and $620 for 5+ bedroom homes. Additional bathrooms add $80-$150 depending on count. Optional extras like carpet steam cleaning, oven cleaning, fridge cleaning, blind cleaning, mould removal, and stain treatment can be added in the online quote.",
  },
  {
    question: "Do you clean in Bondi and the Eastern Suburbs?",
    answer:
      "Yes — we regularly clean across Bondi, Bondi Junction, Bronte, Coogee, Tamarama, Double Bay, Rose Bay, Vaucluse, Bellevue Hill, Woollahra, Paddington, Darlinghurst, and Randwick. See our Eastern Suburbs page for more detail, or contact us if you're unsure about your specific suburb.",
  },
  {
    question: "Do you clean in Mosman and the Northern Suburbs?",
    answer:
      "Yes — we cover Mosman, Neutral Bay, Cremorne, Kirribilli, North Sydney, Crows Nest, St Leonards, Chatswood, Lane Cove, Willoughby, and surrounding North Shore areas. See our Northern Suburbs page for more. We also do office and commercial cleaning in North Sydney and Chatswood.",
  },
  {
    question: "What is end of lease cleaning, and how is it different from a regular clean?",
    answer:
      "End of lease cleaning (also called bond cleaning or deep cleaning) is a thorough one-off clean performed when vacating a rental property. Unlike a regular clean, it covers areas that are typically skipped in routine maintenance — inside cupboards and drawers, skirting boards, mould treatment in bathrooms, appliance interiors, tracks, corners, and detailed edge work. It's cleaned to an inspection standard, not just a livability standard.",
  },
  {
    question: "Do you offer a bond-back guarantee?",
    answer:
      "Yes. If anything within our scope is raised at the inspection, we return and re-clean at no charge. We clean to a standard that holds up — if a reasonable issue tied to our work comes up, we sort it.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "You can get an instant estimate on our website without needing to call. Select your service (regular or end of lease), choose your home size and any add-ons, and a price appears immediately. For commercial cleaning, contact us directly as each workspace is priced individually.",
  },
  {
    question: "Do you do commercial or office cleaning?",
    answer:
      "Yes. We provide commercial cleaning for offices, retail spaces, shared workplaces, studios, and similar environments. Plans are built around your specific site and schedule — daily, weekly, or after-hours. This service is particularly relevant for businesses in North Sydney and Chatswood. Contact us to arrange a brief site walkthrough.",
  },
  {
    question: "How often should I have my home cleaned?",
    answer:
      "Weekly suits busy households and families who want the place consistently tidy. Fortnightly is our most popular option — it's enough to keep things in good shape without feeling like constant disruption. Monthly works well as a supplement to your own routine, or for lower-traffic homes. Pricing steps up by visit type: weekly is the lowest base rate, fortnightly sits in the middle, monthly is a little higher, and one-time / first visits are the highest because they take longer.",
  },
  {
    question: "Do I need to be home during the clean?",
    answer:
      "No — many clients aren't home. We're comfortable with key handover, lockbox access, or any arrangement that works for you. You'll receive confirmation before and after each visit. If it's your first clean, being home for the first 10 minutes can be helpful but isn't required.",
  },
  {
    question: "Can I book a one-off clean rather than a recurring service?",
    answer:
      "Yes. One-off cleans are available — select 'One-time' as your frequency when getting a quote. One-off prices start from $170 for a 1-bedroom, 1-bathroom home and are slightly higher than recurring rates, since there's no ongoing schedule. End of lease cleaning is always a one-off service by nature.",
  },
];

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};
