export const navItems = [
  { label: "Home", panel: null },
  { label: "Services", panel: "services" },
  { label: "About", panel: "about" },
  { label: "Contact", panel: "contact" },
];

export const bedroomOptions = ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"];
export const bathroomOptions = ["1 Bathroom", "2 Bathrooms", "3 Bathrooms", "4+ Bathrooms"];
export const frequencyOptions = ["Weekly", "Every 2 weeks", "Every 4 weeks", "One-time"];

export const deepCleaningAddOns = [
  { id: "carpet", label: "Carpet cleaning", price: 70 },
  { id: "fridge", label: "Fridge cleaning", price: 35 },
  { id: "microwave", label: "Microwave cleaning", price: 20 },
  { id: "oven", label: "Oven cleaning", price: 65 },
  { id: "laundry", label: "Laundry area", price: 30 },
  { id: "windows", label: "Interior windows", price: 45 },
];

export const quoteBasePrices = {
  regular: {
    "1 Bedroom": 150,
    "2 Bedrooms": 185,
    "3 Bedrooms": 225,
    "4+ Bedrooms": 275,
  },
  deep: {
    "1 Bedroom": 340,
    "2 Bedrooms": 430,
    "3 Bedrooms": 520,
    "4+ Bedrooms": 620,
  },
};

// One-time (no recurring schedule) prices — shown as a separate option
// and also used as the first-visit price for new recurring customers
export const oneTimePrices = {
  "1 Bedroom": 180,
  "2 Bedrooms": 220,
  "3 Bedrooms": 270,
  "4+ Bedrooms": 330,
};

export const bathroomAddOn = {
  regular: {
    "1 Bathroom": 0,
    "2 Bathrooms": 20,
    "3 Bathrooms": 40,
    "4+ Bathrooms": 60,
  },
  deep: {
    "1 Bathroom": 0,
    "2 Bathrooms": 35,
    "3 Bathrooms": 70,
    "4+ Bathrooms": 105,
  },
};

// Multipliers apply to the fortnightly base price for recurring schedules only.
// "One-time" uses oneTimePrices directly — not this table.
export const frequencyMultiplier = {
  Weekly: 0.9,
  "Every 2 weeks": 1,
  "Every 4 weeks": 1.08,
};

