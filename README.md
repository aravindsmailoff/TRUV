# TRUV — Global Trade Execution Infrastructure

> **Prototype:** Trade records, supplier verification and payment milestones are sample data. PayPal Orders do not provide escrow. Authentication and persistence are not production-ready; do not use this project to handle real money or sensitive data.

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
   - Can create a PayPal order for a proposed advance or balance; order creation is not a payment capture or escrow.
   - Verifies webhook signatures with PayPal before processing matching capture events. Records and event deduplication are currently in memory only.

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
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id
```

*Without credentials, payment creation is disabled. Configure PayPal sandbox credentials and a webhook ID to test real sandbox events. The seeded trade data is illustrative, not live.*

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## PayPal sandbox trade demo

The **Buyer portal → My Orders → PayPal sandbox trade demo** connects an example supplier quotation to a 30% advance payment:

1. Sign in as the demo buyer, open **My Orders**, select an example supplier quote and click **Confirm order**.
2. Open **Payments**, choose **Pay with PayPal**, then **Continue to PayPal sandbox**. Approve using a PayPal sandbox buyer account.
3. PayPal returns to the buyer portal; the server captures the matching order and displays the confirmed capture ID and status on the demo trade. Cancellation does not mark it paid.

Configure `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` for a PayPal **sandbox** REST app in `.env.local`, set `PAYPAL_ENV=sandbox`, and set `PAYPAL_RETURN_BASE_URL` to the public HTTPS origin of this app (for example, the origin of your preview). For local testing, `http://localhost:3000` is allowed. Restart the server after changing the environment. Open the buyer portal in a full browser tab before starting so PayPal can redirect back to the same tab.

The named suppliers and quotes are illustrative. The sandbox payment goes to the merchant account associated with your sandbox app, **not** to the named sample supplier. This demo uses temporary in-memory server records and a tab-local session: orders are lost on server restart and aren't shared between server instances. It does not implement escrow, production authentication, durable reconciliation, or real manufacturer payouts. Never use it with live funds. A complete sandbox run requires valid PayPal sandbox accounts and credentials; without them the UI reports a configuration error.

My Orders is for confirming a sample order; Payments is for its sandbox payment. Documents and Messages are placeholders and do not yet upload files or send messages. The signed webhook endpoint under `/api/intelligence/paypal/webhook` is separate and is not the source of truth for this sandbox demo; the demo displays a capture only after the PayPal capture response matches the order and amount.

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

## Local database snapshots

`data/truv.sqlite3` is an initially empty SQLite database intended for **one local installation**, with its schema in `data/schema.sql`. Run `python3 scripts/db/init.py` to create it if missing; the script does not erase existing records. The database structure covers organizations, requests, messages, projects, milestones, document references and payment records.

**This is storage groundwork, not a connected application yet.** The current browser-based sign-in and portal workflows do not use this database. Do not enter real confidential data until proper server-side authentication, authorization and access controls are implemented. PayPal still requires a server with outbound access to PayPal, and a database file does not provide escrow.

The database file may be committed as a **manual snapshot** so a later clone contains that snapshot. Git does not automatically save or synchronize live changes. Stop the app and all writers first, then check database integrity and review what is being shared before committing and pushing. Every repository reader can access committed records, and Git history may retain deleted records. Do not commit passwords, tokens, payment credentials, private documents or sensitive personal data. Simultaneous updates to a SQLite binary cannot be merged reliably; for multiple installations or online users, use a shared hosted database instead. Files referenced by documents are not included in the database or repository automatically.

Before a push, `python3 scripts/db/check-snapshot.py` checks the database for corruption and warns if its working copy differs from the latest commit (including staged but uncommitted changes). It does not commit or push anything, and it cannot guarantee that another process will not change the file afterward. Stop the application and any other writers before committing. Commit all intended code changes separately as well; `git push` only sends commits, not uncommitted files.

### Connected local RFQ starter flow

This is a separate, deliberately **local-only** workspace at `/local-workspace`; the existing portal sign-in and its other screens are not connected to it. Use Node 24 and Python 3. Run `python3 scripts/db/init.py`, then run `python3 scripts/db/create-local-user.py` once for each buyer, manufacturer and service account. Choose your own credentials. Account password hashes and sessions live in ignored `data/local-auth.sqlite3`; they are not included when the repository is pushed or cloned. Back them up securely if needed. Do not commit them.

Start with `TRUV_LOCAL_WORKSPACE=1 npm run dev -- --hostname 127.0.0.1`, and open `http://localhost:3000/local-workspace`. Sign in as buyer to create a goods or service RFQ. Sign out, then sign in as a manufacturer to see goods requests, or as a service provider to see service requests. All local accounts of a matching role can see those requests; this is not targeted private delivery. The request data persists in `data/truv.sqlite3`. Stop the server before reviewing, committing and pushing a snapshot. Other local installations need their own accounts after pulling; recreate each account with the same email and role to access its buyer requests.

This starter does not provide production-grade security, rate limiting, multi-tenant isolation, account recovery or remote access. Do not expose it to the internet or put sensitive data in it. The existing portal, messages, projects, documents and payments are not connected to this flow. PayPal remains unavailable from the preview network.

To use messaging after updating an existing checkout, stop the server and run `python3 scripts/db/init.py` again; this adds the conversation tables without deleting existing records. In the local workspace, a manufacturer or service provider can choose **Message buyer** on a matching request. The buyer and that provider can then exchange replies under **Messages**; other accounts cannot read that conversation through the local API. Use **Refresh** to see new replies (there are no push notifications). Messages persist in the tracked SQLite database and are included in any database snapshot you commit, so repository readers can access them regardless of app permissions. This local prototype is not suitable for sensitive data or internet deployment.

After building, `python3 tests/local-workspace.py` runs an isolated integration test of RFQ creation, messaging and participant checks using a temporary database; it does not alter your local records.
