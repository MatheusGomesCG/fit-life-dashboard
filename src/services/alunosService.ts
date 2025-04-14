import axios from "axios";

const API_URL = "https://api.example.com"; // Substitua pela URL real da sua API

export interface FotoAluno {
  id?: string;
  url: string;
  data: string; // ISO date string
  descricao?: string;
}

export interface Aluno {
  id?: string;
  nome: string;
  email?: string;
  telefone?: string;
  idade: number;
  dataNascimento?: string | null;
  peso: number;
  altura: number;
  percentualGordura?: number;
  imc?: number;
  genero: "masculino" | "feminino";
  experiencia: "iniciante" | "intermediario" | "avancado";
  endereco?: string;
  objetivo?: string;
  observacoes?: string;
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
  valorMensalidade?: number;
  dataVencimento?: string;
  fotos?: FotoAluno[]; // Array de fotos do aluno
}

export interface CargaExercicio {
  nomeExercicio: string;
  grupoMuscular: string;
  cargaIdeal: number;
  series: number;
  repeticoes: number;
  estrategia?: string;
  videoUrl?: string;
  diaTreino?: string;
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
    "Abdominal": 0.0,
  };
  
  const fator = fatores[experiencia];
  const ajuste = ajustesExercicio[exercicio] || 0.5;
  
  const cargaIdeal = peso * fator * ajuste;
  return Math.round(cargaIdeal);
};

// Function to create or update a training plan for a student
export const criarOuAtualizarFichaTreino = async (
  alunoId: string,
  exercicios: CargaExercicio[]
): Promise<FichaTreino> => {
  try {
    // Get the student data
    const aluno = await buscarAlunoPorId(alunoId);
    
    const fichaTreino: FichaTreino = {
      aluno,
      dataAvaliacao: new Date().toISOString().split("T")[0],
      exercicios: exercicios.map(exercicio => ({
        ...exercicio,
        cargaIdeal: exercicio.cargaIdeal || calcularCargaIdeal(aluno.peso, aluno.experiencia, exercicio.nomeExercicio)
      }))
    };
    
    // In a real implementation, save this to your backend
    // For now, just return the generated plan
    return fichaTreino;
  } catch (error) {
    console.error(`Erro ao criar ficha de treino para aluno ${alunoId}:`, error);
    throw error;
  }
};

