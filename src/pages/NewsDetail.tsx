import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header, Footer } from "../components";
import Spinner from "../components/Spinner";
import { newsService, type NewsItem } from "../services/newsService";
import SeoAlternates from "../components/SeoAlternates";
import { useTranslation } from "react-i18next";

const formatDate = (dateString: string, lang: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const NewsDetail: React.FC = () => {
  const { slugOrId } = useParams();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!slugOrId) return;
        const res = await newsService.getBySlugOrId(slugOrId);
        setItem(res.data);
      } catch {
        setError(
          lang === "ar"
            ? "تعذر تحميل الخبر."
            : "Impossible de charger cette actualité."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slugOrId, lang]);

  if (loading) {
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

  if (error || !item) {
    return (
      <div className="w-full bg-gray-50 min-h-screen">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16">
          <p className="text-gray-700 mb-6">
            {error ||
              (lang === "ar"
                ? "الخبر غير موجود."
                : "Actualité introuvable.")}
          </p>
          <Link to="/news" className="text-blue-600 hover:underline">
            {lang === "ar" ? "العودة إلى الأخبار" : "Retour aux actualités"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      <SeoAlternates />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm">
          <Link to="/news" className="text-blue-600 hover:underline">
            {lang === "ar" ? "الأخبار" : "Actualités"}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 line-clamp-1">
            {item.title[lang] || item.title["fr"]}
          </span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {item.title[lang] || item.title["fr"]}
        </h1>
        <div className="text-sm text-gray-500 mb-6">
          <span className="font-medium">{item.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={new Date(item.publishedAt).toISOString()}>
            {formatDate(item.publishedAt, lang)}
          </time>
          {item.category && (
            <>
              <span className="mx-2">•</span>
              <span>{item.category[lang] || item.category["fr"]}</span>
            </>
          )}
        </div>

        {item.image && (
          <div className="rounded-xl overflow-hidden mb-8 bg-gray-100">
            <img
              src={`${import.meta.env.VITE_PREFIX_URL}/news/${item.image}`}
              alt={item.title[lang] || item.title["fr"]}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <article className="prose prose-gray max-w-none">
          <p className="whitespace-pre-line text-gray-800 leading-relaxed">
            {item.content[lang] || item.content["fr"]}
          </p>
        </article>

        {item.externalUrl && (
          <div className="mt-10">
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
            >
              {lang === "ar" ? "عرض المصدر" : "Consulter la source"}
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;
