import React, { useState, useEffect, useRef } from "react";
import type { FormData, programsNamesAndLinks } from "./types";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import Modal from "./Modals/Modal";
import { sanitizeFrenchText } from "../../utils/sanitize";
import { CheckCircle2 } from "lucide-react";
import AgentChat from "./agent/AgentChat";

interface EligibilityResultProps {
  isEligible: boolean;
  eligibleProgram: programsNamesAndLinks[];
  formData: FormData;
  onNewTest: () => void;
  onSimulate?: (fieldToAdjust?: string, suggestedValue?: string) => void;
  testId?: string | null;
}

const EligibilityResult: React.FC<EligibilityResultProps> = ({
  isEligible,
  eligibleProgram,
  formData,
  onNewTest,
  onSimulate,
  testId,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (cardRef.current) {
        try {
          cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (e) {
          const top = cardRef.current.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + cardRef.current.clientHeight / 2;
          window.scrollTo({ top, left: 0, behavior: "smooth" });
        }
      }
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmContact = async () => {
    if (!testId) {
      setIsModalOpen(true);
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.patch(`/test/eligibilite/${testId}/contact`);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      alert(t("eligibilityResult.errorMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // --- NOT ELIGIBLE: Render AI Remediation Agent ---
  if (!isEligible) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 flex items-center justify-center font-body">
        <div ref={cardRef} className="w-full max-w-3xl mx-auto">
          <AgentChat
            formData={formData}
            testId={testId}
            onNewTest={onNewTest}
            onContactAdvisor={handleConfirmContact}
            onSimulate={onSimulate}
          />

          {/* Contact confirmation modal */}
          <Modal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            title={t("eligibility.agent.requestTransmitted")}
            size="md"
          >
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 border border-emerald-100 rounded-none flex items-center justify-center">
                <div className="w-10 h-10 bg-emerald-500 rounded-none flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-[#1F2937]/75 text-sm sm:text-base leading-relaxed mb-6 font-light">
                {t("eligibility.agent.requestSuccess")}
              </p>
              <button
                onClick={handleCloseModal}
                className="w-full bg-[#1E5ED8] hover:bg-[#111827] text-white font-display font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-none transition-colors duration-200 cursor-pointer"
              >
                {t("eligibility.agent.understood")}
              </button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }

  // --- ELIGIBLE ---
  return (
    <>
      <div className="min-h-screen bg-[#FFFFFF] py-12 sm:py-20 px-4 font-body">
        <div className="max-w-3xl mx-auto">
          <div
            ref={cardRef}
            className="bg-[#FFFFFF] border border-[#E4E4E7] shadow-sm p-6 sm:p-10 space-y-8"
          >
            <div className="border-b border-[#E4E4E7] pb-6 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E5ED8]/10 text-[#1E5ED8] border border-[#1E5ED8]/20 text-[11px] font-mono font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E5ED8]" />
                {t("eligibility.title")}
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1F2937] tracking-tight">
                    {t("eligibilityResult.eligible")}
                  </h2>
                  <p className="text-[#1F2937]/60 text-xs sm:text-sm font-sans mt-0.5">
                    {t("eligibilityResult.message.eligible")}
                  </p>
                </div>
              </div>
            </div>

            {eligibleProgram.length > 0 ? (
              <div className="space-y-4">
                {eligibleProgram.map((program) => {
                  const link = program.link.startsWith("http")
                    ? program.link
                    : `https://${program.link}`;
                  const rawName = program.name?.[lang] || program.name?.fr || "";
                  const displayName = lang === "fr" ? sanitizeFrenchText(rawName) : rawName;

                  return (
                    <div
                      key={program.id || program.link}
                      className="border border-[#E4E4E7] p-5 sm:p-6 bg-white hover:border-[#1E5ED8] transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-display font-bold text-base sm:text-lg text-[#1E5ED8] hover:text-[#F97316] underline transition-colors"
                        >
                          {displayName}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="bg-[#F9FAFB] border border-[#E4E4E7] p-4 text-xs text-[#1F2937]/70 font-sans leading-relaxed">
              {t("eligibilityResult.message.eligibleEnd")}
            </div>

            <div className="pt-4 border-t border-[#E4E4E7] space-y-3">
              <button
                onClick={handleConfirmContact}
                disabled={isLoading}
                className="w-full bg-[#1E5ED8] hover:bg-[#111827] text-white font-display font-bold tracking-wider text-xs uppercase py-4 px-6 rounded-none transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("eligibilityResult.loading")}
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {t("eligibilityResult.confirmationOfContactButton")}
                  </>
                )}
              </button>
              <button
                onClick={onNewTest}
                className="w-full bg-white hover:bg-gray-50 text-[#1F2937] border border-[#E4E4E7] font-display font-semibold tracking-wider text-xs uppercase py-4 px-6 rounded-none transition-colors duration-200 cursor-pointer"
              >
                {t("eligibilityResult.newTestButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={t("eligibility.agent.requestTransmitted")}
        size="md"
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 border border-emerald-100 rounded-none flex items-center justify-center">
            <div className="w-10 h-10 bg-emerald-500 rounded-none flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <p className="text-[#1F2937]/75 text-sm sm:text-base leading-relaxed mb-6 font-light font-sans">
            {t("eligibility.agent.requestSuccess")}
          </p>
          <button
            onClick={handleCloseModal}
            className="w-full bg-[#1E5ED8] hover:bg-[#111827] text-white font-display font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-none transition-colors duration-200 cursor-pointer"
          >
            {t("eligibility.agent.understood")}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default EligibilityResult;
