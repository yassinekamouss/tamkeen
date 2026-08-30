import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { useClientAuth } from "../../contexts/ClientAuthContext";

const EligibilityForm: React.FC<EligibilityFormProps> = ({
  onNavigateBack,
  selectedProfile,
  onSelectProfile,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { client } = useClientAuth();

  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    applicantType: selectedProfile || client?.applicantType || "physique",
    email: client?.email || "",
    nom: client?.nom || "",
    prenom: client?.prenom || "",
    age: client?.age?.toString() || "",
    sexe: client?.sexe || "",
    nomEntreprise: client?.nomEntreprise || "",
    telephone: client?.telephones?.[0] || "",
    montantInvestissement: "",
    numberOfEmployees: "",
    acceptPrivacyPolicy: false,
    statutJuridique: "",
  });

  React.useEffect(() => {
    if (selectedProfile && selectedProfile !== formData.applicantType) {
      setFormData((prev) => ({ ...prev, applicantType: selectedProfile }));
    }
  }, [selectedProfile]);

  React.useEffect(() => {
    if (client) {
      setFormData((prev) => ({
        ...prev,
        applicantType: (client.applicantType || prev.applicantType || "") as any,
        email: client.email || prev.email,
        nom: client.nom || prev.nom,
        prenom: client.prenom || prev.prenom,
        age: client.age?.toString() || prev.age,
        sexe: client.sexe || prev.sexe,
        nomEntreprise: client.nomEntreprise || prev.nomEntreprise,
        telephone: client.telephones?.[0] || prev.telephone,
      }));
    }
  }, [client]);

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
  // Modal dédié quand l'email est déjà lié à un compte avec mot de passe
  const [showAccountExistsModal, setShowAccountExistsModal] = useState(false);

  // Remediation flow state
  const [isCorrectedFlow, setIsCorrectedFlow] = useState(false);

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

    if (onSelectProfile) {
      onSelectProfile(type);
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
      const eligibilityResult = await checkEligibility(formData, !!client);
      setShowLoadingModal(false);

      if (eligibilityResult.errorMessage) {
        // Cas spécifique : l'email est déjà associé à un compte actif.
        // On affiche un message dédié invitant l'utilisateur à se connecter.
        if (eligibilityResult.statusCode === 403) {
          setShowAccountExistsModal(true);
          return;
        }
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
      setServerError(t("eligibility.unexpectedError"));
      setShowServerErrorModal(true);
    }
  };

  const handleNewTest = () => {
    setShowResult(false);
    setIsCorrectedFlow(false);
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

  const handleEditForm = (fieldsToClear?: string[]) => {
    // Flag that user entered the correction flow
    setIsCorrectedFlow(true);

    // Clean specified fields or default target fields for fresh entry
    const defaultFieldsToClear = ["montantInvestissement", "numberOfEmployees", "chiffreAffaire2022", "chiffreAffaire2023", "chiffreAffaire2024", "chiffreAffaire2025"];
    const targets = fieldsToClear && fieldsToClear.length > 0 ? fieldsToClear : defaultFieldsToClear;

    setFormData((prev) => {
      const updated = { ...prev };
      targets.forEach((field) => {
        if (field in updated) {
          (updated as Record<string, unknown>)[field] = "";
        }
      });
      return updated;
    });

    // Hide result view and redirect back to form step 2 for user to correct and re-submit normally
    setShowResult(false);
    setStep(2);
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
      setServerError(t("eligibility.unexpectedError"));
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
        onEditForm={handleEditForm}
        isCorrectedFlow={isCorrectedFlow}
        isAuth={!!client}
      />
    );
  }

  return (
    <>
      {/* Modal compte existant — invite à se connecter */}
      {showAccountExistsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-[0_24px_60px_rgba(0,0,0,0.12)] border border-[#DADCE0] max-w-md w-full p-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#E8F0FE] flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-[#1A73E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3
              className="text-[18px] font-bold text-[#191C1D] mb-2"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Vous avez déjà un compte
            </h3>
            <p className="text-[14px] text-[#5F6368] leading-relaxed mb-6">
              Cet email est déjà associé à un espace client actif. Connectez-vous à votre espace pour effectuer un nouveau test d'éligibilité.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowAccountExistsModal(false)}
                className="flex-1 px-5 py-2.5 border border-[#DADCE0] text-[#414754] text-[13px] font-medium rounded hover:bg-[#F8F9FA] transition-colors"
              >
                Annuler
              </button>
              <Link
                to="/login"
                className="flex-1 px-5 py-2.5 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-[13px] font-bold rounded transition-colors shadow-sm text-center"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour afficher les erreurs serveur */}
      <ErrorModal
        isOpen={showServerErrorModal}
        onClose={() => setShowServerErrorModal(false)}
        message={serverError || ""}
        showRetryButton={false}
        onRetry={submitForm}
        closeText={t("eligibility.cancel")}
      />

      <LoadingModal isOpen={showLoadingModal} title={t("eligibility.loadingModalTitle")} />

      <section className="py-12 sm:py-16 px-4 bg-white" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
        <div className="max-w-4xl mx-auto">
          <div>
            <div className="lg:col-span-3">
              <div className="bg-white p-6 sm:p-10 border border-[#DADCE0] rounded-xl shadow-sm">
                {/* Bouton de retour */}
                {onNavigateBack && (
                  <button
                    onClick={onNavigateBack}
                    className="group flex items-center text-[#1A73E8] hover:text-[#174EA6] text-[12px] font-bold uppercase tracking-wider mb-8 transition-colors duration-200"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    <svg
                      className="w-4 h-4 mr-2 rtl:ml-2 rtl:rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t("eligibility.backButton")}
                  </button>
                )}

                {/* Stepper Progress Bar */}
                <div className="mb-8 sm:mb-12 border-b border-[#DADCE0] pb-6 sm:pb-10">
                  {/* Mobile compact step counter badge */}
                  <div className="sm:hidden mb-4 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] text-[#1A73E8] border border-[#DADCE0] text-[11px] font-bold uppercase tracking-wider rounded-full" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                      <span>{t(`eligibility.steps.step${step}`)}</span>
                      <span className="text-[#DADCE0]">•</span>
                      <span>Étape {step} / 3</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between max-w-xl mx-auto relative px-2">
                    <div className="absolute left-6 right-6 top-5 h-[1px] bg-[#DADCE0] -translate-y-1/2 z-0" />
                    <div
                      className="absolute left-6 top-5 h-[2px] bg-[#1A73E8] -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
                        right: isRTL ? "auto" : undefined,
                      }}
                    />

                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] transition-all duration-300 ${step >= s
                              ? "bg-[#1A73E8] text-white border-2 border-[#1A73E8]"
                              : "bg-white border-2 border-[#DADCE0] text-[#5F6368]"
                            }`}
                          style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                          {step > s ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            s
                          )}
                        </div>
                        <span
                          className={`text-[12px] sm:text-[13px] mt-3 font-bold tracking-wider uppercase transition-colors hidden sm:block ${step === s ? "text-[#1A73E8]" : "text-[#5F6368]"}`}
                          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                        >
                          {t(`eligibility.steps.step${s}`)}
                        </span>
                        <span className="text-[11px] text-[#727785] mt-1 hidden sm:block">
                          {t(`eligibility.steps.step${s}Sub`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  {/* Step 1: Identité */}
                  {step === 1 && (
                    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
                      {client && (
                        <div className="bg-[#F8F9FA] border border-[#DADCE0] rounded-xl p-5 flex items-start gap-4">
                          <svg className="w-5 h-5 text-[#1A73E8] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-[14px] text-[#191C1D] leading-relaxed" dangerouslySetInnerHTML={{
                            __html: t('clientAuth.warning.clientAccount', { 
                              type: client.applicantType === 'morale' ? t('eligibility.applicantType.morale') : t('eligibility.applicantType.physique') 
                            }) 
                          }} />
                        </div>
                      )}

                      {!client && !selectedProfile && (
                        <ApplicantTypeSelector
                          formData={formData}
                          onApplicantTypeSelect={handleApplicantTypeSelect}
                          errors={errors}
                        />
                      )}

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
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 sm:pt-8 border-t border-[#DADCE0]">
                    {step > 1 ? (
                      <button type="button" onClick={handlePrevStep} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#DADCE0] text-[#5F6368] text-[14px] font-bold rounded-lg hover:bg-[#F8F9FA] hover:text-[#191C1D] transition-colors" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                        <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t("pagination.previous")}
                      </button>
                    ) : (
                      <div className="hidden sm:block" />
                    )}

                    {step < 3 ? (
                      <button type="button" onClick={handleNextStep} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1A73E8] text-white text-[14px] font-bold rounded-lg hover:bg-[#174EA6] transition-colors shadow-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                        {t("pagination.next")}
                        <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#1A73E8] text-white text-[14px] font-bold rounded-lg hover:bg-[#174EA6] transition-colors shadow-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                        {t("eligibility.submitButton")}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default EligibilityForm;
