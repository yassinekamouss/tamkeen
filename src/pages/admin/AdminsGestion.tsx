import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Shield,
  Search,
  AlertCircle,
  Plus,
} from "lucide-react";

import AdminStats from "../../components/admin/admins/AdminStats";
import AdminTable from "../../components/admin/admins/AdminTable";

import type { Admin, NewAdmin } from "../../components/admin/admins/types";
import AddAdminModal from "../../components/admin/admins/AddAdminModal";
import EditAdminModal from "../../components/admin/admins/EditAdminModal";

const AdminsGestion: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "Administrateur" | "Consultant">("all");

  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    email: "",
    username: "",
    password: "",
    role: "Consultant",
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const adminProfile = JSON.parse(localStorage.getItem("adminProfile") || "null");
        const response = await axios.get("/admin/others", { params: { _id: adminProfile._id } });
        setAdmins(response.data);
      } catch {
        setError("Erreur lors du chargement des administrateurs.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter((admin) => {
    const email = admin.email || "";
    const username = admin.username || "";
    
    const matchesSearch =
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || admin.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/register", newAdmin);
      setAdmins((prev) => [...prev, response.data.admin]);
      setNewAdmin({ email: "", username: "", password: "", role: "Consultant" });
      setIsAddModalOpen(false);
      console.log("Administrateur ajouté :", response.data.admin);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };
   
  const updateAdmin = async (updatedAdmin: Admin, id: string) => {
    try {
      const { ...adminData } = updatedAdmin;
      const response = await axios.put(`/admin/${id}`, adminData);
      setAdmins((prev) =>
        prev.map((admin) => (admin._id === id ? response.data.admin : admin))
      );
      setIsEditModalOpen(false);
    setSelectedAdmin(null);
    setEditingAdminId(null);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
};
  const handleDeleteAdmin = async (adminId: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet administrateur ?")) return;

    try {
      await axios.delete(`/admin/${adminId}`);
      setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
      console.log("Administrateur supprimé !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <Shield className="inline-block w-8 h-8 mr-3 text-gray-600" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600">
            Gérez les utilisateurs de la plateforme Tamkeen
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors duration-200">
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un admin
        </button>
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
                placeholder="Rechercher par nom d'utilisateur, email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterRole}
              onChange={(e) =>
                setFilterRole(e.target.value as "all" | "Administrateur" | "Consultant")
              }>
              <option value="all">Tous les rôles</option>
              <option value="Administrateur">Administrateur</option>
              <option value="Consultant">Consultant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
     <AdminStats admins={admins} />

<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800">
      Liste des administrateurs ({filteredAdmins.length})
    </h3>
  </div>
  <AdminTable
    filteredAdmins={filteredAdmins}
    onEdit={(admin) => {
      setSelectedAdmin(admin);
      setEditingAdminId(admin._id);
      setIsEditModalOpen(true);
    }}
    onDelete={handleDeleteAdmin}
  />
</div>

      {/* Add Admin Modal */}
        <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newAdmin={newAdmin}
        setNewAdmin={setNewAdmin}
        onSubmit={handleAddAdmin}
      />
      {/* Edit Admin Modal */}
      <EditAdminModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedAdmin(null); }}
        selectedAdmin={selectedAdmin}
        setSelectedAdmin={setSelectedAdmin}
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedAdmin && editingAdminId) {
            updateAdmin(selectedAdmin, editingAdminId);
          }
        }}
      />
    </div>
  );
};

export default AdminsGestion;