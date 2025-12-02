import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Textes selon la langue
  const prevLabel = lang === "ar" ? "السابق" : "Précédent";
  const nextLabel = lang === "ar" ? "التالي" : "Suivant";

  // RTL => inversion des flèches
  const isRTL = lang === "ar";

  return (
    <div className="flex items-center justify-center mt-8 gap-2" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Bouton Précédent */}
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
        }`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {isRTL ? (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="hidden sm:inline">{prevLabel}</span>
          </>
        ) : (
          <>
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{prevLabel}</span>
          </>
        )}
      </button>

      {/* Numéros de page */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-gray-400 font-medium"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`min-w-[40px] h-10 rounded-lg font-medium transition-all duration-200 ${
                page === currentPage
                  ? "bg-gray-800 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm"
              }`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Bouton Suivant */}
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {isRTL ? (
          <>
            <span className="hidden sm:inline">{nextLabel}</span>
            <ChevronLeft className="w-4 h-4" />
          </>
        ) : (
          <>
            <span className="hidden sm:inline">{nextLabel}</span>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};

export default Pagination;
