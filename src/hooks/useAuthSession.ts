
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
      
      // Verificar se existe perfil de professor
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
        profile: professorProfile
      };
    } catch (error) {
      console.error("❌ [useAuthSession] Erro ao validar professor:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const handleAuthChange = async (event: string, currentSession: Session | null) => {
      console.log("🔄 [useAuthSession] Auth event:", event, {
        hasSession: !!currentSession,
        userId: currentSession?.user?.id
      });
      
      if (!mounted) return;

      if (currentSession?.user) {
        console.log("🔍 [useAuthSession] Validando usuário...");
        const validatedUser = await validateProfessorProfile(currentSession.user);
        
        if (validatedUser) {
          setUser(validatedUser);
          setSession(currentSession);
          console.log("✅ [useAuthSession] Usuário autenticado como professor:", {
            userId: validatedUser.id,
            email: validatedUser.email,
            nome: validatedUser.nome
          });
        } else {
          console.log("❌ [useAuthSession] Usuário não é professor válido, fazendo logout");
          // Usuário não é professor válido, fazer logout
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
        }
      } else {
        setUser(null);
        setSession(null);
        console.log("👤 [useAuthSession] Usuário deslogado");
      }
      
      setLoading(false);
    };

    // Verificar sessão atual primeiro
    console.log("🔍 [useAuthSession] Verificando sessão existente...");
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error("❌ [useAuthSession] Erro ao buscar sessão:", error);
        setLoading(false);
        return;
      }
      
      console.log("📋 [useAuthSession] Sessão inicial:", {
        hasSession: !!initialSession,
        userId: initialSession?.user?.id
      });
      
      if (mounted) {
        handleAuthChange('INITIAL_SESSION', initialSession);
      }
    });

    // Configurar listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

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
