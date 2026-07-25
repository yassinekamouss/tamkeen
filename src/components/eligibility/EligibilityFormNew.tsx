import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import ErrorModal from "./Modals/ErrorModal";
import LoadingModal from "./Modals/LoadingModal";

import type { FormData, FormErrors, EligibilityFormProps } from "./types";
import type { programsNamesAndLinks } from "./types";
import { checkEligibility } from "./utils";
import { validateStep, validateEligibilityForm } from "./validation";
import { getYearsForCA } from "./utils";
import EligibilityResult from "./EligibilityResult";

import ApplicantTypeSelector from "./ApplicantTypeSelector";
import PersonnePhysiqueForm from "./PersonnePhysiqueForm";
import PersonneMoraleForm from "./PersonneMoraleForm";
import Step2Fields from "./Step2Fields";
import Step3Fields from "./Step3Fields";
import { useEligibilityPhone } from "./useEligibilityPhone";

const EligibilityForm: React.FC<EligibilityFormProps> = ({
  onNavigateBack,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    applicantType: "physique",
    email: "",
    montantInvestissement: "",
    numberOfEmployees: "",
    acceptPrivacyPolicy: false,
    statutJuridique: "",
  });

  const [step, setStep] = useState(1);
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

  // Fetch phone numbers associated with the email
  const { availablePhones, phoneMode, setPhoneMode } = useEligibilityPhone(
    formData.email,
    formData.telephone,
    setFormData
  );

  const years = getYearsForCA(formData.anneeCreation);

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

  const handleApplicantTypeSelect = (type: "physique" | "morale") => {
    setFormData((prev) => ({
      ...prev,
      applicantType: type,
      // Clear fields belonging to other type to avoid invalid cross-validations
      nom: type === "physique" ? prev.nom : undefined,
      prenom: type === "physique" ? prev.prenom : undefined,
      age: type === "physique" ? prev.age : undefined,
      sexe: type === "physique" ? prev.sexe : undefined,
      nomEntreprise: type === "morale" ? prev.nomEntreprise : undefined,
      statutJuridique: "",
    }));

    if (errors.applicantType) {
      setErrors((prev) => ({ ...prev, applicantType: undefined }));
    }
  };

  const handleNextStep = () => {
    const stepErrors = validateStep(step, formData, t);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      // Scroll to the first error element of this step
      setTimeout(() => {
        const firstErrorField = Object.keys(stepErrors)[0];
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

    setErrors({});
    setStep((prev) => prev + 1);

    // Scroll to the top of the form
    requestAnimationFrame(() => {
      const formEl = document.getElementById("eligibility-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const handlePrevStep = () => {
    setErrors({});
    setStep((prev) => prev - 1);

    // Scroll to the top of the form
    requestAnimationFrame(() => {
      const formEl = document.getElementById("eligibility-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const validationErrors = validateEligibilityForm(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Find first error and step
      const step1Errors = validateStep(1, formData, t);
      const step2Errors = validateStep(2, formData, t);

      if (Object.keys(step1Errors).length > 0) {
        setStep(1);
      } else if (Object.keys(step2Errors).length > 0) {
        setStep(2);
      } else {
        setStep(3);
      }

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
    setStep(1);
    setErrors({});

    requestAnimationFrame(() => {
      const formEl = document.getElementById("eligibility-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    });
  };

  const handleSimulate = async (fieldToAdjust?: string, suggestedValue?: string) => {
    // Build the patched form data synchronously to avoid stale closure
    const updatedFormData: FormData = fieldToAdjust
      ? { ...formData, [fieldToAdjust]: suggestedValue !== undefined ? suggestedValue : (formData[fieldToAdjust as keyof FormData] || "") }
      : { ...formData };

    // Update state and close current result
    setFormData(updatedFormData);
    setShowResult(false);
    setErrors({});

    // Auto re-launch the eligibility check with the simulated values
    setShowLoadingModal(true);
    try {
      const eligibilityResult = await checkEligibility(updatedFormData);
      setShowLoadingModal(false);

      if (eligibilityResult.errorMessage) {
        setServerError(eligibilityResult.errorMessage);
        setShowServerErrorModal(true);
        return;
      }

      setServerError(null);
      setIsEligible(eligibilityResult.isEligible);
      setEligibleProgram(eligibilityResult.programs || []);
      setTestId(eligibilityResult.testId || null);
      setShowResult(true);
    } catch (error) {
      setShowLoadingModal(false);
      console.error("Erreur simulation :", error);
      setServerError("Une erreur inattendue s'est produite. Veuillez réessayer.");
      setShowServerErrorModal(true);
    }
  };

  // Affichage du résultat
  if (showResult) {
    return (
      <EligibilityResult
        isEligible={isEligible}
        eligibleProgram={eligibleProgram}
        formData={formData}
        onNewTest={handleNewTest}
        onSimulate={handleSimulate}
        testId={testId}
      />
    );
  }

  return (
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

      <LoadingModal
        isOpen={showLoadingModal}
        title="Vérification en cours..."
      />

      <section
        id="eligibility-form"
        className="min-h-screen py-12 sm:py-20 px-4 bg-[#FFFFFF] font-sans"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] tracking-tight font-display mb-4">
              {t("eligibility.title")}
            </h1>
            <p className="text-sm sm:text-base text-[#1F2937]/65 max-w-xl mx-auto leading-relaxed">
              {t("eligibility.subtitle")}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-12">
            {/* Bouton de retour */}
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="group flex items-center text-[#1E5ED8] hover:text-[#F97316] font-mono text-[11px] uppercase tracking-wider mb-8 transition-colors duration-200"
              >
                <svg
                  className={`w-4 h-4 mr-2 rtl:ml-2 rtl:rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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

            {/* Stepper Progress Bar */}
            <div className="mb-12 border-b border-[#E4E4E7] pb-10">
              <div className="flex items-center justify-between max-w-xl mx-auto relative px-2">
                {/* Background Line */}
                <div className="absolute left-6 right-6 top-5 h-[1px] bg-[#E4E4E7] -translate-y-1/2 z-0" />
                <div
                  className="absolute left-6 top-5 h-[1.5px] bg-[#1E5ED8] -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
                    right: isRTL ? "auto" : undefined,
                  }}
                />

                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-none flex items-center justify-center font-mono text-xs transition-all duration-300 ${
                        step > s
                          ? "bg-[#1E5ED8] text-white border border-[#1E5ED8]"
                          : step === s
                          ? "bg-[#F97316] text-white border border-[#F97316]"
                          : "bg-white border border-[#E4E4E7] text-[#1F2937]/40"
                      }`}
                    >
                      {step > s ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        String(s).padStart(2, "0")
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-3 font-bold tracking-wider uppercase font-display transition-colors ${
                        step === s ? "text-[#1E5ED8]" : "text-[#1F2937]/50"
                      }`}
                    >
                      {t(`eligibility.steps.step${s}`)}
                    </span>
                    <span className="text-[9px] text-[#1F2937]/40 font-mono mt-0.5 hidden sm:block">
                      {t(`eligibility.steps.step${s}Sub`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Identité */}
              {step === 1 && (
                <div className="space-y-8 animate-fadeIn">
                  <ApplicantTypeSelector
                    formData={formData}
                    onApplicantTypeSelect={handleApplicantTypeSelect}
                    errors={errors}
                  />

                  {formData.applicantType === "physique" && (
                    <PersonnePhysiqueForm
                      formData={formData}
                      errors={errors}
                      handleInputChange={handleInputChange}
                    />
                  )}

                  {formData.applicantType === "morale" && (
                    <PersonneMoraleForm
                      formData={formData}
                      errors={errors}
                      handleInputChange={handleInputChange}
                    />
                  )}
                </div>
              )}

              {/* Step 2: Activité et structure */}
              {step === 2 && (
                <Step2Fields
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />
              )}

              {/* Step 3: Évaluation et contact */}
              {step === 3 && (
                <Step3Fields
                  formData={formData}
                  errors={errors}
                  years={years}
                  phoneMode={phoneMode}
                  availablePhones={availablePhones}
                  setPhoneMode={setPhoneMode}
                  setFormData={setFormData}
                  handleInputChange={handleInputChange}
                  handleCheckboxChange={handleCheckboxChange}
                />
              )}

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-8 border-t border-[#E4E4E7]">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3.5 rounded-none border border-[#E4E4E7] text-[#1F2937] font-mono text-xs uppercase tracking-wider hover:bg-[#FFFFFF] transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className={`w-4 h-4 mr-2 rtl:ml-2 rtl:rotate-180`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Précédent
                  </button>
                ) : (
                  <div /> // spacer
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3.5 bg-[#1E5ED8] hover:bg-[#1F2937] text-white font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center"
                  >
                    Suivant
                    <svg
                      className={`w-4 h-4 ml-2 rtl:mr-2 rtl:rotate-180`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center"
                  >
                    {t("eligibility.submitButton")}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default EligibilityForm;
