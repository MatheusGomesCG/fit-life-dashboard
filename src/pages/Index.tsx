
import React from "react";
import { Link } from "react-router-dom";
import { User, Users, ArrowRight, Activity, CheckCircle, Star, Calendar, BarChart3, Shield, Clock, Trophy, FileText } from "lucide-react";

const Index: React.FC = () => {
  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Activity className="h-16 w-16 text-fitness-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
              <span className="text-fitness-primary">GymCloud</span>
              <br />
              Sistema de Avaliação Física
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A plataforma completa para professores de educação física gerenciarem alunos, 
              treinos e acompanharem o progresso físico de forma profissional.
            </p>
            
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold inline-block mb-8">
              🎉 7 dias de teste GRATUITO para todos os planos!
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login?tipo=professor" className="bg-fitness-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-fitness-primary/90 transition-colors inline-flex items-center justify-center">
                <Users className="mr-2 h-5 w-5" />
                Começar como Professor
              </Link>
              <Link to="/login?tipo=aluno" className="bg-white text-fitness-primary border-2 border-fitness-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-fitness-primary hover:text-white transition-colors inline-flex items-center justify-center">
                <User className="mr-2 h-5 w-5" />
                Entrar como Aluno
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Alunos</h3>
              <p className="text-gray-600">Cadastre e organize todos os seus alunos com informações detalhadas e histórico completo.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fichas de Treino</h3>
              <p className="text-gray-600">Crie treinos personalizados e compartilhe com seus alunos de forma digital.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Acompanhamento</h3>
              <p className="text-gray-600">Monitore o progresso físico com gráficos e relatórios detalhados.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Agendamentos</h3>
              <p className="text-gray-600">Sistema completo de agendamento de avaliações e consultas.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pagamentos</h3>
              <p className="text-gray-600">Controle financeiro com gestão de mensalidades e relatórios.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Trophy className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resultados</h3>
              <p className="text-gray-600">Acompanhe a evolução dos seus alunos com fotos e medidas corporais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-fitness-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a centenas de professores que já estão usando o GymCloud para crescer seus negócios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login?tipo=professor" className="bg-white text-fitness-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
              <Users className="mr-2 h-5 w-5" />
              Começar teste grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <p className="text-sm mt-4 opacity-75">
            Sem cartão de crédito • Cancele a qualquer momento
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Activity className="h-8 w-8 text-fitness-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">GymCloud</h3>
            <p className="text-gray-400 mb-8">
              Sistema de Avaliação Física para Professores
            </p>
            
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400 text-sm">© 2025 GymCloud. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
