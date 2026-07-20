import React from "react";
import { useNews } from "../../hooks/admin/useNews";
import { NewsForm, NewsList } from "../../components/admin/news";

const AdminNews: React.FC = () => {
  const {
    categories,
    loading,
    editingNews,
    showSuccess,
    error,
    currentPage,
    searchFilter,
    currentLang,
    formData,
    imageError,
    isDragging,
    filteredNews,
    totalPages,
    startIndex,
    paginatedNews,
    itemsPerPage,
    setCurrentPage,
    setSearchFilter,
    setCurrentLang,
    handleMultilingualChange,
    handleCategoryChange,
    handleInputChange,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    setFormData,
  } = useNews();

  const handleTogglePublished = () => {
    setFormData((prev) => ({
      ...prev,
      published: !prev.published,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Actualités (FR/AR)
          </h1>
          <p className="text-gray-600">
            Créez et gérez les actualités en français et en arabe
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            ✅ Actualité {editingNews ? "modifiée" : "créée"} avec succès !
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            ❌ {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Panel */}
          <div className="lg:col-span-1">
            <NewsForm
              formData={formData}
              categories={categories}
              currentLang={currentLang}
              editingNews={editingNews}
              loading={loading}
              isDragging={isDragging}
              imageError={imageError}
              onLangChange={setCurrentLang}
              onMultilingualChange={handleMultilingualChange}
              onInputChange={handleInputChange}
              onCategoryChange={handleCategoryChange}
              onFileChange={handleFileChange}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onTogglePublished={handleTogglePublished}
              onSubmit={handleFormSubmit}
              onCancel={resetForm}
            />
          </div>

          {/* List Panel */}
          <div className="lg:col-span-2">
            <NewsList
              searchFilter={searchFilter}
              onSearchFilterChange={(val) => {
                setSearchFilter(val);
                setCurrentPage(1);
              }}
              totalFilteredCount={filteredNews.length}
              paginatedNews={paginatedNews}
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNews;