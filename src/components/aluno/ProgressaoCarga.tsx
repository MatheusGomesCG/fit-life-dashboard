
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Dumbbell } from "lucide-react";
import { buscarProgressaoCarga } from "@/services/progressaoService";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";

interface ProgressaoCargaProps {
  exerciseId: string;
  exerciseName: string;
}

const ProgressaoCarga: React.FC<ProgressaoCargaProps> = ({ exerciseId, exerciseName }) => {
  const { user } = useAuth();
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProgressao = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const registros = await buscarProgressaoCarga(user.id, exerciseId);
        
        const dadosFormatados = registros.map(registro => ({
          data: format(new Date(registro.data), "dd/MM"),
          dataCompleta: registro.data,
          peso: registro.peso,
          repeticoes: registro.repeticoes
        }));

        setDados(dadosFormatados);
      } catch (error) {
        console.error("Erro ao carregar progressão:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProgressao();
  }, [user?.id, exerciseId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (dados.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Progressão de Carga - {exerciseName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Dumbbell className="w-12 h-12 mb-4" />
          <p>Nenhum registro de carga encontrado</p>
          <p className="text-sm">Comece a registrar suas cargas para ver sua evolução!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Progressão de Carga - {exerciseName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="data" 
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}${name === 'peso' ? 'kg' : ''}`,
                  name === 'peso' ? 'Peso' : 'Repetições'
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return format(new Date(payload[0].payload.dataCompleta), "dd/MM/yyyy");
                  }
                  return label;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Peso (kg)"
              />
              <Line
                type="monotone"
                dataKey="repeticoes"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Repetições"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {dados.length > 1 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Primeiro registro:</p>
                <p>{dados[0].peso}kg × {dados[0].repeticoes} reps</p>
                <p className="text-gray-500">{format(new Date(dados[0].dataCompleta), "dd/MM/yyyy")}</p>
              </div>
              <div>
                <p className="font-medium">Último registro:</p>
                <p>{dados[dados.length - 1].peso}kg × {dados[dados.length - 1].repeticoes} reps</p>
                <p className="text-gray-500">{format(new Date(dados[dados.length - 1].dataCompleta), "dd/MM/yyyy")}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressaoCarga;
