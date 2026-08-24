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
      className="w-full bg-white border-b border-[#E5E5E0]"
    >
      <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-14 sm:py-18">

        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#1E5ED8] uppercase mb-4">
          {t("document_security.badge")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-14">
          <div className="sm:col-span-7">
            <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1A1A1A] leading-[1.3] tracking-[-0.01em] mb-3">
              {t("document_security.title")}
            </h3>
            <p className="text-[13px] leading-[1.8] text-[#666] max-w-lg">
              {t("document_security.desc")}
            </p>
          </div>

          <div className="sm:col-span-5 sm:pt-1 sm:flex sm:flex-col sm:items-end gap-2">
            <span className="text-[12px] text-[#888] leading-relaxed">
              {t("document_security.badge1")}
            </span>
            <span className="text-[12px] text-[#888] leading-relaxed">
              {t("document_security.badge2")}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DocumentSecuritySection;