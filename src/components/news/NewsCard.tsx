import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { NewsItem } from "../../services/newsService";

export interface NewsCardProps {
  item: NewsItem;
  to: string;
  featured?: boolean;
}

const formatDate = (dateString: string, lang: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const NewsCard: React.FC<NewsCardProps> = ({ item, to, featured }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";

  const { title, excerpt, image, category, author, publishedAt } = item;

  return (
    <Link
      to={to}
      className="group flex flex-col h-full bg-white border border-[#E4E4E7] hover:border-[#1E5ED8] transition-all duration-300 overflow-hidden rounded-none"
      aria-label={title[lang] || title["fr"]}
    >
      <div className="relative aspect-[16/9] bg-[#FFFFFF] overflow-hidden">
        {image ? (
          <img
            src={`${import.meta.env.VITE_PREFIX_URL}/news/${image}`}
            alt={title[lang] || title["fr"]}
            className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FFFFFF] to-[#E4E4E7]" />
        )}

        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
          <span className="bg-[#1E5ED8] text-white text-[9px] font-mono uppercase tracking-wider px-2 py-1">
            {category[lang] || category["fr"]}
          </span>
        </div>

        {featured && (
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
            <span className="bg-[#F97316] text-white px-2 py-1 text-[9px] font-mono uppercase tracking-wider">
              {lang === "ar" ? "مميز" : "En vedette"}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-[10px] font-mono uppercase tracking-wider text-[#1F2937]/50 mb-3">
          <span className="font-semibold text-[#1F2937]/70">{author}</span>
          <span className="mx-2">•</span>
          <time dateTime={new Date(publishedAt).toISOString()}>
            {formatDate(publishedAt, lang)}
          </time>
        </div>

        <h3 className="text-base font-bold text-[#1F2937] font-display mb-2 line-clamp-2 group-hover:text-[#F97316] transition-colors duration-200 min-h-[3rem] leading-snug">
          {title[lang] || title["fr"]}
        </h3>

        <p className="text-xs text-[#1F2937]/65 line-clamp-3 min-h-[3.5rem] leading-relaxed font-sans mt-1">
          {excerpt[lang] || excerpt["fr"]}
        </p>
      </div>
    </Link>
  );
};

export default NewsCard;
