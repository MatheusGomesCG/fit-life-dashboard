
import { supabase } from "@/integrations/supabase/client";
import { criarPerfilProfessor, criarPlanoProfessor, criarPerfilAluno, ProfessorProfile, ProfessorPlano, AlunoProfile } from "./professorService";
import { marcarTokenComoUsado } from "./registrationTokenService";

export interface CadastroProfessorData {
  email: string;
  nome: string;
  telefone?: string;
  documento?: string;
  endereco?: string;
  especialidade?: string;
  biografia?: string;
  tipo_plano: "25" | "50" | "100" | "100+";
  token: string;
}

export interface CadastroAlunoData {
  email: string;
  nome: string;
  telefone?: string;
  idade?: number;
  peso?: number;
  altura?: number;
  experiencia?: string;
  objetivo?: string;
  restricoes_medicas?: string;
  professor_id: string;
}

const gerarSenhaTemporaria = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const obterLimiteAlunos = (tipoPlano: string): number => {
  switch (tipoPlano) {
    case "25": return 25;
    case "50": return 50;
    case "100": return 100;
    case "100+": return -1; // Ilimitado
    default: return 25;
  }
};

const obterPrecoPlano = (tipoPlano: string): number => {
  switch (tipoPlano) {
    case "25": return 29.00;
    case "50": return 49.00;
    case "100": return 89.00;
    case "100+": return 149.00;
    default: return 29.00;
  }
};

export const cadastrarProfessor = async (dadosCadastro: CadastroProfessorData): Promise<{
  user: any;
  profile: ProfessorProfile;
  plano: ProfessorPlano;
}> => {
  try {
    console.log("Iniciando cadastro do professor:", dadosCadastro.email);
    
    // Gerar senha temporária
    const senhaTemporaria = gerarSenhaTemporaria();
    console.log("Senha temporária gerada para:", dadosCadastro.email);

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: dadosCadastro.email,
      password: senhaTemporaria,
      email_confirm: true,
      user_metadata: {
        nome: dadosCadastro.nome,
        tipo: "professor",
        senha_temporaria: true
      }
    });

    if (authError) {
      console.error("Erro ao criar usuário:", authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Falha ao criar usuário");
    }

    console.log("Usuário criado com sucesso:", authData.user.id);

    // Criar perfil do professor
    const profileData: Omit<ProfessorProfile, "id" | "created_at" | "updated_at"> = {
      user_id: authData.user.id,
      nome: dadosCadastro.nome,
      telefone: dadosCadastro.telefone,
      documento: dadosCadastro.documento,
      endereco: dadosCadastro.endereco,
      especialidade: dadosCadastro.especialidade,
      biografia: dadosCadastro.biografia,
      status: "ativo"
    };

    const profile = await criarPerfilProfessor(profileData);
    console.log("Perfil do professor criado:", profile.id);

    // Criar plano do professor
    const planoData: Omit<ProfessorPlano, "id" | "created_at" | "updated_at"> = {
      professor_id: profile.id!,
      tipo_plano: dadosCadastro.tipo_plano,
      limite_alunos: obterLimiteAlunos(dadosCadastro.tipo_plano),
      preco_mensal: obterPrecoPlano(dadosCadastro.tipo_plano),
      data_inicio: new Date().toISOString().split('T')[0],
      data_vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "ativo"
    };

    const plano = await criarPlanoProfessor(planoData);
    console.log("Plano do professor criado:", plano.id);

    // Marcar token como usado
    await marcarTokenComoUsado(dadosCadastro.token);
    console.log("Token marcado como usado");

    // TODO: Enviar email com senha temporária
    console.log(`Email seria enviado para ${dadosCadastro.email} com senha: ${senhaTemporaria}`);

    return {
      user: authData.user,
      profile,
      plano
    };
  } catch (error) {
    console.error("Erro no cadastro do professor:", error);
    throw error;
  }
};

export const cadastrarAluno = async (dadosCadastro: CadastroAlunoData): Promise<{
  user: any;
  profile: AlunoProfile;
}> => {
  try {
    console.log("Iniciando cadastro do aluno:", dadosCadastro.email);
    
    // Gerar senha temporária
    const senhaTemporaria = gerarSenhaTemporaria();
    console.log("Senha temporária gerada para:", dadosCadastro.email);

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: dadosCadastro.email,
      password: senhaTemporaria,
      email_confirm: true,
      user_metadata: {
        nome: dadosCadastro.nome,
        tipo: "aluno",
        senha_temporaria: true
      }
    });

    if (authError) {
      console.error("Erro ao criar usuário:", authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Falha ao criar usuário");
    }

    console.log("Usuário criado com sucesso:", authData.user.id);

    // Criar perfil do aluno
    const profileData: Omit<AlunoProfile, "id" | "created_at" | "updated_at"> = {
      user_id: authData.user.id,
      professor_id: dadosCadastro.professor_id,
      nome: dadosCadastro.nome,
      email: dadosCadastro.email,
      telefone: dadosCadastro.telefone,
      idade: dadosCadastro.idade,
      peso: dadosCadastro.peso,
      altura: dadosCadastro.altura,
      experiencia: dadosCadastro.experiencia,
      objetivo: dadosCadastro.objetivo,
      restricoes_medicas: dadosCadastro.restricoes_medicas,
      senha_temporaria: true
    };

    const profile = await criarPerfilAluno(profileData);
    console.log("Perfil do aluno criado:", profile.id);

    // TODO: Enviar email com senha temporária
    console.log(`Email seria enviado para ${dadosCadastro.email} com senha: ${senhaTemporaria}`);

    return {
      user: authData.user,
      profile
    };
  } catch (error) {
    console.error("Erro no cadastro do aluno:", error);
    throw error;
  }
};
