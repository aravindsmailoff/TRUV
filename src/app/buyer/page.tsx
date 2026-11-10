import type { Metadata } from "next";
import { TradeOracleBuyerApp } from "@/components/buyer/TradeOracleBuyerApp";

export const metadata: Metadata = {
  title: "TradeOracle — Foreign Buyer Portal | International Trade Execution",
  description:
    "Enterprise procurement and cross-border trade transaction platform connecting international buyers with verified Indian manufacturers and service providers on PayPal Orders v2 rails.",
};

export default function BuyerPortalPage() {
  return <TradeOracleBuyerApp />;
}
