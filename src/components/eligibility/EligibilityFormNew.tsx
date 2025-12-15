import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import ErrorModal from "./Modals/ErrorModal";
import LoadingModal from "./Modals/LoadingModal";

import type { FormData, FormErrors, EligibilityFormProps } from "./types";
import type { programsNamesAndLinks } from "./types";
import { checkEligibility } from "./utils";
import { validateEligibilityForm } from "./validation";

import ApplicantTypeSelector from "./ApplicantTypeSelector";
import PersonnePhysiqueForm from "./PersonnePhysiqueForm";
import PersonneMoraleForm from "./PersonneMoraleForm";
import CommonFields from "./CommonFields";
import EligibilityResult from "./EligibilityResult";

const EligibilityForm: React.FC<EligibilityFormProps> = ({
  onNavigateBack,
}) => {
  const { t } = useTranslation();

  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    applicantType: "physique",
    email: "",
    montantInvestissement: "",
    numberOfEmployees: "",
    acceptPrivacyPolicy: false,
    statutJuridique: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleProgram, setEligibleProgram] = useState<
    programsNamesAndLinks[]
  >([]);
  const [testId, setTestId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showServerErrorModal, setShowServerErrorModal] = useState(false);

  // Gestionnaires d'événements
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      // Si on change l'année de création, on nettoie les champs CA
      if (name === "anneeCreation") {
        updated = {
          ...updated,
          chiffreAffaire2022: undefined,
          chiffreAffaire2023: undefined,
          chiffreAffaire2024: undefined,
        };
      }

      return updated;
    });

    // Effacer l'erreur si l'utilisateur tape
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Effacer l'erreur lorsque l'utilisateur coche
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const validationErrors = validateEligibilityForm(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Optionnel : Scroller vers la première erreur
      setTimeout(() => {
        const firstErrorField = Object.keys(validationErrors)[0];
        const errorElement =
          document.getElementsByName(firstErrorField)[0] ||
          document.querySelector(`[name="${firstErrorField}"]`);

        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          if ("focus" in errorElement) {
            (errorElement as HTMLElement).focus();
          }
        }
      }, 100);

      return;
    }
    submitForm();
  };

  const submitForm = async () => {
    // Le reste reste identique
    setShowLoadingModal(true);

    try {
      const eligibilityResult = await checkEligibility(formData);
      setShowLoadingModal(false);

      if (eligibilityResult.errorMessage) {
        setServerError(eligibilityResult.errorMessage);
        setShowResult(false);
        setShowServerErrorModal(true);
        return;
      }

      setServerError(null);
      setIsEligible(eligibilityResult.isEligible);
      setEligibleProgram(eligibilityResult.programs || []);
      setTestId(eligibilityResult.testId || null);
      setShowResult(true);

      console.log("Form submitted:", formData);
      console.log("Eligibility result:", eligibilityResult);
    } catch (error) {
      setShowLoadingModal(false);
      console.error("Erreur lors de la soumission :", error);
      setServerError(
        "Une erreur inattendue s'est produite. Veuillez réessayer."
      );
      setShowServerErrorModal(true);
    }
  };

  const handleNewTest = () => {
    setShowResult(false);
    setFormData({
      applicantType: "physique",
      email: "",
      montantInvestissement: "",
      numberOfEmployees: "",
      acceptPrivacyPolicy: false,
      statutJuridique: "",
    });
    setErrors({});

    // Scroll vers le haut du formulaire (ou de la page) pour repartir du début
    // Utilise RAF pour attendre le re-render, puis scrolle en douceur
    requestAnimationFrame(() => {
      const formEl = document.getElementById("eligibility-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    });
  };

  // Affichage du résultat
  if (showResult) {
    return (
      <EligibilityResult
        isEligible={isEligible}
        eligibleProgram={eligibleProgram}
        formData={formData}
        onNewTest={handleNewTest}
        testId={testId}
      />
    );
  }

  return (
    <>
      <>
        {/* Modal pour afficher les erreurs serveur */}
        <ErrorModal
          isOpen={showServerErrorModal}
          onClose={() => setShowServerErrorModal(false)}
          message={serverError || ""}
          showRetryButton={false}
          onRetry={submitForm}
          closeText="Annuler"
        />

        {/* Modal avec spinner pendant le traitement */}
        <LoadingModal
          isOpen={showLoadingModal}
          title="Vérification en cours..."
        />
      </>

      <section
        id="eligibility-form"
        className="min-h-screen py-8 sm:py-12 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-blue-800 mb-3 sm:mb-4">
              {t("eligibility.title")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              {t("eligibility.subtitle")}
            </p>
          </div>

          <div className="p-4 sm:p-8 max-w-5xl mx-auto">
            {/* Bouton de retour */}
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 sm:mb-6 transition-colors">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t("eligibility.backButton")}
              </button>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Sélection du type de demandeur */}
              <ApplicantTypeSelector
                formData={formData}
                setFormData={setFormData}
                error={errors.applicantType}
              />

              {/* Formulaire pour personne physique */}
              {formData.applicantType === "physique" && (
                <PersonnePhysiqueForm
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                />
              )}

              {/* Formulaire pour personne morale */}
              {formData.applicantType === "morale" && (
                <PersonneMoraleForm
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                />
              )}

              {/* Champs communs */}
              {formData.applicantType && (
                <CommonFields
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                  onCheckboxChange={handleCheckboxChange}
                />
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default EligibilityForm;
