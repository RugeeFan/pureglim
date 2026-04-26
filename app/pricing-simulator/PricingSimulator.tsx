"use client";

import { useMemo, useState } from "react";
import styles from "./pricing-simulator.module.css";
import {
  EOL_ROOM_CONFIGS,
  FREQUENCY_OPTIONS,
  REGULAR_ROOM_CONFIGS,
  isValidEolConfig,
} from "../../lib/pricing-simulator/pricingData";
import {
  defaultRows as initialRows,
  emptyRow,
  type CommissionType,
  type SimulatorRowInput,
} from "../../lib/pricing-simulator/defaultRows";
import { calculateRow, calculateSummary } from "../../lib/pricing-simulator/calculations";

const COMMISSION_TYPE_OPTIONS: Array<{ value: CommissionType; label: string }> = [
  { value: "fixed", label: "固定金额" },
  { value: "percent", label: "百分比" },
];

const currencyFmt = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fmtCurrency = (v: number) => currencyFmt.format(v);
const parseNum = (s: string) => {
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "positive" | "negative";
}) {
  return (
    <div className={`${styles.summaryCard} ${tone ? styles[`summary-${tone}`] : ""}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function NumInput({
  value,
  onChange,
  min,
  max,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      className={styles.numberInput}
      value={value}
      min={min ?? 0}
      max={max}
      step={1}
      placeholder={placeholder}
      onChange={(e) => onChange(parseNum(e.target.value))}
    />
  );
}

export default function PricingSimulator() {
  const [rows, setRows] = useState<SimulatorRowInput[]>(initialRows);

  const calculatedRows = useMemo(() => rows.map(calculateRow), [rows]);
  const summary = useMemo(() => calculateSummary(calculatedRows), [calculatedRows]);

  const updateRow = <K extends keyof SimulatorRowInput>(
    id: string,
    field: K,
    value: SimulatorRowInput[K],
  ) => {
    setRows((curr) =>
      curr.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [field]: value };
        if (field === "cleanCategory" && value === "eol" && !isValidEolConfig(updated.roomConfig)) {
          updated.roomConfig = "2b2w";
        }
        return updated;
      }),
    );
  };

  const addRow = () => setRows((curr) => [...curr, emptyRow()]);
  const deleteRow = (id: string) => setRows((curr) => curr.filter((r) => r.id !== id));
  const resetRows = () => setRows(initialRows);

  return (
    <div className={styles.pageShell}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>内部工具 · 仅限员工</p>
          <h1>报价<br />利润<br />模拟器</h1>
          <p className={styles.lead}>
            输入人工成本以外的各项参数，自动反推最终报价。
            所有计算仅在浏览器本地运行，不保存任何数据。
          </p>
        </div>
        <div className={styles.logicCard}>
          <h2>计算逻辑</h2>
          <ol>
            <li>人工成本 ＝ 价格表 × 75%（固定，自动计算）</li>
            <li>税前总额 ＝ 人工 ＋ 客户折扣 ＋ 介绍费 ＋ 我的利润 ＋ 老板利润</li>
            <li>最终报价（含GST）＝ 税前总额 × 1.1</li>
            <li>老板利润自动等于我的利润（50/50 分成）</li>
            <li>介绍费百分比基于（人工 ＋ 折扣 ＋ 利润）计算</li>
          </ol>
        </div>
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.toolbar}>
          <div>
            <h2>报价方案</h2>
            <p>输入折扣、介绍费和期望利润，自动计算最终含GST报价。</p>
          </div>
          <div className={styles.toolbarActions}>
            <button className={styles.secondaryButton} onClick={resetRows}>
              重置默认
            </button>
            <button className={styles.primaryButton} onClick={addRow}>
              ＋ 新增方案
            </button>
          </div>
        </div>

        {/* <div className={styles.summaryGrid}>
          <SummaryCard label="人工成本合计" value={fmtCurrency(summary.laborCost)} />
          <SummaryCard label="客户折扣合计" value={fmtCurrency(summary.customerDiscount)} />
          <SummaryCard label="介绍费合计" value={fmtCurrency(summary.commission)} />
          <SummaryCard
            label="我的利润合计"
            value={fmtCurrency(summary.myProfit)}
            tone={summary.myProfit > 0 ? "positive" : undefined}
          />
          <SummaryCard
            label="老板利润合计"
            value={fmtCurrency(summary.bossProfit)}
            tone={summary.bossProfit > 0 ? "positive" : undefined}
          />
          <SummaryCard label="GST 合计" value={fmtCurrency(summary.gstAmount)} />
          <SummaryCard
            label="最终报价合计"
            value={fmtCurrency(summary.finalQuote)}
            tone="positive"
          />
        </div> */}

        <div className={styles.tableShell}>
          <div className={styles.tableScroller}>
            <table className={styles.table} style={{ minWidth: "1400px" }}>
              <thead>
                <tr>
                  <th></th>
                  <th>户型</th>
                  <th>清洁类型</th>
                  <th>频率</th>
                  <th>客户折扣</th>
                  <th>介绍费类型</th>
                  <th>介绍费</th>
                  <th>我的利润</th>
                  <th>人工成本(75%)</th>
                  <th>老板利润</th>
                  <th>税前总额</th>
                  <th>最终报价（含GST）</th>
                  <th>GST</th>
                </tr>
              </thead>
              <tbody>
                {calculatedRows.map((row) => {
                  const isEol = row.cleanCategory === "eol";
                  const roomOptions = isEol ? EOL_ROOM_CONFIGS : REGULAR_ROOM_CONFIGS;

                  return (
                    <tr key={row.id}>
                      <td>
                        <button
                          className={styles.deleteButton}
                          onClick={() => deleteRow(row.id)}
                          aria-label="删除此行"
                        >
                          ✕
                        </button>
                      </td>

                      <td>
                        <select
                          className={styles.selectInput}
                          value={row.roomConfig}
                          onChange={(e) =>
                            updateRow(row.id, "roomConfig", e.target.value as SimulatorRowInput["roomConfig"])
                          }
                        >
                          {roomOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <select
                          className={styles.selectInput}
                          value={row.cleanCategory}
                          onChange={(e) =>
                            updateRow(row.id, "cleanCategory", e.target.value as SimulatorRowInput["cleanCategory"])
                          }
                        >
                          <option value="regular">日常清洁</option>
                          <option value="eol">退租清洁</option>
                        </select>
                      </td>

                      <td>
                        {isEol ? (
                          <span className={styles.dimText}>—</span>
                        ) : (
                          <select
                            className={styles.selectInput}
                            value={row.frequency}
                            onChange={(e) =>
                              updateRow(row.id, "frequency", e.target.value as SimulatorRowInput["frequency"])
                            }
                          >
                            {FREQUENCY_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      <td>
                        <NumInput
                          value={row.customerDiscount}
                          onChange={(v) => updateRow(row.id, "customerDiscount", v)}
                          placeholder="0"
                        />
                      </td>

                      <td>
                        <select
                          className={styles.selectInput}
                          value={row.commissionType}
                          onChange={(e) =>
                            updateRow(row.id, "commissionType", e.target.value as CommissionType)
                          }
                        >
                          {COMMISSION_TYPE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <NumInput
                          value={row.commissionValue}
                          onChange={(v) => updateRow(row.id, "commissionValue", v)}
                          placeholder="0"
                        />
                      </td>

                      <td>
                        <NumInput
                          value={row.myProfit}
                          onChange={(v) => updateRow(row.id, "myProfit", v)}
                          placeholder="0"
                        />
                      </td>

                      <td className={styles.laborCostCell}>
                        {fmtCurrency(row.laborCost)}
                      </td>

                      <td className={styles.netProfitCell}>
                        {fmtCurrency(row.bossProfit)}
                      </td>

                      <td>{fmtCurrency(row.totalExGst)}</td>

                      <td className={styles.netProfitCell}>
                        {fmtCurrency(row.finalQuote)}
                      </td>

                      <td>{fmtCurrency(row.gstAmount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
