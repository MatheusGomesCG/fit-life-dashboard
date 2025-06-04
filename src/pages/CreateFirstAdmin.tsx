
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { criarAdmin } from "@/services/adminService";
import { useNavigate } from "react-router-dom";

const CreateFirstAdmin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createFirstAdmin = async () => {
    setLoading(true);
    try {
      // Dados do primeiro administrador
      const email = "matheusgomes153@gmail.com";
      const password = "10101510M@th";
      const nome = "Matheus Gomes";

      // Primeiro, criar o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome
          }
        }
      });

      if (authError) {
        console.error("Erro ao criar usuário:", authError);
        toast.error("Erro ao criar usuário: " + authError.message);
        return;
      }

      if (!authData.user) {
        toast.error("Erro: usuário não foi criado");
        return;
      }

      // Aguardar um pouco para garantir que o usuário foi criado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Criar o registro de admin
      await criarAdmin({
        user_id: authData.user.id,
        nome: nome,
        email: email
      });

      toast.success("Primeiro administrador criado com sucesso!");
      toast.info("Use as credenciais fornecidas para fazer login.");
      
      // Redirecionar para a página de login
      navigate("/login");

    } catch (error) {
      console.error("Erro ao criar primeiro admin:", error);
      toast.error("Erro ao criar administrador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-fitness-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Criar Primeiro Administrador
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Configure o primeiro administrador do sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuração Inicial</CardTitle>
            <CardDescription>
              Este processo criará o primeiro administrador do sistema com as credenciais especificadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p><strong>Email:</strong> matheusgomes153@gmail.com</p>
              <p><strong>Nome:</strong> Matheus Gomes</p>
              <p><strong>Senha:</strong> ••••••••••••</p>
            </div>
            
            <Button
              onClick={createFirstAdmin}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Criar Administrador
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateFirstAdmin;
