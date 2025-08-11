import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import type {
  TooltipItem,
  Chart as ChartType,
  ChartData,
  ChartOptions,
  Plugin,
} from "chart.js";

// Register Chart.js components once
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

interface DashboardStats {
  totalUsers: number;
  totalPrograms: number;
  activePrograms: number;
  recentTests: number;
}

interface AdminStatsResponse {
  totals: {
    totalUsers: number;
    totalPrograms: number;
    activePrograms: number;
    totalTests: number;
  };
  last7d: {
    newUsers: number;
    tests: number;
  };
  topSectors: { _id: string; count: number }[];
  activeByRegion: { _id: string; count: number }[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPrograms: 0,
    activePrograms: 0,
    recentTests: 0,
  });
  const [extra, setExtra] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get<AdminStatsResponse>("/stats/admin");
        setExtra(data);
        setStats({
          totalUsers: data.totals.totalUsers,
          totalPrograms: data.totals.totalPrograms,
          activePrograms: data.totals.activePrograms,
          recentTests: data.last7d.tests,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Memoized chart data/options
  const topSectorsData = useMemo(() => {
    const items = (extra?.topSectors ?? []).slice(0, 5);
    const labels = items.map((s) => s._id || "N/A");
    const values = items.map((s) => s.count);
    const palette = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    return {
      data: {
        labels,
        datasets: [
          {
            label: "Tests",
            data: values,
            backgroundColor: labels.map(
              (_, i) => palette[i % palette.length] + "33"
            ), // 20% opacity
            borderColor: labels.map((_, i) => palette[i % palette.length]),
            borderWidth: 2,
            borderRadius: 10,
            barThickness: 20,
          },
        ],
      } as ChartData<"bar">,
      options: {
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: TooltipItem<"bar">) => `${ctx.parsed.x} tests`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "#F1F5F9" },
            ticks: { color: "#475569" },
            border: { color: "#E2E8F0" },
          },
          y: {
            grid: { display: false },
            ticks: { color: "#334155" },
            border: { color: "#E2E8F0" },
          },
        },
      } as ChartOptions<"bar">,
    };
  }, [extra]);

  const regionActivityData = useMemo(() => {
    const items = (extra?.activeByRegion ?? []).slice(0, 5);
    const labels = items.map((r) => r._id || "N/A");
    const values = items.map((r) => r.count);
    const palette = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    const total = values.reduce((a, b) => a + b, 0);

    // Custom plugin to draw total in the center of the doughnut
    const centerTextPlugin: Plugin<"doughnut"> = {
      id: "centerText",
      afterDraw(chart) {
        const c = chart as ChartType<"doughnut">;
        const { ctx, chartArea } = c;
        if (!ctx || !chartArea) return;
        const { top, bottom, left, right } = chartArea;
        const txt = `${total}`;
        ctx.save();
        ctx.font = "600 16px Inter, system-ui, -apple-system, Segoe UI, Roboto";
        ctx.fillStyle = "#0F172A";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, (left + right) / 2, (top + bottom) / 2);
        ctx.restore();
      },
    };

    return {
      data: {
        labels,
        datasets: [
          {
            label: "Activité",
            data: values,
            backgroundColor: labels.map(
              (_, i) => palette[i % palette.length] + "CC"
            ), // 80% opacity
            borderColor: "#FFFFFF",
            borderWidth: 2,
            hoverOffset: 6,
            spacing: 2,
          },
        ],
      } as ChartData<"doughnut">,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom" as const,
            labels: {
              color: "#334155",
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx: TooltipItem<"doughnut">) => `${ctx.parsed} tests`,
            },
          },
        },
      } as ChartOptions<"doughnut">,
      plugins: [centerTextPlugin as Plugin<"doughnut">],
    };
  }, [extra]);

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <svg
            className="inline-block w-8 h-8 mr-3 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre plateforme Tamkeen
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Utilisateurs</p>
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
              <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
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
              <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
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
              <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
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
              <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      {extra && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M3 3h14v2H3V3zm0 5h14v2H3V8zm0 5h14v2H3v-2z" />
              </svg>
              Secteurs les plus testés (Top 5)
            </h3>
            {extra.topSectors.length > 0 ? (
              <div className="h-64">
                <Bar
                  data={topSectorsData.data}
                  options={topSectorsData.options}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Aucune donnée pour le moment.
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h2a2 2 0 012 2v1H2V5zm0 3h8v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8zm10 0h6v2h-6V8zm0 3h6v2h-6v-2z" />
              </svg>
              Activité par région (Top 5)
            </h3>
            {extra.activeByRegion.length > 0 ? (
              <div className="h-64">
                <Doughnut
                  data={regionActivityData.data}
                  options={regionActivityData.options}
                  plugins={regionActivityData.plugins}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Aucune donnée pour le moment.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Activité récente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">
                Nouveau test d'éligibilité effectué
              </span>
              <span className="text-xs text-gray-500 ml-auto">Il y a 2h</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">
                Programme "Go Siyaha" mis à jour
              </span>
              <span className="text-xs text-gray-500 ml-auto">Il y a 5h</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">
                Nouvel utilisateur inscrit
              </span>
              <span className="text-xs text-gray-500 ml-auto">Il y a 1j</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            Actions rapides
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/admin/programs")}
              className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-gray-700 mb-2"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Nouveau programme
              </span>
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-gray-700 mb-2"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.660.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Voir utilisateurs
              </span>
            </button>
            <button
              onClick={() => navigate("/admin/tests")}
              className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-gray-700 mb-2"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Tests récents
              </span>
            </button>
            <button
              onClick={() => navigate("/admin/reports")}
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
    </div>
  );
};

export default Dashboard;
