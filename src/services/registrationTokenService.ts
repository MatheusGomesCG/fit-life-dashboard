
import { supabase } from "@/integrations/supabase/client";

export interface ProfessorRegistrationToken {
  id: string;
  token: string;
  professor_email: string;
  professor_nome: string;
  tipo_plano: "25" | "50" | "100" | "100+";
  expires_at: string;
  created_at: string;
}

export interface CreateTokenData {
  professor_email: string;
  professor_nome: string;
  tipo_plano: "25" | "50" | "100" | "100+";
  expires_at: string;
}

// Mock data for development since the table doesn't exist yet
const mockTokens: ProfessorRegistrationToken[] = [];

export const criarTokenCadastroProfessor = async (data: CreateTokenData): Promise<ProfessorRegistrationToken> => {
  // Generate a simple token for development
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  const newToken: ProfessorRegistrationToken = {
    id: Math.random().toString(36).substring(2, 15),
    token,
    professor_email: data.professor_email,
    professor_nome: data.professor_nome,
    tipo_plano: data.tipo_plano,
    expires_at: data.expires_at,
    created_at: new Date().toISOString()
  };

  mockTokens.push(newToken);
  return newToken;
};

export const listarTokensAtivos = async (): Promise<ProfessorRegistrationToken[]> => {
  // Return mock tokens for development
  return mockTokens.filter(token => new Date(token.expires_at) > new Date());
};

export const buscarTokenCadastro = async (token: string): Promise<ProfessorRegistrationToken | null> => {
  // Find mock token for development
  const foundToken = mockTokens.find(t => t.token === token);
  
  if (!foundToken || new Date(foundToken.expires_at) <= new Date()) {
    return null;
  }
  
  return foundToken;
};

export const marcarTokenComoUsado = async (token: string): Promise<void> => {
  // Mark token as used by removing it from mock tokens for development
  const index = mockTokens.findIndex(t => t.token === token);
  if (index > -1) {
    mockTokens.splice(index, 1);
  }
};
