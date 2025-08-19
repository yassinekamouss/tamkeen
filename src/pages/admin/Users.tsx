import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { getAdminSocket } from "../../api/socket";
import { useNavigate } from "react-router-dom";
import {
  Users as UsersIcon,
  Search,
  UserCheck,
  Building,
  Edit,
  Eye,
  AlertCircle,
  FileX,
} from "lucide-react";

interface User {
  _id: string;
  applicantType: "physique" | "morale";
  nom?: string;
  prenom?: string;
  etat?: string;
  nomEntreprise?: string;
  email: string;
  telephone: string;
  createdAt?: string;
  consultantAssocie?: {
    _id: string;
    username: string;
  };
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const adminProfile = JSON.parse(localStorage.getItem("adminProfile") || "{}");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "physique" | "morale">(
    "all"
  );

  interface UserUpdatedPayload {
    _id: string;
    etat?: string;
    consultantAssocie?: { _id: string; username: string } | null;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        setUsers(response.data);
      } catch {
        setError("Erreur lors du chargement des utilisateurs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // WebSocket: écouter les mises à jour en temps réel de l'état des candidats
  useEffect(() => {
    const socket = getAdminSocket();

    const onUserUpdated = (payload: UserUpdatedPayload) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === payload._id
            ? {
                ...u,
                etat: payload.etat ?? u.etat,
                consultantAssocie:
                  payload.consultantAssocie ?? u.consultantAssocie,
              }
            : u
        )
      );
    };

    socket.on("user:updated", onUserUpdated);

    return () => {
      socket.off("user:updated", onUserUpdated);
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.nom && user.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.prenom &&
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.nomEntreprise &&
        user.nomEntreprise.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === "all" || user.applicantType === filterType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const updateUser = async (updatedUser: User) => {
    try {
      const response = await axios.put(`users/${updatedUser._id}`, updatedUser);
      console.log("Candidat mis à jour :", response.data);
      // Tu peux ici recharger les candidats si besoin
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <UsersIcon className="inline-block w-8 h-8 mr-3 text-gray-600" />
          Gestion des candidats
        </h1>
        <p className="text-gray-600">
          Gérez les candidats inscrits sur la plateforme Tamkeen
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'utilisateur
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "all" | "physique" | "morale")
              }>
              <option value="all">Tous les types</option>
              <option value="physique">Personne physique</option>
              <option value="morale">Personne morale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-lg p-3">
              <UsersIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-gray-600">Total utilisateurs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-lg p-3">
              <UserCheck className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.applicantType === "physique").length}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.applicantType === "morale").length}
              </p>
              <p className="text-gray-600">Personnes morales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Liste des candidats ({filteredUsers.length})
          </h3>
        </div>

        {filteredUsers.length === 0 ? (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consultant associé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
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
                        {user.telephone}
                      </div>
                    </td>
                    <td>
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
                            const newEtat = e.target.value;
                            // if (user.assistant) {
                            //   user.assistant._id = adminProfile._id; // Set the assistant to the admin's ID
                            // } else {
                            user.consultantAssocie = {
                              _id: adminProfile._id,
                              username: adminProfile.username,
                            };
                            // }
                            try {
                              await axios.put(`/users/${user._id}`, {
                                ...user,
                                etat: newEtat,
                              });
                              setUsers((prev) =>
                                prev.map((u) =>
                                  u._id === user._id
                                    ? { ...u, etat: newEtat }
                                    : u
                                )
                              );
                            } catch {
                              alert("Erreur lors de la mise à jour de l'état.");
                            }
                          }}>
                          <option value="">Sélectionner</option>
                          <option value="En traitement">En traitement</option>
                          <option value="En attente">En attente</option>
                          <option value="Terminé">Terminé</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="text-sm text-gray-900">
                        {user.consultantAssocie ? (
                          user.consultantAssocie.username
                        ) : (
                          <span className="text-gray-400 italic">
                            Non attribué
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate(`/admin/user/details/${user._id}`)
                        }
                        className="text-gray-600 hover:text-gray-900 mr-3 transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-900 mr-3">
                        <Edit className="w-4 h-4" />
                      </button>
                    
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isEditModalOpen && selectedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Modifier les informations
                  </h2>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (selectedUser) {
                        updateUser(selectedUser);
                      }
                    }}>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                        value={selectedUser.email}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            email: e.target.value,
                          })
                        }
                        placeholder="exemple@domaine.com"
                      />
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                        value={selectedUser.telephone}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            telephone: e.target.value,
                          })
                        }
                        placeholder="+212 6XXXXXXXX"
                      />
                    </div>

                    {selectedUser.applicantType === "physique" ? (
                      <>
                        <div className="mb-5">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                            value={selectedUser.prenom}
                            onChange={(e) =>
                              setSelectedUser({
                                ...selectedUser,
                                prenom: e.target.value,
                              })
                            }
                            placeholder="Prénom"
                          />
                        </div>
                        <div className="mb-5">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                            value={selectedUser.nom}
                            onChange={(e) =>
                              setSelectedUser({
                                ...selectedUser,
                                nom: e.target.value,
                              })
                            }
                            placeholder="Nom"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dénomination
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                          value={selectedUser.nomEntreprise}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              nomEntreprise: e.target.value,
                            })
                          }
                          placeholder="Dénomination"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-5 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 transition">
                        Enregistrer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
