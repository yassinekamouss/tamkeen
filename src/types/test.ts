export interface PersonneLite {
  _id: string;
  applicantType: "physique" | "morale";
  nom?: string;
  prenom?: string;
  nomEntreprise?: string;
  email: string;
  telephone: string;
}

export interface TestItem {
  _id: string;
  secteurTravail: string;
  region: string;
  statutJuridique?: string;
  anneeCreation: string | number;
  chiffreAffaires?: {
    chiffreAffaire2022?: number | null;
    chiffreAffaire2023?: number | null;
    chiffreAffaire2024?: number | null;
  };
  montantInvestissement?: string | number | null;
  programmesEligibles: string[];
  personne: PersonneLite;
  wannaBeContacted? : boolean;
  createdAt?: string;
}

// Socket event type sent by backend when a new form/test is created
export interface FormSubmittedEventDTO {
  id: string;
  createdAt: string;
  applicant: {
    id: string;
    type: "physique" | "morale";
    name?: string;
    email?: string;
  };
  formType: string; // 'eligibility'
  region?: string;
  eligible?: boolean;
  summary?: string;
}
