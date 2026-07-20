import type { FormData, FormErrors } from "./types";
import { getYearsForCA } from "./utils";

/**
 * Valide une étape spécifique du formulaire
 */
export const validateStep = (
  step: number,
  formData: FormData,
  t: (key: string) => string
): FormErrors => {
  const newErrors: FormErrors = {};

  if (step === 1) {
    if (!formData.applicantType) {
      newErrors.applicantType = t("eligibility.errors.applicantType");
    }
    if (formData.applicantType === "physique") {
      if (!formData.nom) {
        newErrors.nom = t("eligibility.errors.nomRequired");
      }
      if (!formData.prenom) {
        newErrors.prenom = t("eligibility.errors.prenomRequired");
      }
      if (!formData.age) {
        newErrors.age = t("eligibility.errors.ageRequired");
      }
      if (!formData.sexe) {
        newErrors.sexe = t("eligibility.errors.sexeRequired");
      }
    }
    if (formData.applicantType === "morale") {
      if (!formData.nomEntreprise) {
        newErrors.nomEntreprise = t("eligibility.errors.nomEntrepriseRequired");
      }
    }
  }

  if (step === 2) {
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

    if (!formData.numberOfEmployees) {
      newErrors.numberOfEmployees = t("eligibility.errors.numberOfEmployeesRequired");
    }
  }

  if (step === 3) {
    if (!formData.email) {
      newErrors.email = t("eligibility.errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("eligibility.errors.emailInvalid");
    }

    if (!formData.telephone) {
      newErrors.telephone = t("eligibility.errors.telephoneRequired");
    }

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
        newErrors.chiffreAffaire2024 = "Veuillez renseigner au moins un chiffre d'affaires valide";
      }
    }

    if (!formData.montantInvestissement) {
      newErrors.montantInvestissement = t("eligibility.errors.montantInvestissementRequired");
    }

    if (!formData.acceptPrivacyPolicy) {
      newErrors.acceptPrivacyPolicy = t("eligibility.errors.acceptPrivacyPolicyRequired");
    }
  }

  return newErrors;
};

/**
 * Valide le formulaire d'éligibilité entier
 */
export const validateEligibilityForm = (
  formData: FormData,
  t: (key: string) => string
): FormErrors => {
  const step1Errors = validateStep(1, formData, t);
  const step2Errors = validateStep(2, formData, t);
  const step3Errors = validateStep(3, formData, t);

  return {
    ...step1Errors,
    ...step2Errors,
    ...step3Errors,
  };
};