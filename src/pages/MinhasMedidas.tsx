
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { buscarAlunoPorId, Aluno, FotoAluno } from "@/services/alunosService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";

const MinhasMedidas: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [fotos, setFotos] = useState<FotoAluno[]>([]);

  // Dados fictícios de progresso para demonstração
  const progressoData = [
    { data: '2025-01-15', peso: 75.5, percentualGordura: 15.4 },
    { data: '2025-02-15', peso: 74.2, percentualGordura: 14.8 },
    { data: '2025-03-15', peso: 73.1, percentualGordura: 14.3 },
    { data: '2025-04-15', peso: 72.5, percentualGordura: 13.9 },
    { data: '2025-05-15', peso: 71.8, percentualGordura: 13.5 },
  ];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        if (user?.id) {
          const alunoData = await buscarAlunoPorId(user.id);
          setAluno(alunoData);
          setFotos(alunoData?.fotos || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar seus dados.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Dados não encontrados. Por favor, entre em contato com seu professor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Minhas Medidas</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe sua evolução física e resultados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Dados Atuais</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Peso</p>
              <p className="font-medium text-xl">{aluno.peso} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Altura</p>
              <p className="font-medium text-xl">{aluno.altura} cm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">IMC</p>
              <p className="font-medium text-xl">{aluno.imc?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">% de Gordura</p>
              <p className="font-medium text-xl">{aluno.percentualGordura?.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Evolução do Peso</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={progressoData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="data" 
                  tickFormatter={(value) => format(new Date(value), "dd/MM")}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), "dd/MM/yyyy")}
                  formatter={(value) => [`${value}`, value === progressoData[0].peso ? 'Peso (kg)' : '% Gordura']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Peso (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Evolução da Gordura Corporal</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progressoData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="data"
                tickFormatter={(value) => format(new Date(value), "dd/MM")}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => format(new Date(value), "dd/MM/yyyy")}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="percentualGordura"
                stroke="#82ca9d"
                name="Gordura (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Registro Fotográfico</h2>
        
        {fotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {fotos.map((foto) => (
              <div key={foto.id} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="aspect-square w-full overflow-hidden bg-gray-100">
                  <img 
                    src={foto.url} 
                    alt={foto.descricao || "Registro fotográfico"} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 bg-gray-50">
                  <p className="text-xs text-gray-500">{format(new Date(foto.data || foto.data_upload), "dd/MM/yyyy")}</p>
                  {foto.descricao && <p className="text-sm">{foto.descricao}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500">
            Nenhum registro fotográfico disponível ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default MinhasMedidas;
