import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/sites/spade/Navbar";
import { Footer } from "@/components/sites/spade/Footer";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Customers | Spade",
  description: "Learn how leading fintechs, banks, and payment providers use Spade's transaction intelligence platform.",
};

export default function CustomersPage() {
  const caseStudies = [
    {
      company: "FIS Global",
      tag: "Global Banking Infrastructure",
      title: "FIS powers financial infrastructure at global scale with Spade as essential infrastructure",
      description:
        "By integrating Spade's low-latency enrichment directly into its processing rails, FIS delivers clean merchant data to thousands of financial institutions and millions of daily card transactions.",
      metric: "Tens of Billions",
      metricLabel: "in transactions enriched per quarter",
      accent: "bg-spade-sage-1",
      badgeColor: "text-spade-forest bg-spade-sage-2",
    },
    {
      company: "Bilt Rewards",
      tag: "Loyalty & Neighborhood Spend",
      title: "How Bilt Delivers Hyper-Localized Rewards with Transaction Enrichment and Agentic Workflows",
      description:
        "Bilt needed exact merchant and location attribution to reward neighborhood dining and retail spending. Spade disaggregates merchant groups down to exact storefront addresses with 99.9% accuracy.",
      metric: "$5B+",
      metricLabel: "in neighborhood spend accurately rewarded",
      accent: "bg-spade-sage-2",
      badgeColor: "text-emerald-800 bg-emerald-100",
    },
    {
      company: "PayPal",
      tag: "Consumer Experience & Dispute Prevention",
      title: "How PayPal Uses Transaction Intelligence to Reduce Customer Confusion and Disputes",
      description:
        "By transforming cryptic network descriptors into identifiable brand logos, addresses, and customer support channels, PayPal drastically reduces first-party disputes before chargebacks ever occur.",
      metric: "45%",
      metricLabel: "reduction in unrecognized transaction dispute tickets",
      accent: "bg-spade-sage-1",
      badgeColor: "text-blue-800 bg-blue-100",
    },
    {
      company: "Coast Fleet",
      tag: "Commercial Fuel Cards & Fraud",
      title: "Coast Blocks Real-Time Fleet Card Misuse with Sub-40ms Geolocation Matching",
      description:
        "By comparing vehicle telematics GPS data with Spade's verified pump location in under 35ms, Coast approves legitimate fuel spend while blocking card skimming in real time.",
      metric: "$100k+",
      metricLabel: "average annual savings for 10+ vehicle fleets",
      accent: "bg-spade-sage-2",
      badgeColor: "text-amber-800 bg-amber-100",
    },
    {
      company: "Mercury",
      tag: "Startup & SMB Banking",
      title: "Mercury Automates Expense Categorization for 200,000+ Business Accounts",
      description:
        "Mercury uses Spade's merchant categorization models to automatically classify business expenses, saving finance teams thousands of hours of manual bookkeeping every month.",
      metric: "> 99%",
      metricLabel: "verified categorization accuracy across card rails",
      accent: "bg-spade-sage-1",
      badgeColor: "text-purple-800 bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-spade-black flex flex-col selection:bg-spade-lemongrass selection:text-spade-forest">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="pt-20 pb-16 bg-spade-sage-1/40 border-b border-spade-sage-3/60">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-spade-sage-3 text-spade-forest text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-spade-lemongrass" />
              <span>Customer Stories</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-spade-forest leading-tight">
              Powering confident payments across the ecosystem
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 max-w-2xl leading-relaxed">
              Explore how category-defining fintechs, Fortune 500 banks, and card issuers use Spade&apos;s transaction data platform to automate decisions and eliminate false declines.
            </p>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudies.map((study, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-white border border-spade-sage-3 p-8 flex flex-col justify-between hover:border-spade-forest/30 hover:shadow-lg transition-all duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full ${study.badgeColor}`}>
                        {study.tag}
                      </span>
                      <span className="text-sm font-bold text-spade-forest">{study.company}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-spade-forest leading-snug">
                      {study.title}
                    </h2>

                    <p className="text-sm text-stone-600 leading-relaxed">
                      {study.description}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-stone-100 mt-6 flex items-baseline justify-between">
                    <div>
                      <div className="text-3xl font-extrabold text-spade-forest tracking-tight">
                        {study.metric}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {study.metricLabel}
                      </div>
                    </div>

                    <Link
                      href="https://spade.com/customers/"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-spade-forest hover:text-spade-moss transition-colors"
                    >
                      <span>Read story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

