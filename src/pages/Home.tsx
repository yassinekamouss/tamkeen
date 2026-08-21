import React from "react";
import { Header, Hero, Footer } from "../components";
import { EligibilityForm } from "../components/eligibility";
import SeoHead from "../components/SeoHead";
import ProgramsSection from "../components/ProgramsSection";
import NewsSection from "../components/NewsSection";
import ProcessSection from "../components/ProcessSection";
import FaqSection from "../components/FaqSection";

const Home: React.FC = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById("eligibility-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToPrograms = () => {
    const programsElement = document.getElementById("programs");
    if (programsElement) {
      programsElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full">
      <SeoHead />

      {/* Sticky Navigation */}
      <Header />

      {/* ── HERO ── */}
      <Hero onNavigateToForm={scrollToForm} onNavigateToPrograms={scrollToPrograms} />

      {/* ── ELIGIBILITY FORM ── */}
      <section id="eligibility-form" className="w-full">
        <EligibilityForm />
      </section>

      {/* ── PROCESS / HOW IT WORKS ── */}
      <ProcessSection onNavigateToForm={scrollToForm} />

      {/* ── PROGRAMS ── */}
      <ProgramsSection />

      {/* ── ACTUALITY / NEWS ── */}
      <NewsSection />

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
};

export default Home;
