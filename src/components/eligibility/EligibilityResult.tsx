import React, { useState } from "react";
import type { FormData, programsNamesAndLinks } from "./types";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import Modal from "./Modals/Modal"; // Ajustez le chemin selon votre structure

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
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmContact = async () => {
    if (!testId) return;
    
    setIsLoading(true);
    try {
      await axios.patch(`/test/eligibilite/${testId}/contact`);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue. Réessayez plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-lg mx-auto">
          {isEligible ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              {/* Icône de succès */}
              <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
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

              {/* Titre */}
              <h2 className="text-2xl font-semibold text-green-700 mb-3">
               {t("eligibilityResult.eligible")} 
              </h2>

              {/* Message principal */}
              <div className="text-gray-600 text-base leading-relaxed mb-6">
                  <p>{t("eligibilityResult.message.eligible")}</p>

                  <div className="center font-semibold text-blue-600">
                    <div className="flex flex-col items-center space-y-2">
                      {eligibleProgram.map((program, index) => {
                        const link = program.link.startsWith("http")
                          ? program.link
                          : `https://${program.link}`;
                        return (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener"
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            {program.name}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <p>{t("eligibilityResult.message.eligibleEnd")}</p>
                </div>

              {/* Informations de contact */}
              <div className="bg-gray-50 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
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
               <div className="space-y-3">
                  <button
                    onClick={handleConfirmContact}
                    disabled={isLoading}
                    type="button"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl 
                              shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 
                              transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5
                              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                        Chargement...
                      </>
                    ) : (
                      <>
                        {/* Icône plus claire et centrée */}
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.2}
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
                  className="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors duration-200">
                  {t("eligibilityResult.newTestButton")}
                </button>
               </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              {/* Icône d'information */}
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-50 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
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

              {/* Titre */}
              <h2 className="text-2xl font-semibold text-orange-700 mb-3">
                 {t("eligibilityResult.notEligible")}
              </h2>

              {/* Message principal */}
              <p className="text-gray-700 text-base leading-relaxed mb-6 font-medium">
               
                {t("eligibilityResult.message.notEligible")}

              </p>

              {/* Informations de contact */}
              <div className="bg-orange-50 rounded-xl p-4 mb-8 border border-orange-100">
                <div className="flex items-center justify-center text-sm text-orange-700">
                  <svg
                    className="w-4 h-4 mr-2 text-orange-500"
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
              <div className="space-y-3">
               <button
                    onClick={handleConfirmContact}
                    disabled={isLoading}
                    type="button"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl 
                              shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 
                              transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5
                              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                        Chargement...
                      </>
                    ) : (
                      <>
                        {/* Icône plus claire et centrée */}
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.2}
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
                  className="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors duration-200">
                  {t("eligibilityResult.newTestButton")}
                </button>
             
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title="Demande transmise"
        size="md"
      >
        <div className="text-center py-6">
          {/* Icône de succès */}
          <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
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

          {/* Message de confirmation */}
          <p className="text-gray-700 text-base leading-relaxed mb-6">
            Votre demande d'assistance a été transmise avec succès. Nous vous contacterons sous 48 h sur le mail que vous avez fourni.
          </p>

          {/* Bouton de fermeture */}
          <button
            onClick={handleCloseModal}
            className="w-full bg-green-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-green-700 transition-colors duration-200"
          >
            Compris
          </button>
        </div>
      </Modal>
    </>
  );
};

export default EligibilityResult;