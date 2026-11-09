# TRUV — Global Trade Execution Infrastructure

**TRUV** is a technology-powered international trade execution platform designed to connect foreign buyers directly with verified Indian industrial manufacturers (MSMEs). 

TRUV acts as an active trade operator, coordinating opportunities from initial buyer demand (RFQ), AI-driven supplier qualification, and quotation negotiations through to official PayPal milestone payments, third-party quality inspections (QIMA / SGS), customs brokerage (ICEGATE), and ocean freight delivery (Maersk).

---

## 🚀 Key Modules & Capabilities

1. **Buyer Demand Discovery & RFQ Pipeline**
   - Collects and analyzes international purchasing requirements with technical specifications, target volumes, and delivery ports.
   - Generates commercial demand for Indian manufacturing clusters.

2. **MSME Manufacturer Discovery & Qualification**
   - Vets Indian manufacturers across industrial clusters (Moradabad brass & castings, Tirupur textiles, Rajkot forgings & auto ancillaries).
   - Validates statutory standing: **DGFT IEC**, **GSTIN**, **Udyam MSME Registration**, verified machinery lines, and plant capacity.

3. **Commercial RFQ & Negotiation Management**
   - Coordinates commercial purchase orders and proforma invoices with Incoterms (FOB Mundra, FOB Mumbai, CIF Los Angeles).
   - Real-time AI discrepancy detection cross-checking PO versus invoice pricing, quantities, and UCP 600 export rules.

4. **PayPal Financial Execution Layer**
   - Uses official PayPal Orders v2 REST API for cross-border commercial transactions.
   - Automates the 30% advance deposit escrow before production starts, and tracks the 70% balance payable upon Bill of Lading.
   - Real-time webhook processing (`PAYMENT.CAPTURE.COMPLETED`), dispute monitoring, and transaction reconciliation.

5. **International Logistics & Export Handover**
   - Coordinates pre-shipment quality inspection via **QIMA / SGS** (AQL 1.5 standard).
   - Integrates Indian export customs filing via ICEGATE (Shipping Bill & Let Export Order).
   - Manages ocean freight bookings and container assignments via **Maersk Logistics**.

6. **Transaction Intelligence Graph**
   - Accumulates verifiable trade execution data over time: buyer punctuality, manufacturer on-time delivery rates, and zero-dispute records.
   - Tenant isolation ensures private contracts remain confidential while generating anonymized counterparty trust vectors.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript (strict type checking)
- **Styling**: Tailwind CSS, PostCSS, Lucide React
- **Animations & Interactivity**: Lenis Smooth Scroll, Rive Canvas (`@rive-app/react-canvas`), Framer Motion
- **Payments**: PayPal Orders v2 REST API integration
- **Linting & Verification**: ESLint with strict rules

---

## 📋 Prerequisites

- **Node.js**: `v20.0.0` or higher (Node 24 recommended)
- **Package Manager**: `npm` (included with Node.js)

---

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/aravindsmailoff/TRUV.git
cd TRUV
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables (Optional for Live PayPal)

Create a `.env.local` file in the root directory:

```env
# PayPal API Configuration (Optional: Runs in sandbox mode by default)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENV=sandbox # or 'production'
```

*Note: If no credentials are provided, TRUV runs seamlessly in sandbox simulation mode.*

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles an optimized production build |
| `npm run start` | Starts the Next.js production server |
| `npm run lint` | Runs ESLint checks across the codebase |
| `npm run typecheck` | Validates TypeScript types with `tsc --noEmit` |
| `npm run check` | Runs linting, typechecking, and production build in sequence |

---

## 📂 Project Architecture

```
TRUV/
├── public/                 # Static assets, logos, and Rive animations (.riv)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── intelligence/ # Verification, transactions, PayPal, and graph routes
│   │   │   └── trade/        # Trade operator operations & RFQ matching route
│   │   ├── customers/       # Customer case studies page
│   │   ├── use-case/        # Trade operations & risk authorization workspace
│   │   ├── globals.css      # Design system styling & chamfered corners
│   │   ├── layout.tsx       # Root layout with SmoothScroll provider
│   │   └── page.tsx         # TRUV landing page
│   ├── components/
│   │   ├── providers/       # Lenis smooth scroll provider
│   │   ├── reactbits/       # Physics attraction (Magnet), DecryptedText, etc.
│   │   └── sites/spade/     # Reusable UI components & chamfered cards
│   ├── lib/
│   │   ├── intelligence/    # Risk engine, PayPal client, graph network
│   │   └── trade/           # Indian MSME store, RFQs, trade execution engine
│   └── types/               # TypeScript domain models (trade, intelligence)
└── README.md
```

---

## 🔒 Security & Privacy

- All commercial buyer-manufacturer negotiations and transaction values are strictly isolated per tenant.
- Sensitive credentials should always be configured through server-side environment variables and never committed to source control.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
