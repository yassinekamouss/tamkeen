import React from "react";
import { Calendar, User, Edit, Share, Trash2, Eye } from "lucide-react";
import type { Program } from "../../../hooks/admin/usePrograms";

interface ProgramCardProps {
  program: Program;
  isAdministrator: boolean;
  onEdit: (program: Program) => void;
  onPublish: (program: Program) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onViewDetails: (program: Program) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  isAdministrator,
  onEdit,
  onPublish,
  onDelete,
  onToggleActive,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center">
          {/* Titre + Badges */}
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {program.name.fr}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  program.isActive
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}>
                {program.isActive ? "Actif" : "Inactif"}
              </span>
              {program.hero?.isHero && (
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                  Publié
                </span>
              )}
            </div>
          </div>

          {/* Toggle Simple - Seulement pour Administrateur */}
          {isAdministrator && (
            <div className="relative group">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={program.isActive}
                  onChange={() => onToggleActive(program._id, program.isActive)}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>

              {/* Tooltip simple au hover */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {program.isActive ? "Désactiver" : "Activer"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {program.description.fr}
        </p>

        {/* Criteria Summary */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm">
            <User className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-gray-600">
              {(() => {
                type RuleGroupLite =
                  | { rules?: unknown[]; combinator?: string }
                  | null
                  | undefined;
                const rg = program.criteres as RuleGroupLite;
                if (rg && Array.isArray(rg.rules)) {
                  return `Critères: ${rg.rules.length} règle(s) • ${
                    rg.combinator || "AND"
                  }`;
                }
                return "Critères: —";
              })()}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-gray-600">
              Début:{" "}
              {program.DateDebut
                ? new Date(program.DateDebut).toLocaleDateString("fr-FR")
                : "N/A"}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-gray-600">
              Fin:{" "}
              {program.DateFin
                ? new Date(program.DateFin).toLocaleDateString("fr-FR")
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Actions - Administrateurs vs Consultants */}
        {isAdministrator ? (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(program)}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </button>
            <button
              onClick={() => onPublish(program)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                program.hero?.isHero
                  ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-700"
              }`}
              title={
                program.hero?.isHero
                  ? "Modifier la publication"
                  : "Publier le programme"
              }>
              <Share className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(program._id)}
              className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails(program)}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
              <Eye className="w-4 h-4 mr-2" />
              Voir détails
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;
