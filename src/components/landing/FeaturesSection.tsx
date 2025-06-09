
import React from "react";
import { Users, FileText, BarChart3, Calendar, Shield, Trophy } from "lucide-react";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Gestão de Alunos",
      description: "Cadastre e organize todos os seus alunos com informações detalhadas e histórico completo.",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: FileText,
      title: "Fichas de Treino",
      description: "Crie treinos personalizados e compartilhe com seus alunos de forma digital.",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: BarChart3,
      title: "Acompanhamento",
      description: "Monitore o progresso físico com gráficos e relatórios detalhados.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Calendar,
      title: "Agendamentos",
      description: "Sistema completo de agendamento de avaliações e consultas.",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    {
      icon: Shield,
      title: "Pagamentos",
      description: "Controle financeiro com gestão de mensalidades e relatórios.",
      bgColor: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: Trophy,
      title: "Resultados",
      description: "Acompanhe a evolução dos seus alunos com fotos e medidas corporais.",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tudo que você precisa em uma plataforma
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie seus alunos, crie treinos personalizados e acompanhe resultados de forma simples e eficiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className={`${feature.bgColor} rounded-full p-4 w-16 h-16 mx-auto mb-4`}>
                <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
