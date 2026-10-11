import type { TestElegibiliteData, User } from "../../../types/auth";
import type { StepperFormValues } from "./useStepperMath";
import {
  getProvincesForRegion,
} from "./tpmeReferentiels";

export const DEFAULT_FORM_VALUES: StepperFormValues = {
  // Étape 1 : Localisation
  region_id: "Casablanca-Settat",
  province_id: "Casablanca",
  adresse_projet: "",
  gps_coordinates: "",
  regime_foncier: "ACQUISITION",
  titre_foncier: "",

  // Étape 2 : Ambition & Métier
  nature_projet: "CREATION",
  secteur_activite: "MANUF",
  branche_activite: "MANUF-19",
  emplois_directs: 5,
  is_activite_prioritaire: true,
  banque_partenaire: "CDM",

  // Étape 3 : CAPEX
  capex_etudes: 100000,
  capex_foncier: 0,
  capex_immeuble: 500000,
  capex_amenagement: 400000,
  capex_materiel: 1000000,
  capex_divers: 0,
  mode_financement: "100_FONDS_PROPRES",
  part_fonds_propres: 100,

  // Étape 4 : Hypothèses Financières & RH
  annee_demarrage: 2026,
  ca_cible_croisiere: 4000000,
  profil_montee_charge: "STANDARD",
  ratio_cogs: 25,
  code_profil_rh: "OPERATEUR",
  salaire_moyen_brut: 4500,
  part_export: 0,
  dette_taux: 6.5,
  dette_duree: 7,
};

// Table de correspondance exacte entre SECTEURS_TRAVAIL du test et référentiel TPME
export const SECTEUR_TRAVAIL_TO_TPME: Record<
  string,
  { secteur: string; branche: string; isPrioritaire?: boolean }
