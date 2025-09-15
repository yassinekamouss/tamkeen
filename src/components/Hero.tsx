import React, { useEffect, useRef, useState } from "react";
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
interface HeroAnnonce{
  _id :string ;
  title : string;
  description : string ;
  autor : string;
  voirPlus : string;
  
}

const CACHE_KEY = "hero_programs_v1";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const Hero: React.FC<HeroProps> = ({ onNavigateToForm }) => {
  const { i18n, t } = useTranslation();
  const [programs, setPrograms] = useState<HeroProgram[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didRequestRef = useRef(false);

  const lang = i18n.language === "ar" ? "Ar" : "Fr";
  const hasData = programs.length > 0;

  // Helpers
  const preloadImage = (src: string) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
      // Give browser a hint to decode asynchronously
      img.decoding = "async";
    });

  const cacheSet = (data: HeroProgram[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch {
      // ignore cache write errors (private mode/quota)
    }
  };

  const cacheGet = (): HeroProgram[] | null => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { ts: number; data: HeroProgram[] };
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.data;
    } catch {
      return null;
    }
  };

  // Load from cache immediately (if present) to avoid blank state
  useEffect(() => {
    if (didRequestRef.current) return;
    didRequestRef.current = true;

    const fromCache = cacheGet();
    if (fromCache && fromCache.length) {
      setPrograms(fromCache);
      setLoading(false);
      // Preload first image then show content fade-in
      preloadImage(fromCache[0].hero.image).then(() =>
        setFirstImageLoaded(true)
      );
      // Stale-while-revalidate fetch in background
      api
        .get("/programs/hero")
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length) {
            setPrograms(res.data);
            cacheSet(res.data);
            // Preload first of fresh set too
            preloadImage(res.data[0].hero.image).then(() =>
              setFirstImageLoaded(true)
            );
          }
        })
        .catch(() => void 0);
      return;
    }

    // No cache -> fetch normally
    api
      .get("/programs/hero")
      .then((res) => {
        const list: HeroProgram[] = Array.isArray(res.data) ? res.data : [];
        setPrograms(list);
        cacheSet(list);
        if (list.length) {
          return preloadImage(list[0].hero.image).then(() =>
            setFirstImageLoaded(true)
          );
        }
      })
      .catch((e) => setError(e?.message || "Failed to load hero"))
      .finally(() => setLoading(false));
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

  const currentProgram = hasData ? programs[currentSlide] : null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % programs.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + programs.length) % programs.length);
  };

  // Preload all slide images (after initial data) for smooth transitions
  useEffect(() => {
    if (!hasData) return;
    programs.forEach((p) => {
      const img = new Image();
      img.src = p.hero.image;
      img.decoding = "async";
    });
  }, [hasData, programs]);

  // Preconnect to API origin to prioritize hero fetch
  useEffect(() => {
    const href = import.meta.env.VITE_BACKEND_API_URL as string | undefined;
    if (!href) return;
    try {
      const origin = new URL(href).origin;
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = origin;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
      return () => {
        if (link.parentNode) link.parentNode.removeChild(link);
      };
    } catch {
      // ignore invalid URL
    }
  }, []);

  return (
    <section
      className="relative h-screen w-full flex items-center overflow-hidden"
      aria-busy={loading}
      aria-live="polite">
      {/* Background Slides */}
      <div className="absolute inset-0 backdrop-blur-sm">
        {/* Content backgrounds when data is ready */}
        {hasData &&
          programs.map((program, index) => (
            <div
              key={program._id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide && firstImageLoaded
                  ? "opacity-100"
                  : "opacity-0"
              }`}>
              <img
                src={program.hero.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>
          ))}

        {/* Skeleton background when loading/no data */}
        {!hasData && (
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Overlay gradient keeps visual consistency */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/30 to-blue-700/50"></div>
      </div>

      {/* Flèche gauche */}
      <button
        onClick={prevSlide}
        className={`absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
          hasData ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Previous slide">
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

      {/* Flèche droite */}
      <button
        onClick={nextSlide}
        className={`absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
          hasData ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Next slide">
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

      {/* Contenu */}
      <div className="relative z-10 w-full px-4 sm:px-8 text-center">
        {/* Skeleton text layout while loading */}
        {!hasData && (
          <div className="max-w-5xl mx-auto animate-pulse" aria-hidden="true">
            <div className="h-4 sm:h-6 bg-white/30 rounded w-2/3 sm:w-1/2 mx-auto mb-6 sm:mb-8"></div>
            <div className="h-8 sm:h-12 bg-white/40 rounded w-5/6 sm:w-2/3 mx-auto mb-4 sm:mb-6"></div>
            <div className="h-4 sm:h-6 bg-white/30 rounded w-4/5 sm:w-1/2 mx-auto mb-6"></div>
            <div className="flex justify-center mt-6">
              <div className="h-10 sm:h-12 bg-white/70 rounded-lg w-40 sm:w-48"></div>
            </div>
            <span className="sr-only">{t("loading") || "Loading hero"}</span>
          </div>
        )}

        {/* Real content fades in after first image is ready */}
        {hasData && currentProgram && (
          <div
            className={`transition-opacity duration-500 ${
              firstImageLoaded ? "opacity-100" : "opacity-0"
            }`}>
            <p className="text-white/90 text-sm sm:text-lg mb-6 sm:mb-8 font-light">
              {
                currentProgram.hero[
                  `subtitle${lang}` as keyof typeof currentProgram.hero
                ]
              }
            </p>
            <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              {
                currentProgram.hero[
                  `title${lang}` as keyof typeof currentProgram.hero
                ]
              }
            </h1>
            <p className="text-white/95 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed">
              {
                currentProgram.hero[
                  `description${lang}` as keyof typeof currentProgram.hero
                ]
              }
            </p>
            <div className="flex justify-center mt-6">
              <button
                onClick={onNavigateToForm}
                className="bg-white text-blue-700 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-base sm:text-lg">
                {t("hero.button")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Indicateurs */}
      <div
        className={`absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3 ${
          hasData ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
        {programs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
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

      {/* If error and no data, keep skeleton but expose screen-reader friendly message */}
      {error && !hasData && (
        <p className="sr-only" role="status">
          {error}
        </p>
      )}
    </section>
  );
};

export default Hero;
