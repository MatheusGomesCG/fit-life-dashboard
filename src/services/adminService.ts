
import { supabase } from "@/integrations/supabase/client";

export interface AdminUser {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

export interface CreateAdminData {
  user_id: string;
  nome: string;
  email: string;
}

export const verificarSeEhAdmin = async (userId: string): Promise<boolean> => {
  try {
    // Using direct RPC call since the function exists in the database
    const { data, error } = await supabase.rpc('is_admin', { user_uuid: userId });
    
    if (error) {
      console.error("Erro ao verificar se é admin:", error);
      return false;
    }
    
    return Boolean(data);
  } catch (error) {
    console.error("Erro ao verificar se é admin:", error);
    return false;
  }
};

export const listarAdmins = async (): Promise<AdminUser[]> => {
  try {
    // Using direct query since the table exists
    const { data, error } = await (supabase as any)
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as AdminUser[];
  } catch (error) {
    console.error("Erro ao listar admins:", error);
    throw error;
  }
};

export const criarAdmin = async (adminData: CreateAdminData): Promise<AdminUser> => {
  try {
    const { data, error } = await (supabase as any)
      .from('admin_users')
      .insert([adminData])
      .select()
      .single();
    
    if (error) throw error;
    return data as AdminUser;
  } catch (error) {
    console.error("Erro ao criar admin:", error);
    throw error;
  }
};

export const atualizarStatusAdmin = async (id: string, status: 'ativo' | 'inativo'): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('admin_users')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Erro ao atualizar status do admin:", error);
    throw error;
  }
};

export const removerAdmin = async (id: string): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('admin_users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Erro ao remover admin:", error);
    throw error;
  }
};
