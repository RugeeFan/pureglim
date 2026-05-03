// Data for the rich location pages (regions + selected suburbs).
// Used by app/locations/[slug]/page.js, sitemap.ts, and any internal-link blocks.
// Keep entries factual and human — copy here is what Google indexes.

export const SITE_URL = "https://pureglim.com.au";

export const ESTIMATE_LEAD = "Get an instant cleaning estimate online.";

// Shared starter copy fragments — kept in one place to stay consistent across pages.
export const ROUTES_LINE =
  "PureGlim serves homes across Sydney, with stable regular cleaning routes through the Eastern Suburbs and North Shore — so these areas are especially well-suited to long-term recurring cleaning.";

const REGULAR_PRICES = [
  { size: "1 bedroom", price: "$130" },
  { size: "2 bedrooms", price: "$140" },
  { size: "3 bedrooms", price: "$165" },
  { size: "4 bedrooms+", price: "$200" },
];

const END_OF_LEASE_PRICES = [
  { size: "1 bedroom", price: "$280" },
  { size: "2 bedrooms", price: "$320" },
  { size: "3 bedrooms", price: "$360" },
  { size: "4 bedrooms+", price: "$530" },
];

const COMMON_FAQS = [
  {
    q: "How is the online estimate calculated?",
    a: "It's based on your home size, number of bathrooms, frequency, and any add-ons. It's a quick starting point — the final price may shift slightly depending on the condition of the home, access, and what's needed on the first visit. We'll confirm before booking.",
  },
  {
    q: "Do you only serve this area?",
    a: "No. We serve homes right across Sydney. We just have stable regular cleaning routes through the Eastern Suburbs and North Shore, which is why those areas tend to suit long-term recurring cleaning especially well.",
  },
  {
    q: "Do I need to be home during the clean?",
    a: "No — most clients give us entry instructions (key lockbox, building code, or a key handover) and aren't home. The same cleaner attends each recurring visit so you always know who to expect.",
  },
  {
    q: "What's included in a regular clean?",
    a: "Kitchen surfaces and sink, bathroom wipe-down, vacuuming and mopping throughout, dusting, mirrors, and bins. We bring our own products and equipment unless you'd prefer we use yours.",
  },
];

const END_OF_LEASE_FAQ = {
  q: "Can you do an end-of-lease clean here?",
  a: "Yes. End-of-lease cleaning is a thorough one-off clean covering inside cupboards, appliance exteriors, skirting boards, bathroom mould treatment, and all the inspection points agents check. Add-ons like oven, carpet steam, and stain treatment are available in the booking flow.",
};

// ───────────────────────── Region pages ─────────────────────────

export const regions = [
  {
    slug: "eastern-suburbs",
    region: "eastern",
    eyebrow: "Sydney Eastern Suburbs",
    h1: "House cleaning across Sydney's Eastern Suburbs",
    title: "House Cleaning Eastern Suburbs Sydney | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable house cleaning for Eastern Suburbs homes, with regular routes through Bondi, Randwick, Coogee, Maroubra, and nearby areas.",
    geo: { lat: -33.8915, lng: 151.2767, radius: 10000 },
    suburbs: [
      "Bondi",
      "Bondi Beach",
      "Bondi Junction",
      "Bronte",
      "Tamarama",
      "Coogee",
      "Clovelly",
      "Randwick",
      "Maroubra",
      "Rose Bay",
      "Bellevue Hill",
      "Double Bay",
      "Paddington",
      "Vaucluse",
      "Watsons Bay",
    ],
  },
  {
    slug: "northern-suburbs",
    region: "north",
    eyebrow: "Sydney North Shore & Northern Suburbs",
    h1: "House cleaning across the North Shore & Northern Sydney",
    title: "House Cleaning North Shore & Northern Sydney | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable house cleaning across the North Shore and Northern Sydney, with regular routes through Mosman, Chatswood, North Sydney, Neutral Bay, Manly, and nearby areas.",
    geo: { lat: -33.8269, lng: 151.2069, radius: 12000 },
    suburbs: [
      "Mosman",
      "Neutral Bay",
      "Cremorne",
      "Kirribilli",
      "McMahons Point",
      "North Sydney",
      "Crows Nest",
      "St Leonards",
      "Chatswood",
      "Lane Cove",
      "Willoughby",
      "Northbridge",
      "Manly",
    ],
  },
];

// ───────────────────────── Suburb rich pages ─────────────────────────
// Each entry powers /locations/<slug>. Keep copy unique — these are not
// doorway pages, they earn their place by saying something true and useful.

