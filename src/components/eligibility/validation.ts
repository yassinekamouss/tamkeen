import type { FormData, FormErrors } from "./types";
import { getYearsForCA } from "./utils";

/**
 * Valide le formulaire d'éligibilité et retourne les erreurs
 */
export const validateEligibilityForm = (
  formData: FormData,
  t: (key: string) => string
): FormErrors => {
  const newErrors: FormErrors = {};

  // Validation du type de demandeur
  if (!formData.applicantType) {
    newErrors.applicantType = t("eligibility.errors.applicantType");
  }

  // Validation de l'email
  if (!formData.email) {
    newErrors.email = t("eligibility.errors.emailRequired");
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = t("eligibility.errors.emailInvalid");
  }

  // Validation spécifique pour personne physique
  if (formData.applicantType === "physique") {
    if (!formData.nom) {
      newErrors.nom = t("eligibility.errors.nomRequired");
    }
    if (!formData.prenom) {
      newErrors.prenom = t("eligibility.errors.prenomRequired");
    }
    if (!formData.telephone) {
      newErrors.telephone = t("eligibility.errors.telephoneRequired");
    }
  }

  // Validations communes pour les deux types (secteur, région, statut, année)
  if (formData.applicantType) {
    if (!formData.secteurTravail) {
      newErrors.secteurTravail = formData.applicantType === "physique" 
        ? t("eligibility.errors.secteurTravailRequired")
        : t("eligibility.errors.secteurActiviteRequired");
    }
    
    if (!formData.region) {
      newErrors.region = t("eligibility.errors.regionRequired");
    }
    
    if (!formData.statutJuridique) {
      newErrors.statutJuridique = t("eligibility.errors.statutJuridiqueRequired");
    }
    
    if (!formData.anneeCreation) {
      newErrors.anneeCreation = t("eligibility.errors.anneeCreationRequired");
    }
  }

  // Validation des chiffres d'affaires selon les années disponibles
  const years = getYearsForCA(formData.anneeCreation);
  if (years.length > 0) {
    let hasValidCA = false;
    for (const year of years) {
      const caField = `chiffreAffaire${year}` as keyof FormData;
      const caValue = formData[caField] as string;
      if (caValue && caValue.trim() !== "") {
        const numericValue = parseFloat(caValue);
        if (!isNaN(numericValue) && numericValue >= 0) {
          hasValidCA = true;
        }
      }
    }
    if (!hasValidCA && formData.applicantType === "morale") {
      newErrors.chiffreAffaire2024 =
        "Veuillez renseigner au moins un chiffre d'affaires valide";
    }
  }

  // Validation du montant d'investissement
  if (!formData.montantInvestissement) {
    newErrors.montantInvestissement = t(
      "eligibility.errors.montantInvestissementRequired"
    );
  }

  // Validation de la politique de confidentialité
  if (!formData.acceptPrivacyPolicy) {
    newErrors.acceptPrivacyPolicy = t(
      "eligibility.errors.acceptPrivacyPolicyRequired"
    );
  }

  return newErrors;
};