import React, { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { authService } from "../../services/authService";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import logo from "../../assets/logo.webp";

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

  // Certains anciens navigateurs peuvent déjà afficher
  // leur propre bouton de révélation du mot de passe.
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
      className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">

          {/* =========================================================
              HEADER
          ========================================================= */}
          <div className="px-8 py-8 text-center">
            <Link
              to="/"
              className="inline-block focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
            >
              <img
                src={logo}
                alt="Tamkeen Center"
                className="h-20 w-auto mx-auto mb-6"
              />
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("clientAuth.login.title", "Espace Client")}
            </h1>

            <p className="text-gray-600 text-sm">
              {t(
                "clientAuth.login.subtitle",
                "Connectez-vous pour suivre votre dossier."
              )}
            </p>
          </div>

          {/* =========================================================
              FORMULAIRE
          ========================================================= */}
          <div className="px-8 pb-8">

            {/* Message d'erreur */}
            {error && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p
                  className={`text-orange-700 text-sm flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <svg
                    className={`w-4 h-4 shrink-0 ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span>{error}</span>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="client-email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t(
                    "clientAuth.login.emailLabel",
                    "Adresse email"
                  )}
                </label>

                <input
                  id="client-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(
                    "clientAuth.login.emailPlaceholder",
                    "votre@email.com"
                  )}
                  dir="ltr"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label
                  htmlFor="client-password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t(
                    "clientAuth.login.passwordLabel",
                    "Mot de passe"
                  )}
                </label>

                <div className="relative">
                  <input
                    id="client-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t(
                      "clientAuth.login.passwordPlaceholder",
                      "••••••••"
                    )}
                    dir="ltr"
                    required
                    className={`w-full ${
                      isRTL ? "pl-12 pr-4" : "pl-4 pr-12"
                    } py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors`}
                  />

                  {!nativeRevealSupported && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((visible) => !visible)
                      }
                      aria-pressed={showPassword}
                      aria-label={
                        showPassword
                          ? t(
                              "clientAuth.login.hidePassword",
                              "Masquer le mot de passe"
                            )
                          : t(
                              "clientAuth.login.showPassword",
                              "Afficher le mot de passe"
                            )
                      }
                      title={
                        showPassword
                          ? t(
                              "clientAuth.login.hidePassword",
                              "Masquer le mot de passe"
                            )
                          : t(
                              "clientAuth.login.showPassword",
                              "Afficher le mot de passe"
                            )
                      }
                      className={`absolute inset-y-0 ${
                        isRTL ? "left-0" : "right-0"
                      } w-10 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-transparent border-0 p-0 m-0 focus:outline focus:outline-2 focus:outline-orange-500`}
                    >
                      {showPassword ? (
                        <EyeOff
                          aria-hidden="true"
                          size={20}
                        />
                      ) : (
                        <Eye
                          aria-hidden="true"
                          size={20}
                        />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Bouton connexion */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
                )}

                {loading
                  ? t(
                      "clientAuth.login.loadingBtn",
                      "Connexion..."
                    )
                  : t(
                      "clientAuth.login.submitBtn",
                      "Se connecter"
                    )}
              </button>
            </form>
          </div>

          {/* =========================================================
              ACTION CLIENT
          ========================================================= */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-200">
            <div className="text-center">

              <p className="text-xs text-gray-500 mb-2">
                {t(
                  "clientAuth.login.noAccountYet",
                  "Vous n'avez pas encore fait le test d'éligibilité ?"
                )}
              </p>

              <Link
                to="/"
                className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
              >
                {t(
                  "clientAuth.login.takeTestBtn",
                  "Faire le test maintenant"
                )}
              </Link>

              <p className="text-xs text-gray-500 mt-4">
                Tamkeen Center © 2024
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;