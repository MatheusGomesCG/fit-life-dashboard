
import React, { createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthContextType, AuthUser } from "@/types/auth";
import { useAuthSession } from "@/hooks/useAuthSession";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading } = useAuthSession();

  const login = async (email: string, password: string) => {
    try {
      console.log("🚀 [AuthContext] Iniciando login para:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        console.error("❌ [AuthContext] Erro no login:", error);
        return { error };
      }

      if (data.user && data.session) {
        console.log("✅ [AuthContext] Login realizado com sucesso:", {
          userId: data.user.id,
          email: data.user.email
        });
        
        // A validação do professor será feita pelo useAuthSession
        return { error: null, user: data.user };
      }

      throw new Error("Falha na autenticação - dados incompletos");
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
    isAuthenticated: !!user && !!session && user.tipo === "professor",
    login,
    logout
  };

  console.log("🔍 [AuthContext] Estado do contexto:", {
    hasUser: !!user,
    hasSession: !!session,
    userEmail: user?.email,
    userType: user?.tipo,
    isAuthenticated: !!user && !!session && user.tipo === "professor",
    loading
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
