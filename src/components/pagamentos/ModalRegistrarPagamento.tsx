
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { cadastrarPagamento, enviarComprovantePagamento } from "@/services/pagamentosService";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { X, Upload } from "lucide-react";

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
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificando se o arquivo é uma imagem ou PDF
      if (!file.type.match('image.*') && !file.type.match('application/pdf')) {
        toast.error("Por favor, selecione uma imagem ou um arquivo PDF.");
        return;
      }
      
      // Verificando tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
        return;
      }
      
      setComprovante(file);
    }
  };

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

      // Registrar o pagamento
      const novoPagamento = await cadastrarPagamento({
        aluno_id: user.id,
        aluno_nome: user.nome || "Aluno",
        valor: valorNum,
        data_vencimento: format(dataVencimento, "yyyy-MM-dd"),
        data_pagamento: dataPagamento ? format(dataPagamento, "yyyy-MM-dd") : undefined,
        mes,
        ano,
        status: dataPagamento ? "pago" : "pendente",
        observacao,
        metodo_pagamento: metodoPagamento
      });

      // Se há um comprovante, enviar também
      if (comprovante && novoPagamento.id) {
        await enviarComprovantePagamento(novoPagamento.id, comprovante);
        toast.success("Pagamento registrado e comprovante enviado com sucesso!");
      } else {
        toast.success("Pagamento registrado com sucesso!");
      }

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

          <div>
            <Label htmlFor="comprovante">Anexar Comprovante (opcional)</Label>
            <div className="mt-1 flex items-center">
              <label 
                htmlFor="comprovante" 
                className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full"
              >
                <Upload className="h-4 w-4 text-gray-600" />
                <span className="text-sm">
                  {comprovante ? comprovante.name : "Selecionar arquivo"}
                </span>
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
