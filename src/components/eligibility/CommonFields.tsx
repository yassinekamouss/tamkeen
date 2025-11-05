import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { FormData, FormErrors } from "./types";
import { MONTANT_INVESTISSEMENT_OPTIONS } from "./constants";
import { getYearsForCA } from "./utils";

interface CommonFieldsProps {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CommonFields: React.FC<CommonFieldsProps> = ({
  formData,
  errors,
  onInputChange,
  onCheckboxChange,
}) => {
  const { t } = useTranslation();
  const years = getYearsForCA(formData.anneeCreation);

  return (
    <div className="animate-fadeIn space-y-4 border-t pt-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Chiffres d'affaires dynamiques */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {t("eligibility.chiffreAffaire")} (en MAD HT) *
          </label>
          {years.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {years.map((year) => (
                <div key={year}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Année {year}
                  </label>
                  <input
                    type="number"
                    name={`chiffreAffaire${year}`}
                    value={
                      (formData[
                        `chiffreAffaire${year}` as keyof FormData
                      ] as string) || ""
                    }
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ex: 1500000"
                    min="0"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-sm">
                <svg
                  className="w-4 h-4 inline mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Entreprise récente : Aucun chiffre d'affaires historique requis
              </p>
            </div>
          )}
          {errors.chiffreAffaire2024 && (
            <p className="text-red-500 text-xs mt-2">
              {errors.chiffreAffaire2024}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.montantInvestissement")} *
          </label>
          <select
            name="montantInvestissement"
            value={formData.montantInvestissement}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.montantInvestissement
                ? "border-red-500"
                : "border-gray-300"
            }`}>
            <option value="">{t("eligibility.selectPlaceholder")}</option>
            {MONTANT_INVESTISSEMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.key)}
              </option>
            ))}
          </select>
          {errors.montantInvestissement && (
            <p className="text-red-500 text-xs mt-1">
              {errors.montantInvestissement}
            </p>
          )}
        </div>
      </div>

      {/* Politique de confidentialité */}
      <div className="col-span-1 md:col-span-2 pt-6 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="acceptPrivacyPolicy"
            name="acceptPrivacyPolicy"
            checked={formData.acceptPrivacyPolicy}
            onChange={onCheckboxChange}
            className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border rounded ${
              errors.acceptPrivacyPolicy ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex-1">
            <label
              htmlFor="acceptPrivacyPolicy"
              className="text-sm text-gray-700 leading-relaxed cursor-pointer">
              {t("eligibility.privacyPolicy.text1")}{" "}
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200">
                {t("eligibility.privacyPolicy.link")}
              </Link>{" "}
              {t("eligibility.privacyPolicy.text2")}
            </label>
            {errors.acceptPrivacyPolicy && (
              <p className="text-red-500 text-xs mt-1">
                {errors.acceptPrivacyPolicy}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bouton de soumission */}
      <div className="col-span-1 md:col-span-2 flex justify-center pt-6">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-lg">
          {t("eligibility.submitButton")}
        </button>
      </div>
    </div>
  );
};

export default CommonFields;
