
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { 
  Users, 
  UserPlus, 
  CreditCard,
  Activity,
  BarChart3,
  Receipt,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigationItems = [
    {
      title: "Professores",
      items: [
        {
          title: "Gerenciar Professores",
          href: "/admin/professores",
          description: "Visualizar e gerenciar todos os professores",
          icon: Users
        },
        {
          title: "Cadastrar Professor",
          href: "/admin/cadastrar-professor",
          description: "Registrar novos professores no sistema",
          icon: UserPlus
        }
      ]
    },
    {
      title: "Financeiro",
      items: [
        {
          title: "Dashboard Avançado",
          href: "/admin/dashboard",
          description: "Métricas detalhadas e gráficos de crescimento",
          icon: BarChart3
        },
        {
          title: "Gestão de Transações",
          href: "/admin/transacoes",
          description: "Gerenciar pagamentos e transações",
          icon: Receipt
        },
        {
          title: "Planos dos Professores",
          href: "/admin/planos",
          description: "Visualizar e gerenciar planos dos professores",
          icon: CreditCard
        },
        {
          title: "Relatórios Financeiros",
          href: "/admin/relatorios",
          description: "Gerar e exportar relatórios detalhados",
          icon: Receipt
        }
      ]
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== "/dashboard-admin" && location.pathname.startsWith(href));
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 [AdminNavigation] Iniciando logout...");
      await logout();
    } catch (error) {
      console.error("❌ [AdminNavigation] Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <NavigationMenu className="mx-auto">
            <NavigationMenuList className="flex-wrap justify-center">
              {navigationItems.map((category) => (
                <NavigationMenuItem key={category.title}>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    {category.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  isActive(item.href) && "bg-accent text-accent-foreground"
                                )}
                              >
                                <div className="flex items-center space-x-2">
                                  <Icon className="h-4 w-4" />
                                  <div className="text-sm font-medium leading-none">
                                    {item.title}
                                  </div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              
              {/* Link direto para Dashboard Administrativo */}
              <NavigationMenuItem>
                <Link to="/dashboard-admin">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/dashboard-admin") && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Home Admin
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Botão de Logout */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="ml-4"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
