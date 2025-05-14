
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarDays, Clock4, Download, User, Youtube, Edit } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
        setLoading(true);
        // Buscar ficha de treino
        const fichaTreinoData = await buscarFichaTreinoAluno(id);
        
        if (fichaTreinoData) {
          setFichaTreino(fichaTreinoData);
        } else {
          // Se não encontrou ficha, buscar pelo menos os dados do aluno
          const aluno = await buscarAlunoPorId(id);
          setError(`Nenhuma ficha de treino encontrada para ${aluno.nome}`);
        }
      } catch (error) {
        console.error("Erro ao carregar ficha de treino:", error);
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
      navigate(`/cadastrar-treino/${id}`);
    }
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
      <div className="text-center py-8 space-y-4">
        <p className="text-red-500">{error || "Ficha de treino não encontrada"}</p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
          >
            Voltar
          </Button>
          {id && (
            <Button
              onClick={() => navigate(`/cadastrar-treino/${id}`)}
              variant="default"
            >
              Criar Ficha de Treino
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Ficha de Treino</h1>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1 text-gray-600">
              <User className="h-5 w-5" />
              <span>{fichaTreino.aluno.nome}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <CalendarDays className="h-5 w-5" />
              <span>{fichaTreino.aluno.idade} anos</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock4 className="h-5 w-5" />
              <span>Objetivo: {fichaTreino.aluno.objetivo || "Não definido"}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleEditarFicha}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar Ficha
          </Button>
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Accordion type="single" collapsible className="w-full">
          {Object.keys(exerciciosPorDia).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum exercício cadastrado para esta ficha de treino.
            </div>
          ) : (
            Object.entries(exerciciosPorDia).map(([dia, exercicios]) => (
              <AccordionItem key={dia} value={dia} className="px-4">
                <AccordionTrigger className="text-lg font-medium py-4">
                  {dia}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pb-4">
                    {exercicios.map((exercicio, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-medium text-gray-900">{exercicio.nomeExercicio}</h3>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Grupo Muscular:</span> {exercicio.grupoMuscular}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Carga:</span> {exercicio.cargaIdeal} kg
                            </p>
                            <p className="text-sm text-gray-600">
                              {exercicio.series} séries x {exercicio.repeticoes} repetições
                            </p>
                            {exercicio.estrategia && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Estratégia:</span> {exercicio.estrategia}
                              </p>
                            )}
                          </div>
                          {exercicio.videoUrl && (
                            <a
                              href={exercicio.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-fitness-primary hover:text-fitness-primary/80 flex items-center gap-1"
                            >
                              <Youtube className="h-5 w-5" />
                              <span className="text-sm">Ver vídeo</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default FichaTreino;
