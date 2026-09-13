import React from "react";
import { useTranslation } from "react-i18next";
import type { StepperFormValues } from "./useStepperMath";
import { useStepperMath, formatMAD } from "./useStepperMath";
import {
  Coins,
  Building,
  Wrench,
  Cpu,
  Layers,
  FileSpreadsheet,
  Wallet,
  Landmark,
} from "lucide-react";

interface Step3CapexProps {
  values: StepperFormValues;
  onChange: (fields: Partial<StepperFormValues>) => void;
  errors?: Record<string, string>;
}

export const Step3Capex: React.FC<Step3CapexProps> = ({
  values,
  onChange,
  errors = {},
}) => {
  const { t } = useTranslation();
  const math = useStepperMath(values);

  const handleNumberInput = (field: keyof StepperFormValues, rawVal: string) => {
    const parsed = rawVal === "" ? 0 : Math.max(0, parseFloat(rawVal) || 0);
    onChange({ [field]: parsed });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Coins className="w-5 h-5 text-blue-600" />
          <span>{t("stepper.step3.title", "Étape 3 : Programme d'Investissement (CAPEX HT)")}</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {t(
            "stepper.step3.desc",
            "Détaillez les composantes prévisionnelles hors taxes (HT) de votre investissement en Dirhams marocains (MAD)."
          )}
        </p>
      </div>

      {/* Grille des Postes CAPEX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frais d'études */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-1.5 hover:border-blue-400 transition-colors">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>{t("stepper.step3.etudesTitle", "Études, R&D & Conseil technique")}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={values.capex_etudes || ""}
              onChange={(e) => handleNumberInput("capex_etudes", e.target.value)}
              className="w-full pr-14 pl-3.5 rtl:pr-3.5 rtl:pl-14 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-xs font-bold text-gray-400">
              {t("stepper.common.mad", "MAD")}
            </span>
          </div>
          <span className="text-[11px] text-gray-500">
            {t("stepper.step3.etudesHint", "Honoraires, études d'impact, R&D préparatoire")}
          </span>
        </div>

        {/* Foncier / Terrain (Masqué si Location) */}
        {values.regime_foncier === "ACQUISITION" && (
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-1.5 hover:border-blue-400 transition-colors animate-fadeIn">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600" />
              <span>{t("stepper.step3.foncierTitle", "Acquisition Foncier / Terrain nu")}</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={values.capex_foncier || ""}
                onChange={(e) => handleNumberInput("capex_foncier", e.target.value)}
                className="w-full pr-14 pl-3.5 rtl:pr-3.5 rtl:pl-14 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-xs font-bold text-gray-400">
                {t("stepper.common.mad", "MAD")}
              </span>
            </div>
            <span className="text-[11px] text-gray-500">
              {t("stepper.step3.foncierHint", "Prix d'acquisition notarié HT du terrain")}
            </span>
          </div>
        )}

        {/* Bâtiment / Loyer selon le régime */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-1.5 hover:border-blue-400 transition-colors">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-blue-600" />
            <span>
              {values.regime_foncier === "LOCATION"
                ? t("stepper.step3.loyerTitle", "Cumul des loyers sur 3 ans (bail commercial)")
                : t("stepper.step3.batimentTitle", "Bâtiments, Génie Civil & Construction")}
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={values.capex_immeuble || ""}
              onChange={(e) => handleNumberInput("capex_immeuble", e.target.value)}
              className="w-full pr-14 pl-3.5 rtl:pr-3.5 rtl:pl-14 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-xs font-bold text-gray-400">
              {t("stepper.common.mad", "MAD")}
            </span>
          </div>
          <span className="text-[11px] text-gray-500">
            {values.regime_foncier === "LOCATION"
              ? t("stepper.step3.loyerHint", "Montant total des loyers prévus sur les 36 premiers mois")
              : t("stepper.step3.batimentHint", "Travaux de gros œuvre, charpente, maçonnerie")}
          </span>
        </div>

        {/* Aménagements */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-1.5 hover:border-blue-400 transition-colors">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span>{t("stepper.step3.amenagementTitle", "Aménagements, Agencements & Fluides")}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={values.capex_amenagement || ""}
              onChange={(e) => handleNumberInput("capex_amenagement", e.target.value)}
              className="w-full pr-14 pl-3.5 rtl:pr-3.5 rtl:pl-14 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-xs font-bold text-gray-400">
              {t("stepper.common.mad", "MAD")}
            </span>
          </div>
          <span className="text-[11px] text-gray-500">
            {t("stepper.step3.amenagementHint", "Électricité industrielle, climatisation, plomberie, cloisons")}
          </span>
        </div>

        {/* Matériel & Équipements de production */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-1.5 hover:border-blue-400 transition-colors">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>{t("stepper.step3.materielTitle", "Matériel, Machines & Outillage de production")}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={values.capex_materiel || ""}
              onChange={(e) => handleNumberInput("capex_materiel", e.target.value)}
              className="w-full pr-14 pl-3.5 rtl:pr-3.5 rtl:pl-14 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-xs font-bold text-gray-400">
              {t("stepper.common.mad", "MAD")}
            </span>
          </div>
          <span className="text-[11px] text-gray-500">
            {t("stepper.step3.materielHint", "Lignes de production, serveurs, outillages neufs")}
          </span>
        </div>

        {/* Frais divers */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-1.5 hover:border-blue-400 transition-colors">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>{t("stepper.step3.diversTitle", "Frais divers & Aléas (Imprévus)")}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={values.capex_divers || ""}
              onChange={(e) => handleNumberInput("capex_divers", e.target.value)}
              className="w-full pr-14 pl-3.5 rtl:pr-3.5 rtl:pl-14 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-xs font-bold text-gray-400">
              {t("stepper.common.mad", "MAD")}
            </span>
          </div>
          <span className="text-[11px] text-gray-500">
            {t("stepper.step3.diversHint", "Frais d'installation, raccordements, réserve imprévus")}
          </span>
        </div>
      </div>

      {/* Recap Total CAPEX */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block">
            {t("stepper.step3.totalCapexTitle", "Total Investissement HT (Assiette éligible)")}
          </span>
          <span className="text-xs text-blue-600">
            {t("stepper.step3.totalCapexSubtitle", "Somme des postes déclarés ci-dessus")}
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-black font-mono text-blue-900">
          {formatMAD(math.totalCapex)}
        </div>
      </div>
      {errors.totalCapex && (
        <p className="text-xs text-red-600 -mt-3">{errors.totalCapex}</p>
      )}

      {/* Mode de financement */}
      <div className="pt-2 border-t border-gray-200 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
          {t("stepper.step3.modeLabel", "Schéma de Financement envisagé")} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start ${
              values.mode_financement === "100_FONDS_PROPRES"
                ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="mode_financement"
              value="100_FONDS_PROPRES"
              checked={values.mode_financement === "100_FONDS_PROPRES"}
              onChange={() =>
                onChange({
                  mode_financement: "100_FONDS_PROPRES",
                  part_fonds_propres: 100,
                })
              }
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-3 rtl:ml-0 rtl:mr-3">
              <span className="block text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-blue-600" />
                {t("stepper.step3.mode100Title", "100% Fonds Propres (Autofinancement)")}
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {t(
                  "stepper.step3.mode100Desc",
                  "Financement intégral sur fonds propres / apport des associés sans recours à la dette bancaire."
                )}
              </span>
            </div>
          </label>

          <label
            className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start ${
              values.mode_financement === "MIXTE"
                ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="mode_financement"
              value="MIXTE"
              checked={values.mode_financement === "MIXTE"}
              onChange={() =>
                onChange({
                  mode_financement: "MIXTE",
                  part_fonds_propres: values.part_fonds_propres === 100 ? 30 : values.part_fonds_propres,
                })
              }
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-3 rtl:ml-0 rtl:mr-3">
              <span className="block text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-blue-600" />
                {t("stepper.step3.modeMixteTitle", "Financement Mixte (Fonds Propres + Emprunt)")}
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {t(
                  "stepper.step3.modeMixteDesc",
                  "Co-financement associant capitaux propres et crédit bancaire moyen/long terme."
                )}
              </span>
            </div>
          </label>
        </div>

        {/* Slider Répartition FP vs Dette */}
        {values.mode_financement === "MIXTE" && (
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                {t("stepper.step3.splitKey", "Clé de répartition de l'investissement")}
              </span>
              <div className="flex items-center gap-4 text-xs font-mono font-bold">
                <span className="text-blue-700">
                  {t("stepper.step3.fpShort", "FP")} : {values.part_fonds_propres}% ({formatMAD(math.montantFondsPropres)})
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-purple-700">
                  {t("stepper.step3.detteShort", "Dette")} : {100 - values.part_fonds_propres}% ({formatMAD(math.montantDette)})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={values.part_fonds_propres}
                onChange={(e) =>
                  onChange({ part_fonds_propres: parseInt(e.target.value, 10) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                <span>{t("stepper.step3.splitMin", "10% Fonds Propres (90% Dette)")}</span>
                <span>{t("stepper.step3.splitMid", "50% / 50%")}</span>
                <span>{t("stepper.step3.splitMax", "90% Fonds Propres (10% Dette)")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
