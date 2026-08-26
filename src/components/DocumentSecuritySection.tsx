import React from "react";
import { useTranslation } from "react-i18next";

const DocumentSecuritySection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  return (
    <section
      id="security"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-white border-b border-[#DADCE0]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <p className="text-[11px] font-bold tracking-[0.15em] text-[#1A73E8] uppercase mb-4 block" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
          {t("document_security.badge")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-14">
          <div className="sm:col-span-7">
            <h3 className="text-[20px] sm:text-[24px] font-bold text-[#191C1D] leading-tight tracking-tight mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {t("document_security.title")}
            </h3>
            <p className="text-[14px] leading-relaxed text-[#5F6368] max-w-lg" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
              {t("document_security.desc")}
            </p>
          </div>

          <div className="sm:col-span-5 sm:pt-1 sm:flex sm:flex-col sm:items-end gap-2">
            <span className="text-[13px] text-[#727785] leading-relaxed font-medium tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {t("document_security.badge1")}
            </span>
            <span className="text-[13px] text-[#727785] leading-relaxed font-medium tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {t("document_security.badge2")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentSecuritySection;