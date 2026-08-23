import axios from "axios";

// Base URL fourni par l'environnement (doit déjà contenir le préfixe /api du backend)
const baseURL = import.meta.env.VITE_BACKEND_API_URL;

// Nouveau préfixe sécurisé des routes admin
export const ADMIN_API_PREFIX = "/x9zTAMkeen-secure-dashboard-77-center";
export const ADMIN_FRONT_PREFIX = "/x9zTAMkeen-secure-dashboard-77-center";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Directive 1: Intercepteur de réponse Axios pour gérer les erreurs 401 (Session expirée / Non autorisé)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes("/login") ||
        currentPath.includes("/setup-password");

      // Émettre un événement personnalisé pour informer le Context
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));

      // Ne rediriger automatiquement que si l'utilisateur n'est pas déjà sur une page d'authentification
      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
