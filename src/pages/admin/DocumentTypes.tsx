import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentTypeService, DocumentType } from "../../services/documentTypeService";
import { FileText, Plus, Edit2, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";

export const DocumentTypes = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<DocumentType | null>(null);
  const [formData, setFormData] = useState({ name: "", is_active: true });

  const { data: documentTypes = [], isLoading } = useQuery({
    queryKey: ["adminDocumentTypes"],
    queryFn: documentTypeService.getAllDocumentTypes,
  });

  const createMutation = useMutation({
    mutationFn: documentTypeService.createDocumentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDocumentTypes"] });
      queryClient.invalidateQueries({ queryKey: ["activeDocumentTypes"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; is_active?: boolean } }) =>
      documentTypeService.updateDocumentType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDocumentTypes"] });
      queryClient.invalidateQueries({ queryKey: ["activeDocumentTypes"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: documentTypeService.deleteDocumentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDocumentTypes"] });
      queryClient.invalidateQueries({ queryKey: ["activeDocumentTypes"] });
    },
  });

  const openModal = (docType?: DocumentType) => {
    if (docType) {
      setEditingType(docType);
      setFormData({ name: docType.name, is_active: docType.is_active });
    } else {
      setEditingType(null);
      setFormData({ name: "", is_active: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ name: "", is_active: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      updateMutation.mutate({ id: editingType.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce type de document ?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-slate-700" />
            Types de Documents
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez la liste des documents que les clients peuvent téléverser.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un type
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Nom du Document</th>
              <th className="px-6 py-4 w-32">Statut</th>
              <th className="px-6 py-4 w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documentTypes.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Aucun type de document n'a été trouvé.
                </td>
              </tr>
            ) : (
              documentTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {type.name}
                  </td>
                  <td className="px-6 py-4">
                    {type.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(type)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingType ? "Modifier le type" : "Ajouter un type"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du document
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Relevé d'identité bancaire (RIB)"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Activer ce document
                  </label>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingType ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTypes;
