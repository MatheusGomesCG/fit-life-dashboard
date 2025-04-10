
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const Index: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirecionar para o dashboard adequado se estiver autenticado
  // ou para login se não estiver
  if (isAuthenticated) {
    if (user?.tipo === "professor") {
      return <Navigate to="/dashboard-professor" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default Index;
