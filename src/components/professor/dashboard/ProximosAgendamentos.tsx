
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Agendamento } from "@/services/agendamentosService";

interface ProximosAgendamentosProps {
  agendamentosSemana: Agendamento[];
  isLoading: boolean;
}

const ProximosAgendamentos: React.FC<ProximosAgendamentosProps> = ({
  agendamentosSemana,
  isLoading
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Próximos Agendamentos</h3>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-14 bg-gray-100 rounded"></div>
          ))}
        </div>
      ) : agendamentosSemana.length > 0 ? (
        <div className="space-y-3">
          {agendamentosSemana.slice(0, 6).map((agendamento) => (
            <div key={agendamento.id} className="border-b border-gray-100 pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{agendamento.aluno_nome}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{format(new Date(agendamento.data), "dd/MM")}</span>
                    <Clock className="h-4 w-4 ml-2 mr-1 text-gray-400" />
                    <span>{agendamento.hora}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  agendamento.tipo === 'avaliacao' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {agendamento.tipo === 'avaliacao' ? 'Avaliação' : 'Consulta'}
                </span>
              </div>
            </div>
          ))}
          
          <Link to="/gerenciar-agendamentos" className="flex items-center text-orange-500 font-medium pt-2">
            <span>Ver todos os agendamentos</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Não há agendamentos esta semana.</p>
      )}
    </div>
  );
};

export default ProximosAgendamentos;
