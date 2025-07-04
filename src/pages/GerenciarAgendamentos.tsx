
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
import { useIsMobile } from "@/hooks/use-mobile";

const GerenciarAgendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detalhesAgendamento, setDetalhesAgendamento] = useState<Agendamento | null>(null);
  const isMobile = useIsMobile();

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
      case "pendente":
        return { label: "Pendente", color: "bg-amber-100 text-amber-800" };
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

  // Mobile Card Component
  const AgendamentoCard = ({ agendamento }: { agendamento: Agendamento }) => {
    const tipo = getTipoAgendamento(agendamento.tipo);
    const status = getStatusAgendamento(agendamento.status);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="bg-fitness-primary/10 p-2 rounded-full mr-3">
              <User className="h-4 w-4 text-fitness-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">{agendamento.aluno_nome}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tipo.color} mt-1`}>
                {tipo.label}
              </span>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="mr-3">{formatarData(agendamento.data)}</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{agendamento.horario}</span>
        </div>

        <div className="flex gap-2">
          {(agendamento.status === "agendado" || agendamento.status === "pendente") && (
            <>
              <Button
                onClick={() => handleConcluirAgendamento(agendamento.id)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                <Check className="h-4 w-4 mr-1" />
                Concluir
              </Button>
              <Button
                onClick={() => handleCancelarAgendamento(agendamento.id)}
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex-1"
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            </>
          )}
          <Button
            onClick={() => handleVerDetalhes(agendamento)}
            size="sm"
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${isMobile ? 'p-4' : ''} h-full`}>
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'} mb-6`}>
        <div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>Agendamentos</h1>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Gerencie avaliações e consultas agendadas</p>
        </div>
        <div className={`flex gap-3 ${isMobile ? 'flex-col' : ''}`}>
          <Button
            onClick={carregarAgendamentos}
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
          <Link to="/novo-agendamento">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 w-full"
              size={isMobile ? "sm" : "default"}
            >
              <Plus className="h-4 w-4 mr-1" />
              Novo Agendamento
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : agendamentos.length > 0 ? (
        <>
          {isMobile ? (
            <div className="space-y-3">
              {agendamentos.map((agendamento) => (
                <AgendamentoCard key={agendamento.id} agendamento={agendamento} />
              ))}
            </div>
          ) : (
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
                              {agendamento.aluno_nome}
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
                            {agendamento.horario}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {(agendamento.status === "agendado" || agendamento.status === "pendente") && (
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
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white shadow-sm rounded-lg">
          <p className="text-gray-500">Nenhum agendamento encontrado.</p>
          <Link to="/novo-agendamento">
            <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-1" />
              Criar Novo Agendamento
            </Button>
          </Link>
        </div>
      )}

      {/* Modal de detalhes */}
      {detalhesAgendamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-lg ${isMobile ? 'w-full max-w-sm' : 'max-w-md w-full'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Detalhes do Agendamento</h3>
              <button onClick={fecharDetalhes} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Aluno</p>
                <p className="font-medium">{detalhesAgendamento.aluno_nome}</p>
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
                  <p className="font-medium">{detalhesAgendamento.horario}</p>
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
