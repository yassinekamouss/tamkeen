import React from "react";
import { useTranslation } from "react-i18next";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      {children}
    </div>
  );
};

export default PublicLayout;
