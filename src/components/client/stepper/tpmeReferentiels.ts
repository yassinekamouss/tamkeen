// ============================================================================
// RÉFÉRENTIELS OFFICIELS - VOLET 2 CHARTE TPME (REAL DATA)
// ============================================================================

export type ZoneType = "Catégorie A" | "Catégorie B" | "Hors Zone";

export interface ProvinceInfo {
  id: string;
  label: string;
  labelAr?: string;
  zone: ZoneType;
  rate: number;
}

export interface RegionInfo {
  id: string;
  label: string;
  labelAr?: string;
  provinces: ProvinceInfo[];
}

export interface SecteurInfo {
  code: string;
  label: string;
  labelAr?: string;
  isPrioritaire?: boolean;
}

export interface BrancheInfo {
  id: string;
  sectorCode: string;
  label: string;
  isPrioritaire: boolean; // Si true, éligible à la prime prioritaire de 10%
}

export interface BanqueInfo {
  code: string;
  label: string;
  labelAr?: string;
  isDefault?: boolean;
}

export interface ProfilMonteeChargeInfo {
  id: "STANDARD" | "PRUDENT" | "RAPIDE";
  label: string;
  labelAr?: string;
  description: string;
  descriptionAr?: string;
  coefficients: number[];
}

export interface ProfilRHInfo {
  code: "OPERATEUR" | "TECHNICIEN" | "CADRE" | "PERSONNALISE";
  label: string;
  labelAr?: string;
  salaireBrutMensuel: number;
  description: string;
  descriptionAr?: string;
}

