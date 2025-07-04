
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  TransacaoProfessor, 
  ProfessorComPlano,
  buscarTransacoesProfessores, 
  buscarProfessoresComPlanos,
  atualizarTransacao
} from "@/services/adminService";
import LoadingSpinner from "@/components/LoadingSpinner";

const AdminTransacoes: React.FC = () => {
  const [transacoes, setTransacoes] = useState<TransacaoProfessor[]>([]);
  const [professores, setProfessores] = useState<ProfessorComPlano[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroSearch, setFiltroSearch] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 [AdminTransacoes] Carregando dados...");
      
      const [transacoesData, professoresData] = await Promise.all([
        buscarTransacoesProfessores(),
        buscarProfessoresComPlanos()
      ]);
      
      console.log("✅ [AdminTransacoes] Dados carregados:", {
        transacoes: transacoesData.length,
        professores: professoresData.length
      });
      
      setTransacoes(transacoesData || []);
      setProfessores(professoresData || []);
    } catch (error) {
      console.error("❌ [AdminTransacoes] Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
      setTransacoes([]);
      setProfessores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarStatusTransacao = async (id: string, status: string) => {
    try {
      console.log("🔄 [AdminTransacoes] Atualizando status da transação:", { id, status });
      
      const updates: any = { status };
      if (status === 'pago') {
        updates.data_pagamento = new Date().toISOString();
      }
      
      await atualizarTransacao(id, updates);
      await carregarDados();
      toast.success("Status da transação atualizado!");
    } catch (error) {
      console.error("❌ [AdminTransacoes] Erro ao atualizar transação:", error);
      toast.error("Erro ao atualizar transação");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelado':
      case 'falhou':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pago: "bg-green-100 text-green-800",
      pendente: "bg-yellow-100 text-yellow-800",
      cancelado: "bg-red-100 text-red-800",
      falhou: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const transacoesFiltradas = transacoes.filter(transacao => {
    const matchStatus = !filtroStatus || transacao.status === filtroStatus;
    const matchSearch = !filtroSearch || 
      transacao.descricao?.toLowerCase().includes(filtroSearch.toLowerCase()) ||
      transacao.gateway_transaction_id?.toLowerCase().includes(filtroSearch.toLowerCase()) ||
      transacao.id.toLowerCase().includes(filtroSearch.toLowerCase());
    
    return matchStatus && matchSearch;
  });

  const totalReceita = transacoes
    .filter(t => t.status === 'pago')
    .reduce((sum, t) => sum + (t.valor || 0), 0);

  const transacoesPendentes = transacoes.filter(t => t.status === 'pendente').length;

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
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Transações</h1>
          <p className="text-gray-600">Gerenciar pagamentos e transações dos professores</p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalReceita.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {transacoes.filter(t => t.status === 'pago').length} transações pagas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transacoesPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transações</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transacoes.length}</div>
            <p className="text-xs text-muted-foreground">
              Todas as transações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por descrição, ID da transação..."
                  value={filtroSearch}
                  onChange={(e) => setFiltroSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="falhou">Falhou</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>Lista de todas as transações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead>Data Pagamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoesFiltradas.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell className="font-mono text-xs">
                      {transacao.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transacao.status)}
                        {getStatusBadge(transacao.status)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {(transacao.valor || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transacao.gateway_pagamento || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{transacao.metodo_pagamento || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(transacao.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {transacao.data_pagamento 
                        ? format(new Date(transacao.data_pagamento), "dd/MM/yyyy HH:mm", { locale: ptBR })
                        : "N/A"
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {transacao.status === 'pendente' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => atualizarStatusTransacao(transacao.id, 'pago')}
                              className="text-green-600 border-green-300 hover:bg-green-50"
                            >
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => atualizarStatusTransacao(transacao.id, 'cancelado')}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {transacoesFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {transacoes.length === 0 
                        ? "Nenhuma transação encontrada no sistema"
                        : "Nenhuma transação encontrada com os filtros aplicados"
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransacoes;
