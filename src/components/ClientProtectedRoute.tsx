import React from "react";
import { Navigate } from "react-router-dom";
import { useClientAuth } from "../contexts/ClientAuthContext";
import Loader from "./Spinner";

interface ClientProtectedRouteProps {
  children: React.ReactNode;
}

const ClientProtectedRoute: React.FC<ClientProtectedRouteProps> = ({
  children,
}) => {
  const { user, loading } = useClientAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user || user.role !== "CLIENT") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ClientProtectedRoute;
