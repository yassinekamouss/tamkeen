import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import api from "../api/axios";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import { Footer } from "../components";
import { useTranslation } from "react-i18next";


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
  const { i18n } = useTranslation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const programsPerPage = 3;
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
        setError("Échec du chargement des programmes. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

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
    return <div className="text-center mt-10 text-gray-600">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-gray-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* HERO */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <h1 className="text-4xl font-bold">
            {lang === "fr" ? "Les Programmes Disponibles" : "البرامج المتاحة"}
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {lang === "fr"
              ? "Découvrez notre sélection de programmes de formation conçus pour développer vos compétences et atteindre vos objectifs professionnels."
              : "اكتشف مجموعتنا من البرامج التدريبية المصممة لتطوير مهاراتك وتحقيق أهدافك المهنية."}
          </p>

          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900">{programs.length}</span>
              <span>{lang === "fr" ? "Programmes" : "برامج"}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900">100%</span>
              <span>{lang === "fr" ? "En ligne" : "عبر الإنترنت"}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900">24/7</span>
              <span>{lang === "fr" ? "Accessible" : "متاح دائمًا"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PROGRAMS GRID */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {currentPrograms.map((program, index) => {
            const name = program.name[lang];
            const desc = program.description[lang];

            const isTitleExpanded = expandedTitle === program.id;
            const isDescExpanded = expandedDesc === program.id;

            const displayTitle = isTitleExpanded ? name : truncateText(name, 30);
            const displayDesc = isDescExpanded ? desc : truncateText(desc, 80);

            const needsTitleExpansion = name.length > 30;
            const needsDescExpansion = desc.length > 80;

            return (
              <div
                key={program.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative h-48 bg-gray-100">
              <img
                src={`${import.meta.env.VITE_PREFIX_URL}/programs/${program.hero?.image}`}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = getDefaultImage(index);
                }}
              />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  {/* TITLE */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex-grow">
                        {displayTitle}
                      </h3>

                      {needsTitleExpansion && (
                        <button
                          onClick={() => toggleTitleExpansion(program.id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 mt-1"
                        >
                          {isTitleExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mb-4 flex-grow">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-600 flex-grow">
                        {displayDesc}
                      </p>

                      {needsDescExpansion && (
                        <button
                          onClick={() => toggleDescExpansion(program.id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 mt-1"
                        >
                          {isDescExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* DATES (RTL for AR) */}
                  <div
                    className={
                      lang === "ar"
                        ? "flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100 flex-row-reverse text-right"
                        : "flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100"
                    }
                  >
                    <span className="font-medium text-gray-700">
                      {lang === "fr" ? "Date de début:" : "تاريخ البداية:"}
                    </span>
                    <span>{formatDate(program.DateDebut)}</span>

                    <span className="font-medium text-gray-700">
                      {lang === "fr" ? "Date de fin:" : "تاريخ النهاية:"}
                    </span>
                    <span>
                      {program.DateFin
                        ? formatDate(program.DateFin)
                        : lang === "fr"
                        ? "Pas défini"
                        : "غير محدد"}
                    </span>
                  </div>

                  {/* LINK */}
                  <a
                    href={program.link}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group"
                  >
                    {lang === "fr" ? "En savoir plus" : "المزيد"}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(programs.length / programsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DisponiblePrograms;
