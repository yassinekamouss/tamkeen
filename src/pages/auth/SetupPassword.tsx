import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/authService";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { Header, Footer } from "../../components";
import { useTranslation } from "react-i18next";

const SetupPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useClientAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

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
      className="min-h-screen flex flex-col justify-between bg-gray-50 font-sans"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div>
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              {t(
                "clientAuth.setupPassword.title",
                "Création de votre Espace Client"
              )}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {t(
                "clientAuth.setupPassword.subtitle",
                "Définissez un mot de passe sécurisé pour accéder à votre espace de suivi."
              )}
            </p>
          </div>

          {!token ? (
            <div className="text-red-600 text-sm text-center font-medium bg-red-50 p-4 rounded-lg border border-red-200">
              {t(
                "clientAuth.setupPassword.invalidLink",
                "Lien d'invitation invalide ou manquant. Veuillez vérifier le lien reçu par email."
              )}
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="text-red-600 text-sm text-center font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t(
                      "clientAuth.setupPassword.passwordLabel",
                      "Mot de passe (8 caractères min.)"
                    )}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="appearance-none rounded-lg block w-full px-4 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E5ED8] focus:border-transparent sm:text-sm transition-colors"
                    placeholder={t(
                      "clientAuth.setupPassword.passwordPlaceholder",
                      "Nouveau mot de passe"
                    )}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t(
                      "clientAuth.setupPassword.confirmLabel",
                      "Confirmer le mot de passe"
                    )}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="appearance-none rounded-lg block w-full px-4 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E5ED8] focus:border-transparent sm:text-sm transition-colors"
                    placeholder={t(
                      "clientAuth.setupPassword.confirmPlaceholder",
                      "Confirmer le mot de passe"
                    )}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-[#1E5ED8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E5ED8] shadow-md transition-colors disabled:opacity-50"
                >
                  {loading
                    ? t(
                        "clientAuth.setupPassword.loadingBtn",
                        "Création en cours..."
                      )
                    : t(
                        "clientAuth.setupPassword.submitBtn",
                        "Activer mon espace"
                      )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SetupPassword;
