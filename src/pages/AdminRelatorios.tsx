import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

interface FiltrosRelatorio {
  dataInicio: Date | null;
  dataFim: Date | null;
  tipoPlano: string;
  statusTransacao: string;
}

interface DadosReceita {
  mes: string;
  receita: number;
  crescimento: number;
  transacoes: number;
}

interface EstatisticasGerais {
  receitaTotal: number;
  crescimentoMensal: number;
  totalTransacoes: number;
  receitaMedia: number;
}

const AdminRelatorios: React.FC = () => {
  const navigate = useNavigate();
  
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    dataInicio: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
    dataFim: new Date(),
    tipoPlano: "todos",
    statusTransacao: "todos"
  });

  const [dadosReceita, setDadosReceita] = useState<DadosReceita[]>([]);
  const [estatisticasGerais, setEstatisticasGerais] = useState<EstatisticasGerais>({
    receitaTotal: 0,
    crescimentoMensal: 0,
    totalTransacoes: 0,
    receitaMedia: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const chartConfig = {
    receita: {
      label: "Receita (R$)",
    },
    transacoes: {
      label: "Transações",
    },
  };

  const coresGrafico = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  useEffect(() => {
    carregarDadosRelatorio();
  }, [filtros]);

  const carregarDadosRelatorio = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 [AdminRelatorios] Carregando dados do relatório...", filtros);

      // Buscar transações com filtros
      let query = supabase
        .from('professor_transacoes')
        .select(`
          *,
          professor_planos(tipo_plano)
        `)
        .eq('status', 'pago');

      if (filtros.dataInicio) {
        query = query.gte('data_pagamento', filtros.dataInicio.toISOString());
      }

      if (filtros.dataFim) {
        query = query.lte('data_pagamento', filtros.dataFim.toISOString());
      }

      if (filtros.statusTransacao !== 'todos') {
        query = query.eq('status', filtros.statusTransacao);
      }

      const { data: transacoes, error } = await query.order('data_pagamento', { ascending: true });

      if (error) {
        console.error("❌ [AdminRelatorios] Erro ao buscar transações:", error);
        throw error;
      }

      console.log("📊 [AdminRelatorios] Transações encontradas:", transacoes?.length || 0);

      // Processar dados para o gráfico
      const dadosPorMes = processarDadosPorMes(transacoes || []);
      setDadosReceita(dadosPorMes);

      // Calcular estatísticas gerais
      const stats = calcularEstatisticas(transacoes || [], dadosPorMes);
      setEstatisticasGerais(stats);

    } catch (error) {
      console.error("❌ [AdminRelatorios] Erro ao carregar relatório:", error);
      toast.error("Erro ao carregar relatórios financeiros");
    } finally {
      setIsLoading(false);
    }
  };

  const processarDadosPorMes = (transacoes: any[]): DadosReceita[] => {
    const dadosPorMes = new Map<string, { receita: number; transacoes: number }>();

    transacoes.forEach(transacao => {
      const data = new Date(transacao.data_pagamento);
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      const nomeMonths = data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      if (!dadosPorMes.has(chave)) {
        dadosPorMes.set(chave, { receita: 0, transacoes: 0 });
      }
      
      const dados = dadosPorMes.get(chave)!;
      dados.receita += Number(transacao.valor);
      dados.transacoes += 1;
    });

    // Converter para array e calcular crescimento
    const dadosOrdenados = Array.from(dadosPorMes.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([chave, dados], index, array) => {
        const [ano, mes] = chave.split('-');
        const data = new Date(Number(ano), Number(mes) - 1);
        const nomeMonths = data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        
        let crescimento = 0;
        if (index > 0) {
          const receitaAnterior = array[index - 1][1].receita;
          crescimento = receitaAnterior > 0 ? ((dados.receita - receitaAnterior) / receitaAnterior) * 100 : 0;
        }

        return {
          mes: nomeMonths,
          receita: dados.receita,
          crescimento,
          transacoes: dados.transacoes
        };
      });

    return dadosOrdenados;
  };

  const calcularEstatisticas = (transacoes: any[], dadosPorMes: DadosReceita[]): EstatisticasGerais => {
    const receitaTotal = transacoes.reduce((total, t) => total + Number(t.valor), 0);
    const totalTransacoes = transacoes.length;
    const receitaMedia = totalTransacoes > 0 ? receitaTotal / totalTransacoes : 0;
    
    // Crescimento mensal (último mês vs penúltimo)
    let crescimentoMensal = 0;
    if (dadosPorMes.length >= 2) {
      const ultimoMes = dadosPorMes[dadosPorMes.length - 1];
      const penultimoMes = dadosPorMes[dadosPorMes.length - 2];
      
      if (penultimoMes.receita > 0) {
        crescimentoMensal = ((ultimoMes.receita - penultimoMes.receita) / penultimoMes.receita) * 100;
      }
    }

    return {
      receitaTotal,
      crescimentoMensal,
      totalTransacoes,
      receitaMedia
    };
  };

  const exportarParaExcel = async () => {
    try {
      console.log("📥 [AdminRelatorios] Iniciando exportação para Excel...");
      toast.success("Funcionalidade de exportação será implementada em breve");
    } catch (error) {
      console.error("❌ [AdminRelatorios] Erro ao exportar:", error);
      toast.error("Erro ao exportar relatório");
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarPorcentagem = (valor: number) => {
    return `${valor >= 0 ? '+' : ''}${valor.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header com botão de voltar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios Financeiros</h1>
            <p className="text-gray-600 mt-1">
              Análise detalhada da receita e crescimento da plataforma
            </p>
          </div>
        </div>
        <Button onClick={exportarParaExcel} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Personalizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início</label>
              <DatePicker
                selected={filtros.dataInicio}
                onSelect={(date) => setFiltros(prev => ({ ...prev, dataInicio: date }))}
                placeholder="Selecionar data"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fim</label>
              <DatePicker
                selected={filtros.dataFim}
                onSelect={(date) => setFiltros(prev => ({ ...prev, dataFim: date }))}
                placeholder="Selecionar data"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Plano</label>
              <Select
                value={filtros.tipoPlano}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, tipoPlano: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os planos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os planos</SelectItem>
                  <SelectItem value="25">Plano 25</SelectItem>
                  <SelectItem value="50">Plano 50</SelectItem>
                  <SelectItem value="100">Plano 100</SelectItem>
                  <SelectItem value="100+">Plano 100+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filtros.statusTransacao}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, statusTransacao: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(estatisticasGerais.receitaTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {estatisticasGerais.totalTransacoes} transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento Mensal</CardTitle>
            {estatisticasGerais.crescimentoMensal >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              estatisticasGerais.crescimentoMensal >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatarPorcentagem(estatisticasGerais.crescimentoMensal)}
            </div>
            <p className="text-xs text-muted-foreground">
              vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Média</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(estatisticasGerais.receitaMedia)}</div>
            <p className="text-xs text-muted-foreground">
              por transação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transações</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticasGerais.totalTransacoes}</div>
            <p className="text-xs text-muted-foreground">
              no período selecionado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Receita por Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Receita</CardTitle>
          <CardDescription>
            Receita mensal e crescimento percentual mês a mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosReceita}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Transações por Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Volume de Transações</CardTitle>
          <CardDescription>
            Número de transações processadas por mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosReceita}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="transacoes" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tabela de Dados Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Detalhados por Mês</CardTitle>
          <CardDescription>
            Breakdown completo da performance mensal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Mês</th>
                  <th className="text-right py-2">Receita</th>
                  <th className="text-right py-2">Transações</th>
                  <th className="text-right py-2">Crescimento</th>
                  <th className="text-right py-2">Ticket Médio</th>
                </tr>
              </thead>
              <tbody>
                {dadosReceita.map((dados, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 font-medium">{dados.mes}</td>
                    <td className="text-right py-3">{formatarMoeda(dados.receita)}</td>
                    <td className="text-right py-3">{dados.transacoes}</td>
                    <td className={`text-right py-3 ${
                      dados.crescimento >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {index === 0 ? '-' : formatarPorcentagem(dados.crescimento)}
                    </td>
                    <td className="text-right py-3">
                      {formatarMoeda(dados.transacoes > 0 ? dados.receita / dados.transacoes : 0)}
                    </td>
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

export default AdminRelatorios;
