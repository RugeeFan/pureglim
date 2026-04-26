export type RoomConfig =
  | "1b1w" | "2b1w" | "2b2w"
  | "3b1w" | "3b2w" | "3b3w"
  | "4b1w" | "4b2w" | "4b3w"
  | "5b2w" | "5b3w" | "5b4w";

export type Frequency = "weekly" | "fortnightly" | "monthly" | "one-off";
export type CleanCategory = "regular" | "eol";

const EOL_CONFIG_SET = new Set<RoomConfig>([
  "1b1w", "2b1w", "2b2w",
  "3b1w", "3b2w", "3b3w",
  "4b1w", "4b2w", "4b3w",
]);

export const isValidEolConfig = (config: RoomConfig): boolean =>
  EOL_CONFIG_SET.has(config);

export const REGULAR_ROOM_CONFIGS: Array<{ value: RoomConfig; label: string }> = [
  { value: "1b1w", label: "1床1卫" },
  { value: "2b1w", label: "2床1卫" },
  { value: "2b2w", label: "2床2卫" },
  { value: "3b1w", label: "3床1卫" },
  { value: "3b2w", label: "3床2卫" },
  { value: "3b3w", label: "3床3卫" },
  { value: "4b1w", label: "4床1卫" },
  { value: "4b2w", label: "4床2卫" },
  { value: "4b3w", label: "4床3卫" },
  { value: "5b2w", label: "5床2卫" },
  { value: "5b3w", label: "5床3卫" },
  { value: "5b4w", label: "5床4卫" },
];

export const EOL_ROOM_CONFIGS: Array<{ value: RoomConfig; label: string }> = [
  { value: "1b1w", label: "1床1卫" },
  { value: "2b1w", label: "2床1卫" },
  { value: "2b2w", label: "2床2卫" },
  { value: "3b1w", label: "3床1卫" },
  { value: "3b2w", label: "3床2卫" },
  { value: "3b3w", label: "3床3卫" },
  { value: "4b1w", label: "4床1卫" },
  { value: "4b2w", label: "4床2卫" },
  { value: "4b3w", label: "4床3卫" },
];

export const FREQUENCY_OPTIONS: Array<{ value: Frequency; label: string }> = [
  { value: "weekly", label: "每周" },
  { value: "fortnightly", label: "每两周" },
  { value: "monthly", label: "每月" },
  { value: "one-off", label: "单次" },
];

const REGULAR_PRICES: Record<RoomConfig, Record<Frequency, number>> = {
  "1b1w": { weekly: 110, fortnightly: 130, monthly: 150, "one-off": 170 },
  "2b1w": { weekly: 120, fortnightly: 140, monthly: 160, "one-off": 190 },
  "2b2w": { weekly: 130, fortnightly: 165, monthly: 180, "one-off": 210 },
  "3b1w": { weekly: 130, fortnightly: 165, monthly: 170, "one-off": 200 },
  "3b2w": { weekly: 150, fortnightly: 180, monthly: 200, "one-off": 230 },
  "3b3w": { weekly: 165, fortnightly: 200, monthly: 215, "one-off": 250 },
  "4b1w": { weekly: 165, fortnightly: 200, monthly: 215, "one-off": 250 },
  "4b2w": { weekly: 175, fortnightly: 205, monthly: 220, "one-off": 255 },
  "4b3w": { weekly: 200, fortnightly: 230, monthly: 245, "one-off": 280 },
  "5b2w": { weekly: 190, fortnightly: 220, monthly: 240, "one-off": 275 },
  "5b3w": { weekly: 215, fortnightly: 245, monthly: 265, "one-off": 300 },
  "5b4w": { weekly: 240, fortnightly: 270, monthly: 290, "one-off": 330 },
};

const EOL_BASE: Partial<Record<RoomConfig, number>> = {
  "1b1w": 450, "2b1w": 500, "2b2w": 550,
  "3b1w": 550, "3b2w": 600, "3b3w": 650,
  "4b1w": 600, "4b2w": 650, "4b3w": 700,
};

const EOL_CARPET: Partial<Record<RoomConfig, number>> = {
  "1b1w": 100, "2b1w": 150, "2b2w": 170,
  "3b1w": 200, "3b2w": 200, "3b3w": 200,
  "4b1w": 250, "4b2w": 250, "4b3w": 250,
};

export const getTableBasePrice = (
  category: CleanCategory,
  config: RoomConfig,
  frequency: Frequency,
): number => {
  if (category === "regular") return REGULAR_PRICES[config][frequency];
  return EOL_BASE[config] ?? 0;
};

export const getCarpetPrice = (config: RoomConfig): number =>
  EOL_CARPET[config] ?? 0;
