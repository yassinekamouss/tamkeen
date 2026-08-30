import React from "react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  UserCircle2,
  CheckCircle2,
  Shield,
  Award,
  UserCheck,
} from "lucide-react";

import heroBackground from "../assets/hero_background.png";

export type ProfileType = "morale" | "physique";

interface HeroProps {
  selectedProfile?: ProfileType | null;
  onSelectProfile?: (profile: ProfileType) => void;
}

const Hero: React.FC<HeroProps> = ({ selectedProfile, onSelectProfile }) => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="
        relative
        w-full
        bg-white
        overflow-visible
        font-sans
      "
    >
      {/* =========================================================
          HERO VISUAL AREA
      ========================================================= */}
      <section
        className="
          relative
          min-h-[560px]
          h-[100vh]
          overflow-hidden
          bg-white
        "
      >
        {/* BACKGROUND IMAGE */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            z-0
            pointer-events-none
            bg-no-repeat
            bg-right-center
            bg-cover
            xl:bg-contain
          "
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundPosition: "right center",
          }}
        />

        {/* FADE OVER IMAGE */}
<div
  aria-hidden="true"
  className="
    absolute
    inset-0
    z-[1]
    pointer-events-none
  "
  style={{
    background: `
      linear-gradient(
        to right,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.05) 45%,
        rgba(255,255,255,0.15) 60%,
        rgba(255,255,255,0.25) 72%,
        rgba(255,255,255,0.35) 85%,
        rgba(255,255,255,0.45) 100%
      )
    `,
  }}
