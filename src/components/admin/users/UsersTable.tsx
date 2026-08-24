import React from "react";
import { Link } from "react-router-dom";
import { Eye, Edit, FileX, Sliders } from "lucide-react";
import { ADMIN_FRONT_PREFIX } from "../../../api/axios";
import type { User, Admin } from "../../../hooks/admin/useUsers";

interface UsersTableProps {
  users: User[];
  admins: Admin[];
  adminProfile: any;
  onEdit: (user: User) => void;
  onViewDetails: (userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  admins,
  adminProfile,
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
        <>
          {/* Mobile Card List (Screen < 768px) */}
          <div className="md:hidden divide-y divide-gray-200">
            {users.map((user) => {
              const displayName =
                user.applicantType === "physique"
                  ? `${user.prenom || ""} ${user.nom || ""}`
                  : user.nomEntreprise || "";

              let numbers: string[] = [];
              if (typeof user.telephones === "string") {
                try {
                  const parsed = JSON.parse(user.telephones);
                  if (Array.isArray(parsed)) {
                    numbers = parsed.filter((t): t is string => Boolean(t));
                  }
                } catch {
                  numbers = [];
                }
              } else if (Array.isArray(user.telephones)) {
                numbers = user.telephones.filter((t): t is string => Boolean(t));
              }

              if (user.telephone && !numbers.includes(user.telephone)) {
                numbers.push(user.telephone);
              }

              const targetDossierId = user.dossierId || (user as any).dossier_id || user._id;

              return (
                <div key={user._id} className="p-4 space-y-3 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${
                          user.applicantType === "physique"
                            ? "bg-gray-600"
                            : "bg-blue-600"
                        }`}
                      >
                        {user.applicantType === "physique"
                          ? `${(user.prenom || "").charAt(0)}${(user.nom || "").charAt(0)}`
                          : (user.nomEntreprise || "").charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">
                          {displayName}
                        </h4>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        user.applicantType === "physique"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-50 text-blue-800"
                      }`}
                    >
                      {user.applicantType === "physique" ? "Physique" : "Morale"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
                    <div>
                      <span className="text-gray-500 font-medium block">Contact</span>
                      {numbers.length > 0 ? (
                        <select className="border border-gray-300 rounded px-1.5 py-1 text-xs bg-white w-full mt-0.5">
                          {numbers.map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>


                  </div>



                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => onViewDetails(user._id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded min-h-[36px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Voir
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
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded min-h-[36px]"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Éditer
                    </button>

                    <Link
                      to={`${ADMIN_FRONT_PREFIX}/dossiers/${targetDossierId}/studio`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded min-h-[36px] transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-blue-400" />
                      Studio
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (Screen >= 768px) */}
          <div className="hidden md:block overflow-x-auto">
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const targetDossierId = user.dossierId || (user as any).dossier_id || user._id;

                  return (
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

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                        <button
                          onClick={() => onViewDetails(user._id)}
                          className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                          title="Voir détails">
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
                          className="text-gray-600 hover:text-gray-900"
                          title="Éditer">
                          <Edit className="w-4 h-4" />
                        </button>

                        <Link
                          to={`${ADMIN_FRONT_PREFIX}/dossiers/${targetDossierId}/studio`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-lg transition-colors shadow-sm ml-2"
                          title="Ouvrir le Studio Consultant"
                        >
                          <Sliders className="w-3.5 h-3.5 text-blue-400" />
                          <span>Ouvrir Studio</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
export default UsersTable;
