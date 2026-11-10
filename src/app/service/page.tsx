import { Metadata } from "next";
import { FreelancerServicePortal } from "@/components/service/FreelancerServicePortal";

export const metadata: Metadata = {
  title: "Freelancer & Service Provider Portal | TradeOracle Cross-Border Execution",
  description:
    "Cross-border service export execution platform for Indian IT agencies and tech freelancers: contracts, GitHub PR milestone proofs, PayPal escrow, and automated e-FIRC compliance.",
};

export default function ServicePortalPage() {
  return <FreelancerServicePortal />;
}

