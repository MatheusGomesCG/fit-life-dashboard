
import React, { useState, useEffect } from "react";
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
import PagamentosAnuais from "@/components/pagamentos/PagamentosAnuais";
import AlunosMensais from "@/components/alunos/AlunosMensais";
import DashboardCards from "@/components/professor/DashboardCards";
import AtividadesRecentes from "@/components/professor/dashboard/AtividadesRecentes";
import PlanoAtual from "@/components/professor/dashboard/PlanoAtual";
import ProximosAgendamentos from "@/components/professor/dashboard/ProximosAgendamentos";

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
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">
          Visão geral do sistema - {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Layout Principal em Grid Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Coluna 1 - Cards de Estatísticas */}
        <div className="lg:col-span-1 xl:col-span-1">
          <DashboardCards 
            totalAlunos={totalAlunos}
            totalRecebido={totalRecebido}
            totalPendente={totalPendente}
            avaliacoesSemana={avaliacoesSemana}
            isLoading={isLoading}
          />
        </div>
        
        {/* Coluna 2 - Atividades e Plano */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-4 md:space-y-6">
          <AtividadesRecentes 
            agendamentosSemana={agendamentosSemana}
            isLoading={isLoading}
          />
          
          <PlanoAtual 
            plano={plano}
            totalAlunos={totalAlunos}
          />
        </div>
        
        {/* Coluna 3 - Próximos Agendamentos */}
        <div className="lg:col-span-2 xl:col-span-2">
          <ProximosAgendamentos 
            agendamentosSemana={agendamentosSemana}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <div className="xl:col-span-1">
          <PagamentosAnuais 
            pagamentos={pagamentos} 
            isLoading={isLoading} 
            anoSelecionado={anoSelecionado} 
            setAnoSelecionado={setAnoSelecionado}
          />
        </div>

        <div className="xl:col-span-1">
          <AlunosMensais 
            anoSelecionado={anoSelecionado}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardProfessor;
