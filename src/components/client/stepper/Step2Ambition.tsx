import React from "react";
import { useTranslation } from "react-i18next";
import {
  SECTEURS_ACTIVITE,
  BANQUES_PARTENAIRES,
  BRANCHES_ACTIVITE,
  getSectorLabel,
  getBankLabel,
} from "./tpmeReferentiels";
import type { StepperFormValues } from "./useStepperMath";
import {
  Rocket,
  Sparkles,
  Users,
  Star,
  Landmark,
  Plus,
  Minus,
} from "lucide-react";

interface Step2AmbitionProps {
  values: StepperFormValues;
  onChange: (fields: Partial<StepperFormValues>) => void;
  errors?: Record<string, string>;
}

export const Step2Ambition: React.FC<Step2AmbitionProps> = ({
  values,
  onChange,
  errors = {},
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const handleEmploisStep = (delta: number) => {
    const current = Number(values.emplois_directs) || 0;
    const nextVal = Math.max(1, current + delta);
    onChange({ emplois_directs: nextVal });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-blue-600" />
          <span>{t("stepper.step2.title", "Étape 2 : Ambition & Secteur d'Activité")}</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {t(
            "stepper.step2.desc",
            "Renseignez la typologie du projet, le secteur cible et vos engagements en matière d'emploi et de développement durable."
          )}
        </p>
      </div>

      {/* Nature du Projet (Segmented Control) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          {t("stepper.step2.natureLabel", "Nature de l'investissement")} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl border border-gray-200 max-w-md">
          <button
            type="button"
            onClick={() => onChange({ nature_projet: "CREATION" })}
            className={`py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              values.nature_projet === "CREATION"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t("stepper.step2.creationTitle", "Création d'entreprise")}</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ nature_projet: "EXTENSION" })}
            className={`py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              values.nature_projet === "EXTENSION"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>{t("stepper.step2.extensionTitle", "Extension d'activité")}</span>
          </button>
        </div>
      </div>

      {/* Secteurs et Branches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            {t("stepper.step2.secteurLabel", "Secteur d'activité")} <span className="text-red-500">*</span>
          </label>
          <select
            value={values.secteur_activite || ""}
            onChange={(e) => {
              const newSector = e.target.value;
              const branches = BRANCHES_ACTIVITE.filter((b) => b.sectorCode === newSector);
              onChange({
                secteur_activite: newSector,
                branche_activite: branches.length > 0 ? branches[0].id : "",
              });
            }}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
              errors.secteur_activite ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              Sélectionnez un secteur
            </option>
            {SECTEURS_ACTIVITE.map((sec) => (
              <option key={sec.code} value={sec.code}>
                {getSectorLabel(sec, lang)}
              </option>
            ))}
          </select>
          {errors.secteur_activite && (
            <p className="text-xs text-red-600 mt-1">{errors.secteur_activite}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            {t("stepper.step2.brancheLabel", "Branche d'activité")} <span className="text-red-500">*</span>
          </label>
          <select
            value={values.branche_activite || ""}
            onChange={(e) => onChange({ branche_activite: e.target.value })}
            disabled={!values.secteur_activite}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
              errors.branche_activite ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              Sélectionnez une branche
            </option>
            {BRANCHES_ACTIVITE.filter(b => b.sectorCode === values.secteur_activite).map((br) => (
              <option key={br.id} value={br.id}>
                {br.label}
              </option>
            ))}
          </select>
          {errors.branche_activite && (
            <p className="text-xs text-red-600 mt-1">{errors.branche_activite}</p>
          )}
        </div>
      </div>

      {/* Emplois directs & Transition écologique */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {/* Emplois directs (Compteur numérique) */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            <span>
              {t("stepper.step2.jobsLabel", "Emplois directs à créer / consolider")}{" "}
              <span className="text-red-500">*</span>
            </span>
          </label>
          <p className="text-xs text-gray-500">
            {t("stepper.step2.jobsDesc", "Nombre d'emplois déclarés à la CNSS sur les 3 premières années.")}
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleEmploisStep(-1)}
              className="w-10 h-10 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min="1"
              max="1000"
              value={values.emplois_directs || ""}
              onChange={(e) =>
                onChange({
                  emplois_directs: Math.max(1, parseInt(e.target.value, 10) || 1),
                })
              }
              className="w-24 text-center font-mono font-bold text-lg px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleEmploisStep(1)}
              className="w-10 h-10 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-gray-600">
              {t("stepper.step2.jobsUnit", "postes directs")}
            </span>
          </div>
          {errors.emplois_directs && (
            <p className="text-xs text-red-600">{errors.emplois_directs}</p>
          )}
        </div>

        {/* Toggle Activité Prioritaire */}
        <div
          onClick={() => onChange({ is_activite_prioritaire: !values.is_activite_prioritaire })}
          className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
            values.is_activite_prioritaire
              ? "border-amber-500 bg-amber-50/60 ring-2 ring-amber-400"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Star className={`w-4 h-4 ${values.is_activite_prioritaire ? 'text-amber-600 fill-amber-500' : 'text-gray-400'}`} />
                <span className="text-sm font-bold text-gray-900">
                  Activité Prioritaire
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  10%
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Le projet relève-t-il spécifiquement d'une activité prioritaire au sein de la branche ?
              </p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={values.is_activite_prioritaire || false}
                onChange={() => {}}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </div>
          </div>
          <div className="text-[11px] font-medium text-amber-700 pt-2">
            {values.is_activite_prioritaire
              ? "✔ Prime d'activité prioritaire de 10% activée"
              : "Activez si votre activité exacte figure dans la liste 2"}
          </div>
        </div>
      </div>

      {/* Banque Partenaire Pressentie */}
      <div className="pt-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
          <Landmark className="w-4 h-4 text-gray-600" />
          <span>
            {t("stepper.step2.bankLabel", "Banque partenaire pressentie")}{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
        <select
          value={values.banque_partenaire}
          onChange={(e) => onChange({ banque_partenaire: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        >
          {BANQUES_PARTENAIRES.map((bq) => (
            <option key={bq.code} value={bq.code}>
              {getBankLabel(bq, lang)}{" "}
              {bq.isDefault ? t("stepper.step2.bankSuggested", "(Partenaire suggéré)") : ""}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-gray-500 mt-1">
          {t(
            "stepper.step2.bankDesc",
            "L'organisme bancaire qui réceptionnera votre dossier de financement et le rapport de subvention certifié."
          )}
        </p>
      </div>
    </div>
  );
};
