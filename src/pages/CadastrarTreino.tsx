import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { buscarAlunoPorId, criarOuAtualizarFichaTreino, CargaExercicio, Aluno } from "@/services/alunosService";
import { listarExerciciosCadastrados } from "@/services/exerciciosCadastradosService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const CadastrarTreino: React.FC = () => {
  const { alunoId } = useParams<{ alunoId: string }>();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [exercicios, setExercicios] = useState<CargaExercicio[]>([]);
  const [exerciciosCadastrados, setExerciciosCadastrados] = useState<any[]>([]);

  useEffect(() => {
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
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do aluno.");
        navigate("/gerenciar-ficha-treino");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [alunoId, navigate]);

  const handleNomeExercicioChange = (index: number, value: string) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].nomeExercicio = value;
    setExercicios(novosExercicios);
  };

  const handleGrupoMuscularChange = (index: number, value: string) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].grupoMuscular = value;
    setExercicios(novosExercicios);
  };

  const handleCargaIdealChange = (index: number, value: number) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].cargaIdeal = value;
    setExercicios(novosExercicios);
  };

  const handleSeriesChange = (index: number, value: number) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].series = value;
    setExercicios(novosExercicios);
  };

  const handleRepeticoesChange = (index: number, value: number) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].repeticoes = value;
    setExercicios(novosExercicios);
  };

  const handleEstrategiaChange = (index: number, value: string) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].estrategia = value;
    setExercicios(novosExercicios);
  };

  const handleVideoUrlChange = (index: number, value: string) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].videoUrl = value;
    setExercicios(novosExercicios);
  };

  const handleDiaTreinoChange = (index: number, value: string) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].diaTreino = value;
    setExercicios(novosExercicios);
  };

  const handleExercicioCadastradoIdChange = (index: number, value: string) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].exercicioCadastradoId = value;
    setExercicios(novosExercicios);
  };

  const handleEquipamentoChange = (index: number, value: string) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].equipamento = value;
    setExercicios(novosExercicios);
  };

  const handleInstrucoesChange = (index: number, value: string) => {
    const novosExercicios = [...exercicios];
    novosExercicios[index].instrucoes = value;
    setExercicios(novosExercicios);
  };

  const adicionarExercicio = () => {
    const novoExercicio: CargaExercicio = {
      nomeExercicio: "",
      grupoMuscular: "",
      cargaIdeal: 0,
      series: 3,
      repeticoes: 12,
      estrategia: "",
      videoUrl: "",
      diaTreino: "A",
      exercicioCadastradoId: "",
      equipamento: "",
      instrucoes: ""
    };
    setExercicios([...exercicios, novoExercicio]);
  };

  const removerExercicio = (index: number) => {
    const novosExercicios = [...exercicios];
    novosExercicios.splice(index, 1);
    setExercicios(novosExercicios);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!alunoId) {
      toast.error("ID do aluno não encontrado.");
      return;
    }

    try {
      setSalvando(true);
      await criarOuAtualizarFichaTreino(alunoId, exercicios);
      toast.success("Ficha de treino salva com sucesso!");
      navigate("/gerenciar-ficha-treino");
    } catch (error) {
      console.error("Erro ao salvar ficha de treino:", error);
      toast.error("Erro ao salvar ficha de treino. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const calcularCargaIdeal = (exercicio: CargaExercicio) => {
    if (!aluno) return exercicio.cargaIdeal;
    
    const peso = aluno.peso || 70;
    const experiencia = aluno.experiencia || "iniciante";
    const percentualGordura = aluno.percentual_gordura || 20;
    
    let cargaBase = peso * 0.5;

    if (experiencia === "intermediario") {
      cargaBase *= 1.2;
    } else if (experiencia === "avancado") {
      cargaBase *= 1.5;
    }

    if (percentualGordura > 25) {
      cargaBase *= 0.8;
    }

    return Math.round(cargaBase);
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
            <h1 className="text-2xl font-bold text-gray-900">Cadastrar Ficha de Treino</h1>
            <p className="text-gray-600 mt-1">
              Aluno: {aluno.nome}
            </p>
          </div>
        </div>
        <Button onClick={adicionarExercicio}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Exercício
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {exercicios.map((exercicio, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Exercício {index + 1}</CardTitle>
              <CardDescription>
                Configure os detalhes do exercício
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`nomeExercicio-${index}`}>Nome do Exercício</Label>
                  <Input
                    id={`nomeExercicio-${index}`}
                    type="text"
                    value={exercicio.nomeExercicio}
                    onChange={(e) => handleNomeExercicioChange(index, e.target.value)}
                    placeholder="Ex: Supino Reto"
                  />
                </div>
                <div>
                  <Label htmlFor={`grupoMuscular-${index}`}>Grupo Muscular</Label>
                  <Input
                    id={`grupoMuscular-${index}`}
                    type="text"
                    value={exercicio.grupoMuscular}
                    onChange={(e) => handleGrupoMuscularChange(index, e.target.value)}
                    placeholder="Ex: Peito"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`cargaIdeal-${index}`}>Carga Ideal (kg)</Label>
                  <Input
                    id={`cargaIdeal-${index}`}
                    type="number"
                    value={exercicio.cargaIdeal}
                    onChange={(e) => handleCargaIdealChange(index, Number(e.target.value))}
                    placeholder="Ex: 50"
                  />
                </div>
                <div>
                  <Label htmlFor={`series-${index}`}>Séries</Label>
                  <Input
                    id={`series-${index}`}
                    type="number"
                    value={exercicio.series}
                    onChange={(e) => handleSeriesChange(index, Number(e.target.value))}
                    placeholder="Ex: 3"
                  />
                </div>
                <div>
                  <Label htmlFor={`repeticoes-${index}`}>Repetições</Label>
                  <Input
                    id={`repeticoes-${index}`}
                    type="number"
                    value={exercicio.repeticoes}
                    onChange={(e) => handleRepeticoesChange(index, Number(e.target.value))}
                    placeholder="Ex: 12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`estrategia-${index}`}>Estratégia</Label>
                  <Input
                    id={`estrategia-${index}`}
                    type="text"
                    value={exercicio.estrategia}
                    onChange={(e) => handleEstrategiaChange(index, e.target.value)}
                    placeholder="Ex: Drop-set"
                  />
                </div>
                <div>
                  <Label htmlFor={`videoUrl-${index}`}>Vídeo URL</Label>
                  <Input
                    id={`videoUrl-${index}`}
                    type="text"
                    value={exercicio.videoUrl}
                    onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                    placeholder="Ex: https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`diaTreino-${index}`}>Dia do Treino</Label>
                  <Select value={exercicio.diaTreino} onValueChange={(value) => handleDiaTreinoChange(index, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`exercicioCadastradoId-${index}`}>Exercício Cadastrado</Label>
                  <Select value={exercicio.exercicioCadastradoId} onValueChange={(value) => handleExercicioCadastradoIdChange(index, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o exercício" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciciosCadastrados.map((ex) => (
                        <SelectItem key={ex.id} value={ex.id}>
                          {ex.nome} ({ex.grupo_muscular})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`equipamento-${index}`}>Equipamento</Label>
                  <Input
                    id={`equipamento-${index}`}
                    type="text"
                    value={exercicio.equipamento}
                    onChange={(e) => handleEquipamentoChange(index, e.target.value)}
                    placeholder="Ex: Barra, Halteres"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`instrucoes-${index}`}>Instruções</Label>
                <Input
                  id={`instrucoes-${index}`}
                  type="text"
                  value={exercicio.instrucoes}
                  onChange={(e) => handleInstrucoesChange(index, e.target.value)}
                  placeholder="Ex: Manter a postura correta"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removerExercicio(index)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Exercício
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button type="submit" disabled={salvando}>
            {salvando ? (
              <>
                <LoadingSpinner size="small" />
                <span>Salvando...</span>
              </>
            ) : (
              "Salvar Ficha de Treino"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CadastrarTreino;
