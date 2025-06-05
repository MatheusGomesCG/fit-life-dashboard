
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { buscarPerfilProfessor, ProfessorProfile } from "@/services/professorService";

interface AuthUser extends User {
  nome?: string;
  tipo?: "professor" | "aluno" | "admin";
  profile?: ProfessorProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (authUser: User) => {
    try {
      console.log("Loading user profile for:", authUser.id);
      
      // Primeiro, verificar se o email contém "professor" para identificar professores
      const isTeacherByEmail = authUser.email?.includes("professor");
      
      // Verificar se é professor e buscar perfil
      const profile = await buscarPerfilProfessor(authUser.id);
      
      // Determinar o tipo de usuário
      let userType: "professor" | "aluno" = "aluno";
      
      if (profile) {
        // Se tem perfil de professor, é professor
        userType = "professor";
      } else if (isTeacherByEmail) {
        // Se o email contém "professor", mesmo sem perfil, é professor
        userType = "professor";
      } else if (authUser.user_metadata?.tipo) {
        // Usar tipo dos metadados se disponível
        userType = authUser.user_metadata.tipo;
      }
      
      const enhancedUser: AuthUser = {
        ...authUser,
        nome: profile?.nome || authUser.user_metadata?.nome || authUser.email?.split('@')[0],
        tipo: userType,
        profile: profile || undefined
      };
      
      console.log("Enhanced user:", enhancedUser.tipo, enhancedUser.nome);
      setUser(enhancedUser);
    } catch (error) {
      console.error("Erro ao carregar perfil do usuário:", error);
      
      // Em caso de erro, usar dados básicos mas ainda verificar o email
      const isTeacherByEmail = authUser.email?.includes("professor");
      
      const basicUser: AuthUser = {
        ...authUser,
        nome: authUser.user_metadata?.nome || authUser.email?.split('@')[0],
        tipo: isTeacherByEmail ? "professor" : (authUser.user_metadata?.tipo || "aluno")
      };
      console.log("Basic user:", basicUser.tipo, basicUser.nome);
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
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log("Login successful:", data.user?.email);
      if (data.user) {
        await loadUserProfile(data.user);
      }

      return { error: null };
    } catch (error: any) {
      console.error("Erro no login:", error);
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
