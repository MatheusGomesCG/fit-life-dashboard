
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExercicioCadastrado, listarExerciciosCadastrados } from "@/services/exerciciosCadastradosService";
import { useAuth } from "@/contexts/AuthContext";

interface FormularioExercicioProps {
  exercicio: ExercicioCadastrado | null;
  onSalvar: (exercicio: Omit<ExercicioCadastrado, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancelar: () => void;
}

const gruposMusculares = [
  "Peito", "Costas", "Pernas", "Ombros", "Bíceps", "Tríceps", 
  "Abdômen", "Glúteos", "Antebraço", "Panturrilha"
];

const FormularioExercicio: React.FC<FormularioExercicioProps> = ({
  exercicio,
  onSalvar,
  onCancelar,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    grupo_muscular: '',
    equipamento: '',
    instrucoes: '',
    video_url: '',
    exercicio_similar_id: '',
  });
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState<ExercicioCadastrado[]>([]);

  useEffect(() => {
    if (exercicio) {
      setFormData({
        nome: exercicio.nome,
        grupo_muscular: exercicio.grupo_muscular,
        equipamento: exercicio.equipamento || '',
        instrucoes: exercicio.instrucoes || '',
        video_url: exercicio.video_url || '',
        exercicio_similar_id: exercicio.exercicio_similar_id || '',
      });
    }

    // Carregar exercícios disponíveis para exercício similar
    const carregarExercicios = async () => {
      if (user?.id) {
        try {
          const exercicios = await listarExerciciosCadastrados(user.id);
          setExerciciosDisponiveis(exercicios.filter(ex => ex.id !== exercicio?.id));
        } catch (error) {
          console.error('Erro ao carregar exercícios:', error);
        }
      }
    };

    carregarExercicios();
  }, [exercicio, user?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvar({
      ...formData,
      professor_id: user!.id,
      exercicio_similar_id: formData.exercicio_similar_id || undefined,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome do Exercício *</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="grupo_muscular">Grupo Muscular *</Label>
        <Select value={formData.grupo_muscular} onValueChange={(value) => handleChange('grupo_muscular', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o grupo muscular" />
          </SelectTrigger>
          <SelectContent>
            {gruposMusculares.map(grupo => (
              <SelectItem key={grupo} value={grupo}>{grupo}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="equipamento">Equipamento</Label>
        <Input
          id="equipamento"
          value={formData.equipamento}
          onChange={(e) => handleChange('equipamento', e.target.value)}
          placeholder="Ex: Halteres, Barra, Máquina..."
        />
      </div>

      <div>
        <Label htmlFor="instrucoes">Instruções de Execução</Label>
        <Textarea
          id="instrucoes"
          value={formData.instrucoes}
          onChange={(e) => handleChange('instrucoes', e.target.value)}
          placeholder="Descreva como executar o exercício..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="video_url">URL do Vídeo (YouTube)</Label>
        <Input
          id="video_url"
          value={formData.video_url}
          onChange={(e) => handleChange('video_url', e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div>
        <Label htmlFor="exercicio_similar">Exercício Similar (Alternativa)</Label>
        <Select value={formData.exercicio_similar_id} onValueChange={(value) => handleChange('exercicio_similar_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um exercício similar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum</SelectItem>
            {exerciciosDisponiveis.map(ex => (
              <SelectItem key={ex.id} value={ex.id}>{ex.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit">
          {exercicio ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};

export default FormularioExercicio;
