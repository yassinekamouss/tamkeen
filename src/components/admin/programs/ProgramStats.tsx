import React from "react";
import { BarChart3, CheckCircle, Grid3X3 } from "lucide-react";

interface ProgramStatsProps {
  totalCount: number;
  activeCount: number;
  filteredCount: number;
}

export const ProgramStats: React.FC<ProgramStatsProps> = ({
  totalCount,
  activeCount,
  filteredCount,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Total programmes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
        <div className="bg-gray-100 rounded-lg p-3">
          <BarChart3 className="w-6 h-6 text-gray-600" />
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          <p className="text-gray-600 text-sm">Total programmes</p>
        </div>
      </div>

      {/* Actifs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
        <div className="bg-gray-100 rounded-lg p-3">
          <CheckCircle className="w-6 h-6 text-gray-600" />
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
          <p className="text-gray-600 text-sm">Programmes actifs</p>
        </div>
      </div>

      {/* Filtrés */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
        <div className="bg-gray-100 rounded-lg p-3">
          <Grid3X3 className="w-6 h-6 text-gray-600" />
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900">{filteredCount}</p>
          <p className="text-gray-600 text-sm">Programmes filtrés</p>
        </div>
      </div>
    </div>
  );
};

export default ProgramStats;
