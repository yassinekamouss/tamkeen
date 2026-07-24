import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const { i18n } = useTranslation();

  const isRTL = i18n.language.startsWith("ar");

  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  const previousLabel = isRTL ? "السابق" : "Preview";
  const nextLabel = isRTL ? "التالي" : "Next";

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav
      aria-label={isRTL ? "التنقل بين الصفحات" : "Pagination"}
      dir={isRTL ? "rtl" : "ltr"}
      className={`flex w-full justify-center ${className}`}
    >
      <div className="flex items-center gap-7">

        {/* Previous */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
          className="
            group
            flex items-center gap-2
            text-[13px] font-medium
            text-gray-900
            transition-colors
            hover:text-gray-500
            disabled:pointer-events-none
            disabled:opacity-40
          "
        >
          {isRTL ? (
            <ChevronRight
              className="
                h-4 w-4
                stroke-[1.5]
                transition-transform
                group-hover:translate-x-0.5
              "
            />
          ) : (
            <ChevronLeft
              className="
                h-4 w-4
                stroke-[1.5]
                transition-transform
                group-hover:-translate-x-0.5
              "
            />
          )}

          <span className="hidden sm:inline">
            {previousLabel}
          </span>
        </button>

        {/* Pages */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    text-gray-900
                  "
                >
                  <MoreHorizontal
                    className="h-4 w-4 stroke-[1.5]"
                  />
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  text-[13px] font-medium
                  transition-all duration-200

                  ${
                    isActive
                      ? `
                        border border-gray-200
                        bg-white
                        text-gray-900
                        shadow-[0_2px_6px_rgba(0,0,0,0.08)]
                      `
                      : `
                        text-gray-500
                        hover:bg-gray-50
                        hover:text-gray-900
                      `
                  }
                `}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
          className="
            group
            flex items-center gap-2
            text-[13px] font-medium
            text-gray-900
            transition-colors
            hover:text-gray-500
            disabled:pointer-events-none
            disabled:opacity-40
          "
        >
          <span className="hidden sm:inline">
            {nextLabel}
          </span>

          {isRTL ? (
            <ChevronLeft
              className="
                h-4 w-4
                stroke-[1.5]
                transition-transform
                group-hover:-translate-x-0.5
              "
            />
          ) : (
            <ChevronRight
              className="
                h-4 w-4
                stroke-[1.5]
                transition-transform
                group-hover:translate-x-0.5
              "
            />
          )}
        </button>

      </div>
    </nav>
  );
};

export default Pagination;