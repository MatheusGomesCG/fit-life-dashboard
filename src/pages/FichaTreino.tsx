
import React from 'react';
import { CalendarDays, Clock4, Download, User, Youtube } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { downloadPDF, gerarPDFFichaTreino } from '@/services/pdfService';
import { toast } from 'sonner';

const FichaTreino: React.FC = () => {
  // Mock data for demonstration
  const aluno = {
    nome: "João Silva",
    idade: 28,
    objetivo: "Hipertrofia",
  };

  const treino = {
    exercicios: [
      { 
        nome: "Supino Reto", 
        series: 3, 
        repeticoes: "8-12",
        diaTreino: "Segunda-feira",
        estrategia: "Drop-set na última série",
        videoUrl: "https://youtube.com/watch?v=v1"
      },
      { 
        nome: "Agachamento Livre", 
        series: 3, 
        repeticoes: "8-12",
        diaTreino: "Segunda-feira",
        estrategia: "Pausa de 2s no fundo",
        videoUrl: "https://youtube.com/watch?v=v2"
      },
      { 
        nome: "Remada Curvada", 
        series: 3, 
        repeticoes: "8-12",
        diaTreino: "Quarta-feira",
        estrategia: "Contração máxima no pico",
        videoUrl: "https://youtube.com/watch?v=v3"
      },
      { 
        nome: "Desenvolvimento", 
        series: 3, 
        repeticoes: "10-12",
        diaTreino: "Quarta-feira",
        estrategia: "Pirâmide crescente",
        videoUrl: "https://youtube.com/watch?v=v4"
      }
    ]
  };

  // Group exercises by day
  const exerciciosPorDia = treino.exercicios.reduce((acc, exercicio) => {
    if (!acc[exercicio.diaTreino]) {
      acc[exercicio.diaTreino] = [];
    }
    acc[exercicio.diaTreino].push(exercicio);
    return acc;
  }, {} as Record<string, typeof treino.exercicios>);

  const handleDownloadPDF = () => {
    try {
      const ficha = {
        aluno: {
          nome: aluno.nome,
          idade: aluno.idade,
          peso: 70, // Valores mockados para exemplo
          altura: 170,
          imc: 24.2,
          percentualGordura: 15,
          experiencia: "intermediario" as const, // Using a type assertion to ensure this matches the expected type
          // Adding the missing required properties
          genero: "masculino" as const, // Using a type assertion to ensure this is one of the allowed literal values
          dobrasCutaneas: {
            triceps: 10,
            subescapular: 12,
            axilarMedia: 8,
            peitoral: 7,
            suprailiaca: 14,
            abdominal: 18,
            coxa: 15
          }
        },
        dataAvaliacao: new Date().toISOString(), // Convert Date to ISO string format
        exercicios: treino.exercicios.map(ex => ({
          nomeExercicio: ex.nome,
          grupoMuscular: "Grupo", // Mockado para exemplo
          series: ex.series,
          repeticoes: Number(ex.repeticoes.split('-')[0]),
          cargaIdeal: 20, // Mockado para exemplo
          diaTreino: ex.diaTreino,
          estrategia: ex.estrategia || "",
          videoUrl: ex.videoUrl || ""
        }))
      };

      const doc = gerarPDFFichaTreino(ficha);
      downloadPDF(doc, `ficha-treino-${aluno.nome.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      toast.success('PDF da ficha de treino baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar o PDF da ficha de treino');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Ficha de Treino</h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-gray-600">
                <User className="h-5 w-5" />
                <span>{aluno.nome}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <CalendarDays className="h-5 w-5" />
                <span>{aluno.idade} anos</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock4 className="h-5 w-5" />
                <span>Objetivo: {aluno.objetivo}</span>
              </div>
            </div>
          </div>
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
          {Object.entries(exerciciosPorDia).map(([dia, exercicios]) => (
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
                          <h3 className="font-medium text-gray-900">{exercicio.nome}</h3>
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
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FichaTreino;
