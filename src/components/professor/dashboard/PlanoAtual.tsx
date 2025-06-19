
import React from "react";
import { format } from "date-fns";
import { ProfessorPlano } from "@/services/professorService";

interface PlanoAtualProps {
  plano: ProfessorPlano | null;
  totalAlunos: number;
}

const PlanoAtual: React.FC<PlanoAtualProps> = ({ plano, totalAlunos }) => {
  if (!plano) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Plano Atual</h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          plano.status === 'ativo' 
            ? 'bg-green-100 text-green-600' 
            : 'bg-yellow-100 text-yellow-600'
        }`}>
          {plano.status.charAt(0).toUpperCase() + plano.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Tipo do plano</span>
          <span className="text-sm font-medium">
            {plano.tipo_plano === "100+" ? "Premium" : `${plano.tipo_plano} alunos`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Limite de alunos</span>
          <span className="text-sm font-medium">
            {totalAlunos} / {plano.limite_alunos === -1 ? "Ilimitado" : plano.limite_alunos}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Valor mensal</span>
          <span className="text-sm font-medium text-green-500">
            R$ {plano.preco_mensal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Vencimento</span>
          <span className="text-sm font-medium">
            {format(new Date(plano.data_vencimento), "dd/MM/yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlanoAtual;
