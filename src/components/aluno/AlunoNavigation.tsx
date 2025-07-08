
import React, { useState } from "react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  MessageSquare,
  Activity,
  TrendingUp,
  User,
  Menu,
  Home
} from "lucide-react";

const AlunoNavigation: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

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

  // Itens para navegação mobile (barra inferior)
  const mobileNavItems = [
    { path: "/dashboard", icon: Home, label: "Início" },
    { path: "/meus-treinos", icon: FileText, label: "Treinos" },
    { path: "/minhas-medidas", icon: TrendingUp, label: "Medidas" },
    { path: "/meus-pagamentos", icon: DollarSign, label: "Pagamentos" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== "/dashboard" && location.pathname.startsWith(href));
  };

  // Renderização mobile
  if (isMobile) {
    return (
      <>
        {/* Header mobile */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-semibold text-gray-900">GymCloud</h1>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  <h2 className="text-lg font-semibold mb-4">Menu do Aluno</h2>
                  
                  {navigationItems.map((category) => (
                    <div key={category.title} className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {category.title}
                      </h3>
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.title}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                              isActive(item.href) 
                                ? "bg-orange-100 text-orange-600" 
                                : "hover:bg-gray-100"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-gray-500">{item.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                        isActive("/dashboard") 
                          ? "bg-orange-100 text-orange-600" 
                          : "hover:bg-gray-100"
                      )}
                    >
                      <Activity className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Dashboard</div>
                        <div className="text-sm text-gray-500">Visão geral dos seus dados</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Barra de navegação inferior */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-around py-1">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const itemIsActive = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors min-w-0 ${
                    itemIsActive 
                      ? "text-orange-500" 
                      : "text-gray-500 hover:text-orange-500"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${
                    itemIsActive ? "bg-orange-500 text-white" : ""
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs mt-0.5 font-medium truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // Renderização desktop
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
