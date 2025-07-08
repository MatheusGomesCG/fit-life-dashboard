
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { buscarAlunoPorId, buscarFichaTreinoAluno, FichaTreino as FichaTreinoType, Aluno } from "@/services/alunosService";
import { downloadPDFFichaTreino } from "@/services/pdfService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Edit, Plus } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const FichaTreino: React.FC = () => {
  const { alunoId } = useParams<{ alunoId: string }>();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [ficha, setFicha] = useState<FichaTreinoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      if (!alunoId) return;
      
      try {
        setLoading(true);
        const [alunoData, fichaData] = await Promise.all([
          buscarAlunoPorId(alunoId),
          buscarFichaTreinoAluno(alunoId)
        ]);
        
        setAluno(alunoData);
        setFicha(fichaData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar ficha de treino.");
        navigate("/gerenciar-ficha-treino");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [alunoId, navigate]);

  const handleDownloadPDF = () => {
    if (ficha && aluno) {
      downloadPDFFichaTreino(ficha, aluno.nome);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!aluno || !ficha) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          {!aluno ? "Aluno não encontrado." : "Ficha de treino não encontrada."}
        </p>
        <Button onClick={() => navigate("/gerenciar-ficha-treino")} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  // Agrupar exercícios por dia de treino
  const exerciciosPorDia = ficha.exercicios.reduce((acc, exercicio) => {
    if (!acc[exercicio.diaTreino]) {
      acc[exercicio.diaTreino] = [];
    }
    acc[exercicio.diaTreino].push(exercicio);
    return acc;
  }, {} as Record<string, typeof ficha.exercicios>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/gerenciar-ficha-treino")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ficha de Treino</h1>
            <p className="text-gray-600 mt-1">
              {aluno.nome} - {aluno.email}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleDownloadPDF} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={() => navigate(`/cadastrar-treino/${alunoId}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Treino
          </Button>
        </div>
      </div>

      {/* Informações do Aluno */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Idade</span>
              <p className="font-medium">{aluno.idade} anos</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Peso</span>
              <p className="font-medium">{aluno.peso} kg</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Altura</span>
              <p className="font-medium">{aluno.altura} cm</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Experiência</span>
              <p className="font-medium capitalize">{aluno.experiencia}</p>
            </div>
          </div>
          {aluno.objetivo && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500">Objetivo</span>
              <p className="font-medium">{aluno.objetivo}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercícios por Dia */}
      {Object.keys(exerciciosPorDia).length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhum exercício cadastrado ainda.</p>
            <Button onClick={() => navigate(`/cadastrar-treino/${alunoId}`)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Exercícios
            </Button>
          </CardContent>
        </Card>
      ) : (
        Object.entries(exerciciosPorDia).map(([dia, exerciciosDia]) => (
          <Card key={dia}>
            <CardHeader>
              <CardTitle>Treino {dia}</CardTitle>
              <CardDescription>
                {exerciciosDia.length} exercício{exerciciosDia.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exerciciosDia.map((exercicio, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-lg">{exercicio.nomeExercicio}</h4>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {exercicio.grupoMuscular}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-500">Séries</span>
                        <p className="font-medium">{exercicio.series}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Repetições</span>
                        <p className="font-medium">{exercicio.repeticoes}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Carga</span>
                        <p className="font-medium">{exercicio.cargaIdeal} kg</p>
                      </div>
                    </div>
                    
                    {exercicio.equipamento && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Equipamento: </span>
                        <span className="text-sm">{exercicio.equipamento}</span>
                      </div>
                    )}
                    
                    {exercicio.estrategia && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Estratégia: </span>
                        <span className="text-sm">{exercicio.estrategia}</span>
                      </div>
                    )}
                    
                    {exercicio.instrucoes && (
                      <div>
                        <span className="text-sm text-gray-500">Instruções: </span>
                        <p className="text-sm text-gray-700">{exercicio.instrucoes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default FichaTreino;
