import api from "../api/axios";
import type {
  GetRequirementsResponse,
  UploadDocumentResponse,
  SubmitInputsResponse,
} from "../types/dossier";

export const dossierService = {
  getRequirements: async (
    dossierId: number
  ): Promise<GetRequirementsResponse> => {
    const response = await api.get<GetRequirementsResponse>(
      `/dossiers/${dossierId}/requirements`
    );
    return response.data;
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
