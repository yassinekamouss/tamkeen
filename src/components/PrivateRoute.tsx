import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/admin/me");
        const apiAdmin = response.data.admin;
        
        // Synchroniser localStorage avec les données de l'API
        const localAdmin = JSON.parse(localStorage.getItem("adminProfile") || "null");
        if (!localAdmin || localAdmin.role !== apiAdmin.role) {
          localStorage.setItem("adminProfile", JSON.stringify(apiAdmin));
        }
        
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("adminProfile");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};
export default PrivateRoute;
