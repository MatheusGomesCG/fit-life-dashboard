
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  showBackButton = true,
  children
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleBack = () => {
    navigate('/dashboard-admin');
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 [AdminPageHeader] Iniciando logout...");
      await logout();
    } catch (error) {
      console.error("❌ [AdminPageHeader] Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {children}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2 text-red-600 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default AdminPageHeader;
