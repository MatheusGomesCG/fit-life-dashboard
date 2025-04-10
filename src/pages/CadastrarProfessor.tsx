
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FormInput from "@/components/FormInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  nome: string;
  email: string;
  senha: string;
  confirmaSenha: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  senha?: string;
  confirmaSenha?: string;
}

const CadastrarProfessor: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
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
    } else if (form.senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres";
    }
    
    if (!form.confirmaSenha) {
      newErrors.confirmaSenha = "Confirmação de senha é obrigatória";
    } else if (form.senha !== form.confirmaSenha) {
      newErrors.confirmaSenha = "As senhas não coincidem";
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
      
      // Aqui seria feito o registro do professor
      await register({
        email: form.email,
        password: form.senha,
        userData: {
          nome: form.nome,
          tipo: "professor"
        }
      });
      
      toast.success("Professor cadastrado com sucesso!");
      navigate("/dashboard-professor");
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error);
      toast.error("Erro ao cadastrar professor. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
          
          <div className="pt-4">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarProfessor;
