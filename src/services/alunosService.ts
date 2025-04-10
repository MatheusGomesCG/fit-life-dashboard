
import axios from "axios";

const API_URL = "https://api.example.com"; // Substitua pela URL real da sua API

export interface Aluno {
  id?: string;
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  percentualGordura?: number;
  imc?: number;
  experiencia: "iniciante" | "intermediario" | "avancado";
  dobrasCutaneas: {
    triceps: number;
    subescapular: number;
    axilarMedia: number;
    peitoral: number;
    suprailiaca: number;
    abdominal: number;
    coxa: number;
  };
  dataCadastro?: string;
}

export interface CargaExercicio {
  nomeExercicio: string;
  grupoMuscular: string;
  cargaIdeal: number;
  series: number;
  repeticoes: number;
}

export interface FichaTreino {
  aluno: Aluno;
  dataAvaliacao: string;
  exercicios: CargaExercicio[];
}

// Função para calcular o percentual de gordura usando a fórmula de Jackson e Pollock
export const calcularPercentualGordura = (
  dobrasCutaneas: Aluno["dobrasCutaneas"],
  genero: "masculino" | "feminino" = "masculino",
  idade: number
): number => {
  // Soma das 7 dobras
  const somaDobras =
    dobrasCutaneas.triceps +
    dobrasCutaneas.subescapular +
    dobrasCutaneas.axilarMedia +
    dobrasCutaneas.peitoral +
    dobrasCutaneas.suprailiaca +
    dobrasCutaneas.abdominal +
    dobrasCutaneas.coxa;

  // Cálculo da densidade corporal
  let densidadeCorporal;
  
  if (genero === "masculino") {
    densidadeCorporal = 1.112 - (0.00043499 * somaDobras) + 
      (0.00000055 * Math.pow(somaDobras, 2)) - (0.00028826 * idade);
  } else {
    densidadeCorporal = 1.097 - (0.00046971 * somaDobras) + 
      (0.00000056 * Math.pow(somaDobras, 2)) - (0.00012828 * idade);
  }
  
  // Cálculo do percentual de gordura usando a equação de Siri
  const percentualGordura = (495 / densidadeCorporal) - 450;
  
  return Number(percentualGordura.toFixed(2));
};

// Função para calcular o IMC
export const calcularIMC = (peso: number, altura: number): number => {
  const alturaMetros = altura / 100; // Convertendo cm para metros
  const imc = peso / Math.pow(alturaMetros, 2);
  return Number(imc.toFixed(2));
};

// Função para calcular a carga ideal para exercícios
export const calcularCargaIdeal = (
  peso: number,
  experiencia: Aluno["experiencia"],
  exercicio: string
): number => {
  // Fatores de multiplicação baseados na experiência
  const fatores = {
    iniciante: 0.4,
    intermediario: 0.6,
    avancado: 0.8,
  };
  
  // Ajustes específicos para diferentes exercícios
  const ajustesExercicio: Record<string, number> = {
    "Supino Reto": 1.0,
    "Agachamento": 1.2,
    "Levantamento Terra": 1.3,
    "Desenvolvimento": 0.6,
    "Rosca Direta": 0.3,
    "Tríceps Pulley": 0.35,
    "Puxada Alta": 0.7,
    "Remada Baixa": 0.75,
    "Leg Press": 2.0,
    "Cadeira Extensora": 0.5,
    "Cadeira Flexora": 0.45,
    "Panturrilha": 1.0,
    "Abdominal": 0.0, // Geralmente usa o peso do corpo
  };
  
  const fator = fatores[experiencia];
  const ajuste = ajustesExercicio[exercicio] || 0.5; // Valor padrão se o exercício não estiver listado
  
  const cargaIdeal = peso * fator * ajuste;
  return Math.round(cargaIdeal); // Arredonda para o número inteiro mais próximo
};

