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
  const { t, i18n } = useTranslation();
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
        setError(t("news_page.load_error"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slugOrId, t]);

  if (loading) {
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

  if (error || !item) {
    return (
      <div className="w-full bg-[#FFFFFF] min-h-screen flex flex-col justify-between">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <p className="text-sm font-mono text-red-600 mb-6">
            {error || t("news_page.not_found")}
          </p>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 border border-[#E4E4E7] px-6 py-3 text-xs font-mono uppercase tracking-wider text-[#1F2937] hover:bg-white transition-colors duration-200"
          >
            {t("news_page.back_to_news")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFFFFF] font-sans text-[#1F2937]">
      <SeoAlternates />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <nav className="mb-8 text-[10px] font-mono uppercase tracking-wider text-[#1F2937]/50 flex items-center gap-2 flex-wrap">
          <Link to="/news" className="text-[#1E5ED8] hover:underline font-semibold">
            {t("news_page.breadcrumbs_news")}
          </Link>
          <span>/</span>
          <span className="text-[#1F2937]/70 line-clamp-1">
            {item.title[lang] || item.title["fr"]}
          </span>
        </nav>

        <h1 className="text-2xl sm:text-4xl font-bold font-display text-[#1F2937] tracking-tight leading-tight mb-4">
          {item.title[lang] || item.title["fr"]}
        </h1>

        <div className="text-[10px] font-mono uppercase tracking-wider text-[#1F2937]/60 pb-6 mb-8 border-b border-[#E4E4E7] flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#1F2937]/70">{item.author}</span>
          <span>•</span>
          <time dateTime={new Date(item.publishedAt).toISOString()}>
            {formatDate(item.publishedAt, lang)}
          </time>
          {item.category && (
            <>
              <span>•</span>
              <span className="text-[#F97316] font-semibold">{item.category[lang] || item.category["fr"]}</span>
            </>
          )}
        </div>

        {item.image && (
          <div className="border border-[#E4E4E7] p-1 bg-white mb-10">
            <img
              src={`${import.meta.env.VITE_PREFIX_URL}/news/${item.image}`}
              alt={item.title[lang] || item.title["fr"]}
              className="w-full h-auto object-cover grayscale opacity-95 hover:grayscale-0 transition-all duration-500"
            />
          </div>
        )}

        <article className="prose max-w-none">
          <p className="whitespace-pre-line text-[#1F2937]/75 text-sm leading-relaxed font-sans">
            {item.content[lang] || item.content["fr"]}
          </p>
        </article>

        {item.externalUrl && (
          <div className="mt-12 pt-8 border-t border-[#E4E4E7]">
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1E5ED8] hover:bg-[#1F2937] text-white px-6 py-3.5 text-xs font-mono uppercase tracking-wider transition-colors duration-200"
            >
              <span>{t("news_page.view_source")}</span>
              <svg
                className="w-4 h-4 ml-1 rtl:mr-1 rtl:rotate-180"
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
