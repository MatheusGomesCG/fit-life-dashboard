
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, PlusCircle, Trash2, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { listarAlunos, criarOuAtualizarFichaTreino, CargaExercicio, Aluno } from "@/services/alunosService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ExercicioForm extends Omit<CargaExercicio, 'cargaIdeal'> {
  cargaIdeal: string;
}

const gruposMusculares = [
  "Peito",
  "Costas", 
  "Pernas",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Abdômen",
  "Glúteos",
  "Antebraço",
  "Panturrilha"
];

const diasSemana = [
  "Segunda-feira",
  "Terça-feira", 
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo"
];

const NovoTreino: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exercicios, setExercicios] = useState<ExercicioForm[]>([{
    nomeExercicio: "",
    grupoMuscular: "",
    cargaIdeal: "0",
    series: 3,
    repeticoes: 12,
    estrategia: "",
    videoUrl: "",
    diaTreino: ""
  }]);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const alunosData = await listarAlunos();
        setAlunos(alunosData);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        toast.error("Erro ao carregar lista de alunos");
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  const handleExercicioChange = (index: number, field: keyof ExercicioForm, value: string | number) => {
    const updatedExercicios = [...exercicios];
    updatedExercicios[index] = {
      ...updatedExercicios[index],
      [field]: value
    };
    setExercicios(updatedExercicios);
  };

  const addExercicio = () => {
    setExercicios([
      ...exercicios,
      {
        nomeExercicio: "",
        grupoMuscular: "",
        cargaIdeal: "0",
        series: 3,
        repeticoes: 12,
        estrategia: "",
        videoUrl: "",
        diaTreino: ""
      }
    ]);
  };

  const removeExercicio = (index: number) => {
    if (exercicios.length === 1) {
      toast.error("É necessário pelo menos um exercício na ficha de treino.");
      return;
    }
    
    const updatedExercicios = exercicios.filter((_, i) => i !== index);
    setExercicios(updatedExercicios);
  };

  const validateForm = () => {
    if (!alunoSelecionado) {
      toast.error("Por favor, selecione um aluno para o treino.");
      return false;
    }

    for (let i = 0; i < exercicios.length; i++) {
      const exercicio = exercicios[i];
      if (!exercicio.nomeExercicio || !exercicio.grupoMuscular || !exercicio.diaTreino) {
        toast.error(`Preencha o nome, grupo muscular e dia do treino do exercício ${i + 1}.`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const exerciciosFormatted: CargaExercicio[] = exercicios.map(ex => ({
        ...ex,
        cargaIdeal: Number(ex.cargaIdeal)
      }));
      
      await criarOuAtualizarFichaTreino(alunoSelecionado, exerciciosFormatted);
      
      toast.success("Treino criado com sucesso!");
      navigate("/gerenciar-alunos");
    } catch (error) {
      console.error("Erro ao criar treino:", error);
      toast.error("Erro ao criar treino. Tente novamente.");
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

  const alunoInfo = alunos.find(aluno => aluno.id === alunoSelecionado);

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-0">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
            Criar Novo Treino
          </h1>
          <p className="text-sm text-gray-600 truncate">
            Crie um treino personalizado para seus alunos
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Seleção do Aluno */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Selecionar Aluno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aluno-select">Aluno *</Label>
              <Select value={alunoSelecionado} onValueChange={setAlunoSelecionado}>
                <SelectTrigger id="aluno-select">
                  <SelectValue placeholder="Selecione um aluno..." />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{aluno.nome}</span>
                        <span className="text-xs text-gray-500">{aluno.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {alunoInfo && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                <div>
                  <span className="text-gray-500 block">Idade</span>
                  <span className="font-medium">{alunoInfo.idade} anos</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Peso</span>
                  <span className="font-medium">{alunoInfo.peso} kg</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Altura</span>
                  <span className="font-medium">{alunoInfo.altura} cm</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Experiência</span>
                  <span className="font-medium capitalize">{alunoInfo.experiencia}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercícios */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-lg">Exercícios do Treino</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExercicio}
                className="flex items-center gap-2 self-start"
              >
                <PlusCircle className="h-4 w-4" />
                Adicionar Exercício
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercicios.map((exercicio, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 md:p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm md:text-base">
                    Exercício {index + 1}
                  </h3>
                  {exercicios.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercicio(index)}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`exercicio-${index}-nome`} className="text-sm">
                      Nome do Exercício *
                    </Label>
                    <Input
                      id={`exercicio-${index}-nome`}
                      value={exercicio.nomeExercicio}
                      onChange={(e) => handleExercicioChange(index, "nomeExercicio", e.target.value)}
                      placeholder="Ex: Supino reto"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`exercicio-${index}-grupo`} className="text-sm">
                      Grupo Muscular *
                    </Label>
                    <Select 
                      value={exercicio.grupoMuscular} 
                      onValueChange={(value) => handleExercicioChange(index, "grupoMuscular", value)}
                    >
                      <SelectTrigger id={`exercicio-${index}-grupo`}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {gruposMusculares.map(grupo => (
                          <SelectItem key={grupo} value={grupo}>{grupo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`exercicio-${index}-dia`} className="text-sm">
                      Dia do Treino *
                    </Label>
                    <Select
                      value={exercicio.diaTreino || ""}
                      onValueChange={(value) => handleExercicioChange(index, "diaTreino", value)}
                    >
                      <SelectTrigger id={`exercicio-${index}-dia`}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {diasSemana.map(dia => (
                          <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`exercicio-${index}-carga`} className="text-sm">
                      Carga (kg)
                    </Label>
                    <Input
                      id={`exercicio-${index}-carga`}
                      type="number"
                      value={exercicio.cargaIdeal}
                      onChange={(e) => handleExercicioChange(index, "cargaIdeal", e.target.value)}
                      placeholder="0"
                      className="text-sm"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`exercicio-${index}-series`} className="text-sm">
                      Séries
                    </Label>
                    <Input
                      id={`exercicio-${index}-series`}
                      type="number"
                      value={exercicio.series}
                      onChange={(e) => handleExercicioChange(index, "series", Number(e.target.value))}
                      className="text-sm"
                      min="1"
                      max="10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`exercicio-${index}-repeticoes`} className="text-sm">
                      Repetições
                    </Label>
                    <Input
                      id={`exercicio-${index}-repeticoes`}
                      type="number"
                      value={exercicio.repeticoes}
                      onChange={(e) => handleExercicioChange(index, "repeticoes", Number(e.target.value))}
                      className="text-sm"
                      min="1"
                      max="50"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`exercicio-${index}-estrategia`} className="text-sm">
                      Estratégia/Técnica
                    </Label>
                    <Input
                      id={`exercicio-${index}-estrategia`}
                      value={exercicio.estrategia || ""}
                      onChange={(e) => handleExercicioChange(index, "estrategia", e.target.value)}
                      placeholder="Ex: Pausa de 2 segundos na descida"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`exercicio-${index}-video`} className="text-sm">
                      Link do Vídeo (YouTube)
                    </Label>
                    <Input
                      id={`exercicio-${index}-video`}
                      value={exercicio.videoUrl || ""}
                      onChange={(e) => handleExercicioChange(index, "videoUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving || !alunoSelecionado}
            className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600"
          >
            {saving ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Salvando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Criar Treino
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NovoTreino;
