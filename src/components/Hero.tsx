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


const CACHE_KEY = "hero_programs_v1";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const Hero: React.FC<HeroProps> = ({ onNavigateToForm }) => {
  const { i18n, t } = useTranslation();
  const [programs, setPrograms] = useState<HeroProgram[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didRequestRef = useRef(false);

  const lang = i18n.language === "ar" ? "Ar" : "Fr";
  const hasData = programs.length > 0;

  const defaultProgram: HeroProgram = {
    _id: "default-hero",
    hero: {
      image: "default-hero.webp",
      titleFr: "Trouvez les subventions et aides publiques adaptées à votre projet",
      titleAr: "ابحث عن الدعم والمنح العمومية المناسبة لمشروعك",
      subtitleFr: "Plateforme Nationale d'Éligibilité",
      subtitleAr: "المنصة الوطنية للأهلية",
      descriptionFr: "Analysez instantanément votre profil et découvrez toutes les opportunités de financement et d'accompagnement proposées par l'État marocain.",
      descriptionAr: "قم بتحليل ملفك الشخصي فوراً واكتشف جميع فرص التمويل والمواكبة التي تقدمها الدولة المغربية.",
    }
  };

  // Helpers
  const preloadImage = (src: string) => {
    if (src === "default-hero.webp") return Promise.resolve();
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = `${import.meta.env.VITE_PREFIX_URL}/programs/${src}`;
      // Give browser a hint to decode asynchronously
      img.decoding = "async";
    });
  };

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
      preloadImage(fromCache[0].hero.image).catch(() => void 0);
      // Stale-while-revalidate fetch in background
      api
        .get("/programs/hero")
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length) {
            setPrograms(res.data);
            cacheSet(res.data);
            // Preload first of fresh set too
            preloadImage(res.data[0].hero.image).catch(() => void 0);
          } else {
            setPrograms([defaultProgram]);
          }
        })
        .catch(() => void 0);
      return;
    }

    // No cache -> fetch normally
    api
      .get("/programs/hero")
      .then((res) => {
        const list: HeroProgram[] = Array.isArray(res.data) && res.data.length ? res.data : [];
        if (list.length) {
          setPrograms(list);
          cacheSet(list);
          preloadImage(list[0].hero.image).catch(() => void 0);
        } else {
          setPrograms([defaultProgram]);
        }
      })
      .catch((e) => {
        setError(e?.message || "Failed to load hero");
        setPrograms([defaultProgram]);
      })
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
    if (programs.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % programs.length);
    }
  };

  const prevSlide = () => {
    if (programs.length > 1) {
      setCurrentSlide((prev) => (prev - 1 + programs.length) % programs.length);
    }
  };

  // Preload all slide images (after initial data) for smooth transitions
  useEffect(() => {
    if (!hasData) return;
    programs.forEach((p) => {
      if (p.hero.image !== "default-hero.webp") {
        const img = new Image();
        img.src = p.hero.image;
        img.decoding = "async";
      }
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
      className="relative w-full grid grid-cols-1 lg:grid-cols-12 border-b border-[#E4E4E7] min-h-[80vh] lg:min-h-[85vh]"
      aria-busy={loading}
      aria-live="polite">
      
      {/* Left Column: Dark Editorial Brand Panel */}
      <div className="lg:col-span-7 bg-[#1E5ED8] text-white p-6 sm:p-12 md:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative Geometric Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Tagline */}
        <div className="relative z-10 mb-8 lg:mb-0">
          <span className="inline-block bg-[#F97316] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm font-display">
            {currentProgram ? currentProgram.hero[`subtitle${lang}` as keyof typeof currentProgram.hero] : t("hero.subtitle")}
          </span>
        </div>

        {/* Hero Title & Description */}
        <div className="relative z-10 my-auto py-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display leading-[1.1] mb-6">
            {currentProgram ? currentProgram.hero[`title${lang}` as keyof typeof currentProgram.hero] : t("hero.title")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#FFFFFF]/80 leading-relaxed max-w-2xl font-light mb-8">
            {currentProgram ? currentProgram.hero[`description${lang}` as keyof typeof currentProgram.hero] : t("hero.description")}
          </p>

          <button
            onClick={onNavigateToForm}
            className="group inline-flex items-center justify-center bg-[#F97316] hover:bg-[#EA580C] text-white font-display font-semibold tracking-wider text-xs uppercase px-8 py-4 transition-all duration-300 shadow-md">
            {t("hero.button")}
            <svg
              className={`w-4 h-4 ml-2 rtl:mr-2 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Slide indicators / progress */}
        {programs.length > 1 && (
          <div className="relative z-10 flex items-center space-x-3 mt-4">
            <span className="text-xs font-mono text-[#FFFFFF]/50">
              {String(currentSlide + 1).padStart(2, "0")}
            </span>
            <div className="w-24 h-[1px] bg-white/20 relative">
              <div
                className="absolute top-0 left-0 h-full bg-[#F97316] transition-all duration-500"
                style={{ width: `${((currentSlide + 1) / programs.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-[#FFFFFF]/50">
              {String(programs.length).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {/* Right Column: Information Board / Live Aid Ticker */}
      <div className="lg:col-span-5 bg-[#FFFFFF] p-6 sm:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#E4E4E7]">
        
        {/* Upper metadata details */}
        <div>
          <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4 mb-6">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#1F2937]/60 font-display">
              {lang === "Ar" ? "فرص التمويل النشطة" : "Opportunités Actives"}
            </span>
            <span className="text-xs font-mono text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 rounded-sm">
              ● Live
            </span>
          </div>

          {currentProgram && (
            <div className="space-y-6">
              {/* Program Thumbnail Container */}
              <div className="border border-[#E4E4E7] p-1.5 bg-white shadow-sm">
                <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
                  {currentProgram.hero.image === "default-hero.webp" ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E5ED8] to-[#1F2937] flex items-center justify-center text-white/30 font-display uppercase tracking-widest text-[10px]">
                      {lang === "Ar" ? "تمكين للاستشارات" : "Tamkeen Consulting"}
                    </div>
                  ) : (
                    <img
                      src={`${import.meta.env.VITE_PREFIX_URL}/programs/${currentProgram.hero.image}`}
                      alt="Program illustration"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Monospace Metadata Table */}
              <div className="border border-[#E4E4E7] divide-y divide-[#E4E4E7] bg-white text-xs font-mono">
                <div className="grid grid-cols-2 p-3">
                  <span className="text-[#1F2937]/60">{lang === "Ar" ? "نوع المستفيد" : "Bénéficiaires"}</span>
                  <span className="text-right text-[#1F2937] font-medium">{lang === "Ar" ? "شركات، تعاونيات، مقاولين" : "Coopératives, PME, Auto-entrepreneurs"}</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="text-[#1F2937]/60">{lang === "Ar" ? "نسبة الدعم" : "Taux de subvention"}</span>
                  <span className="text-right text-[#1F2937] font-medium">{lang === "Ar" ? "حتى 100٪" : "Jusqu'à 100%"}</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="text-[#1F2937]/60">{lang === "Ar" ? "تغطية النطاق" : "Zone Géographique"}</span>
                  <span className="text-right text-[#1F2937] font-medium">{lang === "Ar" ? "وطني (المغرب)" : "National (Maroc)"}</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="text-[#1F2937]/60">{lang === "Ar" ? "الوضع الحالي" : "Statut"}</span>
                  <span className="text-right text-emerald-700 font-bold">{lang === "Ar" ? "مفتوح للتقديم" : "Ouvert"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Carousel controls & counters */}
        <div className="flex items-center justify-between border-t border-[#E4E4E7] pt-6 mt-8">
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              disabled={programs.length <= 1}
              className="border border-[#E4E4E7] hover:bg-white text-[#1F2937] p-2.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Previous slide">
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={programs.length <= 1}
              className="border border-[#E4E4E7] hover:bg-white text-[#1F2937] p-2.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Next slide">
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#1F2937]/60 block font-display">
              {lang === "Ar" ? "إجمالي البرامج" : "Total Programmes"}
            </span>
            <span className="text-base font-mono font-bold text-[#1E5ED8]">
              {programs.length} Active Aids
            </span>
          </div>
        </div>

      </div>

      {error && !hasData && (
        <p className="sr-only" role="status">
          {error}
        </p>
      )}
    </section>
  );
};

export default Hero;
