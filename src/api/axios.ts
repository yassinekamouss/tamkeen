import axios, { type AxiosError } from "axios";
import { parseApiError } from "../utils/apiError";
import type { ParsedApiError } from "../types/api";

// Enrichissement du type AxiosError pour porter parsedError
declare module "axios" {
  export interface AxiosError {
    parsedError?: ParsedApiError;
  }
}

// Base URL fourni par l'environnement (doit déjà contenir le préfixe /api du backend)
const baseURL = import.meta.env.VITE_BACKEND_API_URL;

// Nouveau préfixe sécurisé des routes admin
export const ADMIN_API_PREFIX = "/x9zTAMkeen-secure-dashboard-77-center";
export const ADMIN_FRONT_PREFIX = "/x9zTAMkeen-secure-dashboard-77-center";

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 60000, // 60 secondes pour supporter les analyses IA / OCR complexes
});

// Intercepteur de réponse Axios pour normalisation et gestion des erreurs
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const parsed = parseApiError(error);
    error.parsedError = parsed;

    const status = error.response?.status;
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const isAdminPath = currentPath.includes("x9zTAMkeen-secure-dashboard-77-center");
    const isAuthPage =
      currentPath.includes("/login") ||
      currentPath.includes("/setup-password");

    // 1. Gestion des erreurs 401 (Session expirée / Non autorisé)
    if (status === 401) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized", { detail: parsed }));

        // Ne rediriger automatiquement vers le login admin que sur les routes admin protégées
        if (!isAuthPage && isAdminPath) {
          window.location.href = `${ADMIN_FRONT_PREFIX}/login`;
        }
      }
    }

    // 2. Gestion des erreurs 403 (Compte désactivé / Accès interdit)
    if (status === 403) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:forbidden", { detail: parsed }));
      }
    }

    return Promise.reject(error);
  }
);

export default api;

