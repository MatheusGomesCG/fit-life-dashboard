
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/types/auth";

export const useAuthSession = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const createAuthUser = (authUser: User): AuthUser => {
    // Criar usuário básico sem consultar o banco por enquanto
    return {
      ...authUser,
      nome: authUser.email?.split("@")[0] || "Usuário",
      tipo: "professor" // Definir como professor por padrão
    };
  };

  useEffect(() => {
    let mounted = true;

    const handleAuthChange = (event: string, currentSession: Session | null) => {
      console.log("🔄 [useAuthSession] Auth event:", event);
      
      if (!mounted) return;

      if (currentSession?.user) {
        const enhancedUser = createAuthUser(currentSession.user);
        setUser(enhancedUser);
        setSession(currentSession);
        console.log("✅ [useAuthSession] User set:", enhancedUser.tipo);
      } else {
        setUser(null);
        setSession(null);
        console.log("👤 [useAuthSession] User cleared");
      }
      
      setLoading(false);
    };

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (mounted) {
        handleAuthChange('INITIAL_SESSION', initialSession);
      }
    });

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
