import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Activity, ChevronRight, DollarSign, CalendarClock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Pagamento, 
  listarPagamentos, 
  calcularTotalRecebido, 
  calcularTotalPendente 
} from "@/services/pagamentosService";
import { format, parseISO, differenceInDays } from "date-fns";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import PagamentosAnuais from "@/components/pagamentos/PagamentosAnuais";

const DashboardProfessor: React.FC = () => {
  const { user } = useAuth();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    carregarPagamentos();
  }, []);

  const carregarPagamentos = async () => {
    try {
      setIsLoading(true);
      const data = await listarPagamentos();
      setPagamentos(data);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular valores totais
  const totalRecebido = calcularTotalRecebido(pagamentos);
  const totalPendente = calcularTotalPendente(pagamentos);

  // Filtrar pagamentos próximos ao vencimento (próximos 7 dias)
  const hoje = new Date();
  const proximosVencimentos = pagamentos
    .filter(p => p.status !== "pago")
    .filter(p => {
      const dataVencimento = parseISO(p.dataVencimento);
      const diasAteVencimento = differenceInDays(dataVencimento, hoje);
      return diasAteVencimento >= 0 && diasAteVencimento <= 7;
    })
    .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, Professor {user?.nome || ""}
        </h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      <Tabs defaultValue="resumo" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="pagamentos-anuais">Pagamentos Anuais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumo">
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold ml-3">Total Recebido</h2>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalRecebido.toFixed(2)}
                </p>
              )}
              
              <Link to="/gerenciar-pagamentos" className="mt-4 flex items-center text-green-600 font-medium">
                <span>Ver pagamentos</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <CalendarClock className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold ml-3">Pagamentos Pendentes</h2>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
              ) : (
                <p className="text-2xl font-bold text-amber-600">
                  R$ {totalPendente.toFixed(2)}
                </p>
              )}
              
              <Link to="/gerenciar-pagamentos" className="mt-4 flex items-center text-amber-600 font-medium">
                <span>Gerenciar pendências</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Acesso rápido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/gerenciar-alunos"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-lg font-semibold ml-3">Gerenciar Alunos</h2>
              </div>
              <p className="text-gray-600 mb-4 flex-1">
                Visualize, edite e organize todos os seus alunos cadastrados.
              </p>
              <div className="flex items-center text-blue-500 font-medium">
                <span>Acessar</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>

            <Link
              to="/cadastrar-aluno"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <UserPlus className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-lg font-semibold ml-3">Novo Aluno</h2>
              </div>
              <p className="text-gray-600 mb-4 flex-1">
                Cadastre um novo aluno e comece a criar seus treinos personalizados.
              </p>
              <div className="flex items-center text-green-500 font-medium">
                <span>Cadastrar</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>

            <Link
              to="/gerenciar-pagamentos"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-500" />
                </div>
                <h2 className="text-lg font-semibold ml-3">Pagamentos</h2>
              </div>
              <p className="text-gray-600 mb-4 flex-1">
                Gerencie os pagamentos dos alunos e veja relatórios financeiros.
              </p>
              <div className="flex items-center text-purple-500 font-medium">
                <span>Gerenciar</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>
          </div>

          {/* Próximos vencimentos */}
          <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Próximos Vencimentos</h2>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse h-14 bg-gray-100 rounded"></div>
                ))}
              </div>
            ) : proximosVencimentos.length > 0 ? (
              <div className="space-y-3">
                {proximosVencimentos.map((pagamento) => (
                  <div key={pagamento.id} className="border-b border-gray-100 pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{pagamento.alunoNome}</p>
                        <p className="text-sm text-gray-500">
                          Vence em {format(parseISO(pagamento.dataVencimento), "dd/MM/yyyy")}
                        </p>
                      </div>
                      <p className="font-semibold">R$ {pagamento.valor.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <Link to="/gerenciar-pagamentos" className="flex items-center text-blue-600 font-medium pt-2">
                  <span>Ver todos os pagamentos</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">Não há pagamentos próximos ao vencimento.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pagamentos-anuais">
          <PagamentosAnuais 
            pagamentos={pagamentos} 
            isLoading={isLoading} 
            anoSelecionado={anoSelecionado} 
            setAnoSelecionado={setAnoSelecionado}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardProfessor;
