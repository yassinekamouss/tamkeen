export type UserRole = "CLIENT" | "CONSULTANT" | "ADMIN";
export type ApplicantType = "physique" | "morale";

export interface User {
  id: number;
  email: string;
  role: UserRole;
  nom?: string;
  prenom?: string;
  nomEntreprise?: string;
  applicantType?: ApplicantType;
  telephones?: string[];
  age?: number;
  sexe?: string;
  isActive: boolean;
  registrationToken?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type DossierStatus =
  | "PLAN_SELECTION"
  | "AWAITING_INPUTS"
  | "AI_DRAFTING"
  | "CONSULTANT_REVIEW"
  | "AWAITING_CLIENT_INFO"
  | "DELIVERED"
  | "IN_PROGRESS"
  | "CLIENT_APPROVAL_PENDING"
  | "EXTERNAL_PROCESS";

export type PlanType = "PLAN_1" | "PLAN_2";

export interface Dossier {
  id: number;
  client_id: number;
  consultant_id?: number | null;
  test_id?: number | null;
  plan_type: PlanType;
  status: DossierStatus;
  current_step_progress: number;
  documents?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TestElegibiliteData {
  id: number;
  client_id: number;
  secteurTravail: string;
  branche?: string;
  region: string;
  statutJuridique: string;
  anneeCreation?: string;
  chiffreAffaires?: Record<string, any>;
  montantInvestissement?: string;
  programmesEligibles?: string[];
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user: User;
  client?: User; // alias for backwards compatibility
  tests?: TestElegibiliteData[];
  dossiers?: Dossier[];
}
