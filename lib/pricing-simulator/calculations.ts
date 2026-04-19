import type {
  PricingSimulatorOwnerFirstRowInput,
  PricingSimulatorRowInput,
  ReferralCommissionType,
} from "./defaultRows";

export type ProfitHealth = "negative" | "low-margin" | "healthy";

export type PricingSimulatorRowCalculated = PricingSimulatorRowInput & {
  customerPayable: number;
  gstAmount: number;
  revenueExGst: number;
  referralCommission: number;
  profitPoolBeforeSplit: number;
  myProfit: number;
  partnerProfit: number;
  marginPercent: number;
  health: ProfitHealth;
};

export type PricingSimulatorSummary = {
  customerPayable: number;
  gstAmount: number;
  referralCommission: number;
  fleetCost: number;
  profitPoolBeforeSplit: number;
  myProfit: number;
  partnerProfit: number;
};

export type PricingSimulatorOwnerFirstRowCalculated = PricingSimulatorOwnerFirstRowInput & {
  customerPayable: number;
  gstAmount: number;
  revenueExGst: number;
  referralCommission: number;
  myTakeAmount: number;
  remainingForPartnerAndFleet: number;
  partnerAfterFleet: number;
  marginPercent: number;
  health: ProfitHealth;
};

export type PricingSimulatorOwnerFirstSummary = {
  customerPayable: number;
  gstAmount: number;
  referralCommission: number;
  myTakeAmount: number;
  fleetCost: number;
  remainingForPartnerAndFleet: number;
  partnerAfterFleet: number;
};

const roundCurrency = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const clampMoney = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);

export const calculateReferralCommission = (
  commissionType: ReferralCommissionType,
  commissionValue: number,
  baseAmount: number,
) => {
  if (commissionType === "fixed") return roundCurrency(clampMoney(commissionValue));
  return roundCurrency(clampMoney(baseAmount) * (clampMoney(commissionValue) / 100));
};

export const getProfitHealth = (resultValue: number, marginPercent: number): ProfitHealth => {
  if (resultValue < 0) return "negative";
  if (marginPercent < 10) return "low-margin";
  return "healthy";
};

export const calculatePricingRow = (
  row: PricingSimulatorRowInput,
): PricingSimulatorRowCalculated => {
  const listPriceIncGst = clampMoney(row.listPriceIncGst);
  const customerDiscount = clampMoney(row.customerDiscount);
  const customerPayable = roundCurrency(Math.max(0, listPriceIncGst - customerDiscount));
  const gstAmount = roundCurrency(customerPayable / 11);
  const revenueExGst = roundCurrency(customerPayable - gstAmount);
  const referralCommission = calculateReferralCommission(
    row.referralCommissionType,
    row.referralCommissionValue,
    customerPayable,
  );
  const fleetCost = clampMoney(row.fleetCost);
  const profitPoolBeforeSplit = roundCurrency(
    customerPayable - gstAmount - referralCommission - fleetCost,
  );
  const myProfit = roundCurrency(profitPoolBeforeSplit / 2);
  const partnerProfit = roundCurrency(profitPoolBeforeSplit / 2);
  const marginPercent =
    customerPayable > 0 ? roundCurrency((myProfit / customerPayable) * 100) : 0;

  return {
    ...row,
    listPriceIncGst,
    customerDiscount,
    referralCommissionValue: clampMoney(row.referralCommissionValue),
    fleetCost,
    customerPayable,
    gstAmount,
    revenueExGst,
    referralCommission,
    profitPoolBeforeSplit,
    myProfit,
    partnerProfit,
    marginPercent,
    health: getProfitHealth(myProfit, marginPercent),
  };
};

