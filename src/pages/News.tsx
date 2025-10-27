import React, { useState, useEffect, useCallback } from "react";
import { Header, Footer } from "../components";
import { newsService, type NewsItem } from "../services/newsService";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import NewsCard from "../components/news/NewsCard";

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await newsService.getAllNews({
        category: selectedCategory === "all" ? undefined : selectedCategory,
        limit: 20,
      });
      setNews(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await newsService.getCategories();
      setCategories(response.data);
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
    <div className="w-full bg-white">
      <Header />

      {/* Hero Section - Style News Portal */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-blue-400"></div>
            <span className="text-blue-300 text-sm font-semibold tracking-wider uppercase">
              Centre d'Actualités
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Actualités & Opportunités
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Restez informé des dernières subventions, formations et success
            stories pour développer votre entreprise
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
              Tout
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {category}
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
                  ? "Dernières Actualités"
                  : selectedCategory}
              </h2>
              <p className="text-gray-600 mt-1">
                {news.length} {news.length > 1 ? "articles" : "article"}
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
              <span>Mis à jour quotidiennement</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <>
              {/* News Grid */}
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

              {/* CTA Section - Integrated Style */}
              <div className="bg-white border border-gray-200 rounded-lg p-8 lg:p-10 shadow-sm">
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div className="flex-1">
                      <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        ACCOMPAGNEMENT PERSONNALISÉ
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                        Besoin d'aide pour trouver un financement ?
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Nos experts analysent votre éligibilité et vous
                        accompagnent dans vos démarches de demande de
                        subvention.
                      </p>

                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg
                            className="w-5 h-5 text-green-600 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Réponse sous 24h</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg
                            className="w-5 h-5 text-green-600 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>85% de réussite</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg
                            className="w-5 h-5 text-green-600 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Test gratuit</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-shrink-0">
                      <Link
                        to="/#eligibility-form"
                        className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                        Vérifier mon éligibilité
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </Link>
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@masubvention.ma"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors">
                        Nous contacter
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
