import api, { ADMIN_API_PREFIX } from "../api/axios";
import type {
  DossierDetail,
  CreateConsultantRequestPayload,
  ConsultantRequestItem,
} from "../types/adminDossier";

export const adminDossierService = {
  // Liste des dossiers
  getDossiers: async (params?: { plan_type?: string; status?: string }): Promise<any[]> => {
    const response = await api.get(`${ADMIN_API_PREFIX}/dossiers`, { params });
    return response.data?.data || response.data;
  },

  // 1. Vue 360° du dossier
  getDossierDetails: async (dossierId: number): Promise<DossierDetail> => {
    const response = await api.get(`${ADMIN_API_PREFIX}/dossiers/${dossierId}`);
    return response.data?.data || response.data;
  },

  // 2. Rendu HTML Handlebars (Directive 1 Backend : { success: true, data: { htmlContent } })
  getReportHtml: async (dossierId: number): Promise<string> => {
    const response = await api.get(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/render-report`
    );
    return response.data?.data?.htmlContent || response.data?.htmlContent || "";
  },

  // Génération du PDF
  generatePdf: async (dossierId: number): Promise<any> => {
    const response = await api.post(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/generate-pdf`
    );
    return response.data;
  },

  // 3. Édition manuelle du JSON structuré par le consultant
  updateDossierData: async (
    dossierId: number,
    extractedJson: Record<string, any>
  ): Promise<any> => {
    const response = await api.put(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/data`,
      { extracted_json: extractedJson }
    );
    return response.data;
  },

  // 4. Créer une demande complémentaire (Plan 2)
  createConsultantRequest: async (
    dossierId: number,
    payload: CreateConsultantRequestPayload
  ): Promise<ConsultantRequestItem> => {
    const response = await api.post(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/requests`,
      payload
    );
    return response.data?.request || response.data?.data?.request || response.data?.data;
  },

  replyToRequest: async (
    dossierId: number,
    requestId: number,
    message: string,
    file: File | null
  ): Promise<any> => {
    const formData = new FormData();
    if (message) formData.append("message", message);
    if (file) formData.append("file", file);

    const response = await api.post(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/requests/${requestId}/reply`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  resolveRequest: async (
    dossierId: number,
    requestId: number
  ): Promise<any> => {
    const response = await api.put(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/requests/${requestId}/resolve`
    );
    return response.data;
  },

  // 5. Renvoyer au client (AWAITING_CLIENT_INFO)
  returnToClient: async (dossierId: number): Promise<any> => {
    const response = await api.post(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/return-to-client`
    );
    return response.data;
  },

  // 6. Validation définitive et livraison du rapport (DELIVERED)
  validateDossier: async (dossierId: number): Promise<any> => {
    const response = await api.post(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/validate`
    );
    return response.data;
  },
};
