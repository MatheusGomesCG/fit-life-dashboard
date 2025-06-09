
import React from "react";
import { Link } from "react-router-dom";
import { Activity, Users, ArrowRight } from "lucide-react";
import { AuthUser } from "@/types/auth";

interface CTASectionProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const CTASection: React.FC<CTASectionProps> = ({ isAuthenticated, user }) => {
  return (
    <section className="py-20 bg-gradient-to-r from-fitness-primary to-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Pronto para transformar seu negócio?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Junte-se a centenas de professores que já estão usando o FitLife para crescer seus negócios.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link 
              to={user?.tipo === "professor" ? "/dashboard-professor" : "/dashboard"} 
              className="bg-white text-fitness-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <Activity className="mr-2 h-5 w-5" />
              Acessar Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <Link to="/login?tipo=professor" className="bg-white text-fitness-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
              <Users className="mr-2 h-5 w-5" />
              Começar teste grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
        
        <p className="text-sm mt-4 opacity-75">
          {isAuthenticated ? "Acesse todas as funcionalidades do sistema" : "Sem cartão de crédito • Cancele a qualquer momento"}
        </p>
      </div>
    </section>
  );
};

export default CTASection;
