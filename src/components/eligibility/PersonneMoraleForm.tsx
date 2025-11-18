import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FormData, FormErrors } from "./types";
import {
  SECTEURS_TRAVAIL,
  REGIONS,
  STATUT_JURIDIQUE_PERSONNE_MORALE_OPTIONS,
  ANNEE_CREATION_OPTIONS,
  BRANCHES_PAR_SECTEUR,
} from "./constants";
import api from "../../api/axios";

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
  const { t, i18n } = useTranslation();
  const [availablePhones, setAvailablePhones] = useState<string[]>([]);
  const [phoneMode, setPhoneMode] = useState<"select" | "new">("new");

  const sectorKey = (formData.secteurTravail || "") as keyof typeof BRANCHES_PAR_SECTEUR;
  const branchesForSector = sectorKey ? BRANCHES_PAR_SECTEUR[sectorKey] || [] : [];

  useEffect(() => {
    const email = formData.email;
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      setAvailablePhones([]);
      setPhoneMode("new");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/test/eligibilite/phones", {
          params: { email },
        });
        if (cancelled) return;
        const phones: string[] = data?.telephones || [];
        setAvailablePhones(phones);
        if (phones.length > 0) {
          setPhoneMode("select");
          const current = formData.telephone;
          const selected =
            current && phones.includes(current) ? current : phones[0];
          if (selected) {
            onInputChange({
              target: { name: "telephone", value: selected },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
          }
        } else {
          setPhoneMode("new");
        }
      } catch {
        setAvailablePhones([]);
        setPhoneMode("new");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.email]);

  return (
    <div className="animate-fadeIn space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.morale.nomEntreprise")} *
          </label>
          <input
            type="text"
            name="nomEntreprise"
            value={formData.nomEntreprise || ""}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.nomEntreprise ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("eligibility.morale.nomEntreprisePlaceholder")}
          />
          {errors.nomEntreprise && (
            <p className="text-red-500 text-xs mt-1">{errors.nomEntreprise}</p>
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
          {phoneMode === "select" && availablePhones.length > 0 ? (
            <select
              name="telephone"
              value={formData.telephone || availablePhones[0] || ""}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  setPhoneMode("new");
                  onInputChange({
                    target: { name: "telephone", value: "" },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                } else {
                  onInputChange(e);
                }
              }}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.telephone ? "border-red-500" : "border-gray-300"
              }`}>
              {availablePhones.map((ph) => (
                <option key={ph} value={ph}>
                  {ph}
                </option>
              ))}
              <option value="__new__">+ Nouveau numéro…</option>
            </select>
          ) : (
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-gray-100 text-gray-500 text-sm">
                +212
              </span>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone || ""}
                onChange={onInputChange}
                maxLength={9}
                className={`w-full px-4 py-2.5 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.telephone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t("eligibility.physique.telephonePlaceholder")}
              />
            </div>
          )}
          {errors.telephone && (
            <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>
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

      {/* Branche dépendante du secteur (affiché après la sélection du secteur) */}
      {branchesForSector.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("eligibility.branch") || "Branche"} *
          </label>
          <select
            name="branche"
            value={formData.branche || ""}
            onChange={onInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.branche ? "border-red-500" : "border-gray-300"
            }`}>
            <option value="">{t("eligibility.selectPlaceholder")}</option>
            {branchesForSector.map((b) => (
              <option key={b.value} value={b.value}>
                {i18n.language && i18n.language.startsWith("ar")
                  ? t(`eligibility.branchesAR.${b.value}`)
                  : t(`eligibility.branchesFR.${b.value}`)}
              </option>
            ))}
          </select>
          {errors.branche && (
            <p className="text-red-500 text-xs mt-1">{errors.branche}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default PersonneMoraleForm;