
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

    // Verificar se é admin na tabela admin_users
    console.log("🔍 [getUserRole] Verificando se é admin...");
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
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

    if (role === 'professor') {
      const { data, error } = await supabase
        .from('professor_profiles')
        .select('nome')
        .eq('user_id', userId)
        .maybeSingle();

      console.log("🔍 [getUserName] Resultado da consulta professor:", { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error("❌ [getUserName] Erro ao buscar nome do professor:", error);
        throw error;
      }

      const nome = data?.nome || "Professor";
      console.log("✅ [getUserName] Nome do professor encontrado:", nome);
      return nome;
    }

    if (role === 'aluno') {
      const { data, error } = await supabase
        .from('aluno_profiles')
        .select('nome')
        .eq('user_id', userId)
        .maybeSingle();

      console.log("🔍 [getUserName] Resultado da consulta aluno:", { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error("❌ [getUserName] Erro ao buscar nome do aluno:", error);
        throw error;
      }

      const nome = data?.nome || "Aluno";
      console.log("✅ [getUserName] Nome do aluno encontrado:", nome);
      return nome;
    }

    if (role === 'admin') {
      const { data, error } = await supabase
        .from('admin_users')
        .select('nome')
        .eq('user_id', userId)
        .maybeSingle();

      console.log("🔍 [getUserName] Resultado da consulta admin:", { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error("❌ [getUserName] Erro ao buscar nome do admin:", error);
        throw error;
      }

      const nome = data?.nome || "Admin";
      console.log("✅ [getUserName] Nome do admin encontrado:", nome);
      return nome;
    }

    console.log("⚠️ [getUserName] Tipo de usuário não reconhecido:", role);
    return "Usuário";

  } catch (error) {
    console.error("❌ [getUserName] Erro geral:", error);
    return "Usuário";
  }
};
