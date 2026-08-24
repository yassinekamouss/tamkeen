export interface UserClient {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  company_name?: string;
}

export interface DocumentItem {
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

export interface DocumentRequirementItem {
  id: number;
  dossier_id: number;
  label: string;
  is_required: boolean;
  status: "PENDING" | "UPLOADED";
  uploaded_document_id?: number | null;
  uploadedDocument?: DocumentItem | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DossierDataInfo {
  id: number;
  dossier_id: number;
  extracted_json: Record<string, any>;
  is_validated_by_consultant: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RequestMessageItem {
  id: number;
  request_id: number;
  sender_type: "CLIENT" | "CONSULTANT";
  message: string | null;
  attachment_url: string | null;
  createdAt: string;
}

export interface ConsultantRequestItem {
  id: number;
  dossier_id: number;
  creator_type: "CLIENT" | "CONSULTANT";
  message: string;
  input_type: "FILE" | "TEXT";
  status: "PENDING" | "FULFILLED" | "RESOLVED";
  response_data?: any;
  messages: RequestMessageItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface DossierDetail {
  id: number;
  client_id: number;
  status: string;
  plan_type: string;
  current_step_progress: number;
  client?: UserClient;
  documents: DocumentItem[];
  requirements: DocumentRequirementItem[];
  dossierData?: DossierDataInfo | null;
  consultantRequests: ConsultantRequestItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultantRequestPayload {
  message: string;
  input_type: "FILE" | "TEXT";
}
