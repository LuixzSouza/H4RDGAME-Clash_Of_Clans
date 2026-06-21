import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Welcome } from "@/components/landing/Welcome";
import { WarRules } from "@/components/landing/WarRules";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Leadership } from "@/components/landing/Leadership";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <Hero />
      <Welcome />
      <Leadership />
      <WarRules />
      <Features />
      <Footer />
    </div>
  );
}