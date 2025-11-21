// src/pages/admin/Login.tsx
import React, { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios, { ADMIN_API_PREFIX, ADMIN_FRONT_PREFIX } from "../../api/axios";
import logo from "../../assets/logo.webp";

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  // Detect if the browser provides a native password reveal control (e.g., Legacy Microsoft Edge)
  const nativeRevealSupported = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    // Legacy Edge (EdgeHTML) exposes a native password reveal button
    const isLegacyEdge = ua.includes("Edge/") && !ua.includes("Edg/");
    return isLegacyEdge;
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const loginData: LoginData = { email, password };

    try {
      const res = await axios.post(`${ADMIN_API_PREFIX}/login`, loginData);

      const admin = res.data.admin;

      localStorage.setItem("adminProfile", JSON.stringify(admin));

      // Rediriger
      navigate(`${ADMIN_FRONT_PREFIX}/dashboard`);
    } catch {
      setError("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Header avec logo */}
          <div className="px-8 py-8 text-center">
            <img
              src={logo}
              alt="Tamkeen Center"
              className="h-20 w-auto mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Administration
            </h1>
            <p className="text-gray-600 text-sm">
              Espace sécurisé d'administration
            </p>
          </div>

          {/* Formulaire */}
          <div className="px-8 pb-8">
            {error && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-700 text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tamkeen.ma"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  {!nativeRevealSupported && (
                    <button
                      id="toggle-password-visibility"
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-pressed={showPassword}
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      title={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      className="absolute inset-y-0 right-0 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-transparent border-0 p-0 m-0 focus:outline focus:outline-2 focus:outline-orange-500">
                      {showPassword ? (
                        <EyeOff aria-hidden="true" size={20} />
                      ) : (
                        <Eye aria-hidden="true" size={20} />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium">
                Se connecter
              </button>
            </form>
          </div>

          {/* Footer minimaliste */}
          <div className="px-8 pb-6 bg-gray-50 border-t">
            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">Tamkeen Center © 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
