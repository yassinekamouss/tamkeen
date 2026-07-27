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
      className="w-full bg-[#FAFAFA] border-b border-[#E4E4E7] py-20 sm:py-28"
      aria-label={t("faq_section.badge")}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-14">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#F97316] font-display mb-3">
            {t("faq_section.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] font-display tracking-tight leading-tight mb-3">
            {t("faq_section.title")}
          </h2>
          <p className="text-sm text-[#1F2937]/55 max-w-lg leading-relaxed">{t("faq_section.subtitle")}</p>
          <div className="mt-6 h-[1px] bg-[#E4E4E7]" />
        </div>

        {/* Accordion */}
        <div className="divide-y divide-[#E4E4E7] border-t border-[#E4E4E7]">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  id={`faq-btn-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-5 text-left bg-transparent border-none cursor-pointer group"
                >
                  <span
                    className={`text-sm font-semibold font-display leading-snug transition-colors ${isOpen ? "text-[#1E5ED8]" : "text-[#1F2937] group-hover:text-[#1E5ED8]"}`}
                  >
                    {item.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-5 h-5 flex items-center justify-center border border-[#E4E4E7] rounded-full mt-0.5 transition-all duration-200 ${isOpen ? "bg-[#1E5ED8] border-[#1E5ED8] rotate-180" : "bg-white group-hover:border-[#1E5ED8]"}`}
                    aria-hidden="true"
                  >
                    <svg
                      className={`w-3 h-3 transition-colors ${isOpen ? "text-white" : "text-[#1F2937]/50"}`}
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
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px] opacity-100 pb-5" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-sm text-[#1F2937]/65 leading-relaxed">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 pt-8 border-t border-[#E4E4E7] flex items-center gap-3">
          <p className="text-sm text-[#1F2937]/60">{t("faq_section.contact")}</p>
          <a
            href="mailto:contact@masubvention.ma"
            className="text-[11px] font-mono uppercase tracking-wider text-[#1E5ED8] hover:text-[#F97316] transition-colors border-b border-[#1E5ED8] hover:border-[#F97316] pb-px"
          >
            {t("faq_section.contactLink")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
