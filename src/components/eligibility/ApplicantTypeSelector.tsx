import React from "react";
import { useTranslation } from "react-i18next";
import type { FormData, FormErrors } from "./types";

interface ApplicantTypeSelectorProps {
  formData: FormData;
  onApplicantTypeSelect: (type: "physique" | "morale") => void;
  errors: FormErrors;
}

const ApplicantTypeSelector: React.FC<ApplicantTypeSelectorProps> = ({
  formData,
  onApplicantTypeSelect,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-[14px] font-bold tracking-wider uppercase text-[#5F6368] mb-6 text-center" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        {t("eligibility.applicantType.label")} *
      </label>

      {/* Custom Cards for Applicant Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Personne Physique */}
        <div
          onClick={() => onApplicantTypeSelect("physique")}
          className={`relative cursor-pointer p-6 border rounded-xl shadow-sm transition-all duration-350 group ${
            formData.applicantType === "physique"
              ? "border-[#1A73E8] bg-white ring-1 ring-[#1A73E8]"
              : "border-[#DADCE0] bg-white hover:border-[#1A73E8]"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div
              className={`p-3 rounded-full transition-all duration-300 ${
                formData.applicantType === "physique"
                  ? "bg-[#1A73E8] text-white"
                  : "bg-[#F8F9FA] text-[#1A73E8] group-hover:bg-[#1A73E8]/10"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#191C1D] text-[16px]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {t("eligibility.applicantType.physique")}
              </h3>
              <p className="text-[14px] text-[#5F6368] mt-1.5 max-w-[220px] leading-relaxed" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                {t("eligibility.applicantType.physiqueSubtitle")}
              </p>
            </div>
          </div>

          {formData.applicantType === "physique" && (
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 rounded-full bg-[#1A73E8] flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Personne Morale */}
        <div
          onClick={() => onApplicantTypeSelect("morale")}
          className={`relative cursor-pointer p-6 border rounded-xl shadow-sm transition-all duration-350 group ${
            formData.applicantType === "morale"
              ? "border-[#1A73E8] bg-white ring-1 ring-[#1A73E8]"
              : "border-[#DADCE0] bg-white hover:border-[#1A73E8]"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div
              className={`p-3 rounded-full transition-all duration-300 ${
                formData.applicantType === "morale"
                  ? "bg-[#1A73E8] text-white"
                  : "bg-[#F8F9FA] text-[#1A73E8] group-hover:bg-[#1A73E8]/10"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#191C1D] text-[16px]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {t("eligibility.applicantType.morale")}
              </h3>
              <p className="text-[14px] text-[#5F6368] mt-1.5 max-w-[220px] leading-relaxed" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                {t("eligibility.applicantType.moraleSubtitle")}
              </p>
            </div>
          </div>

          {formData.applicantType === "morale" && (
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 rounded-full bg-[#1A73E8] flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {errors.applicantType && (
        <p className="text-red-500 text-[12px] mt-4 text-center font-bold uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          {errors.applicantType}
        </p>
      )}
    </div>
  );
};

export default ApplicantTypeSelector;
