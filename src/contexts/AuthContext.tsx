
import React, { createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthContextType, AuthUser } from "@/types/auth";
import { useAuthSession } from "@/hooks/useAuthSession";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading } = useAuthSession();

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
        console.log("✅ [AuthContext] Login realizado com sucesso");
        return { error: null, user: data.user };
      }

      throw new Error("Falha na autenticação");
    } catch (error: any) {
      console.error("❌ [AuthContext] Erro no login:", error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 [AuthContext] Iniciando logout...");
      
      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ [AuthContext] Erro no logout do Supabase:", error);
        // Mesmo com erro, vamos continuar com o logout local
      }
      
      console.log("✅ [AuthContext] Logout realizado com sucesso");
      
      // Redirecionar para a página de login
      window.location.href = '/login';
      
    } catch (error) {
      console.error("❌ [AuthContext] Erro inesperado no logout:", error);
      
      // Em caso de erro, ainda assim redirecionar para login
      toast.error("Erro ao fazer logout, redirecionando...");
      window.location.href = '/login';
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

  console.log("🔍 [AuthContext] Estado atual:", {
    hasUser: !!user,
    userType: user?.tipo,
    isAuthenticated: !!user && !!user.tipo,
    loading
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
