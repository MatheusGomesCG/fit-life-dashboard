
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { atualizarPagamento, buscarPagamentoPorId, Pagamento } from "@/services/pagamentosService";
import { DatePicker } from "@/components/date-picker";

const EditarPagamento: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pagamento, setPagamento] = useState<Pagamento | null>(null);
  const [valor, setValor] = useState("");
  const [dataVencimento, setDataVencimento] = useState<Date | null>(null);
  const [status, setStatus] = useState<Pagamento["status"]>("pendente");
  const [dataPagamento, setDataPagamento] = useState<Date | null>(null);
  const [observacao, setObservacao] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const carregarPagamento = async () => {
      if (id) {
        try {
          const data = await buscarPagamentoPorId(id);
          setPagamento(data);
          setValor(data.valor.toString());
          
          // Convert string dates to Date objects
          if (data.dataVencimento) {
            setDataVencimento(parseISO(data.dataVencimento));
          }
          
          if (data.dataPagamento) {
            setDataPagamento(parseISO(data.dataPagamento));
          }
          
          setStatus(data.status);
          setObservacao(data.observacao || "");
          setMetodoPagamento(data.metodoPagamento || "");
        } catch (error) {
          console.error("Erro ao carregar pagamento:", error);
          toast.error("Erro ao carregar dados do pagamento.");
        }
      }
    };

    carregarPagamento();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!pagamento) {
        toast.error("Dados do pagamento não encontrados.");
        return;
      }

      if (!dataVencimento) {
        toast.error("Selecione a data de vencimento.");
        return;
      }

      // Convert string value to number
      const valorNum = parseFloat(valor);

      await atualizarPagamento(id!, {
        valor: valorNum, // Converted to number
        dataVencimento: format(dataVencimento, "yyyy-MM-dd"),
        status,
        dataPagamento: dataPagamento ? format(dataPagamento, "yyyy-MM-dd") : undefined,
        observacao,
        metodoPagamento,
      });

      toast.success("Pagamento atualizado com sucesso!");
      navigate("/gerenciar-pagamentos");
    } catch (error) {
      console.error("Erro ao atualizar pagamento:", error);
      toast.error("Erro ao atualizar pagamento. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to safely handle status change
  const handleStatusChange = (value: string) => {
    setStatus(value as Pagamento["status"]);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Editar Pagamento</h1>
        <p className="text-gray-600 mt-1">
          Atualize os detalhes do pagamento
        </p>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
        {pagamento ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                type="number"
                id="valor"
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
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "pago" && (
              <div>
                <Label htmlFor="dataPagamento">Data de Pagamento</Label>
                <DatePicker
                  selected={dataPagamento}
                  onSelect={setDataPagamento}
                  placeholder="Selecione a data de pagamento"
                  disabled={(date) => date > new Date()}
                />
              </div>
            )}
            <div>
              <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
              <Input
                type="text"
                id="metodoPagamento"
                value={metodoPagamento}
                onChange={(e) => setMetodoPagamento(e.target.value)}
                placeholder="Ex: Cartão de crédito, Boleto, Pix"
              />
            </div>
            <div>
              <Label htmlFor="observacao">Observação</Label>
              <Input
                type="text"
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Atualizando..." : "Atualizar Pagamento"}
            </Button>
          </form>
        ) : (
          <p className="text-center py-8 text-gray-500">Carregando dados do pagamento...</p>
        )}
      </div>
    </div>
  );
};

export default EditarPagamento;
