import React from "react";
import { useTranslation } from "react-i18next";

interface ProjectTypesSectionProps {
  onNavigateToForm?: () => void;
}

const ProjectTypesSection: React.FC<ProjectTypesSectionProps> = ({ onNavigateToForm }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const projectTypes = [
    {
      code: "CAT-01",
      label: isRTL ? "مرحلة التأسيس" : "Phase d'Amorçage",
      title: t("project_types.creation_title"),
      desc: t("project_types.creation_desc"),
      items: isRTL
        ? ["منح التأسيس", "دعم الأكرية والتجهيز", "المرافقة الأولى"]
        : ["Aides au démarrage", "Subvention loyer / équipement", "Accompagnement initial"],
      range: isRTL ? "< 2M د.م." : "< 2M DH",
    },
    {
      code: "CAT-02",
      label: isRTL ? "النمو والتوسع" : "Croissance & Scalabilité",
      title: t("project_types.extension_title"),
      desc: t("project_types.extension_desc"),
      items: isRTL
        ? ["دعم الاستثمار", "تحديث آليات الإنتاج", "خلق مناصب شغل"]
        : ["Primes d'investissement", "Modernisation outil productif", "Création d'emplois"],
      range: isRTL ? "2 – 10M د.م." : "2 – 10M DH",
    },
    {
      code: "CAT-03",
      label: isRTL ? "مشاريع استراتيجية" : "Projets Stratégiques",
      title: t("project_types.investment_title"),
      desc: t("project_types.investment_desc"),
      items: isRTL
        ? ["عقود استثمارية", "إعفاءات جبائية", "دعم المناطق الصناعية"]
        : ["Conventions d'investissement", "Exonérations fiscales", "Appui foncier industriel"],
      range: isRTL ? "> 10M د.م." : "> 10M DH",
    },
  ];

  return (
    <section
      id="project-types"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-white border-b border-[#DADCE0]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20 lg:py-24">

        {/* ── Header ── */}
        <div className="mb-10 sm:mb-14">
          <p className="text-[11px] font-bold tracking-[0.15em] text-[#1A73E8] uppercase mb-3 sm:mb-4">
            {t("project_types.badge")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-14">
            <h2 className="sm:col-span-7 text-[24px] sm:text-[32px] font-bold text-[#191C1D] leading-tight tracking-tight">
              {t("project_types.title")}
            </h2>
            <p className="sm:col-span-5 sm:pt-1 text-[14px] sm:text-[15px] leading-relaxed text-[#5F6368]">
              {t("project_types.subtitle")}
            </p>
          </div>
        </div>

        {/* ── Mobile Cards Layout (< sm) ── */}
        <div className="sm:hidden space-y-4">
          {projectTypes.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#DADCE0] rounded-2xl p-5 shadow-xs space-y-3.5"
            >
              {/* Card Top: Code & Range */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest text-[#727785] bg-[#F1F3F4] px-2.5 py-1 rounded-md font-mono">
                  {item.code}
                </span>
                <span className="text-[12.5px] font-bold text-[#1A73E8] bg-[#E8F0FE] px-2.5 py-0.5 rounded-full">
                  {item.range}
                </span>
              </div>

              {/* Title & Phase */}
              <div>
                <span className="block text-[10.5px] font-bold tracking-wider text-[#727785] uppercase mb-1">
                  {item.label}
                </span>
                <h3 className="text-[17px] font-bold text-[#191C1D] leading-snug">
                  {item.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-[13px] leading-relaxed text-[#5F6368]">
                {item.desc}
              </p>

              {/* Bullets Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.items.map((el, iIdx) => (
                  <span
                    key={iIdx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8F9FA] text-[11.5px] text-[#475569] font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]/60 shrink-0" />
                    {el}
                  </span>
                ))}
              </div>

              {/* Mobile CTA Button */}
              <button
                type="button"
                onClick={onNavigateToForm}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#F0F4F9] active:bg-[#E8F0FE] text-[#1A73E8] font-bold text-xs flex items-center justify-between transition-colors active:scale-[0.99]"
              >
                <span>{isRTL ? "تحقق من أهليتك" : "Vérifier mon éligibilité"}</span>
                <svg
                  className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* ── Desktop Rows (>= sm) ── */}
        <div className="hidden sm:block divide-y divide-[#DADCE0]">
          {projectTypes.map((item, idx) => (
            <div
              key={idx}
              className="group py-8 sm:py-10 first:pt-0 grid grid-cols-1 sm:grid-cols-12 gap-x-12 gap-y-5 items-start"
            >
              {/* Col 1 — Référence & enveloppe */}
              <div className="sm:col-span-2 flex sm:flex-col sm:items-start items-baseline gap-x-4 gap-y-1.5">
                <span className="text-[12px] font-medium text-[#727785] tracking-widest font-mono">
                  {item.code}
                </span>
                <span
                  className="text-[16px] font-bold text-[#191C1D] tracking-tight"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  {item.range}
                </span>
              </div>

              {/* Col 2 — Contenu principal */}
              <div className="sm:col-span-7">
                <span className="block text-[11px] font-bold tracking-wider text-[#727785] uppercase mb-2">
                  {item.label}
                </span>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-[#191C1D] leading-snug mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-[#5F6368] max-w-[520px] mb-5">
                  {item.desc}
                </p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {item.items.map((el, iIdx) => (
                    <li
                      key={iIdx}
                      className="flex items-center gap-2 text-[13px] text-[#5F6368]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DADCE0] shrink-0" />
                      {el}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3 — Action */}
              <div className="sm:col-span-3 sm:pt-6 sm:flex sm:justify-end">
                <button
                  onClick={onNavigateToForm}
                  className="group/btn inline-flex items-center gap-2 text-[13px] font-bold text-[#1A73E8] hover:text-[#174EA6] transition-colors cursor-pointer"
                >
                  <span className="border-b border-transparent group-hover/btn:border-[#174EA6] pb-px transition-colors duration-200">
                    {isRTL ? "تحقق من أهليتك" : "Vérifier mon éligibilité"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-150 ${
                      isRTL
                        ? "rotate-180 group-hover/btn:-translate-x-[3px]"
                        : "group-hover/btn:translate-x-[3px]"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Note ── */}
        <p className="mt-10 text-[12px] text-[#727785] leading-relaxed max-w-xl" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
          {isRTL
            ? "المبالغ المذكورة تقريبية. الأهلية النهائية تخضع لمعايير كل آلية على حدة."
            : "Les montants indiqués sont donnés à titre indicatif. L'éligibilité finale est soumise aux critères propres à chaque dispositif."}
        </p>
      </div>
    </section>
  );
};

export default ProjectTypesSection;