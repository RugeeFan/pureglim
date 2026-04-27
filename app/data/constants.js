export const navItems = [
  { label: "Home", panel: null },
  { label: "Services", panel: "services" },
  { label: "About", panel: "about" },
  { label: "Contact", panel: "contact" },
];

export const bedroomOptions = ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "5+ Bedrooms"];
export const bathroomOptions = ["1 Bathroom", "2 Bathrooms", "3 Bathrooms", "4+ Bathrooms"];
export const frequencyOptions = ["Weekly", "Fortnightly", "Monthly", "One-time"];

export const deepCleaningAddOns = [
  { id: "carpet_steam", label: "Carpet steam cleaning", price: 80, priceLabel: "+from $80" },
  { id: "oven",         label: "Oven cleaning",         price: 20, priceLabel: "+from $20" },
  { id: "fridge",       label: "Fridge cleaning",       price: 20, priceLabel: "+from $20" },
  { id: "microwave",    label: "Microwave cleaning",    price: 20 },
  { id: "stairs",       label: "Staircase cleaning",    price: 60 },
  { id: "wall_stains",  label: "Wall stain removal",    price: 20, priceLabel: "+from $20" },
  { id: "toilet_stains",label: "Toilet stain removal",  price: 20, priceLabel: "+from $20" },
  { id: "pet_hair",     label: "Pet hair removal",      price: 20, priceLabel: "+from $20" },
  { id: "mold",         label: "Mould removal",         price: 20, priceLabel: "+from $20" },
  { id: "carpet_stains",label: "Carpet stain removal",  price: 25, priceLabel: "+from $25" },
  { id: "blinds",       label: "Blind cleaning",        price: 15, priceLabel: "+from $15/blind" },
];

export function getCarpetSteamPrice(bedrooms) {
  if (bedrooms === "2 Bedrooms") return 120;
  if (bedrooms === "3 Bedrooms" || bedrooms === "4 Bedrooms" || bedrooms === "5+ Bedrooms") return 150;
  return 80;
}

// ─── Regular cleaning price table ─────────────────────────────────────────────
// Combo keys: {bed}b{bath}w — prices are the minimum (inc. GST).
// Range for regular: +$25. Range for one-off / first clean: +$40.
// If referral code applied: entire range shifts down $20.

const REGULAR_PRICE_TABLE = {
  "1b1w": { Weekly: 110, Fortnightly: 130, Monthly: 150, "One-time": 170 },
  "2b1w": { Weekly: 120, Fortnightly: 140, Monthly: 160, "One-time": 190 },
  "2b2w": { Weekly: 130, Fortnightly: 165, Monthly: 180, "One-time": 210 },
  "3b1w": { Weekly: 130, Fortnightly: 165, Monthly: 170, "One-time": 200 },
  "3b2w": { Weekly: 150, Fortnightly: 180, Monthly: 200, "One-time": 230 },
  "3b3w": { Weekly: 165, Fortnightly: 200, Monthly: 215, "One-time": 250 },
  "4b1w": { Weekly: 165, Fortnightly: 200, Monthly: 215, "One-time": 250 },
  "4b2w": { Weekly: 175, Fortnightly: 205, Monthly: 220, "One-time": 255 },
  "4b3w": { Weekly: 200, Fortnightly: 230, Monthly: 245, "One-time": 280 },
  "5b2w": { Weekly: 190, Fortnightly: 220, Monthly: 240, "One-time": 275 },
  "5b3w": { Weekly: 215, Fortnightly: 245, Monthly: 265, "One-time": 300 },
  "5b4w": { Weekly: 240, Fortnightly: 270, Monthly: 290, "One-time": 330 },
};

export const REGULAR_PRICE_BUFFER = 25;   // range above minimum for regular cleans
export const FIRST_CLEAN_PRICE_BUFFER = 40; // range above minimum for one-off / first clean

// Approximate clean duration with 2 cleaners, by bathroom count
export const CLEANING_TIME_ESTIMATES = {
  "1 Bathroom":   "About 30 min",
  "2 Bathrooms":  "About 1 hr",
  "3 Bathrooms":  "About 1.5 hrs",
  "4+ Bathrooms": "About 2 hrs",
};

function getComboKey(bedrooms, bathrooms) {
  const bed = { "1 Bedroom": 1, "2 Bedrooms": 2, "3 Bedrooms": 3, "4 Bedrooms": 4, "5+ Bedrooms": 5 }[bedrooms] ?? 2;
  const bath = { "1 Bathroom": 1, "2 Bathrooms": 2, "3 Bathrooms": 3, "4+ Bathrooms": 4 }[bathrooms] ?? 1;

  if (bed <= 1) return "1b1w";
  if (bed === 2) return bath >= 2 ? "2b2w" : "2b1w";
  if (bed === 3) return bath >= 3 ? "3b3w" : bath >= 2 ? "3b2w" : "3b1w";
  if (bed === 4) return bath >= 3 ? "4b3w" : bath >= 2 ? "4b2w" : "4b1w";
  return bath >= 4 ? "5b4w" : bath >= 3 ? "5b3w" : "5b2w";
}

export function getRegularPrice(bedrooms, bathrooms, frequency) {
  const combo = getComboKey(bedrooms, bathrooms);
  return REGULAR_PRICE_TABLE[combo]?.[frequency] ?? 0;
}

export function getValidBathroomOptions(bedrooms) {
  const ranges = {
    "1 Bedroom":  [0, 1],
    "2 Bedrooms": [0, 2],
    "3 Bedrooms": [0, 3],
    "4 Bedrooms": [0, 3],
    "5+ Bedrooms": [1, 4],
  };
  const [start, end] = ranges[bedrooms] ?? [0, 0];
  return bathroomOptions.slice(start, end);
}

// ─── End-of-lease (deep clean) pricing ─────────────────────────────────────────
// Kept separate — these follow bedroom-only base + bathroom add-on structure.

export const quoteBasePrices = {
  deep: {
    "1 Bedroom":   280,
    "2 Bedrooms":  320,
    "3 Bedrooms":  360,
    "4 Bedrooms":  530,
    "5+ Bedrooms": 620,
  },
};

export const bathroomAddOn = {
  deep: {
    "1 Bathroom":  0,
    "2 Bathrooms": 80,
    "3 Bathrooms": 120,
    "4+ Bathrooms": 150,
  },
};

export const quoteBaseRanges = {
  deep: {
    "1 Bedroom":   { low: 280, high: 340 },
    "2 Bedrooms":  { low: 320, high: 390 },
    "3 Bedrooms":  { low: 360, high: 440 },
    "4 Bedrooms":  { low: 530, high: 640 },
    "5+ Bedrooms": { low: 620, high: 750 },
  },
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
    priceNote: "From $110",
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
    priceNote: "From $280",
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
