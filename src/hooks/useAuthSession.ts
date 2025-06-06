
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
      console.log("Carregando perfil para usuário:", authUser.id);
      const role = await getUserRole(authUser.id);
      console.log("Tipo de usuário retornado:", role);
      
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

      console.log("Usuário carregado com sucesso:", enhancedUser);
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

  return {
    user,
    session,
    loading,
    loadUserProfile
  };
};
