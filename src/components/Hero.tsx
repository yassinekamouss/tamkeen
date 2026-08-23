import React from "react";
import { useTranslation } from "react-i18next";

interface HeroProps {
  onNavigateToForm: () => void;
  onNavigateToPrograms?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  onNavigateToForm,
  onNavigateToPrograms,
}) => {
  const { t, i18n } = useTranslation();

  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const bgImage = isRTL
    ? "/hero_background_arab.webp"
    : "/hero-background.webp";

  return (
    <section
      id="hero"
      dir={isRTL ? "rtl" : "ltr"}
      /* min-h-[calc(100dvh-4rem)] soustrait la hauteur du header (ex: 64px / 4rem ou 80px / 5rem) */
      className="relative min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-5rem)] bg-white flex items-center font-body overflow-hidden"
      aria-label={t("hero.badge")}
    >
      {/* =========================================================
          BACKGROUND IMAGE
          ========================================================= */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          pointer-events-none
          bg-no-repeat
          transition-all
          duration-500
        "
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: isRTL ? "left top" : "right top",
        }}
      />

      {/* =========================================================
          READABILITY OVERLAY
          ========================================================= */}
      <div
        aria-hidden="true"
        className={`
          absolute
          inset-0
          pointer-events-none
          ${
            isRTL
              ? "bg-gradient-to-l from-white via-white/95 to-white/10"
              : "bg-gradient-to-r from-white via-white/95 to-white/10"
          }
        `}
      />

      {/* =========================================================
          MOBILE OVERLAY
          ========================================================= */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-0
          bottom-0
          h-[38%]
          pointer-events-none
          bg-gradient-to-t
          from-white/80
          via-white/40
          to-transparent
          lg:hidden
        "
      />

      {/* =========================================================
          CONTENT
          ========================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-16 lg:py-20 flex flex-col justify-between">
        <div
          className={`max-w-5xl ${
            isRTL ? "mr-0 ml-auto text-right" : "ml-0 mr-auto text-left"
          }`}
        >
          {/* Eyebrow */}
          <div
            className={`flex items-center gap-3 mb-4 sm:mb-6 ${
              isRTL ? "flex-row-reverse justify-end" : ""
            }`}
          >
            <span className="w-8 sm:w-10 h-[2px] bg-[#F97316]" />

            <span className="section-eyebrow text-[11px] sm:text-xs">
              {t("hero.badge")}
            </span>
          </div>

          {/* Main heading */}
          <h1 className="hero-h1 max-w-4xl tracking-tight text-[#111827]">
            {t("hero.title")}
          </h1>

          {/* Description */}
          <p
            className={`
              max-w-4xl
              mt-4
              sm:mt-8
              text-base
              sm:text-lg
              lg:text-xl
              leading-relaxed
              text-[#5B6472]
              font-body
              ${isRTL ? "ml-auto" : ""}
            `}
          >
            {t("hero.description")}
          </p>

          {/* CTA actions */}
          <div
            className={`
              flex
              flex-col
              sm:flex-row
              gap-3
              sm:gap-4
              mt-8
              sm:mt-12
              ${isRTL ? "sm:flex-row-reverse justify-end" : ""}
            `}
          >
            {/* Primary CTA */}
            <button
              onClick={onNavigateToForm}
              className="btn-orange w-full sm:w-auto min-h-[48px] justify-center"
            >
              <span>{t("hero.cta")}</span>

              <svg
                className={`
                  w-4
                  h-4
                  transition-transform
                  duration-200
                  ${
                    isRTL
                      ? "rotate-180 group-hover:-translate-x-1"
                      : "group-hover:translate-x-1"
                  }
                `}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={onNavigateToPrograms}
              className="btn-secondary w-full sm:w-auto min-h-[48px] justify-center"
            >
              {t("hero.programs_cta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;