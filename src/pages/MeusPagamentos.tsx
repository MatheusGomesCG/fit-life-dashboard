import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowDown, 
  ArrowUp, 
  Calendar,
  Receipt
} from "lucide-react";
import { buscarPagamentosPorAluno, Pagamento, enviarComprovantePagamento } from "@/services/pagamentosService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format, parseISO } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const MeusPagamentos: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "pendentes" | "pagos" | "atrasados">("todos");
  const [selectedPagamentoId, setSelectedPagamentoId] = useState<string | null>(null);

  useEffect(() => {
    const carregarPagamentos = async () => {
      try {
        setLoading(true);
        
        if (user?.id) {
          const pagamentosData = await buscarPagamentosPorAluno(user.id);
          setPagamentos(pagamentosData);
        }
      } catch (error) {
        console.error("Erro ao carregar pagamentos:", error);
        toast.error("Erro ao carregar seus pagamentos.");
      } finally {
        setLoading(false);
      }
    };

    carregarPagamentos();
  }, [user]);

  const pagamentosFiltrados = pagamentos.filter((pagamento) => {
    if (filtro === "todos") return true;
    if (filtro === "pendentes") return pagamento.status === "pendente";
    if (filtro === "pagos") return pagamento.status === "pago";
    if (filtro === "atrasados") return pagamento.status === "atrasado";
    return true;
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case "pago":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
            <CheckCircle className="h-3 w-3" />
            Pago
          </span>
        );
      case "pendente":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
            <Clock className="h-3 w-3" />
            Pendente
          </span>
        );
      case "atrasado":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
            <XCircle className="h-3 w-3" />
            Atrasado
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meus Pagamentos</h1>
        <p className="text-gray-600 mt-1">
          Visualize o histórico e status das suas mensalidades
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFiltro("todos")}
            className={`px-3 py-1 text-sm rounded-md ${
              filtro === "todos"
                ? "bg-fitness-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro("pendentes")}
            className={`px-3 py-1 text-sm rounded-md ${
              filtro === "pendentes"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFiltro("pagos")}
            className={`px-3 py-1 text-sm rounded-md ${
              filtro === "pagos"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pagos
          </button>
          <button
            onClick={() => setFiltro("atrasados")}
            className={`px-3 py-1 text-sm rounded-md ${
              filtro === "atrasados"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Atrasados
          </button>
        </div>

        {pagamentosFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Descrição</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Data</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Valor</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Comprovante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pagamentosFiltrados.map((pagamento) => (
                  <tr key={pagamento.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="bg-blue-100 p-2 rounded-full text-blue-700 mr-3">
                          <Receipt className="h-4 w-4" />
                        </span>
                        <span>{pagamento.descricao || "Mensalidade"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Vencimento</span>
                        <span>{format(parseISO(pagamento.dataVencimento), "dd/MM/yyyy")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      R$ {pagamento.valor.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {statusBadge(pagamento.status)}
                    </td>
                    {pagamento.status !== "pago" && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedPagamentoId(pagamento.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                        >
                          <span>Enviar comprovante</span>
                        </button>
                      </td>
                    )}
                    {pagamento.status === "pago" && pagamento.comprovante && (
                      <td className="px-4 py-3">
                        <a
                          href={pagamento.comprovante}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center gap-1"
                        >
                          <span>Ver comprovante</span>
                        </a>
                      </td>
                    )}
                    {pagamento.status === "pago" && !pagamento.comprovante && (
                      <td className="px-4 py-3">
                        <span className="text-gray-400 text-sm">Não necessário</span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum pagamento encontrado com o filtro selecionado.
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informações de Pagamento</h2>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="text-base font-medium mb-3">Formas de Pagamento</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <div className="bg-green-100 p-1.5 rounded-full mr-2">
                  <ArrowDown className="h-4 w-4 text-green-600" />
                </div>
                <span>PIX: (11) 99999-9999</span>
              </li>
              <li className="flex items-center">
                <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <span>Transferência Bancária: Banco FitLife - Ag: 0001 - CC: 12345-6</span>
              </li>
              <li className="flex items-center">
                <div className="bg-purple-100 p-1.5 rounded-full mr-2">
                  <ArrowUp className="h-4 w-4 text-purple-600" />
                </div>
                <span>Pagamento no local: Dinheiro ou Cartão</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="text-base font-medium mb-2">Observações</h3>
            <p className="text-gray-700 text-sm">
              Após realizar o pagamento, envie o comprovante para seu professor pelo chat ou WhatsApp.
              O pagamento será confirmado em até 24 horas úteis.
            </p>
          </div>
        </div>
      </div>
      {selectedPagamentoId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Enviar Comprovante de Pagamento</h3>
            <EnviarComprovante 
              pagamentoId={selectedPagamentoId}
              onSuccess={() => {
                setSelectedPagamentoId(null);
                carregarPagamentos();
              }}
            />
            <Button 
              variant="outline" 
              onClick={() => setSelectedPagamentoId(null)}
              className="mt-4 w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface EnviarComprovanteProps {
  pagamentoId: string;
  onSuccess?: () => void;
}

const EnviarComprovante: React.FC<EnviarComprovanteProps> = ({ pagamentoId, onSuccess }) => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*') && !file.type.match('application/pdf')) {
        toast.error("Por favor, selecione uma imagem ou um arquivo PDF.");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
        return;
      }
      
      setArquivo(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!arquivo) {
      toast.error("Por favor, selecione um arquivo para enviar.");
      return;
    }
    
    try {
      setIsUploading(true);
      await enviarComprovantePagamento(pagamentoId, arquivo);
      toast.success("Comprovante enviado com sucesso!");
      
      setArquivo(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao enviar comprovante:", error);
      toast.error("Erro ao enviar o comprovante. Por favor, tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="comprovante">Anexar Comprovante</Label>
        <div className="mt-1 flex items-center">
          <label 
            htmlFor="comprovante" 
            className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-4 w-4 text-gray-600" />
            <span>{arquivo ? arquivo.name : "Selecionar arquivo"}</span>
          </label>
          <Input
            id="comprovante"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Formatos aceitos: imagens (JPG, PNG) e PDF. Tamanho máximo: 5MB.
        </p>
      </div>
      <Button type="submit" disabled={!arquivo || isUploading} className="w-full">
        {isUploading ? "Enviando..." : "Enviar Comprovante"}
      </Button>
    </form>
  );
};

export default MeusPagamentos;
