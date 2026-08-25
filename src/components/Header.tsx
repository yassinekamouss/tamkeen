import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-removebg-preview.webp";
import { useTranslation } from "react-i18next";
import { useClientAuth } from "../contexts/ClientAuthContext";

interface HeaderProps {
  noSpacer?: boolean;
}

const Header: React.FC<HeaderProps> = ({ noSpacer = false }) => {
  const { t, i18n } = useTranslation();
  const { client } = useClientAuth();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === "/" || location.pathname === `/${i18n.language}`;
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const isActiveLink = (path: string) => location.pathname === path;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("appLanguage", lng);
  };

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Verrouiller le défilement du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navItemClass = (active: boolean) =>
    `text-sm font-semibold transition-colors duration-200 cursor-pointer ${
      active ? "text-[#1E5ED8]" : "text-[#1F2937]/80 hover:text-[#1E5ED8]"
    }`;

  const mobileNavItemClass = (active: boolean) =>
    `block w-full px-4 py-3 text-sm font-bold transition-colors duration-200 border-l-2 rtl:border-l-0 rtl:border-r-2 ${
      isRTL ? "text-right" : "text-left"
    } ${
      active
        ? "text-[#1E5ED8] border-[#1E5ED8] bg-[#EEF4FF]"
        : "text-[#1F2937]/80 border-transparent hover:text-[#1E5ED8] hover:bg-[#F9FAFB]"
    }`;

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 flex flex-col transition-all duration-300"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* TOP BAR - Compact, adaptative et fidèle à la maquette mobile */}
        <div
          className={`w-full bg-blue-100 transition-all duration-300 flex items-center justify-between px-2 sm:px-8 ${
            isScrolled
              ? "h-0 opacity-0 overflow-hidden pointer-events-none"
              : "h-10 sm:h-10 opacity-100 overflow-visible"
          }`}
        >
          {/* Info Sécurité (Gauche) */}
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-slate-600 font-medium">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10B981] flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="hidden sm:inline">
              {t("header.security_platform", "Plateforme publique sécurisée par l'État marocain")}
            </span>
            <span className="inline sm:hidden">
              {t("header.security_platform_short", "Plateforme Officielle")}
            </span>
          </div>

          {/* Actions rapides (Droite) : Langue + Espace Client */}
          <div className="flex items-center">
            
            {/* Switcher de Langue "Côte à côte" */}
            <div className="flex items-center mr-2 sm:mr-4">
              <button
                onClick={() => changeLanguage("fr")}
                className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  i18n.language === "fr"
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-700 hover:bg-gray-200/50"
                }`}
                aria-label="Passer en Français"
              >
                <span className="text-sm leading-none">🇫🇷</span>
                <span className="hidden sm:inline">Français</span>
                <span className="inline sm:hidden">FR</span>
              </button>

              <button
                onClick={() => changeLanguage("ar")}
                className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-[4px] transition-all cursor-pointer ${
                  i18n.language === "ar"
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                aria-label="تغيير إلى العربية"
              >
                <span className="text-sm leading-none">🇲🇦</span>
                <span className="hidden sm:inline">العربية</span>
                <span className="inline sm:hidden">AR</span>
              </button>
            </div>

            {/* Accès Client Rapide */}
            <div className="flex items-center h-[60%] border-l rtl:border-l-0 rtl:border-r border-gray-200 pl-2 sm:pl-4 rtl:pl-0 rtl:pr-2 sm:rtl:pr-4">
              <Link
                to={client ? "/dashboard" : "/login"}
                className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden sm:inline">
                  {client ? t("header.my_space", "Mon espace") : t("header.client_area", "Mon compte")}
                </span>
                {/* Forcé sur mobile pour correspondre à votre image */}
                <span className="inline sm:hidden">
                  {client ? "Mon espace" : "Espace Client"}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* HEADER PRINCIPAL - Style 'Pill' adaptatif au scroll */}
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            isScrolled ? "px-0 pt-0" : "px-3 sm:px-8 pt-2 sm:pt-3"
          }`}
        >
          <div
            className={`mx-auto bg-white/95 backdrop-blur-md shadow-md transition-all duration-300 flex justify-between items-center px-3.5 sm:px-6 h-14 sm:h-18 ${
              isScrolled
                ? "w-full rounded-none max-w-none border-b border-gray-200"
                : "max-w-7xl rounded-xl sm:rounded-2xl border border-gray-100"
            }`}
          >
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" aria-label={t("header.home_aria")}>
                <img
                  className="h-7 sm:h-11 w-auto object-contain"
                  src={logo}
                  alt="Tamkeen Center"
                />
              </Link>
            </div>

            {/* Navigation Bureau */}
            <nav
              className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse font-body"
              aria-label={t("header.main_nav")}
            >
              <Link to="/about" className={navItemClass(isActiveLink("/about"))}>
                {t("header.about", "À propos")}
              </Link>

              {isHome ? (
                <button
                  onClick={() => scrollTo("programs")}
                  className={navItemClass(false)}
                >
                  {t("header.programs", "Programmes")}
                </button>
              ) : (
                <Link
                  to="/programs"
                  className={navItemClass(isActiveLink("/programs"))}
                >
                  {t("header.programs", "Programmes")}
                </Link>
              )}

              {isHome ? (
                <button
                  onClick={() => scrollTo("actuality")}
                  className={navItemClass(false)}
                >
                  {t("header.news", "Actualités")}
                </button>
              ) : (
                <Link
                  to="/news"
                  className={navItemClass(isActiveLink("/news"))}
                >
                  {t("header.news", "Actualités")}
                </Link>
              )}

              {isHome ? (
                <button onClick={() => scrollTo("faq")} className={navItemClass(false)}>
                  {t("header.faq", "FAQ")}
                </button>
              ) : (
                <Link to="/faq" className={navItemClass(isActiveLink("/faq"))}>
                  {t("header.faq", "FAQ")}
                </Link>
              )}
            </nav>

            {/* Section Action CTA (Bureau) */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => {
                  if (isHome) {
                    scrollTo("eligibility-form");
                  } else {
                    window.location.href = "/#eligibility-form";
                  }
                }}
                className="px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                aria-label={t("hero.cta")}
              >
                {t("hero.cta", "Tester mon éligibilité")}
              </button>
            </div>

            {/* Actions Mobile (Bouton Test + Burger) */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isHome) {
                    scrollTo("eligibility-form");
                  } else {
                    window.location.href = "/#eligibility-form";
                  }
                }}
                className="px-3 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold uppercase rounded-md shadow-xs transition-colors cursor-pointer"
              >
                {t("header.test_short", "Test")}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md focus:outline-none cursor-pointer"
                aria-expanded={isMobileMenuOpen}
                aria-label={t("header.menu", "Menu")}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer conditionnel : Masqué sur la page d'accueil pour laisser l'image Hero prendre 100vh header inclus */}
      {!isHome && !noSpacer && (
        <div
          className={`w-full transition-all duration-300 ${
            isScrolled ? "h-14 sm:h-18" : "h-24 sm:h-28"
          }`}
        />
      )}

      {/* Menu Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex flex-col justify-start transition-all duration-300 ${
            isScrolled ? "top-[56px]" : "top-[96px] sm:top-[112px]"
          }`}
        >
          <div
            className="bg-white shadow-2xl py-4 px-5 max-h-[85vh] overflow-y-auto border-b border-gray-200"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <nav className="flex flex-col space-y-1">
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileNavItemClass(isActiveLink("/about"))}
              >
                {t("header.about", "À propos")}
              </Link>

              {isHome ? (
                <button
                  onClick={() => scrollTo("programs")}
                  className={mobileNavItemClass(false)}
                >
                  {t("header.programs", "Programmes")}
                </button>
              ) : (
                <Link
                  to="/programs"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileNavItemClass(isActiveLink("/programs"))}
                >
                  {t("header.programs", "Programmes")}
                </Link>
              )}

              {isHome ? (
                <button
                  onClick={() => scrollTo("actuality")}
                  className={mobileNavItemClass(false)}
                >
                  {t("header.news", "Actualités")}
                </button>
              ) : (
                <Link
                  to="/news"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileNavItemClass(isActiveLink("/news"))}
                >
                  {t("header.news", "Actualités")}
                </Link>
              )}

              {isHome ? (
                <button
                  onClick={() => scrollTo("faq")}
                  className={mobileNavItemClass(false)}
                >
                  {t("header.faq", "FAQ")}
                </button>
              ) : (
                <Link
                  to="/faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileNavItemClass(isActiveLink("/faq"))}
                >
                  {t("header.faq", "FAQ")}
                </Link>
              )}

              {/* Choix de Langue dans le Menu Mobile */}
              <div className="pt-4 mt-3 border-t border-gray-200">
                <span className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
                  {t("header.language", "Langue")}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeLanguage("fr")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      i18n.language === "fr"
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span>🇫🇷</span>
                    <span>Français</span>
                  </button>
                  <button
                    onClick={() => changeLanguage("ar")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      i18n.language === "ar"
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span>🇲🇦</span>
                    <span>العربية</span>
                  </button>
                </div>
              </div>

              {/* Accès Espace Client / Mon Compte sur Mobile */}
              <div className="pt-3 mt-2 border-t border-gray-100">
                {client ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{t("header.my_space", "Mon espace")}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-100 text-gray-800 font-bold text-xs rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{t("header.client_area", "Mon compte")}</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Header;