export const REGIONS_ET_PROVINCES: RegionInfo[] = [
  {
    "id": "Tanger-Tétouan-Al Hoceima",
    "label": "Tanger-Tétouan-Al Hoceima",
    "labelAr": "جهة طنجة - تطوان - الحسيمة",
    "provinces": [
      {
        "id": "Tétouan",
        "label": "Tétouan",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Larache",
        "label": "Larache",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "M'diq-Fnideq",
        "label": "M'diq-Fnideq",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Ouezzane",
        "label": "Ouezzane",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Chefchaouen",
        "label": "Chefchaouen",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Al Hoceima",
        "label": "Al Hoceima",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Tanger-Assilah",
        "label": "Tanger-Assilah",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "Fahs-Anjra",
        "label": "Fahs-Anjra",
        "zone": "Hors Zone",
        "rate": 0.0
      }
    ]
  },
  {
    "id": "L'Oriental",
    "label": "L'Oriental",
    "labelAr": "جهة الشرق",
    "provinces": [
      {
        "id": "Nador",
        "label": "Nador",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Berkane",
        "label": "Berkane",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Taourirt",
        "label": "Taourirt",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Driouch",
        "label": "Driouch",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Jerada",
        "label": "Jerada",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Guercif",
        "label": "Guercif",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Oujda-Angad",
        "label": "Oujda-Angad",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Figuig",
        "label": "Figuig",
        "zone": "Catégorie B",
        "rate": 0.15
      }
    ]
  },
  {
    "id": "Fès-Meknès",
    "label": "Fès-Meknès",
    "labelAr": "جهة فاس - مكناس",
    "provinces": [
      {
        "id": "Séfrou",
        "label": "Séfrou",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Boulemane",
        "label": "Boulemane",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Taza",
        "label": "Taza",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Fès",
        "label": "Fès",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Meknès",
        "label": "Meknès",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "El Hajeb",
        "label": "El Hajeb",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Ifrane",
        "label": "Ifrane",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Moulay Yacoub",
        "label": "Moulay Yacoub",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Taounate",
        "label": "Taounate",
        "zone": "Catégorie B",
        "rate": 0.15
      }
    ]
  },
  {
    "id": "Rabat-Salé-Kénitra",
    "label": "Rabat-Salé-Kénitra",
    "labelAr": "جهة الرباط - سلا - القنيطرة",
    "provinces": [
      {
        "id": "Khémisset",
        "label": "Khémisset",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Sidi Kacem",
        "label": "Sidi Kacem",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Salé",
        "label": "Salé",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Rabat",
        "label": "Rabat",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "Skhirate-Témara",
        "label": "Skhirate-Témara",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "Kénitra",
        "label": "Kénitra",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "Sidi Slimane",
        "label": "Sidi Slimane",
        "zone": "Hors Zone",
        "rate": 0.0
      }
    ]
  },
  {
    "id": "Béni Mellal-Khénifra",
    "label": "Béni Mellal-Khénifra",
    "labelAr": "جهة بني ملال - خنيفرة",
    "provinces": [
      {
        "id": "Béni Mellal",
        "label": "Béni Mellal",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Khénifra",
        "label": "Khénifra",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Khouribga",
        "label": "Khouribga",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Fquih Ben Salah",
        "label": "Fquih Ben Salah",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Azilal",
        "label": "Azilal",
        "zone": "Catégorie B",
        "rate": 0.15
      }
    ]
  },
  {
    "id": "Casablanca-Settat",
    "label": "Casablanca-Settat",
    "labelAr": "جهة الدار البيضاء - سطات",
    "provinces": [
      {
        "id": "Sidi Bennour",
        "label": "Sidi Bennour",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Casablanca",
        "label": "Casablanca",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "Nouaceur",
        "label": "Nouaceur",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "Médiouna",
        "label": "Médiouna",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "Mohammedia",
        "label": "Mohammedia",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "Berrechid",
        "label": "Berrechid",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "Benslimane",
        "label": "Benslimane",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "Settat",
        "label": "Settat",
        "zone": "Hors Zone",
        "rate": 0.0
      },
      {
        "id": "El Jadida",
        "label": "El Jadida",
        "zone": "Hors Zone",
        "rate": 0.0
      }
    ]
  },
  {
    "id": "Marrakech-Safi",
    "label": "Marrakech-Safi",
    "labelAr": "جهة مراكش - آسفي",
    "provinces": [
      {
        "id": "Safi",
        "label": "Safi",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Youssoufia",
        "label": "Youssoufia",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Al Haouz",
        "label": "Al Haouz",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "El Kelâa des Sraghna",
        "label": "El Kelâa des Sraghna",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Essaouira",
        "label": "Essaouira",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Rehamna",
        "label": "Rehamna",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Chichaoua",
        "label": "Chichaoua",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Marrakech",
        "label": "Marrakech",
        "zone": "Hors Zone",
        "rate": 0.0
      }
    ]
  },
  {
    "id": "Drâa-Tafilalet",
    "label": "Drâa-Tafilalet",
    "labelAr": "جهة درعة - تافيلالت",
    "provinces": [
      {
        "id": "Ouarzazate",
        "label": "Ouarzazate",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Errachidia",
        "label": "Errachidia",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Midelt",
        "label": "Midelt",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Tinghir",
        "label": "Tinghir",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Zagora",
        "label": "Zagora",
        "zone": "Catégorie B",
        "rate": 0.15
      }
    ]
  },
  {
    "id": "Souss-Massa",
    "label": "Souss-Massa",
    "labelAr": "جهة سوس - ماسة",
    "provinces": [
      {
        "id": "Taroudant",
        "label": "Taroudant",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Chtouka-Aït Baha",
        "label": "Chtouka-Aït Baha",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Inezgane-Aït Melloul",
        "label": "Inezgane-Aït Melloul",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Tata",
        "label": "Tata",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Tiznit",
        "label": "Tiznit",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Agadir-Ida Ou Tanane",
        "label": "Agadir-Ida Ou Tanane",
        "zone": "Hors Zone",
        "rate": 0.0
      }
    ]
  },
  {
    "id": "Guelmim-Oued Noun",
    "label": "Guelmim-Oued Noun",
    "labelAr": "جهة كلميم - واد نون",
    "provinces": [
      {
        "id": "Sidi Ifni",
        "label": "Sidi Ifni",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Assa-Zag",
        "label": "Assa-Zag",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Guelmim",
        "label": "Guelmim",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Tan-Tan",
        "label": "Tan-Tan",
        "zone": "Catégorie B",
        "rate": 0.15
      }
    ]
  },
  {
    "id": "Laâyoune-Sakia El Hamra",
    "label": "Laâyoune-Sakia El Hamra",
    "labelAr": "جهة العيون - الساقية الحمراء",
    "provinces": [
      {
        "id": "Laâyoune",
        "label": "Laâyoune",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Boujdour",
        "label": "Boujdour",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Tarfaya",
        "label": "Tarfaya",
        "zone": "Catégorie B",
        "rate": 0.15
      },
      {
        "id": "Es-Semara",
        "label": "Es-Semara",
        "zone": "Catégorie B",
        "rate": 0.15
      }
    ]
  },
  {
    "id": "Dakhla-Oued Ed-Dahab",
    "label": "Dakhla-Oued Ed-Dahab",
    "labelAr": "جهة الداخلة - وادي الذهب",
    "provinces": [
      {
        "id": "Oued Ed-Dahab",
        "label": "Oued Ed-Dahab",
        "zone": "Catégorie A",
        "rate": 0.1
      },
      {
        "id": "Aousserd",
        "label": "Aousserd",
        "zone": "Catégorie B",
        "rate": 0.15
      }
    ]
  }
];

