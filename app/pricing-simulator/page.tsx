import type { Metadata } from "next";
import PricingSimulator from "./PricingSimulator";

export const metadata: Metadata = {
  title: "Pricing Simulator",
  description:
    "Front-end-only simulator for testing PureGlim cleaning pricing, GST, discounts, referral commission, fleet costs, and profit split.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PricingSimulatorPage() {
  return <PricingSimulator />;
}
