
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/types/auth";

export const useAuthSession = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (authUser: User): Promise<AuthUser> => {
    try {
      console.log("🔍 [loadUserProfile] Carregando perfil para:", authUser.id);
      
      // Primeiro, tentar professor
      const { data: professorData } = await supabase
        .from('professor_profiles')
        .select('nome')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (professorData) {
        console.log("✅ [loadUserProfile] Professor encontrado:", professorData.nome);
        return {
          ...authUser,
          nome: professorData.nome,
          tipo: "professor"
        };
      }

      // Se não for professor, tentar aluno
      const { data: alunoData } = await supabase
        .from('aluno_profiles')
        .select('nome')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (alunoData) {
        console.log("✅ [loadUserProfile] Aluno encontrado:", alunoData.nome);
        return {
          ...authUser,
          nome: alunoData.nome,
          tipo: "aluno"
        };
      }

      // Se não encontrou nenhum perfil
      console.log("⚠️ [loadUserProfile] Nenhum perfil encontrado");
      return {
        ...authUser,
        nome: authUser.email?.split("@")[0] || "Usuário",
        tipo: undefined
      };

    } catch (error) {
      console.error("❌ [loadUserProfile] Erro:", error);
      return {
        ...authUser,
        nome: authUser.email?.split("@")[0] || "Usuário",
        tipo: undefined
      };
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        console.log("🚀 [useAuthSession] Inicializando...");
        
        // Primeiro verificar se há sessão
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ [useAuthSession] Erro ao obter sessão:", error);
          if (mounted) {
            setUser(null);
            setSession(null);
            setLoading(false);
          }
          return;
        }
        
        if (!mounted) return;

        const currentSession = data?.session;
        console.log("📝 [useAuthSession] Sessão atual:", currentSession ? "encontrada" : "não encontrada");
        
        setSession(currentSession);

        if (currentSession?.user) {
          console.log("👤 [useAuthSession] Usuário encontrado, carregando perfil...");
          try {
            const enhancedUser = await loadUserProfile(currentSession.user);
            if (mounted) {
              setUser(enhancedUser);
            }
          } catch (profileError) {
            console.error("❌ [useAuthSession] Erro ao carregar perfil:", profileError);
            if (mounted) {
              setUser({
                ...currentSession.user,
                nome: currentSession.user.email?.split("@")[0] || "Usuário",
                tipo: undefined
              });
            }
          }
        } else {
          console.log("❌ [useAuthSession] Nenhum usuário na sessão");
          if (mounted) {
            setUser(null);
          }
        }

      } catch (error) {
        console.error("❌ [useAuthSession] Erro na inicialização:", error);
        if (mounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Configurar listener de mudanças de auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 [useAuthSession] Evento de auth:", event);
        
        if (!mounted) return;
        
        setSession(session);

        if (session?.user) {
          console.log("👤 [useAuthSession] Carregando perfil após mudança...");
          try {
            const enhancedUser = await loadUserProfile(session.user);
            if (mounted) {
              setUser(enhancedUser);
            }
          } catch (profileError) {
            console.error("❌ [useAuthSession] Erro ao carregar perfil após mudança:", profileError);
            if (mounted) {
              setUser({
                ...session.user,
                nome: session.user.email?.split("@")[0] || "Usuário",
                tipo: undefined
              });
            }
          }
        } else {
          console.log("❌ [useAuthSession] Limpando usuário");
          if (mounted) {
            setUser(null);
          }
        }
      }
    );

    // Inicializar
    initialize();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    loadUserProfile
  };
};
