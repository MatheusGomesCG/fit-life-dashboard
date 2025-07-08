
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Ruler } from "lucide-react";
import { buscarHistoricoMedidas } from "@/services/alunosService";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";

const EvolucaoMedidas: React.FC = () => {
  const { user } = useAuth();
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [medidaSelecionada, setMedidaSelecionada] = useState("peso");

  const medidasDisponiveis = [
    { value: "peso", label: "Peso (kg)" },
    { value: "altura", label: "Altura (cm)" },
    { value: "percentual_gordura", label: "% Gordura" },
    { value: "imc", label: "IMC" }
  ];

  useEffect(() => {
    const carregarHistorico = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const historico = await buscarHistoricoMedidas(user.id);
        
        const dadosFormatados = historico.map(registro => ({
          data: format(new Date(registro.data_medicao), "dd/MM"),
          dataCompleta: registro.data_medicao,
          peso: registro.peso,
          altura: registro.altura,
          percentual_gordura: registro.percentual_gordura,
          imc: registro.imc
        })).sort((a, b) => new Date(a.dataCompleta).getTime() - new Date(b.dataCompleta).getTime());

        setDados(dadosFormatados);
      } catch (error) {
        console.error("Erro ao carregar histórico de medidas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();
  }, [user?.id]);

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
            Evolução das Medidas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Ruler className="w-12 h-12 mb-4" />
          <p>Nenhum histórico de medidas encontrado</p>
          <p className="text-sm">Seu professor registrará suas medidas durante as avaliações</p>
        </CardContent>
      </Card>
    );
  }

  const medidaLabel = medidasDisponiveis.find(m => m.value === medidaSelecionada)?.label || "";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Evolução das Medidas
          </CardTitle>
          <Select value={medidaSelecionada} onValueChange={setMedidaSelecionada}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {medidasDisponiveis.map(medida => (
                <SelectItem key={medida.value} value={medida.value}>
                  {medida.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                formatter={(value) => [value, medidaLabel]}
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
                dataKey={medidaSelecionada}
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ r: 5 }}
                name={medidaLabel}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {dados.length > 1 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Primeira medição:</p>
                <p>{dados[0][medidaSelecionada]} {medidaLabel.includes('kg') ? 'kg' : medidaLabel.includes('cm') ? 'cm' : ''}</p>
                <p className="text-gray-500">{format(new Date(dados[0].dataCompleta), "dd/MM/yyyy")}</p>
              </div>
              <div>
                <p className="font-medium">Última medição:</p>
                <p>{dados[dados.length - 1][medidaSelecionada]} {medidaLabel.includes('kg') ? 'kg' : medidaLabel.includes('cm') ? 'cm' : ''}</p>
                <p className="text-gray-500">{format(new Date(dados[dados.length - 1].dataCompleta), "dd/MM/yyyy")}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EvolucaoMedidas;
