// Sydney Eastern and Northern Suburbs postcodes served by PureGlim.
// Update this list to add or remove coverage areas.

// Eastern Suburbs
const EASTERN_SUBURBS = [
  "2000", // Sydney CBD
  "2001", // Sydney GPO
  "2006", // Camperdown
  "2007", // Broadway
  "2008", // Chippendale
  "2009", // Pyrmont, Ultimo
  "2010", // Surry Hills, Darlinghurst
  "2011", // Elizabeth Bay, Potts Point, Kings Cross
  "2015", // Alexandria
  "2016", // Redfern, Waterloo
  "2017", // Waterloo, Zetland
  "2018", // Eastlakes
  "2019", // Botany
  "2020", // Mascot
  "2021", // Paddington, Moore Park
  "2022", // Randwick
  "2023", // Kingsford
  "2024", // Bronte, Waverley
  "2025", // Bondi Junction
  "2026", // Bondi Beach, North Bondi
  "2027", // Darling Point, Edgecliff, Point Piper
  "2028", // Double Bay
  "2029", // Rose Bay
  "2030", // Vaucluse, Watsons Bay
  "2031", // Clovelly, Coogee
  "2032", // Kingsford
  "2033", // Kensington
  "2034", // Maroubra
  "2035", // Maroubra South
  "2036", // La Perouse, Little Bay, Chifley
];

// Northern Suburbs (Lower North Shore + Upper North Shore)
const NORTHERN_SUBURBS = [
  "2060", // Lavender Bay, North Sydney
  "2061", // Kirribilli, Milsons Point
  "2062", // Cammeray
  "2063", // Northbridge
  "2064", // Artarmon
  "2065", // St Leonards, Crows Nest
  "2066", // Linfield
  "2067", // Chatswood
  "2068", // Gordon, Killara
  "2069", // Roseville
  "2070", // Lindfield
  "2071", // Killara
  "2072", // Turramurra
  "2073", // Wahroonga
  "2074", // Hornsby area
  "2075", // St Ives
  "2076", // Turramurra
  "2077", // Hornsby
  "2088", // Mosman
  "2089", // Neutral Bay
  "2090", // Cremorne
  "2091", // Neutral Bay
  "2092", // Balgowlah, Seaforth
  "2093", // Manly Vale, Balgowlah Heights
  "2094", // Fairlight
  "2095", // Manly
  "2096", // Manly
];

export const ALLOWED_POSTCODES = [...EASTERN_SUBURBS, ...NORTHERN_SUBURBS];

export function normalizePostcode(postcode) {
  return String(postcode ?? "").trim().replace(/\D/g, "");
}

export function isValidAustralianPostcode(postcode) {
  return /^\d{4}$/.test(normalizePostcode(postcode));
}

export function isServiceAreaPostcode(postcode) {
  return ALLOWED_POSTCODES.includes(normalizePostcode(postcode));
}
