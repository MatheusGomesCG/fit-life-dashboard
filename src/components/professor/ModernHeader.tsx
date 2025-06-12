
import React from "react";
import { HelpCircle, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const ModernHeader: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200">
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user?.nome?.charAt(0) || user?.profile?.nome?.charAt(0) || "P"}
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {user?.nome || user?.profile?.nome || "Professor"}
            </h2>
            <p className="text-sm text-gray-500">
              {user?.email || "professor@fitness.com"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-gray-600 hover:text-gray-800 cursor-pointer flex items-center">
            <HelpCircle className="h-4 w-4 mr-1" />
            <span className="ml-1">Ajuda</span>
          </button>
          
          <button className="px-3 py-1 text-gray-600 hover:text-gray-800 cursor-pointer flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            <span className="ml-1">Configurações</span>
          </button>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
          
          <div className="ml-4 flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.nome?.charAt(0) || "U"}
                </span>
              </div>
            </div>
            <span className="ml-2 text-gray-700">
              {user?.nome || "Usuário"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
