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
      className="w-full bg-white border-b border-[#E5E5E0]"
    >
      <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-20 sm:py-28">

        {/* ── Header ── */}
        <div className="mb-16">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#1E5ED8] uppercase mb-4">
            {t("project_types.badge")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-14">
            <h2 className="sm:col-span-7 text-[25px] sm:text-[30px] font-bold text-[#1A1A1A] leading-[1.25] tracking-[-0.02em]">
              {t("project_types.title")}
            </h2>
            <p className="sm:col-span-5 sm:pt-1 text-[13.5px] leading-[1.8] text-[#777]">
              {t("project_types.subtitle")}
            </p>
          </div>
        </div>

        {/* ── Rows ── */}
        <div className="divide-y divide-[#E5E5E0]">
          {projectTypes.map((item, idx) => (
            <div
              key={idx}
              className="group py-9 sm:py-11 first:pt-0 grid grid-cols-1 sm:grid-cols-12 gap-x-12 gap-y-5 items-start"
            >
              {/* Col 1 — Référence & enveloppe */}
              <div className="sm:col-span-2 flex sm:flex-col sm:items-start items-baseline gap-x-4 gap-y-1.5">
                <span className="text-[10.5px] font-mono font-medium text-[#C0C0C0] tracking-widest">
                  {item.code}
                </span>
                <span
                  className="text-[15px] font-bold text-[#1A1A1A] tracking-tight"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  {item.range}
                </span>
              </div>

              {/* Col 2 — Contenu principal */}
              <div className="sm:col-span-7">
                <span className="block text-[10.5px] font-semibold tracking-[0.12em] text-[#AAA] uppercase mb-2">
                  {item.label}
                </span>
                <h3 className="text-[17px] sm:text-[18px] font-bold text-[#1A1A1A] leading-[1.35] mb-3 tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-[1.8] text-[#666] max-w-[520px] mb-5">
                  {item.desc}
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {item.items.map((el, iIdx) => (
                    <li
                      key={iIdx}
                      className="flex items-center gap-2 text-[12px] text-[#555]"
                    >
                      <span className="w-[3px] h-[3px] rounded-full bg-[#CCC] shrink-0" />
                      {el}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3 — Action */}
              <div className="sm:col-span-3 sm:pt-7 sm:flex sm:justify-end">
                <button
                  onClick={onNavigateToForm}
                  className="group/btn inline-flex items-center gap-2 text-[11.5px] font-semibold text-[#1E5ED8] hover:text-[#1649AD] transition-colors cursor-pointer"
                >
                  <span className="border-b border-[#1E5ED8]/0 group-hover/btn:border-[#1E5ED8] pb-px transition-colors duration-200">
                    {isRTL ? "تحقق من أهليتك" : "Vérifier mon éligibilité"}
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-150 ${
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
        <p className="mt-10 text-[11px] text-[#BBB] leading-[1.8] max-w-xl">
          {isRTL
            ? "المبالغ المذكورة تقريبية. الأهلية النهائية تخضع لمعايير كل آلية على حدة."
            : "Les montants indiqués sont donnés à titre indicatif. L'éligibilité finale est soumise aux critères propres à chaque dispositif."}
        </p>
      </div>
    </section>
  );
};

export default ProjectTypesSection;