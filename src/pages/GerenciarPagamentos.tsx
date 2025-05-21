
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  Pagamento, 
  listarPagamentos, 
  atualizarPagamento,
  buscarPagamentosPorAluno 
} from "@/services/pagamentosService";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  PlusCircle, 
  Edit, 
  DollarSign,
  FileText,
  History
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import HistoricoPagamentosAluno from "@/components/pagamentos/HistoricoPagamentosAluno";

const GerenciarPagamentos: React.FC = () => {
  const navigate = useNavigate();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [filtro, setFiltro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);
  const [selectedAlunoNome, setSelectedAlunoNome] = useState<string>("");
  const [historicoPagamentosDialogOpen, setHistoricoPagamentosDialogOpen] = useState(false);

  useEffect(() => {
    carregarPagamentos();
  }, []);

  const carregarPagamentos = async () => {
    try {
      setIsLoading(true);
      const data = await listarPagamentos();
      setPagamentos(data);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      toast.error("Erro ao carregar pagamentos.");
    } finally {
      setIsLoading(false);
    }
  };

  const registrarPagamento = async (id: string) => {
    try {
      const dataAtual = new Date().toISOString().split("T")[0];
      await atualizarPagamento(id, {
        dataPagamento: dataAtual,
        status: "pago"
      });
      toast.success("Pagamento registrado com sucesso!");
      carregarPagamentos();
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast.error("Erro ao registrar pagamento.");
    }
  };

  const visualizarHistoricoPagamentosAluno = (alunoId: string, alunoNome: string) => {
    setSelectedAlunoId(alunoId);
    setSelectedAlunoNome(alunoNome);
    setHistoricoPagamentosDialogOpen(true);
  };

  const getStatusIcon = (status: Pagamento["status"]) => {
    switch (status) {
      case "pago":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pendente":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "atrasado":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const pagamentosFiltrados = pagamentos.filter(
    (pagamento) =>
      pagamento.alunoNome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Pagamentos</h1>
          <p className="text-gray-600 mt-1">
            Registre e acompanhe os pagamentos dos alunos
          </p>
        </div>

        <button
          onClick={() => navigate("/cadastrar-pagamento")}
          className="flex items-center gap-2 px-4 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Novo Pagamento</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
        <div className="mb-4 flex items-center relative">
          <Search className="h-5 w-5 absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome do aluno..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fitness-primary"
          />
        </div>

        {isLoading ? (
          <p className="text-center py-8 text-gray-500">Carregando pagamentos...</p>
        ) : pagamentosFiltrados.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            Nenhum pagamento encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mês/Ano</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Comprovante</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagamentosFiltrados.map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell className="font-medium">
                      <button 
                        onClick={() => visualizarHistoricoPagamentosAluno(pagamento.alunoId, pagamento.alunoNome)}
                        className="text-left text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {pagamento.alunoNome}
                        <History className="h-4 w-4" />
                      </button>
                    </TableCell>
                    <TableCell>R$ {pagamento.valor.toFixed(2)}</TableCell>
                    <TableCell>
                      {format(parseISO(pagamento.dataVencimento), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(pagamento.status)}
                        <span
                          className={`capitalize ${
                            pagamento.status === "pago" 
                              ? "text-green-600" 
                              : pagamento.status === "pendente"
                                ? "text-amber-600"
                                : "text-red-600"
                          }`}
                        >
                          {pagamento.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {pagamento.mes}/{pagamento.ano}
                    </TableCell>
                    <TableCell>
                      {pagamento.dataPagamento ? (
                        format(parseISO(pagamento.dataPagamento), "dd/MM/yyyy")
                      ) : (
                        "Não pago"
                      )}
                    </TableCell>
                    <TableCell>
                      {pagamento.comprovante ? (
                        <a 
                          href={pagamento.comprovante} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Ver</span>
                        </a>
                      ) : (
                        <span className="text-gray-400">Não enviado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {pagamento.status !== "pago" && (
                          <button
                            onClick={() => registrarPagamento(pagamento.id!)}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Registrar pagamento"
                          >
                            <DollarSign className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/editar-pagamento/${pagamento.id}`)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Editar pagamento"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog 
        open={historicoPagamentosDialogOpen} 
        onOpenChange={setHistoricoPagamentosDialogOpen}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Histórico de Pagamentos - {selectedAlunoNome}</DialogTitle>
          </DialogHeader>
          {selectedAlunoId && (
            <HistoricoPagamentosAluno alunoId={selectedAlunoId} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarPagamentos;
