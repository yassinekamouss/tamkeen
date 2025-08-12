import React, { useState, useEffect } from "react";
import api from "./../api/axios";
import { useTranslation } from "react-i18next";

interface HeroProps {
  onNavigateToForm: () => void;
}

interface HeroProgram {
  _id: string;
  hero: {
    image: string;
    titleFr: string;
    titleAr: string;
    subtitleFr: string;
    subtitleAr: string;
    descriptionFr: string;
    descriptionAr: string;
  };
}

const Hero: React.FC<HeroProps> = ({ onNavigateToForm }) => {
  const { i18n, t } = useTranslation();
  const [programs, setPrograms] = useState<HeroProgram[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Chargement depuis API
  useEffect(() => {
    api.get("/programs/hero").then((res) => setPrograms(res.data));
  }, []);

  // Auto-slide toutes les 5 sec
  useEffect(() => {
    if (programs.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % programs.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [programs.length]);

  if (programs.length === 0) return null;

  const lang = i18n.language === "ar" ? "Ar" : "Fr";
  const currentProgram = programs[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % programs.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + programs.length) % programs.length);
  };

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Background Slides */}
      <div className="absolute inset-0 backdrop-blur-sm">
        {programs.map((program, index) => (
          <div
            key={program._id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={program.hero.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-60"></div>
          </div>
        ))}
        {/* Dégradé overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/30 to-blue-700/50"></div>
      </div>

      {/* Flèche gauche */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Flèche droite */}
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Contenu */}
      <div className="relative z-10 w-full px-4 sm:px-8 text-center">
        <p className="text-white/90 text-sm sm:text-lg mb-6 sm:mb-8 font-light">
          {currentProgram.hero[`subtitle${lang}` as keyof typeof currentProgram.hero]}
        </p>
        <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
          {currentProgram.hero[`title${lang}` as keyof typeof currentProgram.hero]}
        </h1>
        <p className="text-white/95 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed">
          {currentProgram.hero[`description${lang}` as keyof typeof currentProgram.hero]}
        </p>
        <div className="flex justify-center mt-6">
          <button
            onClick={onNavigateToForm}
            className="bg-white text-blue-700 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-base sm:text-lg"
          >
            {t("hero.button")}
          </button>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
        {programs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Décorations */}
      <div className="absolute top-20 left-4 sm:left-10 opacity-20 z-10 hidden sm:block">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-white rotate-45"></div>
      </div>
      <div className="absolute top-40 right-8 sm:right-20 opacity-15 z-10 hidden sm:block">
        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full"></div>
      </div>
      <div className="absolute bottom-40 left-8 sm:left-20 opacity-10 z-10 hidden sm:block">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/30 transform rotate-45"></div>
      </div>
    </section>
  );
};

export default Hero;
