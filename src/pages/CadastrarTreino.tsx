
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, PlusCircle, Trash2, Youtube } from "lucide-react";
import {
  buscarAlunoPorId,
  criarOuAtualizarFichaTreino,
  CargaExercicio,
  Aluno
} from "@/services/alunosService";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
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
  "Sábado-feira",
  "Domingo-feira",
  "Segunda e Quinta-feira",
  "Terça e Sexta-feira",
  "Quarta e Sábado-feira"
];

const CadastrarTreino: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exercicios, setExercicios] = useState<ExercicioForm[]>([]);

  useEffect(() => {
    const fetchAluno = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const alunoData = await buscarAlunoPorId(id);
        setAluno(alunoData);
        
        // Initialize with one empty exercise
        setExercicios([{
          nomeExercicio: "",
          grupoMuscular: "",
          cargaIdeal: "0",
          series: 3,
          repeticoes: 12,
          estrategia: "",
          videoUrl: "",
          diaTreino: ""
        }]);
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
        toast.error("Erro ao buscar dados do aluno.");
        navigate("/gerenciar-alunos");
      } finally {
        setLoading(false);
      }
    };

    fetchAluno();
  }, [id, navigate]);

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
    let isValid = true;
    
    for (let i = 0; i < exercicios.length; i++) {
      const exercicio = exercicios[i];
      if (!exercicio.nomeExercicio || !exercicio.grupoMuscular || !exercicio.diaTreino) {
        toast.error(`Preencha o nome, grupo muscular e dia do treino do exercício ${i + 1}.`);
        isValid = false;
        break;
      }
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!id) {
      toast.error("ID do aluno não encontrado.");
      return;
    }
    
    try {
      setSaving(true);
      
      // Convert string values to numbers
      const exerciciosFormatted: CargaExercicio[] = exercicios.map(ex => ({
        ...ex,
        cargaIdeal: Number(ex.cargaIdeal)
      }));
      
      await criarOuAtualizarFichaTreino(id, exerciciosFormatted);
      
      toast.success("Ficha de treino cadastrada com sucesso!");
      navigate(`/ficha-treino/${id}`);
    } catch (error) {
      console.error("Erro ao cadastrar ficha de treino:", error);
      toast.error("Erro ao cadastrar ficha de treino. Tente novamente.");
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
        <button
          onClick={() => navigate("/gerenciar-alunos")}
          className="mt-4 text-fitness-primary hover:underline"
        >
          Voltar para lista de alunos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar Treino</h1>
          <p className="text-gray-600 mt-1">
            {aluno.nome} - {aluno.experiencia === "iniciante" ? "Iniciante" : aluno.experiencia === "intermediario" ? "Intermediário" : "Avançado"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Informações do Aluno</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="font-medium">{aluno.nome}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Idade</p>
            <p className="font-medium">{aluno.idade} anos</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Peso</p>
            <p className="font-medium">{aluno.peso} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Altura</p>
            <p className="font-medium">{aluno.altura} cm</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">IMC</p>
            <p className="font-medium">{aluno.imc?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">% Gordura</p>
            <p className="font-medium">{aluno.percentualGordura?.toFixed(2)}%</p>
          </div>
        </div>

        <hr className="my-6" />

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Exercícios</h2>
            <button
              type="button"
              onClick={addExercicio}
              className="text-fitness-primary hover:text-fitness-primary/80 flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Adicionar exercício
            </button>
          </div>

          {exercicios.map((exercicio, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">Exercício {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeExercicio(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <FormInput
                  id={`exercicio-${index}-nome`}
                  label="Nome do Exercício"
                  value={exercicio.nomeExercicio}
                  onChange={(e) => handleExercicioChange(index, "nomeExercicio", e.target.value)}
                  required
                />
                
                <FormSelect
                  id={`exercicio-${index}-grupo`}
                  label="Grupo Muscular"
                  value={exercicio.grupoMuscular}
                  onChange={(e) => handleExercicioChange(index, "grupoMuscular", e.target.value)}
                  options={gruposMusculares.map(grupo => ({ value: grupo, label: grupo }))}
                  required
                />
                
                <FormSelect
                  id={`exercicio-${index}-dia`}
                  label="Dia do Treino"
                  value={exercicio.diaTreino || ""}
                  onChange={(e) => handleExercicioChange(index, "diaTreino", e.target.value)}
                  options={diasSemana.map(dia => ({ value: dia, label: dia }))}
                  required
                />
                
                <FormInput
                  id={`exercicio-${index}-carga`}
                  label="Carga (kg)"
                  type="number"
                  value={exercicio.cargaIdeal}
                  onChange={(e) => handleExercicioChange(index, "cargaIdeal", e.target.value)}
                  required
                />
                
                <FormInput
                  id={`exercicio-${index}-series`}
                  label="Séries"
                  type="number"
                  value={exercicio.series}
                  onChange={(e) => handleExercicioChange(index, "series", Number(e.target.value))}
                  required
                />
                
                <FormInput
                  id={`exercicio-${index}-repeticoes`}
                  label="Repetições"
                  type="number"
                  value={exercicio.repeticoes}
                  onChange={(e) => handleExercicioChange(index, "repeticoes", Number(e.target.value))}
                  required
                />
                
                <FormInput
                  id={`exercicio-${index}-estrategia`}
                  label="Estratégia/Técnica"
                  value={exercicio.estrategia || ""}
                  onChange={(e) => handleExercicioChange(index, "estrategia", e.target.value)}
                />
                
                <div className="md:col-span-2">
                  <FormInput
                    id={`exercicio-${index}-video`}
                    label="Link do Vídeo (YouTube)"
                    value={exercicio.videoUrl || ""}
                    onChange={(e) => handleExercicioChange(index, "videoUrl", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors flex items-center"
              disabled={saving}
            >
              {saving ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Salvar Ficha de Treino
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarTreino;
