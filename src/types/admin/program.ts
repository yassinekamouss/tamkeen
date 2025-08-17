export interface Program {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  DateDebut: string;
  DateFin: string;
  link: string;
  hero?: {
    isHero: boolean;
    image: string;
    titleFr: string;
    titleAr: string;
    subtitleFr: string;
    subtitleAr: string;
    descriptionFr: string;
    descriptionAr: string;
  };
  criteres: {
    secteurActivite: string[];
    statutJuridique: string[];
    applicantType: string[];
    montantInvestissement: string[];
    chiffreAffaireParSecteur?: {
      secteur: string;
      min: number | null;
      max: number | null;
    }[];
    age?: {
      minAge: number | null;
      maxAge: number | null;
    };
    sexe?: string[];
    chiffreAffaire: {
      chiffreAffaireMin: number | null;
      chiffreAffaireMax: number | null;
    };
    anneeCreation: (string | number)[];
    region: string[];
  };
}

export interface ProgramFormData {
  name: string;
  description: string;
  isActive: boolean;
  DateDebut: string;
  DateFin: string;
  link?: string;
  criteres: {
    secteurActivite: string[];
    statutJuridique: string[];
    applicantType: string[];
    montantInvestissement: string[];
    chiffreAffaireParSecteur: {
      secteur: string;
      min: number | null;
      max: number | null;
    }[];
    age: {
      minAge: number | null;
      maxAge: number | null;
    };
    sexe: string[];
    chiffreAffaire: {
      chiffreAffaireMin: number | null;
      chiffreAffaireMax: number | null;
    };
    anneeCreation: (string | number)[];
    region: string[];
  };
}
