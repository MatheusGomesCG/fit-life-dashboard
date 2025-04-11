import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { atualizarPagamento, buscarPagamentoPorId, Pagamento } from "@/services/pagamentosService";

const EditarPagamento: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pagamento, setPagamento] = useState<Pagamento | null>(null);
  const [valor, setValor] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [status, setStatus] = useState<Pagamento["status"]>("pendente");
  const [dataPagamento, setDataPagamento] = useState<string | undefined>(undefined);
  const [observacao, setObservacao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const carregarPagamento = async () => {
      if (id) {
        try {
          const data = await buscarPagamentoPorId(id);
          setPagamento(data);
          setValor(data.valor.toString());
          setDataVencimento(data.dataVencimento);
          setStatus(data.status);
          setDataPagamento(data.dataPagamento);
          setObservacao(data.observacao || "");
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

      // Convert string value to number
      const valorNum = parseFloat(valor);

      await atualizarPagamento(id, {
        valor: valorNum, // Converted to number
        dataVencimento,
        status,
        dataPagamento: status === "pago" ? dataPagamento : undefined,
        observacao,
        // Don't include metodoPagamento since it's not in the Pagamento interface
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataVencimento && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataVencimento ? format(parseISO(dataVencimento), "dd/MM/yyyy") : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={dataVencimento ? parseISO(dataVencimento) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setDataVencimento(format(date, "yyyy-MM-dd"));
                      }
                    }}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Pagamento["status"])}>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataPagamento && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataPagamento ? format(parseISO(dataPagamento), "dd/MM/yyyy") : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={dataPagamento ? parseISO(dataPagamento) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setDataPagamento(format(date, "yyyy-MM-dd"));
                        }
                      }}
                      max={new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
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
