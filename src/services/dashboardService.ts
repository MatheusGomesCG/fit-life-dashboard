
import { supabase } from "@/integrations/supabase/client";

export interface AlunoMensal {
  mes: string;
  alunos: number;
}

export interface DadosDashboard {
  alunosMensais: AlunoMensal[];
  totalAtual: number;
}

export const buscarDadosAlunosMensais = async (professorId: string, ano: number): Promise<DadosDashboard> => {
  try {
    console.log("🔍 [Dashboard Service] Buscando dados de alunos mensais", { professorId, ano });
    
    // Buscar total atual de alunos
    const { data: totalAtual } = await supabase.rpc('contar_alunos_professor', { 
      professor_id: professorId 
    });

    // Para demonstração, vamos criar dados baseados no total atual
    // Em um sistema real, você teria uma tabela de histórico ou calcularia baseado em created_at
    const alunosMensais: AlunoMensal[] = [
      { mes: 'Jan', alunos: Math.max(0, totalAtual - 2) },
      { mes: 'Fev', alunos: Math.max(0, totalAtual - 1) },
      { mes: 'Mar', alunos: totalAtual },
      { mes: 'Abr', alunos: totalAtual },
      { mes: 'Mai', alunos: 0 },
      { mes: 'Jun', alunos: 0 },
      { mes: 'Jul', alunos: 0 },
      { mes: 'Ago', alunos: 0 },
      { mes: 'Set', alunos: 0 },
      { mes: 'Out', alunos: 0 },
      { mes: 'Nov', alunos: 0 },
      { mes: 'Dez', alunos: 0 },
    ];

    return {
      alunosMensais,
      totalAtual: totalAtual || 0
    };
  } catch (error) {
    console.error("Erro ao buscar dados de alunos mensais:", error);
    return {
      alunosMensais: [],
      totalAtual: 0
    };
  }
};

export const buscarPagamentosPorAno = async (ano: number) => {
  try {
    console.log("🔍 [Dashboard Service] Buscando pagamentos por ano", { ano });
    
    const { data: pagamentos, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('ano', ano)
      .order('mes', { ascending: true });

    if (error) throw error;

    console.log("✅ [Dashboard Service] Pagamentos encontrados:", pagamentos?.length || 0);
    return pagamentos || [];
  } catch (error) {
    console.error("Erro ao buscar pagamentos por ano:", error);
    return [];
  }
};
