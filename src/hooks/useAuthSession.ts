
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/types/auth";
import { getUserRole, getUserName } from "@/utils/userRoleUtils";
import { buscarPerfilProfessor, ProfessorProfile } from "@/services/professorService";

export const useAuthSession = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (authUser: User): Promise<AuthUser> => {
    try {
      console.log("🔍 [loadUserProfile] Iniciando carregamento do perfil para:", authUser.id);
      
      const role = await getUserRole(authUser.id);
      console.log("✅ [loadUserProfile] Tipo de usuário identificado:", role);
      
      if (role === "unknown") {
        console.warn("⚠️ [loadUserProfile] Usuário não tem perfil válido");
        const fallbackUser: AuthUser = {
          ...authUser,
          nome: authUser.email?.split("@")[0] || "Usuário",
          tipo: undefined
        };
        console.log("🔄 [loadUserProfile] Definindo usuário fallback:", fallbackUser.nome);
        setUser(fallbackUser);
        return fallbackUser;
      }
      
      console.log("🔍 [loadUserProfile] Buscando nome do usuário...");
      const nome = await getUserName(authUser.id, role);
      console.log("✅ [loadUserProfile] Nome obtido:", nome);
      
      let profile: ProfessorProfile | undefined;

      if (role === "professor") {
        console.log("👨‍🏫 [loadUserProfile] Carregando perfil do professor...");
        profile = await buscarPerfilProfessor(authUser.id);
        console.log("👨‍🏫 [loadUserProfile] Perfil do professor carregado:", profile?.nome);
      }

      const enhancedUser: AuthUser = {
        ...authUser,
        nome,
        tipo: role,
        profile
      };

      console.log("🎯 [loadUserProfile] Usuário final montado:", {
        id: enhancedUser.id,
        email: enhancedUser.email,
        nome: enhancedUser.nome,
        tipo: enhancedUser.tipo
      });
      
      setUser(enhancedUser);
      return enhancedUser;
    } catch (error) {
      console.error("❌ [loadUserProfile] Erro ao carregar perfil do usuário:", error);
      const fallbackUser: AuthUser = {
        ...authUser,
        nome: authUser.email?.split("@")[0] || "Usuário",
        tipo: undefined
      };
      console.log("🔄 [loadUserProfile] Definindo usuário fallback após erro:", fallbackUser.nome);
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        console.log("🚀 [useAuthSession] Inicializando sessão de autenticação...");
        const { data } = await supabase.auth.getSession();
        
        if (!mounted) return;

        const currentSession = data.session;
        console.log("📋 [useAuthSession] Sessão atual:", currentSession ? "Encontrada" : "Não encontrada");
        setSession(currentSession);

        if (currentSession?.user) {
          console.log("👤 [useAuthSession] Usuário encontrado na sessão, carregando perfil...");
          await loadUserProfile(currentSession.user);
        } else {
          console.log("❌ [useAuthSession] Nenhum usuário na sessão");
          setUser(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("❌ [useAuthSession] Erro na inicialização:", error);
        if (mounted) {
          setLoading(false);
          setUser(null);
          setSession(null);
        }
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 [useAuthSession] Mudança de estado de auth:", event, session ? "com sessão" : "sem sessão");
        
        if (!mounted) return;
        
        setSession(session);

        if (session?.user) {
          console.log("👤 [useAuthSession] Carregando perfil após mudança de estado...");
          try {
            await loadUserProfile(session.user);
          } catch (error) {
            console.error("❌ [useAuthSession] Erro ao carregar perfil:", error);
            setUser(null);
          }
        } else {
          console.log("❌ [useAuthSession] Limpando usuário após mudança de estado");
          setUser(null);
        }

        // Definir loading como false após processar a mudança de estado
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          setLoading(false);
        }
      }
    );

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
