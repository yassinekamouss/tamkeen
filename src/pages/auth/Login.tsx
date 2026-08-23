import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { Header, Footer } from "../../components";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useClientAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(email, password);
      login(response);
      navigate("/client/dashboard");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        t("clientAuth.login.errorDefault", "Identifiants incorrects.");
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
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#1E5ED8] mb-3">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              {t("clientAuth.login.title", "Espace Client")}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {t(
                "clientAuth.login.subtitle",
                "Connectez-vous pour suivre l'état de votre dossier."
              )}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-600 text-sm text-center font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("clientAuth.login.emailLabel", "Adresse email")}
                </label>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-lg block w-full px-4 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E5ED8] focus:border-transparent sm:text-sm transition-colors"
                  placeholder={t(
                    "clientAuth.login.emailPlaceholder",
                    "votre@email.com"
                  )}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("clientAuth.login.passwordLabel", "Mot de passe")}
                </label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-lg block w-full px-4 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E5ED8] focus:border-transparent sm:text-sm transition-colors"
                  placeholder={t(
                    "clientAuth.login.passwordPlaceholder",
                    "••••••••"
                  )}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  ? t("clientAuth.login.loadingBtn", "Connexion...")
                  : t("clientAuth.login.submitBtn", "Se connecter")}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
