
import { supabase } from "@/integrations/supabase/client";
import { ProfessorFormData } from "@/utils/professorValidation";

export interface CreateProfessorResult {
  success: boolean;
  message: string;
}

export const createProfessor = async (formData: ProfessorFormData): Promise<CreateProfessorResult> => {
  console.log("🚀 [createProfessor] Iniciando cadastro do professor:", {
    email: formData.email,
    nome: formData.nome
  });

  try {
    // 1. Primeiro verificar se o email já existe na tabela de professores
    console.log("🔍 [createProfessor] Verificando se email já existe...");
    
    const { data: existingProfessor, error: checkError } = await supabase
      .from('professor_profiles')
      .select('id, nome')
      .eq('user_id', formData.email) // Temporariamente usando email para verificar
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("❌ [createProfessor] Erro ao verificar professor existente:", checkError);
      return {
        success: false,
        message: "Erro ao verificar dados existentes"
      };
    }

    // 2. Criar usuário no Supabase Auth
    console.log("👤 [createProfessor] Criando usuário no Auth...");
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.senha,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          nome: formData.nome,
          tipo: "professor"
        }
      }
    });

    console.log("📊 [createProfessor] Resultado Auth:", {
      user: authData.user?.id,
      session: !!authData.session,
      error: authError
    });

    if (authError) {
      console.error("❌ [createProfessor] Erro no Auth:", authError);
      
      if (authError.message.includes("User already registered") || authError.message.includes("already registered")) {
        return {
          success: false,
          message: "Este email já está cadastrado no sistema"
        };
      } else if (authError.message.includes("Password should be at least")) {
        return {
          success: false,
          message: "A senha deve ter pelo menos 6 caracteres"
        };
      } else if (authError.message.includes("Invalid email") || authError.message.includes("invalid email")) {
        return {
          success: false,
          message: "Email inválido"
        };
      } else {
        return {
          success: false,
          message: `Erro ao criar conta: ${authError.message}`
        };
      }
    }

    if (!authData.user) {
      console.error("❌ [createProfessor] Usuário não foi criado");
      return {
        success: false,
        message: "Erro ao criar usuário - dados do usuário não encontrados"
      };
    }

    console.log("✅ [createProfessor] Usuário criado com sucesso:", authData.user.id);

    // 3. Aguardar um pouco para garantir que o usuário foi criado no banco
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Criar perfil do professor
    console.log("👨‍🏫 [createProfessor] Criando perfil do professor...");
    
    const professorData = {
      user_id: authData.user.id,
      nome: formData.nome.trim(),
      telefone: formData.telefone?.trim() || null,
      documento: formData.documento?.trim() || null,
      endereco: formData.endereco?.trim() || null,
      especialidade: formData.especialidade?.trim() || null,
      biografia: formData.biografia?.trim() || null,
      status: 'ativo' as const
    };

    console.log("📝 [createProfessor] Dados do perfil:", professorData);

    const { data: profileData, error: profileError } = await supabase
      .from('professor_profiles')
      .insert(professorData)
      .select()
      .single();

    console.log("📊 [createProfessor] Resultado do perfil:", {
      data: profileData,
      error: profileError
    });

    if (profileError) {
      console.error("❌ [createProfessor] Erro ao criar perfil:", profileError);
      
      // Tentar excluir o usuário criado no Auth se o perfil falhou
      try {
        console.log("🗑️ [createProfessor] Tentando limpar usuário do Auth...");
        // Note: admin.deleteUser requires service role key, which we don't have in client
        console.log("⚠️ [createProfessor] Não é possível limpar usuário automaticamente");
      } catch (cleanupError) {
        console.error("❌ [createProfessor] Erro ao limpar usuário:", cleanupError);
      }
      
      if (profileError.code === '23505') {
        return {
          success: false,
          message: "Este professor já está cadastrado"
        };
      } else if (profileError.message?.includes('duplicate key')) {
        return {
          success: false,
          message: "Este email já está cadastrado como professor"
        };
      } else {
        return {
          success: false,
          message: `Erro ao criar perfil do professor: ${profileError.message}`
        };
      }
    }

    console.log("✅ [createProfessor] Professor criado com sucesso!");
    return {
      success: true,
      message: `Professor ${formData.nome} cadastrado com sucesso!`
    };

  } catch (error) {
    console.error("❌ [createProfessor] Erro inesperado:", error);
    return {
      success: false,
      message: "Erro inesperado ao cadastrar professor. Tente novamente."
    };
  }
};
