export interface FormData {
  applicantType: "physique" | "morale" | "";
  // Personne physique
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  secteurTravail?: string;
  statutJuridiquePhysique?: string;
  anneeCreation?: string;
  // Personne morale
  nomEntreprise?: string;
  secteurActivite?: string;
  // Commun
  region?: string;
  chiffreAffaire2024?: string;
  chiffreAffaire2023?: string;
  chiffreAffaire2022?: string;
  montantInvestissement: string;
  acceptPrivacyPolicy: boolean;
  statutJuridique: string;
}

export interface FormErrors {
  applicantType?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  secteurTravail?: string;
  region?: string;
  statutJuridiquePhysique?: string;
  nomEntreprise?: string;
  secteurActivite?: string;
  anneeCreation?: string;
  chiffreAffaire2024?: string;
  chiffreAffaire2023?: string;
  chiffreAffaire2022?: string;
  montantInvestissement?: string;
  acceptPrivacyPolicy?: string;
  statutJuridique?: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  program?: string;
}

export interface EligibilityFormProps {
  onNavigateBack?: () => void;
}
