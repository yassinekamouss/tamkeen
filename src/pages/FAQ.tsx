import React, { useState } from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import SeoAlternates from "../components/SeoAlternates";

const FAQ: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const lang = i18n.language as "fr" | "ar";

  const faqData = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
  ];

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-[#FFFFFF] font-sans text-[#1F2937]">
      <Helmet>
        <title>{`${t("faq.title")} | Tamkeen`}</title>
        <meta name="description" content={t("faq.subtitle")} />
        <meta property="og:title" content={`${t("faq.title")} | Tamkeen`} />
        <meta property="og:description" content={t("faq.subtitle")} />
      </Helmet>
      <SeoAlternates />

      <Header />
      <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F97316] mb-3 block">
              {lang === "fr" ? "Questions fréquentes" : "الأسئلة الشائعة"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#1F2937] tracking-tight mb-4">
              {t("faq.title")}
            </h1>
            <div className="w-12 h-[2px] bg-[#1E5ED8]/20 mx-auto mb-6"></div>
            <p className="text-sm sm:text-base text-[#1F2937]/65 max-w-xl mx-auto leading-relaxed">
              {t("faq.subtitle")}
            </p>
          </div>

          {/* Bespoke Accordion List */}
          <div className="space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`border rounded-none transition-all duration-300 bg-white ${
                    isOpen
                      ? "border-[#1E5ED8]"
                      : "border-[#E4E4E7] hover:border-[#1E5ED8]/40"
                  }`}
                >
                  <button
                    onClick={() => toggleIndex(index)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left rtl:text-right font-display text-sm font-bold text-[#1F2937] focus:outline-none rounded-none"
                  >
                    <span className="pr-4 rtl:pl-4 rtl:pr-0 leading-snug">
                      {faq.question}
                    </span>

                    <div className="flex-shrink-0 relative w-4 h-4 flex items-center justify-center">
                      <span className="absolute block w-4 h-[2px] bg-[#1E5ED8]"></span>

                      <span
                        className={`absolute block w-[2px] h-4 bg-[#1E5ED8] transition-transform duration-300 ${
                          isOpen ? "rotate-90 scale-y-0" : ""
                        }`}
                      ></span>
                    </div>
                  </button>

                  <div
                    className={`grid rounded-none transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden rounded-none">
                      <div className="px-6 pb-5 pt-1 text-xs text-[#1F2937]/70 leading-relaxed border-t border-[#E4E4E7]/40 mt-1 font-sans rounded-none">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action Support */}
          <div className="mt-16 text-center">
            <div className="bg-[#1E5ED8] text-white p-8 sm:p-10 border border-[#1E5ED8] flex flex-col items-center">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#F97316] mb-2 block">
                {lang === "fr" ? "Assistance" : "المساعدة"}
              </span>
              <h3 className="text-lg font-bold font-display mb-2">
                {t("faq.moreQuestionsTitle")}
              </h3>
              <p className="text-xs text-[#FFFFFF]/75 mb-6 max-w-md leading-relaxed font-sans">
                {t("faq.moreQuestionsSubtitle")}
              </p>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@masubvention.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-3.5 text-xs font-mono uppercase tracking-wider transition-colors duration-250 inline-block"
              >
                {t("faq.contactButton")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
