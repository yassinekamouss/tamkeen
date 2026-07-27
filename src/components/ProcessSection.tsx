import React from "react";
import { useTranslation } from "react-i18next";

interface ProcessSectionProps {
  onNavigateToForm: () => void;
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ onNavigateToForm }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const steps = [
    {
      num: "01",
      title: t("process.step1_title"),
      desc: t("process.step1_desc"),
    },
    {
      num: "02",
      title: t("process.step2_title"),
      desc: t("process.step2_desc"),
    },
    {
      num: "03",
      title: t("process.step3_title"),
      desc: t("process.step3_desc"),
    },
  ];

  const trust = [
    t("process.trust1"),
    t("process.trust2"),
    t("process.trust3"),
    t("process.trust4"),
  ];

  return (
    <section
      id="process"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-[#1E5ED8] py-20 sm:py-28 border-b border-[#1E5ED8]"
      aria-label={t("process.badge")}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-16">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#F97316] font-display mb-3">
            {t("process.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight leading-tight mb-4 max-w-xl">
            {t("process.title")}
          </h2>
          <p className="text-white/65 text-sm sm:text-base leading-relaxed max-w-2xl">
            {t("process.subtitle")}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 mb-14">
          {steps.map((step, i) => (
            <div key={i} className="bg-[#1E5ED8] p-8 group hover:bg-[#1A52C2] transition-colors duration-200">
              {/* Number */}
              <span className="block text-[2.5rem] font-bold font-mono text-white/15 leading-none mb-6 group-hover:text-white/25 transition-colors">
                {step.num}
              </span>
              {/* Title */}
              <h3 className="text-base font-bold text-white font-display mb-3 leading-snug">
                {step.title}
              </h3>
              {/* Description */}
              <p className="text-sm text-white/65 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA + Trust signals */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <button
            onClick={onNavigateToForm}
            className="btn-primary self-start sm:self-auto"
            aria-label={t("process.cta")}
          >
            {t("process.cta")}
            <svg
              className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-4">
            {trust.map((label, i) => (
              <span
                key={i}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-white/55"
              >
                <svg className="w-3 h-3 text-[#F97316] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

