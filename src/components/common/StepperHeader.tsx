import React from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface StepperHeaderStep {
  number: number;
  label: string;
  sublabel?: string;
}

export interface StepperHeaderProps {
  steps: StepperHeaderStep[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
  canClickStep?: (stepNumber: number) => boolean;
  isStepCompleted?: (stepNumber: number) => boolean;
  showMobileBadge?: boolean;
  className?: string;
}

export const StepperHeader: React.FC<StepperHeaderProps> = ({
  steps,
  currentStep,
  onStepClick,
  canClickStep,
  isStepCompleted,
  showMobileBadge = true,
  className = "",
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl" || i18n.language === "ar";
  const lastIndex = steps.length - 1;
  const currentStepItem =
    steps.find((s) => s.number === currentStep) ||
    steps[currentStep - 1] ||
    steps[0];

  return (
    <div className={`w-full ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Mobile compact badge */}
      {showMobileBadge && currentStepItem && (
        <div className="sm:hidden mb-4 text-center">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] text-[#1A73E8] border border-[#DADCE0] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-2xs"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            <span>{currentStepItem.label}</span>
            <span className="text-[#DADCE0]">•</span>
            <span>
              {t("stepper.common.mobileStep", {
                current: currentStep,
                total: steps.length,
                defaultValue: `Étape ${currentStep} sur ${steps.length}`,
              })}
            </span>
          </span>
        </div>
      )}

      {/* Stepper bar */}
      <ol className="flex items-center w-full" aria-label="Progression">
        {steps.map((step, index) => {
          const isCompleted = isStepCompleted
            ? isStepCompleted(step.number)
            : step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable = Boolean(onStepClick);
          const isCursorAllowed =
            isClickable && (canClickStep ? canClickStep(step.number) : true);

          return (
            <li
              key={step.number}
              className={`flex items-center ${index < lastIndex ? "flex-1" : ""}`}
            >
              {isClickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(step.number)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${step.label} - ${
                    isCompleted
                      ? t("stepper.common.completed", "Terminée")
                      : isCurrent
                      ? t("stepper.common.current", "En cours")
                      : t("stepper.common.upcoming", "À venir")
                  }`}
                  className={`flex items-center rounded-lg p-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8] focus-visible:ring-offset-2 ${
                    isCursorAllowed ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isCompleted
                        ? "border-[#1A73E8] bg-[#1A73E8] text-white shadow-xs"
                        : isCurrent
                        ? "border-[#1A73E8] bg-white text-[#1A73E8] ring-4 ring-blue-50 font-bold shadow-xs"
                        : "border-[#DADCE0] bg-white text-[#727785]"
                    }`}
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                    ) : (
                      step.number
                    )}
                  </span>
                  <div className="hidden sm:flex flex-col text-start ms-2.5">
                    <span
                      className={`text-xs sm:text-sm transition-colors ${
                        isCurrent
                          ? "text-[#1A73E8] font-bold"
                          : isCompleted
                          ? "text-[#191C1D] font-semibold"
                          : "text-[#727785] font-medium"
                      }`}
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {step.label}
                    </span>
                    {step.sublabel && (
                      <span className="text-[11px] text-[#727785] font-normal leading-tight hidden md:block">
                        {step.sublabel}
                      </span>
                    )}
                  </div>
                </button>
              ) : (
                <div
                  aria-current={isCurrent ? "step" : undefined}
                  className="flex items-center p-1 cursor-default select-none"
                >
                  <span
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isCompleted
                        ? "border-[#1A73E8] bg-[#1A73E8] text-white shadow-xs"
                        : isCurrent
                        ? "border-[#1A73E8] bg-white text-[#1A73E8] ring-4 ring-blue-50 font-bold shadow-xs"
                        : "border-[#DADCE0] bg-white text-[#727785]"
                    }`}
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                    ) : (
                      step.number
                    )}
                  </span>
                  <div className="hidden sm:flex flex-col text-start ms-2.5">
                    <span
                      className={`text-xs sm:text-sm transition-colors ${
                        isCurrent
                          ? "text-[#1A73E8] font-bold"
                          : isCompleted
                          ? "text-[#191C1D] font-semibold"
                          : "text-[#727785] font-medium"
                      }`}
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {step.label}
                    </span>
                    {step.sublabel && (
                      <span className="text-[11px] text-[#727785] font-normal leading-tight hidden md:block">
                        {step.sublabel}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Connecting line */}
              {index < lastIndex && (
                <div
                  className={`mx-2 sm:mx-3 h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                    isCompleted ? "bg-[#1A73E8]" : "bg-[#DADCE0]"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default StepperHeader;
