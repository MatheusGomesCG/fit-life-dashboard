import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Calendar, Clock, User, FileText } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  criarAgendamento,
  listarAgendamentos,
  Agendamento
} from "@/services/agendamentosService";
import { listarAlunos, Aluno } from "@/services/alunosService";

const NovoAgendamento: React.FC = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    alunoId: "",
    tipo: "avaliacao",
    data: new Date(),
    hora: "09:00",
    observacoes: ""
  });

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const data = await listarAlunos();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Não foi possível carregar a lista de alunos.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        data: date
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.alunoId) {
      toast.error("Por favor, selecione um aluno.");
      return;
    }

    try {
      setLoading(true);
      
      const dataFormatada = formData.data.toISOString().split("T")[0];
      
      const alunoSelecionado = alunos.find(a => a.id === formData.alunoId);
      
      if (!alunoSelecionado) {
        toast.error("Aluno selecionado não encontrado.");
        return;
      }
      
      const novoAgendamento: Omit<Agendamento, "id"> = {
        alunoId: formData.alunoId,
        alunoNome: alunoSelecionado.nome,
        tipo: formData.tipo as "avaliacao" | "consulta" | "outro",
        data: dataFormatada,
        horario: formData.hora,
        hora: formData.hora,
        status: "agendado",
        observacoes: formData.observacoes
      };
      
      await criarAgendamento(novoAgendamento);
      toast.success("Agendamento criado com sucesso!");
      navigate("/agendamentos");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Falha ao criar agendamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Agendamento</h1>
          <p className="text-gray-600">Agende uma nova avaliação ou consulta</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="alunoId">
                Aluno
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  id="alunoId"
                  name="alunoId"
                  value={formData.alunoId}
                  onChange={(e) => setFormData(prev => ({ ...prev, alunoId: e.target.value }))}
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-fitness-primary"
                  required
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="tipo">
                Tipo de Agendamento
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-fitness-primary"
              >
                <option value="avaliacao">Avaliação Física</option>
                <option value="consulta">Consulta</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Data
              </label>
              <DatePicker
                selected={formData.data}
                onSelect={handleDateChange}
                disabled={(date) => date < new Date()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="hora">
                Hora
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  id="hora"
                  name="hora"
                  value={formData.hora}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-fitness-primary"
                >
                  {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
                    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"].map(hora => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="observacoes">
              Observações
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Detalhes adicionais sobre o agendamento..."
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-fitness-primary min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/agendamentos")}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Agendando..." : "Criar Agendamento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoAgendamento;
