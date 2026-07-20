import React, { useState } from "react";
import { Check } from "lucide-react";

interface SearchableSelectProps {
  value: string;
  options: { name: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = "-- Sélectionner --",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOption = options.find((opt) => opt.name === value);

  // Filtrer les options selon la recherche
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionName: string) => {
    onChange(optionName);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full">
      {/* Bouton principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left transition-all"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Barre de recherche */}
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Liste des options */}
            <div className="max-h-64 overflow-y-auto">
              {/* Option vide pour désélectionner */}
              {value && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect("");
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-gray-500 border-b border-gray-100 italic"
                >
                  {placeholder}
                </div>
              )}

              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  Aucun résultat trouvé
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value === option.name;
                  return (
                    <div
                      key={option.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option.name);
                      }}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "font-medium text-blue-900"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchableSelect;
