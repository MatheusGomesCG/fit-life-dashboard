
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Save, ArrowLeft } from "lucide-react";
import { cadastrarPagamento } from "@/services/pagamentosService";
import { listarAlunos, Aluno } from "@/services/alunosService";

interface FormData {
  alunoId: string;
  valor: string;
  dataVencimento: string;
  dataPagamento: string;
  mes: string;
  ano: string;
  observacao: string;
}

interface FormErrors {
  alunoId?: string;
  valor?: string;
  dataVencimento?: string;
  mes?: string;
  ano?: string;
}

const CadastrarPagamento: React.FC = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    alunoId: "",
    valor: "",
    dataVencimento: new Date().toISOString().split("T")[0],
    dataPagamento: "",
    mes: new Date().getMonth() + 1 + "",
    ano: new Date().getFullYear() + "",
    observacao: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const data = await listarAlunos();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Erro ao carregar lista de alunos.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.alunoId) {
      newErrors.alunoId = "Selecione um aluno";
    }

    if (!form.valor || isNaN(parseFloat(form.valor)) || parseFloat(form.valor) <= 0) {
      newErrors.valor = "Informe um valor válido";
    }

    if (!form.dataVencimento) {
      newErrors.dataVencimento = "Informe a data de vencimento";
    }

    if (!form.mes) {
      newErrors.mes = "Selecione o mês de referência";
    }

    if (!form.ano) {
      newErrors.ano = "Informe o ano de referência";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Buscar o nome do aluno
      const aluno = alunos.find(a => a.id === form.alunoId);
      if (!aluno) throw new Error("Aluno não encontrado");
      
      await cadastrarPagamento({
        alunoId: form.alunoId,
        alunoNome: aluno.nome,
        valor: parseFloat(form.valor),
        dataVencimento: form.dataVencimento,
        dataPagamento: form.dataPagamento || undefined,
        mes: parseInt(form.mes),
        ano: parseInt(form.ano),
        observacao: form.observacao
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar Pagamento</h1>
          <p className="text-gray-600 mt-1">
            Registre um novo pagamento para um aluno
          </p>
        </div>
        <button
          onClick={() => navigate("/gerenciar-pagamentos")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect
            id="alunoId"
            label="Aluno"
            value={form.alunoId}
            onChange={handleChange}
            options={alunos.map(aluno => ({
              value: aluno.id || "",
              label: aluno.nome
            }))}
            placeholder="Selecione um aluno"
            error={errors.alunoId}
            required
          />

          <FormInput
            id="valor"
            label="Valor (R$)"
            type="number"
            min="0.01"
            step="0.01"
            value={form.valor}
            onChange={handleChange}
            error={errors.valor}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="dataVencimento"
              label="Data de Vencimento"
              type="date"
              value={form.dataVencimento}
              onChange={handleChange}
              error={errors.dataVencimento}
              required
            />

            <FormInput
              id="dataPagamento"
              label="Data de Pagamento (opcional)"
              type="date"
              value={form.dataPagamento}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              id="mes"
              label="Mês de Referência"
              value={form.mes}
              onChange={handleChange}
              options={[
                { value: "1", label: "Janeiro" },
                { value: "2", label: "Fevereiro" },
                { value: "3", label: "Março" },
                { value: "4", label: "Abril" },
                { value: "5", label: "Maio" },
                { value: "6", label: "Junho" },
                { value: "7", label: "Julho" },
                { value: "8", label: "Agosto" },
                { value: "9", label: "Setembro" },
                { value: "10", label: "Outubro" },
                { value: "11", label: "Novembro" },
                { value: "12", label: "Dezembro" }
              ]}
              error={errors.mes}
              required
            />

            <FormInput
              id="ano"
              label="Ano de Referência"
              type="number"
              min="2023"
              max="2030"
              value={form.ano}
              onChange={handleChange}
              error={errors.ano}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="observacao" className="block text-sm font-medium text-gray-700">
              Observação (opcional)
            </label>
            <textarea
              id="observacao"
              rows={3}
              value={form.observacao}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fitness-primary"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-5 w-5" />
              <span>Cadastrar Pagamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarPagamento;
