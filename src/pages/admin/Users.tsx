import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  type: "physique" | "morale";
  nom?: string;
  prenom?: string;
  denomination?: string;
  email: string;
  telephone: string;
  createdAt?: string;
}



const Users: React.FC = () => {

  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "physique" | "morale">(
    "all"
  );

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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.nom && user.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.prenom &&
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.denomination &&
        user.denomination.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === "all" || user.type === filterType;

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
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
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
      console.log("Utilisateur mis à jour :", response.data);
      // Tu peux ici recharger les utilisateurs si besoin
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      await axios.delete(`/api/users/${userId}`);
      console.log("Utilisateur supprimé !");
      // ➤ Recharge ou filtre localement :
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <svg
            className="inline-block w-8 h-8 mr-3 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-600">
          Gérez les utilisateurs inscrits sur la plateforme Tamkeen
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
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
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
              <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
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
              <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.type === "physique").length}
              </p>
              <p className="text-gray-600">Personnes physiques</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.type === "morale").length}
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
            Liste des utilisateurs ({filteredUsers.length})
          </h3>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m6-6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun utilisateur trouvé
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
                    Utilisateur
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
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${user.type === "physique"
                              ? "bg-gray-500"
                              : "bg-gray-400"
                              }`}>
                            {user.type === "physique"
                              ? `${(user.prenom || "").charAt(0)}${(
                                user.nom || ""
                              ).charAt(0)}`
                              : (user.denomination || "").charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.type === "physique"
                              ? `${user.prenom} ${user.nom}`
                              : user.denomination}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.type === "physique"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-200 text-gray-800"
                          }`}>
                        {user.type === "physique"
                          ? "Personne physique"
                          : "Personne morale"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.telephone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/user/details/${user._id}`)}
                        className="text-gray-600 hover:text-gray-900 mr-3 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 5a1 1 0 00-2 0v8a1 1 0 002 0V7zm4 0a1 1 0 00-2 0v8a1 1 0 002 0V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isEditModalOpen && selectedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Modifier les informations</h2>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (selectedUser) {
                        updateUser(selectedUser);
                      }
                    }}
                  >
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                        value={selectedUser.email}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, email: e.target.value })
                        }
                        placeholder="exemple@domaine.com"
                      />
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                        value={selectedUser.telephone}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, telephone: e.target.value })
                        }
                        placeholder="+212 6XXXXXXXX"
                      />
                    </div>

                    {selectedUser.type === "physique" ? (
                      <>
                        <div className="mb-5">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                            value={selectedUser.prenom}
                            onChange={(e) =>
                              setSelectedUser({ ...selectedUser, prenom: e.target.value })
                            }
                            placeholder="Prénom"
                          />
                        </div>
                        <div className="mb-5">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                            value={selectedUser.nom}
                            onChange={(e) =>
                              setSelectedUser({ ...selectedUser, nom: e.target.value })
                            }
                            placeholder="Nom"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dénomination</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                          value={selectedUser.denomination}
                          onChange={(e) =>
                            setSelectedUser({ ...selectedUser, denomination: e.target.value })
                          }
                          placeholder="Dénomination"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-5 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
                      >
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