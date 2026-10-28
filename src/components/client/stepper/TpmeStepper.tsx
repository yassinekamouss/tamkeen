import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
import { useClientAuth } from "../../../contexts/ClientAuthContext";
import { parseApiError } from "../../../utils/apiError";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";


import { StepperHeader } from "../../common/StepperHeader";

interface TpmeStepperProps {
  dossierId: number;
  onSubmitted: () => Promise<void> | void;
}

import {
  DEFAULT_FORM_VALUES,
  buildFormValuesFromTest,
} from "./tpmeMapper";

export const TpmeStepper: React.FC<TpmeStepperProps> = ({
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

  const { dossiers, tests, user } = useClientAuth();

  // Trouver le dossier et le test d'éligibilité associé
  const currentDossier = dossiers.find((d) => d.id === dossierId);
  const currentTest = currentDossier?.test_id
    ? tests.find((t) => t.id === currentDossier.test_id)
    : tests[0] || null;

  // Récupération initiale depuis localStorage ou génération intelligente depuis le test
  const [formValues, setFormValues] = useState<StepperFormValues>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Si la sauvegarde contient des données cohérentes et non l'ancien fallback erroné
        const isStaleFallback =
          parsed.branche_activite === "MANUF-25" ||
          (parsed.secteur_activite === "MANUF" &&
            parsed.branche_activite === "MANUF-1" &&
            currentTest?.secteurTravail === "FabricationMeubles");

        if (parsed.secteur_activite && parsed.secteur_activite !== "IND-AUTO" && !isStaleFallback) {
          return { ...DEFAULT_FORM_VALUES, ...parsed };
        }
      }
    } catch (e) {
      console.warn("Erreur lecture localStorage stepper:", e);
    }

    return buildFormValuesFromTest(currentTest, user);
  });

  const [hasInitializedWithTest, setHasInitializedWithTest] = useState(false);

  // Synchronisation dynamique dès que les tests sont chargés par useClientAuth
  useEffect(() => {
    if (hasInitializedWithTest) return;

    if (currentTest) {
      const saved = localStorage.getItem(storageKey);
      let shouldHydrate = true;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const isStaleFallback =
            parsed.branche_activite === "MANUF-25" ||
            (parsed.secteur_activite === "MANUF" &&
              parsed.branche_activite === "MANUF-1" &&
              currentTest?.secteurTravail === "FabricationMeubles");

          if (
            parsed.secteur_activite &&
            parsed.secteur_activite !== "IND-AUTO" &&
            !isStaleFallback
          ) {
            shouldHydrate = false;
          }
        } catch {
          shouldHydrate = true;
        }
      }

      if (shouldHydrate) {
        setFormValues(buildFormValuesFromTest(currentTest, user));
      }
      setHasInitializedWithTest(true);
    }
  }, [currentTest, user, hasInitializedWithTest, storageKey]);

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitGlobalError, setSubmitGlobalError] = useState<{
    message: string;
    code?: string;
    details?: string[];
  } | null>(null);

  const setGlobalError = (err: unknown, fallback?: string) => {
    if (!err) {
      setSubmitGlobalError(null);
      return;
    }
    if (typeof err === "string") {
      setSubmitGlobalError({ message: err });
      return;
    }
    const parsed = parseApiError(err, fallback);
    setSubmitGlobalError({
      message: parsed.message,
      code: parsed.code,
      details: parsed.detailMessages,
    });
  };

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
      setFormValues(buildFormValuesFromTest(currentTest, user));
      setCurrentStep(1);
      setFileFiscale(null);
      setFileRC(null);
      setFileCNSS(null);
      setErrors({});
    }
  };

  // Validation bloquante par étape
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const isPlan1 = currentDossier?.plan_type === "PLAN_1";

  const handleConfirmDelegate = async () => {
    setIsDelegating(true);
    try {
      await dossierService.delegateStepper(dossierId);
      localStorage.removeItem(storageKey);
      setShowDelegateModal(false);
      await onSubmitted();
    } catch (err: any) {
      console.error("Erreur lors de la délégation:", err);
      setGlobalError(err, "Erreur lors de la délégation.");
      setShowDelegateModal(false);
    } finally {
      setIsDelegating(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formValues.region_id?.trim()) errs.region_id = t("stepper.validation.chooseRegion", "Veuillez choisir une région.");
      if (!isPlan1) {
        if (!formValues.province_id?.trim()) errs.province_id = t("stepper.validation.chooseProvince", "Veuillez choisir une province.");
        if (!formValues.adresse_projet?.trim()) errs.adresse_projet = t("stepper.validation.addressRequired", "L'adresse du projet est requise.");
        if (
          formValues.regime_foncier === "ACQUISITION" &&
          !formValues.titre_foncier?.trim()
        ) {
          errs.titre_foncier = t("stepper.validation.titreRequired", "La référence du titre foncier ou de la réquisition est requise en acquisition.");
        }
      }
    } else if (step === 2) {
      if (!formValues.nature_projet) errs.nature_projet = t("stepper.validation.natureRequired", "Veuillez indiquer la nature du projet.");
      if (!formValues.secteur_activite) errs.secteur_activite = t("stepper.validation.sectorRequired", "Veuillez choisir un secteur d'activité.");
      if (!isPlan1 && (!formValues.emplois_directs || formValues.emplois_directs < 1)) {
        errs.emplois_directs = t("stepper.validation.jobsMin", "Le nombre d'emplois directs doit être d'au moins 1.");
      }
    } else if (step === 3) {
      if (!isPlan1 && math.totalCapex <= 0) {
        errs.totalCapex = t("stepper.validation.capexMin", "Le montant total d'investissement HT doit être supérieur à 0 MAD.");
      }
    } else if (step === 4) {
      if (!isPlan1) {
        if (!formValues.ca_cible_croisiere || formValues.ca_cible_croisiere <= 0) {
          errs.ca_cible_croisiere = t("stepper.validation.caMin", "Le chiffre d'affaires cible doit être supérieur à 0 MAD.");
        }
        if (!formValues.salaire_moyen_brut || formValues.salaire_moyen_brut <= 0) {
          errs.salaire_moyen_brut = t("stepper.validation.salaryMin", "Le salaire brut moyen doit être supérieur à 0 MAD.");
        }
      }
    } else if (step === 5) {
      if (!isPlan1) {
        if (!fileFiscale) errs.file_fiscale = t("stepper.validation.fiscaleRequired", "L'attestation fiscale est obligatoire.");
        if (!fileRC) errs.file_rc = t("stepper.validation.rcRequired", "Le registre de commerce (RC / Modèle J) est obligatoire.");
        if (!fileCNSS) errs.file_cnss = t("stepper.validation.cnssRequired", "L'attestation d'affiliation CNSS est obligatoire.");
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setGlobalError(null);
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setGlobalError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      setGlobalError(
        isPlan1
          ? t("stepper.validation.missingBasic", "Veuillez renseigner les informations de base requises.")
          : t("stepper.validation.missingFiles", "Veuillez joindre les 3 documents obligatoires avant de soumettre.")
      );
      return;
    }

    setIsSubmitting(true);
    setGlobalError(null);

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
      setGlobalError(
        err,
        t("stepper.validation.submitError", "Une erreur est survenue lors de la soumission de votre dossier.")
      );
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
          <div className="flex items-center gap-2">
            {!isPlan1 && (
              <button
                type="button"
                onClick={() => setShowDelegateModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all shadow-xs cursor-pointer"
                title={t("stepper.delegateBtnTitle", "Confier la saisie de ce formulaire à votre consultant")}
              >
                <span>🤝 {t("stepper.delegateBtn", "Déléguer à mon consultant")}</span>
              </button>
            )}
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
        </div>

        {/* Stepper Wizard Bar */}
        <div className="pt-2 sm:pt-3">
          <StepperHeader
            steps={steps.map((s) => ({ number: s.number, label: s.title }))}
            currentStep={currentStep}
            onStepClick={(stepNumber) => {
              if (stepNumber < currentStep || validateStep(currentStep)) {
                setCurrentStep(stepNumber);
              }
            }}
            canClickStep={(stepNumber) => stepNumber <= currentStep}
            showMobileBadge={false}
          />
        </div>
      </div>

      {/* Message d'erreur global */}
      {submitGlobalError && (
        <div className="p-4 bg-red-50 border-l-4 rtl:border-l-0 rtl:border-r-4 border-red-600 rounded-lg flex items-start gap-3 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800 font-medium space-y-1 w-full">
            <span className="font-bold block">{t("stepper.common.attention", "Attention :")}</span>
            <p>{submitGlobalError.message}</p>
            {submitGlobalError.details && submitGlobalError.details.length > 0 && (
              <ul className="list-disc list-inside mt-2 text-xs space-y-1 text-red-700 bg-red-100/60 p-2.5 rounded">
                {submitGlobalError.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}
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

      {/* Modal de confirmation de délégation */}
{showDelegateModal && createPortal(
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4"
    onMouseDown={(e) => {
      if (e.target === e.currentTarget && !isDelegating) setShowDelegateModal(false);
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      className="w-full max-w-md overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl"
    >
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded border border-blue-100 bg-blue-50 text-blue-700">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h3 className="text-base font-semibold leading-snug text-slate-900">
            {t("stepper.delegateModal.title", "Déléguer le montage à votre consultant ?")}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowDelegateModal(false)}
          disabled={isDelegating}
          aria-label="Fermer"
          className="rounded p-1.5 text-base leading-none text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Corps */}
      <div className="px-6 py-5">
        <p className="text-sm leading-relaxed text-slate-600">
          {t(
            "stepper.delegateModal.desc",
            "Vous n'aurez plus à saisir ce formulaire. Votre consultant senior prendra directement la main pour structurer vos données financières et administratives. Vous pourrez échanger avec lui et lui transmettre vos pièces via la messagerie."
          )}
        </p>
      </div>

      {/* Pied */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3">
        <button
          type="button"
          onClick={() => setShowDelegateModal(false)}
          disabled={isDelegating}
          className="rounded border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {t("stepper.delegateModal.cancel", "Continuer moi-même")}
        </button>
        <button
          type="button"
          onClick={handleConfirmDelegate}
          disabled={isDelegating}
          className="inline-flex items-center justify-center gap-2 rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isDelegating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("stepper.delegateModal.delegating", "Délégation...")}</span>
            </>
          ) : (
            <span>{t("stepper.delegateModal.confirm", "Confirmer la délégation")}</span>
          )}
        </button>
      </div>
    </div>
  </div>,
  document.body
)}

      {/* Encart flottant récapitulatif en temps réel */}
      <StepperFloatingSummary values={formValues} />
    </div>
  );
};
