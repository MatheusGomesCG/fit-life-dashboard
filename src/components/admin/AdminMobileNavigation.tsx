
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  CreditCard,
  Activity,
  BarChart3,
  Receipt,
  LogOut,
  Home
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminMobileNavigation: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== "/dashboard-admin" && location.pathname.startsWith(href));
  };

  const navigationItems = [
    { path: "/dashboard-admin", icon: Home, label: "Início" },
    { path: "/admin/professores", icon: Users, label: "Professores" },
    { path: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/admin/transacoes", icon: Receipt, label: "Transações" },
    { path: "/admin/planos", icon: CreditCard, label: "Planos" },
  ];

  const handleLogout = async () => {
    try {
      console.log("🚪 [AdminMobileNavigation] Iniciando logout...");
      await logout();
    } catch (error) {
      console.error("❌ [AdminMobileNavigation] Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const itemIsActive = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors min-w-0 ${
                itemIsActive 
                  ? "text-blue-600" 
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <div className={`p-1.5 rounded-lg ${
                itemIsActive ? "bg-blue-100" : ""
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs mt-0.5 font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Botão de logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors text-red-500 hover:text-red-600"
        >
          <div className="p-1.5 rounded-lg">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="text-xs mt-0.5 font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default AdminMobileNavigation;
