import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface FaqItem {
  q: string;
  a: string;
}

const FaqSection: React.FC = () => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items: FaqItem[] = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
  ];

  return (
    <section
      id="faq"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-[#F8F9FA] py-20 sm:py-24"
      aria-label={t("faq_section.badge")}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#1A73E8] uppercase mb-4 block" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
            {t("faq_section.badge")}
          </span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#191C1D] leading-tight tracking-tight mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {t("faq_section.title")}
          </h2>
          <p className="text-[15px] text-[#5F6368] max-w-lg leading-relaxed" style={{ fontFamily: "Roboto Flex, sans-serif" }}>{t("faq_section.subtitle")}</p>
          <div className="mt-8 h-[1px] bg-[#DADCE0]" />
        </div>

        {/* Accordion */}
        <div className="divide-y divide-[#DADCE0] border-t border-[#DADCE0]">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  id={`faq-btn-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left bg-transparent border-none cursor-pointer group"
                >
                  <span
                    className={`text-[16px] font-bold leading-snug transition-colors ${isOpen ? "text-[#1A73E8]" : "text-[#191C1D] group-hover:text-[#1A73E8]"}`}
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {item.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center border border-[#DADCE0] rounded-full mt-0.5 transition-all duration-200 ${isOpen ? "bg-[#1A73E8] border-[#1A73E8] rotate-180" : "bg-white group-hover:border-[#1A73E8]"}`}
                    aria-hidden="true"
                  >
                    <svg
                      className={`w-3.5 h-3.5 transition-colors ${isOpen ? "text-white" : "text-[#5F6368]"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px] opacity-100 pb-6" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-[15px] text-[#5F6368] leading-relaxed" style={{ fontFamily: "Roboto Flex, sans-serif" }}>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 pt-8 border-t border-[#DADCE0] flex items-center gap-3">
          <p className="text-[14px] text-[#5F6368]" style={{ fontFamily: "Roboto Flex, sans-serif" }}>{t("faq_section.contact")}</p>
          <a
            href="mailto:contact@masubvention.ma"
            className="text-[12px] font-bold uppercase tracking-wider text-[#1A73E8] hover:text-[#174EA6] transition-colors border-b border-[#1A73E8] hover:border-[#174EA6] pb-px"
            style={{ fontFamily: "Roboto Flex, sans-serif" }}
          >
            {t("faq_section.contactLink")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