> = {
  // 1. Industrie manufacturière & transformation (MANUF)
  FabricationMeubles: { secteur: "MANUF", branche: "MANUF-19", isPrioritaire: true },
  IndustrieAutomobile: { secteur: "MANUF", branche: "MANUF-18", isPrioritaire: true },
  IndustrieAlimentaire: { secteur: "MANUF", branche: "MANUF-1", isPrioritaire: true },
  IndustrieBoissons: { secteur: "MANUF", branche: "MANUF-2", isPrioritaire: true },
  IndustrieTextile: { secteur: "MANUF", branche: "MANUF-3", isPrioritaire: true },
  IndustrieHabillement: { secteur: "MANUF", branche: "MANUF-4", isPrioritaire: true },
  IndustrieCuirChaussure: { secteur: "MANUF", branche: "MANUF-5", isPrioritaire: true },
  MenuiserieBois: { secteur: "MANUF", branche: "MANUF-6", isPrioritaire: true },
  PapierCarton: { secteur: "MANUF", branche: "MANUF-7", isPrioritaire: true },
  ImpressionReproduction: { secteur: "MANUF", branche: "MANUF-8", isPrioritaire: true },
  IndustrieChimique: { secteur: "MANUF", branche: "MANUF-9", isPrioritaire: true },
  IndustriePharmaceutique: { secteur: "MANUF", branche: "MANUF-10", isPrioritaire: true },
  DispositifsMedicaux: { secteur: "MANUF", branche: "MANUF-10", isPrioritaire: true },
  CaoutchoucPlastique: { secteur: "MANUF", branche: "MANUF-11", isPrioritaire: true },
  ProduitsNonMetalliques: { secteur: "MANUF", branche: "MANUF-12", isPrioritaire: true },
  ProduitsMetalliques: { secteur: "MANUF", branche: "MANUF-14", isPrioritaire: true },
  EquipementsElectroniques: { secteur: "MANUF", branche: "MANUF-15", isPrioritaire: true },
  MaterielsElectriques: { secteur: "MANUF", branche: "MANUF-16", isPrioritaire: true },
  MachinesNonClassés: { secteur: "MANUF", branche: "MANUF-17", isPrioritaire: true },
  AutresTransports: { secteur: "MANUF", branche: "MANUF-18", isPrioritaire: true },
  IndustriesTransformation: { secteur: "MANUF", branche: "MANUF-20", isPrioritaire: true },
  AutresIndustriesTransformation: { secteur: "MANUF", branche: "MANUF-20", isPrioritaire: true },
  ReparationMachines: { secteur: "MANUF", branche: "MANUF-20", isPrioritaire: false },
  EnergiesRenouvelables: { secteur: "MANUF", branche: "MANUF-21", isPrioritaire: true },
  ElectriciteRenouvelable: { secteur: "MANUF", branche: "MANUF-21", isPrioritaire: true },

  // 2. Agriculture & Pêche (AGRI)
  EconomieRurale: { secteur: "AGRI", branche: "AGRI-1", isPrioritaire: true },
  ExploitationForestiere: { secteur: "AGRI", branche: "AGRI-1", isPrioritaire: true },
  PecheMaritime: { secteur: "AGRI", branche: "AGRI-1", isPrioritaire: true },
  PecheCotiere: { secteur: "AGRI", branche: "AGRI-1", isPrioritaire: true },
  AquacultureMarine: { secteur: "AGRI", branche: "AGRI-1", isPrioritaire: true },
  AquacultureEauDouce: { secteur: "AGRI", branche: "AGRI-2", isPrioritaire: true },
  ValorisationProduitsAquatiques: { secteur: "AGRI", branche: "AGRI-3", isPrioritaire: true },

  // 3. Extractif (EXTRAC)
  IndustriesExtractives: { secteur: "EXTRAC", branche: "EXTRAC-1", isPrioritaire: false },
  ExtractionMinerais: { secteur: "EXTRAC", branche: "EXTRAC-1", isPrioritaire: false },
  SoutienExtractives: { secteur: "EXTRAC", branche: "EXTRAC-2", isPrioritaire: false },
  ValorisationMineraux: { secteur: "EXTRAC", branche: "EXTRAC-3", isPrioritaire: false },

  // 4. Énergie & Environnement (ELEC & EAU)
  EnergieElectriciteGaz: { secteur: "ELEC", branche: "ELEC-1", isPrioritaire: false },
  EfficaciteEnergetique: { secteur: "ELEC", branche: "ELEC-1", isPrioritaire: false },
  EauAssainissementDechets: { secteur: "EAU", branche: "EAU-1", isPrioritaire: true },
  DechetsDangereux: { secteur: "EAU", branche: "EAU-1", isPrioritaire: true },
  DechetsNonDangereux: { secteur: "EAU", branche: "EAU-1", isPrioritaire: true },
  Depollution: { secteur: "EAU", branche: "EAU-1", isPrioritaire: true },

  // 5. Transport & Logistique (TRANS)
  TransportLogistique: { secteur: "TRANS", branche: "TRANS-1", isPrioritaire: true },
  StockageTransport: { secteur: "TRANS", branche: "TRANS-1", isPrioritaire: true },
  ServicesPostaux: { secteur: "TRANS", branche: "TRANS-1", isPrioritaire: true },

  // 6. Tourisme, Hôtellerie & Restauration (HOTEL)
  HebergementRestauration: { secteur: "HOTEL", branche: "HOTEL-1", isPrioritaire: true },
  HebergementTouristique: { secteur: "HOTEL", branche: "HOTEL-1", isPrioritaire: true },
  RestaurantsTouristiques: { secteur: "HOTEL", branche: "HOTEL-2", isPrioritaire: true },
  ActiviteTouristique: { secteur: "HOTEL", branche: "HOTEL-1", isPrioritaire: true },

  // 7. Artisanat (ARTIS)
  Artisanat: { secteur: "ARTIS", branche: "ARTIS-1", isPrioritaire: true },

  // 8. Numérique, Télécom & Médias (INFO)
  Informatique: { secteur: "INFO", branche: "INFO-1", isPrioritaire: true },
  SolutionsDigitalesNTIC: { secteur: "INFO", branche: "INFO-1", isPrioritaire: true },
  ServicesInfo: { secteur: "INFO", branche: "INFO-1", isPrioritaire: true },
  Telecom: { secteur: "INFO", branche: "INFO-1", isPrioritaire: true },
  ProductionAudiovisuelle: { secteur: "INFO", branche: "INFO-1", isPrioritaire: true },
  MediasCommunication: { secteur: "INFO", branche: "INFO-1", isPrioritaire: true },
  Diffusion: { secteur: "INFO", branche: "INFO-1", isPrioritaire: true },

  // 9. Scientifique & Technique (SCIENT)
  ActivitesScientifiquesTechniques: { secteur: "SCIENT", branche: "SCIENT-1", isPrioritaire: false },
  RechercheInnovation: { secteur: "SCIENT", branche: "SCIENT-1", isPrioritaire: false },
  ControleTechnique: { secteur: "SCIENT", branche: "SCIENT-1", isPrioritaire: false },
  ServicesTechniquesIndustrie: { secteur: "SCIENT", branche: "SCIENT-1", isPrioritaire: false },
  SoutienIndustriel: { secteur: "SCIENT", branche: "SCIENT-1", isPrioritaire: false },

  // 10. Éducation & Formation (EDU)
  Education: { secteur: "EDU", branche: "EDU-1", isPrioritaire: true },
  FormationPro: { secteur: "EDU", branche: "EDU-1", isPrioritaire: true },

  // 11. Santé (SANTE)
  SanteActionSociale: { secteur: "SANTE", branche: "SANTE-1", isPrioritaire: true },
  Sante: { secteur: "SANTE", branche: "SANTE-1", isPrioritaire: true },

  // 12. Arts & Culture (ARTS)
  ArtsDivertissementSpectacles: { secteur: "ARTS", branche: "ARTS-1", isPrioritaire: true },
  ActivitesArtCulture: { secteur: "ARTS", branche: "ARTS-1", isPrioritaire: true },
  IndustriesCreativesCulturelles: { secteur: "ARTS", branche: "ARTS-1", isPrioritaire: true },
  CreationArtistique: { secteur: "ARTS", branche: "ARTS-1", isPrioritaire: true },
  ActivitesRecreatives: { secteur: "ARTS", branche: "ARTS-2", isPrioritaire: true },
  ActivitesSport: { secteur: "ARTS", branche: "ARTS-2", isPrioritaire: true },

  // 13. Autres Services (AUTRES)
  AutresServices: { secteur: "AUTRES", branche: "AUTRES-1", isPrioritaire: false },
  ServicesPersonnes: { secteur: "AUTRES", branche: "AUTRES-1", isPrioritaire: false },
  ServicesEntreprises: { secteur: "AUTRES", branche: "AUTRES-1", isPrioritaire: false },
  CommerceTraditionnelEcommerce: { secteur: "AUTRES", branche: "AUTRES-1", isPrioritaire: false },
};

