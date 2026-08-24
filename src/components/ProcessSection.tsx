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
      className="w-full bg-[#174A8B] py-20 sm:py-24 lg:py-28 font-body"
      aria-label={t("process.badge")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end mb-14">

          <div className="max-w-3xl">
            <div
              className={`flex items-center gap-3 mb-5 ${
                isRTL ? "flex-row-reverse justify-end" : ""
              }`}
            >
              <span className="h-px w-10 bg-white/50" />

              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-100">
                {t("process.badge")}
              </span>
            </div>

            <h2 className="section-h2 font-display text-white leading-[1.08]">
              {t("process.title")}
            </h2>
          </div>

          <p
            className={`max-w-xl text-[15px] sm:text-base leading-7 text-blue-100/90 ${
              isRTL ? "lg:text-right" : ""
            }`}
          >
            {t("process.subtitle")}
          </p>
        </div>

        {/* =========================================================
            PROCESS
        ========================================================= */}
        <div className="border-t border-white/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

            {steps.map((step, index) => (
              <article
                key={step.number}
                className={`
                  relative
                  bg-white
                  px-6 py-7 sm:px-7 sm:py-8
                  min-h-[285px]
                  flex flex-col
                  ${index !== 0 ? "lg:border-l lg:border-[#D8E2EE]" : ""}
                  ${index > 1 ? "sm:border-t sm:border-[#D8E2EE] lg:border-t-0" : ""}
                `}
              >
                {/* Step number */}
                <div className="flex items-center justify-between mb-10">
                  <span className="text-[13px] font-semibold tracking-[0.12em] text-[#174A8B]">
                    {isRTL ? `المرحلة ${step.number}` : `ÉTAPE ${step.number}`}
                  </span>

                  <span className="text-xs text-slate-400 font-mono">
                    {String(index + 1).padStart(2, "0")}/04
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-[19px] sm:text-xl font-semibold tracking-tight text-slate-900 leading-snug mb-4">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-6 text-slate-600">
                    {step.desc}
                  </p>
                </div>

                {/* Administrative detail */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <p className="text-xs leading-5 text-slate-500">
                    {step.detail}
                  </p>
                </div>

                {/* Process connector */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      hidden lg:block
                      absolute
                      top-1/2
                      ${isRTL ? "-left-[1px]" : "-right-[1px]"}
                      translate-y-[-50%]
                      w-px
                      h-12
                      bg-[#174A8B]
                      z-10
                    `}
                  />
                )}
              </article>
            ))}
          </div>
        </div>

        {/* =========================================================
            FOOTER / TRUST
        ========================================================= */}
        <div className="mt-8 border border-white/20 bg-[#123E75]">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-6 py-7 sm:px-8">

            {/* Trust points */}
            <div
              className={`
                grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4
                gap-x-8 gap-y-4
                flex-1
              `}
            >
              {trust.map((label, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-sm text-blue-50"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-[#F97316]" />

                  <span className="leading-5">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="shrink-0">
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
                  px-7
                  bg-[#F97316]
                  text-white
                  text-sm
                  font-semibold
                  transition-colors
                  duration-200
                  hover:bg-[#EA6508]
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#123E75]
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