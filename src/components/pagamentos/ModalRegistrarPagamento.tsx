
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { cadastrarPagamento } from "@/services/pagamentosService";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { X } from "lucide-react";

interface ModalRegistrarPagamentoProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ModalRegistrarPagamento: React.FC<ModalRegistrarPagamentoProps> = ({
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [valor, setValor] = useState("");
  const [dataVencimento, setDataVencimento] = useState<Date | null>(null);
  const [dataPagamento, setDataPagamento] = useState<Date | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [observacao, setObservacao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    if (!dataVencimento) {
      toast.error("Selecione a data de vencimento");
      return;
    }

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    try {
      setIsSubmitting(true);

      const mes = dataVencimento.getMonth() + 1;
      const ano = dataVencimento.getFullYear();

      await cadastrarPagamento({
        alunoId: user.id,
        alunoNome: user.nome || "Aluno",
        valor: valorNum,
        dataVencimento: format(dataVencimento, "yyyy-MM-dd"),
        dataPagamento: dataPagamento ? format(dataPagamento, "yyyy-MM-dd") : undefined,
        mes,
        ano,
        observacao,
        metodoPagamento
      });

      toast.success("Pagamento registrado com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast.error("Erro ao registrar pagamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Registrar Pagamento</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              type="number"
              id="valor"
              step="0.01"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="dataVencimento">Data de Vencimento</Label>
            <DatePicker
              selected={dataVencimento}
              onSelect={setDataVencimento}
              placeholder="Selecione a data de vencimento"
            />
          </div>

          <div>
            <Label htmlFor="dataPagamento">Data de Pagamento (opcional)</Label>
            <DatePicker
              selected={dataPagamento}
              onSelect={setDataPagamento}
              placeholder="Selecione a data de pagamento"
            />
          </div>

          <div>
            <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
            <Select onValueChange={setMetodoPagamento}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                <SelectItem value="boleto">Boleto Bancário</SelectItem>
                <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="observacao">Observação</Label>
            <Input
              type="text"
              id="observacao"
              placeholder="Observações adicionais"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegistrarPagamento;
