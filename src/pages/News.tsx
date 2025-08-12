import React, { useState, useEffect, useCallback } from "react";
import { Header, Footer } from "../components";
import { newsService, type NewsItem } from "../services/newsService";
import Spinner from "../components/Spinner";

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

      {/* Hero Section - Plus grand et plus informatif */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-20 pb-32">
        <div className="absolute inset-0 bg-black opacity-10"></div>

        {/* Éléments décoratifs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full opacity-30 animation-delay-2000 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-500 rounded-full opacity-25 animation-delay-4000 animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Actualités &amp; Opportunités
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed">
              Découvrez les dernières subventions disponibles, opportunités de
              financement et success stories d'entrepreneurs que nous avons
              accompagnés
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-100 text-lg">
                  Entreprises accompagnées
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">50M€</div>
                <div className="text-blue-100 text-lg">
                  Subventions obtenues
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">85%</div>
                <div className="text-blue-100 text-lg">Taux de réussite</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
              fill="#f9fafb"
            />
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
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === "all"
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
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
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
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 ${
                      index === 0 ? "md:col-span-2 lg:col-span-2" : ""
                    }`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={`https://picsum.photos/${
                          index === 0 ? "600/350" : "400/250"
                        }?random=${article.id}`}
                        alt={article.title}
                        className={`w-full ${
                          index === 0 ? "h-64" : "h-48"
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
                        className={`${
                          index === 0 ? "text-2xl lg:text-3xl" : "text-xl"
                        } font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2`}>
                        {article.title}
                      </h3>

                      <p
                        className={`text-gray-600 mb-6 ${
                          index === 0 ? "text-lg line-clamp-3" : "line-clamp-3"
                        }`}>
                        {article.excerpt}
                      </p>

                      <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:translate-x-1">
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
                      </button>
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
                      Nos experts analysent gratuitement votre éligibilité aux
                      subventions disponibles. Ne laissez pas passer les
                      opportunités de financement qui peuvent propulser votre
                      entreprise.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
                    <button className="group bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                      Analyser mon Éligibilité
                    </button>
                    <button className="group bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-md">
                      Consultation Gratuite
                    </button>
                  </div>

                  {/* Statistiques simples */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                      <div className="text-gray-600 font-medium">Gratuit</div>
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
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        50M€
                      </div>
                      <div className="text-gray-600 font-medium">
                        Financements Obtenus
                      </div>
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
