import React from "react";
import { Edit, Trash2, UserX , Key } from "lucide-react";
import type { Admin } from "./types";

interface Props {
  filteredAdmins: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (id: string) => void;
  onResetPassword: (id: string) => void; 
}

const AdminTable: React.FC<Props> = ({ filteredAdmins, onEdit, onDelete,onResetPassword }) => {
  if (filteredAdmins.length === 0) {
    return (
      <div className="text-center py-12">
        <UserX className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Aucun administrateur trouvé
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Essayez de modifier vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Administrateur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rôle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAdmins.map((admin) => (
            <tr key={`admin-${admin._id}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                        admin.role === "Consultant"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {admin.username ? admin.username.charAt(0).toUpperCase() : "?"}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {admin.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {admin.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    admin.role === "Consultant"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {admin.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(admin)}
                  className="text-gray-600 hover:text-gray-900 mr-3 transition-colors duration-200"
                  title="Modifier l'administrateur"
              >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(admin._id)}
                  className="text-red-600 hover:text-red-900 transition-colors duration-200"
                  title="Supprimer l'administrateur"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                 <button
                onClick={() => onResetPassword(admin._id)}
                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                title="Réinitialiser le mot de passe"
           >
                <Key className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
