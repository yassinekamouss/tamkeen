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

  // Liste des consultants : table admins, role = "Consultant"
  getConsultants: async (): Promise<any[]> => {
    const response = await api.get(`${ADMIN_API_PREFIX}`);
    return response.data || [];
  },

  assignConsultant: async (dossierId: number, consultantId: number | null): Promise<any> => {
    const response = await api.put(`${ADMIN_API_PREFIX}/dossiers/${dossierId}/assign`, {
      consultant_id: consultantId
    });
    return response.data;
  },

  // 1. Vue 360° du dossier
  getDossierDetails: async (dossierId: number): Promise<DossierDetail> => {
    const response = await api.get(`${ADMIN_API_PREFIX}/dossiers/${dossierId}`);
    return response.data?.data || response.data;
  },

  // 2. Rendu HTML Handlebars (Directive 1 Backend : { success: true, data: { htmlContent } })
  getReportHtml: async (dossierId: number): Promise<string> => {
    try {
      const response = await api.get(
        `${ADMIN_API_PREFIX}/dossiers/${dossierId}/render-report`
      );
      return response.data?.data?.htmlContent || response.data?.htmlContent || "";
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        return "";
      }
      throw err;
    }
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

  // 7. Recalcul dynamique des projections financières
  recalculateFinancials: async (
    dossierId: number,
    overrides?: Record<string, any>
  ): Promise<any> => {
    const response = await api.put(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/recalculate`,
      overrides || {}
    );
    return response.data;
  },

  // 8. Relancer la génération PDF (statut GENERATION_FAILED)
  retryPdf: async (dossierId: number): Promise<any> => {
    const response = await api.post(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/retry-pdf`
    );
    return response.data;
  },

  // 9. Expédition rapide 1-clic pour Plan 1
  fastTrackDeliver: async (dossierId: number): Promise<any> => {
    const response = await api.post(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/fast-track-deliver`
    );
    return response.data;
  },

  // 10. Édition ou complétion des paramètres Stepper par le consultant (Plan 2 & 3)
  consultantSaveStepper: async (
    dossierId: number,
    payload: {
      stepperData: Record<string, any>;
      autoAdvance?: boolean;
      triggerMlops?: boolean;
      referencedFiles?: Record<string, any>;
      files?: {
        file_fiscale?: File | null;
        file_rc?: File | null;
        file_cnss?: File | null;
      };
    } | FormData
  ): Promise<any> => {
    let body: any = payload;
    let headers: Record<string, string> = {};

    if (!(payload instanceof FormData)) {
      const formData = new FormData();
      formData.append("stepperData", JSON.stringify(payload.stepperData || {}));
      formData.append("autoAdvance", String(payload.autoAdvance || false));
      formData.append("triggerMlops", String(payload.triggerMlops || false));
      if (payload.referencedFiles) {
        formData.append("referencedFiles", JSON.stringify(payload.referencedFiles));
      }
      if (payload.files?.file_fiscale) {
        formData.append("file_fiscale", payload.files.file_fiscale);
      }
      if (payload.files?.file_rc) {
        formData.append("file_rc", payload.files.file_rc);
      }
      if (payload.files?.file_cnss) {
        formData.append("file_cnss", payload.files.file_cnss);
      }
      body = formData;
      headers = { "Content-Type": "multipart/form-data" };
    } else {
      headers = { "Content-Type": "multipart/form-data" };
    }

    const response = await api.put(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/stepper-update`,
      body,
      { headers }
    );
    return response.data;
  },

  // 11. Mise à jour de la timeline de postulation (Plan 3)
  updatePostulationTimeline: async (
    dossierId: number,
    payload: { step: number; notes?: string; reference?: string; status?: string }
  ): Promise<any> => {
    const response = await api.put(
      `${ADMIN_API_PREFIX}/dossiers/${dossierId}/postulation-step`,
      payload
    );
    return response.data;
  },
};
