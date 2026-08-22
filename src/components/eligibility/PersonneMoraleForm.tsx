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
    <div className="bg-[#FFFFFF] p-6 border border-[#E4E4E7] animate-fadeIn">
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#1F2937]/70 mb-2 font-display">
          {t("eligibility.morale.nomEntreprise")} *
        </label>
        <input
          type="text"
          name="nomEntreprise"
          value={formData.nomEntreprise || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          className={`w-full px-4 py-3 border rounded-none focus:border-[#1E5ED8] focus:ring-0 transition-colors duration-200 outline-none text-sm font-sans ${isDisabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"} ${
            errors.nomEntreprise ? "border-red-500" : "border-[#E4E4E7]"
          }`}
          placeholder={t("eligibility.morale.nomEntreprisePlaceholder")}
        />
        {errors.nomEntreprise && (
          <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.nomEntreprise}</p>
        )}
      </div>
    </div>
  );
};

export default PersonneMoraleForm;