import React from "react";
import { Search } from "lucide-react";

interface UsersSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: "all" | "physique" | "morale";
  onFilterChange: (value: "all" | "physique" | "morale") => void;
}

export const UsersSearchBar: React.FC<UsersSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'utilisateur
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterType}
            onChange={(e) =>
              onFilterChange(e.target.value as "all" | "physique" | "morale")
            }>
            <option value="all">Tous les types</option>
            <option value="physique">Personne physique</option>
            <option value="morale">Personne morale</option>
          </select>
        </div>
      </div>
    </div>
  );
};
export default UsersSearchBar;
