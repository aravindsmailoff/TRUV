/**
 * Freelancer & Service Provider Store (TradeOracle Service Portal)
 * 
 * Manages Cross-Border IT / Software / Creative Service Contracts:
 * - Commercial Service Level Agreements (SLA) & Scope of Work (SOW)
 * - Milestone Escrow Execution via PayPal Orders v2
 * - Immutable Delivery Proof (GitHub PRs, Commits, Vercel Deployments, Loom Walkthroughs)
 * - Dispute Defense Dossier Generation
 * - Automated e-FIRC & GST Zero-Rated Export Invoices
 */

export interface ServiceMilestone {
  id: string;
  milestoneNumber: number;
  title: string;
  description: string;
  amountUSD: number;
  inrApprox: number;
  status: "completed" | "in_escrow" | "in_review" | "locked";
  dueDate: string;
  evidence?: {
    githubRepo?: string;
    prUrl?: string;
    commitHash?: string;
    stagingUrl?: string;
    loomUrl?: string;
    deliveredAt?: string;
    clientSignOff?: boolean;
    clientFeedback?: string;
  };
}

export interface ServiceProject {
  id: string;
  contractNumber: string;
  client: {
    company: string;
    contactName: string;
    email: string;
    country: string;
    flag: string;
    city: string;
    verifiedStanding: string;
  };
  freelancer: {
    name: string;
    legalEntity: string;
    role: string;
    gstin: string;
    pan: string;
    paypalEmail: string;
    hourlyRateUSD: number;
  };
  projectTitle: string;
  scopeOfWork: string;
  techStack: string[];
  totalContractUSD: number;
  inrLakhs: number;
  status: "Active - Milestone in Progress" | "Under Client Review" | "Completed & Paid" | "Dispute Protected";
  escrowStatus: "30% Upfront Released" | "Milestone 2 In Escrow" | "100% Settled";
  milestones: ServiceMilestone[];
  disputeEvidenceReady: boolean;
  fircReference: string;
  createdAt: string;
}

