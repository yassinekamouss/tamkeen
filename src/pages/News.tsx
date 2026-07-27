import React, { useState, useEffect, useCallback } from "react";
import { Header, Footer } from "../components";
import { type MultilingualField, newsService, type NewsItem } from "../services/newsService";
import Spinner from "../components/Spinner";
import NewsCard from "../components/news/NewsCard";
import { Helmet } from "react-helmet-async";
import SeoAlternates from "../components/SeoAlternates";
import { useTranslation } from "react-i18next";

const News: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";

  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<MultilingualField[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await newsService.getPublishedNews({
        category:
          selectedCategory === "all"
            ? undefined
            : {
                fr: lang === "fr" ? selectedCategory : "",
                ar: lang === "ar" ? selectedCategory : "",
              },
        limit: 20,
      });
      setNews(
        response.data.map((item) => ({
          ...item,
          title: { fr: item.title["fr"], ar: item.title["ar"] },
          excerpt: { fr: item.excerpt["fr"], ar: item.excerpt["ar"] },
          content: { fr: item.content["fr"], ar: item.content["ar"] },
          category: { fr: item.category["fr"], ar: item.category["ar"] },
        }))
      );
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, lang]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await newsService.getCategories();
      setCategories(
        response.data
          .filter((item: any) => item && item.fr && item.ar)
          .map((item: MultilingualField) => ({
            fr: item.fr ?? "",
            ar: item.ar ?? "",
          }))
      );
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  if (loading && news.length === 0) {
    return (
      <div className="w-full bg-[#FFFFFF] flex flex-col justify-between min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Spinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFFFFF] font-sans text-[#1F2937]">
      <Helmet>
        <title>{t("news_page.seo_title")}</title>
        <meta
          name="description"
          content={t("news_page.seo_desc")}
        />
        <meta
          property="og:title"
          content={t("news_page.seo_title")}
        />
        <meta
          property="og:description"
          content={t("news_page.seo_desc")}
        />
      </Helmet>
      <SeoAlternates />

      <Header />

      {/* Hero Section */}
      <section className="bg-[#1E5ED8] border-b border-[#E4E4E7] text-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F97316]">
              {t("news_page.hero_badge")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white mb-6">
            {t("news_page.hero_title")}
          </h1>
          <p className="text-sm sm:text-base text-[#FFFFFF]/75 max-w-3xl leading-relaxed">
            {t("news_page.hero_subtitle")}
          </p>
        </div>
      </section>

      {/* Category Filter - Style Navigation Journal */}
      <section className="sticky top-0 z-40 bg-white border-b border-[#E4E4E7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex-shrink-0 pb-1 text-xs font-mono uppercase tracking-wider transition-all duration-200 border-b-2 bg-transparent ${
                selectedCategory === "all"
                  ? "border-[#F97316] text-[#1F2937] font-bold"
                  : "border-transparent text-[#1F2937]/60 hover:text-[#1F2937]"
              }`}
            >
              {t("news_page.filter_all")}
            </button>
            {categories.map((category) => (
              <button
                key={`${category.fr}-${category.ar}`}
                onClick={() => setSelectedCategory(category[lang])}
                className={`flex-shrink-0 pb-1 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all duration-200 border-b-2 bg-transparent ${
                  selectedCategory === category[lang]
                    ? "border-[#F97316] text-[#1F2937] font-bold"
                    : "border-transparent text-[#1F2937]/60 hover:text-[#1F2937]"
                }`}
              >
                {category[lang]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#E4E4E7]">
            <div>
              <h2 className="text-xl font-bold font-display text-[#1F2937]">
                {selectedCategory === "all"
                  ? t("news_page.latest_news")
                  : selectedCategory}
              </h2>
              <p className="text-xs text-[#1F2937]/50 font-mono uppercase tracking-wider mt-1.5">
                {news.length} {news.length > 1 ? t("news_page.articles_count_many") : t("news_page.articles_count_one")}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#1F2937]/50">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{t("news_page.updated_daily")}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {news.map((article, index) => (
                <div
                  key={article.id}
                  className={
                    index === 0 && article.featured
                      ? "md:col-span-2 lg:col-span-3"
                      : ""
                  }
                >
                  <NewsCard
                    item={article}
                    to={`/news/${article.slug ?? article.id}`}
                    featured={article.featured && index === 0}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
