
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { verificarSeEhAdmin } from "@/services/adminService";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminStatus = await verificarSeEhAdmin(user.id);
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          toast.error("Acesso negado. Você não tem permissões de administrador.");
          navigate("/");
        }
      } catch (error) {
        console.error("Erro ao verificar status de admin:", error);
        setIsAdmin(false);
        toast.error("Erro ao verificar permissões.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissões para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
