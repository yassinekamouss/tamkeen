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
      <section id="actuality" className="w-full py-20 sm:py-28 bg-white border-b border-[#E4E4E7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <p className="text-xs font-mono uppercase tracking-wider text-[#1F2937]/40 py-12">{t("news_section.loading")}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="actuality"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-white border-b border-[#E4E4E7] py-20 sm:py-28"
      aria-label={t("news_section.title")}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <span className="section-eyebrow mb-3 block">
            {t("news_section.badge")}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="section-h2 text-[#1F2937] mb-2">
                {t("news_section.title")}
              </h2>
              <p className="text-sm text-[#5B6472] max-w-lg leading-relaxed font-body">{t("news_section.subtitle")}</p>
            </div>
            <Link
              to="/news"
              className="flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-[#1E5ED8] hover:text-[#174BAE] flex items-center gap-2 transition-colors duration-200 group font-body"
            >
              {t("news_section.viewAll")}
              <ArrowRight
                size={13}
                className={`transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" : ""}`}
              />
            </Link>
          </div>
          <div className="mt-6 h-[1px] bg-[#E4E4E7]" />
        </div>

        {/* News Content */}
        {news.length === 0 ? (
          <p className="text-sm text-[#1F2937]/50 py-12">{t("news_section.empty")}</p>
        ) : (
          <>
            {/* Desktop Grid View (screens > 768px) */}
            <div className="hidden md:grid md:grid-cols-3 gap-px bg-[#E4E4E7]">
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
                    className="group bg-white flex flex-col hover:bg-[#FAFCFF] transition-colors duration-200"
                    aria-label={title}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/9] bg-[#F4F4F5] overflow-hidden">
                      {article.image ? (
                        <img
                          src={`${import.meta.env.VITE_PREFIX_URL}/news/${article.image}`}
                          alt={title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF]" />
                      )}
                      {/* Category badge */}
                      <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-[#1E5ED8] text-white text-[9px] font-mono uppercase tracking-wider px-2 py-1">
                        {category}
                      </span>
                      {isFeatured && (
                        <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-[#F97316] text-white text-[9px] font-mono uppercase tracking-wider px-2 py-1">
                          {t("news_section.featured")}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Meta */}
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#1F2937]/45 mb-3">
                        <span>{article.author}</span>
                        <span>•</span>
                        <time dateTime={new Date(article.publishedAt).toISOString()}>
                          {formatDate(article.publishedAt, lang)}
                        </time>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-[#1F2937] font-display leading-snug mb-3 line-clamp-2 group-hover:text-[#1E5ED8] transition-colors min-h-[2.5rem]">
                        {title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-[#1F2937]/60 leading-relaxed line-clamp-3 flex-grow">
                        {excerpt}
                      </p>

                      {/* Read more */}
                      <div className="mt-5 pt-4 border-t border-[#E4E4E7]">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#1E5ED8] group-hover:text-[#F97316] transition-colors">
                          {t("news_section.readMore")}
                          <ArrowRight
                            size={11}
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
                      className="w-[84vw] max-w-[340px] flex-shrink-0 snap-start snap-always bg-white border border-[#E4E4E7] flex flex-col justify-between shadow-sm rounded-[4px] overflow-hidden group"
                      aria-label={title}
                    >
                      <div>
                        {/* Image */}
                        <div className="relative aspect-[16/9] bg-[#F4F4F5] overflow-hidden">
                          {article.image ? (
                            <img
                              src={`${import.meta.env.VITE_PREFIX_URL}/news/${article.image}`}
                              alt={title}
                              className="w-full h-full object-cover transition-all duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF]" />
                          )}
                          {/* Category badge */}
                          <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-[#1E5ED8] text-white text-[9px] font-mono uppercase tracking-wider px-2 py-1">
                            {category}
                          </span>
                          {isFeatured && (
                            <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-[#F97316] text-white text-[9px] font-mono uppercase tracking-wider px-2 py-1">
                              {t("news_section.featured")}
                            </span>
                          )}
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col">
                          {/* Meta */}
                          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#1F2937]/45 mb-2.5">
                            <span>{article.author}</span>
                            <span>•</span>
                            <time dateTime={new Date(article.publishedAt).toISOString()}>
                              {formatDate(article.publishedAt, lang)}
                            </time>
                          </div>

                          {/* Title */}
                          <h3 className="text-sm font-bold text-[#1F2937] font-display leading-snug mb-2 line-clamp-2">
                            {title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-xs text-[#1F2937]/60 leading-relaxed line-clamp-3">
                            {excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Read more footer */}
                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t border-[#E4E4E7]">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#1E5ED8]">
                            {t("news_section.readMore")}
                            <ArrowRight
                              size={11}
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
              <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] font-mono uppercase tracking-wider text-[#1F2937]/40">
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
