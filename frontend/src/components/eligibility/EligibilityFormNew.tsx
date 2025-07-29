import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import type { FormData, FormErrors, EligibilityFormProps } from "./types";
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
    applicantType: "",
    email: "",
    montantInvestissement: "",
    acceptPrivacyPolicy: false,
    statutJuridique: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleProgram, setEligibleProgram] = useState<string>("");

  // Gestionnaires d'événements
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur lorsque l'utilisateur commence à taper
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateEligibilityForm(formData, t);

    if (Object.keys(validationErrors).length === 0) {
      const eligibilityResult = checkEligibility(formData);
      setIsEligible(eligibilityResult.isEligible);
      setEligibleProgram(eligibilityResult.program || "");
      setShowResult(true);
      console.log("Form submitted:", formData);
      console.log("Eligibility result:", eligibilityResult);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleNewTest = () => {
    setShowResult(false);
    setFormData({
      applicantType: "",
      email: "",
      montantInvestissement: "",
      acceptPrivacyPolicy: false,
      statutJuridique: "",
    });
    setErrors({});
  };

  // Affichage du résultat
  if (showResult) {
    return (
      <EligibilityResult
        isEligible={isEligible}
        eligibleProgram={eligibleProgram}
        formData={formData}
        onNewTest={handleNewTest}
      />
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

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
