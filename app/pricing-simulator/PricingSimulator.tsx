"use client";

import { useMemo, useState } from "react";
import { bathroomOptions, bedroomOptions } from "../data/constants";
import styles from "./pricing-simulator.module.css";
import {
  defaultOwnerFirstPricingSimulatorRows,
  defaultPricingSimulatorRows,
  emptyOwnerFirstPricingSimulatorRow,
  emptyPricingSimulatorRow,
  type CleanType,
  type PricingSimulatorOwnerFirstRowInput,
  type PricingSimulatorRowInput,
  type ReferralCommissionType,
} from "../../lib/pricing-simulator/defaultRows";
import {
  calculateOwnerFirstPricingRow,
  calculateOwnerFirstPricingSummary,
  calculatePricingRow,
  calculatePricingSummary,
} from "../../lib/pricing-simulator/calculations";

const cleanTypeOptions: Array<{ value: CleanType; label: string }> = [
  { value: "regular", label: "Regular" },
  { value: "first", label: "First Clean" },
  { value: "deep", label: "Deep Clean" },
];

const commissionTypeOptions: Array<{ value: ReferralCommissionType; label: string }> = [
  { value: "fixed", label: "Fixed" },
  { value: "percent", label: "Percent" },
];

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-AU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatPercent = (value: number) => `${numberFormatter.format(value)}%`;

