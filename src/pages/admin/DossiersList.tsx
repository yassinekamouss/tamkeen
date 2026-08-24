import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ADMIN_FRONT_PREFIX } from "../../api/axios";
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  Loader2,
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import { adminDossierService } from "../../services/adminDossierService";

const DossiersList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [planFilter, setPlanFilter] = useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminDossiers", statusFilter, planFilter],
    queryFn: () => adminDossierService.getDossiers({ status: statusFilter, plan_type: planFilter }),
  });

  const dossiers = (data as any)?.dossiers || (Array.isArray(data) ? data : []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLAN_SELECTION":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Layers className="w-4 h-4" /> Sélection du plan
          </span>
        );
      case "AWAITING_INPUTS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-4 h-4" /> En attente des données
          </span>
        );
      case "AI_DRAFTING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-4 h-4" /> Rédaction IA
          </span>
        );
      case "CONSULTANT_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Search className="w-4 h-4" /> Révision Consultant
          </span>
        );
      case "AWAITING_CLIENT_INFO":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200">
            <AlertCircle className="w-4 h-4" /> Infos client requises
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Livré
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-4 h-4" /> En cours
          </span>
        );
      case "CLIENT_APPROVAL_PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-teal-50 text-teal-700 border border-teal-200">
            <UserCheck className="w-4 h-4" /> Approbation client
          </span>
        );
      case "EXTERNAL_PROCESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            <ExternalLink className="w-4 h-4" /> Procédure externe
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-slate-700" />
            Gestion des Dossiers
          </h1>
          <p className="mt-2 text-gray-500">
            Supervisez et traitez les demandes de subvention de vos clients.
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtres :</span>
        </div>
        
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
        >
          <option value="">Tous les plans</option>
          <option value="PLAN_1">Plan 1 (Rapport seul)</option>
          <option value="PLAN_2">Plan 2 (Accompagnement)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
        >
          <option value="">Tous les statuts</option>
          <option value="PLAN_SELECTION">Sélection du plan (PLAN_SELECTION)</option>
          <option value="AWAITING_INPUTS">En attente des données (AWAITING_INPUTS)</option>
          <option value="AI_DRAFTING">Rédaction IA (AI_DRAFTING)</option>
          <option value="CONSULTANT_REVIEW">Révision Consultant (CONSULTANT_REVIEW)</option>
          <option value="AWAITING_CLIENT_INFO">Infos client requises (AWAITING_CLIENT_INFO)</option>
          <option value="DELIVERED">Livré (DELIVERED)</option>
          <option value="IN_PROGRESS">En cours (IN_PROGRESS)</option>
          <option value="CLIENT_APPROVAL_PENDING">Approbation client (CLIENT_APPROVAL_PENDING)</option>
          <option value="EXTERNAL_PROCESS">Procédure externe (EXTERNAL_PROCESS)</option>
        </select>
      </div>

      {/* Liste des dossiers */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
          <p>Chargement des dossiers...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-xl flex items-center gap-4">
          <AlertCircle className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Erreur</h3>
            <p>Impossible de charger les dossiers. Veuillez réessayer plus tard.</p>
          </div>
        </div>
      ) : dossiers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun dossier trouvé</h3>
          <p className="text-gray-500 mt-1">Modifiez vos filtres ou attendez de nouvelles soumissions.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {dossiers.map((dossier: any) => (
            <div
              key={dossier.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {dossier.client?.nom} {dossier.client?.prenom}
                  </h3>
                  {getStatusBadge(dossier.status)}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                    {dossier.plan_type === "PLAN_1" ? "Plan 1" : "Plan 2"}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{dossier.client?.nomEntreprise || "Non renseigné"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(dossier.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-6">
                <Link
                  to={`${ADMIN_FRONT_PREFIX}/dossiers/${dossier.id}/studio`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white hover:text-white font-medium rounded-lg transition-colors"
                >
                  Gérer
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DossiersList;
