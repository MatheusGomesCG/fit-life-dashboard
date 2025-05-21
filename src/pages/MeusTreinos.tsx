
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { buscarFichaTreinoAluno } from "@/services/alunosService";
import LoadingSpinner from "@/components/LoadingSpinner";

const MeusTreinos: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [treinos, setTreinos] = useState<any[]>([]);
  const [temFichaTreino, setTemFichaTreino] = useState(false);

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
                {treino.exercicios.map((exercicio, idx) => (
                  <li key={idx} className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
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
                      {exercicio.videoUrl && (
                        <a 
                          href={exercicio.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-fitness-secondary hover:underline flex items-center"
                        >
                          Ver vídeo
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeusTreinos;
