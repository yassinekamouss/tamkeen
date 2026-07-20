import React from "react";
import { Search, Calendar } from "lucide-react";

interface ProgramFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  remainingDays: number | null;
  onRemainingDaysChange: (value: number | null) => void;
  filterDate: string;
  onFilterDateChange: (value: string) => void;
  onClearFilters: () => void;
}

export const ProgramFilters: React.FC<ProgramFiltersProps> = ({
  searchTerm,
  onSearchChange,
  remainingDays,
  onRemainingDaysChange,
  filterDate,
  onFilterDateChange,
  onClearFilters,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Search className="w-4 h-4 mr-2 text-gray-500" />
            Rechercher un programme
          </label>
          <button
            onClick={() => onSearchChange("")}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
            title="Réinitialiser la recherche">
            Effacer
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Nom ou description..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {searchTerm && (
          <p className="text-xs text-gray-500 mt-1">
            Appuyez sur "Effacer" pour réinitialiser la recherche
          </p>
        )}
      </div>

      {/* Filter by Duration */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Filtrer par durée maximale (jours restants)
          </label>
          <button
            onClick={onClearFilters}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
            title="Réinitialiser le filtre">
            Effacer
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                ≤
              </span>
              <input
                type="number"
                placeholder="Nombre de jours"
                min={1}
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={remainingDays ?? ""}
                onChange={(e) =>
                  onRemainingDaysChange(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Nombre maximum de jours restants
            </p>
          </div>
          <div>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterDate}
              onChange={(e) => onFilterDateChange(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Date de référence (aujourd'hui si vide)
            </p>
          </div>
        </div>
        {(remainingDays !== null || filterDate) && (
          <p className="text-sm text-gray-600 mt-3">
            {filterDate && remainingDays !== null ? (
              <>
                Actifs entre aujourd'hui et le{" "}
                <span className="font-semibold">
                  {new Date(filterDate).toLocaleDateString()}
                </span>{" "}
                et avec ≤{" "}
                <span className="font-semibold">{remainingDays}</span> jours
                restants
              </>
            ) : filterDate ? (
              <>
                Actifs entre aujourd'hui et le{" "}
                <span className="font-semibold">
                  {new Date(filterDate).toLocaleDateString()}
                </span>
              </>
            ) : (
              <>
                Avec ≤ <span className="font-semibold">{remainingDays}</span>{" "}
                jours restants (depuis aujourd'hui)
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgramFilters;
