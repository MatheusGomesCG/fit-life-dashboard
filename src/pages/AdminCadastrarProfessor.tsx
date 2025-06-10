
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
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
import ProfessorForm from "@/components/admin/ProfessorForm";
import { gerarSenhaAleatoria } from "@/utils/passwordGenerator";
import { validateProfessorForm, ProfessorFormData } from "@/utils/professorValidation";
import { createProfessor } from "@/services/adminProfessorService";

const AdminCadastrarProfessor: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  const [formData, setFormData] = useState<ProfessorFormData>({
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

  const handleGerarSenha = () => {
    const novaSenha = gerarSenhaAleatoria();
    setFormData(prev => ({ ...prev, senha: novaSenha }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProfessorForm(formData);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    setIsLoading(true);

    try {
      const result = await createProfessor(formData);
      
      if (result.success) {
        toast.success(result.message);
        
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

        // Aguardar um pouco antes de redirecionar
        setTimeout(() => {
          navigate("/admin/professores");
        }, 1500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("❌ [AdminCadastrarProfessor] Erro inesperado:", error);
      toast.error("Erro inesperado ao cadastrar professor. Tente novamente.");
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
          disabled={isLoading}
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
            <form onSubmit={handleSubmit}>
              <ProfessorForm
                formData={formData}
                onInputChange={handleInputChange}
                onGerarSenha={handleGerarSenha}
                mostrarSenha={mostrarSenha}
                setMostrarSenha={setMostrarSenha}
                isLoading={isLoading}
              />

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={isLoading}
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
