import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users as UsersIcon, AlertCircle } from "lucide-react";
import { ADMIN_FRONT_PREFIX } from "../../api/axios";
import Pagination from "../../components/Pagination";
import { useUsers } from "../../hooks/admin/useUsers";
import type { User } from "../../hooks/admin/useUsers";
import {
  UsersSearchBar,
  UsersStats,
  UsersTable,
  UserEditModal,
} from "../../components/admin/users";

const Users: React.FC = () => {
  const navigate = useNavigate();
  const {
    adminProfile,
    admins,
    loading,
    error,
    searchTerm,
    filterType,
    currentPage,
    totalPages,
    currentUsers,
    filteredUsers,
    updateUser,
    handleConsultantChange,
    handleStatusChange,
    setSearchTerm,
    setFilterType,
    setCurrentPage,
  } = useUsers();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (userId: string) => {
    navigate(`${ADMIN_FRONT_PREFIX}/user/details/${userId}`);
  };

  const physiqueCount = filteredUsers.filter((u) => u.applicantType === "physique").length;
  const moraleCount = filteredUsers.filter((u) => u.applicantType === "morale").length;

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
      <UsersSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
      />

      {/* Statistics */}
      <UsersStats
        totalCount={filteredUsers.length}
        physiqueCount={physiqueCount}
        moraleCount={moraleCount}
      />

      {/* Users Table */}
      <UsersTable
        users={currentUsers}
        admins={admins}
        adminProfile={adminProfile}
        onConsultantChange={handleConsultantChange}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Edit User Modal */}
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSave={updateUser}
      />
    </div>
  );
};

export default Users;
