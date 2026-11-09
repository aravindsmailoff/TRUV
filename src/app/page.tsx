import React from "react";
import { TopBanner } from "@/components/sites/spade/TopBanner";
import { Navbar } from "@/components/sites/spade/Navbar";
import { Hero } from "@/components/sites/spade/Hero";
import { LogoCloud } from "@/components/sites/spade/LogoCloud";
import { ScrollRevealIntro } from "@/components/sites/spade/ScrollRevealIntro";
import { RiskAuthSection } from "@/components/sites/spade/RiskAuthSection";
import { RewardsSection } from "@/components/sites/spade/RewardsSection";
import { AnalyticsAndAiSection } from "@/components/sites/spade/AnalyticsAndAiSection";
import { IndustriesGrid } from "@/components/sites/spade/IndustriesGrid";
import { CustomerStories } from "@/components/sites/spade/CustomerStories";
import { DevelopersCta } from "@/components/sites/spade/DevelopersCta";
import { Footer } from "@/components/sites/spade/Footer";

export const metadata = {
  title: "The data & AI platform for modern finance | Spade",
  description:
    "Spade takes messy transaction data and turns it into structured, verified records — with AI agents that help you use it everywhere it matters.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-spade-black flex flex-col selection:bg-spade-lemongrass selection:text-spade-forest">
      <TopBanner />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoCloud />
        <ScrollRevealIntro />
        <RiskAuthSection />
        <RewardsSection />
        <AnalyticsAndAiSection />
        <IndustriesGrid />
        <CustomerStories />
        <DevelopersCta />
      </main>
      <Footer />
    </div>
  );
}
