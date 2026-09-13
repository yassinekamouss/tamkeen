import { useMemo } from "react";
import {
  getProvinceDetails,
  getSectorDetails,
  CNSS_MULTIPLIER,
  type ZoneType,
} from "./referentiels";

export interface StepperFormValues {
  // Étape 1 : Localisation & Foncier
  region_id: string;
  province_id: string;
  adresse_projet: string;
  gps_coordinates: string;
  regime_foncier: "ACQUISITION" | "LOCATION";
  titre_foncier?: string;

  // Étape 2 : Ambition & Secteur
  nature_projet: "CREATION" | "EXTENSION";
  secteur_activite: string;
  emplois_directs: number;
  is_eco_transition: boolean;
  banque_partenaire: string;

  // Étape 3 : CAPEX & Financement
  capex_etudes: number;
  capex_foncier: number;
  capex_immeuble: number;
  capex_amenagement: number;
  capex_materiel: number;
  capex_divers: number;
  mode_financement: "100_FONDS_PROPRES" | "MIXTE";
  part_fonds_propres: number; // en % (ex: 30)

  // Étape 4 : Finance & RH
  annee_demarrage: number;
  ca_cible_croisiere: number;
  profil_montee_charge: "STANDARD" | "PRUDENT" | "RAPIDE";
  ratio_cogs: number; // en % (ex: 25)
  code_profil_rh: "OPERATEUR" | "TECHNICIEN" | "CADRE" | "PERSONNALISE";
  salaire_moyen_brut: number; // en MAD
  part_export: number; // en %
  dette_taux?: number | null; // en %
  dette_duree?: number | null; // en années
}

export interface StepperMathCalculations {
  // Primes & Taux
  zone: ZoneType;
  tauxTerritoriale: number; // ex: 0.10 ou 0.15
  tauxSectorielle: number; // ex: 0.05 ou 0
  bonusEcologique: number; // ex: 0.03 ou 0
  tauxGlobal: number; // ex: 0.18

  // CAPEX
  totalCapex: number;
  montantSubventionEstimee: number;

  // Financement
  partFondsPropresPct: number;
  partDettePct: number;
  montantFondsPropres: number;
  montantDette: number;

  // Indicateurs RH
  salaireBrutChargeMensuel: number;
  masseSalarialeAnnuelleEstimee: number;

  // Formatteurs
  formatMAD: (val: number) => string;
  formatPercent: (val: number) => string;
}

export const formatMAD = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return "0 MAD";
  return (
    new Intl.NumberFormat("fr-MA", {
      maximumFractionDigits: 0,
    }).format(Math.round(amount)) + " MAD"
  );
};

export const formatPercent = (rate: number): string => {
  if (isNaN(rate) || rate === null || rate === undefined) return "0%";
  const pct = Math.round(rate * 100);
  return `${pct}%`;
};

export function useStepperMath(formValues: StepperFormValues): StepperMathCalculations {
  return useMemo(() => {
    // 1. Taux territorial (Zone A: 10%, Zone B: 15%)
    const { zone, rate: tauxTerritoriale } = getProvinceDetails(
      formValues.region_id,
      formValues.province_id
    );

    // 2. Taux sectoriel (5% si secteur prioritaire, sinon 0%)
    const sectorInfo = getSectorDetails(formValues.secteur_activite);
    const tauxSectorielle = sectorInfo.rate;

    // 3. Bonus écologique / transition durable (3% si activé, sinon 0%)
    const bonusEcologique = formValues.is_eco_transition ? 0.03 : 0.0;

    // 4. Taux global cumulé
    const tauxGlobal = tauxTerritoriale + tauxSectorielle + bonusEcologique;

    // 5. Total CAPEX HT
    // Remarque : Si régime = LOCATION, l'acquisition de foncier n'est pas comptabilisée
    const foncierEffectif =
      formValues.regime_foncier === "LOCATION" ? 0 : Number(formValues.capex_foncier) || 0;

    const totalCapex =
      (Number(formValues.capex_etudes) || 0) +
      foncierEffectif +
      (Number(formValues.capex_immeuble) || 0) +
      (Number(formValues.capex_amenagement) || 0) +
      (Number(formValues.capex_materiel) || 0) +
      (Number(formValues.capex_divers) || 0);

    // 6. Montant estimé de subvention
    const montantSubventionEstimee = totalCapex * tauxGlobal;

    // 7. Structure de financement
    let partFondsPropresPct = 100;
    let partDettePct = 0;

    if (formValues.mode_financement === "MIXTE") {
      partFondsPropresPct = Math.min(
        100,
        Math.max(0, Number(formValues.part_fonds_propres) || 0)
      );
      partDettePct = 100 - partFondsPropresPct;
    }

    const montantFondsPropres = (totalCapex * partFondsPropresPct) / 100;
    const montantDette = (totalCapex * partDettePct) / 100;

    // 8. Indicateurs RH
    const salaireBrut = Number(formValues.salaire_moyen_brut) || 0;
    const salaireBrutChargeMensuel = salaireBrut * CNSS_MULTIPLIER;
    const emplois = Math.max(0, Number(formValues.emplois_directs) || 0);
    const masseSalarialeAnnuelleEstimee =
      emplois * salaireBrutChargeMensuel * 12;

    return {
      zone,
      tauxTerritoriale,
      tauxSectorielle,
      bonusEcologique,
      tauxGlobal,
      totalCapex,
      montantSubventionEstimee,
      partFondsPropresPct,
      partDettePct,
      montantFondsPropres,
      montantDette,
      salaireBrutChargeMensuel,
      masseSalarialeAnnuelleEstimee,
      formatMAD,
      formatPercent,
    };
  }, [
    formValues.region_id,
    formValues.province_id,
    formValues.secteur_activite,
    formValues.is_eco_transition,
    formValues.regime_foncier,
    formValues.capex_etudes,
    formValues.capex_foncier,
    formValues.capex_immeuble,
    formValues.capex_amenagement,
    formValues.capex_materiel,
    formValues.capex_divers,
    formValues.mode_financement,
    formValues.part_fonds_propres,
    formValues.emplois_directs,
    formValues.salaire_moyen_brut,
  ]);
}
