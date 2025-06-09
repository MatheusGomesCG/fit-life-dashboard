
import { supabase } from "@/integrations/supabase/client";
import { buscarPerfilProfessor } from "@/services/professorService";

export const getUserRole = async (userId: string): Promise<"professor" | "aluno" | "admin" | "unknown"> => {
  try {
    console.log("🔍 [getUserRole] Iniciando verificação para usuário:", userId);

    // Verificar se é professor com logs detalhados
    console.log("🔍 [getUserRole] Verificando se é professor...");
    const { data: professorCheck, error: professorError } = await supabase
      .from("professor_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    console.log("🔍 [getUserRole] Resultado da consulta professor:", { 
      data: professorCheck, 
      error: professorError 
    });

    if (professorError) {
      console.error("❌ [getUserRole] Erro ao verificar professor:", professorError);
    } else if (professorCheck) {
      console.log("✅ [getUserRole] Usuário identificado como professor");
      return "professor";
    } else {
      console.log("❌ [getUserRole] Usuário NÃO é professor");
    }

    // Verificar se é aluno
    console.log("🔍 [getUserRole] Verificando se é aluno...");
    const { data: alunoCheck, error: alunoError } = await supabase
      .from("aluno_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    console.log("🔍 [getUserRole] Resultado da consulta aluno:", { 
      data: alunoCheck, 
      error: alunoError 
    });

    if (alunoError) {
      console.error("❌ [getUserRole] Erro ao verificar aluno:", alunoError);
    } else if (alunoCheck) {
      console.log("✅ [getUserRole] Usuário identificado como aluno");
      return "aluno";
    } else {
      console.log("❌ [getUserRole] Usuário NÃO é aluno");
    }

    // Verificar se é admin
    console.log("🔍 [getUserRole] Verificando se é admin...");
    const { data: adminCheck, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    console.log("🔍 [getUserRole] Resultado da consulta admin:", { 
      data: adminCheck, 
      error: adminError 
    });

    if (adminError) {
      console.error("❌ [getUserRole] Erro ao verificar admin:", adminError);
    } else if (adminCheck) {
      console.log("✅ [getUserRole] Usuário identificado como admin");
      return "admin";
    } else {
      console.log("❌ [getUserRole] Usuário NÃO é admin");
    }

    console.log("❌ [getUserRole] Tipo de usuário não identificado - retornando 'unknown'");
    return "unknown";
  } catch (error) {
    console.error("❌ [getUserRole] Erro crítico ao identificar tipo de usuário:", error);
    return "unknown";
  }
};

export const getUserName = async (userId: string, role: string): Promise<string> => {
  try {
    console.log(`🔍 [getUserName] Buscando nome para usuário ${role}:`, userId);

    if (role === "professor") {
      console.log("🔍 [getUserName] Buscando perfil do professor...");
      const profile = await buscarPerfilProfessor(userId);
      console.log("🔍 [getUserName] Perfil do professor encontrado:", profile?.nome);
      return profile?.nome ?? "Professor";
    }

    if (role === "aluno") {
      console.log("🔍 [getUserName] Buscando nome do aluno...");
      const { data, error } = await supabase
        .from("aluno_profiles")
        .select("nome")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("❌ [getUserName] Erro ao buscar nome do aluno:", error);
        return "Aluno";
      }

      console.log("🔍 [getUserName] Nome do aluno encontrado:", data?.nome);
      return data?.nome ?? "Aluno";
    }

    if (role === "admin") {
      console.log("🔍 [getUserName] Buscando nome do admin...");
      const { data, error } = await supabase
        .from("admin_users")
        .select("nome")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("❌ [getUserName] Erro ao buscar nome do admin:", error);
        return "Administrador";
      }

      console.log("🔍 [getUserName] Nome do admin encontrado:", data?.nome);
      return data?.nome ?? "Administrador";
    }

    console.log("❌ [getUserName] Tipo de usuário desconhecido, retornando 'Usuário'");
    return "Usuário";
  } catch (error) {
    console.error(`❌ [getUserName] Erro ao buscar nome para usuário (${role}):`, error);
    return "Usuário";
  }
};
