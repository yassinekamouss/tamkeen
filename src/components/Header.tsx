import React, { useState, useEffect, useRef } from "react";
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
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === "/" || location.pathname === `/${i18n.language}`;
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const isActiveLink = (path: string) => location.pathname === path;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("appLanguage", lng);
    setIsLangMenuOpen(false);
  };

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Fermer le menu de langue si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const navItemClass = (isActive: boolean) =>
  `
    text-[14px]
    leading-[20px]
    font-[500]
    text-[#202124]
    font-["Google_Sans"]
    whitespace-nowrap
    transition-colors
    duration-200
    ${isActive ? "text-[#1a73e8]" : ""}
  `.trim();

  const mobileNavItemClass = (active: boolean) =>
    `block w-full px-4 py-3 text-sm font-medium transition-colors duration-200 border-l-2 rtl:border-l-0 rtl:border-r-2 ${
      isRTL ? "text-right" : "text-left"
    } ${
      active
        ? "text-[#1E5ED8] border-[#1E5ED8] bg-[#EEF4FF]"
        : "text-[#4B5563] border-transparent hover:text-[#1E5ED8] hover:bg-[#F9FAFB]"
    }`;

  return (
    <>
      <header
        className="mb-32 fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-300 shadow-sm transition-all duration-300"
        dir={isRTL ? "rtl" : "ltr"}
        style={{ fontFamily: "'Roboto', Google Sans" }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo + Navigation */}
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center gap-3">
                {/* Logo */}
                <Link to="/" aria-label={t("header.home_aria")}>
                  <img
                    className="h-10 sm:h-12 w-auto object-contain"
                    src={logo}
                    alt="Tamkeen Center"
                  />
                </Link>

                {/* Texte centré verticalement par rapport au logo */}
                <div
                  className="
                    hidden md:flex
                    flex-col
                    justify-center
                    border-l border-[#DADCE0]
                    pl-3
                    ml-1

                    rtl:border-l-0
                    rtl:border-r
                    rtl:pl-0
                    rtl:pr-3
                    rtl:ml-0
                    rtl:mr-1
                  "
                >
                  <span
                    className="
                      text-[10px]
                      font-bold
                      text-[#5F6368]
                      uppercase
                      tracking-wider
                      leading-none
                      whitespace-nowrap
                      rtl:text-right
                      rtl:tracking-normal
                    "
                    style={{ fontFamily: "Roboto Flex, sans-serif" }}
                  >
                    {t("header.evaluation_portal")}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav
                className="
                  hidden lg:flex
                  items-center
                  ml-10
                  gap-5
                "
                aria-label={t("header.main_nav")}
              >
                <Link
                  to="/about"
                  className={navItemClass(isActiveLink("/about"))}
                >
                  {t("header.about", "A propos")}
                </Link>

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
                  <button
                    onClick={() => scrollTo("programs")}
                    className={navItemClass(false)}
                  >
                    {t("header.programs", "Programmes disponibles")}
                  </button>
                ) : (
                  <Link
                    to="/programs"
                    className={navItemClass(isActiveLink("/programs"))}
                  >
                    {t("header.programs", "Programmes disponibles")}
                  </Link>
                )}

                {isHome ? (
                  <button
                    onClick={() => scrollTo("faq")}
                    className={navItemClass(false)}
                  >
                    {t("header.faq", "FAQ")}
                  </button>
                ) : (
                  <Link
                    to="/faq"
                    className={navItemClass(isActiveLink("/faq"))}
                  >
                    {t("header.faq", "FAQ")}
                  </Link>
                )}
              </nav>
            </div>

            {/* Section droite */}
            <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
              {/* Dropdown Langue */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-1.5 py-1.5 px-3 border border-[#DADCE0] rounded-full text-xs font-medium text-[#5F6368] hover:bg-[#F8F9FA] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#5F6368]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>{i18n.language.toUpperCase()}</span>
                  <svg className={`w-3.5 h-3.5 text-[#5F6368] transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-[#DADCE0] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.05)] py-1 z-50 overflow-hidden">
                    <button
                      onClick={() => changeLanguage("fr")}
                      className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors ${i18n.language === 'fr' ? 'text-[#1A73E8] bg-[#E8F0FE]' : 'text-[#414754] hover:bg-[#F8F9FA]'}`}
                    >
                      🇫🇷 Français
                    </button>
                    <button
                      onClick={() => changeLanguage("ar")}
                      className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors ${i18n.language === 'ar' ? 'text-[#1A73E8] bg-[#E8F0FE]' : 'text-[#414754] hover:bg-[#F8F9FA]'}`}
                    >
                      🇲🇦 العربية
                    </button>
                  </div>
                )}
              </div>

              {/* Lien Espace Client */}
              <Link
                to={client ? "/dashboard" : "/login"}
                className="
                  text-xs
                  font-bold
                  bg-[#1A73E8]
                  hover:bg-[#174EA6]
                  text-white
                  hover:text-white
                  focus:text-white
                  px-5
                  py-2.5
                  rounded
                  transition-all
                  shadow-sm
                  flex
                  items-center
                  gap-2
                "
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {client
                  ? t("header.my_space", "Mon espace")
                  : t("header.client_area", "Espace Client")}

                {!client && (
                  <svg
                    className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </Link>
            </div>

            {/* Menu Burger (Mobile) */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md focus:outline-none"
                aria-expanded={isMobileMenuOpen}
                aria-label={t("header.menu", "Menu")}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer pour compenser la navbar fixe (80px = h-20) */}
      {!isHome && !noSpacer && (
        <div className="w-full h-14" />
      )}

      {/* Menu Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex flex-col justify-start transition-all duration-300 top-[80px]"
          style={{ fontFamily: "'Roboto', Google Sans" }}
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
                {t("header.about", "A propos")}
              </Link>

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
                  onClick={() => scrollTo("programs")}
                  className={mobileNavItemClass(false)}
                >
                  {t("header.programs", "Programmes disponibles")}
                </button>
              ) : (
                <Link
                  to="/programs"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileNavItemClass(isActiveLink("/programs"))}
                >
                  {t("header.programs", "Programmes disponibles")}
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
                <span className="text-xs font-medium text-gray-500 mb-2 block uppercase tracking-wider">
                  {t("header.language", "Language")}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeLanguage("fr")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      i18n.language === "fr"
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span>🇫🇷</span>
                    <span>Français</span>
                  </button>
                  <button
                    onClick={() => changeLanguage("ar")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      i18n.language === "ar"
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span>🇲🇦</span>
                    <span>العربية</span>
                  </button>
                </div>
              </div>

              {/* Accès Espace Client sur Mobile */}
              <div className="pt-4 mt-2 border-t border-gray-100">
                <Link
                  to={client ? "/dashboard" : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 bg-[#1E5ED8] text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>{client ? t("header.my_space", "Mon espace") : t("header.client_area", "Espace Client")}</span>
                </Link>
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