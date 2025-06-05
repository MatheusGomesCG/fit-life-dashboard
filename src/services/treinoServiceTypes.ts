
export interface ExercicioTreino {
  nome_exercicio: string;
  grupo_muscular: string;
  carga_ideal: number;
  series: number;
  repeticoes: number;
  estrategia?: string;
  video_url?: string;
  dia_treino: string;
}

export interface FichaTreinoCompleta {
  ficha_id: string;
  aluno_id: string;
  professor_id: string;
  aluno_nome: string;
  aluno_email: string;
  idade: number;
  peso: number;
  altura: number;
  objetivo: string;
  experiencia: string;
  exercicios: ExercicioTreino[];
  created_at: string;
  updated_at: string;
}