export const suburbs = [
  // ───── Eastern Suburbs ─────
  {
    slug: "bondi",
    name: "Bondi",
    region: "eastern",
    regionName: "Eastern Suburbs",
    regionSlug: "eastern-suburbs",
    eyebrow: "House cleaning · Bondi",
    h1: "House cleaning in Bondi",
    title: "House Cleaning Bondi | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable house and apartment cleaning in Bondi, Bondi Beach, and Bondi Junction — with regular Eastern Suburbs routes and a free re-clean guarantee.",
    intro:
      "Bondi is one of the busiest pockets of the Eastern Suburbs — a mix of beachside apartments, terraces, and share houses that turn over often. We clean across all of it: a quick fortnightly upkeep on a Hall Street apartment, a deeper end-of-lease in a Bondi Junction unit, or a regular weekly clean for a family in North Bondi.",
    nearby: ["Bondi Beach", "Bondi Junction", "Bronte", "Tamarama", "North Bondi"],
    coords: { lat: -33.8915, lng: 151.2767 },
    localNote:
      "Bondi sits on one of our regular Eastern Suburbs routes, which makes weekly or fortnightly cleaning easy to schedule consistently. Parking and building access can be tight near Campbell Parade — share access notes at booking and we'll factor it in.",
  },
  {
    slug: "randwick",
    name: "Randwick",
    region: "eastern",
    regionName: "Eastern Suburbs",
    regionSlug: "eastern-suburbs",
    eyebrow: "House cleaning · Randwick",
    h1: "House cleaning in Randwick",
    title: "House Cleaning Randwick | PureGlim",
    description:
      "Get an instant cleaning estimate online. Regular and end-of-lease cleaning in Randwick, Coogee, Clovelly, and the surrounding Eastern Suburbs — done with care and consistency.",
    intro:
      "Randwick is a steady mix of long-term family homes, professional households, and student rentals near the university and hospital. We work across all three — fortnightly upkeep, one-off pre-inspection cleans for landlords, and detailed end-of-lease jobs for outgoing tenants.",
    nearby: ["Coogee", "Clovelly", "Kensington", "Kingsford", "Centennial Park"],
    coords: { lat: -33.9173, lng: 151.2413 },
    localNote:
      "Randwick is on our usual Eastern Suburbs regular route, so weekly and fortnightly slots are usually easy to find. We're well-practised on the typical Randwick rental — Art Deco apartments and red-brick walk-ups need a careful approach, especially around tile grout and skirting.",
  },
  {
    slug: "coogee",
    name: "Coogee",
    region: "eastern",
    regionName: "Eastern Suburbs",
    regionSlug: "eastern-suburbs",
    eyebrow: "House cleaning · Coogee",
    h1: "House cleaning in Coogee",
    title: "House Cleaning Coogee | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable house and apartment cleaning in Coogee, Clovelly, and South Coogee — with regular Eastern Suburbs routes and consistent quality.",
    intro:
      "Coogee homes range from beachside apartments to family homes set back along Carrington Road. The salt air and sand mean kitchens and bathrooms need consistent care — we know the local quirks and clean to a standard that holds up between visits.",
    nearby: ["Clovelly", "South Coogee", "Randwick", "Maroubra", "Bronte"],
    coords: { lat: -33.9213, lng: 151.2589 },
    localNote:
      "Coogee is on our weekly Eastern Suburbs route. We pay extra attention to window tracks and tile grout here — coastal homes get more buildup than inland ones, and surfaces benefit from a careful, repeat schedule.",
  },
  {
    slug: "maroubra",
    name: "Maroubra",
    region: "eastern",
    regionName: "Eastern Suburbs",
    regionSlug: "eastern-suburbs",
    eyebrow: "House cleaning · Maroubra",
    h1: "House cleaning in Maroubra",
    title: "House Cleaning Maroubra | PureGlim",
    description:
      "Get an instant cleaning estimate online. Regular and end-of-lease cleaning in Maroubra, South Coogee, and Pagewood — straightforward, reliable service from a Sydney team.",
    intro:
      "Maroubra is largely family homes and longer-term apartments, often with steady weekly or fortnightly needs. We work across the area for homeowners, landlords managing turnovers, and growing families who want one less thing to manage.",
    nearby: ["South Coogee", "Pagewood", "Matraville", "Kingsford", "Coogee"],
    coords: { lat: -33.9501, lng: 151.2389 },
    localNote:
      "Maroubra is on our southern Eastern Suburbs route alongside Coogee and Pagewood. The mix of older brick homes and newer apartment blocks means we adjust scope rather than apply a template — we'll walk through what matters most before the first clean.",
  },

  // ───── Northern Suburbs / North Shore ─────
  {
    slug: "mosman",
    name: "Mosman",
    region: "north",
    regionName: "Lower North Shore",
    regionSlug: "northern-suburbs",
    eyebrow: "House cleaning · Mosman",
    h1: "House cleaning in Mosman",
    title: "House Cleaning Mosman | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable house cleaning for Mosman homes — careful, consistent, and discreet, with regular Lower North Shore routes.",
    intro:
      "Mosman homes tend to be detail-sensitive — well-kept, well-furnished, and often family-occupied. We clean here on a recurring schedule for households who'd rather not think about it: arrive when expected, work to a consistent standard, leave it as it should be.",
    nearby: ["Cremorne", "Neutral Bay", "Beauty Point", "Spit Junction", "Balmoral"],
    coords: { lat: -33.8284, lng: 151.2459 },
    localNote:
      "Mosman is on our Lower North Shore regular route. We're comfortable with the typical Mosman home — natural stone, timber floors, considered finishes — and choose products that are appropriate for the surfaces in your home rather than a one-size-fits-all kit.",
  },
  {
    slug: "north-sydney",
    name: "North Sydney",
    region: "north",
    regionName: "Lower North Shore",
    regionSlug: "northern-suburbs",
    eyebrow: "House cleaning · North Sydney",
    h1: "House & apartment cleaning in North Sydney",
    title: "House & Apartment Cleaning North Sydney | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable apartment cleaning in North Sydney, Kirribilli, and McMahons Point — fortnightly, weekly, or end-of-lease, with consistent quality.",
    intro:
      "North Sydney is largely apartments — from heritage walk-ups in Kirribilli to high-rise units near the CBD edge. Most of our work here is fortnightly upkeep for time-poor professionals and end-of-lease cleans timed around inspection windows.",
    nearby: ["Kirribilli", "McMahons Point", "Crows Nest", "Neutral Bay", "Waverton"],
    coords: { lat: -33.8401, lng: 151.2068 },
    localNote:
      "North Sydney sits on our weekday Lower North Shore route. Building access and visitor parking can be limiting near Miller Street — a quick note on access at booking saves time on the first visit.",
  },
  {
    slug: "chatswood",
    name: "Chatswood",
    region: "north",
    regionName: "Lower North Shore",
    regionSlug: "northern-suburbs",
    eyebrow: "House & office cleaning · Chatswood",
    h1: "House & office cleaning in Chatswood",
    title: "House & Office Cleaning Chatswood | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable home and workplace cleaning in Chatswood, Willoughby, and Lane Cove — built around your hours and how you actually use the space.",
    intro:
      "Chatswood is one of the few parts of the Lower North Shore where residential and commercial work are evenly mixed. We clean apartments, family homes, professional offices, and small studios here — typically on a recurring weekly or fortnightly schedule.",
    nearby: ["Willoughby", "Artarmon", "Roseville", "Lane Cove", "Castle Cove"],
    coords: { lat: -33.7969, lng: 151.1822 },
    localNote:
      "Chatswood is one of our most-active Lower North Shore postcodes, and we run both residential and commercial schedules through it weekly. For workplace cleaning, we'll do a quick walkthrough first — most office quotes come back fixed and predictable.",
  },
  {
    slug: "neutral-bay",
    name: "Neutral Bay",
    region: "north",
    regionName: "Lower North Shore",
    regionSlug: "northern-suburbs",
    eyebrow: "House cleaning · Neutral Bay",
    h1: "House & apartment cleaning in Neutral Bay",
    title: "House Cleaning Neutral Bay | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable apartment and end-of-lease cleaning in Neutral Bay, Cremorne, and Kirribilli — with regular Lower North Shore routes.",
    intro:
      "Neutral Bay is dense with apartments — many leased, many with regular tenancy turnover. We do a steady volume of fortnightly upkeep and end-of-lease bond cleans here, often back-to-back on the same building, which keeps the schedule predictable for clients.",
    nearby: ["Cremorne", "Kirribilli", "Cremorne Point", "Kurraba Point", "Wollstonecraft"],
    coords: { lat: -33.8323, lng: 151.2186 },
    localNote:
      "Neutral Bay is on our Lower North Shore regular route. Strata buildings here tend to have specific access rules — sharing the building's procedure at booking helps the first visit run smoothly.",
  },
  {
    slug: "manly",
    name: "Manly",
    region: "north",
    regionName: "Northern Beaches",
    regionSlug: "northern-suburbs",
    eyebrow: "House cleaning · Manly",
    h1: "House cleaning in Manly",
    title: "House Cleaning Manly | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable house and apartment cleaning in Manly, Fairlight, and Balgowlah — careful, consistent service from a Sydney team.",
    intro:
      "Manly is a different rhythm to the rest of the North Shore — beachside apartments, holiday rentals, and family homes that see more sand and salt than most. We clean here for full-time residents and regular short-stay turnover, with schedules that suit both.",
    nearby: ["Fairlight", "Balgowlah", "Queenscliff", "Freshwater", "Seaforth"],
    coords: { lat: -33.7969, lng: 151.2855 },
    localNote:
      "Manly is on our weekly Northern Beaches route. We adjust scope for beachside homes — extra attention to windows, tracks, and floors that catch more sand than usual is built into the regular visit, not charged as an add-on.",
  },
];

// ───────────────────────── Helpers ─────────────────────────

export function getSuburb(slug) {
  return suburbs.find((s) => s.slug === slug) || null;
}

export function getRegion(slug) {
  return regions.find((r) => r.slug === slug) || null;
}

export function getSuburbsForRegion(regionKey) {
  return suburbs.filter((s) => s.region === regionKey);
}

export { REGULAR_PRICES, END_OF_LEASE_PRICES, COMMON_FAQS, END_OF_LEASE_FAQ };
