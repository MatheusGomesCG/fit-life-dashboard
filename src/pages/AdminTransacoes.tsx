
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
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const AdminTransacoes: React.FC = () => {
  const [transacoes, setTransacoes] = useState<TransacaoProfessor[]>([]);
  const [professores, setProfessores] = useState<ProfessorComPlano[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("0");
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
      pago: "bg-green-100 text-green-800 border-green-200",
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelado: "bg-red-100 text-red-800 border-red-200",
      falhou: "bg-red-100 text-red-800 border-red-200"
    };
    
    return (
      <Badge className={`${colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const transacoesFiltradas = transacoes.filter(transacao => {
    const matchStatus = filtroStatus === "0" || transacao.status === filtroStatus;
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
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Gestão de Transações" 
        description="Gerenciar pagamentos e transações dos professores"
      />

      {/* Cards de Resumo - Melhor espaçamento e responsivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {totalReceita.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">
              {transacoes.filter(t => t.status === 'pago').length} transações pagas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{transacoesPendentes}</div>
            <p className="text-xs text-gray-600 mt-1">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Transações</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{transacoes.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              Todas as transações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros - Melhor layout responsivo */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
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
            <div className="lg:w-48">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
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
          </div>
        </CardContent>
      </Card>

      {/* Transações - Layout responsivo melhorado */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Transações</CardTitle>
          <CardDescription>Lista de todas as transações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {transacoesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-50 rounded-full mx-auto w-fit mb-4">
                <CreditCard className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {transacoes.length === 0 
                  ? "Nenhuma transação encontrada"
                  : "Nenhuma transação encontrada com os filtros aplicados"
                }
              </h3>
              <p className="text-gray-500">
                {transacoes.length === 0 
                  ? "Não há transações registradas no sistema"
                  : "Tente ajustar os filtros de busca"
                }
              </p>
            </div>
          ) : (
            <>
              {/* Vista mobile - Cards melhorados */}
              <div className="block lg:hidden space-y-4">
                {transacoesFiltradas.map((transacao) => (
                  <Card key={transacao.id} className="p-4 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transacao.status)}
                        {getStatusBadge(transacao.status)}
                      </div>
                      <div className="text-sm font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {transacao.id.slice(0, 8)}...
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Valor:</span>
                        <span className="font-bold text-lg text-green-600">R$ {(transacao.valor || 0).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gateway:</span>
                        <span className="font-medium">{transacao.gateway_pagamento || 'N/A'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Criação:</span>
                        <span>{format(new Date(transacao.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>
                      
                      {transacao.data_pagamento && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pagamento:</span>
                          <span>{format(new Date(transacao.data_pagamento), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                      )}
                    </div>
                    
                    {transacao.status === 'pendente' && (
                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                        <Button
                          size="sm"
                          onClick={() => atualizarStatusTransacao(transacao.id, 'pago')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => atualizarStatusTransacao(transacao.id, 'cancelado')}
                          className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Vista desktop - Tabela melhorada */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Valor</TableHead>
                      <TableHead className="font-semibold">Gateway</TableHead>
                      <TableHead className="font-semibold">Data Criação</TableHead>
                      <TableHead className="font-semibold">Data Pagamento</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transacoesFiltradas.map((transacao) => (
                      <TableRow key={transacao.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-mono text-xs bg-gray-50 rounded px-2 py-1">
                          {transacao.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transacao.status)}
                            {getStatusBadge(transacao.status)}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
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
                            : <span className="text-gray-400">N/A</span>
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            {transacao.status === 'pendente' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => atualizarStatusTransacao(transacao.id, 'pago')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirmar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => atualizarStatusTransacao(transacao.id, 'cancelado')}
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Cancelar
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransacoes;
