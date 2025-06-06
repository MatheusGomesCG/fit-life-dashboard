
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

  const loadUserProfile = async (authUser: User) => {
    try {
      console.log("Loading user profile for:", authUser.id, authUser.email);
      
      // Check if user exists in professor_profiles - using maybeSingle to avoid errors
      const { data: professorCheck, error: professorError } = await supabase
        .from('professor_profiles')
        .select('user_id')
        .eq('user_id', authUser.id)
        .maybeSingle();
      
      console.log("Professor check result:", professorCheck, professorError);
      
      // Check if user exists in aluno_profiles - using maybeSingle to avoid errors
      const { data: alunoCheck, error: alunoError } = await supabase
        .from('aluno_profiles')
        .select('user_id')
        .eq('user_id', authUser.id)
        .maybeSingle();
      
      console.log("Aluno check result:", alunoCheck, alunoError);
      
      // Determine user role based on which table has the record
      let userRole: string;
      if (professorCheck && !professorError) {
        userRole = 'professor';
      } else if (alunoCheck && !alunoError) {
        userRole = 'aluno';
      } else {
        // Check admin table as fallback - using maybeSingle to avoid errors
        const { data: adminCheck, error: adminError } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', authUser.id)
          .maybeSingle();
        
        console.log("Admin check result:", adminCheck, adminError);
        
        if (adminCheck && !adminError) {
          userRole = 'admin';
        } else {
          userRole = 'unknown';
        }
      }

      console.log("Determined user role:", userRole);

      let profile: ProfessorProfile | undefined;
      let userName = authUser.email?.split('@')[0] || 'Usuário';

      // If user is a professor, get their profile
      if (userRole === 'professor') {
        try {
          profile = await buscarPerfilProfessor(authUser.id);
          if (profile) {
            userName = profile.nome;
          }
        } catch (profileError) {
          console.warn("Could not load professor profile:", profileError);
        }
      }

      // If user is a student, get their name from aluno_profiles
      if (userRole === 'aluno') {
        try {
          const { data: alunoProfile, error: alunoProfileError } = await supabase
            .from('aluno_profiles')
            .select('nome')
            .eq('user_id', authUser.id)
            .single();
          
          if (!alunoProfileError && alunoProfile) {
            userName = alunoProfile.nome;
          }
        } catch (alunoProfileError) {
          console.warn("Could not load student profile:", alunoProfileError);
        }
      }

      // If user is an admin, get their name from admin_users
      if (userRole === 'admin') {
        try {
          const { data: adminProfile, error: adminProfileError } = await supabase
            .from('admin_users')
            .select('nome')
            .eq('user_id', authUser.id)
            .single();
          
          if (!adminProfileError && adminProfile) {
            userName = adminProfile.nome;
          }
        } catch (adminProfileError) {
          console.warn("Could not load admin profile:", adminProfileError);
        }
      }

      const enhancedUser: AuthUser = {
        ...authUser,
        nome: userName,
        tipo: userRole as "professor" | "aluno" | "admin",
        profile: profile || undefined
      };
      
      console.log("Enhanced user created:", enhancedUser.tipo, enhancedUser.nome);
      setUser(enhancedUser);
      return enhancedUser;
    } catch (error) {
      console.error("Erro ao carregar perfil do usuário:", error);
      
      // In case of error, user type will be 'unknown' and they won't have access
      const basicUser: AuthUser = {
        ...authUser,
        nome: authUser.email?.split('@')[0] || 'Usuário',
        tipo: undefined // This will prevent access to protected areas
      };
      console.log("Basic user (no access):", basicUser.nome);
      setUser(basicUser);
      return basicUser;
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
      
      // Input validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      if (!email.includes('@')) {
        throw new Error("Invalid email format");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) throw error;

      console.log("Login successful:", data.user?.email);
      if (data.user) {
        const enhancedUser = await loadUserProfile(data.user);
        console.log("Login - Enhanced user type:", enhancedUser?.tipo);
        return { error: null, user: enhancedUser };
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
    isAuthenticated: !!user && !!user.tipo,
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