export const INITIAL_SERVICE_PROJECTS: ServiceProject[] = [
  {
    id: "proj_svc_01",
    contractNumber: "SOW-USA-2026-4409",
    client: {
      company: "ApexCloud Technologies Inc.",
      contactName: "David Sterling (VP of Engineering)",
      email: "david@apexcloud.io",
      country: "United States",
      flag: "🇺🇸",
      city: "Austin, Texas",
      verifiedStanding: "D&B Rating 4A2 • Y-Combinator Alum (W22)",
    },
    freelancer: {
      name: "Aravind Sharma (Lead Architect)",
      legalEntity: "HyperScale Software Labs LLP",
      role: "Full-Stack AI & Cloud Engineering",
      gstin: "27AABCH1092K1Z8",
      pan: "AABCH1092K",
      paypalEmail: "accounts@hyperscalelabs.io",
      hourlyRateUSD: 65,
    },
    projectTitle: "Next.js AI Enterprise SaaS Platform & Real-Time RAG Pipeline",
    scopeOfWork:
      "Design and engineer a high-throughput multi-tenant SaaS frontend in Next.js 16 (App Router), Tailwind CSS v4, PostgreSQL vector embeddings, and PayPal milestone billing hooks. Deliverables include Figma system design, fully typed TypeScript codebase, Docker production build, and CI/CD pipelines.",
    techStack: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS v4", "Docker"],
    totalContractUSD: 5000,
    inrLakhs: 4.18,
    status: "Active - Milestone in Progress",
    escrowStatus: "Milestone 2 In Escrow",
    createdAt: "2026-02-01",
    fircReference: "FIRC-HDFC-INW-2026-9921",
    disputeEvidenceReady: true,
    milestones: [
      {
        id: "ms_01",
        milestoneNumber: 1,
        title: "Architecture Blueprint, DB Schema & Figma Design System",
        description: "PostgreSQL Prisma schema, multi-tenant auth architecture, and complete Figma component kit.",
        amountUSD: 1500,
        inrApprox: 125400,
        status: "completed",
        dueDate: "2026-02-10",
        evidence: {
          githubRepo: "https://github.com/apexcloud/enterprise-saas",
          prUrl: "https://github.com/apexcloud/enterprise-saas/pull/1",
          commitHash: "7b4f8a9e012cd34f",
          stagingUrl: "https://design.apexcloud.dev",
          loomUrl: "https://loom.com/share/arch-blueprint-walkthrough",
          deliveredAt: "2026-02-09T18:30:00Z",
          clientSignOff: true,
          clientFeedback: "Approved with zero remarks. Advance milestone funds released via PayPal.",
        },
      },
      {
        id: "ms_02",
        milestoneNumber: 2,
        title: "Core Multi-Tenant Engine, Vector RAG & API Integrations",
        description: "Next.js App Router API routes, vector search retrieval, PayPal webhook handlers, and unit test suite.",
        amountUSD: 2000,
        inrApprox: 167200,
        status: "in_escrow",
        dueDate: "2026-02-25",
        evidence: {
          githubRepo: "https://github.com/apexcloud/enterprise-saas",
          prUrl: "https://github.com/apexcloud/enterprise-saas/pull/14",
          commitHash: "9e12cd458a01bc7f",
          stagingUrl: "https://staging.apexcloud.dev",
          loomUrl: "https://loom.com/share/core-api-demo-v2",
          deliveredAt: "2026-02-24T12:00:00Z",
          clientSignOff: false,
          clientFeedback: "Under technical code review by VP of Eng. 88% test coverage verified.",
        },
      },
      {
        id: "ms_03",
        milestoneNumber: 3,
        title: "Production Deployment, Load Testing & Repository Handover",
        description: "Zero-downtime deployment on AWS ECS/Vercel, load tested for 5k concurrent users, comprehensive API docs.",
        amountUSD: 1500,
        inrApprox: 125400,
        status: "locked",
        dueDate: "2026-03-15",
      },
    ],
  },
  {
    id: "proj_svc_02",
    contractNumber: "SOW-GBR-2026-2180",
    client: {
      company: "Westminster Retail Group Ltd",
      contactName: "Eleanor Wright (Chief Product Officer)",
      email: "eleanor@westminsterretail.co.uk",
      country: "United Kingdom",
      flag: "🇬🇧",
      city: "London, UK",
      verifiedStanding: "Companies House Reg #08492019 • Rated A+",
    },
    freelancer: {
      name: "Aravind Sharma (Lead Architect)",
      legalEntity: "HyperScale Software Labs LLP",
      role: "E-Commerce Headless Architect",
      gstin: "27AABCH1092K1Z8",
      pan: "AABCH1092K",
      paypalEmail: "accounts@hyperscalelabs.io",
      hourlyRateUSD: 60,
    },
    projectTitle: "Headless E-Commerce Storefront Migration (Shopify Plus + Next.js)",
    scopeOfWork:
      "Migrate monolithic Liquid storefront to headless Next.js App Router with sub-second page loads, algorithmic search, and multi-currency checkout via PayPal Express.",
    techStack: ["Next.js", "Shopify Storefront API", "Tailwind CSS", "Algolia Search"],
    totalContractUSD: 3800,
    inrLakhs: 3.17,
    status: "Under Client Review",
    escrowStatus: "30% Upfront Released",
    createdAt: "2026-02-12",
    fircReference: "FIRC-HDFC-INW-2026-8804",
    disputeEvidenceReady: true,
    milestones: [
      {
        id: "ms_uk_01",
        milestoneNumber: 1,
        title: "Product Catalog Discovery & UI Prototype",
        description: "Storefront UI wireframes and Shopify GraphQL API adapter.",
        amountUSD: 1200,
        inrApprox: 100320,
        status: "completed",
        dueDate: "2026-02-20",
        evidence: {
          githubRepo: "https://github.com/westminster/headless-store",
          prUrl: "https://github.com/westminster/headless-store/pull/3",
          commitHash: "4c11fa08920bc441",
          stagingUrl: "https://preview.westminster.store",
          deliveredAt: "2026-02-19T16:00:00Z",
          clientSignOff: true,
        },
      },
      {
        id: "ms_uk_02",
        milestoneNumber: 2,
        title: "Cart, Checkout & International Payments Integration",
        description: "Cart engine with live PayPal and card processing.",
        amountUSD: 2600,
        inrApprox: 217360,
        status: "in_escrow",
        dueDate: "2026-03-10",
      },
    ],
  },
];

