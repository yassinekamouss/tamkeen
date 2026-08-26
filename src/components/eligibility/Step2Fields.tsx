import React from "react";
import { useTranslation } from "react-i18next";
import type { FormData, FormErrors } from "./types";
import {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_PERSONNE_PHYSIQUE_OPTIONS,
  STATUT_JURIDIQUE_PERSONNE_MORALE_OPTIONS,
  ANNEE_CREATION_OPTIONS,
  NUMBER_OF_EMPLOYEES,
} from "./constants";

interface Step2FieldsProps {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const Step2Fields: React.FC<Step2FieldsProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 border border-[#DADCE0] rounded-xl shadow-sm animate-fadeIn">
      {/* Secteur d'activité */}
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {formData.applicantType === "physique"
            ? t("eligibility.physique.secteurTravail")
            : t("eligibility.morale.secteurActivite")}{" "}
          *
        </label>
        <select
          name="secteurTravail"
          value={formData.secteurTravail || ""}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] bg-white text-[#191C1D] ${
            errors.secteurTravail ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
        >
          <option value="">{t("eligibility.selectPlaceholder")}</option>
          {SECTEURS_TRAVAIL.map((secteur) => (
            <option key={secteur} value={secteur}>
              {t(`eligibility.secteursTravail.${secteur}`)}
            </option>
          ))}
        </select>
        {errors.secteurTravail && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.secteurTravail}</p>
        )}
      </div>

      {/* Région */}
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {t("eligibility.physique.region")} *
        </label>
        <select
          name="region"
          value={formData.region || ""}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] bg-white text-[#191C1D] ${
            errors.region ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
        >
          <option value="">{t("eligibility.selectPlaceholder")}</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {t(`eligibility.regions.${region}`)}
            </option>
          ))}
        </select>
        {errors.region && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.region}</p>
        )}
      </div>

      {/* Statut juridique */}
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {formData.applicantType === "physique"
            ? t("eligibility.physique.statutJuridique")
            : t("eligibility.morale.statutJuridique")}{" "}
          *
        </label>
        <select
          name="statutJuridique"
          value={formData.statutJuridique || ""}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] bg-white text-[#191C1D] ${
            errors.statutJuridique ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
        >
          <option value="">{t("eligibility.selectPlaceholder")}</option>
          {(formData.applicantType === "physique"
            ? STATUT_JURIDIQUE_PERSONNE_PHYSIQUE_OPTIONS
            : STATUT_JURIDIQUE_PERSONNE_MORALE_OPTIONS
          ).map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.key)}
            </option>
          ))}
        </select>
        {errors.statutJuridique && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.statutJuridique}</p>
        )}
      </div>

      {/* Année de création */}
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {t("eligibility.anneeCreation")} *
        </label>
        <select
          name="anneeCreation"
          value={formData.anneeCreation || ""}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] bg-white text-[#191C1D] ${
            errors.anneeCreation ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
        >
          <option value="">{t("eligibility.selectPlaceholder")}</option>
          {ANNEE_CREATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.key ? t(option.key) : option.label}
            </option>
          ))}
        </select>
        {errors.anneeCreation && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.anneeCreation}</p>
        )}
      </div>

      {/* Nombre d'employés */}
      <div className="md:col-span-2">
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {t("eligibility.numberOfEmployees")} *
        </label>
        <select
          name="numberOfEmployees"
          value={formData.numberOfEmployees || ""}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] bg-white text-[#191C1D] ${
            errors.numberOfEmployees ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
        >
          <option value="">{t("eligibility.selectPlaceholder")}</option>
          {NUMBER_OF_EMPLOYEES.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.key)}
            </option>
          ))}
        </select>
        {errors.numberOfEmployees && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.numberOfEmployees}</p>
        )}
      </div>
    </div>
  );
};

export default Step2Fields;
