import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

/**
 * Injects hreflang alternates for fr-MA, ar-MA, and x-default
 * based on the current path, stripping any existing /fr or /ar prefix.
 */
const SeoAlternates: React.FC = () => {
  const { pathname } = useLocation();

  // Remove any existing language prefix (/fr or /ar) from the beginning
  const basePath = pathname.replace(/^\/(fr|ar)(?=\/|$)/, "");
  const path = basePath || "/";

  const origin = "https://masubvention.ma";
  const hrefDefault = `${origin}${path}`;
  const hrefFr = `${origin}/fr${path}`.replace("//", "/");
  const hrefAr = `${origin}/ar${path}`.replace("//", "/");

  return (
    <Helmet>
      <link rel="alternate" hrefLang="fr-MA" href={hrefFr} />
      <link rel="alternate" hrefLang="ar-MA" href={hrefAr} />
      <link rel="alternate" hrefLang="x-default" href={hrefDefault} />
    </Helmet>
  );
};

export default SeoAlternates;
