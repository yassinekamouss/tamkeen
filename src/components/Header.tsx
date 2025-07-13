import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Header: React.FC = () => {
  const location = useLocation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActiveLink = (path: string) => {
    return location.pathname === path;
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-lg">
      <div className="w-full px-4 sm:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  className="h-8 sm:h-12 w-auto"
                  src={logo}
                  alt="Tamkeen Center"
                />
              </Link>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition duration-300 ${
                isActiveLink("/")
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}>
              Accueil
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-medium transition duration-300 ${
                isActiveLink("/about")
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}>
              À Propos
            </Link>
            <Link
              to="/faq"
              className={`px-3 py-2 text-sm font-medium transition duration-300 ${
                isActiveLink("/faq")
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}>
              FAQ
            </Link>
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="px-3 py-2 text-sm font-medium transition duration-300 flex items-center text-gray-700 hover:text-blue-600">
                Langue
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    isLanguageOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      <span className="mr-3 text-lg">🇲🇦</span>
                      العربية
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 bg-blue-50 text-blue-600">
                      <span className="mr-3 text-lg">🇫🇷</span>
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
                className={`block px-3 py-2 text-sm font-medium rounded-md transition duration-300 ${
                  isActiveLink("/")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}>
                Accueil
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition duration-300 ${
                  isActiveLink("/about")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}>
                À Propos
              </Link>
              <Link
                to="/faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition duration-300 ${
                  isActiveLink("/faq")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}>
                FAQ
              </Link>
              <div className="px-3 py-2">
                <span className="text-sm font-medium text-gray-700 mb-2 block">
                  Langue
                </span>
                <div className="space-y-1">
                  <button className="flex items-center w-full px-2 py-1 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                    <span className="mr-2 text-base">🇲🇦</span>
                    العربية
                  </button>
                  <button className="flex items-center w-full px-2 py-1 text-sm text-blue-600 bg-blue-50 rounded">
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
