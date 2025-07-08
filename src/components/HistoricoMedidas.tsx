
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MedidaHistorico {
  id: string;
  data_medicao: string;
  peso?: number;
  altura?: number;
  percentual_gordura?: number;
  imc?: number;
  medidas_corporais?: {
    peitoral?: number;
    cintura?: number;
    quadril?: number;
    braco_direito?: number;
    braco_esquerdo?: number;
    coxa_direita?: number;
    coxa_esquerda?: number;
    panturrilha_direita?: number;
    panturrilha_esquerda?: number;
  };
  dobras_cutaneas?: {
    triceps?: number;
    biceps?: number;
    subescapular?: number;
    suprailliaca?: number;
    abdominal?: number;
    coxa?: number;
    panturrilha?: number;
  };
  observacoes?: string;
}

interface HistoricoMedidasProps {
  medidas: MedidaHistorico[];
  loading?: boolean;
}

const HistoricoMedidas: React.FC<HistoricoMedidasProps> = ({ medidas, loading = false }) => {
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [periodoMeses, setPeriodoMeses] = useState<number>(6);

  // Filtrar dados por período
  const dataLimite = new Date();
  dataLimite.setMonth(dataLimite.getMonth() - periodoMeses);
  
  const medidasFiltradas = medidas.filter(medida => {
    const dataMedicao = new Date(medida.data_medicao);
    return dataMedicao >= dataLimite;
  }).sort((a, b) => new Date(a.data_medicao).getTime() - new Date(b.data_medicao).getTime());

  // Preparar dados para gráfico
  const dadosGrafico = medidasFiltradas.map(medida => ({
    data: format(new Date(medida.data_medicao), "dd/MM", { locale: ptBR }),
    dataCompleta: format(new Date(medida.data_medicao), "dd/MM/yyyy", { locale: ptBR }),
    peso: medida.peso || 0,
    percentualGordura: medida.percentual_gordura || 0,
    imc: medida.imc || 0,
    peitoral: medida.medidas_corporais?.peitoral || 0,
    cintura: medida.medidas_corporais?.cintura || 0,
    quadril: medida.medidas_corporais?.quadril || 0,
    bracoDireito: medida.medidas_corporais?.braco_direito || 0,
  }));

  // Função para calcular tendência
  const calcularTendencia = (dados: number[]) => {
    if (dados.length < 2) return null;
    const primeiro = dados[0];
    const ultimo = dados[dados.length - 1];
    const diferenca = ultimo - primeiro;
    const percentual = (diferenca / primeiro) * 100;
    
    return {
      valor: diferenca,
      percentual: Math.abs(percentual),
      tipo: diferenca > 0 ? 'aumento' : diferenca < 0 ? 'diminuicao' : 'estavel'
    };
  };

  // Calcular tendências
  const pesoValues = dadosGrafico.map(d => d.peso).filter(v => v > 0);
  const gorduraValues = dadosGrafico.map(d => d.percentualGordura).filter(v => v > 0);
  const imcValues = dadosGrafico.map(d => d.imc).filter(v => v > 0);

  const tendenciaPeso = calcularTendencia(pesoValues);
  const tendenciaGordura = calcularTendencia(gorduraValues);
  const tendenciaIMC = calcularTendencia(imcValues);

  const renderTendencia = (tendencia: any, unidade: string = '') => {
    if (!tendencia) return <span className="text-gray-400">-</span>;
    
    const IconComponent = tendencia.tipo === 'aumento' ? TrendingUp : 
                         tendencia.tipo === 'diminuicao' ? TrendingDown : Minus;
    
    const cor = tendencia.tipo === 'aumento' ? 'text-red-500' : 
                tendencia.tipo === 'diminuicao' ? 'text-green-500' : 'text-gray-500';

    return (
      <div className={`flex items-center ${cor}`}>
        <IconComponent className="h-4 w-4 mr-1" />
        <span className="text-sm">
          {Math.abs(tendencia.valor).toFixed(1)}{unidade} ({tendencia.percentual.toFixed(1)}%)
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (medidas.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma medida registrada ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <Select value={periodoMeses.toString()} onValueChange={(value) => setPeriodoMeses(Number(value))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="12">Último ano</SelectItem>
            <SelectItem value="24">Últimos 2 anos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tipo de medida" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as medidas</SelectItem>
            <SelectItem value="peso">Peso e IMC</SelectItem>
            <SelectItem value="corporais">Medidas corporais</SelectItem>
            <SelectItem value="dobras">Dobras cutâneas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pesoValues.length > 0 ? `${pesoValues[pesoValues.length - 1].toFixed(1)} kg` : '-'}
            </div>
            {renderTendencia(tendenciaPeso, 'kg')}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">% Gordura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gorduraValues.length > 0 ? `${gorduraValues[gorduraValues.length - 1].toFixed(1)}%` : '-'}
            </div>
            {renderTendencia(tendenciaGordura, '%')}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">IMC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {imcValues.length > 0 ? imcValues[imcValues.length - 1].toFixed(1) : '-'}
            </div>
            {renderTendencia(tendenciaIMC)}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      {(filtroTipo === "todos" || filtroTipo === "peso") && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Peso</CardTitle>
            <CardDescription>
              Acompanhe a variação do seu peso ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label, payload) => {
                      const item = dadosGrafico.find(d => d.data === label);
                      return item ? item.dataCompleta : label;
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
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {(filtroTipo === "todos" || filtroTipo === "peso") && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Gordura Corporal</CardTitle>
            <CardDescription>
              Monitore seu percentual de gordura corporal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label, payload) => {
                      const item = dadosGrafico.find(d => d.data === label);
                      return item ? item.dataCompleta : label;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="percentualGordura"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Gordura (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {(filtroTipo === "todos" || filtroTipo === "corporais") && (
        <Card>
          <CardHeader>
            <CardTitle>Medidas Corporais</CardTitle>
            <CardDescription>
              Evolução das principais medidas corporais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label, payload) => {
                      const item = dadosGrafico.find(d => d.data === label);
                      return item ? item.dataCompleta : label;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="peitoral"
                    stroke="#ff7300"
                    strokeWidth={2}
                    name="Peitoral (cm)"
                  />
                  <Line
                    type="monotone"
                    dataKey="cintura"
                    stroke="#8dd1e1"
                    strokeWidth={2}
                    name="Cintura (cm)"
                  />
                  <Line
                    type="monotone"
                    dataKey="quadril"
                    stroke="#d084d0"
                    strokeWidth={2}
                    name="Quadril (cm)"
                  />
                  <Line
                    type="monotone"
                    dataKey="bracoDireito"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Braço (cm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela de dados históricos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Completo</CardTitle>
          <CardDescription>
            Todas as medições registradas no período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Peso (kg)</th>
                  <th className="text-left p-2">% Gordura</th>
                  <th className="text-left p-2">IMC</th>
                  <th className="text-left p-2">Observações</th>
                </tr>
              </thead>
              <tbody>
                {medidasFiltradas.reverse().map((medida) => (
                  <tr key={medida.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {format(new Date(medida.data_medicao), "dd/MM/yyyy", { locale: ptBR })}
                    </td>
                    <td className="p-2">{medida.peso?.toFixed(1) || '-'}</td>
                    <td className="p-2">{medida.percentual_gordura?.toFixed(1) || '-'}%</td>
                    <td className="p-2">{medida.imc?.toFixed(1) || '-'}</td>
                    <td className="p-2 max-w-xs truncate">{medida.observacoes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricoMedidas;