export const services = [
  {
    id: "regular",
    panelLabel: "Residential cleaning",
    title: "One Time / Regular Cleaning",
    alternateTitle: "Residential / Tidy Clean",
    description:
      "Your home kept on top of, without the effort of organising it each time. One-off, weekly, fortnightly, or monthly.",
    cardDescription:
      "For homes that want reliable upkeep on a schedule that fits — or a one-off tidy when you need it.",
    featured: true,
    badge: "Popular",
    priceNote: "From $150",
    tone: "featured",
    ctaLabel: "Select this service",
    learnMoreLabel: "View details",
    detailTitle: "Regular care. Nothing to manage.",
    detailIntro:
      "Your home, kept in good shape visit after visit. Kitchens, bathrooms, bedrooms, and living areas fresh — without any disruption to your day.",
    summary:
      "Suits apartments, family homes, and anyone who wants a reliable routine.",
    includedTitle: "What's included",
    included: [
      "Kitchen surfaces and sink",
      "Bathroom wipe-down and fixtures",
      "Dusting of furniture and ledges",
      "Bins emptied and reset",
      "Vacuuming throughout",
      "Hard floors mopped",
      "Beds and sofas straightened",
      "General surface wipe-over",
    ],
    highlights: [
      "Weekly, fortnightly, or monthly — your call",
      "Consistent and easy to rely on",
      "Nothing to prepare or manage",
    ],
    quote: {
      type: "estimate",
      stepLabel: "Regular clean estimate",
      prompt:
        "Choose your home size and preferred frequency. Your estimate appears below.",
      contactPrompt:
        "Estimate ready. Leave your details and we'll confirm the timing.",
      resultLabel: "Estimated price",
      resultHint:
        "We'll confirm your price and arrival window within 24 hours.",
      nextLabel: "Book my clean",
      completeLabel: "Confirm booking",
    },
  },
  {
    id: "deep",
    panelLabel: "End of lease clean",
    title: "End of Lease Cleaning",
    alternateTitle: "Deep Cleaning / Bond Back",
    description:
      "A thorough clean for handovers and bond returns. Everything covered, including the parts that often get missed.",
    cardDescription:
      "For move-outs, inspections, or any time a home needs a proper reset.",
    badge: "Higher standard",
    priceNote: "From $340",
    tone: "premium",
    ctaLabel: "Select this service",
    learnMoreLabel: "View details",
    detailTitle: "Everything covered before the handover.",
    detailIntro:
      "A careful, detailed clean for end-of-lease returns and property resets. Corners, edges, appliances, and the things that often get left behind.",
    summary:
      "Suits tenancy handovers, bond returns, and one-off property resets.",
    includedTitle: "What's covered",
    included: [
      "Cupboards cleaned inside and out",
      "Skirting boards and edges detailed",
      "Appliance exteriors and high-touch areas",
      "Laundry area cleaned and reset",
      "Corners, tracks, and hard-to-reach spots",
      "Bathroom attention including mould where present",
      "Optional carpet and appliance add-ons",
      "Prepared to inspection standard",
    ],
    highlights: [
      "Prepared to inspection standard",
      "Edge work, corners, and built-up areas",
      "Add-ons for carpets and appliances",
    ],
    guarantee: {
      label: "Our commitment",
      title: "If anything within our scope is raised at inspection, we'll come back and sort it.",
      copy:
        "We clean to a standard that holds up. If a reasonable issue tied to our work is flagged at inspection, we re-clean at no charge.",
    },
    quote: {
      type: "estimate-with-addons",
      stepLabel: "End of lease estimate",
      prompt:
        "Choose your home size and any extras. Your estimate is below.",
      contactPrompt:
        "Estimate ready. Share your details and we'll confirm the date.",
      resultLabel: "Estimated price",
      resultHint:
        "We'll confirm your price and send notes before the clean.",
      nextLabel: "Check availability",
      completeLabel: "Confirm booking",
    },
  },
  {
    id: "commercial",
    panelLabel: "Workplace care",
    title: "Commercial Cleaning",
    alternateTitle: "Office / Shared Spaces",
    description:
      "Consistent cleaning for offices, shared spaces, and smaller commercial environments. Scheduled around how you work.",
    cardDescription:
      "For workspaces that need reliable cleaning without having to manage the details.",
    badge: "Custom plan",
    priceNote: "Contact us",
    tone: "light",
    ctaLabel: "Select this service",
    learnMoreLabel: "View details",
    detailTitle: "Built around your site and schedule.",
    detailIntro:
      "Commercial spaces vary too much for a template. We take the time to understand your layout, hours, and needs — then put together a plan that actually fits.",
    summary:
      "Suits offices, retail, shared spaces, studios, and recurring site care.",
    includedTitle: "Typical scope",
    included: [
      "Office and shared surface wiping",
      "Common areas refreshed and presentable",
      "Kitchenette and restroom cleaning",
      "Bins emptied and liners replaced",
      "Flexible daily, weekly, or after-hours visits",
      "Plan tailored to your site",
    ],
    highlights: [
      "Scheduled around your trading hours",
      "Scope shaped to your site",
      "Easier with a short conversation first",
    ],
    commercialUseCases: ["Offices", "Retail", "Shared spaces", "Studios", "Medical-adjacent admin areas"],
    quote: {
      type: "enquiry",
      stepLabel: "Workspace enquiry",
      prompt:
        "Tell us about your site and we'll put together a cleaning plan that actually fits.",
      contactPrompt:
        "We'll arrange a brief site visit to put together a proper plan. Leave your details and we'll be in touch.",
      resultLabel: "Enquiry received",
      resultHint:
        "We'll be in touch within 24 hours to arrange a site visit.",
      nextLabel: "Continue",
      completeLabel: "Request a site visit",
    },
  },
];
