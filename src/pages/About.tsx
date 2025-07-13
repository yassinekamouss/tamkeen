import React from "react";
import { Header, Footer } from "../components";
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <Header />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('about.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('about.subtitle')}
            </p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-5 5l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('about.underConstructionTitle')}
                </h2>
                <p className="text-gray-600">
                  {t('about.underConstructionMessage')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
