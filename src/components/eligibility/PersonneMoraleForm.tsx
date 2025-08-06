import React from "react";
import { useTranslation } from "react-i18next";
import type { FormData, FormErrors } from "./types";
import {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_PERSONNE_MORALE_OPTIONS,
  ANNEE_CREATION_OPTIONS,
} from "./constants";

interface PersonneMoraleFormProps {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const PersonneMoraleForm: React.FC<PersonneMoraleFormProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="animate-fadeIn space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.morale.nomEntreprise")}
          </label>
          <input
            type="text"
            name="nomEntreprise"
            value={formData.nomEntreprise || ""}
            onChange={onInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder={t("eligibility.morale.nomEntreprisePlaceholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.email")} *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("eligibility.emailPlaceholder")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.morale.secteurActivite")} *
          </label>
          <select
            name="secteurTravail"
            value={formData.secteurTravail || ""}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.secteurTravail ? "border-red-500" : "border-gray-300"
            }`}>
            <option value="">{t("eligibility.selectPlaceholder")}</option>
            {SECTEURS_TRAVAIL.map((secteur) => (
              <option key={secteur} value={secteur}>
                {t(`eligibility.secteursTravail.${secteur}`)}
              </option>
            ))}
          </select>
          {errors.secteurTravail && (
            <p className="text-red-500 text-xs mt-1">
              {errors.secteurTravail}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.anneeCreation")} *
          </label>
          <select
            name="anneeCreation"
            value={formData.anneeCreation || ""}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.anneeCreation ? "border-red-500" : "border-gray-300"
            }`}>
            <option value="">{t("eligibility.selectPlaceholder")}</option>
            {ANNEE_CREATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.key ? t(option.key) : option.label}
              </option>
            ))}
          </select>
          {errors.anneeCreation && (
            <p className="text-red-500 text-xs mt-1">{errors.anneeCreation}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.physique.region")} *
          </label>
          <select
            name="region"
            value={formData.region || ""}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.region ? "border-red-500" : "border-gray-300"
            }`}>
            <option value="">{t("eligibility.selectPlaceholder")}</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {t(`eligibility.regions.${region}`)}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-red-500 text-xs mt-1">{errors.region}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.morale.statutJuridique")} *
          </label>
          <select
            name="statutJuridique"
            value={formData.statutJuridique || ""}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.statutJuridique ? "border-red-500" : "border-gray-300"
            }`}>
            <option value="">{t("eligibility.selectPlaceholder")}</option>
            {STATUT_JURIDIQUE_PERSONNE_MORALE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.key)}
              </option>
            ))}
          </select>
          {errors.statutJuridique && (
            <p className="text-red-500 text-xs mt-1">
              {errors.statutJuridique}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonneMoraleForm;