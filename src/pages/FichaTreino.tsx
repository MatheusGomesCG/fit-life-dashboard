
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarDays, Clock4, Download, User, Youtube, Edit, ArrowLeft, PlusCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadPDF, gerarPDFFichaTreino } from '@/services/pdfService';
import { toast } from 'sonner';
import { buscarAlunoPorId, buscarFichaTreinoAluno, FichaTreino as FichaTreinoType } from '@/services/alunosService';
import LoadingSpinner from "@/components/LoadingSpinner";

const FichaTreino: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fichaTreino, setFichaTreino] = useState<FichaTreinoType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarFichaTreino = async () => {
      if (!id) {
        setError("ID do aluno não encontrado");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 [FichaTreino] Buscando ficha de treino para aluno:", id);
        setLoading(true);
        
        // Buscar ficha de treino do aluno
        const fichaTreinoData = await buscarFichaTreinoAluno(id);
        
        if (fichaTreinoData) {
          console.log("✅ [FichaTreino] Ficha de treino encontrada:", fichaTreinoData);
          setFichaTreino(fichaTreinoData);
        } else {
          // Se não encontrou ficha, buscar pelo menos os dados do aluno
          try {
            const aluno = await buscarAlunoPorId(id);
            setError(`Nenhuma ficha de treino encontrada para ${aluno.nome}`);
            console.log("⚠️ [FichaTreino] Ficha não encontrada para:", aluno.nome);
          } catch (alunoError) {
            console.error("❌ [FichaTreino] Erro ao buscar dados do aluno:", alunoError);
            setError("Aluno não encontrado");
          }
        }
      } catch (error) {
        console.error("❌ [FichaTreino] Erro ao carregar ficha de treino:", error);
        setError("Erro ao carregar ficha de treino");
      } finally {
        setLoading(false);
      }
    };

    carregarFichaTreino();
  }, [id]);

  // Group exercises by day
  const exerciciosPorDia = fichaTreino?.exercicios.reduce((acc, exercicio) => {
    if (!exercicio.diaTreino) return acc;
    
    if (!acc[exercicio.diaTreino]) {
      acc[exercicio.diaTreino] = [];
    }
    acc[exercicio.diaTreino].push(exercicio);
    return acc;
  }, {} as Record<string, typeof fichaTreino.exercicios>) || {};

  const handleDownloadPDF = () => {
    try {
      if (!fichaTreino) {
        toast.error('Nenhuma ficha de treino para baixar');
        return;
      }

      const doc = gerarPDFFichaTreino(fichaTreino);
      downloadPDF(doc, `ficha-treino-${fichaTreino.aluno.nome.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      toast.success('PDF da ficha de treino baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar o PDF da ficha de treino');
    }
  };

  const handleEditarFicha = () => {
    if (id) {
      console.log("🔄 [FichaTreino] Navegando para editar ficha:", `/cadastrar-treino/${id}`);
      navigate(`/cadastrar-treino/${id}`);
    }
  };

  const handleCriarExercicios = () => {
    if (id) {
      console.log("✨ [FichaTreino] Navegando para criar exercícios:", `/cadastrar-treino/${id}`);
      navigate(`/cadastrar-treino/${id}`);
    }
  };

  const handleVoltar = () => {
    console.log("⬅️ [FichaTreino] Voltando para página anterior");
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !fichaTreino) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header com botão voltar */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoltar}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                Ficha de Treino
              </h1>
            </div>
          </div>

          <Card>
            <CardContent className="text-center py-8 space-y-4">
              <div className="text-red-500 mb-4">
                <p>{error || "Ficha de treino não encontrada"}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  onClick={handleVoltar}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
                {id && (
                  <Button
                    onClick={handleCriarExercicios}
                    variant="default"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Criar Ficha de Treino
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header responsivo */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoltar}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
              Ficha de Treino
            </h1>
          </div>
        </div>

        {/* Card de informações do aluno */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <div className="space-y-3">
                <CardTitle className="text-lg md:text-xl">
                  Informações do Aluno
                </CardTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{fichaTreino.aluno.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>{fichaTreino.aluno.idade} anos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock4 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">Objetivo: {fichaTreino.aluno.objetivo || "Não definido"}</span>
                  </div>
                </div>
              </div>
              
              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Button
                  onClick={handleEditarFicha}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 justify-center"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Editar Ficha</span>
                  <span className="sm:hidden">Editar</span>
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 justify-center"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Baixar PDF</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Card de exercícios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Exercícios do Treino
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(exerciciosPorDia).length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="text-gray-500 mb-4">
                  <p className="text-sm md:text-base">Nenhum exercício cadastrado para esta ficha de treino.</p>
                </div>
                <Button
                  onClick={handleCriarExercicios}
                  variant="default"
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  <PlusCircle className="h-4 w-4" />
                  Criar Exercícios
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {Object.entries(exerciciosPorDia).map(([dia, exercicios]) => (
                  <AccordionItem key={dia} value={dia} className="border rounded-lg">
                    <AccordionTrigger className="text-sm md:text-base font-medium px-4 py-3 hover:no-underline">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="font-semibold">{dia}</span>
                        <span className="text-xs md:text-sm text-gray-500">
                          ({exercicios.length} exercício{exercicios.length > 1 ? 's' : ''})
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {exercicios.map((exercicio, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3 md:p-4">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                              <div className="space-y-2 flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">
                                  {exercicio.nomeExercicio}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-gray-600">
                                  <p>
                                    <span className="font-medium">Grupo:</span> {exercicio.grupoMuscular}
                                  </p>
                                  <p>
                                    <span className="font-medium">Carga:</span> {exercicio.cargaIdeal} kg
                                  </p>
                                  <p className="sm:col-span-2">
                                    <span className="font-medium">Séries/Rep:</span> {exercicio.series} x {exercicio.repeticoes}
                                  </p>
                                  {exercicio.estrategia && (
                                    <p className="sm:col-span-2">
                                      <span className="font-medium">Estratégia:</span> {exercicio.estrategia}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {exercicio.videoUrl && (
                                <div className="flex-shrink-0">
                                  <a
                                    href={exercicio.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-500 hover:text-orange-600 flex items-center gap-1 text-xs md:text-sm transition-colors"
                                  >
                                    <Youtube className="h-4 w-4" />
                                    <span>Ver vídeo</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FichaTreino;
