
import { User, Session } from "@supabase/supabase-js";
import { ProfessorProfile } from "@/services/professorService";

export interface AuthUser extends User {
  nome?: string;
  tipo?: "professor" | "aluno" | "admin";
  profile?: ProfessorProfile;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any; user?: AuthUser }>;
  logout: () => Promise<void>;
}
