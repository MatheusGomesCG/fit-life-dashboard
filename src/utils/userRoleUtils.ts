
import { supabase } from "@/integrations/supabase/client";

export const getUserRole = async (userId: string): Promise<"professor" | "aluno" | "admin" | "unknown"> => {
  try {
    console.log("🔍 [getUserRole] Iniciando verificação para usuário:", userId);
    
    // Verificar se é professor
    console.log("🔍 [getUserRole] Verificando se é professor...");
    const { data: professorData, error: professorError } = await supabase
      .from('professor_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    console.log("🔍 [getUserRole] Resultado professor:", { professorData, professorError });

    if (professorError && professorError.code !== 'PGRST116') {
      console.error("❌ [getUserRole] Erro ao verificar professor:", professorError);
      throw professorError;
    }

    if (professorData) {
      console.log("✅ [getUserRole] Usuário é professor");
      return "professor";
    }

    // Verificar se é aluno
    console.log("🔍 [getUserRole] Verificando se é aluno...");
    const { data: alunoData, error: alunoError } = await supabase
      .from('aluno_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    console.log("🔍 [getUserRole] Resultado aluno:", { alunoData, alunoError });

    if (alunoError && alunoError.code !== 'PGRST116') {
      console.error("❌ [getUserRole] Erro ao verificar aluno:", alunoError);
      throw alunoError;
    }

    if (alunoData) {
      console.log("✅ [getUserRole] Usuário é aluno");
      return "aluno";
    }

    // Se não é professor nem aluno, verificar se é admin (opcional)
    console.log("🔍 [getUserRole] Verificando se é admin...");
    const { data: adminData, error: adminError } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    console.log("🔍 [getUserRole] Resultado admin:", { adminData, adminError });

    if (adminError && adminError.code !== 'PGRST116') {
      console.error("❌ [getUserRole] Erro ao verificar admin:", adminError);
      // Não vamos falhar por erro de admin, pode não existir a tabela
    }

    if (adminData) {
      console.log("✅ [getUserRole] Usuário é admin");
      return "admin";
    }

    console.log("⚠️ [getUserRole] Nenhum perfil encontrado para o usuário");
    return "unknown";

  } catch (error) {
    console.error("❌ [getUserRole] Erro geral:", error);
    return "unknown";
  }
};

export const getUserName = async (userId: string, role: "professor" | "aluno" | "admin"): Promise<string> => {
  try {
    console.log("🔍 [getUserName] Buscando nome para:", { userId, role });

    let tableName = '';
    switch (role) {
      case 'professor':
        tableName = 'professor_profiles';
        break;
      case 'aluno':
        tableName = 'aluno_profiles';
        break;
      case 'admin':
        tableName = 'admin_profiles';
        break;
      default:
        console.log("⚠️ [getUserName] Tipo de usuário não reconhecido:", role);
        return "Usuário";
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('nome')
      .eq('user_id', userId)
      .maybeSingle();

    console.log("🔍 [getUserName] Resultado da consulta:", { data, error, tableName });

    if (error && error.code !== 'PGRST116') {
      console.error("❌ [getUserName] Erro ao buscar nome:", error);
      throw error;
    }

    const nome = data?.nome || "Usuário";
    console.log("✅ [getUserName] Nome encontrado:", nome);
    return nome;

  } catch (error) {
    console.error("❌ [getUserName] Erro geral:", error);
    return "Usuário";
  }
};
