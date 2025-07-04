
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  console.log("🔒 [ProtectedRoute] Verificando acesso:", {
    user: user?.id,
    userRole: user?.tipo,
    allowedRoles,
    loading
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    console.log("❌ [ProtectedRoute] Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.tipo)) {
    console.log("❌ [ProtectedRoute] Usuário sem permissão:", {
      userRole: user.tipo,
      allowedRoles
    });
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ [ProtectedRoute] Acesso autorizado");
  return <>{children}</>;
};

export default ProtectedRoute;
