import React from "react";
import { Shield, UserCheck, Crown } from "lucide-react";
import type { Admin } from "./types";

interface Props {
  admins: Admin[];
}

const AdminStats: React.FC<Props> = ({ admins }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <Shield className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
            <p className="text-gray-600">Total administrateurs</p>
          </div>
        </div>
      </div>

      {/* Administrateurs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <UserCheck className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">
              {admins.filter((admin) => admin.role === "Administrateur").length}
            </p>
            <p className="text-gray-600">Administrateurs</p>
          </div>
        </div>
      </div>

      {/* Consultants */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <Crown className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">
              {admins.filter((admin) => admin.role === "Consultant").length}
            </p>
            <p className="text-gray-600">Consultants</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
