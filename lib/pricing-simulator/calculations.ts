import type { CommissionType, SimulatorRowInput } from "./defaultRows";
import { getTableBasePrice } from "./pricingData";

export type SimulatorRowCalculated = SimulatorRowInput & {
  laborCost: number;
  bossProfit: number;
  commission: number;
  totalExGst: number;
  finalQuote: number;
  gstAmount: number;
};

export type SimulatorSummary = {
  laborCost: number;
  customerDiscount: number;
  commission: number;
  myProfit: number;
  bossProfit: number;
  finalQuote: number;
  gstAmount: number;
};

const round = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;
const clamp = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);

const calcCommission = (
  type: CommissionType,
  value: number,
  base: number,
): number => {
  if (type === "fixed") return round(clamp(value));
  return round(clamp(base) * (clamp(value) / 100));
};

export const calculateRow = (row: SimulatorRowInput): SimulatorRowCalculated => {
  const tablePrice = getTableBasePrice(row.cleanCategory, row.roomConfig, row.frequency);
  const laborCost = round(tablePrice * 0.75);

  const discountAmount = clamp(row.customerDiscount);
  const myProfitAmt = clamp(row.myProfit);
  const bossProfitAmt = myProfitAmt;

  // Commission is calculated as % of (labor + discount + 2×myProfit) to avoid circular reference
  const preCommissionBase = laborCost + discountAmount + myProfitAmt + bossProfitAmt;
  const commission = calcCommission(row.commissionType, row.commissionValue, preCommissionBase);

  const totalExGst = round(preCommissionBase + commission);
  const finalQuote = round(totalExGst * 1.1);
  const gstAmount = round(finalQuote / 11);

  return {
    ...row,
    laborCost,
    bossProfit: bossProfitAmt,
    commission,
    totalExGst,
    finalQuote,
    gstAmount,
  };
};

export const calculateSummary = (rows: SimulatorRowCalculated[]): SimulatorSummary =>
  rows.reduce<SimulatorSummary>(
    (acc, row) => ({
      laborCost: round(acc.laborCost + row.laborCost),
      customerDiscount: round(acc.customerDiscount + clamp(row.customerDiscount)),
      commission: round(acc.commission + row.commission),
      myProfit: round(acc.myProfit + clamp(row.myProfit)),
      bossProfit: round(acc.bossProfit + row.bossProfit),
      finalQuote: round(acc.finalQuote + row.finalQuote),
      gstAmount: round(acc.gstAmount + row.gstAmount),
    }),
    {
      laborCost: 0,
      customerDiscount: 0,
      commission: 0,
      myProfit: 0,
      bossProfit: 0,
      finalQuote: 0,
      gstAmount: 0,
    },
  );
