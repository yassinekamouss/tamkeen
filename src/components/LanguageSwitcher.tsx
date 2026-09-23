import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Check } from "lucide-react";

export const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
];

export interface LanguageSwitcherProps {
  variant?: "dropdown" | "inline";
  className?: string;
  onLanguageChange?: (code: string) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "dropdown",
  className = "",
  onLanguageChange,
}) => {
  const { i18n } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("appLanguage", lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
    setIsLangMenuOpen(false);
    onLanguageChange?.(lng);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 w-full ${className}`}>
        {LANGUAGES.map(({ code, label, flag }) => {
          const isActive = i18n.language === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => changeLanguage(code)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                isActive
                  ? "border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]"
                  : "border-[#DADCE0] text-[#5F6368] bg-white hover:bg-[#F8F9FA]"
              }`}
            >
              <span className="text-sm leading-none">{flag}</span>
              <span>{label}</span>
              {isActive && <Check size={13} className="text-[#1A73E8]" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={langMenuRef}>
      <button
        type="button"
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className="flex items-center gap-1.5 py-1.5 px-3 border border-[#DADCE0] rounded-full text-xs font-medium text-[#5F6368] hover:bg-[#F8F9FA] transition-colors"
        aria-expanded={isLangMenuOpen}
        aria-label="Sélectionner la langue"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        <span>{(i18n.language || "FR").toUpperCase()}</span>
        <ChevronDown
          size={13}
          className={`text-[#5F6368] transition-transform ${
            isLangMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isLangMenuOpen && (
        <div className="absolute end-0 mt-2 min-w-[9.5rem] bg-white border border-[#DADCE0] rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.05)] p-1 z-50 flex flex-col gap-0.5">
          {LANGUAGES.map(({ code, label, flag }) => {
            const isActive = i18n.language === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => changeLanguage(code)}
                className={`flex items-center gap-2 w-full py-1.5 px-3 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? "text-[#1A73E8] bg-[#E8F0FE]"
                    : "text-[#5F6368] hover:bg-[#F8F9FA]"
                }`}
              >
                <span className="text-sm leading-none">{flag}</span>
                <span className="flex-1 text-start">{label}</span>
                {isActive && <Check size={13} className="text-[#1A73E8]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
