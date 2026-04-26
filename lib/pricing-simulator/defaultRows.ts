import type { CleanCategory, Frequency, RoomConfig } from "./pricingData";

export type CommissionType = "fixed" | "percent";

export type SimulatorRowInput = {
  id: string;
  roomConfig: RoomConfig;
  cleanCategory: CleanCategory;
  frequency: Frequency;
  customerDiscount: number;
  commissionType: CommissionType;
  commissionValue: number;
  myProfit: number;
};

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const defaultRows: SimulatorRowInput[] = [
  {
    id: "default-1",
    roomConfig: "2b2w",
    cleanCategory: "regular",
    frequency: "fortnightly",
    customerDiscount: 0,
    commissionType: "fixed",
    commissionValue: 0,
    myProfit: 15,
  },
  {
    id: "default-2",
    roomConfig: "3b2w",
    cleanCategory: "regular",
    frequency: "monthly",
    customerDiscount: 10,
    commissionType: "fixed",
    commissionValue: 15,
    myProfit: 15,
  },
  {
    id: "default-3",
    roomConfig: "4b3w",
    cleanCategory: "regular",
    frequency: "one-off",
    customerDiscount: 20,
    commissionType: "percent",
    commissionValue: 5,
    myProfit: 20,
  },
  {
    id: "default-4",
    roomConfig: "2b1w",
    cleanCategory: "eol",
    frequency: "fortnightly",
    customerDiscount: 0,
    commissionType: "fixed",
    commissionValue: 0,
    myProfit: 50,
  },
  {
    id: "default-5",
    roomConfig: "3b2w",
    cleanCategory: "eol",
    frequency: "fortnightly",
    customerDiscount: 0,
    commissionType: "fixed",
    commissionValue: 20,
    myProfit: 50,
  },
  {
    id: "default-6",
    roomConfig: "4b2w",
    cleanCategory: "eol",
    frequency: "fortnightly",
    customerDiscount: 50,
    commissionType: "percent",
    commissionValue: 5,
    myProfit: 50,
  },
];

export const emptyRow = (): SimulatorRowInput => ({
  id: makeId(),
  roomConfig: "2b2w",
  cleanCategory: "regular",
  frequency: "fortnightly",
  customerDiscount: 0,
  commissionType: "fixed",
  commissionValue: 0,
  myProfit: 15,
});
