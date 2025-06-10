
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

const AdminCadastrarProfessor: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    especialidade: "",
    documento: "",
    endereco: "",
    biografia: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const gerarSenhaAleatoria = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let senha = "";
    for (let i = 0; i < 8; i++) {
      senha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, senha }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.senha) {
      toast.error("Nome, email e senha são obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          toast.error("Este email já está cadastrado no sistema");
        } else {
          toast.error("Erro ao criar conta: " + authError.message);
        }
        return;
      }

      if (!authData.user) {
        toast.error("Erro ao criar usuário");
        return;
      }

      // 2. Criar perfil do professor
      const { error: profileError } = await supabase
        .from('professor_profiles')
        .insert({
          user_id: authData.user.id,
          nome: formData.nome,
          telefone: formData.telefone || null,
          documento: formData.documento || null,
          endereco: formData.endereco || null,
          especialidade: formData.especialidade || null,
          biografia: formData.biografia || null,
          status: 'ativo'
        });

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        toast.error("Erro ao criar perfil do professor");
        return;
      }

      toast.success("Professor cadastrado com sucesso!");
      
      // Limpar formulário
      setFormData({
        nome: "",
        email: "",
        senha: "",
        telefone: "",
        especialidade: "",
        documento: "",
        endereco: "",
        biografia: ""
      });

      // Redirecionar para lista de professores
      navigate("/admin/professores");

    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao cadastrar professor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/professores")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para lista de professores
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Professor</h1>
        <p className="text-gray-600 mt-1">
          Preencha os dados abaixo para cadastrar um novo professor
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Dados do Professor
            </CardTitle>
            <CardDescription>
              Informações básicas para o cadastro do professor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Obrigatórios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Digite o nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="professor@email.com"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      id="senha"
                      name="senha"
                      required
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.senha}
                      onChange={handleInputChange}
                      placeholder="Digite a senha"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                    >
                      {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={gerarSenhaAleatoria}
                  >
                    Gerar
                  </Button>
                </div>
              </div>

              {/* Dados Opcionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="text"
                    id="telefone"
                    name="telefone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label htmlFor="especialidade" className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidade
                  </label>
                  <input
                    type="text"
                    id="especialidade"
                    name="especialidade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.especialidade}
                    onChange={handleInputChange}
                    placeholder="Ex: Musculação, Crossfit, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-2">
                    CPF/CNPJ
                  </label>
                  <input
                    type="text"
                    id="documento"
                    name="documento"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.documento}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-2">
                  Biografia
                </label>
                <textarea
                  id="biografia"
                  name="biografia"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  value={formData.biografia}
                  onChange={handleInputChange}
                  placeholder="Breve descrição sobre o professor..."
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin/professores")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Cadastrar Professor
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCadastrarProfessor;
