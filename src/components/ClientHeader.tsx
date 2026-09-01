import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo-removebg-preview.webp";
import { useTranslation } from "react-i18next";
import { useClientAuth } from "../contexts/ClientAuthContext";
import {
  LayoutDashboard,
  ClipboardCheck,
  UserCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  FileText
} from "lucide-react";

interface ClientHeaderProps {
  noSpacer?: boolean;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ noSpacer = false }) => {
  const { i18n } = useTranslation();
  const { client, logout } = useClientAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const isActiveLink = (path: string) => location.pathname === path;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("appLanguage", lng);
    setIsLangMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    navigate("/login");
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const clientNavItemClass = (isActive: boolean) =>
    `inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded transition-colors duration-200 ${
      isActive
        ? "text-[#1A73E8] bg-[#E8F0FE]"
        : "text-[#414754] hover:text-[#1A73E8] hover:bg-[#F1F3F4]"
    }`;

  const mobileNavItemClass = (active: boolean) =>
    `flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors duration-200 border-l-2 rtl:border-l-0 rtl:border-r-2 ${
      isRTL ? "text-right" : "text-left"
    } ${
      active
        ? "text-[#1A73E8] border-[#1A73E8] bg-[#EEF4FF]"
        : "text-[#4B5563] border-transparent hover:text-[#1A73E8] hover:bg-[#F9FAFB]"
    }`;

  const displayName =
    client?.applicantType === "morale"
      ? client.nomEntreprise || client.email
      : `${client?.prenom || ""} ${client?.nom || ""}`.trim() || client?.email;

  const initials = displayName
    ? displayName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("")
    : "?";

  const LangDropdown = () => (
    <div className="relative" ref={langMenuRef}>
      <button
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className="flex items-center gap-1.5 py-1.5 px-3 border border-[#DADCE0] rounded-full text-xs font-medium text-[#5F6368] hover:bg-[#F8F9FA] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <span>{i18n.language.toUpperCase()}</span>
        <ChevronDown
          size={13}
          className={`text-[#5F6368] transition-transform ${isLangMenuOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isLangMenuOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-[#DADCE0] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.05)] py-1 z-50">
          <button
            onClick={() => changeLanguage("fr")}
            className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
              i18n.language === "fr" ? "text-[#1A73E8] bg-[#E8F0FE]" : "text-[#414754] hover:bg-[#F8F9FA]"
            }`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => changeLanguage("ar")}
            className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
              i18n.language === "ar" ? "text-[#1A73E8] bg-[#E8F0FE]" : "text-[#414754] hover:bg-[#F8F9FA]"
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
        className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[#DADCE0] transition-all duration-300"
        dir={isRTL ? "rtl" : "ltr"}
        style={{ fontFamily: "'Roboto', sans-serif" }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/client/dashboard" aria-label="Accueil Espace Client">
                <img className="h-10 w-auto object-contain" src={logo} alt="Tamkeen Center" />
              </Link>
              <div className="hidden md:flex flex-col justify-center border-l border-[#DADCE0] pl-3 ml-1 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-3">
                <span
                  className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider leading-none whitespace-nowrap"
                  style={{ fontFamily: "Roboto Flex, sans-serif" }}
                >
                  Espace Client
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation espace client">
              <Link to="/client/dashboard" className={clientNavItemClass(isActiveLink("/client/dashboard") || isActiveLink("/dashboard"))}>
                <LayoutDashboard size={15} />
                Mon tableau de bord
              </Link>
              <Link to="/client/historique" className={clientNavItemClass(isActiveLink("/client/historique"))}>
                <FileText size={15} />
                Historique
              </Link>
              <Link to="/client/test" className={clientNavItemClass(isActiveLink("/client/test"))}>
                <ClipboardCheck size={15} />
                Nouveau test
              </Link>
              <Link to="/client/profile" className={clientNavItemClass(isActiveLink("/client/profile"))}>
                <UserCircle size={15} />
                Mon profil
              </Link>
            </nav>

            {/* Right section */}
            <div className="hidden lg:flex items-center gap-3">
              <LangDropdown />

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#DADCE0] hover:bg-[#F8F9FA] transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-[#1A73E8] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {initials}
                  </span>
                  <span className="text-[13px] font-medium text-[#202124] max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[#5F6368] transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#DADCE0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-2 z-50 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[#DADCE0]">
                      <p className="text-[11px] text-[#727785] font-medium uppercase tracking-wide">
                        Connecté en tant que
                      </p>
                      <p className="text-[13px] font-semibold text-[#191C1D] truncate mt-0.5">
                        {client?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/client/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#414754] hover:bg-[#F1F3F4] hover:text-[#191C1D] transition-colors"
                      >
                        <UserCircle size={15} className="text-[#727785]" />
                        Mon profil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-[#BA1A1A] hover:bg-[#FFDAD6] transition-colors"
                      >
                        <LogOut size={15} />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#414754] hover:text-[#1A73E8] transition-colors rounded-md"
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {!noSpacer && <div className="w-full h-14" />}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 flex flex-col top-14"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          <div
            className="bg-white shadow-2xl py-4 px-5 max-h-[85vh] overflow-y-auto border-b border-[#DADCE0]"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <nav className="flex flex-col space-y-1">
              <Link
                to="/client/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileNavItemClass(
                  isActiveLink("/client/dashboard") || isActiveLink("/dashboard")
                )}
              >
                <LayoutDashboard size={16} />
                Mon tableau de bord
              </Link>
              <Link
                to="/client/historique"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileNavItemClass(isActiveLink("/client/historique"))}
              >
                <FileText size={16} />
                Historique
              </Link>
              <Link
                to="/client/test"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileNavItemClass(isActiveLink("/client/test"))}
              >
                <ClipboardCheck size={16} />
                Nouveau test
              </Link>
              <Link
                to="/client/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileNavItemClass(isActiveLink("/client/profile"))}
              >
                <UserCircle size={16} />
                Mon profil
              </Link>

              {/* Lang */}
              <div className="pt-4 mt-3 border-t border-[#DADCE0]">
                <span className="text-xs font-medium text-[#727785] mb-2 block uppercase tracking-wider">
                  Langue
                </span>
                <div className="flex gap-2">
                  {["fr", "ar"].map((lng) => (
                    <button
                      key={lng}
                      onClick={() => { changeLanguage(lng); setIsMobileMenuOpen(false); }}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                        i18n.language === lng
                          ? "bg-[#E8F0FE] text-[#1A73E8] border-[#ADC7FF]"
                          : "bg-white text-[#414754] border-[#DADCE0] hover:bg-[#F8F9FA]"
                      }`}
                    >
                      <span>{lng === "fr" ? "🇫🇷" : "🇲🇦"}</span>
                      <span>{lng === "fr" ? "Français" : "العربية"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <div className="pt-4 mt-2 border-t border-[#DADCE0]">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-[#DADCE0] text-[#BA1A1A] font-medium text-sm rounded-lg hover:bg-[#FFDAD6] transition-colors"
                >
                  <LogOut size={15} />
                  Se déconnecter
                </button>
              </div>
            </nav>
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};

export default ClientHeader;
