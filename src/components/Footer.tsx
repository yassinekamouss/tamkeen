import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#1E5ED8] text-[#FFFFFF] border-t border-white/10 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Section principale avec 3 colonnes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Colonne 1: Logo et description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4 sm:mb-6">
              <img
                src={logo}
                alt="Tamkeen Center"
                className="h-10 sm:h-12 w-auto mr-3 bg-white/10 p-1.5 rounded"
              />
              <span className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">
                {t('footer.brand')}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-[#FFFFFF]/75 leading-relaxed text-xs sm:text-sm text-start max-w-sm font-body">
                {t('footer.description')}
              </p>
            </div>
          </div>

          {/* Colonne 2: Navigation */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 text-[#F97316] font-display">
              {t('footer.navigation')}
            </h3>
            <ul className="space-y-2 font-body">
              <li>
                <Link
                  to="/"
                  className="text-[#FFFFFF]/80 hover:text-[#F97316] transition-colors duration-200 text-xs sm:text-sm">
                  {t('header.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[#FFFFFF]/80 hover:text-[#F97316] transition-colors duration-200 text-xs sm:text-sm">
                  {t('header.about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-[#FFFFFF]/80 hover:text-[#F97316] transition-colors duration-200 text-xs sm:text-sm">
                  {t('header.faq')}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[#FFFFFF]/80 hover:text-[#F97316] transition-colors duration-200 text-xs sm:text-sm">
                  {t('header.privacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Contact et réseaux sociaux */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 text-[#F97316] font-display text-start">
              {t('footer.contact')}
            </h3>
            <div className="space-y-2 mb-6 font-body">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-[#F97316] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a
                  href="mailto:contact@masubvention.ma"
                  className="text-[#FFFFFF]/80 hover:text-[#F97316] transition-colors duration-200 text-xs sm:text-sm">
                  {t('footer.email')}
                </a>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-[#F97316] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#FFFFFF]/80 text-xs sm:text-sm">
                  {t('footer.address')}
                </span>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h4 className="text-xs font-bold tracking-wider text-[#F97316] mb-3 text-start uppercase font-body">
                {t('footer.followUs')}
              </h4>
              <div className="flex space-x-3">
                <a
                  href="https://www.facebook.com/share/16W7DLrytf/?mibextid=wwXIfr"
                  className="text-[#FFFFFF]/80 hover:text-[#F97316] transition-colors duration-200"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/tamkeen-center/"
                  className="text-[#FFFFFF]/80 hover:text-[#F97316] transition-colors duration-200"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/tamkeen_center_consulting?igsh=NjllczJzNDRsdWRq"
                  className="text-[#FFFFFF]/80 hover:text-[#F97316] transition-colors duration-200"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm9 1.75a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation et copyright */}
        <div className="border-t border-white/10 mt-8 pt-8 font-body">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-[#FFFFFF]/50 text-xs sm:text-sm mb-4 sm:mb-0">
              {t('footer.rights')}
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <Link
                to="/privacy"
                className="text-[#FFFFFF]/50 hover:text-white transition-colors duration-200">
                {t('footer.privacy')}
              </Link>
              <a
                href="#"
                className="text-[#FFFFFF]/50 hover:text-white transition-colors duration-200">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