export const SECTEURS_ACTIVITE: SecteurInfo[] = [
  {
    "code": "AGRI",
    "label": "Agriculture, sylviculture et pêche"
  },
  {
    "code": "EXTRAC",
    "label": "Industries extractives"
  },
  {
    "code": "MANUF",
    "label": "Industrie manufacturière"
  },
  {
    "code": "ELEC",
    "label": "Production et distribution d'électricité, de gaz, de vapeur et d'air conditionné"
  },
  {
    "code": "EAU",
    "label": "Production et distribution d'eau, assainissement, gestion des déchets et dépollution"
  },
  {
    "code": "TRANS",
    "label": "Transports et entreposage"
  },
  {
    "code": "HOTEL",
    "label": "Hébergement et restauration"
  },
  {
    "code": "ARTIS",
    "label": "Artisanat"
  },
  {
    "code": "INFO",
    "label": "Information et communication"
  },
  {
    "code": "SCIENT",
    "label": "Activités spécialisées, scientifiques et techniques"
  },
  {
    "code": "EDU",
    "label": "Enseignement"
  },
  {
    "code": "SANTE",
    "label": "Santé humaine et action sociale"
  },
  {
    "code": "ARTS",
    "label": "Arts, spectacles et activités récréatives"
  },
  {
    "code": "AUTRES",
    "label": "Autres activités de service"
  }
];

export const BRANCHES_ACTIVITE: BrancheInfo[] = [
  {
    "id": "AGRI-1",
    "sectorCode": "AGRI",
    "label": "Aquaculture en mer et en zone littorale",
    "isPrioritaire": true
  },
  {
    "id": "AGRI-2",
    "sectorCode": "AGRI",
    "label": "Aquaculture en eau douce",
    "isPrioritaire": true
  },
  {
    "id": "AGRI-3",
    "sectorCode": "AGRI",
    "label": "Traitement et valorisation des produits aquacoles",
    "isPrioritaire": true
  },
  {
    "id": "EXTRAC-1",
    "sectorCode": "EXTRAC",
    "label": "Extraction de minerais métalliques",
    "isPrioritaire": false
  },
  {
    "id": "EXTRAC-2",
    "sectorCode": "EXTRAC",
    "label": "Services de soutien aux industries extractives",
    "isPrioritaire": false
  },
  {
    "id": "EXTRAC-3",
    "sectorCode": "EXTRAC",
    "label": "Valorisation et transformation des produits miniers",
    "isPrioritaire": false
  },
  {
    "id": "MANUF-1",
    "sectorCode": "MANUF",
    "label": "Industries alimentaires",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-2",
    "sectorCode": "MANUF",
    "label": "Fabrication de boissons",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-3",
    "sectorCode": "MANUF",
    "label": "Fabrication de textiles",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-4",
    "sectorCode": "MANUF",
    "label": "Industrie de l'habillement",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-5",
    "sectorCode": "MANUF",
    "label": "Industrie du cuir et de la chaussure",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-6",
    "sectorCode": "MANUF",
    "label": "Travail du bois et fabrication d'articles en bois",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-7",
    "sectorCode": "MANUF",
    "label": "Industrie du papier et du carton",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-8",
    "sectorCode": "MANUF",
    "label": "Imprimerie et reproduction d'enregistrements",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-9",
    "sectorCode": "MANUF",
    "label": "Industrie chimique",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-10",
    "sectorCode": "MANUF",
    "label": "Industrie pharmaceutique",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-11",
    "sectorCode": "MANUF",
    "label": "Fabrication de produits en caoutchouc et en plastique",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-12",
    "sectorCode": "MANUF",
    "label": "Fabrication d'autres produits minéraux non métalliques",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-13",
    "sectorCode": "MANUF",
    "label": "Métallurgie",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-14",
    "sectorCode": "MANUF",
    "label": "Fabrication de produits métalliques",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-15",
    "sectorCode": "MANUF",
    "label": "Fabrication de produits informatiques, électroniques et optiques",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-16",
    "sectorCode": "MANUF",
    "label": "Fabrication de produits et d'équipements électriques",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-17",
    "sectorCode": "MANUF",
    "label": "Fabrication de machines et équipements",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-18",
    "sectorCode": "MANUF",
    "label": "Industrie automobile",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-19",
    "sectorCode": "MANUF",
    "label": "Fabrication de meubles",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-20",
    "sectorCode": "MANUF",
    "label": "Autres industries manufacturières",
    "isPrioritaire": true
  },
  {
    "id": "MANUF-21",
    "sectorCode": "MANUF",
    "label": "Industrie des énergies renouvelables",
    "isPrioritaire": true
  },
  {
    "id": "ELEC-1",
    "sectorCode": "ELEC",
    "label": "Production d'électricité à base d'énergie renouvelable",
    "isPrioritaire": false
  },
  {
    "id": "EAU-1",
    "sectorCode": "EAU",
    "label": "Recyclage, transformation et valorisation des déchets",
    "isPrioritaire": true
  },
  {
    "id": "TRANS-1",
    "sectorCode": "TRANS",
    "label": "Entreposage et services auxiliaires des transports",
    "isPrioritaire": true
  },
  {
    "id": "HOTEL-1",
    "sectorCode": "HOTEL",
    "label": "Établissements d'hébergement touristique classés",
    "isPrioritaire": true
  },
  {
    "id": "HOTEL-2",
    "sectorCode": "HOTEL",
    "label": "Restauration touristique",
    "isPrioritaire": true
  },
  {
    "id": "ARTIS-1",
    "sectorCode": "ARTIS",
    "label": "Artisanat de production d'art et utilitaire",
    "isPrioritaire": true
  },
  {
    "id": "INFO-1",
    "sectorCode": "INFO",
    "label": "Services de l'information (Outsourcing, IA, Datacenters)",
    "isPrioritaire": true
  },
  {
    "id": "EDU-1",
    "sectorCode": "EDU",
    "label": "Formation professionnelle",
    "isPrioritaire": true
  },
  {
    "id": "ARTS-1",
    "sectorCode": "ARTS",
    "label": "Activités créatives, artistiques et de spectacle",
    "isPrioritaire": true
  },
  {
    "id": "ARTS-2",
    "sectorCode": "ARTS",
    "label": "Activités récréatives et de loisirs",
    "isPrioritaire": true
  }
];

