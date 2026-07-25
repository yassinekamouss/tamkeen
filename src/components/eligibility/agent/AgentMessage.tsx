import React from "react";
import type { AgentResponseData, AgentProgramRef } from "../types";
import { useTranslation } from "react-i18next";

interface AgentMessageProps {
  data: AgentResponseData;
  programs?: AgentProgramRef[];
}

const AgentMessage: React.FC<AgentMessageProps> = ({ data, programs = [] }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const isAr = lang === "ar";

  const { agentMessage, analysis } = data;

  // Deterministic lookup: find program link by exact numeric programId
  const getProgramLink = (programId: number): string | null => {
    if (!programs.length || !programId) return null;
    const matched = programs.find((p) => p.id === programId);
    return matched?.link || null;
  };

  const getMatchBadge = (level: "HIGH" | "MEDIUM" | "LOW") => {
    switch (level) {
      case "HIGH":
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            {isAr ? "تطابق مرتفع" : "Match Élevé (~80%)"}
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {isAr ? "تطابق متوسط" : "Match Moyen (~50%)"}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
            {isAr ? "برنامج بديل" : "Alternative"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left" dir={isAr ? "rtl" : "ltr"}>
      {/* Agent Main Message Bubble */}
      <div className="bg-[#F9FAFB] border border-[#E4E4E7] p-6 text-[#111827] space-y-3">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <div className="w-8 h-8 bg-[#1E5ED8] text-white flex items-center justify-center font-bold text-xs font-display">
            IA
          </div>
          <div>
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-[#111827]">
              {isAr ? "مستشار تمكين الرقمي" : "Conseiller Expert Tamkeen"}
            </h4>
            <span className="text-xs text-[#1F2937]/60">
              {isAr ? "تحليل الذكاء الاصطناعي والتوجيه" : "Analyse d'éligibilité & Recommandations"}
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[#1F2937] whitespace-pre-line font-normal">
          {agentMessage}
        </p>
      </div>

      {/* Closest Programs Analysis Card */}
      {analysis?.closestPrograms && analysis.closestPrograms.length > 0 && (
        <div className="bg-white border border-[#E4E4E7] p-6 space-y-4">
          <h4 className="text-xs font-bold font-display uppercase tracking-wider text-[#1E5ED8]">
            {isAr ? "البرامج الأكثر ملاءمة لمشروعك" : "Programmes les plus proches de votre profil"}
          </h4>

          <div className="space-y-4">
            {analysis.closestPrograms.map((prog, idx) => {
              const programLink = getProgramLink(prog.programId);
              return (
              <div key={idx} className="p-4 bg-[#F9FAFB] border border-[#E4E4E7] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-sm text-[#111827]">{prog.programName}</h5>
                    {programLink && (
                      <a
                        href={programLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1E5ED8] underline hover:no-underline"
                      >
                        {isAr ? "↗ عرض البرنامج" : "↗ Voir le programme"}
                      </a>
                    )}
                  </div>
                  {getMatchBadge(prog.matchLevel)}
                </div>

                {prog.blockingCriteria && prog.blockingCriteria.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-red-600 block mb-1">
                      {isAr ? "النقطة المانحة/الشرط غير المستوفى:" : "Point de blocage à ajuster :"}
                    </span>
                    <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                      {prog.blockingCriteria.map((crit, cIdx) => (
                        <li key={cIdx}>{crit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {prog.remediationTips && prog.remediationTips.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 block mb-1">
                      {isAr ? "طريقة العلاج المقترحة:" : "Piste de solution recommandée :"}
                    </span>
                    <ul className="list-disc list-inside text-xs text-emerald-800 space-y-1">
                      {prog.remediationTips.map((tip, tIdx) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
            })}
          </div>
        </div>
      )}

      {/* Profile Strengths & General Advice */}
      {((analysis?.profileStrengths && analysis.profileStrengths.length > 0) ||
        analysis?.generalAdvice) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis?.profileStrengths && analysis.profileStrengths.length > 0 && (
            <div className="bg-emerald-50/50 border border-emerald-200 p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                {isAr ? "نقاط القوة في ملفك" : "Points forts de votre dossier"}
              </h5>
              <ul className="list-disc list-inside text-xs text-emerald-900 space-y-1">
                {analysis.profileStrengths.map((str, sIdx) => (
                  <li key={sIdx}>{str}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis?.generalAdvice && (
            <div className="bg-blue-50/50 border border-blue-200 p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">
                {isAr ? "نصيحة الاستراتيجية" : "Conseil stratégique"}
              </h5>
              <p className="text-xs text-blue-900 leading-relaxed font-light">
                {analysis.generalAdvice}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentMessage;
