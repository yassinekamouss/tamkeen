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
  createdAt?: string;
}
