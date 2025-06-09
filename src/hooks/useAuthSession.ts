
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/types/auth";

export const useAuthSession = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const validateProfessorProfile = async (authUser: User): Promise<AuthUser | null> => {
    try {
      console.log("🔍 [useAuthSession] Validando perfil de professor para:", authUser.id);
      
      const { data: professorProfile, error } = await supabase
        .from('professor_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (error || !professorProfile) {
        console.error("❌ [useAuthSession] Usuário não é um professor válido:", error);
        return null;
      }

      console.log("✅ [useAuthSession] Professor válido encontrado:", {
        id: professorProfile.id,
        nome: professorProfile.nome
      });

      return {
        ...authUser,
        nome: professorProfile.nome,
        tipo: "professor" as const,
        profile: {
          ...professorProfile,
          status: professorProfile.status as "ativo" | "inativo" | "suspenso"
        }
      };
    } catch (error) {
      console.error("❌ [useAuthSession] Erro ao validar professor:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("🔍 [useAuthSession] Inicializando autenticação...");
        
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (initialSession?.user) {
          const validatedUser = await validateProfessorProfile(initialSession.user);
          
          if (mounted) {
            if (validatedUser) {
              setUser(validatedUser);
              setSession(initialSession);
              console.log("✅ [useAuthSession] Usuário autenticado:", validatedUser.nome);
            } else {
              console.log("❌ [useAuthSession] Professor não válido, fazendo logout");
              await supabase.auth.signOut();
              setUser(null);
              setSession(null);
            }
          }
        } else {
          if (mounted) {
            setUser(null);
            setSession(null);
            console.log("👤 [useAuthSession] Nenhuma sessão encontrada");
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("🔄 [useAuthSession] Auth event:", event);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !currentSession) {
        setUser(null);
        setSession(null);
        setLoading(false);
        console.log("👤 [useAuthSession] Usuário deslogado");
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (currentSession?.user) {
          const validatedUser = await validateProfessorProfile(currentSession.user);
          
          if (mounted) {
            if (validatedUser) {
              setUser(validatedUser);
              setSession(currentSession);
              console.log("✅ [useAuthSession] Usuário validado:", validatedUser.nome);
            } else {
              console.log("❌ [useAuthSession] Professor não válido");
              await supabase.auth.signOut();
            }
          }
        }
        if (mounted) {
          setLoading(false);
        }
      }
    });

    // Inicializar
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading
  };
};
