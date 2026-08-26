import React, { useState } from "react";
import {
  Header,
  Hero,
  Footer,
  ProjectTypesSection,
  ProcessSection,
  DocumentSecuritySection,
  ProgramsSection,
  NewsSection,
  FaqSection,
} from "../components";
import { EligibilityForm } from "../components/eligibility";
import SeoHead from "../components/SeoHead";
import type { ProfileType } from "../components/Hero";

const Home: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);

  const handleProfileSelect = (profile: ProfileType) => {
    setSelectedProfile(profile);
    setTimeout(() => {
      const formElement = document.getElementById("eligibility-form-content");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  const scrollToSelector = () => {
    const selectorElement = document.getElementById("eligibility-selector");
    if (selectorElement) {
      selectorElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full font-sans">
      <SeoHead />

      {/* Sticky Navigation */}
      <Header />

      {/* ── HERO & INTEGRATED PROFILE SELECTOR ── */}
      <Hero
        selectedProfile={selectedProfile}
        onSelectProfile={handleProfileSelect}
      />

      {/* ── COLLAPSIBLE ELIGIBILITY FORM ── */}
      <div id="eligibility-form-container" className="relative z-20">
        <div
          id="eligibility-form-content"
          className={`transition-all duration-700 ease-in-out ${
            selectedProfile
              ? "max-h-[3500px] opacity-100 py-4 sm:py-6"
              : "max-h-0 opacity-0 py-0 overflow-hidden pointer-events-none"
          }`}
        >
          {selectedProfile && (
            <div className="w-full transition-all duration-300">
              <EligibilityForm
                selectedProfile={selectedProfile}
                onSelectProfile={handleProfileSelect}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── PROJECT PROFILES (Création, Extension, Investissement) ── */}
      <ProjectTypesSection onNavigateToForm={scrollToSelector} />

      {/* ── 4-STEP CRM PROCESS ── */}
      <ProcessSection onNavigateToForm={scrollToSelector} />

      {/* ── DOCUMENT SECURITY ── */}
      <DocumentSecuritySection />

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

