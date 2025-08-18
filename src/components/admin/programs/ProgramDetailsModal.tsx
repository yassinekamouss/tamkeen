// src/components/admin/programs/ProgramDetailsModal.tsx
import React from "react";
import {
  X,
  Calendar,
  Building,
  User,
  DollarSign,
  MapPin,
  Users,
  Briefcase,
  Target,
  TrendingUp,
  Clock,
  Link,
  Info,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";

interface Program {
  _id: string;
  name: string;
  description: string;
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
  criteres: {
    secteurActivite: string[];
    statutJuridique: string[];
    applicantType: string[];
    montantInvestissement: string[];
    chiffreAffaireParSecteur?: {
      secteur: string;
      min: number | null;
      max: number | null;
    }[];
    age?: {
      minAge: number | null;
      maxAge: number | null;
    };
    sexe?: string[];
    chiffreAffaire: {
      chiffreAffaireMin: number | null;
      chiffreAffaireMax: number | null;
    };
    anneeCreation: (string | number)[];
    region: string[];
  };
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

  const formatAmount = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
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
                {program.name}
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
                {program.description || "Aucune description disponible."}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Types d'applicants */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <User className="w-5 h-5 text-purple-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Types d'applicants</h4>
                  </div>
                  <div className="space-y-1">
                    {program.criteres.applicantType.length > 0 ? (
                      program.criteres.applicantType.map((type, index) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm mr-1 mb-1">
                          {type}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Tous les types acceptés</p>
                    )}
                  </div>
                </div>

                {/* Secteurs d'activité */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Building className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Secteurs d'activité</h4>
                  </div>
                  <div className="space-y-1">
                    {program.criteres.secteurActivite.length > 0 ? (
                      program.criteres.secteurActivite.map((secteur, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-1 mb-1">
                          {secteur}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Tous les secteurs acceptés</p>
                    )}
                  </div>
                </div>

                {/* Statuts juridiques */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Briefcase className="w-5 h-5 text-indigo-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Statuts juridiques</h4>
                  </div>
                  <div className="space-y-1">
                    {program.criteres.statutJuridique.length > 0 ? (
                      program.criteres.statutJuridique.map((statut, index) => (
                        <span
                          key={index}
                          className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm mr-1 mb-1">
                          {statut}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Tous les statuts acceptés</p>
                    )}
                  </div>
                </div>

                {/* Régions */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <MapPin className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Régions</h4>
                  </div>
                  <div className="space-y-1">
                    {program.criteres.region.length > 0 ? (
                      program.criteres.region.map((region, index) => (
                        <span
                          key={index}
                          className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-1 mb-1">
                          {region}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Toutes les régions acceptées</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Montants et chiffres d'affaires */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Montants d'investissement */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <DollarSign className="w-5 h-5 text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Montants d'investissement</h4>
                  </div>
                  <div className="space-y-1">
                    {program.criteres.montantInvestissement.length > 0 ? (
                      program.criteres.montantInvestissement.map((montant, index) => (
                        <span
                          key={index}
                          className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm mr-1 mb-1">
                          {montant}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Tous les montants acceptés</p>
                    )}
                  </div>
                </div>

                {/* Chiffre d'affaires global */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Chiffre d'affaires</h4>
                  </div>
                  {program.criteres.chiffreAffaire.chiffreAffaireMin || 
                   program.criteres.chiffreAffaire.chiffreAffaireMax ? (
                    <div className="space-y-2">
                      {program.criteres.chiffreAffaire.chiffreAffaireMin && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Minimum:</span>{" "}
                          {formatAmount(program.criteres.chiffreAffaire.chiffreAffaireMin)}
                        </p>
                      )}
                      {program.criteres.chiffreAffaire.chiffreAffaireMax && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Maximum:</span>{" "}
                          {formatAmount(program.criteres.chiffreAffaire.chiffreAffaireMax)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucune restriction</p>
                  )}
                </div>
              </div>

              {/* Chiffre d'affaires par secteur */}
              {program.criteres.chiffreAffaireParSecteur && 
               program.criteres.chiffreAffaireParSecteur.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-5 h-5 text-teal-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Chiffre d'affaires par secteur</h4>
                  </div>
                 <div className="space-y-3">
                  {program.criteres.chiffreAffaireParSecteur
                    // On garde uniquement ceux qui ont au moins min ou max
                    .filter((item) => item.min !== null || item.max !== null)
                    .map((item, index) => (
                      <div key={index} className="bg-teal-50 rounded-lg p-3">
                        <h5 className="font-medium text-teal-800 mb-1">{item.secteur}</h5>
                        <div className="text-sm text-teal-700">
                          {item.min && <span>Min: {formatAmount(item.min)}</span>}
                          {item.min && item.max && <span className="mx-2">•</span>}
                          {item.max && <span>Max: {formatAmount(item.max)}</span>}
                        </div>
                      </div>
                    ))}
                </div>
                </div>
              )}

              {/* Critères démographiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Âge */}
                {(program.criteres.age?.minAge || program.criteres.age?.maxAge) && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <Users className="w-5 h-5 text-pink-600 mr-2" />
                      <h4 className="font-semibold text-gray-800">Critères d'âge</h4>
                    </div>
                    <div className="space-y-1">
                      {program.criteres.age?.minAge && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Âge minimum:</span> {program.criteres.age.minAge} ans
                        </p>
                      )}
                      {program.criteres.age?.maxAge && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Âge maximum:</span> {program.criteres.age.maxAge} ans
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Genre */}
                {program.criteres.sexe && program.criteres.sexe.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <Users className="w-5 h-5 text-cyan-600 mr-2" />
                      <h4 className="font-semibold text-gray-800">Genre</h4>
                    </div>
                    <div className="space-y-1">
                      {program.criteres.sexe.map((sexe, index) => (
                        <span
                          key={index}
                          className="inline-block bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-sm mr-1">
                          {sexe}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Années de création */}
              {program.criteres.anneeCreation.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
                  <div className="flex items-center mb-3">
                    <Calendar className="w-5 h-5 text-amber-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Années de création acceptées</h4>
                  </div>
                  <div className="space-y-1">
                    {program.criteres.anneeCreation.map((annee, index) => (
                      <span
                        key={index}
                        className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm mr-1 mb-1">
                        {annee}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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