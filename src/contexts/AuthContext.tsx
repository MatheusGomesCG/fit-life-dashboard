
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { buscarPerfilProfessor, ProfessorProfile } from "@/services/professorService";
import { verificarSeEhAdmin } from "@/services/adminService";

interface AuthUser extends User {
  nome?: string;
  tipo?: "professor" | "aluno" | "admin";
  profile?: ProfessorProfile;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (authUser: User) => {
    try {
      console.log("Carregando perfil para usuário:", authUser.id);
      
      // Verificar se é admin primeiro
      const isAdmin = await verificarSeEhAdmin(authUser.id);
      console.log("É admin?", isAdmin);
      
      if (isAdmin) {
        const enhancedUser: AuthUser = {
          ...authUser,
          nome: authUser.user_metadata?.nome || authUser.user_metadata?.full_name || "Administrador",
          tipo: "admin",
          isAdmin: true
        };
        console.log("Usuário admin configurado:", enhancedUser);
        setUser(enhancedUser);
        return;
      }
      
      // Se não é admin, verificar se é professor
      const profile = await buscarPerfilProfessor(authUser.id);
      console.log("Perfil de professor:", profile);
      
      const enhancedUser: AuthUser = {
        ...authUser,
        nome: profile?.nome || authUser.user_metadata?.nome || authUser.user_metadata?.full_name,
        tipo: profile ? "professor" : "aluno",
        profile: profile || undefined,
        isAdmin: false
      };
      
      console.log("Usuário configurado:", enhancedUser);
      setUser(enhancedUser);
    } catch (error) {
      console.error("Erro ao carregar perfil do usuário:", error);
      // Em caso de erro, usar dados básicos
      const basicUser: AuthUser = {
        ...authUser,
        nome: authUser.user_metadata?.nome || authUser.user_metadata?.full_name,
        tipo: "aluno",
        isAdmin: false
      };
      setUser(basicUser);
    }
  };

  useEffect(() => {
    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Tentando fazer login com:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log("Login bem-sucedido:", data.user?.id);

      if (data.user) {
        await loadUserProfile(data.user);
      }

      return { error: null };
    } catch (error: any) {
      console.error("Erro no login:", error);
      return { error };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error("Erro no login com Google:", error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
