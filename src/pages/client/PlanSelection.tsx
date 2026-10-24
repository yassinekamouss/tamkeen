import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";
import { useTranslation } from "react-i18next";
import { Check, ShieldCheck } from "lucide-react";

interface PlanSelectionProps {
  dossierId: number;
  onPlanSelected: () => void;
}

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
  mono: "font-['JetBrains_Mono',_monospace]",
};

const PlanSelection: React.FC<PlanSelectionProps> = ({ dossierId, onPlanSelected }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [error, setError] = useState<string | null>(null);

  const selectPlanMutation = useMutation({
    mutationFn: async (planType: "PLAN_1" | "PLAN_2" | "PLAN_3") => {
      return await dossierService.selectPlan(dossierId, planType);
    },
    onSuccess: () => {
      onPlanSelected();
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || err.message || t("clientProfile.defaultError", "Une erreur est survenue lors de la sélection du plan.")
      );
    },
  });

  return (
    <div className={`p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-8 ${font.body}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* En-tête officiel */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
          <span>{t("planSelection.badge", "Charte de l'Investissement · Formules d'Accompagnement")}</span>
        </div>
        <h2 className={`${font.display} text-2xl md:text-3xl font-bold text-slate-900 tracking-tight`}>
          {t("planSelection.title", "Choisissez votre formule de subvention")}
        </h2>
        <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
          {t("planSelection.subtitle", "Sélectionnez le niveau d'intervention adapté à votre projet, de l'étude autonome jusqu'au mandat officiel de postulation clé en main.")}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium text-center max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {/* Grille des 3 Formules */}
      <div className="grid md:grid-cols-3 gap-6 items-stretch pt-2">
        {/* Formule 1 */}
        <div className="bg-white rounded-lg border border-slate-300 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-400 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {t("planSelection.plan1.badge", "Formule 1")}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {t("planSelection.plan1.tag", "Volet Autonome")}
              </span>
            </div>

            <div>
              <h3 className={`${font.display} text-base font-bold text-slate-900`}>
                {t("planSelection.plan1.title", "Étude & Rapport d'Investissement")}
              </h3>
              <p className="text-slate-600 text-xs mt-1.5 leading-relaxed min-h-[44px]">
                {t("planSelection.plan1.desc", "Formulaire allégé sans obligation de pièces. Permet d'obtenir une modélisation financière immédiate.")}
              </p>
            </div>

            <div className="pt-3 pb-2 border-y border-slate-100 flex items-baseline gap-2">
              <span className={`${font.mono} text-3xl font-bold text-slate-900`}>
                {t("planSelection.plan1.price", "1 990")}
              </span>
              <span className="text-slate-500 font-semibold text-xs">{t("planSelection.plan1.currency", "DH TTC")}</span>
            </div>

            <ul className="space-y-2.5 pt-1 text-xs">
              <li className="flex items-start gap-2 text-slate-800">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan1.feature1", "Saisie allégée : pièces justificatives facultatives")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-800">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan1.feature2", "Calcul des primes territoriales et sectorielles (Charte TPME)")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-800">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan1.feature3", "Modélisation financière prévisionnelle (CPC 5 ans)")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-800">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan1.feature4", "Délivrance immédiate du rapport d'investissement en PDF")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <span className="w-4 h-4 text-slate-300 shrink-0 text-center font-bold">✕</span>
                <span className="line-through">{t("planSelection.plan1.noChat", "Sans messagerie dédiée ni audit de conformité")}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => selectPlanMutation.mutate("PLAN_1")}
            disabled={selectPlanMutation.isPending}
            className="mt-6 w-full py-2.5 px-4 rounded border border-slate-300 bg-white text-slate-800 font-semibold text-xs hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {selectPlanMutation.isPending ? t("planSelection.selectingBtn", "Sélection en cours...") : t("planSelection.selectPlan1Btn", "Souscrire à la Formule 1")}
          </button>
        </div>

        {/* Formule 2 (Recommandée) */}
        <div className="bg-white rounded-lg border-2 border-slate-900 p-6 flex flex-col justify-between relative shadow-sm">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded shadow-2xs">
            {t("planSelection.plan2.tag", "Recommandé par le cabinet")}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                {t("planSelection.plan2.badge", "Formule 2")}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-900 border border-slate-200">
                {t("planSelection.plan2.subtag", "Accompagnement Expert")}
              </span>
            </div>

            <div>
              <h3 className={`${font.display} text-base font-bold text-slate-900`}>
                {t("planSelection.plan2.title", "Montage Complet & Conseil Dédié")}
              </h3>
              <p className="text-slate-600 text-xs mt-1.5 leading-relaxed min-h-[44px]">
                {t("planSelection.plan2.desc", "Un conseiller d'affaires dédié audite vos pièces, certifie vos ratios et structure votre dossier de demande.")}
              </p>
            </div>

            <div className="pt-3 pb-2 border-y border-slate-100 flex items-baseline gap-2">
              <span className={`${font.mono} text-3xl font-bold text-slate-900`}>
                {t("planSelection.plan2.price", "5 900")}
              </span>
              <span className="text-slate-500 font-semibold text-xs">{t("planSelection.plan2.currency", "DH TTC")}</span>
            </div>

            <ul className="space-y-2.5 pt-1 text-xs">
              <li className="flex items-start gap-2 text-slate-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="font-semibold">{t("planSelection.plan2.feature1", "Intègre tous les livrables de la Formule 1")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan2.feature2", "Attribution d'un conseiller d'affaires référent")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan2.feature3", "Registre officiel d'échanges & requêtes de pièces")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan2.feature4", "Option de délégation intégrale de saisie au conseiller")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan2.feature5", "Modélisation financière certifiée pour banques et CRI")}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => selectPlanMutation.mutate("PLAN_2")}
            disabled={selectPlanMutation.isPending}
            className="mt-6 w-full py-2.5 px-4 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 cursor-pointer"
          >
            {selectPlanMutation.isPending ? t("planSelection.selectingBtn", "Sélection en cours...") : t("planSelection.selectPlan2Btn", "Souscrire à la Formule 2")}
          </button>
        </div>

        {/* Formule 3 */}
        <div className="bg-white rounded-lg border border-slate-300 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-400 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                {t("planSelection.plan3.badge", "Formule 3")}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-900 border border-slate-200">
                {t("planSelection.plan3.tag", "Mandat Intégral")}
              </span>
            </div>

            <div>
              <h3 className={`${font.display} text-base font-bold text-slate-900`}>
                {t("planSelection.plan3.title", "Postulation Officielle Clé en Main")}
              </h3>
              <p className="text-slate-600 text-xs mt-1.5 leading-relaxed min-h-[44px]">
                {t("planSelection.plan3.desc", "Mandat complet : notre cabinet prend en charge le dépôt et l'instruction de votre dossier auprès de la CRI.")}
              </p>
            </div>

            <div className="pt-3 pb-2 border-y border-slate-100 flex items-baseline gap-2">
              <span className={`${font.mono} text-3xl font-bold text-slate-900`}>
                {t("planSelection.plan3.price", "14 900")}
              </span>
              <span className="text-slate-500 font-semibold text-xs">{t("planSelection.plan3.currency", "DH TTC")}</span>
            </div>

            <ul className="space-y-2.5 pt-1 text-xs">
              <li className="flex items-start gap-2 text-slate-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="font-semibold">{t("planSelection.plan3.feature1", "Intègre l'intégralité des prestations Formule 2")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan3.feature2", "Mandat de représentation et dépôt officiel auprès de la CRI")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan3.feature3", "Suivi en direct des 5 jalons de conventionnement")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan3.feature4", "Gestion des requêtes de conformité avec les administrations")}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t("planSelection.plan3.feature5", "Accompagnement jusqu'à la signature et décaissement")}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => selectPlanMutation.mutate("PLAN_3")}
            disabled={selectPlanMutation.isPending}
            className="mt-6 w-full py-2.5 px-4 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 cursor-pointer"
          >
            {selectPlanMutation.isPending ? t("planSelection.selectingBtn", "Sélection en cours...") : t("planSelection.selectPlan3Btn", "Souscrire à la Formule 3")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
