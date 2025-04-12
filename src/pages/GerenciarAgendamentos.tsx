
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, FileText, Check, X, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { 
  listarAgendamentos, 
  formatarData, 
  Agendamento 
} from "@/services/agendamentosService";
import LoadingSpinner from "@/components/LoadingSpinner";

const GerenciarAgendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      setIsLoading(true);
      const data = await listarAgendamentos();
      setAgendamentos(data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      toast.error("Falha ao carregar os agendamentos.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTipoAgendamento = (tipo: string) => {
    switch (tipo) {
      case "avaliacao":
        return { label: "Avaliação Física", color: "bg-purple-100 text-purple-800" };
      case "consulta":
        return { label: "Consulta", color: "bg-blue-100 text-blue-800" };
      default:
        return { label: "Outro", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getStatusAgendamento = (status: string) => {
    switch (status) {
      case "agendado":
        return { label: "Agendado", color: "bg-amber-100 text-amber-800" };
      case "concluido":
        return { label: "Concluído", color: "bg-green-100 text-green-800" };
      case "cancelado":
        return { label: "Cancelado", color: "bg-red-100 text-red-800" };
      default:
        return { label: "Desconhecido", color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600">Gerencie avaliações e consultas agendadas</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={carregarAgendamentos}
            className="flex items-center px-3 py-2 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <RefreshCw size={16} className="mr-1" />
            <span>Atualizar</span>
          </button>
          <Link
            to="/novo-agendamento"
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Plus size={16} className="mr-1" />
            <span>Novo Agendamento</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : agendamentos.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data e Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agendamentos.map((agendamento) => {
                const tipo = getTipoAgendamento(agendamento.tipo);
                const status = getStatusAgendamento(agendamento.status);

                return (
                  <tr key={agendamento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={18} className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {agendamento.alunoNome}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${tipo.color}`}>
                        {tipo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-1" />
                        {formatarData(agendamento.data)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock size={16} className="text-gray-400 mr-1" />
                        {agendamento.hora}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {agendamento.status === "agendado" && (
                        <>
                          <button
                            title="Marcar como concluído"
                            className="text-green-600 hover:text-green-900"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            title="Cancelar agendamento"
                            className="text-red-600 hover:text-red-900"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button
                        title="Ver detalhes"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white shadow-sm rounded-lg">
          <p className="text-gray-500">Nenhum agendamento encontrado.</p>
          <Link
            to="/novo-agendamento"
            className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Plus size={16} className="mr-1" />
            <span>Criar Novo Agendamento</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GerenciarAgendamentos;
