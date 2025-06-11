
export interface ProfessorFormData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  especialidade: string;
  documento: string;
  endereco: string;
  biografia: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateProfessorForm = (formData: ProfessorFormData): ValidationResult => {
  // Validar campos obrigatórios
  if (!formData.nome?.trim()) {
    return {
      isValid: false,
      message: "Nome é obrigatório"
    };
  }

  if (!formData.email?.trim()) {
    return {
      isValid: false,
      message: "Email é obrigatório"
    };
  }

  if (!formData.senha?.trim()) {
    return {
      isValid: false,
      message: "Senha é obrigatória"
    };
  }

  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email.trim())) {
    return {
      isValid: false,
      message: "Formato de email inválido"
    };
  }

  // Validar tamanho da senha
  if (formData.senha.length < 6) {
    return {
      isValid: false,
      message: "A senha deve ter pelo menos 6 caracteres"
    };
  }

  // Validar tamanho do nome
  if (formData.nome.trim().length < 2) {
    return {
      isValid: false,
      message: "Nome deve ter pelo menos 2 caracteres"
    };
  }

  return { isValid: true };
};
