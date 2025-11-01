import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import i18n from "../i18n";

const LangLayout: React.FC = () => {
  const params = useParams();
  const lang = (params.lang as "fr" | "ar") || "fr";

  useEffect(() => {
    // Switch i18n language based on URL prefix
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang).catch(() => void 0);
    }
    // Update html attributes for better SEO and accessibility
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  return <Outlet />;
};

export default LangLayout;
