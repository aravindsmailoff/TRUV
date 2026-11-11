import { Navbar } from "@/components/sites/spade/Navbar";
import { Footer } from "@/components/sites/spade/Footer";
import { CustomerStories } from "@/components/sites/spade/CustomerStories";
export const metadata = { title: "Trade workflows | TRUVX", description: "Explore TRUVX trade workflows for buyers, manufacturers and service providers." };
export default function CustomersPage() { return <div className="min-h-screen"><Navbar /><main><CustomerStories /></main><Footer /></div>; }
