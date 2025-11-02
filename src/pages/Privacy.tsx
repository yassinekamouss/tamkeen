import React from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import SeoAlternates from "../components/SeoAlternates";

const Privacy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <Helmet>
        {/* On utilise vos traductions pour le titre et la description */}
        <title>{`${t("privacy_modal.title")} | Tamkeen`}</title>
        <meta name="description" content={t("privacy_modal.intro")} />

        {/* Bonus : Balises Open Graph pour les réseaux sociaux */}
        <meta
          property="og:title"
          content={`${t("privacy_modal.title")} | Tamkeen`}
        />
        <meta property="og:description" content={t("privacy_modal.intro")} />
      </Helmet>
      <SeoAlternates />

      <Header />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("privacy_modal.title")}
            </h1>
            <p className="text-xl text-gray-600">{t("privacy_modal.intro")}</p>
          </div>

          <div className="prose prose-sm sm:prose-lg max-w-none">
            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="text-gray-600 mr-2">1.</span>
                {t("privacy_modal.section1.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                {t("privacy_modal.section1.p1")}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section1.li1.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section1.li1.text")}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section1.li2.strong")}:
                  </strong>{" "}
                  {t("privacy_modal.section1.li2.text")}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section1.li3.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section1.li3.text")}
                </li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="text-gray-600 mr-2">2.</span>
                {t("privacy_modal.section2.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                {t("privacy_modal.section2.p1")}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section2.li1.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section2.li1.text")}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section2.li2.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section2.li2.text")}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section2.li3.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section2.li3.text")}
                </li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="text-gray-600 mr-2">3.</span>
                {t("privacy_modal.section3.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                {t("privacy_modal.section3.p1")}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section3.li1.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section3.li1.text")}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section3.li2.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section3.li2.text")}
                </li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="text-gray-600 mr-2">4.</span>
                {t("privacy_modal.section4.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                {t("privacy_modal.section4.p1")}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section4.li1.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section4.li1.text")}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section4.li2.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section4.li2.text")}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <strong>
                    {t("privacy_modal.section4.li3.strong")} :
                  </strong>{" "}
                  {t("privacy_modal.section4.li3.text")}
                </li>
              </ul>
            </section>

            <div className="bg-gray-50 border rounded-lg p-3 sm:p-4">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                {t("privacy_modal.contactTitle")}
              </h4>
              <p className="text-gray-700 mb-2 text-sm sm:text-base">
                {t("privacy_modal.contactText")}
              </p>
              <p className="text-gray-800 text-sm sm:text-base">
                <strong>{t("privacy_modal.emailLabel")} :</strong>
                <a
                  href="mailto:contact@masubvention.ma"
                  className="text-blue-600 hover:text-blue-800 ml-1">
                  contact@masubvention.ma
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
