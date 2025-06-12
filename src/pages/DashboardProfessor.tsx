
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ChevronRight } from "lucide-react";
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
import { format, parseISO } from "date-fns";
import PagamentosAnuais from "@/components/pagamentos/PagamentosAnuais";
import AlunosMensais from "@/components/alunos/AlunosMensais";
import ModernSidebar from "@/components/professor/ModernSidebar";
import ModernHeader from "@/components/professor/ModernHeader";
import DashboardCards from "@/components/professor/DashboardCards";

const DashboardProfessor: React.FC = () => {
  const { user } = useAuth();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [avaliacoesSemana, setAvaliacoesSemana] = useState(0);
  const [agendamentosSemana, setAgendamentosSemana] = useState<Agendamento[]>([]);
  const [plano, setPlano] = useState<ProfessorPlano | null>(null);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <ModernSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <ModernHeader />
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">
              Visão geral do sistema - {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Layout Principal em Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {/* Coluna 1 - Cards de Estatísticas */}
            <div className="xl:col-span-1">
              <DashboardCards 
                totalAlunos={totalAlunos}
                totalRecebido={totalRecebido}
                totalPendente={totalPendente}
                avaliacoesSemana={avaliacoesSemana}
                isLoading={isLoading}
              />
            </div>
            
            {/* Coluna 2 - Atividades e Plano */}
            <div className="xl:col-span-1 space-y-6">
              {/* Atividades Recentes */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Atividades Recentes</h3>
                  <Link to="/gerenciar-agendamentos" className="text-xs text-orange-500 hover:text-orange-600 cursor-pointer">
                    Ver todas
                  </Link>
                </div>
                
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse h-14 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                ) : agendamentosSemana.length > 0 ? (
                  <div className="space-y-4">
                    {agendamentosSemana.slice(0, 5).map((agendamento) => (
                      <div key={agendamento.id} className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{agendamento.aluno_nome}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{format(new Date(agendamento.data), "dd/MM/yyyy")}</span>
                            <Clock className="h-3 w-3 ml-2 mr-1" />
                            <span>{agendamento.hora}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <Calendar className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sistema funcionando perfeitamente</p>
                        <p className="text-xs text-gray-500">Hoje, {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Plano do Professor */}
              {plano && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Plano Atual</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plano.status === 'ativo' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {plano.status.charAt(0).toUpperCase() + plano.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tipo do plano</span>
                      <span className="text-sm font-medium">
                        {plano.tipo_plano === "100+" ? "Premium" : `${plano.tipo_plano} alunos`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Limite de alunos</span>
                      <span className="text-sm font-medium">
                        {totalAlunos} / {plano.limite_alunos === -1 ? "Ilimitado" : plano.limite_alunos}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valor mensal</span>
                      <span className="text-sm font-medium text-green-500">
                        R$ {plano.preco_mensal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Vencimento</span>
                      <span className="text-sm font-medium">
                        {format(new Date(plano.data_vencimento), "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Coluna 3 - Próximos Agendamentos */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Próximos Agendamentos</h3>
                
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse h-14 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                ) : agendamentosSemana.length > 0 ? (
                  <div className="space-y-3">
                    {agendamentosSemana.slice(0, 6).map((agendamento) => (
                      <div key={agendamento.id} className="border-b border-gray-100 pb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{agendamento.aluno_nome}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{format(new Date(agendamento.data), "dd/MM")}</span>
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
                    
                    <Link to="/gerenciar-agendamentos" className="flex items-center text-orange-500 font-medium pt-2">
                      <span>Ver todos os agendamentos</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Não há agendamentos esta semana.</p>
                )}
              </div>
            </div>
          </div>

          {/* Seção de Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Gráfico de Pagamentos Anuais */}
            <div className="xl:col-span-1">
              <PagamentosAnuais 
                pagamentos={pagamentos} 
                isLoading={isLoading} 
                anoSelecionado={anoSelecionado} 
                setAnoSelecionado={setAnoSelecionado}
              />
            </div>

            {/* Gráfico de Alunos Mensais */}
            <div className="xl:col-span-1">
              <AlunosMensais 
                anoSelecionado={anoSelecionado}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardProfessor;
