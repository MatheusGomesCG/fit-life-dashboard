
import { supabase } from "@/integrations/supabase/client";
import { buscarPerfilProfessor } from "@/services/professorService";

export const getUserRole = async (userId: string): Promise<"professor" | "aluno" | "admin" | "unknown"> => {
  try {
    console.log("Verificando tipo de usuário para:", userId);

    const { data: professorCheck } = await supabase
      .from("professor_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    console.log("Professor check resultado:", professorCheck);

    if (professorCheck) {
      console.log("Usuário identificado como professor");
      return "professor";
    }

    const { data: alunoCheck } = await supabase
      .from("aluno_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    console.log("Aluno check resultado:", alunoCheck);

    if (alunoCheck) {
      console.log("Usuário identificado como aluno");
      return "aluno";
    }

    const { data: adminCheck } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    console.log("Admin check resultado:", adminCheck);

    if (adminCheck) {
      console.log("Usuário identificado como admin");
      return "admin";
    }

    console.log("Tipo de usuário não identificado");
    return "unknown";
  } catch (error) {
    console.error("Erro ao identificar tipo de usuário:", error);
    return "unknown";
  }
};

export const getUserName = async (userId: string, role: string): Promise<string> => {
  try {
    if (role === "professor") {
      const profile = await buscarPerfilProfessor(userId);
      return profile?.nome ?? "Professor";
    }

    if (role === "aluno") {
      const { data } = await supabase
        .from("aluno_profiles")
        .select("nome")
        .eq("user_id", userId)
        .single();

      return data?.nome ?? "Aluno";
    }

    if (role === "admin") {
      const { data } = await supabase
        .from("admin_users")
        .select("nome")
        .eq("user_id", userId)
        .single();

      return data?.nome ?? "Administrador";
    }

    return "Usuário";
  } catch (error) {
    console.warn(`Erro ao buscar nome para usuário (${role}):`, error);
    return "Usuário";
  }
};
