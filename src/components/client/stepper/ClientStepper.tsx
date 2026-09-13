import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Step1Location } from "./Step1Location";
import { Step2Ambition } from "./Step2Ambition";
import { Step3Capex } from "./Step3Capex";
import { Step4Finance } from "./Step4Finance";
import { Step5SummaryUpload } from "./Step5SummaryUpload";
import { StepperFloatingSummary } from "./StepperFloatingSummary";
import {
  type StepperFormValues,
  useStepperMath,
} from "./useStepperMath";
import { dossierService } from "../../../services/dossierService";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface ClientStepperProps {
  dossierId: number;
  onSubmitted: () => Promise<void> | void;
}

const DEFAULT_FORM_VALUES: StepperFormValues = {
  // Étape 1
  region_id: "Casablanca-Settat",
  province_id: "Casablanca",
  adresse_projet: "",
  gps_coordinates: "",
  regime_foncier: "ACQUISITION",
  titre_foncier: "",

  // Étape 2
  nature_projet: "CREATION",
  secteur_activite: "IND-AUTO",
  emplois_directs: 5,
  is_eco_transition: false,
  banque_partenaire: "CDM",

  // Étape 3
  capex_etudes: 150000,
  capex_foncier: 0,
  capex_immeuble: 1200000,
  capex_amenagement: 350000,
  capex_materiel: 1800000,
  capex_divers: 100000,
  mode_financement: "100_FONDS_PROPRES",
  part_fonds_propres: 100,

  // Étape 4
  annee_demarrage: 2026,
  ca_cible_croisiere: 8000000,
  profil_montee_charge: "STANDARD",
  ratio_cogs: 25,
  code_profil_rh: "OPERATEUR",
  salaire_moyen_brut: 4500,
  part_export: 0,
  dette_taux: 6.5,
  dette_duree: 7,
};

