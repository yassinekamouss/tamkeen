import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { ADMIN_FRONT_PREFIX } from "../../api/axios";
import { useDashboardStats } from "../../hooks/admin";
import {
  StatsCards,
  TopSectorsChart,
  RegionActivityChart,
  QuickActions,
} from "../../components/admin/dashboard";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, extra, loading, activities } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre plateforme Tamkeen
        </p>
      </div>

      {/* Statistics Cards */}
      <StatsCards stats={stats} extra={extra} />

      {/* Quick Insights */}
      {extra && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TopSectorsChart topSectors={extra.topSectors} />
          <RegionActivityChart activeByRegion={extra.activeByRegion} />
        </div>
      )}

      {/* Quick Actions & Recent Activities */}
      <QuickActions
        activities={activities}
        adminFrontPrefix={ADMIN_FRONT_PREFIX}
        onNavigate={navigate}
      />
    </div>
  );
};

export default Dashboard;
