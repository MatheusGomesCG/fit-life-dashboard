
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
      console.log("🚀 Iniciando processo de login...");
      if (!email || !password) throw new Error("Email e senha são obrigatórios");
      if (!email.includes("@")) throw new Error("Formato de e-mail inválido");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        console.error("❌ Erro no login:", error);
        throw error;
      }

      if (data.user) {
        console.log("✅ Login realizado com sucesso, carregando perfil...");
        
        // Aguardar um momento para o sistema processar a autenticação
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const enhancedUser = await loadUserProfile(data.user);
        console.log("🎯 Usuário logado:", {
          id: enhancedUser.id,
          email: enhancedUser.email,
          nome: enhancedUser.nome,
          tipo: enhancedUser.tipo
        });
        
        return { error: null, user: enhancedUser };
      }

      return { error: null };
    } catch (error) {
      console.error("❌ Erro no login:", error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 Fazendo logout...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("✅ Logout realizado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
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
