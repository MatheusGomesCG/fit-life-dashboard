import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { buscarAlunoPorId, buscarFichaTreinoAluno, criarFichaTreino, Aluno } from "@/services/alunosService";
import { listarExerciciosCadastrados, ExercicioCadastrado } from "@/services/exerciciosCadastradosService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ExercicioTreino {
  id?: string;
  nomeExercicio: string;
  grupoMuscular: string;
  series: number;
  repeticoes: number;
  cargaIdeal: number;
  diaTreino: string;
  equipamento?: string;
  estrategia?: string;
  instrucoes?: string;
  exercicioCadastradoId?: string;
}

const CadastrarTreino: React.FC = () => {
  const { alunoId } = useParams<{ alunoId: string }>();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [exercicios, setExercicios] = useState<ExercicioTreino[]>([]);
  const [exerciciosCadastrados, setExerciciosCadastrados] = useState<ExercicioCadastrado[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const diasTreino = ['A', 'B', 'C', 'D', 'E', 'F'];
  const gruposMusculares = [
    'Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Pernas', 'Glúteos', 
    'Abdome', 'Panturrilha', 'Antebraço', 'Cardio'
  ];

  useEffect(() => {
    carregarDados();
  }, [alunoId]);

  const carregarDados = async () => {
    if (!alunoId) return;
    
    try {
      setLoading(true);
      const [alunoData, exerciciosData] = await Promise.all([
        buscarAlunoPorId(alunoId),
        listarExerciciosCadastrados()
      ]);
      
      setAluno(alunoData);
      setExerciciosCadastrados(exerciciosData);

      // Tentar carregar ficha existente
      try {
        const fichaExistente = await buscarFichaTreinoAluno(alunoId);
        if (fichaExistente && fichaExistente.exercicios.length > 0) {
          setExercicios(fichaExistente.exercicios.map(ex => ({
            id: ex.id,
            nomeExercicio: ex.nomeExercicio,
            grupoMuscular: ex.grupoMuscular,
            series: ex.series,
            repeticoes: ex.repeticoes,
            cargaIdeal: ex.cargaIdeal,
            diaTreino: ex.diaTreino,
            equipamento: ex.equipamento,
            estrategia: ex.estrategia,
            instrucoes: ex.instrucoes,
            exercicioCadastradoId: ex.exercicioCadastradoId
          })));
        }
      } catch (error) {
        // Ficha não existe ainda, criar nova
        console.log("Criando nova ficha de treino");
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados do aluno.");
      navigate("/gerenciar-ficha-treino");
    } finally {
      setLoading(false);
    }
  };

  const adicionarExercicio = () => {
    const novoExercicio: ExercicioTreino = {
      nomeExercicio: '',
      grupoMuscular: '',
      series: 3,
      repeticoes: 12,
      cargaIdeal: 0,
      diaTreino: 'A',
      equipamento: '',
      estrategia: '',
      instrucoes: ''
    };
    setExercicios([...exercicios, novoExercicio]);
  };

  const removerExercicio = (index: number) => {
    setExercicios(exercicios.filter((_, i) => i !== index));
  };

  const atualizarExercicio = (index: number, campo: string, valor: any) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index] = { ...novosExercicios[index], [campo]: valor };
    setExercicios(novosExercicios);
  };

  const selecionarExercicioCadastrado = (index: number, exercicioId: string) => {
    const exercicio = exerciciosCadastrados.find(ex => ex.id === exercicioId);
    if (exercicio) {
      atualizarExercicio(index, 'nomeExercicio', exercicio.nome);
      atualizarExercicio(index, 'grupoMuscular', exercicio.grupo_muscular);
      atualizarExercicio(index, 'equipamento', exercicio.equipamento || '');
      atualizarExercicio(index, 'instrucoes', exercicio.instrucoes || '');
      atualizarExercicio(index, 'exercicioCadastradoId', exercicio.id);
    }
  };

  const salvarTreino = async () => {
    if (!alunoId || exercicios.length === 0) {
      toast.error("Adicione pelo menos um exercício antes de salvar.");
      return;
    }

    // Validar exercícios
    for (let i = 0; i < exercicios.length; i++) {
      const ex = exercicios[i];
      if (!ex.nomeExercicio || !ex.grupoMuscular || !ex.diaTreino) {
        toast.error(`Exercício ${i + 1}: Preencha todos os campos obrigatórios.`);
        return;
      }
    }

    setSaving(true);
    try {
      await criarFichaTreino(alunoId, exercicios);
      toast.success("Ficha de treino salva com sucesso!");
      navigate(`/ficha-treino/${alunoId}`);
    } catch (error) {
      console.error("Erro ao salvar treino:", error);
      toast.error("Erro ao salvar ficha de treino.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Aluno não encontrado.</p>
        <Button onClick={() => navigate("/gerenciar-ficha-treino")} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/gerenciar-ficha-treino")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {exercicios.length > 0 && exercicios.some(ex => ex.id) ? 'Editar' : 'Cadastrar'} Treino
            </h1>
            <p className="text-gray-600 mt-1">
              {aluno.nome} - {aluno.email}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={adicionarExercicio} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Exercício
          </Button>
          <Button onClick={salvarTreino} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Treino"}
          </Button>
        </div>
      </div>

      {/* Informações do Aluno */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Idade</span>
              <p className="font-medium">{aluno.idade} anos</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Peso</span>
              <p className="font-medium">{aluno.peso} kg</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Altura</span>
              <p className="font-medium">{aluno.altura} cm</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Experiência</span>
              <p className="font-medium capitalize">{aluno.experiencia}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Exercícios */}
      {exercicios.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhum exercício adicionado ainda.</p>
            <Button onClick={adicionarExercicio}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Exercício
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {exercicios.map((exercicio, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Exercício {index + 1}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removerExercicio(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`exercicio-${index}`}>Exercício Cadastrado</Label>
                    <Select onValueChange={(value) => selecionarExercicioCadastrado(index, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar exercício cadastrado (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciciosCadastrados.map((ex) => (
                          <SelectItem key={ex.id} value={ex.id}>
                            {ex.nome} - {ex.grupo_muscular}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`dia-${index}`}>Dia do Treino *</Label>
                    <Select
                      value={exercicio.diaTreino}
                      onValueChange={(value) => atualizarExercicio(index, 'diaTreino', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {diasTreino.map((dia) => (
                          <SelectItem key={dia} value={dia}>Treino {dia}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`nome-${index}`}>Nome do Exercício *</Label>
                    <Input
                      id={`nome-${index}`}
                      value={exercicio.nomeExercicio}
                      onChange={(e) => atualizarExercicio(index, 'nomeExercicio', e.target.value)}
                      placeholder="Ex: Supino reto"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`grupo-${index}`}>Grupo Muscular *</Label>
                    <Select
                      value={exercicio.grupoMuscular}
                      onValueChange={(value) => atualizarExercicio(index, 'grupoMuscular', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar grupo muscular" />
                      </SelectTrigger>
                      <SelectContent>
                        {gruposMusculares.map((grupo) => (
                          <SelectItem key={grupo} value={grupo}>{grupo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`series-${index}`}>Séries</Label>
                    <Input
                      id={`series-${index}`}
                      type="number"
                      value={exercicio.series}
                      onChange={(e) => atualizarExercicio(index, 'series', parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`repeticoes-${index}`}>Repetições</Label>
                    <Input
                      id={`repeticoes-${index}`}
                      type="number"
                      value={exercicio.repeticoes}
                      onChange={(e) => atualizarExercicio(index, 'repeticoes', parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`carga-${index}`}>Carga Ideal (kg)</Label>
                    <Input
                      id={`carga-${index}`}
                      type="number"
                      value={exercicio.cargaIdeal}
                      onChange={(e) => atualizarExercicio(index, 'cargaIdeal', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`equipamento-${index}`}>Equipamento</Label>
                    <Input
                      id={`equipamento-${index}`}
                      value={exercicio.equipamento}
                      onChange={(e) => atualizarExercicio(index, 'equipamento', e.target.value)}
                      placeholder="Ex: Barra, Halteres"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`estrategia-${index}`}>Estratégia</Label>
                    <Input
                      id={`estrategia-${index}`}
                      value={exercicio.estrategia}
                      onChange={(e) => atualizarExercicio(index, 'estrategia', e.target.value)}
                      placeholder="Ex: Drop set, Rest-pause"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`instrucoes-${index}`}>Instruções</Label>
                  <Textarea
                    id={`instrucoes-${index}`}
                    value={exercicio.instrucoes}
                    onChange={(e) => atualizarExercicio(index, 'instrucoes', e.target.value)}
                    placeholder="Instruções específicas para execução do exercício"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CadastrarTreino;
