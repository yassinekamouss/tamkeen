import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { ADMIN_API_PREFIX, ADMIN_FRONT_PREFIX } from "../api/axios";

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get(`${ADMIN_API_PREFIX}/me`);
        const apiAdmin = response.data.admin;

        // Synchroniser localStorage avec les données de l'API

        localStorage.setItem("adminProfile", JSON.stringify(apiAdmin));

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
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={`${ADMIN_FRONT_PREFIX}/login`} />
  );
};
export default PrivateRoute;
