export interface FormData {
  applicantType: "physique" | "morale" | "";
  // Personne physique
  nom?: string;
  prenom?: string;
  age?: string;
  sexe?: string;
  email: string;
  telephone?: string;
  secteurTravail?: string;
  anneeCreation?: string;
  // Personne morale
  nomEntreprise?: string;

  // Commun
  region?: string;
  chiffreAffaire2024?: string;
  chiffreAffaire2023?: string;
  chiffreAffaire2022?: string;
  montantInvestissement: string;
  numberOfEmployees:string;
  acceptPrivacyPolicy: boolean;
  statutJuridique: string;
}

export interface FormErrors {
  applicantType?: string;
  nom?: string;
  prenom?: string;
  age?: string;
  sexe?: string;
  email?: string;
  telephone?: string;
  secteurTravail?: string;
  region?: string;
  nomEntreprise?: string;
  anneeCreation?: string;
  chiffreAffaire2024?: string;
  chiffreAffaire2023?: string;
  chiffreAffaire2022?: string;
  montantInvestissement?: string;
  numberOfEmployees?:string;
  acceptPrivacyPolicy?: string;
  statutJuridique?: string;
}

export interface bilingue {
  ar: string , fr:string ;
}

export interface programsNamesAndLinks {
  id: number;
  name: bilingue;
  link: string;
}
export interface EligibilityResult {
  isEligible: boolean;
  programs?: programsNamesAndLinks[];
  errorMessage?: string;
  testId?: string;
}


export interface EligibilityFormProps {
  onNavigateBack?: () => void;
}

// --- Agent IA Remediation Interfaces ---

export interface SuggestedAction {
  actionType: "SIMULATE" | "CONTACT_ADVISOR" | "NEW_TEST" | "VISIT_PROGRAM" | "EDIT_FORM";
  label: string;
  metadata?: {
    fieldToAdjust?: string;
    fieldsToClear?: string[];
    suggestedValue?: string;
    programLink?: string;
  };
}

export interface ClosestProgramAnalysis {
  programId: number;
  programName: string;
  matchLevel: "HIGH" | "MEDIUM" | "LOW";
  blockingCriteria: string[];
  remediationTips: string[];
}

export interface AgentAnalysis {
  closestPrograms: ClosestProgramAnalysis[];
  profileStrengths: string[];
  generalAdvice: string;
}

export interface AgentResponseData {
  agentMessage: string;
  analysis: AgentAnalysis;
  suggestedActions: SuggestedAction[];
  followUpQuestion?: string | null;
  escalate: boolean;
}

// Lightweight program reference returned by the agent API for frontend enrichment
export interface AgentProgramRef {
  id: number;
  name: bilingue | string;
  link: string;
}

export interface AgentApiResponse {
  success: boolean;
  sessionId?: string;
  turnCount?: number;
  turnsRemaining?: number;
  fallbackUsed?: boolean;
  rateLimited?: boolean;
  programs?: AgentProgramRef[];
  data: AgentResponseData;
}

