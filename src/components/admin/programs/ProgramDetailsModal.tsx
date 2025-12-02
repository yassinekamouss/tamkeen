// src/components/admin/programs/ProgramDetailsModal.tsx
import React from "react";
import {
  X,
  Calendar,
  Target,
  Clock,
  Link,
  Info,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";

type Rule = {
  id?: string;
  field: string;
  operator: string;
  value: unknown;
  valueSource?: string;
};
type RuleGroup = {
  id?: string;
  combinator?: string; // 'and' | 'or'
  rules: Rule[];
};
  

interface BilingualText{
  fr: string;
  ar: string;
}

interface Program {
  _id: string;
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
  criteres: RuleGroup;
}

interface ProgramDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}

const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({
  isOpen,
  onClose,
  program,
}) => {
  if (!isOpen || !program) return null;

  // Note: amount formatting removed as legacy view is dropped

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {program.name.fr}
              </h2>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    program.isActive
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}>
                  {program.isActive ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {program.isActive ? "Actif" : "Inactif"}
                </span>
                {program.hero?.isHero && (
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                    <Star className="w-3 h-3 mr-1" />
                    Programme Publié
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-500 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Description */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Info className="w-5 h-5 text-slate-600 mr-2" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Description du programme
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {program.description.fr || "Aucune description disponible."}
              </p>
            </div>

            {/* Dates et Link */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">Date de début</h4>
                </div>
                <p className="text-blue-700">
                  {program.DateDebut
                    ? formatDate(program.DateDebut)
                    : "Non définie"}
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-red-800">Date de fin</h4>
                </div>
                <p className="text-red-700">
                  {program.DateFin
                    ? formatDate(program.DateFin)
                    : "Non définie"}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Link className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800">Lien</h4>
                </div>
                {program.link && program.link !== "#" ? (
                  <a
                    href={program.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:text-green-900 underline truncate block">
                    Consulter le programme
                  </a>
                ) : (
                  <p className="text-green-700">Non disponible</p>
                )}
              </div>
            </div>

            {/* Critères d'éligibilité */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-slate-600" />
                Critères d'éligibilité
              </h3>
              {/* Ruleset (react-querybuilder) only */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="mb-3 text-sm text-gray-600">
                  Combinateur:{" "}
                  <span className="font-semibold">
                    {program.criteres.combinator || "and"}
                  </span>
                </div>
                {(program.criteres.rules || []).length === 0 ? (
                  <p className="text-gray-500">Aucune règle définie.</p>
                ) : (
                  <ul className="space-y-2">
                    {program.criteres.rules.map((r, idx) => (
                      <li
                        key={r.id || idx}
                        className="text-sm text-gray-800 bg-gray-50 p-2 rounded border">
                        <span className="font-mono">{r.field}</span>
                        <span className="mx-2 text-gray-500">{r.operator}</span>
                        <span className="font-mono break-all">
                          {Array.isArray(r.value)
                            ? JSON.stringify(r.value)
                            : String(r.value)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailsModal;