/>
        {/* BOTTOM SOFT ATMOSPHERE */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-x-0
            bottom-0
            h-32
            z-[2]
            pointer-events-none
            bg-gradient-to-t
            from-white
            via-white/80
            to-transparent
          "
        />

        {/* CONTENT */}
        <div
          className="
            relative
            z-10
            w-full
            max-w-7xl
            h-full
            mx-auto
            px-5
            sm:px-6
            lg:px-8
            flex
            items-center
          "
        >
          <div
            className="
              w-full
              max-w-2xl
              pt-8
              sm:pt-12
              lg:pt-0
            "
          >
            {/* BADGE */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <span
                className="
                  inline-flex
                  items-center
                  px-4
                  py-1.5
                  rounded-full
                  border
                  border-[#ADC7FF]
                  bg-[#F3F7FF]
                  text-[#1A73E8]
                  text-[10px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                "
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                {t("hero.badge", {
                  defaultValue: "Subventions d'investissement au Maroc",
                })}
              </span>
            </div>

            {/* TITLE */}
            <h1
              className="
                max-w-2xl
                text-[34px]
                leading-[1.15]
                sm:text-[42px]
                md:text-[48px]
                lg:text-[52px]
                font-bold
                tracking-[-0.02em]
                text-[#111827]
                mb-5
              "
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              {t("hero.title", {
                defaultValue:
                  "Maximisez vos aides financières sans vous perdre dans la paperasse.",
              })}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                max-w-xl
                text-sm
                sm:text-base
                md:text-[16px]
                leading-7
                sm:leading-8
                text-[#4B5563]
              "
              style={{
                fontFamily: "Roboto Flex, sans-serif",
              }}
            >
              {t("hero.description", {
                defaultValue:
                  "Démarrez votre parcours en évaluant instantanément votre éligibilité via notre agent virtuel interactif. Pour vous libérer de toute charge mentale, notre équipe d'experts prend le relais : nous consolidons et certifions un dossier rigoureux et conforme, maximisant ainsi vos chances de financement sans le moindre effort de votre part.",
              })}
            </p>

          </div>
        </div>
      </section>

      {/* =========================================================
          ELIGIBILITY SECTION
      ========================================================= */}
      <section
        id="eligibility-selector"
        className="
          relative
          z-20
          w-full
          -mt-20
          sm:-mt-24
          lg:-mt-28
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <div className="w-full max-w-5xl mx-auto">
          {/* MAIN CARD */}
          <div
            className="
              bg-white
              border
              border-[#DADCE0]
              rounded-2xl
              shadow-[0_18px_50px_rgba(17,24,39,0.06)]
              overflow-hidden
            "
          >
            {/* CARD HEADER */}
            <div
              className="
                px-5
                py-8
                sm:px-8
                sm:py-10
                text-center
              "
            >
              <h2
                className="
                  text-lg
                  sm:text-xl
                  md:text-[24px]
                  font-bold
                  text-[#191C1D]
                "
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                {t("profile_selector.title", {
                  defaultValue:
                    "Sélectionnez votre structure pour démarrer le test d'éligibilité",
                })}
              </h2>
              <p className="text-[#4B5563] mt-2">
                {t("profile_selector.subtitle", {
                  defaultValue:
                    "Sélectionnez votre structure pour démarrer le test d'éligibilité",
                })}
              </p>
            </div>

            {/* PROFILE OPTIONS */}
            <div
              className="
                px-5
                pb-8
                sm:px-10
                sm:pb-12
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                  md:gap-6
                "
              >
                {/* PERSONNE MORALE */}
                <button
                  type="button"
                  onClick={() => onSelectProfile?.("morale")}
                  aria-pressed={selectedProfile === "morale"}
                  className={`
                    group
                    relative
                    w-full
                    flex
                    items-center
                    gap-4
                    sm:gap-5
                    p-6
                    sm:p-8
                    text-left
                    border
                    rounded-xl
                    transition-all
                    duration-200
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#1A73E8]
                    focus-visible:ring-offset-2
                    ${
                      selectedProfile === "morale"
                        ? "border-[#1A73E8] bg-[#F8FBFF]"
                        : "border-[#DADCE0] bg-white hover:border-[#8AB4F8] hover:bg-[#FAFCFF]"
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      shrink-0
                      w-14
                      h-14
                      rounded-full
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-200
                      ${
                        selectedProfile === "morale"
                          ? "bg-[#1A73E8] text-white"
                          : "bg-[#E8F0FE] text-[#1A73E8] group-hover:bg-[#DCEAFF]"
                      }
                    `}
                  >
                    <Building2 className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        text-sm
                        sm:text-[17px]
                        font-bold
                        text-[#191C1D]
                        mb-1
                        flex
                        items-center
                        gap-2
                      "
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {t("profile_selector.morale_title", {
                        defaultValue: "Personne Morale",
                      })}
                      {/* Active indicator inline */}
                      {selectedProfile === "morale" && (
                        <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                      )}
                    </h3>
                    <p
                      className="
                        text-xs
                        sm:text-[13px]
                        leading-5
                        sm:leading-6
                        text-[#6B7280]
                      "
                      style={{ fontFamily: "Roboto Flex, sans-serif" }}
                    >
                      {t("profile_selector.morale_subtitle", {
                        defaultValue:
                          "Vous créez une entreprise, une SARL, SA, SAS, coopérative ou toute autre structure.",
                      })}
                    </p>
                  </div>
                </button>

                {/* PERSONNE PHYSIQUE */}
                <button
                  type="button"
                  onClick={() => onSelectProfile?.("physique")}
                  aria-pressed={selectedProfile === "physique"}
                  className={`
                    group
                    relative
                    w-full
                    flex
                    items-center
                    gap-4
                    sm:gap-5
                    p-6
                    sm:p-8
                    text-left
                    border
                    rounded-xl
                    transition-all
                    duration-200
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#1A73E8]
                    focus-visible:ring-offset-2
                    ${
                      selectedProfile === "physique"
                        ? "border-[#1A73E8] bg-[#F8FBFF]"
                        : "border-[#DADCE0] bg-white hover:border-[#8AB4F8] hover:bg-[#FAFCFF]"
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      shrink-0
                      w-14
                      h-14
                      rounded-full
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-200
                      ${
                        selectedProfile === "physique"
                          ? "bg-[#1A73E8] text-white"
                          : "bg-[#F3F4F6] text-[#6B7280] group-hover:bg-[#E5E7EB]"
                      }
                    `}
                  >
                    <UserCircle2 className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        text-sm
                        sm:text-[17px]
                        font-bold
                        text-[#191C1D]
                        mb-1
                        flex
                        items-center
                        gap-2
                      "
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {t("profile_selector.physique_title", {
                        defaultValue: "Personne Physique",
                      })}
                      {/* Active indicator inline */}
                      {selectedProfile === "physique" && (
                        <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />
                      )}
                    </h3>
                    <p
                      className="
                        text-xs
                        sm:text-[13px]
                        leading-5
                        sm:leading-6
                        text-[#6B7280]
                      "
                      style={{ fontFamily: "Roboto Flex, sans-serif" }}
                    >
                      {t("profile_selector.physique_subtitle", {
                        defaultValue:
                          "Vous exercez en votre nom propre, êtes auto-entrepreneur ou porteur d'une idée de projet.",
                      })}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              TRUST INDICATORS
          ===================================================== */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-8
              sm:gap-0
              mt-10
              sm:mt-14
              mb-14
              sm:mb-20
              max-w-4xl
              mx-auto
            "
          >
            {/* Free */}
            <div
              className="
                flex
                flex-col
                items-center
                text-center
                px-4
                sm:border-r
                border-[#E5E7EB]
              "
            >
              <Award className="w-8 h-8 text-[#1A73E8] mb-4" strokeWidth={1.5} />
              <h4
                className="text-sm font-bold text-[#111827] mb-2"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {t("hero.trust_pills.pill1_title", {
                  defaultValue: "Aucun engagement",
                })}
              </h4>
              <p
                className="text-[13px] text-[#6B7280] leading-relaxed max-w-[220px]"
                style={{ fontFamily: "Roboto Flex, sans-serif" }}
              >
                {t("hero.trust_pills.pill1_desc", {
                  defaultValue:
                    "Testez votre éligibilité gratuitement et sans engagement.",
                })}
              </p>
            </div>

            {/* Security */}
            <div
              className="
                flex
                flex-col
                items-center
                text-center
                px-4
                sm:border-r
                border-[#E5E7EB]
              "
            >
              <Shield className="w-8 h-8 text-[#1A73E8] mb-4" strokeWidth={1.5} />
              <h4
                className="text-sm font-bold text-[#111827] mb-2"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {t("hero.trust_pills.pill2_title", {
                  defaultValue: "Données sécurisées",
                })}
              </h4>
              <p
                className="text-[13px] text-[#6B7280] leading-relaxed max-w-[220px]"
                style={{ fontFamily: "Roboto Flex, sans-serif" }}
              >
                {t("hero.trust_pills.pill2_desc", {
                  defaultValue:
                    "Vos informations sont traitées de manière sécurisée et confidentielle.",
                })}
              </p>
            </div>

            {/* Expert */}
            <div
              className="
                flex
                flex-col
                items-center
                text-center
                px-4
              "
            >
              <UserCheck className="w-8 h-8 text-[#1A73E8] mb-4" strokeWidth={1.5} />
              <h4
                className="text-sm font-bold text-[#111827] mb-2"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {t("hero.trust_pills.pill3_title", {
                  defaultValue: "Expert dédié",
                })}
              </h4>
              <p
                className="text-[13px] text-[#6B7280] leading-relaxed max-w-[220px]"
                style={{ fontFamily: "Roboto Flex, sans-serif" }}
              >
                {t("hero.trust_pills.pill3_desc", {
                  defaultValue:
                    "Chaque dossier est validé par un consultant expert en financement.",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;