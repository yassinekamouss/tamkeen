import React from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.webp";
import backgroundImage from "../assets/image2.webp";

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <Header />

      {/* Hero Section with Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
          {/* Gradient overlay for enhanced text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-blue-700/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {/* Logo */}
          <div className="mb-8">
            <img
              src={logo}
              alt="Tamkeen Logo"
              className="h-20 w-auto mx-auto mb-6 drop-shadow-lg"
            />
          </div>

          {/* Main Content */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              {t("about.title")}
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-8 text-blue-100 drop-shadow-lg">
              {t("about.subtitle")}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto text-blue-50 drop-shadow-lg">
              {t("about.description")}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("about.howItWorks.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("about.howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:bg-blue-700 transition-colors duration-300">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t("about.howItWorks.steps.0.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("about.howItWorks.steps.0.description")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:bg-blue-700 transition-colors duration-300">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t("about.howItWorks.steps.1.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("about.howItWorks.steps.1.description")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:bg-blue-700 transition-colors duration-300">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t("about.howItWorks.steps.2.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("about.howItWorks.steps.2.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
