
import React from "react";
import { Link } from "react-router-dom";
import { Activity, Users, User, Clock } from "lucide-react";
import { AuthUser } from "@/types/auth";

interface HeroSectionProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated, user }) => {
  return (
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
            {isAuthenticated ? (
              <Link 
                to={user?.tipo === "professor" ? "/dashboard-professor" : "/dashboard"} 
                className="bg-fitness-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-fitness-primary/90 transition-colors inline-flex items-center justify-center"
              >
                <Activity className="mr-2 h-5 w-5" />
                Ir para Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login?tipo=professor" className="bg-fitness-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-fitness-primary/90 transition-colors inline-flex items-center justify-center">
                  <Users className="mr-2 h-5 w-5" />
                  Começar como Professor
                </Link>
                <Link to="/login?tipo=aluno" className="bg-white text-fitness-primary border-2 border-fitness-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-fitness-primary hover:text-white transition-colors inline-flex items-center justify-center">
                  <User className="mr-2 h-5 w-5" />
                  Entrar como Aluno
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
