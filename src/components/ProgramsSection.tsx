import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import { sanitizeFrenchText } from "../utils/sanitize";
import { Link } from "react-router-dom";

interface BilingualText {
  fr: string;
  ar: string;
}

interface Program {
  id: string;
  name: BilingualText;
  description: BilingualText;
  isActive: boolean;
  DateDebut: string;
  DateFin: string;
  link: string;
  hero?: {
    isHero: boolean;
    image: string;
    titleFr: string;
    titleAr: string;
    subtitleFr: string;
    subtitleAr: string;
    descriptionFr: string;
    descriptionAr: string;
  };
}

const PREVIEW_COUNT = 6;

const ProgramsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/programs/active")
      .then((res) => setPrograms(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (ds: string) => {
    try {
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(ds));
    } catch {
      return "–";
    }
  };

  const visiblePrograms = programs.slice(0, PREVIEW_COUNT);

  return (
    <section
      id="programs"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-[#FAFAFA] border-b border-[#E4E4E7] py-20 sm:py-28"
      aria-label={t("programs_section.title")}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#F97316] font-display mb-3">
            {t("programs_section.badge")}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] font-display tracking-tight leading-tight mb-2">
                {t("programs_section.title")}
              </h2>
              <p className="text-sm text-[#1F2937]/55 max-w-lg leading-relaxed">{t("programs_section.subtitle")}</p>
            </div>
            <Link
              to="/programs"
              className="flex-shrink-0 text-[11px] font-mono uppercase tracking-wider text-[#1E5ED8] hover:text-[#F97316] flex items-center gap-2 transition-colors duration-200 group"
            >
              {t("programs_section.viewAll")}
              <ArrowRight
                size={13}
                className={`transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" : ""}`}
              />
            </Link>
          </div>
          <div className="mt-6 h-[1px] bg-[#E4E4E7]" />
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-xs font-mono uppercase tracking-wider text-[#1F2937]/40 py-12">
            {t("programs_section.loading")}
          </p>
        ) : programs.length === 0 ? (
          <p className="text-sm text-[#1F2937]/50 py-12">{t("programs_section.empty")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E4E4E7]">
            {visiblePrograms.map((program, index) => {
              const rawName = program.name[lang];
              const rawDesc = program.description[lang];
              const name = lang === "fr" ? sanitizeFrenchText(rawName) : rawName;
              const desc = lang === "fr" ? sanitizeFrenchText(rawDesc) : rawDesc;
              const isOpen = expanded === program.id;

              return (
                <div
                  key={program.id}
                  className="bg-white group flex flex-col transition-all duration-200 hover:bg-[#FAFCFF]"
                >
                  {/* Image area */}
                  <div className="relative h-44 bg-[#F4F4F5] overflow-hidden flex items-center justify-center">
                    <img
                      src={`${import.meta.env.VITE_PREFIX_URL}/programs/${program.hero?.image}`}
                      alt={name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      onError={(e) => {
                        e.currentTarget.classList.add("hidden");
                        const fallback = e.currentTarget.parentElement?.querySelector(".img-fallback");
                        if (fallback) fallback.classList.remove("hidden");
                      }}
                      loading="lazy"
                    />
                    <div className="img-fallback hidden flex-col items-center justify-center p-4 text-center text-[#1F2937]/30 font-mono text-xs">
                      <span>Tamkeen</span>
                    </div>
                    {/* Active badge */}
                    <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-[#1E5ED8] text-white text-[9px] font-mono uppercase tracking-wider px-2 py-1">
                      {t("programs_section.active")}
                    </span>
                    {/* Index counter */}
                    <span className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 text-[10px] font-mono text-white/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-sm font-bold text-[#1F2937] font-display leading-snug mb-3 group-hover:text-[#1E5ED8] transition-colors">
                      {name}
                    </h3>

                    {/* Description toggle */}
                    <div className="flex-grow mb-5">
                      <p className={`text-xs text-[#1F2937]/60 leading-relaxed ${isOpen ? "" : "line-clamp-3"}`}>
                        {desc}
                      </p>
                      {desc.length > 120 && (
                        <button
                          onClick={() => setExpanded(isOpen ? null : program.id)}
                          className="mt-1.5 text-[10px] font-mono uppercase tracking-wider text-[#1E5ED8] hover:text-[#F97316] transition-colors bg-transparent border-none p-0 cursor-pointer"
                        >
                          {isOpen ? t("programs_section.collapse") : t("programs_section.read_more")}
                        </button>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3 border-t border-[#E4E4E7] pt-4 mb-5 text-[10px] font-mono text-[#1F2937]/50 uppercase tracking-wider">
                      <div>
                        <span className="block text-[9px] font-bold text-[#1F2937]/30 mb-1">{t("programs_section.start")}</span>
                        <span className="text-[#1F2937]/70">{formatDate(program.DateDebut)}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-[#1F2937]/30 mb-1">{t("programs_section.end")}</span>
                        <span className="text-[#1F2937]/70">
                          {program.DateFin ? formatDate(program.DateFin) : t("programs_section.undefined")}
                        </span>
                      </div>
                    </div>

                    {/* Link */}
                    <a
                      href={program.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#1E5ED8] hover:text-[#F97316] transition-colors duration-200 group/link"
                    >
                      {t("programs_section.more")}
                      <ArrowRight
                        size={12}
                        className={`transition-transform group-hover/link:translate-x-1 ${isRTL ? "rotate-180 group-hover/link:-translate-x-1 group-hover/link:translate-x-0" : ""}`}
                      />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View all CTA */}
        {programs.length > PREVIEW_COUNT && (
          <div className="mt-10 flex justify-center">
            <Link to="/programs" className="btn-secondary">
              {t("programs_section.viewAll")}
              <ArrowRight size={13} className={isRTL ? "rotate-180" : ""} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramsSection;
