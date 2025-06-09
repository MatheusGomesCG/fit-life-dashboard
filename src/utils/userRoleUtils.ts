
import { supabase } from "@/integrations/supabase/client";
import { buscarPerfilProfessor } from "@/services/professorService";

export const getUserRole = async (userId: string): Promise<"professor" | "aluno" | "admin" | "unknown"> => {
  try {
    console.log("🔍 Verificando tipo de usuário para:", userId);

    // Verificar se é professor
    const { data: professorCheck, error: professorError } = await supabase
      .from("professor_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (professorError) {
      console.error("Erro ao verificar professor:", professorError);
    } else if (professorCheck) {
      console.log("✅ Usuário identificado como professor");
      return "professor";
    }

    // Verificar se é aluno
    const { data: alunoCheck, error: alunoError } = await supabase
      .from("aluno_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (alunoError) {
      console.error("Erro ao verificar aluno:", alunoError);
    } else if (alunoCheck) {
      console.log("✅ Usuário identificado como aluno");
      return "aluno";
    }

    // Verificar se é admin
    const { data: adminCheck, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (adminError) {
      console.error("Erro ao verificar admin:", adminError);
    } else if (adminCheck) {
      console.log("✅ Usuário identificado como admin");
      return "admin";
    }

    console.log("❌ Tipo de usuário não identificado");
    return "unknown";
  } catch (error) {
    console.error("❌ Erro crítico ao identificar tipo de usuário:", error);
    return "unknown";
  }
};

export const getUserName = async (userId: string, role: string): Promise<string> => {
  try {
    console.log(`🔍 Buscando nome para usuário ${role}:`, userId);

    if (role === "professor") {
      const profile = await buscarPerfilProfessor(userId);
      return profile?.nome ?? "Professor";
    }

    if (role === "aluno") {
      const { data, error } = await supabase
        .from("aluno_profiles")
        .select("nome")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar nome do aluno:", error);
        return "Aluno";
      }

      return data?.nome ?? "Aluno";
    }

    if (role === "admin") {
      const { data, error } = await supabase
        .from("admin_users")
        .select("nome")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar nome do admin:", error);
        return "Administrador";
      }

      return data?.nome ?? "Administrador";
    }

    return "Usuário";
  } catch (error) {
    console.error(`❌ Erro ao buscar nome para usuário (${role}):`, error);
    return "Usuário";
  }
};
