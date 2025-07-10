import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  buscarAlunoPorId,
  atualizarAluno,
  Aluno,
} from "@/services/alunosService";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { DatePicker } from "@/components/date-picker";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Save, ArrowLeft } from "lucide-react";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  idade: string;
  data_nascimento: Date | null;
  genero: "masculino" | "feminino" | "";
  endereco: string;
  objetivo: string;
  observacoes: string;
  valor_mensalidade: string;
  data_vencimento: Date | null;
  experiencia: "" | "iniciante" | "intermediario" | "avancado";
}

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  idade?: string;
  experiencia?: string;
  genero?: string;
  valor_mensalidade?: string;
  data_nascimento?: string;
  data_vencimento?: string;
}

const EditarAluno: React.FC = () => {
  const { alunoId } = useParams<{ alunoId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    idade: "",
    data_nascimento: null,
    genero: "",
    endereco: "",
    objetivo: "",
    observacoes: "",
    valor_mensalidade: "",
    data_vencimento: null,
    experiencia: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAluno = async () => {
      if (!alunoId) return;
      
      try {
        setLoading(true);
        const aluno = await buscarAlunoPorId(alunoId);
        
        if (!aluno) return;
        
        // Preencher o formulário com os dados do aluno
        setForm({
          nome: aluno.nome,
          email: aluno.email || "",
          telefone: aluno.telefone || "",
          idade: aluno.idade?.toString() || "",
          data_nascimento: aluno.data_nascimento ? new Date(aluno.data_nascimento) : null,
          genero: (aluno.genero === "outro" ? "" : aluno.genero) as "masculino" | "feminino" | "",
          endereco: aluno.endereco || "",
          objetivo: aluno.objetivo || "",
          observacoes: aluno.observacoes || "",
          valor_mensalidade: aluno.valor_mensalidade?.toString() || "",
          data_vencimento: aluno.data_vencimento ? new Date(aluno.data_vencimento) : null,
          experiencia: (aluno.experiencia || "") as "" | "iniciante" | "intermediario" | "avancado",
        });
        
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
        toast.error("Erro ao buscar dados do aluno.");
        navigate("/gerenciar-alunos");
      } finally {
        setLoading(false);
      }
    };

    fetchAluno();
  }, [alunoId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!form.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    
    if (!form.idade) {
      newErrors.idade = "Idade é obrigatória";
    } else if (parseInt(form.idade) <= 0 || parseInt(form.idade) > 120) {
      newErrors.idade = "Idade deve estar entre 1 e 120 anos";
    }
    
    if (!form.experiencia) {
      newErrors.experiencia = "Nível de experiência é obrigatório";
    }
    
    if (!form.genero) {
      newErrors.genero = "Gênero é obrigatório";
    }
    
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (form.valor_mensalidade && (isNaN(parseFloat(form.valor_mensalidade)) || parseFloat(form.valor_mensalidade) < 0)) {
      newErrors.valor_mensalidade = "Valor da mensalidade deve ser um número positivo";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !alunoId) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!form.genero) {
        toast.error("Por favor, selecione um gênero");
        setIsSubmitting(false);
        return;
      }

      // Converter dados do formulário para o formato esperado pela API
      const alunoData: Partial<Aluno> = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        idade: parseInt(form.idade),
        data_nascimento: form.data_nascimento?.toISOString().split('T')[0],
        genero: form.genero,
        endereco: form.endereco,
        objetivo: form.objetivo,
        observacoes: form.observacoes,
        valor_mensalidade: form.valor_mensalidade ? parseFloat(form.valor_mensalidade) : undefined,
        data_vencimento: form.data_vencimento?.toISOString().split('T')[0],
        experiencia: form.experiencia as "iniciante" | "intermediario" | "avancado",
      };
      
      await atualizarAluno(alunoId, alunoData);
      toast.success("Aluno atualizado com sucesso!");
      navigate("/gerenciar-alunos");
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      toast.error("Erro ao atualizar aluno. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const niveisExperiencia = [
    { value: "iniciante", label: "Iniciante" },
    { value: "intermediario", label: "Intermediário" },
    { value: "avancado", label: "Avançado" },
  ];
  
  const opcoesGenero = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Aluno</h1>
          <p className="text-gray-600 mt-1">
            Atualize os dados do aluno
          </p>
        </div>
        <button
          onClick={() => navigate("/gerenciar-alunos")}
          className="flex items-center gap-1 text-gray-600 hover:text-fitness-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para lista</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna 1: Dados Pessoais */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Dados Pessoais</h2>
              
              <FormInput
                id="nome"
                label="Nome Completo"
                value={form.nome}
                onChange={handleChange}
                required
                error={errors.nome}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="idade"
                  label="Idade"
                  type="number"
                  value={form.idade}
                  onChange={handleChange}
                  min={1}
                  max={120}
                  required
                  error={errors.idade}
                />
                
                <FormSelect
                  id="genero"
                  label="Gênero"
                  value={form.genero}
                  onChange={handleSelectChange}
                  options={opcoesGenero}
                  required
                  error={errors.genero}
                />
              </div>
              
              <div>
                <label htmlFor="data_nascimento" className="fitness-label block mb-2">
                  Data de Nascimento
                </label>
                <DatePicker
                  selected={form.data_nascimento}
                  onSelect={(date) => setForm(prev => ({ ...prev, data_nascimento: date }))}
                  placeholder="Selecione a data"
                />
                {errors.data_nascimento && <p className="mt-1 text-xs text-red-500">{errors.data_nascimento}</p>}
              </div>
              
              <FormInput
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
              
              <FormInput
                id="telefone"
                label="Telefone"
                value={form.telefone}
                onChange={handleChange}
              />
              
              <FormInput
                id="endereco"
                label="Endereço"
                value={form.endereco}
                onChange={handleChange}
              />
            </div>
            
            {/* Coluna 2: Dados Financeiros e Objetivo */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Dados Financeiros e Objetivo</h2>
              
              <FormInput
                id="valor_mensalidade"
                label="Valor da Mensalidade (R$)"
                type="number"
                value={form.valor_mensalidade}
                onChange={handleChange}
                min={0}
                step={0.01}
                error={errors.valor_mensalidade}
              />
              
              <div>
                <label htmlFor="data_vencimento" className="fitness-label block mb-2">
                  Data de Vencimento
                </label>
                <DatePicker
                  selected={form.data_vencimento}
                  onSelect={(date) => setForm(prev => ({ ...prev, data_vencimento: date }))}
                  placeholder="Selecione a data"
                />
                {errors.data_vencimento && <p className="mt-1 text-xs text-red-500">{errors.data_vencimento}</p>}
              </div>
              
              <div>
                <label htmlFor="objetivo" className="fitness-label block mb-2">
                  Objetivo
                </label>
                <textarea
                  id="objetivo"
                  value={form.objetivo}
                  onChange={handleChange}
                  className="fitness-input w-full min-h-[100px]"
                  placeholder="Descreva o objetivo do aluno"
                />
              </div>
              
              <div>
                <label htmlFor="observacoes" className="fitness-label block mb-2">
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={handleChange}
                  className="fitness-input w-full min-h-[100px]"
                  placeholder="Observações adicionais"
                />
              </div>
              
              <FormSelect
                id="experiencia"
                label="Nível de Experiência"
                value={form.experiencia}
                onChange={handleSelectChange}
                options={niveisExperiencia}
                required
                error={errors.experiencia}
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
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

export default EditarAluno;