export function parseEmployeesFromTest(numberOfEmployees?: string): number {
  if (!numberOfEmployees) return 5;
  if (numberOfEmployees.includes("1 et 3")) return 3;
  if (numberOfEmployees.includes("4 et 5")) return 5;
  if (numberOfEmployees.includes("5 et 10")) return 8;
  if (numberOfEmployees.includes("plus de 10")) return 12;
  const parsed = parseInt(numberOfEmployees, 10);
  return isNaN(parsed) || parsed < 1 ? 5 : parsed;
}

export function parseCapexFromTest(montantInvestissement?: string): {
  capex_materiel: number;
  capex_amenagement: number;
  capex_immeuble: number;
  capex_etudes: number;
  capex_divers: number;
} {
  switch (montantInvestissement) {
    case "moins-1M":
      return {
        capex_materiel: 500000,
        capex_amenagement: 200000,
        capex_immeuble: 0,
        capex_etudes: 50000,
        capex_divers: 50000,
      };
    case "1M-10M":
      return {
        capex_materiel: 1800000,
        capex_amenagement: 350000,
        capex_immeuble: 750000,
        capex_etudes: 100000,
        capex_divers: 0,
      };
    case "10M-20M":
      return {
        capex_materiel: 8000000,
        capex_amenagement: 2000000,
        capex_immeuble: 4000000,
        capex_etudes: 500000,
        capex_divers: 500000,
      };
    case "20M-30M":
      return {
        capex_materiel: 14000000,
        capex_amenagement: 3000000,
        capex_immeuble: 7000000,
        capex_etudes: 500000,
        capex_divers: 500000,
      };
    case "30M-50M":
      return {
        capex_materiel: 22000000,
        capex_amenagement: 5000000,
        capex_immeuble: 11000000,
        capex_etudes: 1000000,
        capex_divers: 1000000,
      };
    case "plus-50M":
      return {
        capex_materiel: 30000000,
        capex_amenagement: 7000000,
        capex_immeuble: 15000000,
        capex_etudes: 1500000,
        capex_divers: 1500000,
      };
    default:
      return {
        capex_materiel: 1200000,
        capex_amenagement: 250000,
        capex_immeuble: 450000,
        capex_etudes: 100000,
        capex_divers: 0,
      };
  }
}

