import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Activity, ChevronRight, DollarSign, CalendarClock, Calendar, Clock, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Pagamento, 
  listarPagamentos, 
  calcularTotalRecebido, 
  calcularTotalPendente 
} from "@/services/pagamentosService";
import { 
  contarAvaliacoesSemana,
  listarAgendamentosSemana,
  Agendamento
} from "@/services/agendamentosService";
import { 
  buscarPlanoProfessor, 
  contarAlunosProfessor,
  ProfessorPlano
} from "@/services/professorService";
import { format, parseISO, differenceInDays } from "date-fns";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import PagamentosAnuais from "@/components/pagamentos/PagamentosAnuais";
import AlunosMensais from "@/components/alunos/AlunosMensais";

const DashboardProfessor: React.FC = () => {
  const { user } = useAuth();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [avaliacoesSemana, setAvaliacoesSemana] = useState(0);
  const [agendamentosSemana, setAgendamentosSemana] = useState<Agendamento[]>([]);
  const [plano, setPlano] = useState<ProfessorPlano | null>(null);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());
  
  const [totalAlunosMensais] = useState(15); // Mock value

  useEffect(() => {
    const carregarDados = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const [pagamentosData, numAvaliacoes, agendamentos, planoData, numAlunos] = await Promise.all([
          listarPagamentos(),
          contarAvaliacoesSemana(),
          listarAgendamentosSemana(),
          buscarPlanoProfessor(user.id),
          contarAlunosProfessor(user.id)
        ]);
        
        setPagamentos(pagamentosData);
        setAvaliacoesSemana(numAvaliacoes);
        setAgendamentosSemana(agendamentos);
        setPlano(planoData);
        setTotalAlunos(numAlunos);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarDados();
  }, [user?.id]);

  const totalRecebido = calcularTotalRecebido(pagamentos);
  const totalPendente = calcularTotalPendente(pagamentos);

  const hoje = new Date();
  const proximosVencimentos = pagamentos
    .filter(p => p.status !== "pago")
    .filter(p => {
      const dataVencimento = parseISO(p.data_vencimento);
      const diasAteVencimento = differenceInDays(dataVencimento, hoje);
      return diasAteVencimento >= 0 && diasAteVencimento <= 7;
    })
    .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())
    .slice(0, 5);

  const getLimiteTexto = (limite: number) => {
    if (limite === -1) return "Ilimitado";
    return limite.toString();
  };

  const getStatusPlanoColor = (status: string) => {
    switch (status) {
      case "ativo": return "text-green-600 bg-green-100";
      case "suspenso": return "text-yellow-600 bg-yellow-100";
      case "cancelado": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, Professor {user?.nome || user?.profile?.nome || ""}
        </h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      <Tabs defaultValue="resumo" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="pagamentos-anuais">Pagamentos Anuais</TabsTrigger>
          <TabsTrigger value="alunos-mensais">Alunos Mensais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumo">
          {/* Informações do Plano */}
          {plano && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold ml-3">Plano Atual</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusPlanoColor(plano.status)}`}>
                  {plano.status.charAt(0).toUpperCase() + plano.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo do Plano</p>
                  <p className="text-lg font-bold text-purple-600">
                    {plano.tipo_plano === "100+" ? "Premium" : `${plano.tipo_plano} alunos`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Limite de Alunos</p>
                  <p className="text-lg font-bold">
                    {totalAlunos} / {getLimiteTexto(plano.limite_alunos)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Mensal</p>
                  <p className="text-lg font-bold text-green-600">
                    R$ {plano.preco_mensal.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vencimento</p>
                  <p className="text-lg font-bold">
                    {format(new Date(plano.data_vencimento), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold ml-3">Total de Alunos</h2>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-blue-600">
                  {totalAlunos}
                </p>
                {plano && (
                  <p className="text-sm text-gray-500">
                    Limite: <span className="font-medium">{getLimiteTexto(plano.limite_alunos)}</span>
                  </p>
                )}
              </div>
              
              <Link to="/gerenciar-alunos" className="mt-4 flex items-center text-blue-600 font-medium">
                <span>Gerenciar alunos</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold ml-3">Avaliações esta semana</h2>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
              ) : (
                <p className="text-2xl font-bold text-purple-600">{avaliacoesSemana}</p>
              )}
              
              <Link to="/gerenciar-agendamentos" className="mt-4 flex items-center text-purple-600 font-medium">
                <span>Ver agendamentos</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

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

          <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Próximos Agendamentos</h2>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse h-14 bg-gray-100 rounded"></div>
                ))}
              </div>
            ) : agendamentosSemana.length > 0 ? (
              <div className="space-y-3">
                {agendamentosSemana.slice(0, 5).map((agendamento) => (
                  <div key={agendamento.id} className="border-b border-gray-100 pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{agendamento.aluno_nome}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{format(new Date(agendamento.data), "dd/MM/yyyy")}</span>
                          <Clock className="h-4 w-4 ml-2 mr-1 text-gray-400" />
                          <span>{agendamento.hora}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        agendamento.tipo === 'avaliacao' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {agendamento.tipo === 'avaliacao' ? 'Avaliação' : 'Consulta'}
                      </span>
                    </div>
                  </div>
                ))}
                
                <Link to="/gerenciar-agendamentos" className="flex items-center text-purple-600 font-medium pt-2">
                  <span>Ver todos os agendamentos</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">Não há agendamentos esta semana.</p>
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

        <TabsContent value="alunos-mensais">
          <AlunosMensais 
            alunosAtivos={totalAlunosMensais}
            anoSelecionado={anoSelecionado}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardProfessor;
