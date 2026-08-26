import React, { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { authService } from "../../services/authService";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import logo from "../../assets/logo.webp";

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
  mono: "font-['JetBrains_Mono',_monospace]",
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login } = useClientAuth();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const nativeRevealSupported = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    return ua.includes("Edge/") && !ua.includes("Edg/");
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(email, password);
      login(response);
      navigate("/client/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        t(
          "clientAuth.login.errorDefault",
          "Échec de la connexion. Vérifiez vos identifiants."
        );
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#F8F9FA] flex flex-col justify-between items-center px-4 py-8 sm:px-6 lg:px-8 ${font.body}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full flex-grow flex items-center justify-center py-6">
        <div className="max-w-md w-full">
          {/* Double bezel frame */}
          <div className="bg-[#EDEEEF]/60 p-2 sm:p-2.5 rounded-2xl border border-[#DADCE0]">
            <div className="bg-white rounded-xl border border-[#DADCE0] overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-8 pb-6 text-center border-b border-[#F3F4F5]">
                <Link
                  to="/"
                  className="inline-block focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:ring-offset-2 rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <img
                    src={logo}
                    alt="Tamkeen Center - Masubvention.ma"
                    className="h-16 sm:h-20 w-auto mx-auto mb-5 object-contain"
                  />
                </Link>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-[#E8F0FE] text-[#005BBF] text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]"></span>
                  {t("clientAuth.login.badge", "Espace Porteur de Projet")}
                </div>

                <h1 className={`${font.display} text-2xl font-bold text-[#191C1D] tracking-tight`}>
                  {t("clientAuth.login.title", "Connexion à votre espace")}
                </h1>

                <p className="text-[#5F6368] text-xs sm:text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {t(
                    "clientAuth.login.subtitle",
                    "Accédez au suivi en temps réel et à la gestion de vos pièces de dossier."
                  )}
                </p>
              </div>

              {/* Form body */}
              <div className="p-6 sm:p-8 space-y-5">
                {error && (
                  <div className="p-4 rounded-lg bg-[#FFDAD6] border-l-4 border-[#BA1A1A] text-[#93000A] text-xs sm:text-sm font-medium flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-[#BA1A1A] mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="client-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#414754] mb-1.5"
                    >
                      {t("clientAuth.login.emailLabel", "Adresse email")}
                    </label>

                    <input
                      id="client-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t(
                        "clientAuth.login.emailPlaceholder",
                        "votre@entreprise.ma"
                      )}
                      dir="ltr"
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DADCE0] rounded text-sm text-[#191C1D] placeholder-[#727785] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label
                        htmlFor="client-password"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#414754]"
                      >
                        {t("clientAuth.login.passwordLabel", "Mot de passe")}
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        id="client-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        dir="ltr"
                        required
                        className={`w-full ${
                          isRTL ? "pl-11 pr-3.5" : "pl-3.5 pr-11"
                        } py-2.5 bg-white border border-[#DADCE0] rounded text-sm text-[#191C1D] placeholder-[#727785] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors`}
                      />

                      {!nativeRevealSupported && (
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={
                            showPassword
                              ? t("clientAuth.login.hidePassword", "Masquer")
                              : t("clientAuth.login.showPassword", "Afficher")
                          }
                          className={`absolute inset-y-0 ${
                            isRTL ? "left-0" : "right-0"
                          } px-3 flex items-center justify-center text-[#727785] hover:text-[#191C1D] transition-colors focus:outline-none`}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-[#1A73E8] hover:bg-[#174EA6] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 px-4 rounded font-medium text-sm shadow-[0_4px_14px_rgba(26,115,232,0.12)] transition-all focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:ring-offset-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        <span>{t("clientAuth.login.loadingBtn", "Connexion en cours...")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("clientAuth.login.submitBtn", "Accéder à mon espace")}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Footer callout */}
              <div className="px-6 py-4 bg-[#F8F9FA] border-t border-[#DADCE0] text-center space-y-2">
                <p className="text-xs text-[#5F6368]">
                  {t(
                    "clientAuth.login.noAccountYet",
                    "Vous n'avez pas encore évalué l'éligibilité de votre projet ?"
                  )}
                </p>

                <Link
                  to="/"
                  className="inline-flex items-center text-xs font-bold text-[#1A73E8] hover:text-[#174EA6] hover:underline transition-colors gap-1"
                >
                  <span>{t("clientAuth.login.takeTestBtn", "Faire le test d'éligibilité gratuit")}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#727785] pb-2">
        Tamkeen Center &amp; Masubvention.ma © 2026 — Plateforme d'Accompagnement aux Subventions
      </div>
    </div>
  );
};

export default Login;