
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/types/auth";

export const useAuthSession = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const createAuthUser = (authUser: User): AuthUser => {
    console.log("🔧 [useAuthSession] Creating auth user:", {
      id: authUser.id,
      email: authUser.email,
      userMetadata: authUser.user_metadata
    });
    
    return {
      ...authUser,
      nome: authUser.user_metadata?.nome || authUser.email?.split("@")[0] || "Professor",
      tipo: "professor" // Sempre professor neste sistema
    };
  };

  useEffect(() => {
    let mounted = true;

    const handleAuthChange = (event: string, currentSession: Session | null) => {
      console.log("🔄 [useAuthSession] Auth event:", event, {
        hasSession: !!currentSession,
        userId: currentSession?.user?.id
      });
      
      if (!mounted) return;

      if (currentSession?.user) {
        const enhancedUser = createAuthUser(currentSession.user);
        setUser(enhancedUser);
        setSession(currentSession);
        console.log("✅ [useAuthSession] User authenticated:", {
          userId: enhancedUser.id,
          email: enhancedUser.email,
          tipo: enhancedUser.tipo
        });
      } else {
        setUser(null);
        setSession(null);
        console.log("👤 [useAuthSession] User cleared");
      }
      
      setLoading(false);
    };

    // Verificar sessão atual primeiro
    console.log("🔍 [useAuthSession] Checking existing session...");
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error("❌ [useAuthSession] Error getting session:", error);
        setLoading(false);
        return;
      }
      
      console.log("📋 [useAuthSession] Initial session check:", {
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
