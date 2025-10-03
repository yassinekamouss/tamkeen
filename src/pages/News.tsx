import React, { useState, useEffect, useCallback } from "react";
import { Header, Footer } from "../components";
import { newsService, type NewsItem } from "../services/newsService";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

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
        limit: 20, // Afficher plus d'actualités sans pagination
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Subventions Européennes": "bg-blue-100 text-blue-800",
      "Subventions Nationales": "bg-green-100 text-green-800",
      Formation: "bg-purple-100 text-purple-800",
      "Success Stories": "bg-pink-100 text-pink-800",
      "Entrepreneuriat Féminin": "bg-rose-100 text-rose-800",
      "Guides & Ressources": "bg-indigo-100 text-indigo-800",
      Partenariats: "bg-orange-100 text-orange-800",
      "Services Tamkeen": "bg-teal-100 text-teal-800",
      "Export & International": "bg-cyan-100 text-cyan-800",
      "Alertes Financement": "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading && news.length === 0) {
    return (
      <div className="w-full">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      <Header />

     {/* Hero Section - Compact et créatif */}
<section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-12 pb-20 overflow-hidden">
  {/* Éléments décoratifs simplifiés */}
  <div className="absolute top-10 left-5 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
  <div className="absolute top-32 right-10 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>

  <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-snug">
      Actualités & Opportunités
    </h1>
    <p className="text-base sm:text-lg text-blue-100 max-w-3xl mx-auto mb-8">
      Découvrez les dernières subventions, opportunités de financement et success stories d'entrepreneurs.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center items-center mb-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-transform">
        <div className="text-2xl font-bold text-white mb-1">500+</div>
        <div className="text-blue-100 text-sm">Entreprises accompagnées</div>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-transform">
        <div className="text-2xl font-bold text-white mb-1">50M€</div>
        <div className="text-blue-100 text-sm">Subventions obtenues</div>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-transform">
        <div className="text-2xl font-bold text-white mb-1">85%</div>
        <div className="text-blue-100 text-sm">Taux de réussite</div>
      </div>
    </div>
  </div>

  {/* Wave décorative */}
  <div className="absolute bottom-0 left-0 right-0">
    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 80L48 70C96 60 192 50 288 45C384 40 480 40 576 45C672 50 768 60 864 65C960 70 1056 70 1152 65C1248 60 1344 50 1392 45L1440 40V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#f9fafb"/>
    </svg>
  </div>
</section>

      {/* Category Filter */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explorez par catégorie
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Filtrez les actualités selon vos centres d'intérêt pour trouver
              rapidement les informations pertinentes
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                setSelectedCategory("all");
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${selectedCategory === "all"
                ? "bg-blue-600 text-white shadow-lg "
                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md"
                }`}>
              📰 Toutes les actualités
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg transform"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md"
                  }`}>
                {category === "Subventions Européennes" && "🇪🇺"}
                {category === "Subventions Nationales" && "🇹🇳"}
                {category === "Formation" && "🎓"}
                {category === "Success Stories" && "⭐"}
                {category === "Entrepreneuriat Féminin" && "👩‍💼"}
                {category === "Guides & Ressources" && "📚"}
                {category === "Partenariats" && "🤝"}
                {category === "Services Tamkeen" && "🎯"}
                {category === "Export & International" && "🌍"}
                {category === "Alertes Financement" && "🚨"} {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid - Section principale unique */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {selectedCategory === "all"
                ? "Toutes nos actualités"
                : selectedCategory}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {selectedCategory === "all"
                ? "Découvrez toutes les opportunités de financement, formations et success stories"
                : `Actualités spécialisées dans la catégorie ${selectedCategory}`}
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mt-6"></div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <>
              {/* Grille principale des actualités avec première carte en vedette */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {news.map((article, index) => (
                  <article
                    key={article.id}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 ${index === 0 ? "md:col-span-2 lg:col-span-2" : ""
                      }`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className={`w-full ${index === 0 ? "h-64" : "h-48"
                          } object-cover group-hover:scale-110 transition-transform duration-500`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                            article.category
                          )} backdrop-blur-sm`}>
                          {article.category}
                        </span>
                      </div>
                      {article.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                            ⭐ Featured
                          </span>
                        </div>
                      )}
                    </div>

                    <div className={`p-6 ${index === 0 ? "lg:p-8" : ""}`}>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="font-medium">{article.author}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>

                      <h3
                        className={`${index === 0 ? "text-2xl lg:text-3xl" : "text-xl"
                          } font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2`}>
                        {article.title}
                      </h3>

                      <p
                        className={`text-gray-600 mb-6 ${index === 0 ? "text-lg line-clamp-3" : "line-clamp-3"
                          }`}>
                        {article.excerpt}
                      </p>

                      {article.externalUrl && (
                        <a
                          href={article.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:translate-x-1"
                        >
                          Lire la suite
                          <svg
                            className="ml-2 w-5 h-5 transition-transform"
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
                        </a>
                      )}

                    </div>
                  </article>
                ))}
              </div>

              {/* Section d'appel à l'action discrète */}
              <div className="relative overflow-hidden bg-gray-100 rounded-2xl p-8 lg:p-12 mb-20 shadow-sm">
                <div className="relative max-w-5xl mx-auto text-center">
                  <div className="mb-10">
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                      Votre Projet Mérite un Financement
                    </h3>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                      Nos experts analysent votre éligibilité aux
                      subventions disponibles. Ne laissez pas passer les
                      opportunités de financement qui peuvent propulser votre
                      entreprise.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
                    <Link
                      to="/#eligibility-form"
                      className="group bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Vérifier mon éligibilité
                    </Link>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@masubvention.ma"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-md inline-block"
                    >
                      Entrer en contact avec nous
                    </a>


                  </div>

                  {/* Statistiques simples */}
                  <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        24h
                      </div>
                      <div className="text-gray-600 font-medium">
                        Réponse Rapide
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        100%
                      </div>
                      <div className="text-gray-600 font-medium">Tests sans frais</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        85%
                      </div>
                      <div className="text-gray-600 font-medium">
                        Taux de Réussite
                      </div>
                    </div>
                    <div className="text-center">
                      {/* <div className="text-3xl font-bold text-blue-600 mb-2">
                        50M€
                      </div> */}
                      {/* <div className="text-gray-600 font-medium">
                        Financements Obtenus
                      </div> */}
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
