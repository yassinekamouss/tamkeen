import api, { ADMIN_API_PREFIX } from "../api/axios";
import {
  DossierDetail,
  CreateConsultantRequestPayload,
  ConsultantRequestItem,
} from "../types/adminDossier";

export const adminDossierService = {
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
    return response.data?.data?.request || response.data?.data;
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
