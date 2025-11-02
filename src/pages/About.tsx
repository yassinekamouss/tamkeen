import React, { useEffect, useState } from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.webp";
import backgroundImage from "../assets/image2.webp";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "../api/axios";
import { Helmet } from "react-helmet-async";
import SeoAlternates from "../components/SeoAlternates";
interface Partenaire {
  _id: string;
  nom: string;
  url: string;
  img: string;
}
const About: React.FC = () => {
  const { t } = useTranslation();
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPartenaires = async () => {
    try {
      const response = await axios.get("/partenaires");
      setPartenaires(response.data);
    } catch {
      setError("Erreur lors du chargement des partenaires.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPartenaires();
  }, []);

  const [position, setPosition] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  position;
  const step = 200; // largeur approximative d’un logo (augmenté)
  // Auto-défilement fluide
  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        // reset invisible pour effet infini
        const newPos = prev - 1;
        return Math.abs(newPos) >= partenaires.length * step ? 0 : newPos;
      });
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="w-full">
      <Helmet>
        {/* On utilise vos traductions pour le titre et la description */}
        <title>{`${t("about.title")} | Tamkeen`}</title>
        <meta name="description" content={t("about.description")} />

        {/* Bonus : Balises Open Graph pour les réseaux sociaux */}
        <meta property="og:title" content={`${t("about.title")} | Tamkeen`} />
        <meta property="og:description" content={t("about.description")} />
        {/* On peut même réutiliser l'image de fond pour le partage */}
        <meta property="og:image" content={backgroundImage} />
      </Helmet>
      <SeoAlternates />
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

      {/* {loading && <p className="text-center mt-8">Chargement...</p>} */}

      {!error && (
        <div className="p-8 bg-gray-50 overflow-hidden relative">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Nos Partenaires
          </h2>
          {loading && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <span className="w-3 h-3 bg-gray-900 rounded-full animate-bounce"></span>
              <span className="w-3 h-3 bg-gray-800 rounded-full animate-bounce animation-delay-200"></span>
              <span className="w-3 h-3 bg-gray-700 rounded-full animate-bounce animation-delay-400"></span>
            </div>
          )}

          <style>
            {`
    .animation-delay-200 {
      animation-delay: 0.2s;
    }
    .animation-delay-400 {
      animation-delay: 0.4s;
    }
  `}
          </style>

          <div
            className="overflow-hidden relative flex items-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}>
            <div
              className={`flex gap-12 animate-scroll logos-wrapper`}
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}>
              {/* Dupliquer plusieurs fois pour effet infini */}
              {Array(3)
                .fill(partenaires)
                .flat()
                .map((partenaire, index) => (
                  <div
                    key={index}
                    className="min-w-[200px] flex items-center justify-center">
                    <a
                      href={partenaire.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform duration-300">
                      <img
                        src={`${import.meta.env.VITE_PREFIX_URL}/partenaires/${partenaire.img}`}
                        alt={partenaire.nom}
                        title={partenaire.nom}
                        className="max-h-28 object-contain"
                      />
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* CSS global (index.css ou Tailwind) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
      @keyframes scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-33.3333%);
        }
      }
      .animate-scroll {
        animation: scroll 20s linear infinite;
      }
    `,
        }}
      />

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
