
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Pagamento, buscarPagamentosPorAluno } from "@/services/pagamentosService";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";

interface HistoricoPagamentosAlunoProps {
  alunoId: string;
}

const HistoricoPagamentosAluno: React.FC<HistoricoPagamentosAlunoProps> = ({ alunoId }) => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPagamentos = async () => {
      try {
        setLoading(true);
        const data = await buscarPagamentosPorAluno(alunoId);
        setPagamentos(data);
      } catch (error) {
        console.error("Erro ao carregar pagamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPagamentos();
  }, [alunoId]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Histórico de Pagamentos</h2>
      
      {pagamentos.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Nenhum pagamento encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Comprovante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagamentos.map((pagamento) => (
                <TableRow key={pagamento.id}>
                  <TableCell>{pagamento.descricao || `Mensalidade ${pagamento.mes}/${pagamento.ano}`}</TableCell>
                  <TableCell>R$ {pagamento.valor.toFixed(2)}</TableCell>
                  <TableCell>{format(parseISO(pagamento.data_vencimento), "dd/MM/yyyy")}</TableCell>
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
                    {pagamento.data_pagamento ? (
                      format(parseISO(pagamento.data_pagamento), "dd/MM/yyyy")
                    ) : (
                      "Não pago"
                    )}
                  </TableCell>
                  <TableCell>
                    {pagamento.comprovante_url ? (
                      <a 
                        href={pagamento.comprovante_url} 
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default HistoricoPagamentosAluno;
