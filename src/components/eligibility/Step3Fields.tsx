import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FormData, FormErrors } from "./types";
import { MONTANT_INVESTISSEMENT_OPTIONS } from "./constants";

interface Step3FieldsProps {
  formData: FormData;
  errors: FormErrors;
  years: number[];
  phoneMode: "select" | "new";
  availablePhones: string[];
  setPhoneMode: React.Dispatch<React.SetStateAction<"select" | "new">>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step3Fields: React.FC<Step3FieldsProps> = ({
  formData,
  errors,
  years,
  phoneMode,
  availablePhones,
  setPhoneMode,
  setFormData,
  handleInputChange,
  handleCheckboxChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 bg-[#FFFFFF] p-6 border border-[#E4E4E7] animate-fadeIn font-sans">
      {/* Chiffre d'affaires */}
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#1F2937]/70 mb-3 font-display">
          {t("eligibility.chiffreAffaire")} (en MAD HT) *
        </label>
        {years.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {years.map((year) => (
              <div key={year}>
                <label className="block text-[10px] font-bold text-[#1F2937]/50 uppercase tracking-wider mb-1.5 font-mono">
                  Année {year}
                </label>
                <input
                  type="number"
                  name={`chiffreAffaire${year}`}
                  value={
                    (formData[`chiffreAffaire${year}` as keyof FormData] as string) || ""
                  }
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#E4E4E7] rounded-none focus:border-[#1E5ED8] focus:ring-0 bg-white transition-colors duration-200 outline-none text-sm font-sans"
                  placeholder="Ex: 1500000"
                  min="0"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1E5ED8]/5 border border-[#1E5ED8]/10 p-4">
            <p className="text-[#1E5ED8] text-[11px] font-mono uppercase tracking-wider flex items-center">
              <svg className="w-4 h-4 mr-2 rtl:ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
          <p className="text-red-500 text-xs mt-2 font-mono">
            {errors.chiffreAffaire2024}
          </p>
        )}
      </div>

      {/* Montant Investissement */}
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#1F2937]/70 mb-2 font-display">
          {t("eligibility.montantInvestissement")} *
        </label>
        <select
          name="montantInvestissement"
          value={formData.montantInvestissement}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-none focus:border-[#1E5ED8] focus:ring-0 transition-colors duration-200 outline-none text-sm font-sans bg-white ${
            errors.montantInvestissement ? "border-red-500" : "border-[#E4E4E7]"
          }`}
        >
          <option value="">{t("eligibility.selectPlaceholder")}</option>
          {MONTANT_INVESTISSEMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.key)}
            </option>
          ))}
        </select>
        {errors.montantInvestissement && (
          <p className="text-red-500 text-xs mt-1.5 font-mono">
            {errors.montantInvestissement}
          </p>
        )}
      </div>

      <hr className="border-[#E4E4E7]" />

      {/* Email & Téléphone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#1F2937]/70 mb-2 font-display">
            {t("eligibility.email")} *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-none focus:border-[#1E5ED8] focus:ring-0 transition-colors duration-200 outline-none text-sm font-sans bg-white ${
              errors.email ? "border-red-500" : "border-[#E4E4E7]"
            }`}
            placeholder={t("eligibility.emailPlaceholder")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#1F2937]/70 mb-2 font-display">
            {t("eligibility.physique.telephone")} *
          </label>
          {phoneMode === "select" && availablePhones.length > 0 ? (
            <select
              name="telephone"
              value={formData.telephone || availablePhones[0] || ""}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  setPhoneMode("new");
                  setFormData((prev) => ({ ...prev, telephone: "" }));
                } else {
                  handleInputChange(e);
                }
              }}
              className={`w-full px-4 py-3 border rounded-none focus:border-[#1E5ED8] focus:ring-0 transition-colors duration-200 outline-none text-sm font-sans bg-white ${
                errors.telephone ? "border-red-500" : "border-[#E4E4E7]"
              }`}
            >
              {availablePhones.map((ph) => (
                <option key={ph} value={ph}>
                  {ph}
                </option>
              ))}
              <option value="__new__">+ Nouveau numéro…</option>
            </select>
          ) : (
            <div className="flex">
              <span className="inline-flex items-center px-4 border border-r-0 bg-[#FFFFFF] border-[#E4E4E7] text-[#1F2937]/60 text-xs font-mono rounded-none">
                +212
              </span>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone || ""}
                onChange={handleInputChange}
                maxLength={9}
                className={`w-full px-4 py-3 border rounded-none focus:border-[#1E5ED8] focus:ring-0 transition-colors duration-200 outline-none text-sm font-sans bg-white border-l-0 ${
                  errors.telephone ? "border-red-500" : "border-[#E4E4E7]"
                }`}
                placeholder={t("eligibility.physique.telephonePlaceholder")}
              />
            </div>
          )}
          {errors.telephone && (
            <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.telephone}</p>
          )}
        </div>
      </div>

      {/* Politique de confidentialité */}
      <div className="pt-4 border-t border-[#E4E4E7]">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <input
            type="checkbox"
            id="acceptPrivacyPolicy"
            name="acceptPrivacyPolicy"
            checked={formData.acceptPrivacyPolicy}
            onChange={handleCheckboxChange}
            className={`mt-1 h-4 w-4 text-[#1E5ED8] focus:ring-0 focus:ring-offset-0 border-[#E4E4E7] rounded-none ${
              errors.acceptPrivacyPolicy ? "border-red-500" : ""
            }`}
          />
          <div className="flex-1">
            <label
              htmlFor="acceptPrivacyPolicy"
              className="text-xs text-[#1F2937]/70 leading-relaxed cursor-pointer select-none font-sans"
            >
              {t("eligibility.privacyPolicy.text1")}{" "}
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1E5ED8] hover:text-[#F97316] underline font-semibold transition-colors duration-200"
              >
                {t("eligibility.privacyPolicy.link")}
              </Link>{" "}
              {t("eligibility.privacyPolicy.text2")}
            </label>
            {errors.acceptPrivacyPolicy && (
              <p className="text-red-500 text-[10px] font-mono mt-1 font-semibold">
                {errors.acceptPrivacyPolicy}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Fields;
