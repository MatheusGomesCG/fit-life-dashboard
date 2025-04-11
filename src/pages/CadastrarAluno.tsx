
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { cadastrarAluno } from "@/services/alunosService";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

interface FormData {
  nome: string;
  email: string;
  senha: string;
  confirmaSenha: string;
  idade: string;
  peso: string;
  altura: string;
  genero: string;
  experiencia: string;
}

const CadastrarAluno: React.FC = () => {
  const navigate = useNavigate();
  const { registerAluno } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    idade: "",
    peso: "",
    altura: "",
    genero: "masculino",
    experiencia: "iniciante",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Limpa o erro quando o campo é editado
    if (formErrors[id as keyof FormData]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    let valid = true;

    // Validação de campos obrigatórios
    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório";
      valid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
      valid = false;
    }

    if (!formData.senha) {
      errors.senha = "Senha é obrigatória";
      valid = false;
    } else if (formData.senha.length < 6) {
      errors.senha = "A senha deve ter pelo menos 6 caracteres";
      valid = false;
    }

    if (!formData.confirmaSenha) {
      errors.confirmaSenha = "Confirme sua senha";
      valid = false;
    } else if (formData.senha !== formData.confirmaSenha) {
      errors.confirmaSenha = "As senhas não coincidem";
      valid = false;
    }

    // Validações numéricas
    if (!formData.idade) {
      errors.idade = "Idade é obrigatória";
      valid = false;
    } else if (isNaN(Number(formData.idade)) || Number(formData.idade) <= 0) {
      errors.idade = "Idade inválida";
      valid = false;
    }

    if (!formData.peso) {
      errors.peso = "Peso é obrigatório";
      valid = false;
    } else if (isNaN(Number(formData.peso)) || Number(formData.peso) <= 0) {
      errors.peso = "Peso inválido";
      valid = false;
    }

    if (!formData.altura) {
      errors.altura = "Altura é obrigatória";
      valid = false;
    } else if (
      isNaN(Number(formData.altura)) ||
      Number(formData.altura) <= 0
    ) {
      errors.altura = "Altura inválida";
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

      // Register student authentication credentials
      await registerAluno({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        idade: Number(formData.idade),
        peso: Number(formData.peso),
        altura: Number(formData.altura),
        experiencia: formData.experiencia
      });

      // Register student data
      await cadastrarAluno({
        nome: formData.nome,
        email: formData.email,
        idade: parseInt(formData.idade),
        peso: parseFloat(formData.peso),
        altura: parseFloat(formData.altura),
        genero: formData.genero as "masculino" | "feminino",
        experiencia: formData.experiencia as "iniciante" | "intermediario" | "avancado",
      });

      toast.success("Aluno cadastrado com sucesso!");
      navigate("/gerenciar-alunos");
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      toast.error("Erro ao cadastrar aluno. Tente novamente.");
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
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar Aluno</h1>
          <p className="text-gray-600 mt-1">
            Preencha os dados do novo aluno
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4 text-gray-900 pb-2 border-b">
          Informações de Conta
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <FormInput
            id="nome"
            label="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            error={formErrors.nome}
            required
          />
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            required
          />
          <FormInput
            id="senha"
            label="Senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            error={formErrors.senha}
            required
          />
          <FormInput
            id="confirmaSenha"
            label="Confirmar senha"
            type="password"
            value={formData.confirmaSenha}
            onChange={handleChange}
            error={formErrors.confirmaSenha}
            required
          />
        </div>

        <h2 className="text-lg font-medium mb-4 text-gray-900 pb-2 border-b">
          Informações Físicas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <FormInput
            id="idade"
            label="Idade"
            type="number"
            value={formData.idade}
            onChange={handleChange}
            error={formErrors.idade}
            required
          />
          <FormInput
            id="peso"
            label="Peso (kg)"
            type="number"
            step="0.01"
            value={formData.peso}
            onChange={handleChange}
            error={formErrors.peso}
            required
          />
          <FormInput
            id="altura"
            label="Altura (m)"
            type="number"
            step="0.01"
            value={formData.altura}
            onChange={handleChange}
            error={formErrors.altura}
            required
          />
          <FormSelect
            id="genero"
            label="Gênero"
            value={formData.genero}
            onChange={handleChange}
            options={[
              { value: "masculino", label: "Masculino" },
              { value: "feminino", label: "Feminino" },
            ]}
            required
          />
          <FormSelect
            id="experiencia"
            label="Nível de experiência"
            value={formData.experiencia}
            onChange={handleChange}
            options={[
              { value: "iniciante", label: "Iniciante" },
              { value: "intermediario", label: "Intermediário" },
              { value: "avancado", label: "Avançado" },
            ]}
            required
          />
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => navigate("/gerenciar-alunos")}
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

export default CadastrarAluno;