// Multiplicateur officiel CNSS patronale
export const CNSS_MULTIPLIER = 1.2109;

// Helper: Liste des provinces d'une région
export function getProvincesForRegion(regionId: string): ProvinceInfo[] {
  if (!regionId) return [];
  const reg = REGIONS_ET_PROVINCES.find(
    (r) =>
      r.id.toLowerCase() === regionId?.toLowerCase() ||
      r.label.toLowerCase() === regionId?.toLowerCase()
  );
  return reg ? reg.provinces : [];
}

// Helper: Obtenir la zone et le taux d'une province
export function getProvinceDetails(regionId: string, provinceId: string): { zone: ZoneType; rate: number } {
  const provinces = getProvincesForRegion(regionId);
  const prov = provinces.find(
    (p) =>
      p.id.toLowerCase() === provinceId?.toLowerCase() ||
      p.label.toLowerCase() === provinceId?.toLowerCase()
  );
  if (prov) {
    return { zone: prov.zone, rate: prov.rate };
  }
  return { zone: "Hors Zone", rate: 0.0 };
}

export function getSectorDetails(sectorCode: string): SecteurInfo | undefined {
  return SECTEURS_ACTIVITE.find((s) => s.code === sectorCode);
}
export const BANQUES_PARTENAIRES: BanqueInfo[] = [
  { code: "AWB", label: "Attijariwafa bank", labelAr: "التجاري وفا بنك", isDefault: false },
  { code: "BCP", label: "Banque Populaire (BCP)", labelAr: "البنك الشعبي (BCP)", isDefault: false },
  { code: "BOA", label: "Bank of Africa (BMCE Group)", labelAr: "بنك أفريقيا (مجموعة البنك المغربي للتجارة الخارجية)", isDefault: false },
  { code: "CDM", label: "Crédit du Maroc", labelAr: "مصرف المغرب", isDefault: true },
  { code: "SGMB", label: "Société Générale Maroc", labelAr: "الشركة العامة بالمغرب", isDefault: false },
  { code: "CIH", label: "CIH Bank", labelAr: "بنك القرض العقاري والسياحي (CIH)", isDefault: false },
  { code: "BMCI", label: "BMCI (Groupe BNP Paribas)", labelAr: "البنك المغربي للتجارة والصناعة (BMCI)", isDefault: false },
  { code: "CAM", label: "Crédit Agricole du Maroc", labelAr: "القرض الفلاحي للمغرب", isDefault: false },
  { code: "CFG", label: "CFG Bank", labelAr: "بنك سي إف جي (CFG)", isDefault: false },
  { code: "AL-BARID", label: "Al Barid Bank", labelAr: "البريد بنك", isDefault: false },
  { code: "AUTRE", label: "Autre établissement / Financement propre exclusif", labelAr: "مؤسسة أخرى / تمويل ذاتي حصري", isDefault: false },
];

