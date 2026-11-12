import type { Metadata } from "next";
import { TRUVXBuyerApp } from "@/components/buyer/TRUVXBuyerApp";

export const metadata: Metadata = {
  title: "TRUVX — Foreign Buyer Portal | International Trade Execution",
  description:
    "Enterprise procurement and cross-border trade transaction platform connecting international buyers with verified Indian manufacturers and service providers on PayPal Orders v2 rails.",
};

export default function BuyerPortalPage() {
  return <TRUVXBuyerApp />;
}

