import { Metadata } from "next";
import { FreelancerServicePortal } from "@/components/service/FreelancerServicePortal";

export const metadata: Metadata = {
  title: "Service Provider Portal | TRUVX",
  description:
    "A prototype workspace for service providers and international projects.",
};

export default function ServicePortalPage() {
  return <FreelancerServicePortal />;
}