// ----------------------------------------------------------------------------
// 4. PROFILS DE MONTÉE EN CHARGE (FINANCE)
// ----------------------------------------------------------------------------
export const PROFILS_MONTEE_CHARGE: ProfilMonteeChargeInfo[] = [
  {
    id: "STANDARD",
    label: "Standard (Recommandé par défaut)",
    labelAr: "نمو متوازن قياسي (موصى به)",
    description: "Croissance progressive et équilibrée du chiffre d'affaires",
    descriptionAr: "تطور تدريجي ومتوازن لرقم المعاملات",
    coefficients: [20, 70, 85, 100, 100, 100],
  },
  {
    id: "PRUDENT",
    label: "Prudent (Démarrage progressif)",
    labelAr: "نمو حذر (انطلاق متأنٍ)",
    description: "Hypothèse conservatrice avec rampe de lancement allongée",
    descriptionAr: "فرضية حذرة مع وتيرة إقلاع متأنية وتدريجية",
    coefficients: [15, 50, 75, 90, 100, 100],
  },
  {
    id: "RAPIDE",
    label: "Accéléré (Marché captif / Contrats signés)",
    labelAr: "نمو سريع ومكثف (عقود مؤكدة)",
    description: "Montée en puissance rapide dès la 1ère année d'exploitation",
    descriptionAr: "إقلاع قوي ومكثف منذ السنة الأولى من الاستغلال",
    coefficients: [40, 80, 100, 100, 100, 100],
  },
];

// ----------------------------------------------------------------------------
// 5. PROFILS RH DE SALAIRES & CHARGES CNSS
// ----------------------------------------------------------------------------
export const PROFILS_RH: ProfilRHInfo[] = [
  {
    code: "OPERATEUR",
    label: "Base Opérateur / SMIG / Ouvrier",
    labelAr: "عامل مهني / مشغل / الحد الأدنى للأجور",
    salaireBrutMensuel: 4500,
    description: "Base SMIC / Salarié d'exécution (4 500 MAD / mois)",
    descriptionAr: "أجر عمال التنفيذ (4500 درهم شهرياً)",
  },
  {
    code: "TECHNICIEN",
    label: "Technicien spécialisé / Agent de maîtrise",
    labelAr: "تقني متخصص / رئيس ورشة",
    salaireBrutMensuel: 7000,
    description: "Technicien / Agent de maîtrise (7 000 MAD / mois)",
    descriptionAr: "تقني مؤهل ومؤطر (7000 درهم شهرياً)",
  },
  {
    code: "CADRE",
    label: "Ingénieur / Cadre technique / Expert",
    labelAr: "مهندس / إطار تقني / خبير",
    salaireBrutMensuel: 12000,
    description: "Ingénieur / Cadre qualifié (12 000 MAD / mois)",
    descriptionAr: "أطر عليا ومهندسون (12000 درهم شهرياً)",
  },
  {
    code: "PERSONNALISE",
    label: "Saisie manuelle du salaire brut",
    labelAr: "تحديد حر لمتوسط الراتب",
    salaireBrutMensuel: 0,
    description: "Montant personnalisé saisi librement",
    descriptionAr: "مبلغ مخصص يتم إدخاله بحرية",
  },
];

// Helper functions for dynamic UI localization
export function getRegionLabel(reg: RegionInfo, lang: string): string {
  return lang === "ar" && reg.labelAr ? reg.labelAr : reg.label;
}

export function getProvinceLabel(prov: ProvinceInfo, lang: string): string {
  return lang === "ar" && prov.labelAr ? prov.labelAr : prov.label;
}

export function getSectorLabel(sec: SecteurInfo, lang: string): string {
  return lang === "ar" && sec.labelAr ? sec.labelAr : sec.label;
}

export function getBankLabel(bank: BanqueInfo, lang: string): string {
  return lang === "ar" && bank.labelAr ? bank.labelAr : bank.label;
}

export function getProfilRampLabel(profil: ProfilMonteeChargeInfo, lang: string): string {
  return lang === "ar" && profil.labelAr ? profil.labelAr : profil.label;
}

export function getProfilRampDesc(profil: ProfilMonteeChargeInfo, lang: string): string {
  return lang === "ar" && profil.descriptionAr ? profil.descriptionAr : profil.description;
}

export function getProfilRHLabel(prh: ProfilRHInfo, lang: string): string {
  return lang === "ar" && prh.labelAr ? prh.labelAr : prh.label;
}
