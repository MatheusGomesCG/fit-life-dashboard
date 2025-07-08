
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Aluno, listarAlunos } from "@/services/alunosService";
import { cadastrarPagamento } from "@/services/pagamentosService";
import { DatePicker } from "@/components/date-picker";

const CadastrarPagamento: React.FC = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);
  const [valor, setValor] = useState("");
  const [dataVencimento, setDataVencimento] = useState<Date | null>(null);
  const [dataPagamento, setDataPagamento] = useState<Date | null>(null);
  const [status, setStatus] = useState<"pendente" | "pago" | "atrasado">("pendente");
  const [observacao, setObservacao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metodoPagamento, setMetodoPagamento] = useState("");

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      setIsLoading(true);
      const data = await listarAlunos();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Erro ao carregar alunos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedAlunoId) {
        toast.error("Selecione um aluno para cadastrar o pagamento.");
        setIsSubmitting(false);
        return;
      }

      if (!dataVencimento) {
        toast.error("Selecione a data de vencimento.");
        setIsSubmitting(false);
        return;
      }

      // Find selected aluno data
      const selectedAluno = alunos.find(aluno => aluno.id === selectedAlunoId);
      
      if (!selectedAluno) {
        toast.error("Aluno não encontrado. Por favor, selecione um aluno válido.");
        setIsSubmitting(false);
        return;
      }

      // Parse the date to get month and year
      const mes = dataVencimento.getMonth() + 1; // JavaScript months are 0-indexed
      const ano = dataVencimento.getFullYear();

      // Convert string value to number
      const valorNum = parseFloat(valor);
      
      if (isNaN(valorNum) || valorNum <= 0) {
        toast.error("Digite um valor válido para o pagamento.");
        setIsSubmitting(false);
        return;
      }

      await cadastrarPagamento({
        aluno_id: selectedAluno.id,
        aluno_nome: selectedAluno.nome,
        valor: valorNum,
        data_vencimento: format(dataVencimento, "yyyy-MM-dd"),
        data_pagamento: status === "pago" && dataPagamento ? format(dataPagamento, "yyyy-MM-dd") : undefined,
        mes,
        ano,
        status,
        observacao,
        metodo_pagamento: metodoPagamento
      });

      toast.success("Pagamento cadastrado com sucesso!");
      navigate("/gerenciar-pagamentos");
    } catch (error) {
      console.error("Erro ao cadastrar pagamento:", error);
      toast.error("Erro ao cadastrar pagamento. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Type guard to cast status to proper type for Select
  const handleStatusChange = (value: string) => {
    setStatus(value as "pendente" | "pago" | "atrasado");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Pagamento</h1>
        <p className="text-gray-600 mt-1">
          Preencha o formulário para cadastrar um novo pagamento
        </p>
      </div>

      <div className="bg-white p-6 rounded-md shadow-md border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="aluno">Aluno</Label>
            <Select 
              onValueChange={setSelectedAlunoId}
              value={selectedAlunoId || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading">Carregando...</SelectItem>
                ) : (
                  alunos.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              type="number"
              id="valor"
              placeholder="R$ 0,00"
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
            <Select onValueChange={handleStatusChange} defaultValue={status}>
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
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
            <Input
              type="text"
              id="metodoPagamento"
              placeholder="Ex: Cartão de crédito, Boleto, Pix"
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
            />
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar Pagamento"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CadastrarPagamento;
