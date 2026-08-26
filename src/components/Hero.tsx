import React from "react";
import { useTranslation } from "react-i18next";
import heroImage from "../assets/Design sans titre.png";

export type ProfileType = "morale" | "physique";

interface HeroProps {
  selectedProfile?: ProfileType | null;
  onSelectProfile?: (profile: ProfileType) => void;
}

const Hero: React.FC<HeroProps> = ({ selectedProfile, onSelectProfile }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const handleCommencerClick = () => {
    const selectorElement = document.getElementById("eligibility-selector");
    if (selectorElement) {
      selectorElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="relative w-full min-h-screen font-roboto bg-white">

      {/* Dégradé du haut (blanc vers bleu) */}
      <div className="absolute top-0 left-0 w-full h-[420px] sm:h-[600px] md:h-[800px] bg-gradient-to-b from-white from-40% to-[rgb(208,223,252)] z-0 pointer-events-none" />

      {/* HERO */}
      <section className="relative w-full overflow-hidden">

        {/* CONTENU */}
        <div className="relative z-10 max-w-7xl mx-auto text-center px-4 sm:px-6 pt-12 md:pt-20">
          <h1
            className="text-2xl sm:text-[28px] md:text-[32px] font-normal text-[#202124] leading-8 sm:leading-9 md:leading-[40px] mb-4 md:mb-6"
            style={{ fontFamily: "Google Sans, Roboto", overflowWrap: "break-word" }}
          >
            {t("hero.title", {
              defaultValue: "Maximisez vos aides financières sans vous perdre dans la paperasse",
            })}
          </h1>

          <p
            className="text-sm md:text-[16px] font-normal text-[#202124] leading-6 md:leading-[24px] mb-6 md:mb-8 max-w-md sm:max-w-xl md:max-w-6xl mx-auto"
            style={{ fontFamily: "Roboto, Google Sans", overflowWrap: "break-word" }}
          >
            {t("hero.description", {
              defaultValue:
                "Démarrez votre parcours en évaluant instantanément votre éligibilité via notre agent virtuel interactif. Pour vous libérer de toute charge mentale, notre équipe d'experts prend le relais : nous consolidons et certifions un dossier rigoureux et conforme, maximisant ainsi vos chances de financement sans le moindre effort de votre part.",
            })}
          </p>

          <button
            type="button"
            onClick={handleCommencerClick}
            className="w-full sm:w-auto text-sm md:text-[14px] bg-[#1a73e8] px-6 sm:px-8 py-2.5 md:py-3 font-medium hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm cursor-pointer"
            style={{ fontFamily: "Google Sans, Roboto" }}
          >
            {t("hero.cta_primary", { defaultValue: "Commencer" })}
          </button>
        </div>

        {/* IMAGE ET SON MASQUE
            - mobile : en flux normal, hauteur contenue, pas de masque (l'image reste nette et lisible en petit format)
            - desktop (md+) : comportement d'origine inchangé (absolute + masque dégradé) */}
        <div
          className="relative mt-8 mb-2 h-48 sm:h-64
                     md:absolute md:top-16 md:left-0 md:mt-0 md:mb-0 md:h-[600px] md:w-full
                     bg-bottom bg-no-repeat bg-contain z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${heroImage})`,
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 20%, black 90%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 20%, black 90%, transparent 100%)",
          }}
        />
        {/* Sur desktop on réapplique exactement le masque d'origine via une classe séparée pour ne rien changer au rendu existant */}
        <style>{`
          @media (min-width: 768px) {
            .hero-image-mask {
              -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 85%, transparent 100%);
              mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 85%, transparent 100%);
            }
          }
        `}</style>

        {/* CARTE */}
        <section
          id="eligibility-selector"
          className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 mt-2 md:mt-[330px] pb-12 md:pb-20"
        >
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-5 sm:p-6 md:p-8 border border-gray-100">

            <div className="text-center mb-6 md:mb-10">
              <h2
                className="text-xl sm:text-2xl md:text-[32px] font-normal leading-7 sm:leading-8 md:leading-[40px] text-[#202124] mb-2"
                style={{ fontFamily: "Google Sans, Roboto" }}
              >
                {t("profile_selector.title", {
                  defaultValue: "Sélectionnez votre structure pour démarrer le test d'éligibilité",
                })}
              </h2>
              <p
                className="text-sm md:text-[16px] leading-5 md:leading-[24px] text-[#202124]"
                style={{ fontFamily: "Roboto, Google Sans" }}
              >
                {t("profile_selector.subtitle", {
                  defaultValue: "Cette information nous permet d'identifier les aides et subventions les mieux adaptées à votre profil.",
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
              {/* PERSONNE MORALE */}
              <button
                type="button"
                onClick={() => onSelectProfile?.("morale")}
                aria-pressed={selectedProfile === "morale"}
                className={`group flex flex-row sm:flex-col items-center sm:text-center text-left gap-4 sm:gap-0 p-4 sm:p-6 md:p-8 border rounded-xl transition-all ${
                  selectedProfile === "morale"
                    ? "bg-white border-blue-200 shadow-lg"
                    : "bg-gray-50 border-gray-200 opacity-60 hover:bg-white hover:border-blue-200 hover:shadow-lg hover:opacity-100"
                }`}
              >
                <div
                  className={`shrink-0 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-0 sm:mb-4 md:mb-6 rounded-full flex items-center justify-center transition-colors ${
                    selectedProfile === "morale"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-200 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl md:text-4xl">🏢</span>
                </div>

                <div>
                  <h3
                    className={`text-base sm:text-lg font-medium mb-1 sm:mb-3 transition-colors ${
                      selectedProfile === "morale"
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-blue-600"
                    }`}
                  >
                    {t("profile_selector.morale_title", { defaultValue: "Personne Morale" })}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                      selectedProfile === "morale"
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  >
                    {t("profile_selector.morale_subtitle", {
                      defaultValue: "Vous représentez une société structurée (SARL, SA, SAS), une association ou une coopérative.",
                    })}
                  </p>
                </div>
              </button>

              {/* PERSONNE PHYSIQUE */}
              <button
                type="button"
                onClick={() => onSelectProfile?.("physique")}
                aria-pressed={selectedProfile === "physique"}
                className={`group flex flex-row sm:flex-col items-center sm:text-center text-left gap-4 sm:gap-0 p-4 sm:p-6 md:p-8 border rounded-xl transition-all ${
                  selectedProfile === "physique"
                    ? "bg-white border-blue-200 shadow-lg"
                    : "bg-gray-50 border-gray-200 opacity-60 hover:bg-white hover:border-blue-200 hover:shadow-lg hover:opacity-100"
                }`}
              >
                <div
                  className={`shrink-0 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-0 sm:mb-4 md:mb-6 rounded-full flex items-center justify-center transition-colors ${
                    selectedProfile === "physique"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-200 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl md:text-4xl">👤</span>
                </div>

                <div>
                  <h3
                    className={`text-base sm:text-lg font-medium mb-1 sm:mb-3 transition-colors ${
                      selectedProfile === "physique"
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-blue-600"
                    }`}
                  >
                    {t("profile_selector.physique_title", { defaultValue: "Personne Physique" })}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                      selectedProfile === "physique"
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  >
                    {t("profile_selector.physique_subtitle", {
                      defaultValue: "Vous exercez en votre nom propre, êtes auto-entrepreneur ou portez une idée de projet.",
                    })}
                  </p>
                </div>
              </button>
            </div>

            {/* TRUST PILLS : empilées en colonne sur mobile, en ligne à partir de sm */}
            <div className="mt-6 md:mt-10 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 rounded-full border border-gray-100">
                <CheckIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500 font-medium">
                  {t("hero.trust_pills.pill4", { defaultValue: "Aucun engagement pour tester votre éligibilité" })}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 rounded-full border border-gray-100">
                <CheckIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500 font-medium">
                  {t("hero.trust_pills.pill3", { defaultValue: "Documents traités de manière sécurisée" })}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 rounded-full border border-gray-100">
                <CheckIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500 font-medium">
                  {t("hero.trust_pills.pill2", { defaultValue: "Chaque dossier validé par un consultant" })}
                </span>
              </div>
            </div>
          </div>
        </section>

      </section>
    </main>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

export default Hero;