// Função para gerar ficha de treino com base nas características do aluno
export const gerarFichaTreino = (aluno: Aluno): FichaTreino => {
  // Lista de exercícios baseada no nível de experiência do aluno
  const exercicios: CargaExercicio[] = [];

  // Peso base para cálculos
  const pesoBase = aluno.peso;
  
  // Gere exercícios baseados no nível do aluno
  if (aluno.experiencia === "iniciante") {
    exercicios.push(
      { 
        nomeExercicio: "Supino Reto", 
        grupoMuscular: "Peito", 
        cargaIdeal: Math.round(pesoBase * 0.3), 
        series: 3, 
        repeticoes: 12,
        diaTreino: "Segunda-feira",
        videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4"
      },
      { 
        nomeExercicio: "Leg Press", 
        grupoMuscular: "Pernas", 
        cargaIdeal: Math.round(pesoBase * 0.8), 
        series: 3, 
        repeticoes: 12,
        diaTreino: "Terça-feira"
      },
      { 
        nomeExercicio: "Puxada Frontal", 
        grupoMuscular: "Costas", 
        cargaIdeal: Math.round(pesoBase * 0.4), 
        series: 3, 
        repeticoes: 12,
        diaTreino: "Quarta-feira",
        videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc"
      },
      { 
        nomeExercicio: "Desenvolvimento com Halteres", 
        grupoMuscular: "Ombros", 
        cargaIdeal: Math.round(pesoBase * 0.15), 
        series: 3, 
        repeticoes: 12,
        diaTreino: "Quinta-feira"
      },
      { 
        nomeExercicio: "Rosca Direta", 
        grupoMuscular: "Bíceps", 
        cargaIdeal: Math.round(pesoBase * 0.15), 
        series: 3, 
        repeticoes: 12,
        diaTreino: "Sexta-feira",
        videoUrl: "https://www.youtube.com/watch?v=kwG2ipFRgfo"
      },
      { 
        nomeExercicio: "Tríceps Corda", 
        grupoMuscular: "Tríceps", 
        cargaIdeal: Math.round(pesoBase * 0.15), 
        series: 3, 
        repeticoes: 12,
        diaTreino: "Sexta-feira"
      }
    );
  } else if (aluno.experiencia === "intermediario") {
    exercicios.push(
      { 
        nomeExercicio: "Supino Reto", 
        grupoMuscular: "Peito", 
        cargaIdeal: Math.round(pesoBase * 0.5), 
        series: 4, 
        repeticoes: 10,
        diaTreino: "Segunda-feira",
        estrategia: "Drop-set na última série",
        videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4"
      },
      { 
        nomeExercicio: "Supino Inclinado", 
        grupoMuscular: "Peito", 
        cargaIdeal: Math.round(pesoBase * 0.4), 
        series: 3, 
        repeticoes: 10,
        diaTreino: "Segunda-feira"
      },
      { 
        nomeExercicio: "Agachamento Livre", 
        grupoMuscular: "Pernas", 
        cargaIdeal: Math.round(pesoBase * 0.8), 
        series: 4, 
        repeticoes: 8,
        diaTreino: "Terça-feira",
        estrategia: "Pausa de 2s no fundo",
        videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8"
      },
      { 
        nomeExercicio: "Leg Press", 
        grupoMuscular: "Pernas", 
        cargaIdeal: Math.round(pesoBase * 1.2), 
        series: 3, 
        repeticoes: 12,
        diaTreino: "Terça-feira"
      },
      { 
        nomeExercicio: "Barra Fixa", 
        grupoMuscular: "Costas", 
        cargaIdeal: 0, 
        series: 3, 
        repeticoes: 8,
        diaTreino: "Quarta-feira",
        estrategia: "Fazer com o peso do corpo"
      },
      { 
        nomeExercicio: "Remada Curvada", 
        grupoMuscular: "Costas", 
        cargaIdeal: Math.round(pesoBase * 0.4), 
        series: 4, 
        repeticoes: 10,
        diaTreino: "Quarta-feira",
        videoUrl: "https://www.youtube.com/watch?v=FWJR5Ve8l2A"
      }
    );
  } else { // avançado
    exercicios.push(
      { 
        nomeExercicio: "Supino Reto", 
        grupoMuscular: "Peito", 
        cargaIdeal: Math.round(pesoBase * 0.8), 
        series: 5, 
        repeticoes: 5,
        diaTreino: "Segunda e Quinta-feira",
        estrategia: "Método 5x5",
        videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4" 
      },
      { 
        nomeExercicio: "Fly com Cabos", 
        grupoMuscular: "Peito", 
        cargaIdeal: Math.round(pesoBase * 0.2), 
        series: 3, 
        repeticoes: 12,
        diaTreino: "Segunda e Quinta-feira",
        estrategia: "Contração máxima no pico"
      },
      { 
        nomeExercicio: "Agachamento Livre", 
        grupoMuscular: "Pernas", 
        cargaIdeal: Math.round(pesoBase * 1.2), 
        series: 5, 
        repeticoes: 5,
        diaTreino: "Terça e Sexta-feira",
        estrategia: "Método 5x5",
        videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8" 
      },
      { 
        nomeExercicio: "Levantamento Terra", 
        grupoMuscular: "Lombar/Pernas", 
        cargaIdeal: Math.round(pesoBase * 1.5), 
        series: 3, 
        repeticoes: 5,
        diaTreino: "Terça-feira",
        estrategia: "Aumento progressivo de carga",
        videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q" 
      },
      { 
        nomeExercicio: "Barra Fixa Supinada", 
        grupoMuscular: "Costas/Bíceps", 
        cargaIdeal: Math.round(pesoBase * 0.1), // peso adicional
        series: 4, 
        repeticoes: 8,
        diaTreino: "Quarta-feira",
        estrategia: "Adicionar peso se possível"
      },
      { 
        nomeExercicio: "Remada Baixa Triângulo", 
        grupoMuscular: "Costas", 
        cargaIdeal: Math.round(pesoBase * 0.7), 
        series: 4, 
        repeticoes: 8,
        diaTreino: "Quarta e Sábado-feira",
        estrategia: "Contração isométrica por 1s no pico"
      }
    );
  }
  
  return {
    aluno,
    dataAvaliacao: new Date().toISOString(),
    exercicios
  };
};

// Function to add student photo
export const adicionarFotoAluno = async (
  alunoId: string,
  fotoData: { url: string, descricao?: string }
): Promise<FotoAluno> => {
  try {
    const novaFoto: FotoAluno = {
      url: fotoData.url,
      data: new Date().toISOString().split('T')[0],
      descricao: fotoData.descricao
    };
    
    // In a real API, you would send this to your backend
    // const response = await axios.post(`${API_URL}/alunos/${alunoId}/fotos`, novaFoto);
    // return response.data;
    
    // For development, we'll update our mock data
    const aluno = await buscarAlunoPorId(alunoId);
    if (!aluno.fotos) {
      aluno.fotos = [];
    }
    
    const fotoComId: FotoAluno = {
      ...novaFoto,
      id: `foto_${Date.now()}`
    };
    
    aluno.fotos.push(fotoComId);
    
    // Update the aluno with the new photo
    await atualizarAluno(alunoId, { fotos: aluno.fotos });
    
    return fotoComId;
  } catch (error) {
    console.error(`Erro ao adicionar foto para o aluno ${alunoId}:`, error);
    throw error;
  }
};

