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
import heroBackgroundArabe from "../assets/hero_background_arabe.png";
import heroBackgroundFrSmallDevices from "../assets/hero_background_fr_small_devices.png";

export type ProfileType = "morale" | "physique";

interface HeroProps {
  selectedProfile?: ProfileType | null;
  onSelectProfile?: (profile: ProfileType) => void;
}

const Hero: React.FC<HeroProps> = ({ selectedProfile, onSelectProfile }) => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";
  const heroBgDesktop = isRTL ? heroBackgroundArabe : heroBackground;
  const heroBgMobile = heroBackgroundFrSmallDevices;

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
          min-h-[520px]
          sm:min-h-[580px]
          md:min-h-[560px]
          md:h-[100vh]
          lg:min-h-[620px]
          overflow-hidden
          bg-white
        "
      >
        {/* MOBILE BACKGROUND IMAGE (< md) */}
        <div
          aria-hidden="true"
          className="
            md:hidden
            absolute
            inset-0
            z-0
            pointer-events-none
            bg-no-repeat
            bg-cover
          "
          style={{
            backgroundImage: `url(${heroBgMobile})`,
            backgroundPosition: "center bottom",
          }}
        />

        {/* MOBILE TOP CONTRAST VEIL (Soft luminous sky contrast, fades before buildings) */}
        <div
          aria-hidden="true"
          className="
            md:hidden
            absolute
            inset-x-0
            top-0
            h-80
            z-[1]
            pointer-events-none
            bg-gradient-to-b
            from-white/90
            via-white/45
            to-transparent
          "
        />

        {/* DESKTOP BACKGROUND IMAGE (>= md) */}
        <div
          aria-hidden="true"
          className={`
            hidden
            md:block
            absolute
            inset-0
            z-0
            pointer-events-none
            bg-no-repeat
            ${isRTL ? "bg-left-center" : "bg-right-center"}
            bg-cover
            xl:bg-contain
          `}
          style={{
            backgroundImage: `url(${heroBgDesktop})`,
            backgroundPosition: isRTL ? "left center" : "right center",
          }}
        />

        {/* DESKTOP FADE OVER IMAGE */}
        <div
          aria-hidden="true"
          className="
            hidden
            md:block
            absolute
            inset-0
            z-[1]
            pointer-events-none
          "
          style={{
            background: isRTL
              ? `
                linear-gradient(
                  to left,
                  rgba(255,255,255,0) 0%,
                  rgba(255,255,255,0.05) 45%,
                  rgba(255,255,255,0.15) 60%,
                  rgba(255,255,255,0.25) 72%,
                  rgba(255,255,255,0.35) 85%,
                  rgba(255,255,255,0.45) 100%
                )
              `
              : `
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

        {/* BOTTOM SOFT ATMOSPHERE TRANSITION */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-x-0
            bottom-0
            h-24
            sm:h-32
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
            px-4
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
              pt-20
              pb-10
              sm:pt-24
              sm:pb-16
              md:py-0
            "
          >
            {/* BADGE */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-1
                  sm:px-3.5
                  sm:py-1.5
                  rounded-full
                  border
                  border-[#ADC7FF]
                  bg-white/85
                  backdrop-blur-md
                  text-[#1A73E8]
                  text-[10px]
                  xs:text-[11px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-[0.06em]
                  shadow-xs
                "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] shrink-0" />
                {t("hero.badge", {
                  defaultValue: "Subventions d'investissement au Maroc",
                })}
              </span>
            </div>

            {/* TITLE */}
            <h1
              className="
                max-w-2xl
                text-[26px]
                xs:text-[29px]
                sm:text-[38px]
                md:text-[46px]
                lg:text-[50px]
                leading-[1.18]
                sm:leading-[1.12]
                font-extrabold
                tracking-[-0.03em]
                text-[#0F172A]
                mb-3
                sm:mb-4
              "
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
                text-[13.5px]
                xs:text-[14px]
                sm:text-[15px]
                md:text-base
                leading-[1.55]
                sm:leading-relaxed
                text-[#475569]
                font-medium
              "
            >
              {t("hero.description", {
                defaultValue:
                  "Évaluez votre éligibilité en 2 minutes. Nos experts montent et certifient un dossier conforme pour maximiser vos subventions d'État.",
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
          -mt-6
          sm:-mt-12
          md:-mt-20
          lg:-mt-28
          px-3.5
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
              shadow-[0_12px_40px_rgba(17,24,39,0.06)]
              overflow-hidden
            "
          >
            {/* CARD HEADER */}
            <div
              className="
                px-4
                py-6
                sm:px-8
                sm:py-9
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
                  tracking-tight
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
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5 sm:mt-2 max-w-lg mx-auto">
                {t("profile_selector.subtitle", {
                  defaultValue:
                    "Sélectionnez votre structure pour démarrer le test d'éligibilité",
                })}
              </p>
            </div>

            {/* PROFILE OPTIONS */}
            <div
              className="
                px-4
                pb-6
                sm:px-8
                sm:pb-10
                lg:px-10
                lg:pb-12
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-3.5
                  sm:gap-5
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
                    items-start
                    sm:items-center
                    gap-3.5
                    sm:gap-5
                    p-4
                    sm:p-6
                    lg:p-7
                    text-start
                    border
                    rounded-xl
                    transition-all
                    duration-200
                    active:scale-[0.99]
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#1A73E8]
                    focus-visible:ring-offset-2
                    ${
                      selectedProfile === "morale"
                        ? "border-[#1A73E8] bg-[#F8FBFF] shadow-sm ring-1 ring-[#1A73E8]"
                        : "border-[#DADCE0] bg-white hover:border-[#8AB4F8] hover:bg-[#FAFCFF]"
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      shrink-0
                      w-11
                      h-11
                      sm:w-14
                      sm:h-14
                      rounded-xl
                      sm:rounded-full
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
                    <Building2 className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        text-[15px]
                        sm:text-[17px]
                        font-bold
                        text-[#191C1D]
                        mb-1
                        flex
                        items-center
                        justify-between
                        gap-2
                      "
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      <span className="truncate">
                        {t("profile_selector.morale_title", {
                          defaultValue: "Personne Morale",
                        })}
                      </span>
                      {/* Active indicator inline */}
                      {selectedProfile === "morale" && (
                        <CheckCircle2 className="w-4 h-4 text-[#1A73E8] shrink-0" />
                      )}
                    </h3>
                    <p
                      className="
                        text-xs
                        sm:text-[13px]
                        leading-relaxed
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
                    items-start
                    sm:items-center
                    gap-3.5
                    sm:gap-5
                    p-4
                    sm:p-6
                    lg:p-7
                    text-start
                    border
                    rounded-xl
                    transition-all
                    duration-200
                    active:scale-[0.99]
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#1A73E8]
                    focus-visible:ring-offset-2
                    ${
                      selectedProfile === "physique"
                        ? "border-[#1A73E8] bg-[#F8FBFF] shadow-sm ring-1 ring-[#1A73E8]"
                        : "border-[#DADCE0] bg-white hover:border-[#8AB4F8] hover:bg-[#FAFCFF]"
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      shrink-0
                      w-11
                      h-11
                      sm:w-14
                      sm:h-14
                      rounded-xl
                      sm:rounded-full
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
                    <UserCircle2 className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        text-[15px]
                        sm:text-[17px]
                        font-bold
                        text-[#191C1D]
                        mb-1
                        flex
                        items-center
                        justify-between
                        gap-2
                      "
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      <span className="truncate">
                        {t("profile_selector.physique_title", {
                          defaultValue: "Personne Physique",
                        })}
                      </span>
                      {/* Active indicator inline */}
                      {selectedProfile === "physique" && (
                        <CheckCircle2 className="w-4 h-4 text-[#1A73E8] shrink-0" />
                      )}
                    </h3>
                    <p
                      className="
                        text-xs
                        sm:text-[13px]
                        leading-relaxed
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
              mt-8
              sm:mt-14
              mb-12
              sm:mb-20
              max-w-4xl
              mx-auto
            "
          >
            {/* MOBILE (< sm): Sleek, grouped reassurance card */}
            <div
              className="
                sm:hidden
                bg-[#F8FAFC]
                border
                border-[#E5E7EB]
                rounded-2xl
                p-4
                space-y-4
                divide-y
                divide-[#E5E7EB]/80
              "
            >
              {/* Item 1 */}
              <div className="flex items-start gap-3.5 pt-1 first:pt-0">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center">
                  <Award className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1 text-start">
                  <h4
                    className="text-xs font-bold text-[#111827] mb-0.5"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {t("hero.trust_pills.pill1_title", {
                      defaultValue: "Aucun engagement",
                    })}
                  </h4>
                  <p
                    className="text-[11.5px] text-[#6B7280] leading-relaxed"
                    style={{ fontFamily: "Roboto Flex, sans-serif" }}
                  >
                    {t("hero.trust_pills.pill1_desc", {
                      defaultValue:
                        "Testez votre éligibilité gratuitement et sans engagement.",
                    })}
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3.5 pt-4">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center">
                  <Shield className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1 text-start">
                  <h4
                    className="text-xs font-bold text-[#111827] mb-0.5"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {t("hero.trust_pills.pill2_title", {
                      defaultValue: "Données sécurisées",
                    })}
                  </h4>
                  <p
                    className="text-[11.5px] text-[#6B7280] leading-relaxed"
                    style={{ fontFamily: "Roboto Flex, sans-serif" }}
                  >
                    {t("hero.trust_pills.pill2_desc", {
                      defaultValue:
                        "Vos informations sont traitées de manière sécurisée et confidentielle.",
                    })}
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3.5 pt-4">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center">
                  <UserCheck className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1 text-start">
                  <h4
                    className="text-xs font-bold text-[#111827] mb-0.5"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {t("hero.trust_pills.pill3_title", {
                      defaultValue: "Expert dédié",
                    })}
                  </h4>
                  <p
                    className="text-[11.5px] text-[#6B7280] leading-relaxed"
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

            {/* DESKTOP (>= sm): 3-column horizontal row with dividers */}
            <div
              className="
                hidden
                sm:grid
                sm:grid-cols-3
                gap-0
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
                  rtl:sm:border-r-0
                  rtl:sm:border-l
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
                  rtl:sm:border-r-0
                  rtl:sm:border-l
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
        </div>
      </section>
    </main>
  );
};

export default Hero;