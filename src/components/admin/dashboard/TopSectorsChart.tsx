import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";

// Register ChartJS locally for modularity
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface TopSectorsChartProps {
  topSectors: { _id: string; count: number }[];
}

export const TopSectorsChart: React.FC<TopSectorsChartProps> = ({ topSectors }) => {
  const chartData = useMemo(() => {
    const items = topSectors.slice(0, 5);
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
  }, [topSectors]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
        Secteurs les plus testés (Top 5)
      </h3>
      {topSectors.length > 0 ? (
        <div className="h-64">
          <Bar data={chartData.data} options={chartData.options} />
        </div>
      ) : (
        <p className="text-sm text-gray-500">Aucune donnée pour le moment.</p>
      )}
    </div>
  );
};

export default TopSectorsChart;
