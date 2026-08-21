import React from "react";
import { Search, Star, User as UserIcon, Calendar, Tag, Edit, Trash2 } from "lucide-react";
import type { NewsItem } from "../../../hooks/admin/useNews";

interface NewsListProps {
  searchFilter: string;
  onSearchFilterChange: (val: string) => void;
  totalFilteredCount: number;
  paginatedNews: NewsItem[];
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (item: NewsItem) => void;
  onDelete: (id: number) => void;
}

export const NewsList: React.FC<NewsListProps> = ({
  searchFilter,
  onSearchFilterChange,
  totalFilteredCount,
  paginatedNews,
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Actualités ({totalFilteredCount})
          </h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchFilter}
            onChange={(e) => onSearchFilterChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {paginatedNews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucune actualité trouvée
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {paginatedNews.map((article) => (
              <div
                key={article.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {article.title.fr}
                      </h3>
                      {article.featured && (
                        <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" /> Vedette
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          article.published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {article.published ? "Publiée" : "Brouillon"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(article.publishedAt)}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {article.category.fr}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {article.excerpt.fr}
                    </p>
                    <p className="text-gray-500 text-sm italic" dir="rtl">
                      {article.excerpt.ar}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onEdit(article)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(article.id)}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {startIndex + 1} à {Math.min(startIndex + itemsPerPage, totalFilteredCount)} sur {totalFilteredCount}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Précédent
                </button>
                <span className="px-3 py-1 text-sm bg-slate-100 rounded">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsList;
