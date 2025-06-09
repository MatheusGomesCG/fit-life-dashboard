
import React, { createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthContextType, AuthUser } from "@/types/auth";
import { useAuthSession } from "@/hooks/useAuthSession";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading, loadUserProfile } = useAuthSession();

  const login = async (email: string, password: string) => {
    try {
      console.log("🚀 [AuthContext] Iniciando processo de login...");
      
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios");
      }
      
      if (!email.includes("@")) {
        throw new Error("Formato de e-mail inválido");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        console.error("❌ [AuthContext] Erro no login:", error);
        
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Credenciais inválidas. Verifique seu email e senha.");
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Email não confirmado. Verifique sua caixa de entrada.");
        } else {
          throw new Error(error.message);
        }
      }

      if (data.user) {
        console.log("✅ [AuthContext] Login autenticado com sucesso, carregando perfil...");
        
        // Carregar o perfil completo do usuário
        const enhancedUser = await loadUserProfile(data.user);
        console.log("🎯 [AuthContext] Usuário logado:", {
          id: enhancedUser.id,
          email: enhancedUser.email,
          nome: enhancedUser.nome,
          tipo: enhancedUser.tipo
        });
        
        // Verificar se o usuário tem um tipo válido
        if (!enhancedUser.tipo) {
          console.error("❌ [AuthContext] Perfil não encontrado no banco de dados");
          throw new Error("Perfil de usuário não encontrado no banco de dados. Verifique se você tem um perfil criado ou entre em contato com o suporte.");
        }
        
        console.log("✅ [AuthContext] Login realizado com sucesso! Tipo:", enhancedUser.tipo);
        return { error: null, user: enhancedUser };
      }

      throw new Error("Falha na autenticação. Tente novamente.");
    } catch (error: any) {
      console.error("❌ [AuthContext] Erro no login:", error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 [AuthContext] Fazendo logout...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("✅ [AuthContext] Logout realizado com sucesso");
    } catch (error) {
      console.error("❌ [AuthContext] Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: !!user && !!user.tipo,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