export function parseCaFromTest(
  chiffreAffaires?: Record<string, any>,
  capexTotal: number = 3000000
): number {
  if (chiffreAffaires && typeof chiffreAffaires === "object") {
    const rawVal =
      chiffreAffaires.chiffreAffaire2024 ||
      chiffreAffaires.chiffreAffaire2023 ||
      chiffreAffaires.chiffreAffaire2022 ||
      Object.values(chiffreAffaires)[0];

    const num = parseFloat(String(rawVal || "").replace(/\s/g, ""));
    if (!isNaN(num) && num > 0) {
      return Math.round(num * 1.2);
    }
  }
  return Math.round(capexTotal * 1.5);
}

export function parseNatureProjet(anneeCreation?: string): "CREATION" | "EXTENSION" {
  if (!anneeCreation) return "CREATION";
  if (anneeCreation === "2025" || anneeCreation === "en-cours-creation") {
    return "CREATION";
  }
  return "EXTENSION";
}

export function getDefaultProvinceForRegion(regionId: string): string {
  const provinces = getProvincesForRegion(regionId);
  return provinces.length > 0 ? provinces[0].id : "";
}

export function buildFormValuesFromTest(
  test?: TestElegibiliteData | null,
  user?: User | null
): StepperFormValues {
  if (!test) {
    return { ...DEFAULT_FORM_VALUES };
  }

  const region_id = test.region || "Casablanca-Settat";
  const province_id = getDefaultProvinceForRegion(region_id);
  const nature_projet = parseNatureProjet(test.anneeCreation);

  const sectorMapping =
    (test.secteurTravail && SECTEUR_TRAVAIL_TO_TPME[test.secteurTravail]) || {
      secteur: "MANUF",
      branche: "MANUF-19",
      isPrioritaire: true,
    };

  const emplois_directs = parseEmployeesFromTest(test.numberOfEmployees);
  const capex = parseCapexFromTest(test.montantInvestissement);
  const totalCapex =
    capex.capex_etudes +
    capex.capex_immeuble +
    capex.capex_amenagement +
    capex.capex_materiel +
    capex.capex_divers;

  const ca_cible_croisiere = parseCaFromTest(test.chiffreAffaires, totalCapex);

  return {
    ...DEFAULT_FORM_VALUES,
    region_id,
    province_id,
    nature_projet,
    secteur_activite: sectorMapping.secteur,
    branche_activite: sectorMapping.branche,
    is_activite_prioritaire: !!sectorMapping.isPrioritaire,
    emplois_directs,
    capex_etudes: capex.capex_etudes,
    capex_foncier: 0,
    capex_immeuble: capex.capex_immeuble,
    capex_amenagement: capex.capex_amenagement,
    capex_materiel: capex.capex_materiel,
    capex_divers: capex.capex_divers,
    ca_cible_croisiere,
    annee_demarrage: 2026,
  };
}
