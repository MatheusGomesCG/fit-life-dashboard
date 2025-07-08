import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FileText, Calendar, ArrowRight, Play } from "lucide-react";
import { buscarFichaTreinoAluno } from "@/services/alunosService";
import LoadingSpinner from "@/components/LoadingSpinner";
import CheckinExercicio from "@/components/aluno/CheckinExercicio";
import FeedbackTreino from "@/components/aluno/FeedbackTreino";
import ProgressaoCarga from "@/components/aluno/ProgressaoCarga";
import YouTubeModal from "@/components/YouTubeModal";

const MeusTreinos: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [treinos, setTreinos] = useState<any[]>([]);
  const [temFichaTreino, setTemFichaTreino] = useState(false);
  const [videoModal, setVideoModal] = useState<{isOpen: boolean, url: string, exercicioNome: string}>({
    isOpen: false,
    url: "",
    exercicioNome: ""
  });
  const [progressaoModal, setProgressaoModal] = useState<{isOpen: boolean, exerciseId: string, exerciseName: string}>({
    isOpen: false,
    exerciseId: "",
    exerciseName: ""
  });

  useEffect(() => {
    const carregarTreinos = async () => {
      try {
        setLoading(true);
        
        if (user?.id) {
          const fichaTreino = await buscarFichaTreinoAluno(user.id);
          
          if (fichaTreino && fichaTreino.exercicios) {
            setTemFichaTreino(true);
            
            // Agrupar exercícios por dia da semana
            const treinosPorDia = fichaTreino.exercicios.reduce((acc, exercicio) => {
              const dia = exercicio.diaTreino || "Sem dia definido";
              
              if (!acc[dia]) {
                acc[dia] = [];
              }
              
              acc[dia].push(exercicio);
              return acc;
            }, {} as Record<string, any[]>);
            
            // Converter para array para renderização
            const treinosArray = Object.entries(treinosPorDia).map(([dia, exercicios]) => ({
              dia,
              exercicios
            }));
            
            setTreinos(treinosArray);
          } else {
            setTemFichaTreino(false);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar treinos:", error);
        toast.error("Erro ao carregar seus treinos.");
      } finally {
        setLoading(false);
      }
    };

    carregarTreinos();
  }, [user]);

  const handleVideoClick = (url: string, nome: string) => {
    setVideoModal({
      isOpen: true,
      url,
      exercicioNome: nome
    });
  };

  const handleProgressaoClick = (exerciseId: string, exerciseName: string) => {
    setProgressaoModal({
      isOpen: true,
      exerciseId,
      exerciseName
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!temFichaTreino) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Meus Treinos</h1>
          <p className="text-gray-600 mt-1">
            Visualize seus exercícios e plano de treinamento
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum treino encontrado</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Você ainda não possui uma ficha de treino. Entre em contato com seu professor para criar seu plano de treinamento personalizado.
          </p>
          <button
            onClick={() => navigate("/agendamento")}
            className="mt-6 px-4 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 inline-flex items-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar avaliação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Meus Treinos</h1>
        <p className="text-gray-600 mt-1">
          Visualize seus exercícios e plano de treinamento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {treinos.map((treino, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-fitness-primary text-white py-3 px-4">
              <h2 className="text-lg font-semibold">{treino.dia}</h2>
            </div>
            <div className="p-4">
              <ul className="divide-y divide-gray-100">
                {treino.exercicios.map((exercicio, idx) => {
                  console.log("🔍 [MeusTreinos] Exercício:", {
                    id: exercicio.id,
                    nome: exercicio.nomeExercicio,
                    index: idx
                  });
                  
                  return (
                    <li key={exercicio.id || `exercicio-${idx}`} className="py-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{exercicio.nomeExercicio}</h3>
                          <p className="text-sm text-gray-600">{exercicio.grupoMuscular}</p>
                          <div className="mt-1 text-sm">
                            <span className="mr-3 text-gray-900">{exercicio.series} séries</span>
                            <span className="text-gray-900">{exercicio.repeticoes} repetições</span>
                            {exercicio.cargaIdeal > 0 && (
                              <span className="ml-3 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-md">
                                {exercicio.cargaIdeal} kg
                              </span>
                            )}
                          </div>
                          {exercicio.estrategia && (
                            <p className="mt-1 text-xs text-gray-500 italic">{exercicio.estrategia}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          {exercicio.videoUrl && (
                            <button
                              onClick={() => handleVideoClick(exercicio.videoUrl, exercicio.nomeExercicio)}
                              className="text-xs text-fitness-secondary hover:underline flex items-center"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Vídeo
                            </button>
                          )}
                          <button
                            onClick={() => handleProgressaoClick(exercicio.id, exercicio.nomeExercicio)}
                            className="text-xs text-blue-600 hover:underline flex items-center"
                          >
                            <ArrowRight className="w-3 h-3 mr-1" />
                            Progressão
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        {exercicio.id && exercicio.id !== 'undefined' ? (
                          <CheckinExercicio
                            exerciseId={exercicio.id}
                            exerciseName={exercicio.nomeExercicio}
                          />
                        ) : (
                          <div className="text-xs text-gray-500 italic">
                            ID do exercício não disponível
                          </div>
                        )}
                        <FeedbackTreino
                          exerciseId={exercicio.id}
                          exerciseName={exercicio.nomeExercicio}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback geral do treino */}
      <div className="mt-8">
        <FeedbackTreino />
      </div>

      {/* Modais */}
      <YouTubeModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({isOpen: false, url: "", exercicioNome: ""})}
        videoUrl={videoModal.url}
        exercicioNome={videoModal.exercicioNome}
      />

      {progressaoModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Progressão de Carga</h2>
              <button
                onClick={() => setProgressaoModal({isOpen: false, exerciseId: "", exerciseName: ""})}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <ProgressaoCarga
                exerciseId={progressaoModal.exerciseId}
                exerciseName={progressaoModal.exerciseName}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeusTreinos;
