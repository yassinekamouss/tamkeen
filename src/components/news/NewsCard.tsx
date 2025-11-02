import React from "react";
import { Link } from "react-router-dom";
import type { NewsItem } from "../../services/newsService";

export interface NewsCardProps {
  item: NewsItem;
  to: string;
  featured?: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const categoryColor = (category: string) => {
  const colors: Record<string, string> = {
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

const NewsCard: React.FC<NewsCardProps> = ({ item, to, featured }) => {
  const { title, excerpt, image, category, author, publishedAt } = item;

  return (
    <Link
      to={to}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
      aria-label={`Lire l'actualité: ${title}`}>
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
        {image ? (
          <img
            src={`${import.meta.env.VITE_PREFIX_URL}/news/${image}`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor(
              category
            )}`}>
            {category}
          </span>
        </div>
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold border border-yellow-200">
              En vedette
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span className="font-medium">{author}</span>
          <span className="mx-2">•</span>
          <time dateTime={new Date(publishedAt).toISOString()}>
            {formatDate(publishedAt)}
          </time>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">{excerpt}</p>
      </div>
    </Link>
  );
};

export default NewsCard;
