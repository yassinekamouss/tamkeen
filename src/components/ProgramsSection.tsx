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
      className="w-full bg-white border-b border-[#DADCE0] py-20 sm:py-24"
      aria-label={t("programs_section.title")}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#1A73E8] uppercase mb-4 block" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
            {t("programs_section.badge")}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[32px] font-bold text-[#191C1D] leading-tight tracking-tight mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {t("programs_section.title")}
              </h2>
              <p className="text-[15px] text-[#5F6368] max-w-lg leading-relaxed" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                {t("programs_section.subtitle")}
              </p>
            </div>
            <Link
              to="/programs"
              className="flex-shrink-0 text-[13px] font-bold uppercase tracking-wider text-[#1A73E8] hover:text-[#174EA6] flex items-center gap-2 transition-colors duration-200 group"
              style={{ fontFamily: "Roboto Flex, sans-serif" }}
            >
              {t("programs_section.viewAll")}
              <ArrowRight
                size={14}
                className={`transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" : ""}`}
              />
            </Link>
          </div>
          <div className="mt-8 h-[1px] bg-[#DADCE0]" />
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-[12px] font-medium tracking-wider text-[#727785] py-12" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {t("programs_section.loading")}
          </p>
        ) : programs.length === 0 ? (
          <p className="text-[14px] text-[#5F6368] py-12" style={{ fontFamily: "Roboto Flex, sans-serif" }}>{t("programs_section.empty")}</p>
        ) : (
          <>
            {/* Desktop View (screens > 768px) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#DADCE0] border border-[#DADCE0] rounded-xl overflow-hidden">
              {visiblePrograms.map((program, index) => {
                const rawName = program.name[lang];
                const rawDesc = program.description[lang];
                const name = lang === "fr" ? sanitizeFrenchText(rawName) : rawName;
                const desc = lang === "fr" ? sanitizeFrenchText(rawDesc) : rawDesc;
                const isOpen = expanded === program.id;

                return (
                  <div
                    key={program.id}
                    className="bg-white group flex flex-col transition-all duration-200 hover:bg-[#F8F9FA]"
                  >
                    {/* Image area */}
                    <div className="relative h-44 bg-[#F8F9FA] overflow-hidden flex items-center justify-center border-b border-[#DADCE0]">
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
                      <div className="img-fallback hidden flex-col items-center justify-center p-4 text-center text-[#A0A3BD] font-medium text-[12px]" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        <span>Tamkeen</span>
                      </div>
                      {/* Active badge */}
                      <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-[#1A73E8] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                        {t("programs_section.active")}
                      </span>
                      {/* Index counter */}
                      <span className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 text-[11px] font-medium text-white/80" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-[16px] font-bold text-[#191C1D] leading-snug mb-3 group-hover:text-[#1A73E8] transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                        {name}
                      </h3>

                      {/* Description toggle */}
                      <div className="flex-grow mb-5">
                        <p className={`text-[13px] text-[#5F6368] leading-relaxed ${isOpen ? "" : "line-clamp-3"}`} style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                          {desc}
                        </p>
                        {desc.length > 120 && (
                          <button
                            onClick={() => setExpanded(isOpen ? null : program.id)}
                            className="mt-2 text-[11px] font-bold uppercase tracking-wider text-[#1A73E8] hover:text-[#174EA6] transition-colors bg-transparent border-none p-0 cursor-pointer"
                            style={{ fontFamily: "Roboto Flex, sans-serif" }}
                          >
                            {isOpen ? t("programs_section.collapse") : t("programs_section.read_more")}
                          </button>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-3 border-t border-[#DADCE0] pt-4 mb-5 text-[11px] font-medium text-[#727785] tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        <div>
                          <span className="block text-[10px] font-bold text-[#A0A3BD] mb-1">{t("programs_section.start")}</span>
                          <span className="text-[#5F6368]">{formatDate(program.DateDebut)}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-[#A0A3BD] mb-1">{t("programs_section.end")}</span>
                          <span className="text-[#5F6368]">
                            {program.DateFin ? formatDate(program.DateFin) : t("programs_section.undefined")}
                          </span>
                        </div>
                      </div>

                      {/* Link */}
                      <a
                        href={program.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#1A73E8] hover:text-[#174EA6] transition-colors duration-200 group/link"
                        style={{ fontFamily: "Roboto Flex, sans-serif" }}
                      >
                        {t("programs_section.more")}
                        <ArrowRight
                          size={14}
                          className={`transition-transform group-hover/link:translate-x-1 ${isRTL ? "rotate-180 group-hover/link:-translate-x-1 group-hover/link:translate-x-0" : ""}`}
                        />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Horizontal Swipeable Carousel (screens <= 768px) */}
            <div className="md:hidden">
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-4 -mx-4 no-scrollbar scroll-smooth">
                {visiblePrograms.map((program, index) => {
                  const rawName = program.name[lang];
                  const rawDesc = program.description[lang];
                  const name = lang === "fr" ? sanitizeFrenchText(rawName) : rawName;
                  const desc = lang === "fr" ? sanitizeFrenchText(rawDesc) : rawDesc;
                  const isOpen = expanded === program.id;

                  return (
                    <div
                      key={program.id}
                      className="w-[84vw] max-w-[340px] flex-shrink-0 snap-start snap-always bg-white border border-[#DADCE0] flex flex-col justify-between shadow-sm rounded-xl overflow-hidden"
                    >
                      {/* Image area */}
                      <div className="relative h-40 bg-[#F8F9FA] overflow-hidden flex items-center justify-center border-b border-[#DADCE0]">
                        <img
                          src={`${import.meta.env.VITE_PREFIX_URL}/programs/${program.hero?.image}`}
                          alt={name}
                          className="w-full h-full object-cover transition-all duration-500"
                          onError={(e) => {
                            e.currentTarget.classList.add("hidden");
                            const fallback = e.currentTarget.parentElement?.querySelector(".img-fallback");
                            if (fallback) fallback.classList.remove("hidden");
                          }}
                          loading="lazy"
                        />
                        <div className="img-fallback hidden flex-col items-center justify-center p-4 text-center text-[#A0A3BD] font-medium text-[12px]" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          <span>Tamkeen</span>
                        </div>
                        {/* Active badge */}
                        <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-[#1A73E8] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                          {t("programs_section.active")}
                        </span>
                        {/* Index counter */}
                        <span className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 text-[11px] font-medium text-white/80" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <h3 className="text-[15px] font-bold text-[#191C1D] leading-snug mb-2.5" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                            {name}
                          </h3>

                          {/* Description toggle */}
                          <div className="mb-4">
                            <p className={`text-[13px] text-[#5F6368] leading-relaxed ${isOpen ? "" : "line-clamp-3"}`} style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                              {desc}
                            </p>
                            {desc.length > 120 && (
                              <button
                                onClick={() => setExpanded(isOpen ? null : program.id)}
                                className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A73E8] hover:text-[#174EA6] transition-colors bg-transparent border-none p-0 cursor-pointer"
                                style={{ fontFamily: "Roboto Flex, sans-serif" }}
                              >
                                {isOpen ? t("programs_section.collapse") : t("programs_section.read_more")}
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          {/* Dates */}
                          <div className="grid grid-cols-2 gap-2 border-t border-[#DADCE0] pt-3 mb-4 text-[11px] font-medium text-[#727785] tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                            <div>
                              <span className="block text-[10px] font-bold text-[#A0A3BD] mb-0.5">{t("programs_section.start")}</span>
                              <span className="text-[#5F6368]">{formatDate(program.DateDebut)}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-[#A0A3BD] mb-0.5">{t("programs_section.end")}</span>
                              <span className="text-[#5F6368]">
                                {program.DateFin ? formatDate(program.DateFin) : t("programs_section.undefined")}
                              </span>
                            </div>
                          </div>

                          {/* Link */}
                          <a
                            href={program.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#1A73E8] hover:text-[#174EA6] transition-colors duration-200"
                            style={{ fontFamily: "Roboto Flex, sans-serif" }}
                          >
                            {t("programs_section.more")}
                            <ArrowRight
                              size={14}
                              className={`transition-transform ${isRTL ? "rotate-180" : ""}`}
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Visual swipe hint */}
              <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-[#727785]" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                <span>{isRTL ? "← اسحب للاستكشاف →" : "← Glissez pour explorer →"}</span>
              </div>
            </div>
          </>
        )}

        {/* View all CTA */}
        {programs.length > PREVIEW_COUNT && (
          <div className="mt-10 flex justify-center">
            <Link to="/programs" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-[14px] font-bold rounded transition-colors shadow-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {t("programs_section.viewAll")}
              <ArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramsSection;
