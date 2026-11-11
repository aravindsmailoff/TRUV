import { SolutionPage } from "@/components/solutions/SolutionPage";
export default function BuyerSolution() {
  return <SolutionPage label="For buyers" role="buyer" title="Source from India with greater clarity." description="Explore suppliers, compare quotes and keep your sourcing journey in one place." steps={[
    { title: "Share your requirements", description: "Create an RFQ with the products, quantities and delivery details you need." },
    { title: "Compare suppliers", description: "Review example supplier profiles and quotations before choosing an offer." },
    { title: "Try a test payment", description: "Use the PayPal sandbox demo to approve and capture an advance payment. No real funds are used." },
  ]} />;
}
