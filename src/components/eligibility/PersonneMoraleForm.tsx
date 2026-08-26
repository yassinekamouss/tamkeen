import React from "react";
import { useTranslation } from "react-i18next";
import type { FormData, FormErrors } from "./types";
import { useClientAuth } from "../../contexts/ClientAuthContext";

interface PersonneMoraleFormProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const PersonneMoraleForm: React.FC<PersonneMoraleFormProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { t } = useTranslation();
  const { client } = useClientAuth();
  const isDisabled = !!client;

  return (
    <div className="bg-white p-6 border border-[#DADCE0] rounded-xl shadow-sm animate-fadeIn">
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {t("eligibility.morale.nomEntreprise")} *
        </label>
        <input
          type="text"
          name="nomEntreprise"
          value={formData.nomEntreprise || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] ${isDisabled ? "bg-[#F8F9FA] cursor-not-allowed text-[#5F6368]" : "bg-white text-[#191C1D]"} ${
            errors.nomEntreprise ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
          placeholder={t("eligibility.morale.nomEntreprisePlaceholder")}
        />
        {errors.nomEntreprise && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.nomEntreprise}</p>
        )}
      </div>
    </div>
  );
};

export default PersonneMoraleForm;