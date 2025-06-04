
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import LoadingSpinner from "@/components/LoadingSpinner";
import { buscarTokenCadastro } from "@/services/registrationTokenService";
import { cadastrarProfessor, CadastroProfessorData } from "@/services/registrationService";
import { User, Phone, FileText, MapPin, Award, Book } from "lucide-react";

const CadastrarProfessor: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [formData, setFormData] = useState<Partial<CadastroProfessorData>>({});

  useEffect(() => {
    if (token) {
      verificarToken();
    }
  }, [token]);

  const verificarToken = async () => {
    try {
      const dados = await buscarTokenCadastro(token!);
      if (!dados) {
        toast.error("Token inválido ou expirado");
        navigate("/login");
        return;
      }
      
      setTokenData(dados);
      setFormData({
        email: dados.professor_email,
        nome: dados.professor_nome,
        tipo_plano: dados.tipo_plano,
        token: dados.token
      });
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      toast.error("Erro ao verificar token de cadastro");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    try {
      await cadastrarProfessor(formData as CadastroProfessorData);
      toast.success("Professor cadastrado com sucesso! Verifique seu email para a senha temporária.");
      navigate("/login");
    } catch (error: any) {
      console.error("Erro ao cadastrar professor:", error);
      toast.error(error.message || "Erro ao cadastrar professor");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Token Inválido</CardTitle>
            <CardDescription>
              O token de cadastro é inválido ou expirou.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-fitness-primary">
              Cadastro de Professor
            </CardTitle>
            <CardDescription className="text-center">
              Complete seu cadastro para começar a usar o GymCloud
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                  label="Nome Completo"
                  name="nome"
                  value={formData.nome || ""}
                  onChange={(value) => handleInputChange("nome", value)}
                  placeholder="Seu nome completo"
                  icon={User}
                  required
                />

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(value) => handleInputChange("email", value)}
                  placeholder="seu@email.com"
                  disabled
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone || ""}
                  onChange={(value) => handleInputChange("telefone", value)}
                  placeholder="(11) 99999-9999"
                  icon={Phone}
                />

                <FormInput
                  label="CPF"
                  name="documento"
                  value={formData.documento || ""}
                  onChange={(value) => handleInputChange("documento", value)}
                  placeholder="000.000.000-00"
                  icon={FileText}
                />
              </div>

              <FormInput
                label="Endereço"
                name="endereco"
                value={formData.endereco || ""}
                onChange={(value) => handleInputChange("endereco", value)}
                placeholder="Rua, número, bairro - Cidade, Estado"
                icon={MapPin}
              />

              <FormInput
                label="Especialidade"
                name="especialidade"
                value={formData.especialidade || ""}
                onChange={(value) => handleInputChange("especialidade", value)}
                placeholder="Ex: Musculação, Pilates, Funcional..."
                icon={Award}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Book className="inline h-4 w-4 mr-2" />
                  Biografia
                </label>
                <textarea
                  value={formData.biografia || ""}
                  onChange={(e) => handleInputChange("biografia", e.target.value)}
                  placeholder="Conte um pouco sobre sua experiência e formação..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:border-transparent"
                  rows={4}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Plano Selecionado</h3>
                <p className="text-sm text-gray-600">
                  {tokenData.tipo_plano === "25" && "Plano Básico - até 25 alunos"}
                  {tokenData.tipo_plano === "50" && "Plano Padrão - até 50 alunos"}
                  {tokenData.tipo_plano === "100" && "Plano Premium - até 100 alunos"}
                  {tokenData.tipo_plano === "100+" && "Plano Empresa - alunos ilimitados"}
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="small" />
                    Cadastrando...
                  </>
                ) : (
                  "Completar Cadastro"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastrarProfessor;
