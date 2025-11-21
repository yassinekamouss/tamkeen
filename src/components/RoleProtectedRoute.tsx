import React from "react";
import { Navigate } from "react-router-dom";
import { ADMIN_FRONT_PREFIX } from "../api/axios";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string;
  fallbackPath?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = `${ADMIN_FRONT_PREFIX}/dashboard`,
}) => {
  // Récupérer le profil admin depuis localStorage
  const adminProfile = JSON.parse(
    localStorage.getItem("adminProfile") || "null"
  );

  // Si pas de profil ou rôle insuffisant, rediriger
  if (!adminProfile || adminProfile.role !== requiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
