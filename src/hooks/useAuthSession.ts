
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
      const { data: professorData, error: professorError } = await supabase
        .from('professor_profiles')
        .select('nome')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (professorError && professorError.code !== 'PGRST116') {
        console.error("❌ [loadUserProfile] Erro ao buscar professor:", professorError);
      }

      if (professorData) {
        console.log("✅ [loadUserProfile] Professor encontrado:", professorData.nome);
        return {
          ...authUser,
          nome: professorData.nome,
          tipo: "professor"
        };
      }

      // Se não for professor, tentar aluno
      const { data: alunoData, error: alunoError } = await supabase
        .from('aluno_profiles')
        .select('nome')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (alunoError && alunoError.code !== 'PGRST116') {
        console.error("❌ [loadUserProfile] Erro ao buscar aluno:", alunoError);
      }

      if (alunoData) {
        console.log("✅ [loadUserProfile] Aluno encontrado:", alunoData.nome);
        return {
          ...authUser,
          nome: alunoData.nome,
          tipo: "aluno"
        };
      }

      // Se não encontrou nenhum perfil, criar um perfil básico
      console.log("⚠️ [loadUserProfile] Nenhum perfil encontrado, criando perfil básico");
      
      return {
        ...authUser,
        nome: authUser.email?.split("@")[0] || "Usuário",
        tipo: "professor" // Default para professor
      };

    } catch (error) {
      console.error("❌ [loadUserProfile] Erro geral:", error);
      
      return {
        ...authUser,
        nome: authUser.email?.split("@")[0] || "Usuário",
        tipo: "professor"
      };
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        console.log("🚀 [useAuthSession] Inicializando...");
        
        // Primeiro, configurar o listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("🔄 [useAuthSession] Evento de auth:", event);
            
            if (!mounted) return;
            
            setSession(session);

            if (session?.user) {
              console.log("👤 [useAuthSession] Carregando perfil...");
              try {
                const enhancedUser = await loadUserProfile(session.user);
                if (mounted) {
                  setUser(enhancedUser);
                  console.log("✅ [useAuthSession] Perfil carregado:", enhancedUser.tipo);
                }
              } catch (error) {
                console.error("❌ [useAuthSession] Erro ao carregar perfil:", error);
                if (mounted) {
                  setUser({
                    ...session.user,
                    nome: session.user.email?.split("@")[0] || "Usuário",
                    tipo: "professor"
                  });
                }
              }
            } else {
              setUser(null);
            }
            
            if (mounted) {
              setLoading(false);
            }
          }
        );

        // Então, verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          console.log("📝 [useAuthSession] Sessão inicial encontrada");
          const enhancedUser = await loadUserProfile(session.user);
          if (mounted) {
            setSession(session);
            setUser(enhancedUser);
            console.log("✅ [useAuthSession] Perfil inicial carregado:", enhancedUser.tipo);
          }
        }

        if (mounted) {
          setLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("❌ [useAuthSession] Erro na inicialização:", error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    };

    const cleanup = initialize();

    // Timeout de segurança
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("⚠️ [useAuthSession] Timeout atingido, finalizando loading");
        setLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  return {
    user,
    session,
    loading
  };
};
