
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
      console.log("🚀 [AuthContext] Iniciando login...");
      
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios");
      }
      
      if (!email.includes("@")) {
        throw new Error("Formato de e-mail inválido");
      }

      console.log("🔐 [AuthContext] Fazendo autenticação...");
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
        } else if (error.message.includes("Too many requests")) {
          throw new Error("Muitas tentativas de login. Aguarde alguns minutos.");
        } else {
          throw new Error(`Erro de autenticação: ${error.message}`);
        }
      }

      if (data.user) {
        console.log("✅ [AuthContext] Login autenticado, aguardando carregamento do perfil...");
        
        // Aguardar o hook carregar o perfil automaticamente
        // O useAuthSession vai detectar a mudança e carregar o perfil
        return { error: null };
      }

      throw new Error("Falha na autenticação");
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
    user: user || null,
    session: session || null,
    loading,
    isAuthenticated: !!user && !!user.tipo,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
