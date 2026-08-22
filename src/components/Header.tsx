import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.webp";
import { useTranslation } from "react-i18next";
import { useClientAuth } from "../contexts/ClientAuthContext";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { client } = useClientAuth();
  const location = useLocation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === "/" || location.pathname === `/${i18n.language}`;
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const isActiveLink = (path: string) => location.pathname === path;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('appLanguage', lng);
    setIsLanguageOpen(false);
  };

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItemClass = (active: boolean) =>
    `px-1 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border-b-2 ${
      active
        ? "text-[#1E5ED8] border-[#1E5ED8]"
        : "text-[#1F2937]/75 border-transparent hover:text-[#1E5ED8] hover:border-[#1E5ED8]/30"
    }`;

  // Lock body scroll when mobile menu is open
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

  const mobileNavItemClass = (active: boolean) =>
    `block w-full px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 border-l-2 rtl:border-l-0 rtl:border-r-2 ${
      isRTL ? "text-right" : "text-left"
    } ${
      active
        ? "text-[#1E5ED8] border-[#1E5ED8] bg-[#EEF4FF]"
        : "text-[#1F2937]/80 border-transparent hover:text-[#1E5ED8] hover:bg-[#F9FAFB]"
    }`;

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#FFFFFF] border-b border-[#E4E4E7]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" aria-label={t("header.home_aria")}>
              <img className="h-8 sm:h-10 w-auto" src={logo} alt="Tamkeen Center" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center h-full font-body" aria-label={t("header.main_nav")}>
            {/* Home / Anchor link */}
            {isHome ? (
              <button
                onClick={() => scrollTo("hero")}
                className={`${navItemClass(isActiveLink("/"))} bg-transparent border-none cursor-pointer mx-3`}
              >
                {t("header.home")}
              </button>
            ) : (
              <Link to="/" className={`${navItemClass(isActiveLink("/"))} mx-3`}>
                {t("header.home")}
              </Link>
            )}

            <Link to="/about" className={`${navItemClass(isActiveLink("/about"))} mx-3`}>
              {t("header.about")}
            </Link>

            {/* Programs - anchor on home, link otherwise */}
            {isHome ? (
              <button
                onClick={() => scrollTo("programs")}
                className={`${navItemClass(false)} bg-transparent border-none cursor-pointer mx-3`}
              >
                {t("header.programs")}
              </button>
            ) : (
              <Link to="/programs" className={`${navItemClass(isActiveLink("/programs"))} mx-3`}>
                {t("header.programs")}
              </Link>
            )}

            {/* News - anchor on home, link otherwise */}
            {isHome ? (
              <button
                onClick={() => scrollTo("actuality")}
                className={`${navItemClass(false)} bg-transparent border-none cursor-pointer mx-3`}
              >
                {t("header.news")}
              </button>
            ) : (
              <Link to="/news" className={`${navItemClass(isActiveLink("/news"))} mx-3`}>
                {t("header.news")}
              </Link>
            )}

            {/* FAQ - anchor on home, link otherwise */}
            {isHome ? (
              <button
                onClick={() => scrollTo("faq")}
                className={`${navItemClass(false)} bg-transparent border-none cursor-pointer mx-3`}
              >
                {t("header.faq")}
              </button>
            ) : (
              <Link to="/faq" className={`${navItemClass(isActiveLink("/faq"))} mx-3`}>
                {t("header.faq")}
              </Link>
            )}

            {client ? (
              <Link to="/dashboard" className={`${navItemClass(isActiveLink("/dashboard"))} mx-3`}>
                {t("header.my_space")}
              </Link>
            ) : (
              <Link to="/login" className={`${navItemClass(isActiveLink("/login"))} mx-3`}>
                {t("header.client_area")}
              </Link>
            )}

            {/* Primary CTA */}
            <button
              onClick={() => {
                if (isHome) {
                  scrollTo("eligibility-form");
                } else {
                  window.location.href = "/#eligibility-form";
                }
              }}
              className="ml-4 rtl:ml-0 rtl:mr-4 px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold uppercase tracking-wider font-body rounded-[4px] transition-colors duration-200 cursor-pointer border-none"
              aria-label={t("hero.cta")}
            >
              {t("hero.cta")}
            </button>

            {/* Language Switcher */}
            <div ref={dropdownRef} className="relative ml-3 rtl:ml-0 rtl:mr-3">
              <button
                id="language-switcher-btn"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition duration-300 flex items-center border border-[#E4E4E7] bg-white text-[#1F2937]/75 hover:text-[#1E5ED8] hover:border-[#1E5ED8]/50 rounded-[4px]"
                aria-haspopup="listbox"
                aria-expanded={isLanguageOpen}
                aria-label={t("header.language")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </button>

              {isLanguageOpen && (
                <div
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 bg-[#FFFFFF] border border-[#E4E4E7] shadow-sm z-50 rounded-[4px]"
                  role="listbox"
                  aria-label={t("header.language")}
                  tabIndex={-1}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setIsLanguageOpen(false);
                  }}
                >
                  <div className="py-1">
                    {[
                      { code: "ar", flag: "🇲🇦", label: "العربية" },
                      { code: "fr", flag: "🇫🇷", label: "Français" },
                    ].map(({ code, flag, label }) => (
                      <button
                        key={code}
                        role="option"
                        aria-selected={i18n.language === code}
                        onClick={() => changeLanguage(code)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            changeLanguage(code);
                          }
                        }}
                        className={`flex items-center w-full px-4 py-2.5 text-xs font-semibold transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1E5ED8] ${
                          i18n.language === code
                            ? "bg-[#1E5ED8] text-white"
                            : "text-[#1F2937]/75 hover:bg-[#F4F4F5] hover:text-[#1E5ED8]"
                        }`}
                      >
                        <span className="mr-2 rtl:ml-2 rtl:mr-0 text-base">{flag}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button & quick test button */}
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
              className="px-3 py-2 bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.98] text-white text-[11px] font-bold uppercase tracking-wider rounded-[4px] border-none cursor-pointer min-h-[38px] flex items-center justify-center"
              aria-label={t("hero.cta")}
            >
              {t("header.test_short")}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 min-h-[42px] min-w-[42px] flex items-center justify-center focus:outline-none text-[#1F2937] hover:text-[#1E5ED8] transition-colors rounded-[4px] border border-[#E4E4E7]"
              aria-label={t("header.menu")}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

      {/* Mobile Navigation Drawer with Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[56px] z-40 bg-black/40 backdrop-blur-sm animate-drawerFadeIn flex flex-col justify-start">
          <div 
            className="bg-white border-b border-[#E4E4E7] shadow-xl py-3 px-4 max-h-[85vh] overflow-y-auto animate-slideDownMenu"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <nav className="flex flex-col space-y-1" aria-label={t("header.mobile_nav")}>
              {isHome ? (
                <button onClick={() => scrollTo("hero")} className={mobileNavItemClass(isActiveLink("/"))}>
                  {t("header.home")}
                </button>
              ) : (
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavItemClass(isActiveLink("/"))}>
                  {t("header.home")}
                </Link>
              )}

              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavItemClass(isActiveLink("/about"))}>
                {t("header.about")}
              </Link>

              {isHome ? (
                <button onClick={() => scrollTo("programs")} className={mobileNavItemClass(false)}>
                  {t("header.programs")}
                </button>
              ) : (
                <Link to="/programs" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavItemClass(isActiveLink("/programs"))}>
                  {t("header.programs")}
                </Link>
              )}

              {isHome ? (
                <button onClick={() => scrollTo("actuality")} className={mobileNavItemClass(false)}>
                  {t("header.news")}
                </button>
              ) : (
                <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavItemClass(isActiveLink("/news"))}>
                  {t("header.news")}
                </Link>
              )}

              {isHome ? (
                <button onClick={() => scrollTo("faq")} className={mobileNavItemClass(false)}>
                  {t("header.faq")}
                </button>
              ) : (
                <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavItemClass(isActiveLink("/faq"))}>
                  {t("header.faq")}
                </Link>
              )}

              {client ? (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavItemClass(isActiveLink("/dashboard"))}>
                  {t("header.my_space")}
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavItemClass(isActiveLink("/login"))}>
                  {t("header.client_area")}
                </Link>
              )}

              {/* Language switcher mobile */}
              <div className="pt-4 mt-3 border-t border-[#E4E4E7] flex items-center justify-between px-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1F2937]/50">
                  {t("header.language")}
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { code: "ar", flag: "🇲🇦", label: "العربية" },
                    { code: "fr", flag: "🇫🇷", label: "Français" },
                  ].map(({ code, flag, label }) => (
                    <button
                      key={code}
                      onClick={() => {
                        changeLanguage(code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wide border transition-colors rounded-[4px] min-h-[38px] ${
                        i18n.language === code
                          ? "bg-[#1E5ED8] text-white border-[#1E5ED8]"
                          : "bg-white text-[#1F2937]/70 border-[#E4E4E7] hover:border-[#1E5ED8] hover:text-[#1E5ED8]"
                      }`}
                    >
                      <span>{flag}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Touch backdrop area to close menu */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;

