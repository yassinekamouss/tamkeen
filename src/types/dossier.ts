export type RequirementStatus = "PENDING" | "UPLOADED";

export interface UploadedDocument {
  id: number;
  dossier_id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  uploader_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRequirement {
  id: number;
  dossier_id: number;
  label: string;
  is_required: boolean;
  status: RequirementStatus;
  uploaded_document_id?: number | null;
  uploadedDocument?: UploadedDocument | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetRequirementsResponse {
  success: boolean;
  data: {
    dossierId: number;
    requirements: DocumentRequirement[];
  };
}

export interface UploadDocumentResponse {
  success: boolean;
  message?: string;
  data?: {
    document: UploadedDocument;
    requirement?: DocumentRequirement | null;
  };
}

export interface SubmitInputsResponse {
  success: boolean;
  message?: string;
  data?: {
    dossier: {
      id: number;
      client_id: number;
      status: string;
      current_step_progress: number;
      [key: string]: any;
    };
  };
}
