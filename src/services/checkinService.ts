
import { supabase } from "@/integrations/supabase/client";

export interface CheckinExercicio {
  id?: string;
  user_id: string;
  exercise_id: string;
  timestamp: string;
  created_at?: string;
}

export const registrarCheckinExercicio = async (userId: string, exerciseId: string): Promise<CheckinExercicio> => {
  try {
    console.log("🔄 [CheckinService] Registrando checkin:", { userId, exerciseId });
    
    if (!userId || !exerciseId) {
      throw new Error("User ID e Exercise ID são obrigatórios");
    }

    const checkin = {
      user_id: userId,
      exercise_id: exerciseId,
      timestamp: new Date().toISOString()
    };

    console.log("📤 [CheckinService] Dados do checkin:", checkin);

    const { data, error } = await supabase
      .from('checkins_exercicios')
      .insert(checkin)
      .select()
      .single();

    if (error) {
      console.error("❌ [CheckinService] Erro do Supabase:", error);
      throw error;
    }

    console.log("✅ [CheckinService] Checkin registrado com sucesso:", data);
    return data as CheckinExercicio;
  } catch (error) {
    console.error("❌ [CheckinService] Erro ao registrar checkin do exercício:", error);
    throw error;
  }
};

export const buscarCheckinsUsuario = async (userId: string, data?: string): Promise<CheckinExercicio[]> => {
  try {
    console.log("🔍 [CheckinService] Buscando checkins:", { userId, data });
    
    let query = supabase
      .from('checkins_exercicios')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (data) {
      const startDate = new Date(data);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(data);
      endDate.setHours(23, 59, 59, 999);
      
      query = query
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());
    }

    const { data: checkins, error } = await query;

    if (error) throw error;
    return checkins || [];
  } catch (error) {
    console.error("❌ [CheckinService] Erro ao buscar checkins:", error);
    throw error;
  }
};

export const verificarExercicioRealizado = async (userId: string, exerciseId: string, data: string): Promise<boolean> => {
  try {
    console.log("🔍 [CheckinService] Verificando exercício realizado:", { userId, exerciseId, data });
    
    if (!userId || !exerciseId) {
      console.log("⚠️ [CheckinService] Parâmetros inválidos para verificação");
      return false;
    }

    const startDate = new Date(data);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(data);
    endDate.setHours(23, 59, 59, 999);

    const { data: checkin, error } = await supabase
      .from('checkins_exercicios')
      .select('id')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .limit(1);

    if (error) throw error;
    const realizado = (checkin && checkin.length > 0);
    console.log("✅ [CheckinService] Exercício realizado:", realizado);
    return realizado;
  } catch (error) {
    console.error("❌ [CheckinService] Erro ao verificar exercício realizado:", error);
    return false;
  }
};
