import api from "../api/axios";
import type {
  DocumentRequirement,
  GetRequirementsResponse,
  UploadDocumentResponse,
  SubmitInputsResponse,
} from "../types/dossier";

export const dossierService = {
  getRequirements: async (dossierId: number): Promise<DocumentRequirement[]> => {
    const response = await api.get<GetRequirementsResponse>(
      `/dossiers/${dossierId}/requirements`
    );

    const payload = response.data?.data;
    
    // Extraction sécurisée si payload est directement le tableau
    if (Array.isArray(payload)) {
      return payload;
    }

    // Extraction sécurisée si payload contient la propriété requirements (ex: { dossierId, requirements: [...] })
    if (payload && Array.isArray((payload as any).requirements)) {
      return (payload as any).requirements;
    }

    // Fallback si response.data contient directement la propriété requirements
    if (response.data && Array.isArray((response.data as any).requirements)) {
      return (response.data as any).requirements;
    }

    // Fallback si response.data est lui-même un tableau
    if (Array.isArray(response.data)) {
      return response.data as unknown as DocumentRequirement[];
    }

    return [];
  },

  uploadDocument: async (
    dossierId: number,
    file: File,
    requirementId?: number,
    customLabel?: string
  ): Promise<UploadDocumentResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    if (requirementId) {
      formData.append("requirement_id", String(requirementId));
    }
    if (customLabel) {
      formData.append("custom_label", customLabel);
    }

    const response = await api.post<UploadDocumentResponse>(
      `/dossiers/${dossierId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  submitInputs: async (dossierId: number): Promise<SubmitInputsResponse> => {
    const response = await api.post<SubmitInputsResponse>(
      `/dossiers/${dossierId}/submit-inputs`
    );
    return response.data;
  },
};
