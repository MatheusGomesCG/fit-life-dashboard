
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Agendamento } from "@/services/agendamentosService";

interface AtividadesRecentesProps {
  agendamentosSemana: Agendamento[];
  isLoading: boolean;
}

const AtividadesRecentes: React.FC<AtividadesRecentesProps> = ({
  agendamentosSemana,
  isLoading
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Atividades Recentes</h3>
        <Link to="/gerenciar-agendamentos" className="text-xs text-orange-500 hover:text-orange-600 cursor-pointer">
          Ver todas
        </Link>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse h-14 bg-gray-100 rounded"></div>
          ))}
        </div>
      ) : agendamentosSemana.length > 0 ? (
        <div className="space-y-4">
          {agendamentosSemana.slice(0, 5).map((agendamento) => (
            <div key={agendamento.id} className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">{agendamento.aluno_nome}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{format(new Date(agendamento.data), "dd/MM/yyyy")}</span>
                  <Clock className="h-3 w-3 ml-2 mr-1" />
                  <span>{agendamento.hora}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
              <Calendar className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Sistema funcionando perfeitamente</p>
              <p className="text-xs text-gray-500">Hoje, {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtividadesRecentes;
