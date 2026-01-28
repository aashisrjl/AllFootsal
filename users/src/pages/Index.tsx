
import React from "react";

import Footer from "@/components/Footer";
import CompleteEcosystem from "@/components/CompleteEcosystem";
import PlatformHighlights from "@/components/PlatformHighlights";
import Ecosystem from "@/components/Ecosystem";
import Mission from "@/components/Mission";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import FAQ from "@/components/Faq";
import TestimonialsMarquee from "./Testomonials";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Mission />
      <Ecosystem />
      <PlatformHighlights />
      <TestimonialsMarquee />
      <FAQ />
      <CompleteEcosystem />
      <Footer />
    </div>
  );
};

export default Index;
