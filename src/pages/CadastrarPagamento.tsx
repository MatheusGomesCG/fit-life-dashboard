
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { listarAlunos, Aluno } from "@/services/alunosService";
import { cadastrarPagamento } from "@/services/pagamentosService";

const CadastrarPagamento: React.FC = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Campos do formulário
  const [formData, setFormData] = useState({
    alunoId: "",
    valor: "",
    dataVencimento: format(new Date(), "yyyy-MM-dd"),
    dataPagamento: "",
    mes: String(new Date().getMonth() + 1), // 1-12
    ano: String(new Date().getFullYear()),
    observacao: ""
  });
  
  // Estado para erros de validação
  const [errors, setErrors] = useState({
    alunoId: "",
    valor: "",
    dataVencimento: "",
    mes: "",
    ano: ""
  });

  // Carrega alunos ao montar o componente
  useEffect(() => {
    const fetchAlunos = async () => {
      setIsLoading(true);
      try {
        const data = await listarAlunos();
        setAlunos(data);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
        toast.error("Erro ao carregar lista de alunos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  // Handler para mudança nos campos do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa erros ao editar campo
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validação do formulário
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.alunoId) {
      newErrors.alunoId = "Selecione um aluno";
      isValid = false;
    }

    if (!formData.valor || Number(formData.valor) <= 0) {
      newErrors.valor = "Informe um valor válido";
      isValid = false;
    }

    if (!formData.dataVencimento) {
      newErrors.dataVencimento = "Informe a data de vencimento";
      isValid = false;
    }

    if (!formData.mes) {
      newErrors.mes = "Selecione o mês de referência";
      isValid = false;
    }

    if (!formData.ano) {
      newErrors.ano = "Informe o ano de referência";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handler para submissão do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const alunoSelecionado = alunos.find(a => a.id === formData.alunoId);
    if (!alunoSelecionado) {
      toast.error("Aluno não encontrado");
      return;
    }

    try {
      setIsSaving(true);
      
      await cadastrarPagamento({
        alunoId: formData.alunoId,
        alunoNome: alunoSelecionado.nome,
        valor: Number(formData.valor),
        dataVencimento: formData.dataVencimento,
        dataPagamento: formData.dataPagamento || undefined,
        mes: Number(formData.mes),
        ano: Number(formData.ano),
        observacao: formData.observacao
      });
      
      toast.success("Pagamento cadastrado com sucesso!");
      navigate("/gerenciar-pagamentos");
    } catch (error) {
      console.error("Erro ao cadastrar pagamento:", error);
      toast.error("Erro ao cadastrar pagamento. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Opções para select de mês
  const opcoesMes = [
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar Pagamento</h1>
          <p className="text-gray-600 mt-1">Registre um novo pagamento de mensalidade</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormSelect
              id="alunoId"
              label="Aluno"
              value={formData.alunoId}
              onChange={handleChange}
              options={alunos.map(aluno => ({ value: aluno.id!, label: aluno.nome }))}
              error={errors.alunoId}
              required
            />

            <FormInput
              id="valor"
              type="number"
              step="0.01"
              label="Valor (R$)"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              placeholder="0,00"
              error={errors.valor}
              required
            />

            <FormInput
              id="dataVencimento"
              type="date"
              label="Data de Vencimento"
              name="dataVencimento"
              value={formData.dataVencimento}
              onChange={handleChange}
              error={errors.dataVencimento}
              required
            />

            <FormInput
              id="dataPagamento"
              type="date"
              label="Data de Pagamento (se já pago)"
              name="dataPagamento"
              value={formData.dataPagamento}
              onChange={handleChange}
            />

            <FormSelect
              id="mes"
              label="Mês de Referência"
              value={formData.mes}
              onChange={handleChange}
              options={opcoesMes}
              error={errors.mes}
              required
            />

            <FormInput
              id="ano"
              type="number"
              label="Ano de Referência"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              error={errors.ano}
              required
            />

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="observacao" className="fitness-label block mb-2">
                Observações
              </label>
              <textarea
                id="observacao"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                rows={3}
                className="fitness-input w-full"
                placeholder="Observações adicionais sobre o pagamento..."
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/gerenciar-pagamentos")}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors"
              disabled={isSaving || isLoading}
            >
              {isSaving ? "Salvando..." : "Cadastrar Pagamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarPagamento;
