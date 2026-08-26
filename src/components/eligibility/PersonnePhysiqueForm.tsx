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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 border border-[#DADCE0] rounded-xl shadow-sm animate-fadeIn">
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {t("eligibility.physique.nom")} *
        </label>
        <input
          type="text"
          name="nom"
          value={formData.nom || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] ${isDisabled ? "bg-[#F8F9FA] cursor-not-allowed text-[#5F6368]" : "bg-white text-[#191C1D]"} ${
            errors.nom ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
          placeholder={t("eligibility.physique.nomPlaceholder")}
        />
        {errors.nom && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.nom}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {t("eligibility.physique.prenom")} *
        </label>
        <input
          type="text"
          name="prenom"
          value={formData.prenom || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] ${isDisabled ? "bg-[#F8F9FA] cursor-not-allowed text-[#5F6368]" : "bg-white text-[#191C1D]"} ${
            errors.prenom ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
          placeholder={t("eligibility.physique.prenomPlaceholder")}
        />
        {errors.prenom && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.prenom}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
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
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] ${isDisabled ? "bg-[#F8F9FA] cursor-not-allowed text-[#5F6368]" : "bg-white text-[#191C1D]"} ${
            errors.age ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
          placeholder={t("eligibility.physique.agePlaceholder")}
        />
        {errors.age && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.age}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {t("eligibility.physique.sexe")} *
        </label>
        <select
          name="sexe"
          value={formData.sexe || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] ${isDisabled ? "bg-[#F8F9FA] cursor-not-allowed text-[#5F6368]" : "bg-white text-[#191C1D]"} ${
            errors.sexe ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
        >
          <option value="">{t("eligibility.selectPlaceholder")}</option>
          {sexe.map((option) => (
            <option key={option} value={option}>
              {t(`eligibility.sexe.${option}`)}
            </option>
          ))}
        </select>
        {errors.sexe && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.sexe}</p>
        )}
      </div>
    </div>
  );
};

export default PersonnePhysiqueForm;