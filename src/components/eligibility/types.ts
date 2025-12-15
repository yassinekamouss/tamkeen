export interface FormData {
  applicantType: "physique" | "morale" | "";
  // Personne physique
  nom?: string;
  prenom?: string;
  age?: number;
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
