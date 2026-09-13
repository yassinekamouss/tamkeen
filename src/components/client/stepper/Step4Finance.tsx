import React from "react";
import { useTranslation } from "react-i18next";
import {
  PROFILS_MONTEE_CHARGE,
  PROFILS_RH,
  getProfilRampLabel,
  getProfilRampDesc,
  getProfilRHLabel,
} from "./referentiels";
import type { StepperFormValues } from "./useStepperMath";
import { useStepperMath, formatMAD } from "./useStepperMath";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Briefcase,
  Percent,
  Clock,
  Globe,
  Sliders,
} from "lucide-react";

interface Step4FinanceProps {
  values: StepperFormValues;
  onChange: (fields: Partial<StepperFormValues>) => void;
  errors?: Record<string, string>;
}

export const Step4Finance: React.FC<Step4FinanceProps> = ({
  values,
  onChange,
  errors = {},
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const math = useStepperMath(values);

  const handleProfilRHChange = (code: "OPERATEUR" | "TECHNICIEN" | "CADRE" | "PERSONNALISE") => {
    const target = PROFILS_RH.find((p) => p.code === code);
    if (!target) return;

    if (code === "PERSONNALISE") {
      onChange({
        code_profil_rh: code,
      });
    } else {
      onChange({
        code_profil_rh: code,
        salaire_moyen_brut: target.salaireBrutMensuel,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>{t("stepper.step4.title", "Étape 4 : Hypothèses Financières & Ressources Humaines")}</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {t(
            "stepper.step4.desc",
            "Définissez vos perspectives de ventes, votre trajectoire d'exploitation et vos coûts de personnel."
          )}
        </p>
      </div>

      {/* Année de démarrage & CA Cible croisière */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>
              {t("stepper.step4.startYearLabel", "Année de démarrage commercial")}{" "}
              <span className="text-red-500">*</span>
            </span>
          </label>
          <select
            value={values.annee_demarrage}
            onChange={(e) =>
              onChange({ annee_demarrage: parseInt(e.target.value, 10) })
            }
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          >
            {[2025, 2026, 2027, 2028].map((yr) => (
              <option key={yr} value={yr}>
                {t("stepper.step4.startYearOption", { year: yr, defaultValue: `Exercice ${yr}` })}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {t("stepper.step4.startYearHint", "Année N1 de la première facturation client.")}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span>
              {t("stepper.step4.targetCaLabel", "Chiffre d'affaires cible à croisière (MAD HT)")}{" "}
              <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="Ex : 10000000"
              value={values.ca_cible_croisiere || ""}
              onChange={(e) =>
                onChange({
                  ca_cible_croisiere: Math.max(0, parseFloat(e.target.value) || 0),
                })
              }
              className={`w-full pr-14 pl-3.5 rtl:pr-3.5 rtl:pl-14 py-2.5 border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.ca_cible_croisiere ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
              }`}
            />
            <span className="absolute right-3 rtl:right-auto rtl:left-3 top-3 text-xs font-bold text-gray-400">
              {t("stepper.common.mad", "MAD")}
            </span>
          </div>
          {errors.ca_cible_croisiere ? (
            <p className="text-xs text-red-600 mt-1">{errors.ca_cible_croisiere}</p>
          ) : (
            <span className="text-[11px] text-gray-500 mt-1 block">
              {t("stepper.step4.targetCaHint", "CA prévisionnel annuel atteint à 100% de la capacité nominale.")}
            </span>
          )}
        </div>
      </div>

      {/* Profil de montée en charge */}
      <div className="pt-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>
            {t("stepper.step4.growthProfileLabel", "Profil de montée en puissance des ventes")}{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROFILS_MONTEE_CHARGE.map((profil) => {
            const isSelected = values.profil_montee_charge === profil.id;
            return (
              <div
                key={profil.id}
                onClick={() => onChange({ profil_montee_charge: profil.id })}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500 shadow-sm"
                    : "border-gray-300 bg-white hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900">
                      {getProfilRampLabel(profil, lang)}
                    </span>
                    <input
                      type="radio"
                      name="profil_montee_charge"
                      checked={isSelected}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{getProfilRampDesc(profil, lang)}</p>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 block mb-1">
                    {t("stepper.step4.rampTrajectory", "Trajectoire d'activité An 1 à An 6 :")}
                  </span>
                  <div className="grid grid-cols-6 gap-1 text-center font-mono text-[11px] font-bold">
                    {profil.coefficients.map((coeff, idx) => (
                      <div key={idx} className="bg-gray-50 py-0.5 rounded text-gray-700">
                        {coeff}%
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profil RH & Salaires */}
      <div className="pt-2 border-t border-gray-200 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-blue-600" />
          <span>
            {t("stepper.step4.hrPolicyLabel", "Politique Salariale & Grille de Rémunération")}{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROFILS_RH.map((prh) => {
            const isSelected = values.code_profil_rh === prh.code;
            return (
              <button
                key={prh.code}
                type="button"
                onClick={() => handleProfilRHChange(prh.code)}
                className={`p-3 text-left rtl:text-right border rounded-xl transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500 font-bold"
                    : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className="text-xs font-bold block text-gray-900 mb-0.5">
                  {getProfilRHLabel(prh, lang)}
                </span>
                <span className="text-xs font-mono font-bold text-blue-700">
                  {prh.code === "PERSONNALISE"
                    ? t("stepper.step4.freeAmount", "Montant libre")
                    : `${formatMAD(prh.salaireBrutMensuel)} ${t("stepper.step4.perMonth", "/ mois")}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Input Salaire Brut & Calcul CNSS */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {t("stepper.step4.avgSalaryLabel", "Salaire Brut Moyen Mensuel par Salarié (MAD)")}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="4500"
                value={values.salaire_moyen_brut || ""}
                onChange={(e) => {
                  const val = Math.max(0, parseFloat(e.target.value) || 0);
                  onChange({
                    salaire_moyen_brut: val,
                    code_profil_rh: "PERSONNALISE",
                  });
                }}
                className={`w-full pr-14 pl-3.5 rtl:pr-3.5 rtl:pl-14 py-2 bg-white border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.salaire_moyen_brut ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                }`}
              />
              <span className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-xs font-bold text-gray-400">
                {t("stepper.common.mad", "MAD")}
              </span>
            </div>
            {errors.salaire_moyen_brut && (
              <p className="text-xs text-red-600 mt-1">{errors.salaire_moyen_brut}</p>
            )}
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
              <span>{t("stepper.step4.chargedSalaryLabel", "Salaire brut chargé (+21.09% CNSS patronale) :")}</span>
              <span className="font-mono font-bold text-blue-700">
                {formatMAD(math.salaireBrutChargeMensuel)} {t("stepper.step4.perMonth", "/ mois")}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
              <span>
                {t("stepper.step4.annualPayrollLabel", {
                  count: values.emplois_directs,
                  defaultValue: `Masse salariale annuelle (${values.emplois_directs} postes) :`,
                })}
              </span>
              <span className="font-mono font-bold text-emerald-700">
                {formatMAD(math.masseSalarialeAnnuelleEstimee)} {t("stepper.step4.perYear", "/ an")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders COGS & Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-200">
        {/* Slider COGS */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-blue-600" />
              <span>{t("stepper.step4.cogsRatioLabel", "Ratio Matières / COGS (% du CA)")}</span>
            </label>
            <span className="font-mono font-bold text-sm text-blue-700">
              {values.ratio_cogs}%
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="80"
            step="1"
            value={values.ratio_cogs}
            onChange={(e) =>
              onChange({ ratio_cogs: parseInt(e.target.value, 10) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-[11px] text-gray-500">
            {t(
              "stepper.step4.cogsRatioHint",
              "Coût des achats consommés / approvisionnements par rapport au volume des ventes."
            )}
          </p>
        </div>

        {/* Slider Export */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{t("stepper.step4.exportRatioLabel", "Part Exportée à l'International (%)")}</span>
            </label>
            <span className="font-mono font-bold text-sm text-blue-700">
              {values.part_export}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={values.part_export}
            onChange={(e) =>
              onChange({ part_export: parseInt(e.target.value, 10) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-[11px] text-gray-500">
            {t(
              "stepper.step4.exportRatioHint",
              "Pourcentage des ventes destinées aux marchés étrangers (devises)."
            )}
          </p>
        </div>
      </div>

      {/* Paramètres Emprunt Bancaire si financement MIXTE */}
      {values.mode_financement === "MIXTE" && (
        <div className="p-5 bg-purple-50/50 border border-purple-200 rounded-xl space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>
              {t("stepper.step4.loanModalities", {
                amount: formatMAD(math.montantDette),
                defaultValue: `Modalités de l'Emprunt Bancaire (${formatMAD(math.montantDette)})`,
              })}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
                {t("stepper.step4.loanRateLabel", "Taux d'intérêt annuel estimé (%)")}
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="20"
                placeholder="Ex : 6.5"
                value={values.dette_taux ?? 6.5}
                onChange={(e) =>
                  onChange({
                    dette_taux: e.target.value === "" ? null : parseFloat(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2 bg-white border border-purple-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <span className="text-[11px] text-purple-700 mt-1 block">
                {t("stepper.step4.loanRateHint", "Taux moyen bancaire (HT)")}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
                {t("stepper.step4.loanDurationLabel", "Durée du prêt (en années)")}
              </label>
              <input
                type="number"
                min="1"
                max="20"
                placeholder="Ex : 7"
                value={values.dette_duree ?? 7}
                onChange={(e) =>
                  onChange({
                    dette_duree: e.target.value === "" ? null : parseInt(e.target.value, 10),
                  })
                }
                className="w-full px-3.5 py-2 bg-white border border-purple-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <span className="text-[11px] text-purple-700 mt-1 block">
                {t("stepper.step4.loanDurationHint", "Durée de remboursement (généralement 5 à 7 ans)")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
