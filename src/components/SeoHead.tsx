import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_SITE_NAME = "MaSubvention";
const getSiteOrigin = () => {
  if (import.meta.env.VITE_SITE_URL) return import.meta.env.VITE_SITE_URL.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "https://masubvention.ma";
};

const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Tamkeen",
  jsonLd,
}) => {
  const siteOrigin = getSiteOrigin();
  const defaultImage = `${siteOrigin}/image_logo.webp`;
  const pageImage = image || defaultImage;
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "fr" | "ar") || "fr";
  const isRtl = lang === "ar";

  const defaultTitle = t(
    "home.seo_title",
    "MaSubvention | Tamkeen – Subventions et aides publiques au Maroc"
  );
  const defaultDesc = t(
    "home.seo_desc",
    "Plateforme marocaine pour trouver et vérifier votre éligibilité aux subventions et aides publiques. Tamkeen accompagne les entrepreneurs, entreprises et coopératives dans leurs démarches de financement."
  );

  const pageTitle = title ? `${title} | Tamkeen` : defaultTitle;
  const pageDesc = description || defaultDesc;

  // Stripping /fr or /ar prefix for canonical and hreflang calculation
  const basePath = pathname.replace(/^\/(fr|ar)(?=\/|$)/, "");
  const cleanPath = basePath || "/";

  const hrefDefault = `${siteOrigin}${cleanPath}`;
  const hrefFr = `${siteOrigin}/fr${cleanPath === "/" ? "" : cleanPath}`;
  const hrefAr = `${siteOrigin}/ar${cleanPath === "/" ? "" : cleanPath}`;
  const canonicalUrl = `${siteOrigin}${pathname}`;

  // Organization Schema by default
  const defaultOrgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tamkeen",
    "url": siteOrigin,
    "logo": defaultImage,
    "sameAs": [siteOrigin],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "email": "contact@masubvention.ma",
        "contactType": "customer support",
        "availableLanguage": ["French", "Arabic"],
      },
    ],
  };

  const schemasToInject = jsonLd
    ? Array.isArray(jsonLd)
      ? [defaultOrgSchema, ...jsonLd]
      : [defaultOrgSchema, jsonLd]
    : [defaultOrgSchema];

  return (
    <Helmet>
      {/* HTML Language & Direction */}
      <html lang={lang} dir={isRtl ? "rtl" : "ltr"} />

      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang Alternates */}
      <link rel="alternate" hrefLang="fr-MA" href={hrefFr} />
      <link rel="alternate" hrefLang="ar-MA" href={hrefAr} />
      <link rel="alternate" hrefLang="x-default" href={hrefDefault} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:locale" content={isRtl ? "ar_MA" : "fr_FR"} />
      <meta property="og:locale:alternate" content={isRtl ? "fr_FR" : "ar_MA"} />

      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={pageImage} />

      {/* Structured Data (JSON-LD) */}
      {schemasToInject.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;
