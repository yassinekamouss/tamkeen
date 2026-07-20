import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.webp";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  // Fermer le dropdown quand on clique en dehors
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#FFFFFF] border-b border-[#E4E4E7]">
      <div className="w-full px-4 sm:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  className="h-8 sm:h-10 w-auto"
                  src={logo}
                  alt="Tamkeen Center"
                />
              </Link>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8 h-full items-center font-display">
            <Link
              to="/"
              className={`px-1 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                isActiveLink("/")
                  ? "text-[#1E5ED8] border-[#1E5ED8]"
                  : "text-[#1F2937]/75 border-transparent hover:text-[#1E5ED8] hover:border-[#1E5ED8]/30"
              }`}>
              {t("header.home")}
            </Link>
            <Link
              to="/about"
              className={`px-1 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                isActiveLink("/about")
                  ? "text-[#1E5ED8] border-[#1E5ED8]"
                  : "text-[#1F2937]/75 border-transparent hover:text-[#1E5ED8] hover:border-[#1E5ED8]/30"
              }`}>
              {t("header.about")}
            </Link>
            <Link
              to="/news"
              className={`px-1 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                isActiveLink("/news")
                  ? "text-[#1E5ED8] border-[#1E5ED8]"
                  : "text-[#1F2937]/75 border-transparent hover:text-[#1E5ED8] hover:border-[#1E5ED8]/30"
              }`}>
              {t("header.news")}
            </Link>
            <Link
              to="/faq"
              className={`px-1 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                isActiveLink("/faq")
                  ? "text-[#1E5ED8] border-[#1E5ED8]"
                  : "text-[#1F2937]/75 border-transparent hover:text-[#1E5ED8] hover:border-[#1E5ED8]/30"
              }`}>
              {t("header.faq")}
            </Link>
            <Link
              to="/programs"
              className={`px-1 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                isActiveLink("/programs")
                  ? "text-[#1E5ED8] border-[#1E5ED8]"
                  : "text-[#1F2937]/75 border-transparent hover:text-[#1E5ED8] hover:border-[#1E5ED8]/30"
              }`}>
              {t("header.programs")}
            </Link>
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="px-2 py-1 text-md font-semibold uppercase tracking-wider transition duration-300 flex items-center border border-[#E4E4E7] bg-white text-[#1F2937]/75 hover:text-[#1E5ED8] hover:border-[#1E5ED8]/50">
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>

              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#FFFFFF] border border-[#E4E4E7] shadow-sm z-50">
                  <div className="py-1">
                    <button
                      onClick={() => changeLanguage("ar")}
                      className={`flex items-center w-full px-4 py-2 text-xs font-semibold rounded-none transition-colors duration-150 ${
                        i18n.language === "ar"
                          ? "bg-[#1E5ED8] text-white"
                          : "text-[#1F2937]/75 hover:bg-[#E4E4E7] hover:text-[#1E5ED8]"
                      }`}
                    >
                      <span className="mr-2 text-sm">🇲🇦</span>
                      العربية
                    </button>

                    <button
                      onClick={() => changeLanguage("fr")}
                      className={`flex items-center w-full px-4 py-2 text-xs font-semibold rounded-none transition-colors duration-150 ${
                        i18n.language === "fr"
                          ? "bg-[#1E5ED8] text-white"
                          : "text-[#1F2937]/75 hover:bg-[#E4E4E7] hover:text-[#1E5ED8]"
                      }`}
                    >

                      <span className="mr-2 text-sm">🇫🇷</span>
                      Français
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none transition duration-300 text-gray-700 hover:text-blue-600 focus:text-blue-600">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-3 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium transition duration-300 ${
                  isActiveLink("/")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}>
                {t("header.home")}
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium transition duration-300 ${
                  isActiveLink("/about")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}>
                {t("header.about")}
              </Link>
              <Link
                to="/news"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium transition duration-300 ${
                  isActiveLink("/news")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}>
                {t("header.news")}
              </Link>
              <Link
                to="/faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium transition duration-300 ${
                  isActiveLink("/faq")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}>
                {t("header.faq")}
              </Link>
              <div className="px-3 py-2">
                <span className="text-sm font-medium text-gray-700 mb-2 block">
                  {t("header.language")}
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      changeLanguage("ar");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    <span className="mr-2 text-base">🇲🇦</span>
                    العربية
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage("fr");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-2 py-1 text-sm text-blue-600 bg-blue-50">
                    <span className="mr-2 text-base">🇫🇷</span>
                    Français
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
