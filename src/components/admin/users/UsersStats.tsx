import React from "react";
import { Users as UsersIcon, UserCheck, Building } from "lucide-react";

interface UsersStatsProps {
  totalCount: number;
  physiqueCount: number;
  moraleCount: number;
}

export const UsersStats: React.FC<UsersStatsProps> = ({
  totalCount,
  physiqueCount,
  moraleCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <UsersIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            <p className="text-gray-600">Utilisateurs</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <UserCheck className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{physiqueCount}</p>
            <p className="text-gray-600">Personnes physiques</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <Building className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{moraleCount}</p>
            <p className="text-gray-600">Personnes morales</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UsersStats;
