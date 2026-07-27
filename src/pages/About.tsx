import React, { useEffect, useState } from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.webp";
import backgroundImage from "../assets/image2.webp";
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
      setError(t("about.error_loading_partners"));
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
  const step = 200; // largeur approximative d’un logo

  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPos = prev - 1;
        return Math.abs(newPos) >= partenaires.length * step ? 0 : newPos;
      });
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [isPaused, partenaires.length]);

  return (
    <div className="w-full bg-[#FFFFFF] font-sans text-[#1F2937]">
      <Helmet>
        <title>{`${t("about.title")} | Tamkeen`}</title>
        <meta name="description" content={t("about.description")} />
        <meta property="og:title" content={`${t("about.title")} | Tamkeen`} />
        <meta property="og:description" content={t("about.description")} />
        <meta property="og:image" content={backgroundImage} />
      </Helmet>
      <SeoAlternates />
      <Header />

      {/* Hero Section with Background */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover grayscale opacity-45"
          />
          {/* Brand-aligned rich overlay */}
          <div className="absolute inset-0 bg-[#1E5ED8]/90"></div>
          {/* Subtle gradient divider */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E5ED8] via-[#1E5ED8]/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-20">
          {/* Logo */}
          <div className="mb-6">
            <img
              src={logo}
              alt="Tamkeen Logo"
              className="h-16 w-auto mx-auto mb-4 opacity-90"
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F97316]">
              {t("about.subtitle")}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white leading-tight">
              {t("about.title")}
            </h1>
            <div className="w-12 h-[2px] bg-[#F97316] mx-auto my-6"></div>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[#FFFFFF]/80 max-w-3xl mx-auto">
              {t("about.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Partner Slider Section */}
      {!error && (
        <div className="py-12 bg-white border-b border-[#E4E4E7] overflow-hidden relative">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1F2937]/50 text-center mb-10 font-bold">
            {t("about.partnersTitle")}
          </h2>
          {loading && (
            <div className="flex justify-center items-center my-4 space-x-2">
              <span className="w-2 h-2 bg-[#1E5ED8] rounded-none animate-bounce"></span>
              <span className="w-2 h-2 bg-[#1E5ED8] rounded-none animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-[#1E5ED8] rounded-none animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}

          <div
            className="overflow-hidden relative flex items-center max-w-6xl mx-auto px-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex gap-16 animate-scroll logos-wrapper"
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {Array(3)
                .fill(partenaires)
                .flat()
                .map((partenaire, index) => (
                  <div
                    key={index}
                    className="min-w-[160px] flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  >
                    <a
                      href={partenaire.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${import.meta.env.VITE_PREFIX_URL}/partenaires/${partenaire.img}`}
                        alt={partenaire.nom}
                        title={partenaire.nom}
                        className="max-h-16 object-contain"
                      />
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Animation Style */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.3333%); }
            }
            .animate-scroll {
              animation: scroll 25s linear infinite;
            }
          `,
        }}
      />

      {/* How It Works Section */}
      <section className="py-24 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F97316] mb-3 block">
              {t("about.methodology")}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#1F2937] mb-4">
              {t("about.howItWorks.title")}
            </h2>
            <div className="w-12 h-[2px] bg-[#1E5ED8]/20 mx-auto mb-6"></div>
            <p className="text-sm sm:text-base text-[#1F2937]/65 max-w-2xl mx-auto leading-relaxed">
              {t("about.howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 border-t border-[#E4E4E7] pt-12">
            {/* Step 1 */}
            <div className="text-center md:text-left rtl:md:text-right group">
              <div className="mb-4">
                <span className="block text-4xl sm:text-5xl font-bold font-display text-[#F97316] tracking-tight mb-2">
                  01
                </span>
                <div className="h-[1px] w-full bg-[#E4E4E7] group-hover:bg-[#1E5ED8] transition-colors duration-300"></div>
              </div>
              <h3 className="text-base font-bold text-[#1F2937] font-display uppercase tracking-wide mb-3 mt-4">
                {t("about.howItWorks.steps.0.title")}
              </h3>
              <p className="text-xs text-[#1F2937]/65 leading-relaxed">
                {t("about.howItWorks.steps.0.description")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center md:text-left rtl:md:text-right group">
              <div className="mb-4">
                <span className="block text-4xl sm:text-5xl font-bold font-display text-[#F97316] tracking-tight mb-2">
                  02
                </span>
                <div className="h-[1px] w-full bg-[#E4E4E7] group-hover:bg-[#1E5ED8] transition-colors duration-300"></div>
              </div>
              <h3 className="text-base font-bold text-[#1F2937] font-display uppercase tracking-wide mb-3 mt-4">
                {t("about.howItWorks.steps.1.title")}
              </h3>
              <p className="text-xs text-[#1F2937]/65 leading-relaxed">
                {t("about.howItWorks.steps.1.description")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center md:text-left rtl:md:text-right group">
              <div className="mb-4">
                <span className="block text-4xl sm:text-5xl font-bold font-display text-[#F97316] tracking-tight mb-2">
                  03
                </span>
                <div className="h-[1px] w-full bg-[#E4E4E7] group-hover:bg-[#1E5ED8] transition-colors duration-300"></div>
              </div>
              <h3 className="text-base font-bold text-[#1F2937] font-display uppercase tracking-wide mb-3 mt-4">
                {t("about.howItWorks.steps.2.title")}
              </h3>
              <p className="text-xs text-[#1F2937]/65 leading-relaxed">
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
