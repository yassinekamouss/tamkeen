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
  XCircle,
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
      case "AWAITING_INPUTS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-4 h-4" /> En attente infos
          </span>
        );
      case "CONSULTANT_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Search className="w-4 h-4" /> Révision Consultant
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Livré
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-4 h-4" /> Rejeté
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
            <FileText className="w-8 h-8 text-indigo-600" />
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
          <option value="AWAITING_INPUTS">En attente infos</option>
          <option value="CONSULTANT_REVIEW">Révision Consultant</option>
          <option value="DELIVERED">Livré</option>
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
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
