
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, Trash2 } from "lucide-react";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import {
  Pagamento,
  buscarPagamentoPorId,
  atualizarPagamento,
  excluirPagamento
} from "@/services/pagamentosService";
import { listarAlunos, Aluno } from "@/services/alunosService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditarPagamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Campos do formulário
  const [formData, setFormData] = useState({
    alunoId: "",
    alunoNome: "",
    valor: "",
    dataVencimento: "",
    dataPagamento: "",
    status: "",
    mes: "",
    ano: "",
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

  // Carregar dados do pagamento e alunos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Carregar pagamento
        if (id) {
          const pagamento = await buscarPagamentoPorId(id);
          
          setFormData({
            alunoId: pagamento.alunoId,
            alunoNome: pagamento.alunoNome,
            valor: String(pagamento.valor),
            dataVencimento: pagamento.dataVencimento,
            dataPagamento: pagamento.dataPagamento || "",
            status: pagamento.status,
            mes: String(pagamento.mes),
            ano: String(pagamento.ano),
            observacao: pagamento.observacao || ""
          });
        }
        
        // Carregar alunos
        const alunosData = await listarAlunos();
        setAlunos(alunosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do pagamento");
        navigate("/gerenciar-pagamentos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Handler para mudança nos campos do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa erros ao editar campo
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Atualiza nome do aluno quando altera o alunoId
    if (name === "alunoId") {
      const alunoSelecionado = alunos.find(a => a.id === value);
      if (alunoSelecionado) {
        setFormData(prev => ({ ...prev, alunoNome: alunoSelecionado.nome }));
      }
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
    
    if (!validateForm() || !id) return;

    try {
      setIsSaving(true);
      
      // Se houver data de pagamento, o status é automaticamente "pago"
      const status = formData.dataPagamento ? "pago" : formData.status;
      
      await atualizarPagamento(id, {
        alunoId: formData.alunoId,
        alunoNome: formData.alunoNome,
        valor: Number(formData.valor),
        dataVencimento: formData.dataVencimento,
        dataPagamento: formData.dataPagamento || undefined,
        status: status as "pendente" | "pago" | "atrasado",
        mes: Number(formData.mes),
        ano: Number(formData.ano),
        observacao: formData.observacao
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

  // Handler para excluir pagamento
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await excluirPagamento(id);
      toast.success("Pagamento excluído com sucesso!");
      navigate("/gerenciar-pagamentos");
    } catch (error) {
      console.error("Erro ao excluir pagamento:", error);
      toast.error("Erro ao excluir pagamento. Tente novamente.");
      setIsDeleting(false);
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

  // Opções para select de status
  const opcoesStatus = [
    { value: "pendente", label: "Pendente" },
    { value: "pago", label: "Pago" },
    { value: "atrasado", label: "Atrasado" }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded-md w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            <p className="text-gray-600 mt-1">Atualize os detalhes do pagamento</p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
              disabled={isDeleting}
              aria-label="Excluir pagamento"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir pagamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                {isDeleting ? "Excluindo..." : "Sim, excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

            <FormSelect
              id="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              options={opcoesStatus}
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
              {isSaving ? "Salvando..." : "Atualizar Pagamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPagamento;
