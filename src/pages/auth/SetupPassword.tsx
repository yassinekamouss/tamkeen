import React, { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { authService } from "../../services/authService";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import logo from "../../assets/logo.webp";

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
  mono: "font-['JetBrains_Mono',_monospace]",
};

const SetupPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useClientAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const nativeRevealSupported = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    return ua.includes("Edge/") && !ua.includes("Edg/");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError(
        t(
          "clientAuth.setupPassword.invalidLink",
          "Lien d'invitation invalide ou manquant."
        )
      );
      return;
    }

    if (password.length < 8) {
      setError(
        t(
          "clientAuth.setupPassword.errorLength",
          "Le mot de passe doit contenir au moins 8 caractères."
        )
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        t(
          "clientAuth.setupPassword.errorMatch",
          "Les mots de passe ne correspondent pas."
        )
      );
      return;
    }

    setLoading(true);

    try {
      const response = await authService.setupPassword(token, password);
      login(response);
      navigate("/client/dashboard");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        t(
          "clientAuth.setupPassword.errorDefault",
          "Erreur lors de la création du mot de passe."
        );
      setError(msg);
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
                  {t("clientAuth.setupPassword.badge", "Activation Espace Porteur")}
                </div>

                <h1 className={`${font.display} text-2xl font-bold text-[#191C1D] tracking-tight`}>
                  {t(
                    "clientAuth.setupPassword.title",
                    "Activation de votre espace"
                  )}
                </h1>

                <p className="text-[#5F6368] text-xs sm:text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {t(
                    "clientAuth.setupPassword.subtitle",
                    "Définissez un mot de passe sécurisé pour accéder à votre espace de suivi de dossier."
                  )}
                </p>
              </div>

              {/* Form body */}
              <div className="p-6 sm:p-8 space-y-5">
                {!token ? (
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
                    <span>
                      {t(
                        "clientAuth.setupPassword.invalidLink",
                        "Lien d'invitation invalide ou manquant. Veuillez vérifier le lien reçu par email."
                      )}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div>
                      <label
                        htmlFor="new-password"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#414754] mb-1.5"
                      >
                        {t(
                          "clientAuth.setupPassword.passwordLabel",
                          "Nouveau mot de passe (8 car. min.)"
                        )}
                      </label>

                      <div className="relative">
                        <input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          dir="ltr"
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

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#414754] mb-1.5"
                      >
                        {t(
                          "clientAuth.setupPassword.confirmLabel",
                          "Confirmer le mot de passe"
                        )}
                      </label>

                      <div className="relative">
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          dir="ltr"
                          className={`w-full ${
                            isRTL ? "pl-11 pr-3.5" : "pl-3.5 pr-11"
                          } py-2.5 bg-white border border-[#DADCE0] rounded text-sm text-[#191C1D] placeholder-[#727785] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors`}
                        />

                        {!nativeRevealSupported && (
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            aria-label={
                              showConfirmPassword
                                ? t("clientAuth.login.hidePassword", "Masquer")
                                : t("clientAuth.login.showPassword", "Afficher")
                            }
                            className={`absolute inset-y-0 ${
                              isRTL ? "left-0" : "right-0"
                            } px-3 flex items-center justify-center text-[#727785] hover:text-[#191C1D] transition-colors focus:outline-none`}
                          >
                            {showConfirmPassword ? (
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
                          <span>
                            {t(
                              "clientAuth.setupPassword.loadingBtn",
                              "Création en cours..."
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {t(
                              "clientAuth.setupPassword.submitBtn",
                              "Activer mon espace client"
                            )}
                          </span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Footer callout */}
              <div className="px-6 py-4 bg-[#F8F9FA] border-t border-[#DADCE0] text-center space-y-2">
                <p className="text-xs text-[#5F6368]">
                  {t(
                    "clientAuth.setupPassword.alreadyHaveAccount",
                    "Vous avez déjà configuré votre mot de passe ?"
                  )}
                </p>

                <Link
                  to="/login"
                  className="inline-flex items-center text-xs font-bold text-[#1A73E8] hover:text-[#174EA6] hover:underline transition-colors gap-1"
                >
                  <span>
                    {t(
                      "clientAuth.setupPassword.loginBtn",
                      "Se connecter à mon espace"
                    )}
                  </span>
                  <svg
                    className="w-3.5 h-3.5"
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

export default SetupPassword;
