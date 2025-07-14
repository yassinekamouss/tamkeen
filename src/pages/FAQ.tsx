import React, { useState } from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const faqData = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      <Header />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("faq.title")}
            </h1>
            <p className="text-xl text-gray-600">{t("faq.subtitle")}</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all bg-white"
              >
                <button
                  onClick={() => toggleAnswer(index)}
                  className="w-full flex items-center justify-between text-left p-5 hover:bg-gray-50 focus:outline-none transition"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <div
                  className={`px-5 pb-4 text-gray-700 text-sm transition-all duration-300 ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-blue-50 rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("faq.moreQuestionsTitle")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("faq.moreQuestionsSubtitle")}
              </p>
              <a
                href="mailto:contact@masubvention.ma"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
