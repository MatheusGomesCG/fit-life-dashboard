
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Shield } from "lucide-react";

const CriarUsuarioAdmin: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !senha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🚀 [CriarAdmin] Criando usuário admin...");

      // Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (authError) {
        console.error("❌ [CriarAdmin] Erro ao criar usuário:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Falha ao criar usuário");
      }

      console.log("✅ [CriarAdmin] Usuário criado:", authData.user.id);

      // Criar perfil admin
      const { error: profileError } = await supabase
        .from('admin_users')
        .insert({
          user_id: authData.user.id,
          nome,
          email,
          status: 'ativo'
        });

      if (profileError) {
        console.error("❌ [CriarAdmin] Erro ao criar perfil admin:", profileError);
        throw profileError;
      }

      console.log("✅ [CriarAdmin] Perfil admin criado com sucesso");
      
      toast.success("Usuário administrador criado com sucesso!");
      
      // Limpar formulário
      setNome("");
      setEmail("");
      setSenha("");

    } catch (error: any) {
      console.error("❌ [CriarAdmin] Erro:", error);
      toast.error(error.message || "Erro ao criar usuário administrador");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Criar Usuário Administrador
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Configure sua conta de administrador do sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Administrador</CardTitle>
            <CardDescription>
              Esta conta terá acesso total ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <div className="mt-1">
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@seudominio.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="mt-1">
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Administrador"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Após criar o usuário, você poderá fazer login normalmente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CriarUsuarioAdmin;
