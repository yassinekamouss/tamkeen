import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-removebg-preview.webp";
import { useTranslation } from "react-i18next";
import { ChevronDown, Menu, X } from "lucide-react";

interface HeaderProps {
  noSpacer?: boolean;
}

const Header: React.FC<HeaderProps> = ({ noSpacer = false }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const isHome =
    location.pathname === "/" || location.pathname === `/${i18n.language}`;

  const lang = i18n.language || "fr";
  const isRTL = lang === "ar";

  const isActiveLink = (path: string) => location.pathname === path;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
    setIsLangMenuOpen(false);
  };

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target as Node)
      ) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock scroll when mobile menu is open
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
    `text-[14px] font-medium whitespace-nowrap transition-colors duration-200 ${
      isActive ? "text-[#1A73E8]" : "text-[#202124] hover:text-[#1A73E8]"
    }`;

  const mobileNavItemClass = (active: boolean) =>
    `flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors duration-200 border-l-2 rtl:border-l-0 rtl:border-r-2 ${
      isRTL ? "text-right" : "text-left"
    } ${
      active
        ? "bg-[#E8F0FE] text-[#1A73E8] border-[#1A73E8] font-semibold"
        : "text-[#4B5563] border-transparent hover:text-[#1A73E8] hover:bg-[#F9FAFB]"
    }`;

  const LangDropdown = () => (
    <div className="relative" ref={langMenuRef}>
      <button
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className="flex items-center gap-1.5 py-1.5 px-3 border border-[#DADCE0] rounded-full text-xs font-medium text-[#5F6368] hover:bg-[#F8F9FA] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        <span>{i18n.language.toUpperCase()}</span>
        <ChevronDown
          size={13}
          className={`text-[#5F6368] transition-transform ${
            isLangMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isLangMenuOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-[#DADCE0] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.05)] py-1 z-50">
          <button
            onClick={() => changeLanguage("fr")}
            className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
              i18n.language === "fr"
                ? "text-[#1A73E8] bg-[#E8F0FE]"
                : "text-[#414754] hover:bg-[#F8F9FA]"
            }`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => changeLanguage("ar")}
            className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
              i18n.language === "ar"
                ? "text-[#1A73E8] bg-[#E8F0FE]"
                : "text-[#414754] hover:bg-[#F8F9FA]"
            }`}
          >
            🇲🇦 العربية
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b "
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/" aria-label="Accueil">
                <img
                  className="h-10 w-auto object-contain"
                  src={logo}
                  alt="Tamkeen Center"
                />
              </Link>
              <div className="hidden md:flex flex-col justify-center border-l border-[#DADCE0] pl-3 ml-1 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-3">
                <span
                  className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider leading-none whitespace-nowrap"
                  style={{ fontFamily: "Roboto Flex, sans-serif" }}
                >
                  {t("header.evaluation_portal")}
                </span>
              </div>
            </div>

            {/* Public marketing nav */}
            <nav
              className="hidden lg:flex items-center ml-10 gap-5"
              aria-label={t("header.main_nav")}
            >
              <Link
                to="/about"
                className={navItemClass(isActiveLink("/about"))}
              >
                {t("header.about", "À propos")}
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
                  onClick={() => scrollTo("faq")}
                  className={navItemClass(false)}
                >
                  {t("header.faq", "FAQ")}
                </button>
              ) : (
                <Link to="/faq" className={navItemClass(isActiveLink("/faq"))}>
                  {t("header.faq", "FAQ")}
                </Link>
              )}
            </nav>

            {/* Right section Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <LangDropdown />

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold bg-[#1A73E8] hover:bg-[#174EA6] text-white px-5 py-2.5 rounded transition-all shadow-sm"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {t("header.client_area", "Espace Client")}
                <svg
                  className="w-3.5 h-3.5"
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
              </Link>
            </div>

            {/* Burger Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#414754] hover:text-[#1A73E8] transition-colors rounded-md"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer */}
      {!isHome && !noSpacer && <div className="w-full h-14" />}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 flex flex-col top-14"
          style={{ height: "calc(100vh - 3.5rem)" }}
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs top-14"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            className="relative z-50 bg-white w-full max-h-full overflow-y-auto p-6 shadow-xl border-b border-[#DADCE0]"
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

              {/* Lang */}
              <div className="pt-4 mt-3 border-t border-[#DADCE0]">
                <span className="text-xs font-medium text-[#727785] mb-2 block uppercase tracking-wider">
                  {t("header.language", "Langue")}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeLanguage("fr")}
                    className={`flex-1 py-2 px-3 rounded text-xs font-medium border text-center transition-colors ${
                      i18n.language === "fr"
                        ? "border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]"
                        : "border-[#DADCE0] text-[#414754] bg-white"
                    }`}
                  >
                    🇫🇷 Français
                  </button>
                  <button
                    onClick={() => changeLanguage("ar")}
                    className={`flex-1 py-2 px-3 rounded text-xs font-medium border text-center transition-colors ${
                      i18n.language === "ar"
                        ? "border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]"
                        : "border-[#DADCE0] text-[#414754] bg-white"
                    }`}
                  >
                    🇲🇦 العربية
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 mt-2 border-t border-[#DADCE0]">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 bg-[#1A73E8] text-white font-medium text-sm rounded-lg hover:bg-[#174EA6] transition-colors"
                >
                  {t("header.client_area", "Espace Client")}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;