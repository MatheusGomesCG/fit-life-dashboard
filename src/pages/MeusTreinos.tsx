
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FileText, Calendar, ArrowRight, Activity } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FichaTreino } from '@/services/alunosService';

interface TreinoAluno {
  id: string;
  nome: string;
  dataAvaliacao: string;
  gruposMusculares: string[];
  totalExercicios: number;
}

const MeusTreinos: React.FC = () => {
  const [treinos, setTreinos] = useState<TreinoAluno[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTreinos = async () => {
      try {
        setLoading(true);
        
        // Este é um mock. Em um sistema real, você faria uma chamada API
        // usando o ID do aluno para obter os treinos específicos dele
        // await api.get(`/alunos/${user?.id}/treinos`);
        
        setTimeout(() => {
          // Mock data
          const mockTreinos: TreinoAluno[] = [
            {
              id: 'treino_1',
              nome: 'Treino Principal',
              dataAvaliacao: new Date().toISOString(),
              gruposMusculares: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps'],
              totalExercicios: 12
            },
            {
              id: 'treino_2',
              nome: 'Treino de Recuperação',
              dataAvaliacao: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              gruposMusculares: ['Abdômen', 'Glúteos', 'Panturrilha'],
              totalExercicios: 6
            }
          ];
          
          setTreinos(mockTreinos);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao buscar treinos:', error);
        toast.error('Não foi possível carregar seus treinos');
        setLoading(false);
      }
    };

    fetchTreinos();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meus Treinos</h1>
        <p className="text-gray-600 mt-1">Visualize e acompanhe seus treinos personalizados</p>
      </div>

      {treinos.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow border border-gray-200 p-12">
          <FileText className="text-gray-400 h-12 w-12 mb-4" />
          <h2 className="text-xl font-medium text-gray-700">Nenhum treino disponível</h2>
          <p className="text-gray-500 mt-2 text-center">
            Você ainda não possui treinos cadastrados. Entre em contato com seu professor para solicitar um treino personalizado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {treinos.map((treino) => (
            <div
              key={treino.id}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{treino.nome}</h3>
                    <p className="text-sm text-gray-500">
                      Atualizado em {new Date(treino.dataAvaliacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="bg-fitness-primary/10 text-fitness-primary font-medium rounded-full text-xs px-2.5 py-1 flex items-center">
                    <Activity className="w-3 h-3 mr-1" />
                    <span>{treino.totalExercicios} exercícios</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Grupos Musculares</h4>
                    <div className="flex flex-wrap gap-2">
                      {treino.gruposMusculares.map((grupo) => (
                        <span
                          key={grupo}
                          className="bg-gray-100 text-gray-800 text-xs font-medium rounded-md px-2.5 py-1"
                        >
                          {grupo}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-fitness-primary" />
                    <span>Treinos definidos por dia da semana</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/meus-treinos/${treino.id}`)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-fitness-primary text-white py-2 px-4 rounded-md hover:bg-fitness-primary/90 transition-colors"
                >
                  <span>Ver detalhes do treino</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Progresso e Dicas</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm">
            <h3 className="font-medium text-blue-700 mb-1">Lembre-se de se hidratar</h3>
            <p className="text-blue-600">
              Beba água antes, durante e após seus treinos para manter seu corpo hidratado.
            </p>
          </div>
          
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-sm">
            <h3 className="font-medium text-amber-700 mb-1">Descanso é importante</h3>
            <p className="text-amber-600">
              Garanta de 7 a 8 horas de sono para permitir que seus músculos se recuperem adequadamente.
            </p>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 text-sm">
            <h3 className="font-medium text-green-700 mb-1">Alimentação adequada</h3>
            <p className="text-green-600">
              Mantenha uma dieta balanceada rica em proteínas para auxiliar na recuperação muscular.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeusTreinos;
