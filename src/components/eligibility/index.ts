// Types et interfaces
export type {
  FormData,
  FormErrors,
  EligibilityFormProps,
  EligibilityResult,
} from "./types";

// Constantes
export {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_PERSONNE_MORALE_OPTIONS,
  STATUT_JURIDIQUE_PERSONNE_PHYSIQUE_OPTIONS,
  MONTANT_INVESTISSEMENT_OPTIONS,
  ANNEE_CREATION_OPTIONS,
} from "./constants";

// Utilitaires
export { getYearsForCA, checkEligibility } from "./utils";
export { validateEligibilityForm } from "./validation";

// Composants
export { default as ApplicantTypeSelector } from "./ApplicantTypeSelector";
export { default as PersonnePhysiqueForm } from "./PersonnePhysiqueForm";
export { default as PersonneMoraleForm } from "./PersonneMoraleForm";
export { default as CommonFields } from "./CommonFields";
export { default as EligibilityResultComponent } from "./EligibilityResult";
export { default as EligibilityForm } from "./EligibilityFormNew";
