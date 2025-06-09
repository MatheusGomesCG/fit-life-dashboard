
import React from "react";
import { Activity } from "lucide-react";

const Footer: React.FC = () => {
  return (
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
  );
};

export default Footer;
