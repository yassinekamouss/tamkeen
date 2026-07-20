import React from "react";
import { Activity, Plus, Users, ClipboardCheck } from "lucide-react";
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Activité récente
        </h3>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-sm text-gray-500">
              Aucune activité récente.
            </div>
          ) : (
            activities.map((a) => (
              <div
                key={activityKey(a)}
                className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div
                  className={
                    "w-2 h-2 rounded-full mr-3 " +
                    (a.type.startsWith("program")
                      ? "bg-amber-500"
                      : a.type.startsWith("news")
                      ? "bg-purple-500"
                      : a.type === "user_updated"
                      ? "bg-slate-500"
                      : "bg-blue-600")
                  }></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-800 font-medium">
                    {a.title}
                  </div>
                  <div className="text-xs text-gray-600">{a.message}</div>
                </div>
                <span className="text-xs text-gray-500 ml-3">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-green-600" />
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate(`${adminFrontPrefix}/programs`)}
            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <Plus className="w-6 h-6 text-gray-600 group-hover:text-gray-700 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              Nouveau programme
            </span>
          </button>
          <button
            onClick={() => onNavigate(`${adminFrontPrefix}/users`)}
            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <Users className="w-6 h-6 text-gray-600 group-hover:text-gray-700 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              Voir utilisateurs
            </span>
          </button>
          <button
            onClick={() => onNavigate(`${adminFrontPrefix}/tests`)}
            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <ClipboardCheck className="w-6 h-6 text-gray-600 group-hover:text-gray-700 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              Tests récents
            </span>
          </button>
          <button
            onClick={() => onNavigate(`${adminFrontPrefix}/reports`)}
            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <svg
              className="w-6 h-6 text-gray-600 group-hover:text-gray-700 mb-2"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Rapports
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
