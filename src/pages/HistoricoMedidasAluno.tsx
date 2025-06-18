
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, FileText, Calendar, User } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Aluno {
  user_id: string;
  nome: string;
  email: string;
  genero: string;
  idade: number;
}

interface AvaliacaoCompleta {
  id: string;
  data_avaliacao: string;
  observacoes: string;
  aluno_nome: string;
  aluno_email: string;
  dados: Array<{
    grupo_estrategia: string;
    estrategia: string;
    valor: number;
    valor_texto: string;
    unidade: string;
  }>;
}

const HistoricoMedidasAluno: React.FC = () => {
  const navigate = useNavigate();
  const { alunoId } = useParams<{ alunoId: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCompleta[]>([]);

  useEffect(() => {
    if (alunoId) {
      carregarDados();
    }
  }, [alunoId]);

  const carregarDados = async () => {
    try {
      // Carregar dados do aluno
      const { data: alunoData, error: alunoError } = await supabase
        .from("aluno_profiles")
        .select("user_id, nome, email, genero, idade")
        .eq("user_id", alunoId)
        .eq("professor_id", user?.id)
        .single();

      if (alunoError) throw alunoError;
      setAluno(alunoData);

      // Carregar avaliações
      const { data: avaliacoesData, error: avaliacoesError } = await supabase
        .from("avaliacoes_completas")
        .select("*")
        .eq("aluno_id", alunoId)
        .eq("professor_id", user?.id)
        .order("data_avaliacao", { ascending: false });

      if (avaliacoesError) throw avaliacoesError;
      setAvaliacoes(avaliacoesData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados do aluno");
      navigate("/gerenciar-alunos");
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = (avaliacaoId: string) => {
    // TODO: Implementar exportação para PDF
    toast.info("Exportação para PDF em desenvolvimento");
  };

  const agruparDadosPorGrupo = (dados: AvaliacaoCompleta['dados']) => {
    return dados.reduce((acc, item) => {
      if (!acc[item.grupo_estrategia]) {
        acc[item.grupo_estrategia] = [];
      }
      acc[item.grupo_estrategia].push(item);
      return acc;
    }, {} as Record<string, typeof dados>);
  };

  if (loading) return <LoadingSpinner />;
  if (!aluno) return <div>Aluno não encontrado</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/gerenciar-alunos")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Medidas</h1>
        </div>
        
        <Button
          onClick={() => navigate(`/cadastrar-medidas/${alunoId}`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Avaliação
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados do Aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Nome</span>
              <p className="text-gray-900 font-medium">{aluno.nome}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email</span>
              <p className="text-gray-600">{aluno.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Idade</span>
              <p className="text-gray-900">{aluno.idade} anos</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Total de Avaliações</span>
              <p className="text-gray-900 font-medium">{avaliacoes.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {avaliacoes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma avaliação encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                Este aluno ainda não possui avaliações físicas registradas.
              </p>
              <Button onClick={() => navigate(`/cadastrar-medidas/${alunoId}`)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira avaliação
              </Button>
            </CardContent>
          </Card>
        ) : (
          avaliacoes.map((avaliacao) => {
            const dadosAgrupados = agruparDadosPorGrupo(avaliacao.dados);
            
            return (
              <Card key={avaliacao.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">
                          Avaliação de {format(new Date(avaliacao.data_avaliacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {Object.keys(dadosAgrupados).length} grupo(s) de estratégias
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportarPDF(avaliacao.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Exportar PDF
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {avaliacao.observacoes && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                      <p className="text-gray-700">{avaliacao.observacoes}</p>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    {Object.entries(dadosAgrupados).map(([grupo, estrategias]) => (
                      <div key={grupo}>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-sm">
                            {grupo}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {estrategias.length} medição(ões)
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {estrategias.map((estrategia, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-white">
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                {estrategia.estrategia}
                              </div>
                              <div className="text-lg font-semibold text-blue-600">
                                {estrategia.valor_texto || `${estrategia.valor}`}
                                {estrategia.unidade !== "texto" && (
                                  <span className="text-sm text-gray-500 ml-1">
                                    {estrategia.unidade}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistoricoMedidasAluno;
