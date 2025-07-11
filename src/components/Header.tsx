import React from "react";
import logo from "../assets/logo.png";

const Header: React.FC = () => {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-lg">
      <div className="w-full px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-12 w-auto"
                src={logo}
                alt="Tamkeen Center"
              />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="px-3 py-2 text-sm font-medium transition duration-300 text-gray-700 hover:text-blue-600">
              Accueil
            </a>
            <a
              href="#"
              className="px-3 py-2 text-sm font-medium transition duration-300 text-gray-700 hover:text-blue-600">
              À Propos
            </a>
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium transition duration-300 flex items-center text-gray-700 hover:text-blue-600">
                Langue
                <svg
                  className="ml-1 h-4 w-4"
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
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="focus:outline-none transition duration-300 text-gray-700 hover:text-blue-600 focus:text-blue-600">
              <svg
                className="h-6 w-6"
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
      </div>
    </header>
  );
};

export default Header;
