
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
      console.log("📧 [loadUserProfile] Email do usuário:", authUser.email);
      
      // Primeiro, tentar professor
      console.log("👨‍🏫 [loadUserProfile] Buscando professor...");
      const { data: professorData, error: professorError } = await supabase
        .from('professor_profiles')
        .select('nome')
        .eq('user_id', authUser.id)
        .maybeSingle();

      console.log("📊 [loadUserProfile] Resultado professor:", { professorData, professorError });

      if (professorError && professorError.code !== 'PGRST116') {
        console.error("❌ [loadUserProfile] Erro real ao buscar professor:", professorError);
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
      console.log("👨‍🎓 [loadUserProfile] Buscando aluno...");
      const { data: alunoData, error: alunoError } = await supabase
        .from('aluno_profiles')
        .select('nome')
        .eq('user_id', authUser.id)
        .maybeSingle();

      console.log("📊 [loadUserProfile] Resultado aluno:", { alunoData, alunoError });

      if (alunoError && alunoError.code !== 'PGRST116') {
        console.error("❌ [loadUserProfile] Erro real ao buscar aluno:", alunoError);
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
      
      // Se estamos na página de professor, assumir que é professor
      const currentPath = window.location.pathname + window.location.search;
      const isFromProfessorLogin = currentPath.includes('tipo=professor') || currentPath.includes('dashboard-professor');
      
      const defaultUserType = isFromProfessorLogin ? "professor" : "aluno";
      console.log("🎯 [loadUserProfile] Tipo padrão detectado:", defaultUserType, "baseado em:", currentPath);
      
      return {
        ...authUser,
        nome: authUser.email?.split("@")[0] || "Usuário",
        tipo: defaultUserType as "professor" | "aluno"
      };

    } catch (error) {
      console.error("❌ [loadUserProfile] Erro geral:", error);
      
      // Em caso de erro, ainda assim retornar um usuário válido
      const currentPath = window.location.pathname + window.location.search;
      const isFromProfessorLogin = currentPath.includes('tipo=professor') || currentPath.includes('dashboard-professor');
      const defaultUserType = isFromProfessorLogin ? "professor" : "aluno";
      
      console.log("🛟 [loadUserProfile] Fallback - criando usuário com tipo:", defaultUserType);
      
      return {
        ...authUser,
        nome: authUser.email?.split("@")[0] || "Usuário",
        tipo: defaultUserType as "professor" | "aluno"
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
            // Mesmo com erro, criar um usuário básico
            if (mounted) {
              const currentPath = window.location.pathname + window.location.search;
              const isFromProfessorLogin = currentPath.includes('tipo=professor') || currentPath.includes('dashboard-professor');
              const defaultUserType = isFromProfessorLogin ? "professor" : "aluno";
              
              setUser({
                ...session.user,
                nome: session.user.email?.split("@")[0] || "Usuário",
                tipo: defaultUserType as "professor" | "aluno"
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

    // Timeout de segurança - reduzido para 3 segundos
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("⚠️ [useAuthSession] Timeout atingido, finalizando loading");
        setLoading(false);
      }
    }, 3000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 [useAuthSession] Evento de auth:", event);
        
        if (!mounted) return;
        
        setSession(session);

        if (session?.user) {
          console.log("👤 [useAuthSession] Carregando perfil após mudança...");
          
          // IMPORTANTE: Não usar setTimeout aqui para evitar loop infinito
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
              const currentPath = window.location.pathname + window.location.search;
              const isFromProfessorLogin = currentPath.includes('tipo=professor') || currentPath.includes('dashboard-professor');
              const defaultUserType = isFromProfessorLogin ? "professor" : "aluno";
              
              setUser({
                ...session.user,
                nome: session.user.email?.split("@")[0] || "Usuário",
                tipo: defaultUserType as "professor" | "aluno"
              });
              setLoading(false);
            }
          }
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
