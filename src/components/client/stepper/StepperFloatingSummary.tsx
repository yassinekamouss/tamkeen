import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { StepperFormValues } from "./useStepperMath";
import { useStepperMath, formatMAD, formatPercent } from "./useStepperMath";
import { Sparkles, ChevronUp, ChevronDown } from "lucide-react";

interface StepperFloatingSummaryProps {
  values: StepperFormValues;
}

export const StepperFloatingSummary: React.FC<StepperFloatingSummaryProps> = ({
  values,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const math = useStepperMath(values);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky bottom-4 z-30 max-w-4xl mx-auto px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-white/95 backdrop-blur-md border border-blue-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl overflow-hidden transition-all duration-300">
        {/* En-tête dépliable */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {t("stepper.floatingSummary.badge", "Prime Estimée (Charte TPME)")}
                </span>
                <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  +{formatPercent(math.tauxGlobal)}
                </span>
              </div>
              <div className="text-sm sm:text-base font-black font-mono text-gray-900">
                {formatMAD(math.montantSubventionEstimee)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right rtl:text-left">
              <span className="text-[11px] text-gray-500 font-medium">
                {t("stepper.floatingSummary.capexBase", "Assiette CAPEX HT")}
              </span>
              <span className="text-xs font-bold font-mono text-gray-800">
                {formatMAD(math.totalCapex)}
              </span>
            </div>

            <button
              type="button"
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Toggle details"
            >
              {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Détails dépliables */}
        {isOpen && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fadeIn">
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                {t("stepper.floatingSummary.territory", "Territoire")}
              </span>
              <span className="font-bold text-gray-800 font-mono">
                {math.zone} (+{formatPercent(math.tauxTerritoriale)})
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                {t("stepper.floatingSummary.sector", "Secteur")}
              </span>
              <span className="font-bold text-gray-800 font-mono">
                {math.tauxSectorielle > 0
                  ? t("stepper.floatingSummary.sectorPriority", "+5% Prioritaire")
                  : t("stepper.floatingSummary.sectorStandard", "0% Standard")}
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                {t("stepper.floatingSummary.ecoBonus", "Bonus Durable")}
              </span>
              <span className="font-bold text-gray-800 font-mono">
                {math.bonusEcologique > 0
                  ? t("stepper.floatingSummary.ecoActive", "+3% Activé")
                  : t("stepper.floatingSummary.ecoInactive", "0% Non activé")}
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                {t("stepper.floatingSummary.equity", "Fonds Propres")}
              </span>
              <span className="font-bold text-blue-700 font-mono">
                {math.partFondsPropresPct}% ({formatMAD(math.montantFondsPropres)})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
