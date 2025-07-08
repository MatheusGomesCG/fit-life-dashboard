
import React, { useState, useEffect } from "react";
import { Line } from "recharts";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { buscarProgressaoExercicio, ProgressaoProfessor } from "@/services/progressaoProfessorService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";

interface ProgressaoCargaProps {
  exerciseId: string;
  exerciseName: string;
}

const ProgressaoCarga: React.FC<ProgressaoCargaProps> = ({ exerciseId, exerciseName }) => {
  const { user } = useAuth();
  const [progressao, setProgressao] = useState<ProgressaoProfessor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProgressao = async () => {
      if (!user?.id || !exerciseId) return;
      
      try {
        setLoading(true);
        const data = await buscarProgressaoExercicio(user.id, exerciseId);
        setProgressao(data);
      } catch (error) {
        console.error('Erro ao carregar progressão:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarProgressao();
  }, [user?.id, exerciseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (progressao.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Progressão de Carga - {exerciseName}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Seu professor ainda não registrou nenhuma progressão para este exercício.
        </p>
      </div>
    );
  }

  const chartData = progressao
    .sort((a, b) => new Date(a.data_progressao).getTime() - new Date(b.data_progressao).getTime())
    .map(item => ({
      data: new Date(item.data_progressao).toLocaleDateString('pt-BR'),
      carga: item.carga_nova,
      observacoes: item.observacoes
    }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Progressão de Carga - {exerciseName}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value} kg`, 'Carga']}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="carga" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Histórico de Progressões:</h4>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {progressao.map(item => (
            <div key={item.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {new Date(item.data_progressao).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.carga_anterior} kg → {item.carga_nova} kg
                  </p>
                </div>
              </div>
              {item.observacoes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {item.observacoes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressaoCarga;
