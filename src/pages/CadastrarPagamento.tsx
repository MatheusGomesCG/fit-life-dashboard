
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { listarAlunos, Aluno } from "@/services/alunosService";
import { cadastrarPagamento } from "@/services/pagamentosService";
import { ArrowLeft, Save } from "lucide-react";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import LoadingSpinner from "@/components/LoadingSpinner";

interface FormData {
  alunoId: string;
  valor: string;
  dataVencimento: string;
  dataPagamento: string;
  status: string;
  metodoPagamento: string;
}

const CadastrarPagamento: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [carregandoAlunos, setCarregandoAlunos] = useState(true);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [formData, setFormData] = useState<FormData>({
    alunoId: "",
    valor: "",
    dataVencimento: "",
    dataPagamento: "",
    status: "pendente",
    metodoPagamento: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        setCarregandoAlunos(true);
        const data = await listarAlunos();
        setAlunos(data);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
        toast.error("Erro ao carregar lista de alunos.");
      } finally {
        setCarregandoAlunos(false);
      }
    };

    carregarAlunos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    // Limpar erro quando campo é alterado
    if (formErrors[id as keyof FormData]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    let valid = true;

    if (!formData.alunoId) {
      errors.alunoId = "Selecione um aluno";
      valid = false;
    }

    if (!formData.valor) {
      errors.valor = "Valor é obrigatório";
      valid = false;
    } else if (isNaN(Number(formData.valor)) || Number(formData.valor) <= 0) {
      errors.valor = "Valor inválido";
      valid = false;
    }

    if (!formData.dataVencimento) {
      errors.dataVencimento = "Data de vencimento é obrigatória";
      valid = false;
    }

    if (formData.status === "pago" && !formData.dataPagamento) {
      errors.dataPagamento = "Data de pagamento é obrigatória para pagamentos realizados";
      valid = false;
    }

    if (formData.status === "pago" && !formData.metodoPagamento) {
      errors.metodoPagamento = "Método de pagamento é obrigatório para pagamentos realizados";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    try {
      setLoading(true);
      
      const pagamentoData = {
        alunoId: formData.alunoId,
        alunoNome: alunos.find(a => a.id === formData.alunoId)?.nome || "",
        valor: Number(formData.valor),
        dataVencimento: formData.dataVencimento,
        dataPagamento: formData.dataPagamento || null,
        status: formData.status as "pendente" | "pago" | "atrasado",
        metodoPagamento: formData.metodoPagamento || null,
      };

      await cadastrarPagamento(pagamentoData);
      toast.success("Pagamento cadastrado com sucesso!");
      navigate("/gerenciar-pagamentos");
    } catch (error) {
      console.error("Erro ao cadastrar pagamento:", error);
      toast.error("Erro ao cadastrar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-gray-600 mt-1">
            Registre um novo pagamento no sistema
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <FormSelect
            id="alunoId"
            label="Aluno"
            value={formData.alunoId}
            onChange={handleChange}
            options={alunos.map(aluno => ({ value: aluno.id!, label: aluno.nome }))}
            error={formErrors.alunoId}
            required
          />
          
          <FormInput
            id="valor"
            label="Valor (R$)"
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={handleChange}
            error={formErrors.valor}
            required
          />
          
          <FormInput
            id="dataVencimento"
            label="Data de Vencimento"
            type="date"
            value={formData.dataVencimento}
            onChange={handleChange}
            error={formErrors.dataVencimento}
            required
          />
          
          <FormSelect
            id="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: "pendente", label: "Pendente" },
              { value: "pago", label: "Pago" },
              { value: "atrasado", label: "Atrasado" },
            ]}
            error={formErrors.status}
            required
          />
          
          {formData.status === "pago" && (
            <>
              <FormInput
                id="dataPagamento"
                label="Data do Pagamento"
                type="date"
                value={formData.dataPagamento}
                onChange={handleChange}
                error={formErrors.dataPagamento}
                required
              />
              
              <FormSelect
                id="metodoPagamento"
                label="Método de Pagamento"
                value={formData.metodoPagamento}
                onChange={handleChange}
                options={[
                  { value: "pix", label: "PIX" },
                  { value: "dinheiro", label: "Dinheiro" },
                  { value: "cartao_credito", label: "Cartão de Crédito" },
                  { value: "cartao_debito", label: "Cartão de Débito" },
                  { value: "transferencia", label: "Transferência Bancária" },
                  { value: "boleto", label: "Boleto" },
                ]}
                error={formErrors.metodoPagamento}
                required
              />
            </>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => navigate("/gerenciar-pagamentos")}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastrarPagamento;
