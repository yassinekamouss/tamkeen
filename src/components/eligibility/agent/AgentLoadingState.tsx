import React from "react";
import { useTranslation } from "react-i18next";

const AgentLoadingState: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";

  return (
    <div className="bg-white border border-[#E4E4E7] p-8 sm:p-10 text-center animate-fadeIn">
      {/* Agent Avatar Badge */}
      <div className="w-16 h-16 mx-auto mb-6 bg-[#1E5ED8]/10 border border-[#1E5ED8]/20 flex items-center justify-center relative">
        <span className="w-3 h-3 bg-[#1E5ED8] rounded-full animate-ping absolute top-1 right-1" />
        <svg
          className="w-8 h-8 text-[#1E5ED8] animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.591.659H9.061a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V17a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 17v-2.5"
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold font-display text-[#111827] uppercase tracking-wide mb-2">
        {lang === "ar"
          ? "جاري تحليل مشروعك بواسطة المستشار الرقمي..."
          : "Analyse personnalisée de votre projet en cours..."}
      </h3>

      <p className="text-sm text-[#1F2937]/70 mb-6 font-light max-w-md mx-auto">
        {lang === "ar"
          ? "يقوم المستشار الذكي بدراسة معايير جميع البرامج التمويلية لتحديد أفضل سبل التكيف والحلول البديلة."
          : "L'Agent Consultant Tamkeen examine les critères de l'ensemble des programmes pour identifier les ajustements ou alternatives possibles."}
      </p>

      {/* Shimmer loading bars */}
      <div className="space-y-3 max-w-md mx-auto">
        <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-4/5 mx-auto" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3 mx-auto" />
      </div>
    </div>
  );
};

export default AgentLoadingState;
