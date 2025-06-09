
import React from "react";
import { Link } from "react-router-dom";
import { Activity, Users, FileText, DollarSign, Calendar, BarChart3 } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-primary/10 to-fitness-secondary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Activity className="h-16 w-16 text-fitness-primary" />
          </div>
          <h1 className="text-5xl font-bold text-fitness-dark mb-6">
            GymCloud
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistema completo de gerenciamento para professores de educação física. 
            Gerencie alunos, treinos, pagamentos e agendamentos em uma única plataforma.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 bg-fitness-primary text-white font-semibold rounded-lg hover:bg-fitness-primary/90 transition-colors"
          >
            <Activity className="h-5 w-5 mr-2" />
            Acessar Sistema
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold ml-3">Gestão de Alunos</h3>
            </div>
            <p className="text-gray-600">
              Cadastre e gerencie todos os seus alunos com informações completas, 
              histórico de evolução e dados antropométricos.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold ml-3">Fichas de Treino</h3>
            </div>
            <p className="text-gray-600">
              Crie fichas de treino personalizadas com exercícios detalhados, 
              cargas e estratégias específicas para cada aluno.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold ml-3">Controle Financeiro</h3>
            </div>
            <p className="text-gray-600">
              Gerencie mensalidades, pagamentos e tenha controle total 
              sobre a parte financeira do seu negócio.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold ml-3">Agendamentos</h3>
            </div>
            <p className="text-gray-600">
              Organize sua agenda com avaliações físicas e consultas, 
              mantendo tudo sob controle.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold ml-3">Relatórios</h3>
            </div>
            <p className="text-gray-600">
              Visualize relatórios detalhados sobre evolução dos alunos, 
              receitas e performance do seu negócio.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold ml-3">Acompanhamento</h3>
            </div>
            <p className="text-gray-600">
              Monitore o progresso dos seus alunos com medidas, fotos 
              e evolução física detalhada.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-fitness-dark mb-4">
            Pronto para revolucionar seu trabalho?
          </h2>
          <p className="text-gray-600 mb-6">
            Simplifique a gestão dos seus alunos e foque no que realmente importa: 
            resultados excepcionais.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 bg-fitness-primary text-white font-semibold rounded-lg hover:bg-fitness-primary/90 transition-colors"
          >
            Começar Agora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
