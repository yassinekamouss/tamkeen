import React from "react";
import { useTranslation } from "react-i18next";
import type { FormData, FormErrors } from "./types";
import {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_PERSONNE_PHYSIQUE_OPTIONS,
  ANNEE_CREATION_OPTIONS,
} from "./constants";

interface PersonnePhysiqueFormProps {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const PersonnePhysiqueForm: React.FC<PersonnePhysiqueFormProps> = ({
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
            {t("eligibility.physique.nom")} *
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom || ""}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.nom ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("eligibility.physique.nomPlaceholder")}
          />
          {errors.nom && (
            <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.physique.prenom")} *
          </label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom || ""}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.prenom ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("eligibility.physique.prenomPlaceholder")}
          />
          {errors.prenom && (
            <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.physique.telephone")} *
          </label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone || ""}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.telephone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("eligibility.physique.telephonePlaceholder")}
          />
          {errors.telephone && (
            <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.physique.secteurTravail")} *
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
            <p className="text-red-500 text-xs mt-1">{errors.secteurTravail}</p>
          )}
        </div>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.physique.statutJuridique")} *
          </label>
          <select
            name="statutJuridiquePhysique"
            value={formData.statutJuridiquePhysique || ""}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.statutJuridiquePhysique
                ? "border-red-500"
                : "border-gray-300"
            }`}>
            <option value="">{t("eligibility.selectPlaceholder")}</option>
            {STATUT_JURIDIQUE_PERSONNE_PHYSIQUE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.key)}
              </option>
            ))}
          </select>
          {errors.statutJuridiquePhysique && (
            <p className="text-red-500 text-xs mt-1">
              {errors.statutJuridiquePhysique}
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
    </div>
  );
};

export default PersonnePhysiqueForm;
