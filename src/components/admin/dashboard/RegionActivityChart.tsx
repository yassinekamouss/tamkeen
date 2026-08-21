import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions, TooltipItem, Plugin, Chart as ChartType } from "chart.js";

// Register ChartJS locally for modularity
ChartJS.register(ArcElement, Tooltip, Legend);

interface RegionActivityChartProps {
  activeByRegion: { _id: string; count: number }[];
}

export const RegionActivityChart: React.FC<RegionActivityChartProps> = ({
  activeByRegion,
}) => {
  const chartConfig = useMemo(() => {
    const items = activeByRegion.slice(0, 5);
    const labels = items.map((r) => r._id || "N/A");
    const values = items.map((r) => r.count);
    const palette = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    const total = values.reduce((a, b) => a + b, 0);

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
  }, [activeByRegion]);

  return (
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
      {activeByRegion.length > 0 ? (
        <div className="h-64">
          <Doughnut
            data={chartConfig.data}
            options={chartConfig.options}
            plugins={chartConfig.plugins}
          />
        </div>
      ) : (
        <p className="text-sm text-gray-500">Aucune donnée pour le moment.</p>
      )}
    </div>
  );
};

export default RegionActivityChart;
