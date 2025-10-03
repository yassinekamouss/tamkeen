import React from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";

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
              <details
                key={index}
                className="group border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <summary className="flex justify-between items-center font-semibold text-gray-900">
                  {faq.question}
                  <svg
                    className="w-5 h-5 transform transition-transform duration-300 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"></path>
                  </svg>
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
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
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@masubvention.ma"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-md inline-block"
                    > {t("faq.contactButton")}
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
