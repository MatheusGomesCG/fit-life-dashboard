
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
  FileText, 
  DollarSign, 
  Calendar, 
  MessageSquare,
  Activity,
  TrendingUp,
  User
} from "lucide-react";

const AlunoNavigation: React.FC = () => {
  const location = useLocation();

  const navigationItems = [
    {
      title: "Meus Dados",
      items: [
        {
          title: "Meus Treinos",
          href: "/meus-treinos",
          description: "Visualize seu plano de treinamento atualizado",
          icon: FileText
        },
        {
          title: "Minhas Medidas",
          href: "/minhas-medidas",
          description: "Acompanhe sua evolução física e resultados",
          icon: TrendingUp
        }
      ]
    },
    {
      title: "Financeiro",
      items: [
        {
          title: "Meus Pagamentos",
          href: "/meus-pagamentos",
          description: "Verifique suas mensalidades e status de pagamento",
          icon: DollarSign
        }
      ]
    },
    {
      title: "Serviços",
      items: [
        {
          title: "Agendamento",
          href: "/agendamento",
          description: "Agende avaliações e consultas com seu professor",
          icon: Calendar
        },
        {
          title: "Chat de Suporte",
          href: "/chat",
          description: "Tire dúvidas sobre seus treinos e exercícios",
          icon: MessageSquare
        }
      ]
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== "/dashboard" && location.pathname.startsWith(href));
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
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
            
            {/* Link direto para Dashboard */}
            <NavigationMenuItem>
              <Link to="/dashboard">
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/dashboard") && "bg-accent text-accent-foreground"
                  )}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default AlunoNavigation;
