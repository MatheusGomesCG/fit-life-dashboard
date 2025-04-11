
import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { listarAlunos, Aluno } from "@/services/alunosService";
import { buscarPagamentoPorId, atualizarPagamento, Pagamento } from "@/services/pagamentosService";
import LoadingSpinner from "@/components/LoadingSpinner";

const EditarPagamento: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para o formulário
  const [formData, setFormData] = useState({
    alunoId: "",
    alunoNome: "",
    valor: "",
    dataVencimento: "",
    dataPagamento: "",
    mes: "",
    ano: "",
    observacao: "",
    status: "pendente" as "pendente" | "pago" | "atrasado"
  });
  
  // Estado para erros de validação
  const [errors, setErrors] = useState({
    valor: "",
    dataVencimento: "",
    mes: "",
    ano: ""
  });

  // Carregar dados do pagamento e da lista de alunos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Carrega o pagamento pelo ID
        if (id) {
          const pagamento = await buscarPagamentoPorId(id);
          if (pagamento) {
            setFormData({
              alunoId: pagamento.alunoId || "",
              alunoNome: pagamento.alunoNome || "",
              valor: String(pagamento.valor),
              dataVencimento: pagamento.dataVencimento,
              dataPagamento: pagamento.dataPagamento || "",
              mes: String(pagamento.mes),
              ano: String(pagamento.ano),
              observacao: pagamento.observacao || "",
              status: pagamento.status || "pendente"
            });
          }
        }
        
        // Carrega a lista de alunos
        const alunosData = await listarAlunos();
        setAlunos(alunosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do pagamento");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Handler para mudança nos campos do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa erros ao editar campo
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name as keyof typeof errors]: "" }));
    }
  };

  // Validação do formulário
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!id) {
      toast.error("ID do pagamento não encontrado");
      return;
    }

    try {
      setIsSaving(true);
      
      // Verificar se o pagamento foi feito e atualizar o status
      let status = formData.status;
      if (formData.dataPagamento && !formData.dataPagamento.trim()) {
        status = "pago";
      }
      
      await atualizarPagamento(id, {
        id,
        alunoId: formData.alunoId,
        alunoNome: formData.alunoNome,
        valor: Number(formData.valor),
        dataVencimento: formData.dataVencimento,
        dataPagamento: formData.dataPagamento || undefined,
        mes: Number(formData.mes),
        ano: Number(formData.ano),
        observacao: formData.observacao,
        status
      });
      
      toast.success("Pagamento atualizado com sucesso!");
      navigate("/gerenciar-pagamentos");
    } catch (error) {
      console.error("Erro ao atualizar pagamento:", error);
      toast.error("Erro ao atualizar pagamento. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Opções para select de status
  const opcoesStatus = [
    { value: "pendente", label: "Pendente" },
    { value: "pago", label: "Pago" },
    { value: "atrasado", label: "Atrasado" }
  ];
  
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Editar Pagamento</h1>
          <p className="text-gray-600 mt-1">Atualize as informações do pagamento</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="mb-4">
              <label className="fitness-label block mb-2">Aluno</label>
              <input
                className="fitness-input bg-gray-100"
                value={formData.alunoNome}
                disabled
              />
              <p className="mt-1 text-sm text-gray-500">
                Aluno vinculado ao pagamento (não editável)
              </p>
            </div>

            <FormInput
              id="valor"
              type="number"
              step="0.01"
              label="Valor (R$)"
              value={formData.valor}
              onChange={(e) => {
                const { value } = e.target;
                setFormData(prev => ({
                  ...prev,
                  valor: value
                }));
                if (errors.valor) {
                  setErrors(prev => ({ ...prev, valor: "" }));
                }
              }}
              placeholder="0,00"
              error={errors.valor}
              required
            />

            <FormInput
              id="dataVencimento"
              type="date"
              label="Data de Vencimento"
              value={formData.dataVencimento}
              onChange={(e) => {
                const { value } = e.target;
                setFormData(prev => ({
                  ...prev,
                  dataVencimento: value
                }));
                if (errors.dataVencimento) {
                  setErrors(prev => ({ ...prev, dataVencimento: "" }));
                }
              }}
              error={errors.dataVencimento}
              required
            />

            <FormInput
              id="dataPagamento"
              type="date"
              label="Data de Pagamento (quando foi pago)"
              value={formData.dataPagamento}
              onChange={(e) => {
                const { value } = e.target;
                setFormData(prev => ({
                  ...prev,
                  dataPagamento: value,
                  status: value ? "pago" : "pendente"
                }));
              }}
            />

            <FormSelect
              id="mes"
              label="Mês de Referência"
              value={formData.mes}
              onChange={(e) => {
                const { value } = e.target;
                setFormData(prev => ({
                  ...prev,
                  mes: value
                }));
                if (errors.mes) {
                  setErrors(prev => ({ ...prev, mes: "" }));
                }
              }}
              options={opcoesMes}
              error={errors.mes}
              required
            />

            <FormInput
              id="ano"
              type="number"
              label="Ano de Referência"
              value={formData.ano}
              onChange={(e) => {
                const { value } = e.target;
                setFormData(prev => ({
                  ...prev,
                  ano: value
                }));
                if (errors.ano) {
                  setErrors(prev => ({ ...prev, ano: "" }));
                }
              }}
              error={errors.ano}
              required
            />

            <FormSelect
              id="status"
              label="Status do Pagamento"
              value={formData.status}
              onChange={(e) => {
                const { value } = e.target;
                setFormData(prev => ({
                  ...prev,
                  status: value as "pendente" | "pago" | "atrasado",
                  // Se o status mudar para pago e não tiver data, coloca a data de hoje
                  dataPagamento: value === "pago" && !prev.dataPagamento 
                    ? new Date().toISOString().split('T')[0]
                    : prev.dataPagamento
                }));
              }}
              options={opcoesStatus}
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
              className="px-4 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors flex items-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPagamento;
