import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-removebg-preview.webp";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  noSpacer?: boolean;
}

const Header: React.FC<HeaderProps> = ({ noSpacer = false }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome =
    location.pathname === "/" || location.pathname === `/${i18n.language}`;

  const lang = i18n.language || "fr";
  const isRTL = lang === "ar";

  const isActiveLink = (path: string) => location.pathname === path;

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
              <LanguageSwitcher />

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

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#414754] hover:text-[#1A73E8] transition-colors rounded-md"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
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