import React, { useState, useEffect } from "react";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import { useTranslation } from 'react-i18next';

interface HeroProps {
  onNavigateToForm: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToForm }) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [image1, image2, image3];

  const slideContent = [
    {
      subtitle: t('hero.slides.0.subtitle'),
      title: t('hero.slides.0.title'),
      description: t('hero.slides.0.description'),
    },
    {
      subtitle: t('hero.slides.1.subtitle'),
      title: t('hero.slides.1.title'),
      description: t('hero.slides.1.description'),
    },
    {
      subtitle: t('hero.slides.2.subtitle'),
      title: t('hero.slides.2.title'),
      description: t('hero.slides.2.description'),
    },
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentContent = slideContent[currentSlide];

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0 backdrop-blur-sm">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-60"></div>
          </div>
        ))}

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/30 to-blue-700/50"></div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm">
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm">
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-8 text-center">
        {/* Top subtitle */}
        <p className="text-white/90 text-sm sm:text-lg mb-6 sm:mb-8 font-light">
          {currentContent.subtitle}
        </p>

        {/* Main heading */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
            {currentContent.title}
          </h1>
          <p className="text-white/95 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed">
            {currentContent.description}
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={onNavigateToForm}
            className="bg-white text-blue-700 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-base sm:text-lg">
            {t('hero.button')}
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Geometric decorations */}
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
