import React, { useState, useEffect, useRef } from "react";
import type { FormData, programsNamesAndLinks } from "./types";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import Modal from "./Modals/Modal";
import { sanitizeFrenchText } from "../../utils/sanitize";

interface EligibilityResultProps {
  isEligible: boolean;
  eligibleProgram: programsNamesAndLinks[];
  formData: FormData;
  onNewTest: () => void;
  testId?: string | null;
}

const EligibilityResult: React.FC<EligibilityResultProps> = ({
  isEligible,
  eligibleProgram,
  onNewTest,
  testId
}) => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const lang = i18n.language as "fr" | "ar";

  // Scroll the result card into view when this component mounts
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
    if (!testId) return;
    
    setIsLoading(true);
    try {
      await axios.patch(`/test/eligibilite/${testId}/contact`);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      alert(lang === "ar" ? "حدث خطأ ما. يرجى المحاولة لاحقاً." : "Une erreur est survenue. Réessayez plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-white py-12 px-4 flex items-center justify-center">
        <div ref={cardRef} className="w-full max-w-lg mx-auto">
          {isEligible ? (
            <div className="bg-white border border-[#E4E4E7] p-8 sm:p-10 text-center rounded-none shadow-none">
              {/* Success Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-emerald-50 border border-emerald-100 rounded-none flex items-center justify-center">
                <div className="w-12 h-12 bg-emerald-650 rounded-none flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold font-display text-emerald-700 mb-4 uppercase tracking-wide">
                {t("eligibilityResult.eligible")} 
              </h2>

              {/* Message */}
              <div className="text-[#1F2937]/75 text-sm sm:text-base leading-relaxed mb-8 space-y-4">
                <p className="font-light">{t("eligibilityResult.message.eligible")}</p>

                <div className="flex flex-col items-center space-y-3 py-2">
                  {eligibleProgram.map((program, index) => {
                    const link = program.link.startsWith("http")
                      ? program.link
                      : `https://${program.link}`;
                    const rawName = program.name[lang] || program.name.fr;
                    const displayName = lang === "fr" ? sanitizeFrenchText(rawName) : rawName;

                    return (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1E5ED8] hover:text-[#F97316] font-display font-bold text-sm tracking-wide underline transition-colors"
                      >
                        {displayName}
                      </a>
                    );
                  })}
                </div>

                <p className="font-light">{t("eligibilityResult.message.eligibleEnd")}</p>
              </div>

              {/* Contact Info Block */}
              <div className="bg-[#1F2937]/5 border border-[#E4E4E7] p-5 mb-8 rounded-none">
                <div className="flex items-center justify-center text-xs font-mono text-[#1F2937]/70 uppercase tracking-wider">
                  <svg
                    className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-[#1F2937]/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  {t("eligibilityResult.contactInfo")}
                </div>
              </div>  

              {/* Actions */}
              <div className="space-y-4">
                <button
                  onClick={handleConfirmContact}
                  disabled={isLoading}
                  type="button"
                  className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-display font-semibold tracking-wider text-xs uppercase py-4 px-6 rounded-none transition-colors duration-250 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                      {lang === "ar" ? "جاري التحميل..." : "Chargement..."}
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
                  className="w-full bg-white hover:bg-gray-50 text-[#1F2937] border border-[#E4E4E7] font-display font-semibold tracking-wider text-xs uppercase py-4 px-6 rounded-none transition-colors duration-200"
                >
                  {t("eligibilityResult.newTestButton")}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E4E4E7] p-8 sm:p-10 text-center rounded-none shadow-none">
              {/* Info Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-amber-50 border border-amber-100 rounded-none flex items-center justify-center">
                <div className="w-12 h-12 bg-amber-500 rounded-none flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold font-display text-amber-700 mb-4 uppercase tracking-wide">
                {t("eligibilityResult.notEligible")}
              </h2>

              {/* Message */}
              <p className="text-[#1F2937]/75 text-sm sm:text-base leading-relaxed mb-8 font-light">
                {t("eligibilityResult.message.notEligible")}
              </p>

              {/* Contact Info Block */}
              <div className="bg-amber-50/50 border border-amber-100 p-5 mb-8 rounded-none">
                <div className="flex items-center justify-center text-xs font-mono text-amber-800 uppercase tracking-wider">
                  <svg
                    className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {t("eligibilityResult.contactInfo")}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  onClick={handleConfirmContact}
                  disabled={isLoading}
                  type="button"
                  className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-display font-semibold tracking-wider text-xs uppercase py-4 px-6 rounded-none transition-colors duration-250 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                      {lang === "ar" ? "جاري التحميل..." : "Chargement..."}
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
                  className="w-full bg-white hover:bg-gray-50 text-[#1F2937] border border-[#E4E4E7] font-display font-semibold tracking-wider text-xs uppercase py-4 px-6 rounded-none transition-colors duration-200"
                >
                  {t("eligibilityResult.newTestButton")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={lang === "ar" ? "تم إرسال الطلب" : "Demande transmise"}
        size="md"
      >
        <div className="text-center py-6">
          {/* Success Icon */}
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

          {/* Message */}
          <p className="text-[#1F2937]/75 text-sm sm:text-base leading-relaxed mb-6 font-light">
            {lang === "ar" 
              ? "تم إرسال طلب المساعدة الخاص بك بنجاح. سنتصل بك في غضون 48 ساعة على البريد الإلكتروني الذي قدمته."
              : "Votre demande d'assistance a été transmise avec succès. Nous vous contacterons sous 48 h sur le mail que vous avez fourni."}
          </p>

          {/* Close button */}
          <button
            onClick={handleCloseModal}
            className="w-full bg-[#1E5ED8] hover:bg-[#111827] text-white font-display font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-none transition-colors duration-200"
          >
            {lang === "ar" ? "مفهوم" : "Compris"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default EligibilityResult;