import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FormData, FormErrors } from "./types";
import { MONTANT_INVESTISSEMENT_OPTIONS } from "./constants";
import { useClientAuth } from "../../contexts/ClientAuthContext";

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
  const { client } = useClientAuth();
  const isDisabled = !!client;

  return (
    <div className="space-y-6 bg-white p-6 border border-[#DADCE0] rounded-xl shadow-sm animate-fadeIn">
      {/* Chiffre d'affaires */}
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {t("eligibility.chiffreAffaire")} (en MAD HT) *
        </label>
        {years.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {years.map((year) => (
              <div key={year}>
                <label className="block text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  {t("eligibility.yearLabel", { year })}
                </label>
                <input
                  type="number"
                  name={`chiffreAffaire${year}`}
                  value={
                    (formData[`chiffreAffaire${year}` as keyof FormData] as string) || ""
                  }
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#DADCE0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] bg-white text-[#191C1D] transition-colors duration-200 outline-none text-[14px]"
                  style={{ fontFamily: "Roboto Flex, sans-serif" }}
                  placeholder={t("eligibility.caPlaceholder")}
                  min="0"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#F8F9FA] border border-[#DADCE0] rounded-lg p-4">
            <p className="text-[#1A73E8] text-[11px] uppercase tracking-wider flex items-center" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              <svg className="w-4 h-4 mr-2 rtl:ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              {t("eligibility.recentCompanyNotice")}
            </p>
          </div>
        )}
        {errors.chiffreAffaire2024 && (
          <p className="text-red-500 text-xs mt-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {errors.chiffreAffaire2024}
          </p>
        )}
      </div>

      {/* Montant Investissement */}
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {t("eligibility.montantInvestissement")} *
        </label>
        <select
          name="montantInvestissement"
          value={formData.montantInvestissement}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] bg-white text-[#191C1D] ${
            errors.montantInvestissement ? "border-red-500" : "border-[#DADCE0]"
          }`}
          style={{ fontFamily: "Roboto Flex, sans-serif" }}
        >
          <option value="">{t("eligibility.selectPlaceholder")}</option>
          {MONTANT_INVESTISSEMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.key)}
            </option>
          ))}
        </select>
        {errors.montantInvestissement && (
          <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {errors.montantInvestissement}
          </p>
        )}
      </div>

      <hr className="border-[#DADCE0]" />

      {/* Email & Téléphone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {t("eligibility.email")} *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isDisabled}
            className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] ${isDisabled ? "bg-[#F8F9FA] cursor-not-allowed text-[#5F6368]" : "bg-white text-[#191C1D]"} ${
              errors.email ? "border-red-500" : "border-[#DADCE0]"
            }`}
            style={{ fontFamily: "Roboto Flex, sans-serif" }}
            placeholder={t("eligibility.emailPlaceholder")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#5F6368] mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
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
              disabled={isDisabled}
              className={`w-full px-4 py-3 border rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors duration-200 outline-none text-[14px] ${isDisabled ? "bg-[#F8F9FA] cursor-not-allowed text-[#5F6368]" : "bg-white text-[#191C1D]"} ${
                errors.telephone ? "border-red-500" : "border-[#DADCE0]"
              }`}
              style={{ fontFamily: "Roboto Flex, sans-serif" }}
            >
              {availablePhones.map((ph) => (
                <option key={ph} value={ph}>
                  {ph}
                </option>
              ))}
              <option value="__new__">{t("eligibility.newPhoneOption")}</option>
            </select>
          ) : (
            <div className={`flex border rounded-lg ${isDisabled ? "bg-[#F8F9FA]" : "bg-white"} transition-colors duration-200 focus-within:border-[#1A73E8] focus-within:ring-1 focus-within:ring-[#1A73E8] ${
              errors.telephone ? "border-red-500" : "border-[#DADCE0]"
            }`}>
              <span className="inline-flex items-center px-4 bg-[#F8F9FA] border-e border-[#DADCE0] text-[#5F6368] text-[13px] rounded-l-lg" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                +212
              </span>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone || ""}
                onChange={handleInputChange}
                disabled={isDisabled}
                maxLength={9}
                className={`w-full px-4 py-3 focus:ring-0 transition-colors duration-200 outline-none text-[14px] bg-transparent border-0 rounded-r-lg ${isDisabled ? "cursor-not-allowed text-[#5F6368]" : "text-[#191C1D]"}`}
                style={{ fontFamily: "Roboto Flex, sans-serif" }}
                placeholder={t("eligibility.physique.telephonePlaceholder")}
              />
            </div>
          )}
          {errors.telephone && (
            <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{errors.telephone}</p>
          )}
        </div>
      </div>

      {/* Politique de confidentialité */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <input
            type="checkbox"
            id="acceptPrivacyPolicy"
            name="acceptPrivacyPolicy"
            checked={formData.acceptPrivacyPolicy}
            onChange={handleCheckboxChange}
            className={`mt-1 h-4 w-4 text-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] focus:ring-offset-0 border-[#DADCE0] rounded ${
              errors.acceptPrivacyPolicy ? "border-red-500" : ""
            }`}
          />
          <div className="flex-1">
            <label
              htmlFor="acceptPrivacyPolicy"
              className="text-[14px] text-[#5F6368] leading-relaxed cursor-pointer select-none"
              style={{ fontFamily: "Roboto Flex, sans-serif" }}
            >
              {t("eligibility.privacyPolicy.text1")}{" "}
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A73E8] hover:text-[#174EA6] underline font-bold transition-colors duration-200"
              >
                {t("eligibility.privacyPolicy.link")}
              </Link>{" "}
              {t("eligibility.privacyPolicy.text2")}
            </label>
            {errors.acceptPrivacyPolicy && (
              <p className="text-red-500 text-[11px] mt-1 font-bold" style={{ fontFamily: "JetBrains Mono, monospace" }}>
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
