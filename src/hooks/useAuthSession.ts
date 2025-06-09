
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
      console.log("🔍 Carregando perfil para usuário:", authUser.id);
      
      const role = await getUserRole(authUser.id);
      console.log("✅ Tipo de usuário identificado:", role);
      
      if (role === "unknown") {
        console.warn("⚠️ Usuário não tem perfil válido");
        const fallbackUser: AuthUser = {
          ...authUser,
          nome: authUser.email?.split("@")[0] || "Usuário",
          tipo: undefined
        };
        setUser(fallbackUser);
        return fallbackUser;
      }
      
      const nome = await getUserName(authUser.id, role);
      let profile: ProfessorProfile | undefined;

      if (role === "professor") {
        console.log("👨‍🏫 Carregando perfil do professor...");
        profile = await buscarPerfilProfessor(authUser.id);
        console.log("👨‍🏫 Perfil do professor carregado:", profile?.nome);
      }

      const enhancedUser: AuthUser = {
        ...authUser,
        nome,
        tipo: role,
        profile
      };

      console.log("🎯 Usuário final montado:", {
        id: enhancedUser.id,
        email: enhancedUser.email,
        nome: enhancedUser.nome,
        tipo: enhancedUser.tipo
      });
      
      setUser(enhancedUser);
      return enhancedUser;
    } catch (error) {
      console.error("❌ Erro ao carregar perfil do usuário:", error);
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
      try {
        console.log("🚀 Inicializando sessão de autenticação...");
        const { data } = await supabase.auth.getSession();
        
        if (!mounted) return;

        const session = data.session;
        console.log("📋 Sessão atual:", session ? "Encontrada" : "Não encontrada");
        setSession(session);

        if (session?.user) {
          console.log("👤 Usuário encontrado na sessão, carregando perfil...");
          await loadUserProfile(session.user);
        } else {
          console.log("❌ Nenhum usuário na sessão");
          setUser(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("❌ Erro na inicialização:", error);
        if (mounted) {
          setLoading(false);
          setUser(null);
          setSession(null);
        }
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Mudança de estado de auth:", event, session ? "com sessão" : "sem sessão");
        
        if (!mounted) return;
        
        setSession(session);

        if (session?.user) {
          console.log("👤 Carregando perfil após mudança de estado...");
          try {
            await loadUserProfile(session.user);
          } catch (error) {
            console.error("❌ Erro ao carregar perfil:", error);
            setUser(null);
          }
        } else {
          console.log("❌ Limpando usuário após mudança de estado");
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

  return {
    user,
    session,
    loading,
    loadUserProfile
  };
};
