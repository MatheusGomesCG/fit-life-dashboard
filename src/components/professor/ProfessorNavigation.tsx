
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
  FileText, 
  DollarSign, 
  Calendar, 
  MessageSquare,
  Camera,
  Activity,
  BookOpen,
  CreditCard,
  CalendarPlus,
  Settings,
  BarChart3
} from "lucide-react";

const ProfessorNavigation: React.FC = () => {
  const location = useLocation();

  const navigationItems = [
    {
      title: "Alunos",
      items: [
        {
          title: "Gerenciar Alunos",
          href: "/gerenciar-alunos",
          description: "Visualize e gerencie todos os seus alunos cadastrados",
          icon: Users
        },
        {
          title: "Cadastrar Novo Aluno",
          href: "/cadastrar-aluno",
          description: "Adicione um novo aluno ao seu sistema",
          icon: UserPlus
        },
        {
          title: "Listar Alunos",
          href: "/listar-alunos",
          description: "Lista completa de todos os alunos",
          icon: BarChart3
        }
      ]
    },
    {
      title: "Treinos",
      items: [
        {
          title: "Gerenciar Fichas",
          href: "/gerenciar-ficha-treino",
          description: "Gerencie todas as fichas de treino dos alunos",
          icon: FileText
        },
        {
          title: "Cadastrar Treino",
          href: "/cadastrar-treino",
          description: "Crie uma nova ficha de treino personalizada",
          icon: BookOpen
        }
      ]
    },
    {
      title: "Financeiro",
      items: [
        {
          title: "Gerenciar Pagamentos",
          href: "/gerenciar-pagamentos",
          description: "Controle os pagamentos e mensalidades dos alunos",
          icon: DollarSign
        },
        {
          title: "Cadastrar Pagamento",
          href: "/cadastrar-pagamento",
          description: "Registre um novo pagamento ou mensalidade",
          icon: CreditCard
        }
      ]
    },
    {
      title: "Agendamentos",
      items: [
        {
          title: "Gerenciar Agendamentos",
          href: "/gerenciar-agendamentos",
          description: "Visualize e organize seus agendamentos",
          icon: Calendar
        },
        {
          title: "Novo Agendamento",
          href: "/novo-agendamento",
          description: "Agende uma nova consulta ou avaliação",
          icon: CalendarPlus
        }
      ]
    },
    {
      title: "Comunicação",
      items: [
        {
          title: "Chat com Alunos",
          href: "/chat-professor",
          description: "Converse com seus alunos em tempo real",
          icon: MessageSquare
        },
        {
          title: "Feed",
          href: "/feed",
          description: "Compartilhe dicas e acompanhe o progresso dos alunos",
          icon: Camera
        }
      ]
    },
    {
      title: "Exercícios",
      items: [
        {
          title: "Exercícios Cadastrados",
          href: "/exercicios-cadastrados",
          description: "Gerencie seus exercícios personalizados",
          icon: BookOpen
        }
      ]
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== "/dashboard-professor" && location.pathname.startsWith(href));
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
              <Link to="/dashboard-professor">
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/dashboard-professor") && "bg-accent text-accent-foreground"
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

export default ProfessorNavigation;
