
import React from "react";
import { format, parseISO } from "date-fns";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Receipt
} from "lucide-react";
import { Pagamento } from "@/services/pagamentosService";

interface TabelaPagamentosProps {
  pagamentos: Pagamento[];
  onEnviarComprovante: (pagamentoId: string) => void;
}

const TabelaPagamentos: React.FC<TabelaPagamentosProps> = ({ pagamentos, onEnviarComprovante }) => {
  
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

  if (pagamentos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum pagamento encontrado com o filtro selecionado.
      </div>
    );
  }

  return (
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
          {pagamentos.map((pagamento) => (
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
                    onClick={() => onEnviarComprovante(pagamento.id!)}
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
  );
};

export default TabelaPagamentos;
