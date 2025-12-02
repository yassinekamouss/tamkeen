import React, { useState, useEffect, useCallback } from "react";
import { Header, Footer } from "../components";
import {type  MultilingualField, newsService, type NewsItem } from "../services/newsService";
import Spinner from "../components/Spinner";

import NewsCard from "../components/news/NewsCard";
import { Helmet } from "react-helmet-async";
import SeoAlternates from "../components/SeoAlternates";
import { useTranslation } from "react-i18next";

const News: React.FC = () => {
  const { i18n } = useTranslation();
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
        .filter((item: any) => item && item.fr && item.ar) // <-- évite les null
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
      <div className="w-full">
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Spinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
      <div className="w-full bg-white" >
      <Helmet>
        <title>{lang === "fr" ? "Actualités & Opportunités | Tamkeen" : "الأخبار والفرص | تمكين"}</title>
        <meta
          name="description"
          content={
            lang === "fr"
              ? "Restez informé des dernières subventions, formations et success stories pour développer votre entreprise"
              : "ابق على اطلاع بأحدث المنح والتدريبات وقصص النجاح لتطوير عملك"
          }
        />
        <meta
          property="og:title"
          content={lang === "fr" ? "Actualités & Opportunités | Tamkeen" : "الأخبار والفرص | تمكين"}
        />
        <meta
          property="og:description"
          content={
            lang === "fr"
              ? "Restez informé des dernières subventions, formations et success stories pour développer votre entreprise"
              : "ابق على اطلاع بأحدث المنح والتدريبات وقصص النجاح لتطوير عملك"
          }
        />
      </Helmet>
      <SeoAlternates />

      <Header />

      {/* Hero Section - Style News Portal */}
  <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-blue-400"></div>
            <span className="text-blue-300 text-sm font-semibold tracking-wider uppercase">
              {lang === "fr" ? "Centre d'Actualités" : "مركز الأخبار"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {lang === "fr" ? "Actualités & Opportunités" : "الأخبار والفرص"}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            {lang === "fr"
              ? "Restez informé des dernières subventions, formations et success stories pour développer votre entreprise"
              : "ابق على اطلاع بأحدث المنح والتدريبات وقصص النجاح لتطوير عملك"}
          </p>
        </div>
      </section>

      {/* Category Filter - Style Navigation Journal */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex-shrink-0 px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              {lang === "fr" ? "Tout" : "الكل"}
            </button>
      {categories.map((category) => (
  <button
    key={`${category.fr}-${category.ar}`}
    onClick={() => setSelectedCategory(category[lang])}
    className={`flex-shrink-0 px-5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
      selectedCategory === category[lang]
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}>
    {category[lang]}
  </button>
))}


          </div>
        </div>
      </section>

      {/* News Grid - Professional Layout */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "all"
                  ? lang === "fr"
                    ? "Dernières Actualités"
                    : "آخر الأخبار"
                  : selectedCategory}
              </h2>
              <p className="text-gray-600 mt-1">
                {news.length} {news.length > 1 ? (lang === "fr" ? "articles" : "مقالات") : lang === "fr" ? "article" : "مقالة"}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{lang === "fr" ? "Mis à jour quotidiennement" : "يتم التحديث يوميًا"}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {news.map((article, index) => (
                <div
                  key={article.id}
                  className={
                    index === 0 && article.featured
                      ? "md:col-span-2 lg:col-span-3"
                      : ""
                  }>
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
