import axios from "axios";

const baseURL = typeof window !== "undefined" && window.location.hostname === "localhost"
  ? "http://localhost:5000/api"
  : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
