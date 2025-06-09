
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log("🔒 [ProtectedRoute] Verificando acesso:", {
    pathname: location.pathname,
    isAuthenticated,
    userType: user?.tipo,
    loading
  });

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    console.log("⏳ [ProtectedRoute] Aguardando verificação de autenticação");
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    console.log("❌ [ProtectedRoute] Acesso negado, redirecionando para login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("✅ [ProtectedRoute] Acesso permitido");
  return <>{children}</>;
};

export default ProtectedRoute;
