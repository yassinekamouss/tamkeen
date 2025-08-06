import React from "react";
import type { FormData } from "./types";

interface EligibilityResultProps {
  isEligible: boolean;
  eligibleProgram: string[];
  formData: FormData;
  onNewTest: () => void;
}

const EligibilityResult: React.FC<EligibilityResultProps> = ({
  isEligible,
  eligibleProgram,
  formData,
  onNewTest,
}) => {
  return (
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
              Éligible
            </h2>

            {/* Message principal */}
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Félicitations ! Votre profil correspond aux critères d'éligibilité
              pour le programme{" "}
              <span className="font-semibold text-blue-600">
                {eligibleProgram}
              </span>
              . Notre équipe d'experts vous contactera sous 48h pour finaliser
              votre dossier.
            </p>

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
                Contact :{" "}
                <span className="font-medium ml-1">{formData.email}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onNewTest}
                className="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors duration-200">
                Nouveau test
              </button>
              <p className="text-xs text-gray-500">
                Test d'éligibilité - #{Date.now().toString().slice(-6)}
              </p>
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
              Non éligible
            </h2>

            {/* Message principal */}
            <p className="text-gray-700 text-base leading-relaxed mb-6 font-medium">
              D'après vos réponses, vous ne remplissez pas les critères
              d'éligibilité actuels. Cependant, notre équipe peut vous orienter
              vers d'autres solutions de financement adaptées à votre situation.
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
                Pour plus d'informations :{" "}
                <span className="font-semibold ml-1">contact@tamkeen.ma</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onNewTest}
                className="w-full bg-orange-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-orange-700 transition-colors duration-200">
                Tester à nouveau
              </button>
              <p className="text-xs text-gray-500">
                Test d'éligibilité - #{Date.now().toString().slice(-6)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityResult;
