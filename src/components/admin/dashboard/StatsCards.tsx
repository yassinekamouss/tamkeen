import React from "react";
import { Users, Target, CheckCircle, FileText } from "lucide-react";
import type { DashboardStats, AdminStatsResponse } from "../../../hooks/admin/useDashboardStats";

interface StatsCardsProps {
  stats: DashboardStats;
  extra: AdminStatsResponse | null;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, extra }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Users Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">
              Total Utilisateurs
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalUsers}
            </p>
            {extra && (
              <p className="text-xs text-gray-500 mt-1">
                +{extra.last7d.newUsers} cette semaine
              </p>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <Users className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Total Programs Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Programmes</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalPrograms}
            </p>
            {extra && (
              <p className="text-xs text-gray-500 mt-1">
                {extra.totals.activePrograms} actifs
              </p>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <Target className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Active Programs Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Actifs</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.activePrograms}
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <CheckCircle className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Recent Tests Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Tests récents</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.recentTests}
            </p>
            {extra && (
              <p className="text-xs text-gray-500 mt-1">
                Total: {extra.totals.totalTests}
              </p>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <FileText className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
