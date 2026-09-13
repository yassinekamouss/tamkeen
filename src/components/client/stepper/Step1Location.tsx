import React from "react";
import { useTranslation } from "react-i18next";
import {
  REGIONS_ET_PROVINCES,
  getProvincesForRegion,
  getProvinceDetails,
  getRegionLabel,
  getProvinceLabel,
} from "./referentiels";
import type { StepperFormValues } from "./useStepperMath";
import { MapPin, Navigation, Building2, KeyRound } from "lucide-react";

interface Step1LocationProps {
  values: StepperFormValues;
  onChange: (fields: Partial<StepperFormValues>) => void;
  errors?: Record<string, string>;
}

export const Step1Location: React.FC<Step1LocationProps> = ({
  values,
  onChange,
  errors = {},
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const currentProvinces = getProvincesForRegion(values.region_id);
  const currentZoneDetails = getProvinceDetails(
    values.region_id,
    values.province_id
  );

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    const provinces = getProvincesForRegion(newRegion);
    const defaultProvince = provinces.length > 0 ? provinces[0].id : "";
    onChange({
      region_id: newRegion,
      province_id: defaultProvince,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span>{t("stepper.step1.title", "Étape 1 : Localisation & Foncier du Projet")}</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {t(
            "stepper.step1.desc",
            "L'emplacement géographique détermine automatiquement votre taux de prime territoriale (Zone A ou Zone B)."
          )}
        </p>
      </div>

      {/* Région & Province */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            {t("stepper.step1.regionLabel", "Région d'implantation")} <span className="text-red-500">*</span>
          </label>
          <select
            value={values.region_id}
            onChange={handleRegionChange}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
              errors.region_id ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              {t("stepper.step1.regionPlaceholder", "Sélectionnez une région")}
            </option>
            {REGIONS_ET_PROVINCES.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {getRegionLabel(reg, lang)}
              </option>
            ))}
          </select>
          {errors.region_id && (
            <p className="text-xs text-red-600 mt-1">{errors.region_id}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              {t("stepper.step1.provinceLabel", "Province / Préfecture")} <span className="text-red-500">*</span>
            </label>
            {values.province_id && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                  currentZoneDetails.zone === "Zone B"
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-blue-100 text-blue-900 border border-blue-300"
                }`}
              >
                {currentZoneDetails.zone} (+{(currentZoneDetails.rate * 100).toFixed(0)}%)
              </span>
            )}
          </div>
          <select
            value={values.province_id}
            onChange={(e) => onChange({ province_id: e.target.value })}
            disabled={!values.region_id}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.province_id ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              {t("stepper.step1.provincePlaceholder", "Sélectionnez une province")}
            </option>
            {currentProvinces.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {getProvinceLabel(prov, lang)} ({prov.zone} · +{(prov.rate * 100).toFixed(0)}%)
              </option>
            ))}
          </select>
          {errors.province_id && (
            <p className="text-xs text-red-600 mt-1">{errors.province_id}</p>
          )}
        </div>
      </div>

      {/* Adresse & GPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            {t("stepper.step1.addressLabel", "Adresse exacte du site d'exploitation")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t("stepper.step1.addressPlaceholder", "Ex : Zone Industrielle Sapino, Lot 14, 20100")}
            value={values.adresse_projet}
            onChange={(e) => onChange({ adresse_projet: e.target.value })}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
              errors.adresse_projet ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.adresse_projet && (
            <p className="text-xs text-red-600 mt-1">{errors.adresse_projet}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-gray-500" />
            <span>{t("stepper.step1.gpsLabel", "Coordonnées GPS")}</span>
          </label>
          <input
            type="text"
            placeholder={t("stepper.step1.gpsPlaceholder", "Ex : 33.5731, -7.5898")}
            value={values.gps_coordinates}
            onChange={(e) => onChange({ gps_coordinates: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
          <span className="text-[11px] text-gray-500 mt-1 block">
            {t("stepper.step1.gpsHint", "Optionnel ou approximatif")}
          </span>
        </div>
      </div>

      {/* Régime foncier (Radio cards) */}
      <div className="pt-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
          {t("stepper.step1.regimeLabel", "Régime foncier du site")} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            className={`relative flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
              values.regime_foncier === "ACQUISITION"
                ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="regime_foncier"
              value="ACQUISITION"
              checked={values.regime_foncier === "ACQUISITION"}
              onChange={() => onChange({ regime_foncier: "ACQUISITION" })}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-3 rtl:ml-0 rtl:mr-3">
              <span className="block text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                {t("stepper.step1.acquisitionTitle", "Acquisition en pleine propriété")}
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {t(
                  "stepper.step1.acquisitionDesc",
                  "Achat de terrain nu et/ou construction de bâtiment en propriété exclusive."
                )}
              </span>
            </div>
          </label>

          <label
            className={`relative flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
              values.regime_foncier === "LOCATION"
                ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="regime_foncier"
              value="LOCATION"
              checked={values.regime_foncier === "LOCATION"}
              onChange={() =>
                onChange({
                  regime_foncier: "LOCATION",
                  capex_foncier: 0,
                  titre_foncier: "",
                })
              }
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-3 rtl:ml-0 rtl:mr-3">
              <span className="block text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-600" />
                {t("stepper.step1.locationTitle", "Location / Bail commercial")}
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {t(
                  "stepper.step1.locationDesc",
                  "Site loué sous contrat de bail professionnel (cumul des loyers éligible sur 3 ans)."
                )}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Titre foncier conditionnel (Acquisition) */}
      {values.regime_foncier === "ACQUISITION" && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 animate-fadeIn">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
            {t("stepper.step1.titreLabel", "Référence du Titre Foncier (T/F) ou Réquisition")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t("stepper.step1.titrePlaceholder", "Ex : Titre Foncier n° 45892/C ou R/1283")}
            value={values.titre_foncier || ""}
            onChange={(e) => onChange({ titre_foncier: e.target.value })}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
              errors.titre_foncier ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.titre_foncier ? (
            <p className="text-xs text-red-600">{errors.titre_foncier}</p>
          ) : (
            <p className="text-[11px] text-gray-500">
              {t(
                "stepper.step1.titreHint",
                "Mention requise pour attester de la faisabilité juridique de l'assiette foncière."
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
