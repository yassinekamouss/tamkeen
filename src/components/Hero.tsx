import React, { useState, useEffect } from "react";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [image1, image2, image3];

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

  return (
    <section className="relative h-screen w-screen flex items-center overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0 backdrop-blur-sm">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>
        ))}
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/30 to-blue-700/50"></div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Content */}
      <div className="relative z-10 w-full px-8 text-center">
        {/* Top subtitle */}
        <p className="text-white/90 text-lg mb-8 font-light">
          Simplifiez Votre Accès À La Subvention
        </p>
        
        {/* Main heading */}
        <div className="mb-12">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Vous avez un projet d'investissement
          </h1>
          <p className="text-white/95 text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed">
            et vous vous demandez si vous pouvez bénéficier d'un<br />
            appui ou d'une subvention ?
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-lg">
            Testez votre éligibilité ici
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Geometric decorations */}
      <div className="absolute top-20 left-10 opacity-20 z-10">
        <div className="w-16 h-16 border-2 border-white rotate-45"></div>
      </div>
      <div className="absolute top-40 right-20 opacity-15 z-10">
        <div className="w-12 h-12 bg-white/20 rounded-full"></div>
      </div>
      <div className="absolute bottom-40 left-20 opacity-10 z-10">
        <div className="w-8 h-8 bg-white/30 transform rotate-45"></div>
      </div>
    </section>
  );
};

export default Hero;