export const ClientStepper: React.FC<ClientStepperProps> = ({
  dossierId,
  onSubmitted,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const storageKey = `stepper_dossier_${dossierId}`;

  const steps = [
    { number: 1, title: t("stepper.steps.step1.title", "Implantation"), short: t("stepper.steps.step1.short", "Localisation") },
    { number: 2, title: t("stepper.steps.step2.title", "Ambition"), short: t("stepper.steps.step2.short", "Secteur & Emploi") },
    { number: 3, title: t("stepper.steps.step3.title", "Programme CAPEX"), short: t("stepper.steps.step3.short", "Investissements") },
    { number: 4, title: t("stepper.steps.step4.title", "Hypothèses & RH"), short: t("stepper.steps.step4.short", "Finance & Salaires") },
    { number: 5, title: t("stepper.steps.step5.title", "Synthèse & Pièces"), short: t("stepper.steps.step5.short", "Certification") },
  ];

  // Récupération initiale depuis localStorage
  const [formValues, setFormValues] = useState<StepperFormValues>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return { ...DEFAULT_FORM_VALUES, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Erreur lecture localStorage stepper:", e);
    }
    return DEFAULT_FORM_VALUES;
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitGlobalError, setSubmitGlobalError] = useState<string | null>(null);

  // Fichiers obligatoires pour l'étape 5
  const [fileFiscale, setFileFiscale] = useState<File | null>(null);
  const [fileRC, setFileRC] = useState<File | null>(null);
  const [fileCNSS, setFileCNSS] = useState<File | null>(null);

  const math = useStepperMath(formValues);

  // Sauvegarde automatique dans localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(formValues));
    } catch (e) {
      console.warn("Erreur écriture localStorage stepper:", e);
    }
  }, [formValues, storageKey]);

  const handleChange = (partial: Partial<StepperFormValues>) => {
    setFormValues((prev) => ({ ...prev, ...partial }));
    if (Object.keys(errors).length > 0) {
      const updatedErrors = { ...errors };
      Object.keys(partial).forEach((k) => delete updatedErrors[k]);
      setErrors(updatedErrors);
    }
  };

  const handleReset = () => {
    if (window.confirm(t("stepper.common.confirmReset", "Voulez-vous réinitialiser toutes les données de ce formulaire ?"))) {
      localStorage.removeItem(storageKey);
      setFormValues(DEFAULT_FORM_VALUES);
      setCurrentStep(1);
      setFileFiscale(null);
      setFileRC(null);
      setFileCNSS(null);
      setErrors({});
    }
  };

  // Validation bloquante par étape
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formValues.region_id?.trim()) errs.region_id = t("stepper.validation.chooseRegion", "Veuillez choisir une région.");
      if (!formValues.province_id?.trim()) errs.province_id = t("stepper.validation.chooseProvince", "Veuillez choisir une province.");
      if (!formValues.adresse_projet?.trim()) errs.adresse_projet = t("stepper.validation.addressRequired", "L'adresse du projet est requise.");
      if (
        formValues.regime_foncier === "ACQUISITION" &&
        !formValues.titre_foncier?.trim()
      ) {
        errs.titre_foncier = t("stepper.validation.titreRequired", "La référence du titre foncier ou de la réquisition est requise en acquisition.");
      }
    } else if (step === 2) {
      if (!formValues.nature_projet) errs.nature_projet = t("stepper.validation.natureRequired", "Veuillez indiquer la nature du projet.");
      if (!formValues.secteur_activite) errs.secteur_activite = t("stepper.validation.sectorRequired", "Veuillez choisir un secteur d'activité.");
      if (!formValues.emplois_directs || formValues.emplois_directs < 1) {
        errs.emplois_directs = t("stepper.validation.jobsMin", "Le nombre d'emplois directs doit être d'au moins 1.");
      }
    } else if (step === 3) {
      if (math.totalCapex <= 0) {
        errs.totalCapex = t("stepper.validation.capexMin", "Le montant total d'investissement HT doit être supérieur à 0 MAD.");
      }
    } else if (step === 4) {
      if (!formValues.ca_cible_croisiere || formValues.ca_cible_croisiere <= 0) {
        errs.ca_cible_croisiere = t("stepper.validation.caMin", "Le chiffre d'affaires cible doit être supérieur à 0 MAD.");
      }
      if (!formValues.salaire_moyen_brut || formValues.salaire_moyen_brut <= 0) {
        errs.salaire_moyen_brut = t("stepper.validation.salaryMin", "Le salaire brut moyen doit être supérieur à 0 MAD.");
      }
    } else if (step === 5) {
      if (!fileFiscale) errs.file_fiscale = t("stepper.validation.fiscaleRequired", "L'attestation fiscale est obligatoire.");
      if (!fileRC) errs.file_rc = t("stepper.validation.rcRequired", "Le registre de commerce (RC / Modèle J) est obligatoire.");
      if (!fileCNSS) errs.file_cnss = t("stepper.validation.cnssRequired", "L'attestation d'affiliation CNSS est obligatoire.");
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setSubmitGlobalError(null);
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setSubmitGlobalError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      setSubmitGlobalError(t("stepper.validation.missingFiles", "Veuillez joindre les 3 documents obligatoires avant de soumettre."));
      return;
    }

    setIsSubmitting(true);
    setSubmitGlobalError(null);

    try {
      const formData = new FormData();

      // Pièces jointes
      if (fileFiscale) formData.append("file_fiscale", fileFiscale);
      if (fileRC) formData.append("file_rc", fileRC);
      if (fileCNSS) formData.append("file_cnss", fileCNSS);

      // Données du Stepper sous format JSON
      formData.append("stepper_data", JSON.stringify(formValues));

      // Append également champ par champ pour tolérance maximale du backend
      Object.entries(formValues).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, typeof val === "boolean" ? (val ? "1" : "0") : String(val));
        }
      });

      // Appel de l'API
      await dossierService.submitStepper(dossierId, formData);

      // Nettoyer le localStorage en cas de succès
      localStorage.removeItem(storageKey);

      // Notification au parent pour recharger l'état du dossier
      await onSubmitted();
    } catch (err: any) {
      console.error("Erreur lors de la soumission du Stepper:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        t("stepper.validation.submitError", "Une erreur est survenue lors de la soumission de votre dossier.");
      setSubmitGlobalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Barre de progression des 5 étapes */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              {t("stepper.common.badge", "Formulaire Client Volet 2 · Charte de l'Investissement")}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {t("stepper.common.dossierStep", {
                id: dossierId,
                current: currentStep,
                title: steps[currentStep - 1].title,
                defaultValue: `Dossier #${dossierId} — Étape ${currentStep} sur 5 : ${steps[currentStep - 1].title}`,
              })}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title={t("stepper.common.resetBtn", "Réinitialiser")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("stepper.common.resetBtn", "Réinitialiser")}</span>
          </button>
        </div>

        {/* Stepper Wizard Bar */}
        <div className="relative">
          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          <div
            className={`hidden sm:block absolute top-1/2 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300 ${
              isRTL ? "right-0" : "left-0"
            }`}
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          ></div>

          <div className="flex items-center justify-between relative z-10">
            {steps.map((step) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => {
                    if (step.number < currentStep || validateStep(currentStep)) {
                      setCurrentStep(step.number);
                    }
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
                      isCompleted
                        ? "bg-emerald-600 text-white shadow-sm"
                        : isCurrent
                        ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-md"
                        : "bg-white text-gray-400 border-2 border-gray-300"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-bold mt-2 hidden sm:block ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Message d'erreur global */}
      {submitGlobalError && (
        <div className="p-4 bg-red-50 border-l-4 rtl:border-l-0 rtl:border-r-4 border-red-600 rounded-lg flex items-start gap-3 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800 font-medium">
            <span className="font-bold block">{t("stepper.common.attention", "Attention :")}</span>
            {submitGlobalError}
          </div>
        </div>
      )}

      {/* Contenu de l'étape active */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        {currentStep === 1 && (
          <Step1Location
            values={formValues}
            onChange={handleChange}
            errors={errors}
          />
        )}
        {currentStep === 2 && (
          <Step2Ambition
            values={formValues}
            onChange={handleChange}
            errors={errors}
          />
        )}
        {currentStep === 3 && (
          <Step3Capex
            values={formValues}
            onChange={handleChange}
            errors={errors}
          />
        )}
        {currentStep === 4 && (
          <Step4Finance
            values={formValues}
            onChange={handleChange}
            errors={errors}
          />
        )}
        {currentStep === 5 && (
          <Step5SummaryUpload
            values={formValues}
            fileFiscale={fileFiscale}
            setFileFiscale={setFileFiscale}
            fileRC={fileRC}
            setFileRC={setFileRC}
            fileCNSS={fileCNSS}
            setFileCNSS={setFileCNSS}
            errors={errors}
          />
        )}

        {/* Boutons de navigation */}
        <div className="pt-8 mt-8 border-t border-gray-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{t("stepper.common.previous", "Précédent")}</span>
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-all active:scale-95"
            >
              <span>{t("stepper.common.next", "Suivant")}</span>
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("stepper.common.submitting", "Envoi et certification...")}</span>
                </>
              ) : (
                <>
                  <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                  <span>{t("stepper.common.certifyAndSubmit", "Certifier & Soumettre mon dossier")}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Encart flottant récapitulatif en temps réel */}
      <StepperFloatingSummary values={formValues} />
    </div>
  );
};
