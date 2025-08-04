// src/pages/admin/Login.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import logo from "../../assets/logo.webp";

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const loginData: LoginData = { email, password };

    try {
      const res = await axios.post("/admin/login", loginData);
      const token = res.data.token;

      // Stocker le token
      localStorage.setItem("adminToken", token);

      // Rediriger
      navigate("/admin/dashboard");
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
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
