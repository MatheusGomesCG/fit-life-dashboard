
import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Download,
  RefreshCw,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  AdminMetricas, 
  buscarMetricasAdmin, 
  calcularMetricasAdmin,
  gerarRelatorioExcel 
} from "@/services/adminService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import LoadingSpinner from "@/components/LoadingSpinner";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metricas, setMetricas] = useState<AdminMetricas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    carregarMetricas();
  }, []);

  const carregarMetricas = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 [AdminDashboard] Carregando métricas...");
      const data = await buscarMetricasAdmin();
      console.log("✅ [AdminDashboard] Métricas carregadas:", data);
      setMetricas(data || []);
    } catch (error) {
      console.error("❌ [AdminDashboard] Erro ao carregar métricas:", error);
      toast.error("Erro ao carregar dados do dashboard");
      setMetricas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarMetricas = async () => {
    try {
      setIsRefreshing(true);
      console.log("🔄 [AdminDashboard] Atualizando métricas...");
      await calcularMetricasAdmin();
      await carregarMetricas();
      toast.success("Métricas atualizadas com sucesso!");
    } catch (error) {
      console.error("❌ [AdminDashboard] Erro ao atualizar métricas:", error);
      toast.error("Erro ao atualizar métricas");
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportarRelatorio = async () => {
    try {
      console.log("📊 [AdminDashboard] Exportando relatório...");
      const ano = parseInt(selectedYear);
      const mes = selectedMonth ? parseInt(selectedMonth) : undefined;
      
      const dados = await gerarRelatorioExcel(ano, mes);
      
      if (!dados || dados.length === 0) {
        toast.error("Nenhum dado encontrado para o período selecionado");
        return;
      }

      // Criar CSV
      const headers = Object.keys(dados[0] || {});
      const csvContent = [
        headers.join(','),
        ...dados.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      // Download do arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio_${ano}${mes ? `_${mes.toString().padStart(2, '0')}` : ''}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      console.error("❌ [AdminDashboard] Erro ao exportar relatório:", error);
      toast.error("Erro ao exportar relatório");
    }
  };

  const metricaAtual = metricas && metricas.length > 0 ? metricas[0] : null;
  
  const dadosGraficoReceita = metricas && metricas.length > 0 ? metricas.slice(0, 6).reverse().map(m => ({
    mes: new Date(m.data_referencia).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    receita: m.receita_mensal || 0,
    acumulada: m.receita_acumulada || 0
  })) : [];

  const dadosGraficoProfessores = metricas && metricas.length > 0 ? metricas.slice(0, 6).reverse().map(m => ({
    mes: new Date(m.data_referencia).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    ativos: m.total_professores_ativos || 0,
    novos: m.novos_professores_mes || 0
  })) : [];

  const dadosGraficoPlanos = metricaAtual ? [
    { nome: 'Plano 25', quantidade: metricaAtual.planos_25_ativos || 0, valor: (metricaAtual.planos_25_ativos || 0) * 25 },
    { nome: 'Plano 50', quantidade: metricaAtual.planos_50_ativos || 0, valor: (metricaAtual.planos_50_ativos || 0) * 50 },
    { nome: 'Plano 100', quantidade: metricaAtual.planos_100_ativos || 0, valor: (metricaAtual.planos_100_ativos || 0) * 100 },
    { nome: 'Plano 100+', quantidade: metricaAtual.planos_100plus_ativos || 0, valor: (metricaAtual.planos_100plus_ativos || 0) * 200 }
  ] : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">Visão geral do negócio e métricas</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={atualizarMetricas} disabled={isRefreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {metricaAtual?.receita_mensal?.toFixed(2) || '0,00'}</div>
            <p className="text-xs text-muted-foreground">
              Acumulado: R$ {metricaAtual?.receita_acumulada?.toFixed(2) || '0,00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricaAtual?.total_professores_ativos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Novos este mês: {metricaAtual?.novos_professores_mes || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metricaAtual?.planos_25_ativos || 0) + 
               (metricaAtual?.planos_50_ativos || 0) + 
               (metricaAtual?.planos_100_ativos || 0) + 
               (metricaAtual?.planos_100plus_ativos || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Planos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricas.length > 1 ? 
                (((metricaAtual?.total_professores_ativos || 0) - (metricas[1]?.total_professores_ativos || 0)) > 0 ? '+' : '') +
                ((metricaAtual?.total_professores_ativos || 0) - (metricas[1]?.total_professores_ativos || 0))
                : '0'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
            <CardDescription>Receita mensal e acumulada dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            {dadosGraficoReceita.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosGraficoReceita}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']} />
                  <Line type="monotone" dataKey="receita" stroke="#8884d8" name="Mensal" />
                  <Line type="monotone" dataKey="acumulada" stroke="#82ca9d" name="Acumulada" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Professores</CardTitle>
            <CardDescription>Professores ativos e novos cadastros</CardDescription>
          </CardHeader>
          <CardContent>
            {dadosGraficoProfessores.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGraficoProfessores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ativos" fill="#8884d8" name="Ativos" />
                  <Bar dataKey="novos" fill="#82ca9d" name="Novos" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Planos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Distribuição de Planos</CardTitle>
          <CardDescription>Quantidade e valor por tipo de plano</CardDescription>
        </CardHeader>
        <CardContent>
          {dadosGraficoPlanos.length > 0 && dadosGraficoPlanos.some(item => item.quantidade > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dadosGraficoPlanos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip formatter={(value: number, name: string) => [
                  name === 'valor' ? `R$ ${value.toFixed(2)}` : value,
                  name === 'valor' ? 'Receita' : 'Quantidade'
                ]} />
                <Bar dataKey="quantidade" fill="#8884d8" name="quantidade" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              Nenhum plano ativo encontrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Relatórios</CardTitle>
          <CardDescription>Gere relatórios detalhados em formato Excel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Ano</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Mês (Opcional)</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos os meses</SelectItem>
                  {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                    <SelectItem key={month} value={month.toString()}>
                      {new Date(2023, month - 1).toLocaleDateString('pt-BR', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={exportarRelatorio}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
