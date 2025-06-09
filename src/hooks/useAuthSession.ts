
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

      if (professorError) {
        console.warn("⚠️ [loadUserProfile] Erro ao buscar professor:", professorError);
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

      if (alunoError) {
        console.warn("⚠️ [loadUserProfile] Erro ao buscar aluno:", alunoError);
      }

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
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ [useAuthSession] Erro ao obter sessão:", error);
          if (mounted) {
            setSession(null);
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (!mounted) return;

        console.log("📝 [useAuthSession] Sessão inicial:", session ? "encontrada" : "não encontrada");
        
        setSession(session);

        if (session?.user) {
          console.log("👤 [useAuthSession] Carregando perfil inicial...");
          try {
            const enhancedUser = await loadUserProfile(session.user);
            if (mounted) {
              setUser(enhancedUser);
              console.log("✅ [useAuthSession] Perfil carregado:", enhancedUser.tipo);
            }
          } catch (profileError) {
            console.error("❌ [useAuthSession] Erro ao carregar perfil:", profileError);
            if (mounted) {
              setUser({
                ...session.user,
                nome: session.user.email?.split("@")[0] || "Usuário",
                tipo: undefined
              });
            }
          }
        } else {
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

    // Timeout de segurança mais agressivo
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("⚠️ [useAuthSession] Timeout atingido, finalizando loading");
        setLoading(false);
      }
    }, 5000); // 5 segundos

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 [useAuthSession] Evento de auth:", event);
        
        if (!mounted) return;
        
        setSession(session);

        if (session?.user) {
          console.log("👤 [useAuthSession] Carregando perfil após mudança...");
          
          // Use setTimeout para evitar bloqueio
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const enhancedUser = await loadUserProfile(session.user);
              if (mounted) {
                setUser(enhancedUser);
                setLoading(false);
                console.log("✅ [useAuthSession] Perfil carregado após mudança:", enhancedUser.tipo);
              }
            } catch (profileError) {
              console.error("❌ [useAuthSession] Erro ao carregar perfil após mudança:", profileError);
              if (mounted) {
                setUser({
                  ...session.user,
                  nome: session.user.email?.split("@")[0] || "Usuário",
                  tipo: undefined
                });
                setLoading(false);
              }
            }
          }, 100);
        } else {
          console.log("❌ [useAuthSession] Limpando usuário");
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      }
    );

    initialize();

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading
  };
};
