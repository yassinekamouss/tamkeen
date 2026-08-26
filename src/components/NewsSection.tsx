import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { newsService, type NewsItem } from "../services/newsService";
import { useTranslation } from "react-i18next";

const PREVIEW_COUNT = 3;

const formatDate = (ds: string, l: string) =>
  new Date(ds).toLocaleDateString(l === "ar" ? "ar-EG" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const NewsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await newsService.getPublishedNews({ limit: PREVIEW_COUNT });
      setNews(res.data.slice(0, PREVIEW_COUNT));
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <section id="actuality" className="w-full py-20 sm:py-24 bg-white border-b border-[#DADCE0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-[12px] font-medium tracking-wider text-[#727785] py-12" style={{ fontFamily: "JetBrains Mono, monospace" }}>{t("news_section.loading")}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="actuality"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-white border-b border-[#DADCE0] py-20 sm:py-24"
      aria-label={t("news_section.title")}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#1A73E8] uppercase mb-4 block" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
            {t("news_section.badge")}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[32px] font-bold text-[#191C1D] leading-tight tracking-tight mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {t("news_section.title")}
              </h2>
              <p className="text-[15px] text-[#5F6368] max-w-lg leading-relaxed" style={{ fontFamily: "Roboto Flex, sans-serif" }}>{t("news_section.subtitle")}</p>
            </div>
            <Link
              to="/news"
              className="flex-shrink-0 text-[13px] font-bold uppercase tracking-wider text-[#1A73E8] hover:text-[#174EA6] flex items-center gap-2 transition-colors duration-200 group"
              style={{ fontFamily: "Roboto Flex, sans-serif" }}
            >
              {t("news_section.viewAll")}
              <ArrowRight
                size={14}
                className={`transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" : ""}`}
              />
            </Link>
          </div>
          <div className="mt-8 h-[1px] bg-[#DADCE0]" />
        </div>

        {/* News Content */}
        {news.length === 0 ? (
          <p className="text-[14px] text-[#5F6368] py-12" style={{ fontFamily: "Roboto Flex, sans-serif" }}>{t("news_section.empty")}</p>
        ) : (
          <>
            {/* Desktop Grid View (screens > 768px) */}
            <div className="hidden md:grid md:grid-cols-3 gap-px bg-[#DADCE0] border border-[#DADCE0] rounded-xl overflow-hidden">
              {news.map((article, idx) => {
                const title = article.title[lang] || article.title["fr"];
                const excerpt = article.excerpt[lang] || article.excerpt["fr"];
                const category = article.category[lang] || article.category["fr"];
                const to = `/news/${article.slug ?? article.id}`;
                const isFeatured = article.featured && idx === 0;

                return (
                  <Link
                    key={article.id}
                    to={to}
                    className="group bg-white flex flex-col hover:bg-[#F8F9FA] transition-colors duration-200"
                    aria-label={title}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/9] bg-[#F8F9FA] overflow-hidden border-b border-[#DADCE0]">
                      {article.image ? (
                        <img
                          src={`${import.meta.env.VITE_PREFIX_URL}/news/${article.image}`}
                          alt={title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#E8F0FE] to-[#F8F9FA]" />
                      )}
                      {/* Category badge */}
                      <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-[#1A73E8] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                        {category}
                      </span>
                      {isFeatured && (
                        <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-[#191C1D] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                          {t("news_section.featured")}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Meta */}
                      <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-[#727785] mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        <span>{article.author}</span>
                        <span>•</span>
                        <time dateTime={new Date(article.publishedAt).toISOString()}>
                          {formatDate(article.publishedAt, lang)}
                        </time>
                      </div>

                      {/* Title */}
                      <h3 className="text-[16px] font-bold text-[#191C1D] leading-snug mb-3 line-clamp-2 group-hover:text-[#1A73E8] transition-colors min-h-[2.5rem]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                        {title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-[13px] text-[#5F6368] leading-relaxed line-clamp-3 flex-grow" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                        {excerpt}
                      </p>

                      {/* Read more */}
                      <div className="mt-5 pt-4 border-t border-[#DADCE0]">
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#1A73E8] group-hover:text-[#174EA6] transition-colors" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                          {t("news_section.readMore")}
                          <ArrowRight
                            size={14}
                            className={`transition-transform group-hover:translate-x-0.5 ${isRTL ? "rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0" : ""}`}
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Horizontal Swipeable Carousel (screens <= 768px) */}
            <div className="md:hidden">
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-4 -mx-4 no-scrollbar scroll-smooth">
                {news.map((article, idx) => {
                  const title = article.title[lang] || article.title["fr"];
                  const excerpt = article.excerpt[lang] || article.excerpt["fr"];
                  const category = article.category[lang] || article.category["fr"];
                  const to = `/news/${article.slug ?? article.id}`;
                  const isFeatured = article.featured && idx === 0;

                  return (
                    <Link
                      key={article.id}
                      to={to}
                      className="w-[84vw] max-w-[340px] flex-shrink-0 snap-start snap-always bg-white border border-[#DADCE0] flex flex-col justify-between shadow-sm rounded-xl overflow-hidden group"
                      aria-label={title}
                    >
                      <div>
                        {/* Image */}
                        <div className="relative aspect-[16/9] bg-[#F8F9FA] overflow-hidden border-b border-[#DADCE0]">
                          {article.image ? (
                            <img
                              src={`${import.meta.env.VITE_PREFIX_URL}/news/${article.image}`}
                              alt={title}
                              className="w-full h-full object-cover transition-all duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#E8F0FE] to-[#F8F9FA]" />
                          )}
                          {/* Category badge */}
                          <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-[#1A73E8] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                            {category}
                          </span>
                          {isFeatured && (
                            <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-[#191C1D] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                              {t("news_section.featured")}
                            </span>
                          )}
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col">
                          {/* Meta */}
                          <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-[#727785] mb-2.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                            <span>{article.author}</span>
                            <span>•</span>
                            <time dateTime={new Date(article.publishedAt).toISOString()}>
                              {formatDate(article.publishedAt, lang)}
                            </time>
                          </div>

                          {/* Title */}
                          <h3 className="text-[15px] font-bold text-[#191C1D] leading-snug mb-2 line-clamp-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                            {title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-[13px] text-[#5F6368] leading-relaxed line-clamp-3" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                            {excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Read more footer */}
                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t border-[#DADCE0]">
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#1A73E8]" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                            {t("news_section.readMore")}
                            <ArrowRight
                              size={14}
                              className={`transition-transform ${isRTL ? "rotate-180" : ""}`}
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Visual swipe hint */}
              <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-[#727785]" style={{ fontFamily: "Roboto Flex, sans-serif" }}>
                <span>{isRTL ? "← اسحب للاستكشاف →" : "← Glissez pour explorer →"}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
