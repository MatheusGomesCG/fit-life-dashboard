
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
    const checkin = {
      user_id: userId,
      exercise_id: exerciseId,
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('checkins_exercicios')
      .insert(checkin)
      .select()
      .single();

    if (error) throw error;
    return data as CheckinExercicio;
  } catch (error) {
    console.error("Erro ao registrar checkin do exercício:", error);
    throw error;
  }
};

export const buscarCheckinsUsuario = async (userId: string, data?: string): Promise<CheckinExercicio[]> => {
  try {
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
    console.error("Erro ao buscar checkins:", error);
    throw error;
  }
};

export const verificarExercicioRealizado = async (userId: string, exerciseId: string, data: string): Promise<boolean> => {
  try {
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
    return (checkin && checkin.length > 0);
  } catch (error) {
    console.error("Erro ao verificar exercício realizado:", error);
    return false;
  }
};
