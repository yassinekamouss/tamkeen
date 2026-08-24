import React from "react";
import { useTranslation } from "react-i18next";

interface HeroProps {
  onNavigateToForm?: () => void;
}

const Hero: React.FC<HeroProps> = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const bgImage = isRTL ? "/hero_background_arab.webp" : "/hero-background.webp";

  return (
    <section
      id="hero"
      dir={isRTL ? "rtl" : "ltr"}
      className="relative min-h-[100vh] flex flex-col justify-center pt-32 pb-40"
      aria-label={t("hero.badge")}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-[-1] bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* Readability Overlay */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none ${
          isRTL
            ? "bg-gradient-to-l from-white via-white/90 to-transparent"
            : "bg-gradient-to-r from-white via-white/90 to-transparent"
        }`}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-center">
        <div
          className={`max-w-3xl ${
            isRTL ? "mr-0 ml-auto text-right" : "ml-0 mr-auto text-left"
          }`}
        >
          <div
            className={`flex items-center gap-4 mb-4 ${
              isRTL ? "flex-row-reverse justify-end" : ""
            }`}
          >
            <span className="w-12 h-[2px] bg-slate-900" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {t("hero.badge", { defaultValue: "Subventions d'investissement au Maroc" })}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.2] sm:leading-[1.15]">
            {t("hero.title")}
          </h1>

          <p
            className={`max-w-2xl mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 font-medium ${
              isRTL ? "ml-auto" : ""
            }`}
          >
            {t("hero.description")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;