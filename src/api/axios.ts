import axios from "axios";

// Base URL fourni par l'environnement (doit déjà contenir le préfixe /api du backend)
const baseURL = import.meta.env.VITE_BACKEND_API_URL;

// Nouveau préfixe sécurisé des routes admin (remplace l'ancien '/admin')
export const ADMIN_API_PREFIX = "/x9zTAMkeen-secure-dashboard-77-center";
// Frontend route prefix (obfuscated) for admin area
export const ADMIN_FRONT_PREFIX = "/x9zTAMkeen-secure-dashboard-77-center";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