export const calculatePricingSummary = (
  rows: PricingSimulatorRowCalculated[],
): PricingSimulatorSummary =>
  rows.reduce<PricingSimulatorSummary>(
    (totals, row) => ({
      customerPayable: roundCurrency(totals.customerPayable + row.customerPayable),
      gstAmount: roundCurrency(totals.gstAmount + row.gstAmount),
      referralCommission: roundCurrency(totals.referralCommission + row.referralCommission),
      fleetCost: roundCurrency(totals.fleetCost + row.fleetCost),
      profitPoolBeforeSplit: roundCurrency(
        totals.profitPoolBeforeSplit + row.profitPoolBeforeSplit,
      ),
      myProfit: roundCurrency(totals.myProfit + row.myProfit),
      partnerProfit: roundCurrency(totals.partnerProfit + row.partnerProfit),
    }),
    {
      customerPayable: 0,
      gstAmount: 0,
      referralCommission: 0,
      fleetCost: 0,
      profitPoolBeforeSplit: 0,
      myProfit: 0,
      partnerProfit: 0,
    },
  );

export const calculateOwnerFirstPricingRow = (
  row: PricingSimulatorOwnerFirstRowInput,
): PricingSimulatorOwnerFirstRowCalculated => {
  const listPriceIncGst = clampMoney(row.listPriceIncGst);
  const customerDiscount = clampMoney(row.customerDiscount);
  const customerPayable = roundCurrency(Math.max(0, listPriceIncGst - customerDiscount));
  const gstAmount = roundCurrency(customerPayable / 11);
  const revenueExGst = roundCurrency(customerPayable - gstAmount);
  const referralCommission = calculateReferralCommission(
    row.referralCommissionType,
    row.referralCommissionValue,
    customerPayable,
  );
  const postReferralPool = roundCurrency(customerPayable - gstAmount - referralCommission);
  const myTakeAmount = calculateReferralCommission(row.myTakeType, row.myTakeValue, postReferralPool);
  const remainingForPartnerAndFleet = roundCurrency(postReferralPool - myTakeAmount);
  const fleetCost = clampMoney(row.fleetCost);
  const partnerAfterFleet = roundCurrency(remainingForPartnerAndFleet - fleetCost);
  const marginPercent =
    customerPayable > 0 ? roundCurrency((myTakeAmount / customerPayable) * 100) : 0;

  return {
    ...row,
    listPriceIncGst,
    customerDiscount,
    referralCommissionValue: clampMoney(row.referralCommissionValue),
    myTakeValue: clampMoney(row.myTakeValue),
    fleetCost,
    customerPayable,
    gstAmount,
    revenueExGst,
    referralCommission,
    myTakeAmount,
    remainingForPartnerAndFleet,
    partnerAfterFleet,
    marginPercent,
    health: getProfitHealth(partnerAfterFleet, marginPercent),
  };
};

export const calculateOwnerFirstPricingSummary = (
  rows: PricingSimulatorOwnerFirstRowCalculated[],
): PricingSimulatorOwnerFirstSummary =>
  rows.reduce<PricingSimulatorOwnerFirstSummary>(
    (totals, row) => ({
      customerPayable: roundCurrency(totals.customerPayable + row.customerPayable),
      gstAmount: roundCurrency(totals.gstAmount + row.gstAmount),
      referralCommission: roundCurrency(totals.referralCommission + row.referralCommission),
      myTakeAmount: roundCurrency(totals.myTakeAmount + row.myTakeAmount),
      fleetCost: roundCurrency(totals.fleetCost + row.fleetCost),
      remainingForPartnerAndFleet: roundCurrency(
        totals.remainingForPartnerAndFleet + row.remainingForPartnerAndFleet,
      ),
      partnerAfterFleet: roundCurrency(totals.partnerAfterFleet + row.partnerAfterFleet),
    }),
    {
      customerPayable: 0,
      gstAmount: 0,
      referralCommission: 0,
      myTakeAmount: 0,
      fleetCost: 0,
      remainingForPartnerAndFleet: 0,
      partnerAfterFleet: 0,
    },
  );
