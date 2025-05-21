
import React from "react";
import { format, parseISO } from "date-fns";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagamento } from "@/services/pagamentosService";

interface TabelaPagamentosProps {
  pagamentos: Pagamento[];
  onEnviarComprovante?: (pagamentoId: string) => void;
}

const TabelaPagamentos: React.FC<TabelaPagamentosProps> = ({ 
  pagamentos,
  onEnviarComprovante
}) => {
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

  if (pagamentos.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        Nenhum pagamento encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comprovante</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagamentos.map((pagamento) => (
            <TableRow key={pagamento.id}>
              <TableCell>{pagamento.descricao || `Mensalidade ${pagamento.mes}/${pagamento.ano}`}</TableCell>
              <TableCell>R$ {pagamento.valor.toFixed(2)}</TableCell>
              <TableCell>{format(parseISO(pagamento.dataVencimento), "dd/MM/yyyy")}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getStatusIcon(pagamento.status)}
                  <span
                    className={`capitalize ${
                      pagamento.status === "pago" ? "text-green-600" : 
                      pagamento.status === "pendente" ? "text-amber-600" : 
                      "text-red-600"
                    }`}
                  >
                    {pagamento.status}
                  </span>
                </div>
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
                {onEnviarComprovante && (pagamento.status !== "pago") && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => onEnviarComprovante(pagamento.id!)}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Enviar Comprovante</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TabelaPagamentos;
