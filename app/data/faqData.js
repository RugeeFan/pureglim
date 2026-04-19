export const faqs = [
  {
    question: "How much does house cleaning cost in Sydney?",
    answer:
      "Regular house cleaning with PureGlim starts from $150 for a 1-bedroom home (fortnightly), $185 for 2 bedrooms, $225 for 3 bedrooms, and $275 for 4+ bedrooms. Weekly bookings receive a 10% discount. One-off cleans are also available, starting from $180 for a 1-bedroom home. Additional bathrooms add $20–$60 depending on count. You can get an instant price on our website — no call required.",
  },
  {
    question: "What's included in a regular clean?",
    answer:
      "A regular clean covers: kitchen surfaces and sink, bathroom wipe-down and fixtures, dusting of furniture and ledges, bins emptied and reset, vacuuming throughout, hard floors mopped, beds and sofas straightened, and a general surface wipe-over. It's designed to keep your home consistently fresh between visits.",
  },
  {
    question: "How much does end of lease (bond) cleaning cost in Sydney?",
    answer:
      "End of lease cleaning starts from $340 for a 1-bedroom home, $430 for 2 bedrooms, $520 for 3 bedrooms, and $620+ for 4+ bedrooms. Additional bathrooms add $35–$105. Optional add-ons include carpet cleaning ($70), oven cleaning ($65), fridge cleaning ($35), interior windows ($45), microwave ($20), and laundry area ($30). You can build your estimate on our website.",
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
      "Weekly suits busy households and families who want the place consistently tidy. Fortnightly is our most popular option — it's enough to keep things in good shape without feeling like constant disruption. Monthly works well as a supplement to your own routine, or for lower-traffic homes. Pricing reflects the frequency: weekly gets a 10% discount, monthly costs a little more than fortnightly.",
  },
  {
    question: "Do I need to be home during the clean?",
    answer:
      "No — many clients aren't home. We're comfortable with key handover, lockbox access, or any arrangement that works for you. You'll receive confirmation before and after each visit. If it's your first clean, being home for the first 10 minutes can be helpful but isn't required.",
  },
  {
    question: "Can I book a one-off clean rather than a recurring service?",
    answer:
      "Yes. One-off cleans are available — select 'One-time' as your frequency when getting a quote. One-off prices start from $180 for a 1-bedroom home and are slightly higher than recurring rates, since there's no ongoing schedule. End of lease cleaning is always a one-off service by nature.",
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
