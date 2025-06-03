
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import FormInput from "@/components/FormInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Save, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  nome: string;
  email: string;
  senha: string;
  confirmaSenha: string;
  telefone: string;
  documento: string;
  endereco: string;
  especialidade: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  senha?: string;
  confirmaSenha?: string;
  telefone?: string;
  documento?: string;
  endereco?: string;
  especialidade?: string;
}

const CadastrarProfessor: React.FC = () => {
  const { register } = useAuth();
  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    telefone: "",
    documento: "",
    endereco: "",
    especialidade: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (!form.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!form.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (form.senha.length < 8) {
      newErrors.senha = "A senha deve ter pelo menos 8 caracteres";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(form.senha)) {
      newErrors.senha = "A senha deve conter pelo menos uma letra minúscula, uma maiúscula e um caractere especial";
    }
    
    if (!form.confirmaSenha) {
      newErrors.confirmaSenha = "Confirmação de senha é obrigatória";
    } else if (form.senha !== form.confirmaSenha) {
      newErrors.confirmaSenha = "As senhas não coincidem";
    }

    if (!form.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }

    if (!form.documento.trim()) {
      newErrors.documento = "Documento é obrigatório";
    }

    if (!form.endereco.trim()) {
      newErrors.endereco = "Endereço é obrigatório";
    }

    if (!form.especialidade.trim()) {
      newErrors.especialidade = "Especialidade é obrigatória";
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
      
      await register({
        email: form.email,
        password: form.senha,
        userData: {
          nome: form.nome,
          tipo: "professor",
          telefone: form.telefone,
          documento: form.documento,
          endereco: form.endereco,
          especialidade: form.especialidade
        }
      });
      
      toast.success("Professor cadastrado com sucesso!");
      // After successful registration, redirect
      setTimeout(() => {
        window.location.href = "/dashboard-professor";
      }, 100);
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error);
      toast.error("Erro ao cadastrar professor. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-fitness-primary">Cadastro de Professor</h1>
          <p className="text-gray-600 mt-1">
            Preencha os dados para criar sua conta
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            id="nome"
            label="Nome Completo"
            value={form.nome}
            onChange={handleChange}
            required
            error={errors.nome}
          />
          
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            error={errors.email}
          />

          <FormInput
            id="telefone"
            label="Telefone"
            value={form.telefone}
            onChange={handleChange}
            required
            error={errors.telefone}
            placeholder="(11) 99999-9999"
          />

          <FormInput
            id="documento"
            label="CPF/CNPJ"
            value={form.documento}
            onChange={handleChange}
            required
            error={errors.documento}
            placeholder="000.000.000-00"
          />

          <FormInput
            id="endereco"
            label="Endereço"
            value={form.endereco}
            onChange={handleChange}
            required
            error={errors.endereco}
          />

          <FormInput
            id="especialidade"
            label="Especialidade"
            value={form.especialidade}
            onChange={handleChange}
            required
            error={errors.especialidade}
            placeholder="Ex: Personal Trainer, Nutricionista"
          />
          
          <FormInput
            id="senha"
            label="Senha"
            type="password"
            value={form.senha}
            onChange={handleChange}
            required
            error={errors.senha}
          />
          
          <FormInput
            id="confirmaSenha"
            label="Confirmar Senha"
            type="password"
            value={form.confirmaSenha}
            onChange={handleChange}
            required
            error={errors.confirmaSenha}
          />
          
          <div className="pt-4 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Cadastrar</span>
                </>
              )}
            </button>
            
            <Link 
              to="/login" 
              className="w-full text-center block mt-2 text-sm text-fitness-secondary hover:underline"
            >
              <div className="flex items-center justify-center gap-1">
                <ArrowLeft size={16} />
                <span>Voltar para o login</span>
              </div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarProfessor;
