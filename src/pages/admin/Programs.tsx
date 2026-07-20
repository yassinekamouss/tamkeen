// src/pages/admin/Programs.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Target, Plus, AlertCircle, FileX } from "lucide-react";
import { ADMIN_FRONT_PREFIX } from "../../api/axios";
import PublishProgamModal from "../../components/admin/programs/PublishProgramModal";
import ProgramDetailsModal from "../../components/admin/programs/ProgramDetailsModal";
import { usePrograms } from "../../hooks/admin/usePrograms";
import {
  ProgramCard,
  ProgramFilters,
  ProgramStats,
} from "../../components/admin/programs";

const Programs: React.FC = () => {
  const navigate = useNavigate();
  const {
    programs,
    filteredPrograms,
    loading,
    error,
    searchTerm,
    remainingDays,
    filterDate,
    showPublishModal,
    publishingProgram,
    showDetailsModal,
    selectedProgram,
    isAdministrator,
    setSearchTerm,
    setRemainingDays,
    setFilterDate,
    setShowPublishModal,
    setPublishingProgram,
    setShowDetailsModal,
    setSelectedProgram,
    handleDelete,
    toggleActive,
    handlePublish,
    handlePublishSubmit,
    handleViewDetails,
  } = usePrograms();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleEdit = (program: any) => {
    navigate(`${ADMIN_FRONT_PREFIX}/programs/${program._id}/edit`);
  };

  const handleClearFilters = () => {
    setRemainingDays(null);
    setFilterDate("");
  };

  const activeCount = programs.filter((p) => p.isActive).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <Target className="w-8 h-8 mr-3 text-gray-600" />
              Gestion des Programmes
            </h1>
            <p className="text-gray-600">
              Configurez les programmes de subvention et leurs critères
              d'éligibilité
            </p>
          </div>
          {isAdministrator && (
            <button
              onClick={() => navigate(`${ADMIN_FRONT_PREFIX}/programs/new`)}
              className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Programme
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <ProgramFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        remainingDays={remainingDays}
        onRemainingDaysChange={setRemainingDays}
        filterDate={filterDate}
        onFilterDateChange={setFilterDate}
        onClearFilters={handleClearFilters}
      />

      {/* Statistics */}
      <ProgramStats
        totalCount={programs.length}
        activeCount={activeCount}
        filteredCount={filteredPrograms.length}
      />
      <br />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filteredPrograms.map((program) => (
          <ProgramCard
            key={program._id}
            program={program}
            isAdministrator={isAdministrator}
            onEdit={handleEdit}
            onPublish={handlePublish}
            onDelete={handleDelete}
            onToggleActive={toggleActive}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredPrograms.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun programme trouvé
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || remainingDays !== null || filterDate
              ? "Aucun programme ne correspond à vos critères de recherche."
              : "Commencez par créer votre premier programme."}
          </p>
          {!searchTerm && remainingDays === null && !filterDate && (
            <button
              onClick={() => navigate(`${ADMIN_FRONT_PREFIX}/programs/new`)}
              className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Créer un programme
            </button>
          )}
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishProgamModal
          show={showPublishModal}
          onClose={() => {
            setShowPublishModal(false);
            setPublishingProgram(null);
          }}
          program={publishingProgram}
          onSubmit={handlePublishSubmit}
        />
      )}

      {/* Details Modal */}
      <ProgramDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedProgram(null);
        }}
        program={selectedProgram}
      />
    </div>
  );
};

export default Programs;