const parseNumberInput = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function PricingSimulator() {
  const [poolSplitRows, setPoolSplitRows] = useState<PricingSimulatorRowInput[]>(
    defaultPricingSimulatorRows,
  );
  const [ownerFirstRows, setOwnerFirstRows] = useState<PricingSimulatorOwnerFirstRowInput[]>(
    defaultOwnerFirstPricingSimulatorRows,
  );

  const calculatedPoolSplitRows = useMemo(
    () => poolSplitRows.map(calculatePricingRow),
    [poolSplitRows],
  );
  const poolSplitSummary = useMemo(
    () => calculatePricingSummary(calculatedPoolSplitRows),
    [calculatedPoolSplitRows],
  );

  const calculatedOwnerFirstRows = useMemo(
    () => ownerFirstRows.map(calculateOwnerFirstPricingRow),
    [ownerFirstRows],
  );
  const ownerFirstSummary = useMemo(
    () => calculateOwnerFirstPricingSummary(calculatedOwnerFirstRows),
    [calculatedOwnerFirstRows],
  );

  const updatePoolSplitRow = <K extends keyof PricingSimulatorRowInput>(
    rowId: string,
    field: K,
    value: PricingSimulatorRowInput[K],
  ) => {
    setPoolSplitRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    );
  };

  const updateOwnerFirstRow = <K extends keyof PricingSimulatorOwnerFirstRowInput>(
    rowId: string,
    field: K,
    value: PricingSimulatorOwnerFirstRowInput[K],
  ) => {
    setOwnerFirstRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    );
  };

  return (
    <div className={styles.pageShell}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Pricing simulator</p>
          <h1>Clean pricing and profit calculator.</h1>
          <p className={styles.lead}>
            Use this page to test different property sizes, clean types, discounts, referral deals,
            labour cost, and profit distribution. Everything runs in front-end state only, so you can
            change numbers freely without touching the real booking system.
          </p>
        </div>
        <div className={styles.logicCard}>
          <h2>What this page compares</h2>
          <ol>
            <li>All inputs are editable and recalculate immediately</li>
            <li>Prices are treated as GST-inclusive</li>
            <li>Referral commission can be fixed or percentage-based</li>
            <li>Section one keeps your current 50 / 50 profit-pool split logic</li>
            <li>Section two models taking your own cut first before partner + fleet sharing</li>
          </ol>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionIntro}>
          <div>
            <p className={styles.sectionEyebrow}>Model A</p>
            <h2>Profit pool split 50 / 50.</h2>
            <p>
              This follows the simpler structure: customer payable, remove GST and referral, deduct fleet cost,
              then split the remaining profit pool evenly between you and the partner.
            </p>
          </div>
          <div className={styles.logicMiniCard}>
            <strong>Formula</strong>
            <span>customer payable = list price - customer discount</span>
            <span>profit pool = customer payable - GST - referral - fleet cost</span>
            <span>my profit = profit pool / 2</span>
            <span>partner profit = profit pool / 2</span>
          </div>
        </div>

        <section className={styles.summaryGrid}>
          <SummaryCard
            label="Customer payable"
            value={formatCurrency(poolSplitSummary.customerPayable)}
          />
          <SummaryCard label="GST total" value={formatCurrency(poolSplitSummary.gstAmount)} />
          <SummaryCard
            label="Referral total"
            value={formatCurrency(poolSplitSummary.referralCommission)}
          />
          <SummaryCard
            label="Fleet cost total"
            value={formatCurrency(poolSplitSummary.fleetCost)}
          />
          <SummaryCard
            label="Profit pool total"
            value={formatCurrency(poolSplitSummary.profitPoolBeforeSplit)}
            tone={poolSplitSummary.profitPoolBeforeSplit < 0 ? "negative" : "default"}
          />
          <SummaryCard
            label="My profit total"
            value={formatCurrency(poolSplitSummary.myProfit)}
            tone={poolSplitSummary.myProfit < 0 ? "negative" : "positive"}
          />
          <SummaryCard
            label="Partner profit total"
            value={formatCurrency(poolSplitSummary.partnerProfit)}
            tone={poolSplitSummary.partnerProfit < 0 ? "negative" : "positive"}
          />
        </section>

        <SectionToolbar
          title="Editable pricing rows"
          description="Adjust list price, discount, referral setup, and fleet cost. Results refresh live."
          onReset={() => setPoolSplitRows(defaultPricingSimulatorRows)}
          onAdd={() => setPoolSplitRows((current) => [...current, emptyPricingSimulatorRow()])}
        />

        <section className={styles.tableShell}>
          <div className={styles.tableScroller}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Bedrooms</th>
                  <th>Bathrooms</th>
                  <th>Clean type</th>
                  <th>List price (inc GST)</th>
                  <th>Customer discount</th>
                  <th>Referral type</th>
                  <th>Referral value</th>
                  <th>Fleet cost</th>
                  <th>Customer payable</th>
                  <th>GST</th>
                  <th>Revenue ex GST</th>
                  <th>Referral commission</th>
                  <th>Profit pool</th>
                  <th>My profit</th>
                  <th>Partner profit</th>
                  <th>Margin</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {calculatedPoolSplitRows.map((row) => (
                  <tr key={row.id} className={styles[`row-${row.health}` as keyof typeof styles]}>
                    <td>
                      <input
                        className={styles.textInput}
                        value={row.label}
                        onChange={(event) =>
                          updatePoolSplitRow(row.id, "label", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        className={styles.selectInput}
                        value={row.bedrooms}
                        onChange={(event) =>
                          updatePoolSplitRow(row.id, "bedrooms", event.target.value)
                        }
                      >
                        {bedroomOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.selectInput}
                        value={row.bathrooms}
                        onChange={(event) =>
                          updatePoolSplitRow(row.id, "bathrooms", event.target.value)
                        }
                      >
                        {bathroomOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.selectInput}
                        value={row.cleanType}
                        onChange={(event) =>
                          updatePoolSplitRow(row.id, "cleanType", event.target.value as CleanType)
                        }
                      >
                        {cleanTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <NumberInput
                        value={row.listPriceIncGst}
                        onChange={(value) => updatePoolSplitRow(row.id, "listPriceIncGst", value)}
                      />
                    </td>
                    <td>
                      <NumberInput
                        value={row.customerDiscount}
                        onChange={(value) => updatePoolSplitRow(row.id, "customerDiscount", value)}
                      />
                    </td>
                    <td>
                      <select
                        className={styles.selectInput}
                        value={row.referralCommissionType}
                        onChange={(event) =>
                          updatePoolSplitRow(
                            row.id,
                            "referralCommissionType",
                            event.target.value as ReferralCommissionType,
                          )
                        }
                      >
                        {commissionTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <NumberInput
                        value={row.referralCommissionValue}
                        onChange={(value) =>
                          updatePoolSplitRow(row.id, "referralCommissionValue", value)
                        }
                      />
                    </td>
                    <td>
                      <NumberInput
                        value={row.fleetCost}
                        onChange={(value) => updatePoolSplitRow(row.id, "fleetCost", value)}
                      />
                    </td>
                    <td>{formatCurrency(row.customerPayable)}</td>
                    <td>{formatCurrency(row.gstAmount)}</td>
                    <td>{formatCurrency(row.revenueExGst)}</td>
                    <td>
                      {row.referralCommissionType === "percent"
                        ? `${formatCurrency(row.referralCommission)} (${formatPercent(
                            row.referralCommissionValue,
                          )})`
                        : formatCurrency(row.referralCommission)}
                    </td>
                    <td>{formatCurrency(row.profitPoolBeforeSplit)}</td>
                    <td>{formatCurrency(row.myProfit)}</td>
                    <td>{formatCurrency(row.partnerProfit)}</td>
                    <td>{formatPercent(row.marginPercent)}</td>
                    <td>
                      <DeleteButton onDelete={() =>
                        setPoolSplitRows((current) => current.filter((item) => item.id !== row.id))
                      } label={row.label} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionIntro}>
          <div>
            <p className={styles.sectionEyebrow}>Model B</p>
            <h2>Take your own cut first.</h2>
            <p>
              This version removes GST and referral first, then lets you pull out your own cut using
              a fixed amount or a percentage of the post-referral base pool. What remains is the amount
              available for partner and fleet together, with fleet cost then reducing the partner side.
            </p>
          </div>
          <div className={styles.logicMiniCard}>
            <strong>Formula</strong>
            <span>base pool = customer payable - GST - referral</span>
            <span>my take = fixed amount or % of base pool</span>
            <span>left for partner + fleet = base pool - my take</span>
            <span>partner after fleet = left for partner + fleet - fleet cost</span>
          </div>
        </div>

        <section className={styles.summaryGrid}>
          <SummaryCard
            label="Customer payable"
            value={formatCurrency(ownerFirstSummary.customerPayable)}
          />
          <SummaryCard label="GST total" value={formatCurrency(ownerFirstSummary.gstAmount)} />
          <SummaryCard
            label="Referral total"
            value={formatCurrency(ownerFirstSummary.referralCommission)}
          />
          <SummaryCard
            label="My take total"
            value={formatCurrency(ownerFirstSummary.myTakeAmount)}
            tone={ownerFirstSummary.myTakeAmount > 0 ? "positive" : "default"}
          />
          <SummaryCard
            label="Fleet cost total"
            value={formatCurrency(ownerFirstSummary.fleetCost)}
          />
          <SummaryCard
            label="Left for partner + fleet"
            value={formatCurrency(ownerFirstSummary.remainingForPartnerAndFleet)}
            tone={ownerFirstSummary.remainingForPartnerAndFleet < 0 ? "negative" : "default"}
          />
          <SummaryCard
            label="Partner after fleet"
            value={formatCurrency(ownerFirstSummary.partnerAfterFleet)}
            tone={ownerFirstSummary.partnerAfterFleet < 0 ? "negative" : "positive"}
          />
        </section>

        <SectionToolbar
          title="Owner-take simulation"
          description="Use this version when you want your own take removed before partner and fleet share the remainder."
          onReset={() => setOwnerFirstRows(defaultOwnerFirstPricingSimulatorRows)}
          onAdd={() =>
            setOwnerFirstRows((current) => [...current, emptyOwnerFirstPricingSimulatorRow()])
          }
        />

        <section className={styles.tableShell}>
          <div className={styles.tableScroller}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Bedrooms</th>
                  <th>Bathrooms</th>
                  <th>Clean type</th>
                  <th>List price (inc GST)</th>
                  <th>Customer discount</th>
                  <th>Referral type</th>
                  <th>Referral value</th>
                  <th>My take type</th>
                  <th>My take value</th>
                  <th>Fleet cost</th>
                  <th>Customer payable</th>
                  <th>GST</th>
                  <th>Revenue ex GST</th>
                  <th>Referral commission</th>
                  <th>My take</th>
                  <th>Left for partner + fleet</th>
                  <th>Partner after fleet</th>
                  <th>My take %</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {calculatedOwnerFirstRows.map((row) => (
                  <tr key={row.id} className={styles[`row-${row.health}` as keyof typeof styles]}>
                    <td>
                      <input
                        className={styles.textInput}
                        value={row.label}
                        onChange={(event) =>
                          updateOwnerFirstRow(row.id, "label", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        className={styles.selectInput}
                        value={row.bedrooms}
                        onChange={(event) =>
                          updateOwnerFirstRow(row.id, "bedrooms", event.target.value)
                        }
                      >
                        {bedroomOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.selectInput}
                        value={row.bathrooms}
                        onChange={(event) =>
                          updateOwnerFirstRow(row.id, "bathrooms", event.target.value)
                        }
                      >
                        {bathroomOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className={styles.selectInput}
                        value={row.cleanType}
                        onChange={(event) =>
                          updateOwnerFirstRow(row.id, "cleanType", event.target.value as CleanType)
                        }
                      >
                        {cleanTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <NumberInput
                        value={row.listPriceIncGst}
                        onChange={(value) =>
                          updateOwnerFirstRow(row.id, "listPriceIncGst", value)
                        }
                      />
                    </td>
                    <td>
                      <NumberInput
                        value={row.customerDiscount}
                        onChange={(value) =>
                          updateOwnerFirstRow(row.id, "customerDiscount", value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        className={styles.selectInput}
                        value={row.referralCommissionType}
                        onChange={(event) =>
                          updateOwnerFirstRow(
                            row.id,
                            "referralCommissionType",
                            event.target.value as ReferralCommissionType,
                          )
                        }
                      >
                        {commissionTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <NumberInput
                        value={row.referralCommissionValue}
                        onChange={(value) =>
                          updateOwnerFirstRow(row.id, "referralCommissionValue", value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        className={styles.selectInput}
                        value={row.myTakeType}
                        onChange={(event) =>
                          updateOwnerFirstRow(
                            row.id,
                            "myTakeType",
                            event.target.value as ReferralCommissionType,
                          )
                        }
                      >
                        {commissionTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <NumberInput
                        value={row.myTakeValue}
                        onChange={(value) => updateOwnerFirstRow(row.id, "myTakeValue", value)}
                      />
                    </td>
                    <td>
                      <NumberInput
                        value={row.fleetCost}
                        onChange={(value) => updateOwnerFirstRow(row.id, "fleetCost", value)}
                      />
                    </td>
                    <td>{formatCurrency(row.customerPayable)}</td>
                    <td>{formatCurrency(row.gstAmount)}</td>
                    <td>{formatCurrency(row.revenueExGst)}</td>
                    <td>
                      {row.referralCommissionType === "percent"
                        ? `${formatCurrency(row.referralCommission)} (${formatPercent(
                            row.referralCommissionValue,
                          )})`
                        : formatCurrency(row.referralCommission)}
                    </td>
                    <td>
                      {row.myTakeType === "percent"
                        ? `${formatCurrency(row.myTakeAmount)} (${formatPercent(row.myTakeValue)})`
                        : formatCurrency(row.myTakeAmount)}
                    </td>
                    <td>{formatCurrency(row.remainingForPartnerAndFleet)}</td>
                    <td>{formatCurrency(row.partnerAfterFleet)}</td>
                    <td>{formatPercent(row.marginPercent)}</td>
                    <td>
                      <DeleteButton onDelete={() =>
                        setOwnerFirstRows((current) => current.filter((item) => item.id !== row.id))
                      } label={row.label} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}

function SectionToolbar({
  title,
  description,
  onReset,
  onAdd,
}: {
  title: string;
  description: string;
  onReset: () => void;
  onAdd: () => void;
}) {
  return (
    <section className={styles.toolbar}>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.toolbarActions}>
        <button type="button" className={styles.secondaryButton} onClick={onReset}>
          Reset defaults
        </button>
        <button type="button" className={styles.primaryButton} onClick={onAdd}>
          Add row
        </button>
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? styles["summary-positive"]
      : tone === "negative"
        ? styles["summary-negative"]
        : "";

  return (
    <article className={`${styles.summaryCard} ${toneClass}`.trim()}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step="0.01"
      className={styles.numberInput}
      value={value}
      onChange={(event) => onChange(parseNumberInput(event.target.value))}
    />
  );
}

function DeleteButton({
  onDelete,
  label,
}: {
  onDelete: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={styles.deleteButton}
      onClick={onDelete}
      aria-label={`Delete ${label}`}
    >
      Delete
    </button>
  );
}
