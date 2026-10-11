import React from "react";
import {
  Activity,
  Zap,
  FolderOpen,
  Users,
  ClipboardCheck,
  FileBox,
  MessageSquare,
} from "lucide-react";
import type { ActivityItem } from "../../../types/admin/activity";
import { activityKey } from "../../../hooks/admin/useDashboardStats";

interface QuickActionsProps {
  activities: ActivityItem[];
  adminFrontPrefix: string;
  onNavigate: (path: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  activities,
  adminFrontPrefix,
  onNavigate,
}) => {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* 1. Quick Actions Métier */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Actions Rapides du Cabinet
          </span>
          <span className="text-xs text-gray-500 font-normal">
            Raccourcis opérationnels
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Action 1 : Revue des dossiers */}
          <button
            onClick={() => onNavigate(`${adminFrontPrefix}/dossiers?status=CONSULTANT_REVIEW`)}
            className="flex flex-col items-center justify-center p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/90 rounded-xl transition-all group shadow-xs">
            <Zap className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-bold text-amber-900 text-center">
              Revue & Validation
            </span>
            <span className="text-[10px] text-amber-700 text-center">
              Dossiers à instruire
            </span>
          </button>

          {/* Action 2 : Portefeuille complet */}
          <button
            onClick={() => onNavigate(`${adminFrontPrefix}/dossiers`)}
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-blue-50/60 border border-gray-200/80 hover:border-blue-300 rounded-xl transition-all group shadow-xs">
            <FolderOpen className="w-6 h-6 text-gray-700 group-hover:text-blue-600 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-700 text-center">
              Tous les Dossiers
            </span>
            <span className="text-[10px] text-gray-500 text-center">
              Suivi & Filtres
            </span>
          </button>

          {/* Action 3 : Demandes Client */}
          <button
            onClick={() => onNavigate(`${adminFrontPrefix}/dossiers`)}
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-orange-50/60 border border-gray-200/80 hover:border-orange-300 rounded-xl transition-all group shadow-xs">
            <MessageSquare className="w-6 h-6 text-gray-700 group-hover:text-orange-600 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold text-gray-800 group-hover:text-orange-700 text-center">
              Pièces & Relances
            </span>
            <span className="text-[10px] text-gray-500 text-center">
              Dossiers bloqués
            </span>
          </button>

          {/* Action 4 : Leads Éligibilité */}
          <button
            onClick={() => onNavigate(`${adminFrontPrefix}/tests`)}
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-emerald-50/60 border border-gray-200/80 hover:border-emerald-300 rounded-xl transition-all group shadow-xs">
            <ClipboardCheck className="w-6 h-6 text-gray-700 group-hover:text-emerald-600 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold text-gray-800 group-hover:text-emerald-700 text-center">
              Leads Éligibilité
            </span>
            <span className="text-[10px] text-gray-500 text-center">
              Tests qualifiés
            </span>
          </button>

          {/* Action 5 : Candidats & Entreprises */}
          <button
            onClick={() => onNavigate(`${adminFrontPrefix}/users`)}
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-purple-50/60 border border-gray-200/80 hover:border-purple-300 rounded-xl transition-all group shadow-xs">
            <Users className="w-6 h-6 text-gray-700 group-hover:text-purple-600 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold text-gray-800 group-hover:text-purple-700 text-center">
              Entreprises
            </span>
            <span className="text-[10px] text-gray-500 text-center">
              Annuaire clients
            </span>
          </button>

          {/* Action 6 : Types de Documents */}
          <button
            onClick={() => onNavigate(`${adminFrontPrefix}/document-types`)}
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-slate-100 border border-gray-200/80 hover:border-slate-400 rounded-xl transition-all group shadow-xs">
            <FileBox className="w-6 h-6 text-gray-700 group-hover:text-slate-900 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold text-gray-800 text-center">
              Types de Docs
            </span>
            <span className="text-[10px] text-gray-500 text-center">
              Modèles & Pièces
            </span>
          </button>
        </div>
      </div>

      {/* 2. Recent Activity Fil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Activité Récente du Cabinet
          </span>
          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            En direct
          </span>
        </h3>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-6">
              Aucune activité récente enregistrée.
            </div>
          ) : (
            activities.map((a) => (
              <div
                key={activityKey(a)}
                className="flex items-center p-3 bg-slate-50/70 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                <div
                  className={
                    "w-2.5 h-2.5 rounded-full mr-3 shrink-0 " +
                    (a.type.startsWith("dossier") || a.type.startsWith("document")
                      ? "bg-blue-600"
                      : a.type.startsWith("program")
                      ? "bg-amber-500"
                      : a.type.startsWith("news")
                      ? "bg-purple-500"
                      : "bg-emerald-500")
                  }
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-900 font-semibold truncate">
                    {a.title}
                  </div>
                  <div className="text-[11px] text-gray-600 truncate">{a.message}</div>
                </div>
                <span className="text-[10px] text-gray-400 font-mono ml-3 shrink-0">
                  {new Date(a.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
