import { SolutionPage } from "@/components/solutions/SolutionPage";
export default function ServiceSolution() {
  return <SolutionPage label="For service providers" role="service" title="Bring your services to global opportunities." description="Explore a workspace for international projects, delivery milestones and client collaboration." steps={[
    { title: "Explore opportunities", description: "Review sample project requirements and client briefs." },
    { title: "Agree on the scope", description: "Understand the proposed deliverables, timelines and payment terms." },
    { title: "Follow progress", description: "Keep project milestones and delivery details together." },
  ]} />;
}
