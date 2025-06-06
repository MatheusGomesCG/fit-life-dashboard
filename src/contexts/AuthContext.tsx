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
  login: (email: string, password: string) => Promise<{ error: any; user?: AuthUser }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserRole = async (userId: string): Promise<"professor" | "aluno" | "admin" | "unknown"> => {
    try {
      const { data: professor } = await supabase
        .from("professor_profiles")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (professor) return "professor";

      const { data: aluno } = await supabase
        .from("aluno_profiles")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (aluno) return "aluno";

      const { data: admin } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (admin) return "admin";

      return "unknown";
    } catch (error) {
      console.error("Erro ao identificar tipo de usuário:", error);
      return "unknown";
    }
  };

  const getUserName = async (userId: string, role: string): Promise<string> => {
    try {
      let nome = "";

      if (role === "professor") {
        const profile = await buscarPerfilProfessor(userId);
        return profile?.nome ?? "Professor";
      }

      if (role === "aluno") {
        const { data } = await supabase
          .from("aluno_profiles")
          .select("nome")
          .eq("user_id", userId)
          .single();

        return data?.nome ?? "Aluno";
      }

      if (role === "admin") {
        const { data } = await supabase
          .from("admin_users")
          .select("nome")
          .eq("user_id", userId)
          .single();

        return data?.nome ?? "Administrador";
      }

      return "Usuário";
    } catch (error) {
      console.warn(`Erro ao buscar nome para usuário (${role}):`, error);
      return "Usuário";
    }
  };

  const loadUserProfile = async (authUser: User): Promise<AuthUser> => {
    try {
      const role = await getUserRole(authUser.id);
      const nome = await getUserName(authUser.id, role);
      let profile: ProfessorProfile | undefined;

      if (role === "professor") {
        profile = await buscarPerfilProfessor(authUser.id);
      }

      const enhancedUser: AuthUser = {
        ...authUser,
        nome,
        tipo: role !== "unknown" ? role : undefined,
        profile
      };

      setUser(enhancedUser);
      return enhancedUser;
    } catch (error) {
      console.error("Erro ao carregar perfil do usuário:", error);
      const fallbackUser: AuthUser = {
        ...authUser,
        nome: authUser.email?.split("@")[0] || "Usuário",
        tipo: undefined
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const session = data.session;
      setSession(session);

      if (session?.user) {
        await loadUserProfile(session.user);
      }

      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    initialize();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) throw new Error("Email e senha são obrigatórios");
      if (!email.includes("@")) throw new Error("Formato de e-mail inválido");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) throw error;

      if (data.user) {
        const enhancedUser = await loadUserProfile(data.user);
        return { error: null, user: enhancedUser };
      }

      return { error: null };
    } catch (error) {
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
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: !!user?.tipo,
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