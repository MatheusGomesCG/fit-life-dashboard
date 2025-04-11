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

// Mock data for testing
const mockAlunos: Aluno[] = [
  {
    id: "aluno_01",
    nome: "João Silva",
    idade: 25,
    peso: 75.5,
    altura: 178,
    percentualGordura: 15.4,
    imc: 23.8,
    experiencia: "intermediario",
    dobrasCutaneas: {
      triceps: 10,
      subescapular: 12,
      axilarMedia: 8,
      peitoral: 7,
      suprailiaca: 14,
      abdominal: 18,
      coxa: 15
    },
    dataCadastro: "2025-01-15"
  },
  {
    id: "aluno_02",
    nome: "Maria Oliveira",
    idade: 30,
    peso: 62.0,
    altura: 165,
    percentualGordura: 22.7,
    imc: 22.8,
    experiencia: "iniciante",
    dobrasCutaneas: {
      triceps: 18,
      subescapular: 15,
      axilarMedia: 12,
      peitoral: 10,
      suprailiaca: 20,
      abdominal: 22,
      coxa: 24
    },
    dataCadastro: "2025-02-03"
  },
  {
    id: "aluno_03",
    nome: "Pedro Santos",
    idade: 22,
    peso: 82.3,
    altura: 182,
    percentualGordura: 12.8,
    imc: 24.9,
    experiencia: "avancado",
    dobrasCutaneas: {
      triceps: 8,
      subescapular: 10,
      axilarMedia: 7,
      peitoral: 6,
      suprailiaca: 11,
      abdominal: 14,
      coxa: 12
    },
    dataCadastro: "2025-02-20"
  },
  {
    id: "aluno_04",
    nome: "Ana Costa",
    idade: 28,
    peso: 58.5,
    altura: 162,
    percentualGordura: 24.3,
    imc: 22.3,
    experiencia: "iniciante",
    dobrasCutaneas: {
      triceps: 19,
      subescapular: 16,
      axilarMedia: 13,
      peitoral: 11,
      suprailiaca: 21,
      abdominal: 23,
      coxa: 25
    },
    dataCadastro: "2025-03-05"
  },
  {
    id: "aluno_05",
    nome: "Lucas Ferreira",
    idade: 35,
    peso: 88.0,
    altura: 185,
    percentualGordura: 18.2,
    imc: 25.7,
    experiencia: "intermediario",
    dobrasCutaneas: {
      triceps: 12,
      subescapular: 14,
      axilarMedia: 10,
      peitoral: 9,
      suprailiaca: 16,
      abdominal: 20,
      coxa: 17
    },
    dataCadastro: "2025-03-12"
  }
];

// Serviço para listar todos os alunos
export const listarAlunos = async (): Promise<Aluno[]> => {
  try {
    // Mock implementation to return test data
    // In production, this would use axios.get(`${API_URL}/alunos`)
    return new Promise(resolve => {
      setTimeout(() => resolve(mockAlunos), 500); // Simulating network delay
    });
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    throw error;
  }
};

// Serviço para buscar um aluno por ID
export const buscarAlunoPorId = async (id: string): Promise<Aluno> => {
  try {
    // Mock implementation
    const aluno = mockAlunos.find(a => a.id === id);
    if (!aluno) throw new Error(`Aluno com ID ${id} não encontrado`);
    
    return new Promise(resolve => {
      setTimeout(() => resolve(aluno), 300);
    });
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
    
    const alunoCompleto: Aluno = {
      ...aluno,
      id: `aluno_${Date.now().toString(36)}`,
      percentualGordura,
      imc,
      dataCadastro: new Date().toISOString(),
    };
    
    // Mock implementation
    mockAlunos.push(alunoCompleto);
    
    return new Promise(resolve => {
      setTimeout(() => resolve(alunoCompleto), 500);
    });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    throw error;
  }
};

// Serviço para atualizar um aluno existente
export const atualizarAluno = async (id: string, aluno: Partial<Aluno>): Promise<Aluno> => {
  try {
    // Mock implementation
    const index = mockAlunos.findIndex(a => a.id === id);
    if (index === -1) throw new Error(`Aluno com ID ${id} não encontrado`);
    
    const alunoAtualizado = {
      ...mockAlunos[index],
      ...aluno
    };
    
    mockAlunos[index] = alunoAtualizado;
    
    return new Promise(resolve => {
      setTimeout(() => resolve(alunoAtualizado), 500);
    });
  } catch (error) {
    console.error(`Erro ao atualizar aluno com ID ${id}:`, error);
    throw error;
  }
};

// Serviço para excluir um aluno
export const excluirAluno = async (id: string): Promise<void> => {
  try {
    // Mock implementation
    const index = mockAlunos.findIndex(a => a.id === id);
    if (index === -1) throw new Error(`Aluno com ID ${id} não encontrado`);
    
    mockAlunos.splice(index, 1);
    
    return new Promise(resolve => {
      setTimeout(resolve, 300);
    });
  } catch (error) {
    console.error(`Erro ao excluir aluno com ID ${id}:`, error);
    throw error;
  }
};
