import React from "react";
import { Eye, Edit, FileX } from "lucide-react";
import type { User, Admin } from "../../../hooks/admin/useUsers";

interface UsersTableProps {
  users: User[];
  admins: Admin[];
  adminProfile: any;
  onConsultantChange: (user: User, consultant: Admin | null) => Promise<void>;
  onStatusChange: (user: User, status: string) => Promise<void>;
  onEdit: (user: User) => void;
  onViewDetails: (userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  admins,
  adminProfile,
  onConsultantChange,
  onStatusChange,
  onEdit,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Liste des candidats ({users.length})
        </h3>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <FileX className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucun candidat trouvé
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  État
                </th>
                {adminProfile.role === "Administrateur" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consultant associé
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                            user.applicantType === "physique"
                              ? "bg-gray-500"
                              : "bg-gray-400"
                          }`}>
                          {user.applicantType === "physique"
                            ? `${(user.prenom || "").charAt(0)}${(
                                user.nom || ""
                              ).charAt(0)}`
                            : (user.nomEntreprise || "").charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.applicantType === "physique"
                            ? `${user.prenom} ${user.nom}`
                            : user.nomEntreprise}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.applicantType === "physique"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-200 text-gray-800"
                      }`}>
                      {user.applicantType === "physique"
                        ? "Personne physique"
                        : "Personne morale"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(() => {
                        let numbers: string[] = [];

                        if (typeof user.telephones === "string") {
                          try {
                            const parsed = JSON.parse(user.telephones);
                            if (Array.isArray(parsed)) {
                              numbers = parsed.filter((t): t is string =>
                                Boolean(t)
                              );
                            }
                          } catch {
                            numbers = [];
                          }
                        } else if (Array.isArray(user.telephones)) {
                          numbers = user.telephones.filter((t): t is string =>
                            Boolean(t)
                          );
                        }

                        if (
                          user.telephone &&
                          !numbers.includes(user.telephone)
                        ) {
                          numbers.push(user.telephone);
                        }

                        return numbers.length > 0 ? (
                          <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white">
                            {numbers.map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        ) : (
                          "—"
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <select
                        disabled={Boolean(
                          user.consultantAssocie?._id &&
                            user.consultantAssocie._id !== adminProfile._id
                        )}
                        title={
                          user.consultantAssocie?._id &&
                          user.consultantAssocie._id !== adminProfile._id
                            ? "Un consultant est déjà associé à ce client"
                            : ""
                        }
                        className={`border border-gray-300 rounded px-2 py-1 text-sm ${
                          user.consultantAssocie?._id &&
                          user.consultantAssocie._id !== adminProfile._id
                            ? "cursor-not-allowed bg-gray-100"
                            : ""
                        }`}
                        value={user.etat || ""}
                        onChange={async (e) => {
                          await onStatusChange(user, e.target.value);
                        }}>
                        <option value="En traitement">En traitement</option>
                        <option value="En attente">En attente</option>
                        <option value="Terminé">Terminé</option>
                      </select>
                    </div>
                  </td>
                  {adminProfile.role === "Administrateur" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div
                        className={
                          user.consultantAssocie
                            ? "text-sm text-gray-900"
                            : "italic text-gray-400"
                        }>
                        <select
                          name="consultant"
                          className={
                            adminProfile.role === "Administrateur"
                              ? ""
                              : "cursor-not-allowed bg-gray-100"
                          }
                          disabled={adminProfile.role !== "Administrateur"}
                          value={
                            user.consultantAssocie
                              ? JSON.stringify(user.consultantAssocie)
                              : ""
                          }
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            const adminObj = selectedValue
                              ? JSON.parse(selectedValue)
                              : null;
                            onConsultantChange(user, adminObj);
                          }}>
                          {!user.consultantAssocie && (
                            <option value="" className="text-gray-400 italic">
                              Aucun consultant associé
                            </option>
                          )}

                          {user.consultantAssocie && (
                            <option
                              value={JSON.stringify(user.consultantAssocie)}>
                              {user.consultantAssocie.username}
                            </option>
                          )}
                          {admins
                            .filter(
                              (admin) =>
                                admin._id !== user.consultantAssocie?._id
                            )
                            .map((admin) => (
                              <option
                                key={admin._id}
                                value={JSON.stringify(admin)}>
                                {admin.username}
                              </option>
                            ))}
                        </select>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewDetails(user._id)}
                      className="text-gray-600 hover:text-gray-900 mr-3 transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        const normUser: User = {
                          ...user,
                          telephone:
                            (Array.isArray(user.telephones) &&
                              user.telephones[0]) ||
                            user.telephone ||
                            "",
                        };
                        onEdit(normUser);
                      }}
                      className="text-gray-600 hover:text-gray-900 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default UsersTable;
