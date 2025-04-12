
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, FileText, Check, X, Plus, RefreshCw, Info } from "lucide-react";
import { toast } from "sonner";
import { 
  listarAgendamentos, 
  formatarData, 
  Agendamento,
  atualizarAgendamento 
} from "@/services/agendamentosService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const GerenciarAgendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detalhesAgendamento, setDetalhesAgendamento] = useState<Agendamento | null>(null);

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

  const handleConcluirAgendamento = async (id: string) => {
    try {
      await atualizarAgendamento(id, { status: "concluido" });
      toast.success("Agendamento concluído com sucesso!");
      carregarAgendamentos();
    } catch (error) {
      console.error("Erro ao concluir agendamento:", error);
      toast.error("Falha ao concluir agendamento.");
    }
  };

  const handleCancelarAgendamento = async (id: string) => {
    try {
      await atualizarAgendamento(id, { status: "cancelado" });
      toast.success("Agendamento cancelado com sucesso!");
      carregarAgendamentos();
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      toast.error("Falha ao cancelar agendamento.");
    }
  };

  const handleVerDetalhes = (agendamento: Agendamento) => {
    setDetalhesAgendamento(agendamento);
  };

  const fecharDetalhes = () => {
    setDetalhesAgendamento(null);
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agendamentos.map((agendamento) => {
                const tipo = getTipoAgendamento(agendamento.tipo);
                const status = getStatusAgendamento(agendamento.status);

                return (
                  <TableRow key={agendamento.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        <User size={18} className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {agendamento.alunoNome}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${tipo.color}`}>
                        {tipo.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-1" />
                        {formatarData(agendamento.data)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock size={16} className="text-gray-400 mr-1" />
                        {agendamento.hora}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {agendamento.status === "agendado" && (
                        <>
                          <button
                            title="Marcar como concluído"
                            className="text-green-600 hover:text-green-900 p-1"
                            onClick={() => handleConcluirAgendamento(agendamento.id)}
                          >
                            <Check size={18} />
                          </button>
                          <button
                            title="Cancelar agendamento"
                            className="text-red-600 hover:text-red-900 p-1"
                            onClick={() => handleCancelarAgendamento(agendamento.id)}
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button
                        title="Ver detalhes"
                        className="text-blue-600 hover:text-blue-900 p-1"
                        onClick={() => handleVerDetalhes(agendamento)}
                      >
                        <Info size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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

      {/* Modal de detalhes */}
      {detalhesAgendamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Detalhes do Agendamento</h3>
              <button onClick={fecharDetalhes} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Aluno</p>
                <p className="font-medium">{detalhesAgendamento.alunoNome}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">
                    {getTipoAgendamento(detalhesAgendamento.tipo).label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">
                    {getStatusAgendamento(detalhesAgendamento.status).label}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-medium">{formatarData(detalhesAgendamento.data)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="font-medium">{detalhesAgendamento.hora}</p>
                </div>
              </div>
              {detalhesAgendamento.observacoes && (
                <div>
                  <p className="text-sm text-gray-500">Observações</p>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">
                    {detalhesAgendamento.observacoes}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={fecharDetalhes}>Fechar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciarAgendamentos;
