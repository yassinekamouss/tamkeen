import React, { useState } from "react";
import { Check, X } from "lucide-react";

interface ImprovedMultiSelectProps {
  value: string[];
  options: { name: string; label: string }[];
  onChange: (value: string[]) => void;
}

const ImprovedMultiSelect: React.FC<ImprovedMultiSelectProps> = ({
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const currentValue = Array.isArray(value) ? value : [];

  const toggleOption = (optionName: string) => {
    if (currentValue.includes(optionName)) {
      onChange(currentValue.filter((v) => v !== optionName));
    } else {
      onChange([...currentValue, optionName]);
    }
  };

  const removeOption = (optionName: string) => {
    onChange(currentValue.filter((v) => v !== optionName));
  };

  const selectAll = () => {
    const allFilteredValues = filteredOptions.map((opt) => opt.name);
    // Combine les valeurs actuelles avec les nouvelles (sans doublons)
    const newValues = [...new Set([...currentValue, ...allFilteredValues])];
    onChange(newValues);
  };

  const deselectAll = () => {
    const filteredValues = filteredOptions.map((opt) => opt.name);
    onChange(currentValue.filter((v) => !filteredValues.includes(v)));
  };

  const selectedLabels = currentValue
    .map((v) => options.find((o) => o.name === v)?.label)
    .filter(Boolean);

  // Filtrer les options selon la recherche
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      {/* Bouton principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left transition-all"
      >
        <div className="flex flex-wrap gap-1.5 min-h-[24px]">
          {currentValue.length === 0 ? (
            <span className="text-gray-400 text-sm">
              Sélectionner des valeurs...
            </span>
          ) : (
            selectedLabels.map((label, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded-md"
              >
                {label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(currentValue[idx]);
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
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
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Boutons Tout sélectionner / Tout désélectionner */}
            <div className="flex gap-2 p-2 border-b border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  selectAll();
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                Tout sélectionner
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deselectAll();
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Tout désélectionner
              </button>
            </div>

            {/* Liste des options */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  Aucun résultat trouvé
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = currentValue.includes(option.name);
                  return (
                    <div
                      key={option.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(option.name);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "font-medium text-blue-900"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bouton Terminer */}
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Terminer ({currentValue.length} sélectionné
                {currentValue.length > 1 ? "s" : ""})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ImprovedMultiSelect;
