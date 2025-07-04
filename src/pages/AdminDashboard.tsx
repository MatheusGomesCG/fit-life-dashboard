
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
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metricas, setMetricas] = useState<AdminMetricas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState("0");

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
      const mes = selectedMonth !== "0" ? parseInt(selectedMonth) : undefined;
      
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
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Dashboard Avançado" 
        description="Visão geral detalhada do negócio e métricas de crescimento"
      >
        <Button onClick={atualizarMetricas} disabled={isRefreshing} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </AdminPageHeader>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Mensal</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {metricaAtual?.receita_mensal?.toFixed(2) || '0,00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Acumulado: R$ {metricaAtual?.receita_acumulada?.toFixed(2) || '0,00'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Professores Ativos</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metricaAtual?.total_professores_ativos || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Novos: {metricaAtual?.novos_professores_mes || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Planos</CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <CreditCard className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {(metricaAtual?.planos_25_ativos || 0) + 
               (metricaAtual?.planos_50_ativos || 0) + 
               (metricaAtual?.planos_100_ativos || 0) + 
               (metricaAtual?.planos_100plus_ativos || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Planos ativos
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Crescimento</CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metricas.length > 1 ? 
                (((metricaAtual?.total_professores_ativos || 0) - (metricas[1]?.total_professores_ativos || 0)) > 0 ? '+' : '') +
                ((metricaAtual?.total_professores_ativos || 0) - (metricas[1]?.total_professores_ativos || 0))
                : '0'
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">
              vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Evolução da Receita
            </CardTitle>
            <CardDescription>Receita mensal e acumulada dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            {dadosGraficoReceita.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosGraficoReceita}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="receita" stroke="#3b82f6" strokeWidth={3} name="Mensal" />
                  <Line type="monotone" dataKey="acumulada" stroke="#10b981" strokeWidth={3} name="Acumulada" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Nenhum dado disponível</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Crescimento de Professores
            </CardTitle>
            <CardDescription>Professores ativos e novos cadastros</CardDescription>
          </CardHeader>
          <CardContent>
            {dadosGraficoProfessores.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGraficoProfessores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="ativos" fill="#8b5cf6" name="Ativos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="novos" fill="#06b6d4" name="Novos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-2" />
                  <p>Nenhum dado disponível</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Planos */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-500" />
            Distribuição de Planos
          </CardTitle>
          <CardDescription>Quantidade e receita por tipo de plano</CardDescription>
        </CardHeader>
        <CardContent>
          {dadosGraficoPlanos.length > 0 && dadosGraficoPlanos.some(item => item.quantidade > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dadosGraficoPlanos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="nome" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'valor' ? `R$ ${value.toFixed(2)}` : value,
                    name === 'valor' ? 'Receita' : 'Quantidade'
                  ]}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="quantidade" fill="#10b981" name="quantidade" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <div className="text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-2" />
                <p>Nenhum plano ativo encontrado</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção de Relatórios */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5 text-indigo-500" />
            Exportar Relatórios
          </CardTitle>
          <CardDescription>Gere relatórios detalhados em formato CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">Ano</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full">
              <label className="text-sm font-medium text-gray-700 block mb-2">Mês (Opcional)</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-12">
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
            <Button onClick={exportarRelatorio} className="w-full lg:w-auto h-12 px-8">
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
