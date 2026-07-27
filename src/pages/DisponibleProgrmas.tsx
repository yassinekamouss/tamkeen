import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import api from "../api/axios";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import { Footer } from "../components";
import { useTranslation } from "react-i18next";

import { sanitizeFrenchText } from "../utils/sanitize";
import SeoHead from "../components/SeoHead";

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

const DisponiblePrograms: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const programsPerPage = 6; // increased to 6 for a better grid visual
  const lang = i18n.language as "fr" | "ar";

  const defaultImages = [
    `${import.meta.env.VITE_PREFIX_URL}/programs/default1.webp`,
    `${import.meta.env.VITE_PREFIX_URL}/programs/default2.webp`,
    `${import.meta.env.VITE_PREFIX_URL}/programs/default3.webp`,
  ];

  const getDefaultImage = (index: number) => {
    return defaultImages[index % defaultImages.length];
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await api.get("/programs/active");
        setPrograms(response.data);
      } catch (err) {
        setError(t("disponible_programs.error_loading"));
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [t]);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const toggleTitleExpansion = (id: string) => {
    setExpandedTitle(expandedTitle === id ? null : id);
  };

  const toggleDescExpansion = (id: string) => {
    setExpandedDesc(expandedDesc === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    } catch {
      return "Invalid date";
    }
  };

  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = programs.slice(indexOfFirstProgram, indexOfLastProgram);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center font-mono text-xs uppercase tracking-wider text-[#1F2937]/60">
            {t("disponible_programs.loading")}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center border border-red-200 bg-red-50/50 p-6 max-w-md font-mono text-xs text-red-700">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const programsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t("disponible_programs.title"),
    "description": t("disponible_programs.subtitle"),
    "numberOfItems": programs.length,
    "itemListElement": programs.map((prog, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "GovernmentService",
        "name": prog.name[lang] || prog.name["fr"],
        "description": prog.description[lang] || prog.description["fr"],
        "provider": {
          "@type": "Organization",
          "name": "Tamkeen",
          "url": "https://masubvention.ma",
        },
        "serviceArea": {
          "@type": "AdministrativeArea",
          "name": "Maroc",
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans">
      <SeoHead
        title={t("disponible_programs.title")}
        description={t("disponible_programs.subtitle")}
        jsonLd={programsJsonLd}
      />
      <Header />

      {/* HERO PANEL */}
      <div className="bg-[#1E5ED8] border-b border-[#E4E4E7] text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F97316] mb-4 block">
            {t("disponible_programs.badge")}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white mb-6">
            {t("disponible_programs.title")}
          </h1>

          <p className="text-sm sm:text-base text-[#FFFFFF]/75 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("disponible_programs.subtitle")}
          </p>

          <div className="grid grid-cols-3 divide-x divide-white/10 max-w-xl mx-auto border-t border-b border-white/10 py-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#F97316]">{programs.length}</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/50 mt-1">
                {t("disponible_programs.programs_count")}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#F97316]">100%</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/50 mt-1">
                {t("disponible_programs.online")}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#F97316]">24/7</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/50 mt-1">
                {t("disponible_programs.accessible")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PROGRAMS LIST */}
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentPrograms.map((program, index) => {
            const rawName = program.name[lang];
            const rawDesc = program.description[lang];
            const name = lang === "fr" ? sanitizeFrenchText(rawName) : rawName;
            const desc = lang === "fr" ? sanitizeFrenchText(rawDesc) : rawDesc;

            const isTitleExpanded = expandedTitle === program.id;
            const isDescExpanded = expandedDesc === program.id;

            const displayTitle = isTitleExpanded ? name : truncateText(name, 45);
            const displayDesc = isDescExpanded ? desc : truncateText(desc, 120);

            const needsTitleExpansion = name.length > 45;
            const needsDescExpansion = desc.length > 120;

            return (
              <article
                key={program.id}
                className="bg-white border border-[#E4E4E7] group transition-all duration-300 hover:border-[#1E5ED8] flex flex-col h-full"
              >
                <div className="relative h-48 bg-[#FFFFFF] overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_PREFIX_URL}/programs/${program.hero?.image}`}
                    alt={name || t("disponible_programs.title")}
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.src = getDefaultImage(index);
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-[#1E5ED8] text-white text-[9px] font-mono uppercase tracking-wider px-2 py-1">
                    {t("disponible_programs.active")}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  {/* TITLE */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base font-bold text-[#1F2937] font-display flex-grow leading-snug">
                        {displayTitle}
                      </h2>

                      {needsTitleExpansion && (
                        <button
                          onClick={() => toggleTitleExpansion(program.id)}
                          aria-label={isTitleExpanded ? "Réduire le titre" : "Développer le titre"}
                          className="text-[#1F2937]/50 hover:text-[#1E5ED8] transition-colors flex-shrink-0 mt-0.5"
                        >
                          {isTitleExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mb-6 flex-grow">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-[#1F2937]/65 flex-grow leading-relaxed">
                        {displayDesc}
                      </p>

                      {needsDescExpansion && (
                        <button
                          onClick={() => toggleDescExpansion(program.id)}
                          aria-label={isDescExpanded ? "Réduire la description" : "Développer la description"}
                          className="text-[#1F2937]/50 hover:text-[#1E5ED8] transition-colors flex-shrink-0 mt-0.5"
                        >
                          {isDescExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* DATES */}
                  <div className="border-t border-[#E4E4E7] pt-4 mb-6 text-[10px] font-mono uppercase tracking-wider text-[#1F2937]/50 grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[9px] font-bold text-[#1F2937]/40 mb-1">
                        {t("disponible_programs.start")}
                      </span>
                      <span className="text-[#1F2937]">{formatDate(program.DateDebut)}</span>
                    </div>

                    <div>
                      <span className="block text-[9px] font-bold text-[#1F2937]/40 mb-1">
                        {t("disponible_programs.end")}
                      </span>
                      <span className="text-[#1F2937]">
                        {program.DateFin
                          ? formatDate(program.DateFin)
                          : t("disponible_programs.undefined")}
                      </span>
                    </div>
                  </div>

                  {/* LINK */}
                  <a
                    href={program.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t("disponible_programs.more")} : ${name}`}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E5ED8] hover:text-[#F97316] transition-colors duration-255 mt-auto group/link"
                  >
                    <span>{t("disponible_programs.more")}</span>
                    <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="mt-16 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(programs.length / programsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DisponiblePrograms;
