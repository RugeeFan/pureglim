import {
  bathroomAddOn,
  bathroomOptions,
  bedroomOptions,
  oneTimePrices,
  quoteBasePrices,
} from "../../app/data/constants";

export type CleanType = "regular" | "first" | "deep";
export type ReferralCommissionType = "fixed" | "percent";

export type PricingSimulatorRowInput = {
  id: string;
  bedrooms: string;
  bathrooms: string;
  cleanType: CleanType;
  label: string;
  listPriceIncGst: number;
  customerDiscount: number;
  referralCommissionType: ReferralCommissionType;
  referralCommissionValue: number;
  fleetCost: number;
};

export type PricingSimulatorOwnerFirstRowInput = PricingSimulatorRowInput & {
  myTakeType: ReferralCommissionType;
  myTakeValue: number;
};

const rowId = (suffix: string) => `pricing-row-${suffix}`;

const shortHomeLabel = (bedrooms: string, bathrooms: string) =>
  `${bedrooms.replace(" Bedrooms", "B").replace(" Bedroom", "B")}${bathrooms
    .replace(" Bathrooms", "B")
    .replace(" Bathroom", "B")}`;

const buildLabel = (bedrooms: string, bathrooms: string, cleanType: CleanType) => {
  const typeLabel =
    cleanType === "regular"
      ? "Regular"
      : cleanType === "first"
        ? "First Clean"
        : "Deep Clean";

  return `${shortHomeLabel(bedrooms, bathrooms)} ${typeLabel}`;
};

const regularPrice = (bedrooms: string, bathrooms: string) =>
  quoteBasePrices.regular[bedrooms] + bathroomAddOn.regular[bathrooms];

const firstCleanPrice = (bedrooms: string, bathrooms: string) =>
  oneTimePrices[bedrooms] + bathroomAddOn.regular[bathrooms];

const deepCleanPrice = (bedrooms: string, bathrooms: string) =>
  quoteBasePrices.deep[bedrooms] + bathroomAddOn.deep[bathrooms];

export const defaultPricingSimulatorRows: PricingSimulatorRowInput[] = [
  {
    id: rowId("1"),
    bedrooms: bedroomOptions[0],
    bathrooms: bathroomOptions[0],
    cleanType: "regular",
    label: buildLabel(bedroomOptions[0], bathroomOptions[0], "regular"),
    listPriceIncGst: regularPrice(bedroomOptions[0], bathroomOptions[0]),
    customerDiscount: 20,
    referralCommissionType: "fixed",
    referralCommissionValue: 20,
    fleetCost: 78,
  },
  {
    id: rowId("2"),
    bedrooms: bedroomOptions[1],
    bathrooms: bathroomOptions[1],
    cleanType: "regular",
    label: buildLabel(bedroomOptions[1], bathroomOptions[1], "regular"),
    listPriceIncGst: regularPrice(bedroomOptions[1], bathroomOptions[1]),
    customerDiscount: 20,
    referralCommissionType: "fixed",
    referralCommissionValue: 20,
    fleetCost: 108,
  },
  {
    id: rowId("3"),
    bedrooms: bedroomOptions[1],
    bathrooms: bathroomOptions[1],
    cleanType: "first",
    label: buildLabel(bedroomOptions[1], bathroomOptions[1], "first"),
    listPriceIncGst: firstCleanPrice(bedroomOptions[1], bathroomOptions[1]),
    customerDiscount: 20,
    referralCommissionType: "fixed",
    referralCommissionValue: 20,
    fleetCost: 128,
  },
  {
    id: rowId("4"),
    bedrooms: bedroomOptions[2],
    bathrooms: bathroomOptions[1],
    cleanType: "first",
    label: buildLabel(bedroomOptions[2], bathroomOptions[1], "first"),
    listPriceIncGst: firstCleanPrice(bedroomOptions[2], bathroomOptions[1]),
    customerDiscount: 20,
    referralCommissionType: "percent",
    referralCommissionValue: 10,
    fleetCost: 156,
  },
  {
    id: rowId("5"),
    bedrooms: bedroomOptions[1],
    bathrooms: bathroomOptions[1],
    cleanType: "deep",
    label: buildLabel(bedroomOptions[1], bathroomOptions[1], "deep"),
    listPriceIncGst: deepCleanPrice(bedroomOptions[1], bathroomOptions[1]),
    customerDiscount: 0,
    referralCommissionType: "fixed",
    referralCommissionValue: 30,
    fleetCost: 245,
  },
  {
    id: rowId("6"),
    bedrooms: bedroomOptions[3],
    bathrooms: bathroomOptions[2],
    cleanType: "deep",
    label: buildLabel(bedroomOptions[3], bathroomOptions[2], "deep"),
    listPriceIncGst: deepCleanPrice(bedroomOptions[3], bathroomOptions[2]),
    customerDiscount: 20,
    referralCommissionType: "percent",
    referralCommissionValue: 10,
    fleetCost: 355,
  },
];

export const defaultOwnerFirstPricingSimulatorRows: PricingSimulatorOwnerFirstRowInput[] =
  defaultPricingSimulatorRows.map((row, index) => ({
    ...row,
    myTakeType: index < 2 ? "fixed" : "percent",
    myTakeValue: index < 2 ? 25 : 12,
  }));

export const emptyPricingSimulatorRow = (): PricingSimulatorRowInput => ({
  id:
    globalThis.crypto?.randomUUID?.() ??
    `pricing-row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  bedrooms: bedroomOptions[1],
  bathrooms: bathroomOptions[1],
  cleanType: "regular",
  label: buildLabel(bedroomOptions[1], bathroomOptions[1], "regular"),
  listPriceIncGst: regularPrice(bedroomOptions[1], bathroomOptions[1]),
  customerDiscount: 0,
  referralCommissionType: "fixed",
  referralCommissionValue: 0,
  fleetCost: 0,
});

export const emptyOwnerFirstPricingSimulatorRow =
  (): PricingSimulatorOwnerFirstRowInput => ({
    ...emptyPricingSimulatorRow(),
    myTakeType: "percent",
    myTakeValue: 10,
  });
