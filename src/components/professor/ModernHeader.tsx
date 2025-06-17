
import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ModernHeader: React.FC = () => {
  const { user, logout } = useAuth();

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
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={user?.profile?.foto_url || user?.foto_url} 
              alt={professorName}
            />
            <AvatarFallback className="bg-orange-500 text-white font-semibold">
              {getInitials(professorName)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold text-gray-800">
            {professorName}
          </h2>
        </div>
        
        <div className="flex items-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
