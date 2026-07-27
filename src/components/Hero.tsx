import React from "react";
import { useTranslation } from "react-i18next";

interface HeroProps {
  onNavigateToForm: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToForm }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const metrics = [
    { value: t("hero.metric1_value"), label: t("hero.metric1_label") },
    { value: t("hero.metric2_value"), label: t("hero.metric2_label") },
    { value: t("hero.metric3_value"), label: t("hero.metric3_label") },
  ];

  return (
    <section
      id="hero"
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full overflow-hidden pt-20 pb-12 border-b border-slate-200/80"
      aria-label={t("hero.badge")}
    >

      {/* Background Grid */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Trust Badge */}
        <div className="mb-6 inline-flex items-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#1E5ED8]/10 text-[#1E5ED8] border border-[#1E5ED8]/20 backdrop-blur-sm shadow-sm font-display">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-[#1E5ED8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1E5ED8]"></span>
            </span>
            {t("hero.badge")}
          </span>
        </div>

        {/* Main Title */}
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.12] tracking-tight mb-6 max-w-5xl"
          style={{ fontFamily: isRTL ? "'IBM Plex Sans Arabic', sans-serif" : "'Outfit', 'Inter', sans-serif" }}
        >
          {t("hero.title")}
        </h1>

        {/* Subtitle / Description */}
        <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mb-9 font-normal">
          {t("hero.description")}
        </p>

        {/* Primary CTA Button */}
        <div className="mb-14 flex items-center justify-center">
          <button
            id="hero-cta-btn"
            onClick={onNavigateToForm}
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#F97316] hover:bg-[#ea580c] text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-display cursor-pointer"
            aria-label={t("hero.cta")}
          >
            <span>{t("hero.cta")}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Trust Metrics Bar */}
        <div className="w-full max-w-2xl border-t border-slate-200/80 pt-8 pb-4">
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            {metrics.map((metric, i) => (
              <div key={i} className="flex flex-col items-center text-center px-3 sm:px-6">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E5ED8] leading-tight mb-1 font-mono tracking-tight">
                  {metric.value}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 font-display">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          {/* Legal Disclaimer */}
          <p className="text-[11px] text-slate-400 font-mono mt-6 text-center">
            {t("hero.legal")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
