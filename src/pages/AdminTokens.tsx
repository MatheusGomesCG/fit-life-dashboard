
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import LoadingSpinner from "@/components/LoadingSpinner";
import { criarTokenCadastroProfessor, listarTokensAtivos, ProfessorRegistrationToken } from "@/services/registrationTokenService";
import { User, Mail, Copy, Plus, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminTokens: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokens, setTokens] = useState<ProfessorRegistrationToken[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    professor_email: "",
    professor_nome: "",
    tipo_plano: "25" as "25" | "50" | "100" | "100+",
    expires_at: ""
  });

  const tiposPlano = [
    { value: "25", label: "Plano Básico - 25 alunos" },
    { value: "50", label: "Plano Padrão - 50 alunos" },
    { value: "100", label: "Plano Premium - 100 alunos" },
    { value: "100+", label: "Plano Empresa - Ilimitado" }
  ];

  useEffect(() => {
    carregarTokens();
  }, []);

  const carregarTokens = async () => {
    try {
      const dados = await listarTokensAtivos();
      setTokens(dados);
    } catch (error) {
      console.error("Erro ao carregar tokens:", error);
      toast.error("Erro ao carregar tokens");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.professor_email || !formData.professor_nome || !formData.expires_at) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    try {
      await criarTokenCadastroProfessor({
        professor_email: formData.professor_email,
        professor_nome: formData.professor_nome,
        tipo_plano: formData.tipo_plano,
        expires_at: new Date(formData.expires_at).toISOString()
      });
      
      toast.success("Token criado com sucesso!");
      setFormData({
        professor_email: "",
        professor_nome: "",
        tipo_plano: "25",
        expires_at: ""
      });
      setShowForm(false);
      carregarTokens();
    } catch (error: any) {
      console.error("Erro ao criar token:", error);
      toast.error(error.message || "Erro ao criar token");
    } finally {
      setSubmitting(false);
    }
  };

  const copiarLink = (token: string) => {
    const link = `${window.location.origin}/cadastrar-professor/${token}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado para a área de transferência!");
  };

  const abrirLink = (token: string) => {
    const link = `${window.location.origin}/cadastrar-professor/${token}`;
    window.open(link, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tokens de Cadastro</h1>
            <p className="text-gray-600">Gerencie links de cadastro para professores</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-fitness-primary hover:bg-fitness-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Token
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Criar Novo Token</CardTitle>
              <CardDescription>
                Gere um link único para cadastro de professor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormInput
                    label="Email do Professor"
                    name="professor_email"
                    type="email"
                    value={formData.professor_email}
                    onChange={(value) => handleInputChange("professor_email", value)}
                    placeholder="professor@email.com"
                    icon={Mail}
                    required
                  />

                  <FormInput
                    label="Nome do Professor"
                    name="professor_nome"
                    value={formData.professor_nome}
                    onChange={(value) => handleInputChange("professor_nome", value)}
                    placeholder="Nome completo"
                    icon={User}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormSelect
                    label="Tipo de Plano"
                    name="tipo_plano"
                    value={formData.tipo_plano}
                    onChange={(value) => handleInputChange("tipo_plano", value)}
                    options={tiposPlano}
                    required
                  />

                  <FormInput
                    label="Data de Expiração"
                    name="expires_at"
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(value) => handleInputChange("expires_at", value)}
                    icon={Calendar}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-fitness-primary hover:bg-fitness-primary/90"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size="small" />
                        Criando...
                      </>
                    ) : (
                      "Criar Token"
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {tokens.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Nenhum token ativo encontrado</p>
              </CardContent>
            </Card>
          ) : (
            tokens.map((token) => (
              <Card key={token.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{token.professor_nome}</h3>
                      <Badge variant="secondary">
                        {tiposPlano.find(p => p.value === token.tipo_plano)?.label || token.tipo_plano}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-1">{token.professor_email}</p>
                    <p className="text-sm text-gray-500">
                      Expira em: {format(new Date(token.expires_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copiarLink(token.token)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => abrirLink(token.token)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTokens;
