
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
  if (!formData.nome || !formData.email || !formData.senha) {
    return {
      isValid: false,
      message: "Nome, email e senha são obrigatórios"
    };
  }

  if (formData.senha.length < 6) {
    return {
      isValid: false,
      message: "A senha deve ter pelo menos 6 caracteres"
    };
  }

  return { isValid: true };
};
