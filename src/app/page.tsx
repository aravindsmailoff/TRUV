import React from "react";
import { TopBanner } from "@/components/sites/spade/TopBanner";
import { Navbar } from "@/components/sites/spade/Navbar";
import { Hero } from "@/components/sites/spade/Hero";
import { LogoCloud } from "@/components/sites/spade/LogoCloud";
import { ScrollRevealIntro } from "@/components/sites/spade/ScrollRevealIntro";
import { TradeExecutionSection } from "@/components/sites/spade/TradeExecutionSection";
import { AnalyticsAndAiSection } from "@/components/sites/spade/AnalyticsAndAiSection";
import { IndustriesGrid } from "@/components/sites/spade/IndustriesGrid";
import { CustomerStories } from "@/components/sites/spade/CustomerStories";
import { DevelopersCta } from "@/components/sites/spade/DevelopersCta";
import { Footer } from "@/components/sites/spade/Footer";

export const metadata = {
  title: "TRUV | Global Trade Execution Infrastructure",
  description:
    "TRUV connects international buyers with vetted Indian manufacturers, coordinating RFQs, automated supplier qualification, and PayPal milestone escrow.",
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
        <TradeExecutionSection />
        <AnalyticsAndAiSection />
        <IndustriesGrid />
        <CustomerStories />
        <DevelopersCta />
      </main>
      <Footer />
    </div>
  );
}
