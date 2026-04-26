import type { Metadata } from "next";
import PricingSimulator from "./PricingSimulator";

export const metadata: Metadata = {
  title: "报价利润模拟器",
  description:
    "内部工具：基于老板定价表实时模拟人工成本、折扣、介绍费和利润分配，仅限员工使用。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PricingSimulatorPage() {
  return <PricingSimulator />;
}
