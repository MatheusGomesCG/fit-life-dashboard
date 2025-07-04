import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Calendar, 
  User, 
  Edit, 
  Trash2,
  Download,
  AlertTriangle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { excluirAvaliacao } from "@/services/avaliacaoService";
import { gerarPDFAvaliacao, downloadPDFAvaliacao } from "@/services/avaliacaoPdfService";

interface Aluno {
  user_id: string;
  nome: string;
  email: string;
  genero: string;
  idade: number;
}

interface DadoAvaliacao {
  grupo_estrategia: string;
  estrategia: string;
  valor: number;
  valor_texto: string;
  unidade: string;
}

interface AvaliacaoCompleta {
  id: string;
  data_avaliacao: string;
  observacoes: string;
  aluno_nome: string;
  aluno_email: string;
  dados: DadoAvaliacao[];
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
      
      // Converter os dados do Supabase para o tipo correto
      const avaliacoesFormatadas: AvaliacaoCompleta[] = (avaliacoesData || []).map(avaliacao => ({
        id: avaliacao.id,
        data_avaliacao: avaliacao.data_avaliacao,
        observacoes: avaliacao.observacoes,
        aluno_nome: avaliacao.aluno_nome,
        aluno_email: avaliacao.aluno_email,
        dados: Array.isArray(avaliacao.dados) ? (avaliacao.dados as unknown as DadoAvaliacao[]) : []
      }));
      
      setAvaliacoes(avaliacoesFormatadas);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados do aluno");
      navigate("/gerenciar-alunos");
    } finally {
      setLoading(false);
    }
  };

  const editarAvaliacao = (avaliacaoId: string) => {
    navigate(`/editar-avaliacao/${alunoId}/${avaliacaoId}`);
  };

  const confirmarExclusao = async (avaliacaoId: string) => {
    try {
      await excluirAvaliacao(avaliacaoId);
      toast.success("Avaliação excluída com sucesso!");
      carregarDados(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      toast.error("Erro ao excluir avaliação");
    }
  };

  const exportarPDF = (avaliacao: AvaliacaoCompleta) => {
    try {
      const doc = gerarPDFAvaliacao(avaliacao);
      const filename = `avaliacao_${avaliacao.aluno_nome}_${format(new Date(avaliacao.data_avaliacao), "dd-MM-yyyy")}.pdf`;
      downloadPDFAvaliacao(doc, filename);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  const agruparDadosPorGrupo = (dados: DadoAvaliacao[]) => {
    return dados.reduce((acc, item) => {
      if (!acc[item.grupo_estrategia]) {
        acc[item.grupo_estrategia] = [];
      }
      acc[item.grupo_estrategia].push(item);
      return acc;
    }, {} as Record<string, DadoAvaliacao[]>);
  };

  if (loading) return <LoadingSpinner />;
  if (!aluno) return <div>Aluno não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
        {/* Header responsivo */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/gerenciar-alunos")}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Histórico de Medidas
            </h1>
          </div>
          
          <Button
            onClick={() => navigate(`/cadastrar-medidas/${alunoId}`)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Avaliação
          </Button>
        </div>

        {/* Card de dados do aluno - Layout responsivo */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Dados do Aluno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Nome</span>
                <p className="text-gray-900 font-medium break-words">{aluno.nome}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Email</span>
                <p className="text-gray-600 break-all text-sm">{aluno.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Idade</span>
                <p className="text-gray-900">{aluno.idade} anos</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Total de Avaliações</span>
                <p className="text-gray-900 font-medium">{avaliacoes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de avaliações */}
        <div className="space-y-4 sm:space-y-6">
          {avaliacoes.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma avaliação encontrada
                </h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto">
                  Este aluno ainda não possui avaliações físicas registradas.
                </p>
                <Button 
                  onClick={() => navigate(`/cadastrar-medidas/${alunoId}`)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira avaliação
                </Button>
              </CardContent>
            </Card>
          ) : (
            avaliacoes.map((avaliacao) => {
              const dadosAgrupados = agruparDadosPorGrupo(avaliacao.dados);
              
              return (
                <Card key={avaliacao.id} className="shadow-sm">
                  <CardHeader className="pb-4">
                    {/* Header da avaliação - Layout responsivo */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg break-words">
                            Avaliação de {format(new Date(avaliacao.data_avaliacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {Object.keys(dadosAgrupados).length} grupo(s) de estratégias
                          </p>
                        </div>
                      </div>
                      
                      {/* Botões de ação responsivos */}
                      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportarPDF(avaliacao)}
                          className="flex-1 sm:flex-none justify-center"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">PDF</span>
                          <span className="sm:hidden">Exportar PDF</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editarAvaliacao(avaliacao.id)}
                          className="flex-1 sm:flex-none justify-center"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 flex-1 sm:flex-none justify-center"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-md mx-4">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                Confirmar Exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="w-full sm:w-auto">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => confirmarExclusao(avaliacao.id)}
                                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Observações */}
                    {avaliacao.observacoes && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                        <p className="text-gray-700 break-words">{avaliacao.observacoes}</p>
                      </div>
                    )}
                    
                    {/* Dados agrupados - Layout responsivo */}
                    <div className="space-y-6">
                      {Object.entries(dadosAgrupados).map(([grupo, estrategias]) => (
                        <div key={grupo}>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                            <Badge variant="secondary" className="text-sm w-fit">
                              {grupo}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {estrategias.length} medição(ões)
                            </span>
                          </div>
                          
                          {/* Grid responsivo para as medições */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                            {estrategias.map((estrategia, index) => (
                              <div key={index} className="p-3 sm:p-4 border rounded-lg bg-white shadow-sm">
                                <div className="text-sm font-medium text-gray-900 mb-2 break-words">
                                  {estrategia.estrategia}
                                </div>
                                <div className="text-base sm:text-lg font-semibold text-blue-600 break-words">
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
    </div>
  );
};

export default HistoricoMedidasAluno;