// Function to remove student photo
export const removerFotoAluno = async (alunoId: string, fotoId: string): Promise<void> => {
  try {
    // In a real API, you would send a delete request
    // await axios.delete(`${API_URL}/alunos/${alunoId}/fotos/${fotoId}`);
    
    // For development, we'll update our mock data
    const aluno = await buscarAlunoPorId(alunoId);
    if (aluno.fotos) {
      aluno.fotos = aluno.fotos.filter(foto => foto.id !== fotoId);
      await atualizarAluno(alunoId, { fotos: aluno.fotos });
    }
  } catch (error) {
    console.error(`Erro ao remover foto ${fotoId} do aluno ${alunoId}:`, error);
    throw error;
  }
};

// Mock data for testing
const mockAlunos: Aluno[] = [
  {
    id: "aluno_01",
    nome: "João Silva",
    email: "joao.silva@example.com",
    telefone: "123-456-7890",
    idade: 25,
    dataNascimento: "1997-01-01",
    peso: 75.5,
    altura: 178,
    percentualGordura: 15.4,
    imc: 23.8,
    genero: "masculino",
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
    dataCadastro: "2025-01-15",
    valorMensalidade: 150.00,
    dataVencimento: "2025-05-15",
    fotos: [
      {
        id: "foto_1",
        url: "https://placehold.co/400?text=Foto+1",
        data: "2025-01-15",
        descricao: "Foto frontal"
      },
      {
        id: "foto_2",
        url: "https://placehold.co/400?text=Foto+2",
        data: "2025-01-15",
        descricao: "Foto lateral"
      }
    ]
  },
  {
    id: "aluno_02",
    nome: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    telefone: "987-654-3210",
    idade: 30,
    dataNascimento: "1995-02-01",
    peso: 62.0,
    altura: 165,
    percentualGordura: 22.7,
    imc: 22.8,
    genero: "feminino",
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
    dataCadastro: "2025-02-03",
    valorMensalidade: 120.00,
    dataVencimento: "2025-05-03"
  },
  {
    id: "aluno_03",
    nome: "Pedro Santos",
    email: "pedro.santos@example.com",
    telefone: "555-555-5555",
    idade: 22,
    dataNascimento: "1999-02-15",
    peso: 82.3,
    altura: 182,
    percentualGordura: 12.8,
    imc: 24.9,
    genero: "masculino",
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
    dataCadastro: "2025-02-20",
    valorMensalidade: 180.00,
    dataVencimento: "2025-05-20"
  },
  {
    id: "aluno_04",
    nome: "Ana Costa",
    email: "ana.costa@example.com",
    telefone: "111-111-1111",
    idade: 28,
    dataNascimento: "1993-03-01",
    peso: 58.5,
    altura: 162,
    percentualGordura: 24.3,
    imc: 22.3,
    genero: "feminino",
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
    dataCadastro: "2025-03-05",
    valorMensalidade: 110.00,
    dataVencimento: "2025-05-05"
  },
  {
    id: "aluno_05",
    nome: "Lucas Ferreira",
    email: "lucas.ferreira@example.com",
    telefone: "222-222-2222",
    idade: 35,
    dataNascimento: "1990-03-15",
    peso: 88.0,
    altura: 185,
    percentualGordura: 18.2,
    imc: 25.7,
    genero: "masculino",
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
    dataCadastro: "2025-03-12",
    valorMensalidade: 170.00,
    dataVencimento: "2025-05-12"
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

// Add this function to check if an aluno has a ficha de treino
export const buscarFichaTreinoAluno = async (alunoId: string) => {
  try {
    // In a real API this would make a request to check if the student has a training sheet
    // For now, we'll simulate with mock data
    const mockFichas: Record<string, boolean> = {
      "1": true,
      "2": true,
      "3": false,
      "4": true,
      "5": false,
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockFichas[alunoId] === undefined) {
      // For any IDs not in our mock, randomly decide (30% chance of having a sheet)
      return Math.random() < 0.3;
    }
    
    return mockFichas[alunoId];
  } catch (error) {
    console.error(`Erro ao buscar ficha de treino para o aluno ${alunoId}:`, error);
    return false;
  }
};
