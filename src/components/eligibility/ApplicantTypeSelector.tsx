import React from "react";
import { useTranslation } from "react-i18next";
import type { FormData } from "./types";

interface ApplicantTypeSelectorProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  error?: string;
}

const ApplicantTypeSelector: React.FC<ApplicantTypeSelectorProps> = ({
  formData,
  setFormData,
  error,
}) => {
  const { t } = useTranslation();

  const handleSelect = (type: "physique" | "morale") => {
    setFormData((prev) => ({
      ...prev,
      applicantType: type,
    }));
  };

  return (
    <div>
      <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
        {t("eligibility.applicantType.label")} *
      </label>

      {/* Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
        {/* Personne Physique */}
        <div
          onClick={() => handleSelect("physique")}
          className={`relative cursor-pointer p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 group ${
            formData.applicantType === "physique"
              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
              : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
          }`}>
          {/* Icône et titre */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`p-3 rounded-full transition-colors duration-300 ${
                formData.applicantType === "physique"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-500 group-hover:bg-blue-200"
              }`}>
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3
                className={`font-semibold text-lg ${
                  formData.applicantType === "physique"
                    ? "text-blue-700"
                    : "text-gray-700"
                }`}>
                {t("eligibility.applicantType.physique")}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {t("eligibility.applicantType.physiqueSubtitle")}
              </p>
            </div>
          </div>

          {/* Indicateur de sélection */}
          {formData.applicantType === "physique" && (
            <div className="absolute top-3 right-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Personne Morale */}
        <div
          onClick={() => handleSelect("morale")}
          className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 group ${
            formData.applicantType === "morale"
              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
              : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
          }`}>
          {/* Icône et titre */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`p-3 rounded-full transition-colors duration-300 ${
                formData.applicantType === "morale"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-500 group-hover:bg-blue-200"
              }`}>
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h3
                className={`font-semibold text-lg ${
                  formData.applicantType === "morale"
                    ? "text-blue-700"
                    : "text-gray-700"
                }`}>
                {t("eligibility.applicantType.morale")}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {t("eligibility.applicantType.moraleSubtitle")}
              </p>
            </div>
          </div>

          {/* Indicateur de sélection */}
          {formData.applicantType === "morale" && (
            <div className="absolute top-3 right-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-4 text-center font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default ApplicantTypeSelector;
