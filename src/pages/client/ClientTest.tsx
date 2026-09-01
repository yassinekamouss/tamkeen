import React from "react";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { ClientHeader } from "../../components";
import EligibilityForm from "../../components/eligibility/EligibilityFormNew";
import { ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
};

/**
 * Page "Nouveau test d'éligibilité" accessible depuis l'espace client.
 *
 * Le formulaire est pré-rempli avec le type de profil de l'utilisateur
 * (physique ou morale). L'email est verrouillé car il ne peut pas être
 * modifié et est déjà connu du système.
 */
const ClientTest: React.FC = () => {
  const { user } = useClientAuth();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Le type de profil est figé selon le compte de l'utilisateur
  const profileType = user?.applicantType ?? "physique";

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F8F9FA] ${font.body}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <ClientHeader />

      <main className="flex-grow max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page header */}
        <div className="bg-white rounded border border-[#DADCE0] px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-[#E8F0FE] flex items-center justify-center shrink-0">
            <ClipboardCheck size={20} className="text-[#1A73E8]" />
          </div>
          <div>
            <h1 className={`${font.display} text-[18px] font-bold text-[#191C1D]`}>
              Nouveau test d'éligibilité
            </h1>
            <p className="text-[13px] text-[#5F6368] mt-0.5">
              Évaluez votre éligibilité aux programmes de financement disponibles.
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-[#E8F0FE] border border-[#ADC7FF] rounded px-5 py-3.5 flex items-start gap-3">
          <svg
            className="w-4 h-4 text-[#1A73E8] shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-[13px] text-[#1A73E8] leading-relaxed">
            Ce test est lié à votre compte. Vos informations de profil sont
            pré-remplies et votre email ne peut pas être modifié depuis ce formulaire.
          </p>
        </div>

        {/* Form wrapper */}
        <div className="bg-white rounded border border-[#DADCE0] overflow-hidden">
          <EligibilityForm
            selectedProfile={profileType}
            // L'email est pré-rempli depuis le contexte d'authentification
            // via useClientAuth() directement dans EligibilityFormNew
          />
        </div>
      </main>
    </div>
  );
};

export default ClientTest;
