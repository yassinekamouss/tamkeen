import React from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";

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
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] shrink-0" />
          <p className="text-[11px] font-bold tracking-[0.15em] text-[#1A73E8] uppercase">
            {t("document_security.badge")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-14 items-center">
          <div className="sm:col-span-7 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-[18px] sm:text-[22px] font-bold text-[#191C1D] leading-tight tracking-tight mb-2">
                {t("document_security.title")}
              </h3>
              <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#5F6368] max-w-lg">
                {t("document_security.desc")}
              </p>
            </div>
          </div>

          <div className="sm:col-span-5 flex flex-wrap sm:flex-col sm:items-end gap-2.5 pt-2 sm:pt-0">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F9FA] border border-[#DADCE0] text-[12px] text-[#475569] font-medium font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              {t("document_security.badge1")}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F9FA] border border-[#DADCE0] text-[12px] text-[#475569] font-medium font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              {t("document_security.badge2")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentSecuritySection;