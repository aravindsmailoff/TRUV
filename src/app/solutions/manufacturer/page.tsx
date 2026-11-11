import { SolutionPage } from "@/components/solutions/SolutionPage";
export default function ManufacturerSolution() {
  return <SolutionPage label="For manufacturers" role="manufacturer" title="Connect your capabilities with global demand." description="Explore buyer requests and follow trade milestones in a single workspace." steps={[
    { title: "Review opportunities", description: "See example buyer requests, product details and quantities." },
    { title: "Discuss the terms", description: "Review quotations and proposed payment terms before agreeing to an order." },
    { title: "Track the journey", description: "Follow sample production, inspection and shipping milestones." },
  ]} />;
}
