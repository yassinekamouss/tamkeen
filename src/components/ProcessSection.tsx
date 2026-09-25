import React from "react";
import { useTranslation } from "react-i18next";

interface ProcessSectionProps {
  onNavigateToForm: () => void;
}

const ProcessSection: React.FC<ProcessSectionProps> = ({
  onNavigateToForm,
}) => {
  const { t, i18n } = useTranslation();

  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const steps = [
    {
      number: "01",
      title: t("process.step1_title"),
      desc: t("process.step1_desc"),
      detail: isRTL
        ? "2 دقائق • 0 وثيقة مطلوبة"
        : "2 minutes • 0 document requis",
    },
    {
      number: "02",
      title: t("process.step2_title"),
      desc: t("process.step2_desc"),
      detail: isRTL
        ? "مطابقة المعايير الرسمية"
        : "Matching critères officiels 2026",
    },
    {
      number: "03",
      title: t("process.step3_title"),
      desc: t("process.step3_desc"),
      detail: isRTL
        ? "تدقيق وتأكيد المستشار"
        : "Relecture & validation consultant",
    },
    {
      number: "04",
      title: t("process.step4_title"),
      desc: t("process.step4_desc"),
      detail: isRTL
        ? "تتبع الإيداع الرسمي"
        : "Suivi jusqu'au résultat final",
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
      className="w-full bg-[#F8F9FA] py-12 sm:py-20 lg:py-28 font-body border-b border-[#DADCE0]"
      aria-label={t("process.badge")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4 sm:gap-8 lg:gap-16 items-end mb-8 sm:mb-14">

          <div className="max-w-3xl">
            <div
              className={`flex items-center gap-3 mb-3 sm:mb-5 ${
                isRTL ? "flex-row-reverse justify-end" : ""
              }`}
            >
              <span className="h-px w-8 sm:w-10 bg-[#1A73E8]/30" />

              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#1A73E8]">
                {t("process.badge")}
              </span>
            </div>

            <h2 className="text-[24px] sm:text-[32px] font-bold text-[#191C1D] leading-tight tracking-tight">
              {t("process.title")}
            </h2>
          </div>

          <p
            className={`max-w-xl text-[14px] sm:text-base leading-relaxed text-[#5F6368] ${
              isRTL ? "lg:text-right" : ""
            }`}
          >
            {t("process.subtitle")}
          </p>
        </div>

        {/* =========================================================
            PROCESS: MOBILE TIMELINE (< sm)
        ========================================================= */}
        <div className="sm:hidden bg-white border border-[#DADCE0] rounded-2xl p-5 shadow-xs">
          <div className="space-y-6 relative">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <div key={step.number} className="relative flex gap-3.5 items-start">
                  {/* Left Rail: Circle + Vertical connecting line */}
                  <div className="relative flex flex-col items-center">
                    <span className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#1A73E8] border-2 border-[#1A73E8] flex items-center justify-center font-bold text-xs font-mono z-10 shrink-0">
                      {step.number}
                    </span>
                    {!isLast && (
                      <span
                        className="w-0.5 bg-[#DADCE0] absolute top-8 bottom-[-24px]"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="min-w-0 flex-1 pt-0.5 pb-2">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10.5px] font-bold tracking-wider text-[#1A73E8] uppercase">
                        {isRTL ? `المرحلة ${step.number}` : `ÉTAPE ${step.number}`}
                      </span>
                      <span className="text-[10px] text-[#A0A3BD] font-mono">
                        {String(index + 1).padStart(2, "0")}/04
                      </span>
                    </div>

                    <h3 className="text-[15px] font-bold text-[#191C1D] leading-snug mb-1">
                      {step.title}
                    </h3>

                    <p className="text-[12.5px] leading-relaxed text-[#5F6368] mb-2.5">
                      {step.desc}
                    </p>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0F4F9] text-[11px] font-semibold text-[#1A73E8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] shrink-0" />
                      {step.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            PROCESS: DESKTOP GRID (>= sm)
        ========================================================= */}
        <div className="hidden sm:block border border-[#DADCE0] rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#DADCE0] rtl:divide-x-reverse">

            {steps.map((step, index) => (
              <article
                key={step.number}
                className="relative px-6 py-8 sm:px-7 sm:py-10 min-h-[285px] flex flex-col group hover:bg-[#F8F9FA] transition-colors"
              >
                {/* Step number */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[12px] font-bold tracking-[0.1em] text-[#1A73E8] uppercase">
                    {isRTL ? `المرحلة ${step.number}` : `ÉTAPE ${step.number}`}
                  </span>

                  <span className="text-[11px] text-[#A0A3BD] font-medium tracking-widest font-mono">
                    {String(index + 1).padStart(2, "0")}/04
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-[18px] sm:text-[19px] font-bold text-[#191C1D] leading-snug mb-3 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-[14px] leading-relaxed text-[#5F6368]">
                    {step.desc}
                  </p>
                </div>

                {/* Administrative detail */}
                <div className="mt-8 pt-4 border-t border-[#DADCE0]/60">
                  <p className="text-[12px] leading-relaxed text-[#727785] font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]/40 shrink-0" />
                    {step.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* =========================================================
            FOOTER / TRUST
        ========================================================= */}
        <div className="mt-6 sm:mt-8 border border-[#DADCE0] bg-white rounded-2xl sm:rounded-xl shadow-sm overflow-hidden p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">

            {/* Trust points */}
            <div
              className={`
                grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4
                gap-3 sm:gap-x-8 sm:gap-y-4
                flex-1
              `}
            >
              {trust.map((label, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] text-[#5F6368] font-medium"
                >
                  <svg className="w-4 h-4 text-[#1A73E8] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="leading-snug">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="shrink-0 w-full lg:w-auto">
              <button
                onClick={onNavigateToForm}
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  min-h-[48px]
                  w-full
                  lg:w-auto
                  px-8
                  bg-[#1A73E8]
                  text-white
                  text-[14px]
                  font-bold
                  rounded-xl
                  sm:rounded
                  transition-all
                  duration-200
                  hover:bg-[#174EA6]
                  active:scale-[0.99]
                  shadow-sm
                "
                aria-label={t("process.cta")}
              >
                <span>{t("process.cta")}</span>

                <svg
                  className={`
                    w-4 h-4
                    transition-transform
                    duration-200
                    ${
                      isRTL
                        ? "rotate-180 group-hover:-translate-x-1"
                        : "group-hover:translate-x-1"
                    }
                  `}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;