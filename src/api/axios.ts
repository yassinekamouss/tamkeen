import axios from "axios";

const baseURL = import.meta.env.NODE_ENV === "production"
    ? "/api" // via le proxy Vercel
    : "http://localhost:5000/api"; // backend local

    
const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