// Função para gerar ficha de treino com base nas características do aluno
export const gerarFichaTreino = (aluno: Aluno): FichaTreino => {
  const exerciciosPorNivel: Record<Aluno["experiencia"], CargaExercicio[]> = {
    iniciante: [
      { nomeExercicio: "Supino Reto", grupoMuscular: "Peito", cargaIdeal: 0, series: 3, repeticoes: 12 },
      { nomeExercicio: "Puxada Alta", grupoMuscular: "Costas", cargaIdeal: 0, series: 3, repeticoes: 12 },
      { nomeExercicio: "Leg Press", grupoMuscular: "Pernas", cargaIdeal: 0, series: 3, repeticoes: 15 },
      { nomeExercicio: "Desenvolvimento", grupoMuscular: "Ombros", cargaIdeal: 0, series: 3, repeticoes: 12 },
      { nomeExercicio: "Rosca Direta", grupoMuscular: "Bíceps", cargaIdeal: 0, series: 3, repeticoes: 12 },
      { nomeExercicio: "Tríceps Pulley", grupoMuscular: "Tríceps", cargaIdeal: 0, series: 3, repeticoes: 12 },
      { nomeExercicio: "Abdominal", grupoMuscular: "Abdômen", cargaIdeal: 0, series: 3, repeticoes: 15 },
    ],
    intermediario: [
      { nomeExercicio: "Supino Reto", grupoMuscular: "Peito", cargaIdeal: 0, series: 4, repeticoes: 10 },
      { nomeExercicio: "Supino Inclinado", grupoMuscular: "Peito", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Puxada Alta", grupoMuscular: "Costas", cargaIdeal: 0, series: 4, repeticoes: 10 },
      { nomeExercicio: "Remada Baixa", grupoMuscular: "Costas", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Agachamento", grupoMuscular: "Pernas", cargaIdeal: 0, series: 4, repeticoes: 10 },
      { nomeExercicio: "Leg Press", grupoMuscular: "Pernas", cargaIdeal: 0, series: 3, repeticoes: 12 },
      { nomeExercicio: "Desenvolvimento", grupoMuscular: "Ombros", cargaIdeal: 0, series: 4, repeticoes: 10 },
      { nomeExercicio: "Elevação Lateral", grupoMuscular: "Ombros", cargaIdeal: 0, series: 3, repeticoes: 12 },
      { nomeExercicio: "Rosca Direta", grupoMuscular: "Bíceps", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Rosca Alternada", grupoMuscular: "Bíceps", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Tríceps Pulley", grupoMuscular: "Tríceps", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Tríceps Francês", grupoMuscular: "Tríceps", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Abdominal", grupoMuscular: "Abdômen", cargaIdeal: 0, series: 4, repeticoes: 15 },
    ],
    avancado: [
      { nomeExercicio: "Supino Reto", grupoMuscular: "Peito", cargaIdeal: 0, series: 5, repeticoes: 8 },
      { nomeExercicio: "Supino Inclinado", grupoMuscular: "Peito", cargaIdeal: 0, series: 4, repeticoes: 8 },
      { nomeExercicio: "Crucifixo", grupoMuscular: "Peito", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Puxada Alta", grupoMuscular: "Costas", cargaIdeal: 0, series: 4, repeticoes: 8 },
      { nomeExercicio: "Remada Baixa", grupoMuscular: "Costas", cargaIdeal: 0, series: 4, repeticoes: 8 },
      { nomeExercicio: "Pullover", grupoMuscular: "Costas", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Agachamento", grupoMuscular: "Pernas", cargaIdeal: 0, series: 5, repeticoes: 8 },
      { nomeExercicio: "Leg Press", grupoMuscular: "Pernas", cargaIdeal: 0, series: 4, repeticoes: 10 },
      { nomeExercicio: "Cadeira Extensora", grupoMuscular: "Pernas", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Cadeira Flexora", grupoMuscular: "Pernas", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Desenvolvimento", grupoMuscular: "Ombros", cargaIdeal: 0, series: 4, repeticoes: 8 },
      { nomeExercicio: "Elevação Lateral", grupoMuscular: "Ombros", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Elevação Frontal", grupoMuscular: "Ombros", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Rosca Direta", grupoMuscular: "Bíceps", cargaIdeal: 0, series: 4, repeticoes: 8 },
      { nomeExercicio: "Rosca Alternada", grupoMuscular: "Bíceps", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Rosca Martelo", grupoMuscular: "Bíceps", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Tríceps Pulley", grupoMuscular: "Tríceps", cargaIdeal: 0, series: 4, repeticoes: 8 },
      { nomeExercicio: "Tríceps Francês", grupoMuscular: "Tríceps", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Tríceps Testa", grupoMuscular: "Tríceps", cargaIdeal: 0, series: 3, repeticoes: 10 },
      { nomeExercicio: "Abdominal", grupoMuscular: "Abdômen", cargaIdeal: 0, series: 4, repeticoes: 15 },
      { nomeExercicio: "Abdominal Infra", grupoMuscular: "Abdômen", cargaIdeal: 0, series: 4, repeticoes: 15 },
    ],
  };
  
  // Seleciona exercícios com base no nível do aluno
  let exercicios = [...exerciciosPorNivel[aluno.experiencia]];
  
  // Calcula a carga ideal para cada exercício
  exercicios = exercicios.map((exercicio) => ({
    ...exercicio,
    cargaIdeal: calcularCargaIdeal(aluno.peso, aluno.experiencia, exercicio.nomeExercicio),
  }));
  
  return {
    aluno,
    dataAvaliacao: new Date().toISOString().split("T")[0],
    exercicios,
  };
};

// Serviço para listar todos os alunos
export const listarAlunos = async (): Promise<Aluno[]> => {
  try {
    const response = await axios.get(`${API_URL}/alunos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    throw error;
  }
};

// Serviço para buscar um aluno por ID
export const buscarAlunoPorId = async (id: string): Promise<Aluno> => {
  try {
    const response = await axios.get(`${API_URL}/alunos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar aluno com ID ${id}:`, error);
    throw error;
  }
};

// Serviço para cadastrar um novo aluno
export const cadastrarAluno = async (aluno: Omit<Aluno, "id" | "percentualGordura" | "imc">): Promise<Aluno> => {
  try {
    // Calcular percentual de gordura e IMC antes de enviar
    const percentualGordura = calcularPercentualGordura(aluno.dobrasCutaneas, "masculino", aluno.idade);
    const imc = calcularIMC(aluno.peso, aluno.altura);
    
    const alunoCompleto = {
      ...aluno,
      percentualGordura,
      imc,
      dataCadastro: new Date().toISOString(),
    };
    
    const response = await axios.post(`${API_URL}/alunos`, alunoCompleto);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    throw error;
  }
};

// Serviço para atualizar um aluno existente
export const atualizarAluno = async (id: string, aluno: Partial<Aluno>): Promise<Aluno> => {
  try {
    const response = await axios.put(`${API_URL}/alunos/${id}`, aluno);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar aluno com ID ${id}:`, error);
    throw error;
  }
};

// Serviço para excluir um aluno
export const excluirAluno = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/alunos/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir aluno com ID ${id}:`, error);
    throw error;
  }
};
