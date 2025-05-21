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
import { buscarPagamentosPorAluno, Pagamento } from "@/services/pagamentosService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format, parseISO } from "date-fns";

const MeusPagamentos: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "pendentes" | "pagos" | "atrasados">("todos");

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
    </div>
  );
};

export default MeusPagamentos;
