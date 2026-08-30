import api from "../api/axios";

export interface DocumentType {
  id: number;
  name: string;
  is_active: boolean;
}

export const documentTypeService = {
  getActiveDocumentTypes: async (): Promise<DocumentType[]> => {
    const response = await api.get("/document-types/active");
    return response.data.data || response.data;
  },

  getAllDocumentTypes: async (): Promise<DocumentType[]> => {
    const response = await api.get("/admin/document-types");
    return response.data.data || response.data;
  },

  createDocumentType: async (data: { name: string; is_active?: boolean }): Promise<DocumentType> => {
    const response = await api.post("/admin/document-types", data);
    return response.data.data || response.data;
  },

  updateDocumentType: async (id: number, data: { name?: string; is_active?: boolean }): Promise<DocumentType> => {
    const response = await api.put(`/admin/document-types/${id}`, data);
    return response.data.data || response.data;
  },

  deleteDocumentType: async (id: number): Promise<void> => {
    await api.delete(`/admin/document-types/${id}`);
  },
};
