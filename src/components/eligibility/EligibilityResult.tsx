import React, { useEffect, useRef } from "react";
import type { FormData, programsNamesAndLinks } from "./types";
import { useTranslation } from "react-i18next";
import { sanitizeFrenchText } from "../../utils/sanitize";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import AgentChat from "./agent/AgentChat";

interface EligibilityResultProps {
  isEligible: boolean;
  eligibleProgram: programsNamesAndLinks[];
  formData: FormData;
  onNewTest: () => void;
  onSimulate?: (fieldToAdjust?: string, suggestedValue?: string) => void;
  testId?: string | null;
  onEditForm?: (fieldsToClear?: string[]) => void;
  isCorrectedFlow?: boolean;
}

const EligibilityResult: React.FC<EligibilityResultProps> = ({
  isEligible,
  eligibleProgram,
  formData,
  onNewTest,
  onSimulate,
  testId,
  onEditForm,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (cardRef.current) {
        try {
          cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (e) {
          const top =
            cardRef.current.getBoundingClientRect().top +
            window.scrollY -
            window.innerHeight / 2 +
            cardRef.current.clientHeight / 2;
          window.scrollTo({ top, left: 0, behavior: "smooth" });
        }
      }
    });
  }, []);

  // --- NON ÉLIGIBLE : Agent IA de remédiation ---
  if (!isEligible) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center font-sans">
        <div ref={cardRef} className="w-full max-w-3xl mx-auto">
          <AgentChat
            formData={formData}
            testId={testId}
            onNewTest={onNewTest}
            onContactAdvisor={() => {}}
            onSimulate={onSimulate}
            onEditForm={onEditForm}
          />
        </div>
      </div>
    );
  }

  // --- ÉLIGIBLE : V2 Fork (Plan 1 vs Plan 2) ---
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 sm:py-16 px-4" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div
          ref={cardRef}
          className="bg-white border border-[#DADCE0] shadow-sm rounded-xl p-6 sm:p-10 space-y-8"
        >
          {/* Header Résultats Éligibilité */}
          <div className="border-b border-[#DADCE0] pb-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] text-[#1A73E8] border border-[#DADCE0] rounded-full text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-pulse" />
              {t("eligibility.title", "Résultat du Test d'Éligibilité")}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 bg-[#F8F9FA] text-[#1A73E8] border border-[#DADCE0] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-[#1A73E8]" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#191C1D] tracking-tight" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {t("eligibilityResult.eligible", "Félicitations ! Vous êtes éligible")}
                </h2>
                <p className="text-[#5F6368] text-[14px] mt-1 leading-relaxed">
                  {t(
                    "eligibilityResult.message.eligible",
                    "Sur la base de vos déclarations, votre projet peut bénéficier de subventions d'investissement."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Liste des programmes éligibles */}
          {eligibleProgram.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[12px] font-bold text-[#5F6368] uppercase tracking-wider" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {t("eligibilityResult.programsTitle", "Programmes de subvention identifiés")}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {eligibleProgram.map((program) => {
                  const link = program.link.startsWith("http")
                    ? program.link
                    : `https://${program.link}`;
                  const rawName =
                    program.name?.[lang] || program.name?.fr || "";
                  const displayName =
                    lang === "fr" ? sanitizeFrenchText(rawName) : rawName;

                  return (
                    <div
                      key={program.id || program.link}
                      className="border border-[#DADCE0] rounded-xl p-4 bg-white hover:bg-[#F8F9FA] hover:border-[#1A73E8] transition-all duration-200 flex items-center justify-between shadow-sm"
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[16px] text-[#1A73E8] hover:text-[#174EA6] transition-colors flex items-center gap-2"
                        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                      >
                        <span>{displayName}</span>
                        <ArrowRight className="w-4 h-4 text-[#1A73E8]" />
                      </a>
                      <span className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-[#F8F9FA] text-[#191C1D] border border-[#DADCE0]" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        Éligible
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message de Succès avec icône d'enveloppe */}
          <div className="pt-6 border-t border-[#DADCE0]">
            <div className="bg-[#F8F9FA] border border-[#DADCE0] rounded-xl p-8 text-center space-y-5 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-full bg-white border border-[#DADCE0] text-[#1A73E8] flex items-center justify-center shadow-sm">
                <Mail className="w-8 h-8" />
              </div>
              <div className="max-w-lg mx-auto space-y-2">
                <h3 className="text-xl font-bold text-[#191C1D]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {t(
                    "eligibilityResult.workspaceReadyTitle",
                    "Votre Espace de Travail est Prêt !"
                  )}
                </h3>
                <p className="text-[#5F6368] text-[14px] sm:text-[15px] leading-relaxed">
                  {t(
                    "eligibilityResult.workspaceReady",
                    "Félicitations, votre espace de travail est prêt ! Un email vient de vous être envoyé. Veuillez cliquer sur le lien qu'il contient pour définir votre mot de passe et accéder à votre tableau de bord."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Bouton pour relancer un test */}
          <div className="pt-6 border-t border-[#DADCE0] flex justify-end">
            <button
              onClick={onNewTest}
              className="text-[14px] font-bold text-[#5F6368] hover:text-[#191C1D] transition-colors cursor-pointer inline-flex items-center gap-2"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t("eligibilityResult.newTestButton", "Effectuer un nouveau test")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityResult;
