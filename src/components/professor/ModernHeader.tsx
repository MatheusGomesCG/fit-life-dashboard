
import React from "react";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

const ModernHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const professorName = user?.nome || user?.profile?.nome || "Professor";

  return (
    <header className="bg-white shadow-sm z-10 border-b">
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className="flex items-center space-x-3">
          {/* Espaço para o botão do menu mobile */}
          <div className="w-8 md:w-0"></div>
          
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage 
              src={user?.profile?.foto_url} 
              alt={professorName}
            />
            <AvatarFallback className="bg-orange-500 text-white font-semibold text-xs md:text-sm">
              {getInitials(professorName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-sm md:text-lg font-semibold text-gray-800">
              {isMobile ? professorName.split(' ')[0] : professorName}
            </h2>
            {isMobile && (
              <span className="text-xs text-gray-500">Professor</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            size={isMobile ? "sm" : "sm"}
            className="flex items-center gap-1 md:gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 text-xs md:text-sm"
          >
            <LogOut className="h-3 w-3 md:h-4 md:w-4" />
            {!isMobile && "Sair"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
