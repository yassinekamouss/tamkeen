import React from "react";
import { useTranslation } from "react-i18next";
import type { FormData, FormErrors } from "./types";
import { sexe } from "./constants";
import { useClientAuth } from "../../contexts/ClientAuthContext";

interface PersonnePhysiqueFormProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const PersonnePhysiqueForm: React.FC<PersonnePhysiqueFormProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { t } = useTranslation();
  const { client } = useClientAuth();
  const isDisabled = !!client;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FFFFFF] p-6 border border-[#E4E4E7] animate-fadeIn">
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#1F2937]/70 mb-2 font-display">
          {t("eligibility.physique.nom")} *
        </label>
        <input
          type="text"
          name="nom"
          value={formData.nom || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          className={`w-full px-4 py-3 border rounded-none focus:border-[#1E5ED8] focus:ring-0 transition-colors duration-200 outline-none text-sm font-sans ${isDisabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"} ${
            errors.nom ? "border-red-500" : "border-[#E4E4E7]"
          }`}
          placeholder={t("eligibility.physique.nomPlaceholder")}
        />
        {errors.nom && (
          <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.nom}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#1F2937]/70 mb-2 font-display">
          {t("eligibility.physique.prenom")} *
        </label>
        <input
          type="text"
          name="prenom"
          value={formData.prenom || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          className={`w-full px-4 py-3 border rounded-none focus:border-[#1E5ED8] focus:ring-0 transition-colors duration-200 outline-none text-sm font-sans ${isDisabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"} ${
            errors.prenom ? "border-red-500" : "border-[#E4E4E7]"
          }`}
          placeholder={t("eligibility.physique.prenomPlaceholder")}
        />
        {errors.prenom && (
          <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.prenom}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#1F2937]/70 mb-2 font-display">
          {t("eligibility.physique.age")} *
        </label>
        <input
          type="number"
          name="age"
          min={18}
          max={100}
          value={formData.age || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          className={`w-full px-4 py-3 border rounded-none focus:border-[#1E5ED8] focus:ring-0 transition-colors duration-200 outline-none text-sm font-sans ${isDisabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"} ${
            errors.age ? "border-red-500" : "border-[#E4E4E7]"
          }`}
          placeholder={t("eligibility.physique.agePlaceholder")}
        />
        {errors.age && (
          <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.age}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#1F2937]/70 mb-2 font-display">
          {t("eligibility.physique.sexe")} *
        </label>
        <select
          name="sexe"
          value={formData.sexe || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          className={`w-full px-4 py-3 border rounded-none focus:border-[#1E5ED8] focus:ring-0 transition-colors duration-200 outline-none text-sm font-sans ${isDisabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"} ${
            errors.sexe ? "border-red-500" : "border-[#E4E4E7]"
          }`}
        >
          <option value="">{t("eligibility.selectPlaceholder")}</option>
          {sexe.map((option) => (
            <option key={option} value={option}>
              {t(`eligibility.sexe.${option}`)}
            </option>
          ))}
        </select>
        {errors.sexe && (
          <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.sexe}</p>
        )}
      </div>
    </div>
  );
};

export default PersonnePhysiqueForm;