import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header, Footer } from "../components";
import Spinner from "../components/Spinner";
import { newsService, type NewsItem } from "../services/newsService";
import SeoAlternates from "../components/SeoAlternates";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!slugOrId) return;
        const res = await newsService.getBySlugOrId(slugOrId);
        setItem(res.data);
      } catch {
        setError("Impossible de charger cette actualité.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slugOrId]);

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
            {error || "Actualité introuvable."}
          </p>
          <Link to="/news" className="text-blue-600 hover:underline">
            Retour aux actualités
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
            Actualités
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 line-clamp-1">{item.title}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {item.title}
        </h1>
        <div className="text-sm text-gray-500 mb-6">
          <span className="font-medium">{item.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={new Date(item.publishedAt).toISOString()}>
            {formatDate(item.publishedAt)}
          </time>
          {item.category && (
            <>
              <span className="mx-2">•</span>
              <span>{item.category}</span>
            </>
          )}
        </div>

        {item.image && (
          <div className="rounded-xl overflow-hidden mb-8 bg-gray-100">
            <img
              src={`${import.meta.env.VITE_PREFIX_URL}/news/${item.image}`}
              alt={item.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <article className="prose prose-gray max-w-none">
          <p className="whitespace-pre-line text-gray-800 leading-relaxed">
            {item.content}
          </p>
        </article>

        {item.externalUrl && (
          <div className="mt-10">
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
              Consulter la source
              <svg
                className="ml-2 w-5 h-5"
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
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;
