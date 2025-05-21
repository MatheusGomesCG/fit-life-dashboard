
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Plus, Trash, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  buscarAgendamentosPorAluno,
  criarAgendamento,
  excluirAgendamento,
  Agendamento as AgendamentoType,
  horariosPossiveis
} from "@/services/agendamentosService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Agendamento: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<AgendamentoType[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [horario, setHorario] = useState<string>("");
  const [tipo, setTipo] = useState<string>("avaliacao");
  const [descricao, setDescricao] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] = useState<string | null>(null);

  useEffect(() => {
    const carregarAgendamentos = async () => {
      try {
        setLoading(true);
        
        if (user?.id) {
          const agendamentosData = await buscarAgendamentosPorAluno(user.id);
          setAgendamentos(agendamentosData);
        }
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        toast.error("Erro ao carregar seus agendamentos.");
      } finally {
        setLoading(false);
      }
    };

    carregarAgendamentos();
  }, [user]);

  const handleCriarAgendamento = async () => {
    if (!date || !horario || !tipo) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      if (user?.id) {
        const dataFormatada = format(date, "yyyy-MM-dd");
        const novoAgendamento = await criarAgendamento({
          alunoId: user.id,
          data: dataFormatada,
          horario,
          hora: horario, // Add this line to fix the error
          tipo,
          descricao,
          status: "pendente"
        });

        setAgendamentos([...agendamentos, novoAgendamento]);
        setDialogOpen(false);
        setHorario("");
        setTipo("avaliacao");
        setDescricao("");
        toast.success("Agendamento criado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento. Tente novamente.");
    }
  };

  const handleExcluirAgendamento = async () => {
    if (!agendamentoParaExcluir) return;

    try {
      await excluirAgendamento(agendamentoParaExcluir);
      setAgendamentos(agendamentos.filter(a => a.id !== agendamentoParaExcluir));
      setAgendamentoParaExcluir(null);
      toast.success("Agendamento cancelado com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      toast.error("Erro ao cancelar agendamento. Tente novamente.");
    }
  };

  const agendamentosFuturos = agendamentos
    .filter(a => new Date(a.data + "T" + a.horario) > new Date())
    .sort((a, b) => {
      const dataA = new Date(a.data + "T" + a.horario);
      const dataB = new Date(b.data + "T" + b.horario);
      return dataA.getTime() - dataB.getTime();
    });

  const agendamentosAnteriores = agendamentos
    .filter(a => new Date(a.data + "T" + a.horario) <= new Date())
    .sort((a, b) => {
      const dataA = new Date(a.data + "T" + a.horario);
      const dataB = new Date(b.data + "T" + b.horario);
      return dataB.getTime() - dataA.getTime();
    });

  const getTipoAgendamento = (tipo: string) => {
    switch (tipo) {
      case "avaliacao":
        return "Avaliação Física";
      case "consulta":
        return "Consulta";
      case "treino":
        return "Acompanhamento de Treino";
      default:
        return tipo;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamento</h1>
          <p className="text-gray-600 mt-1">
            Agende avaliações e consultas com seu professor
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-fitness-primary hover:bg-fitness-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
              <DialogDescription>
                Preencha os detalhes para agendar sua avaliação ou consulta.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Data
                </label>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  disabled={(date) => date < new Date()}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="horario" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Horário
                  </label>
                  <Select value={horario} onValueChange={setHorario}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {horariosPossiveis.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="tipo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Tipo
                  </label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="avaliacao">Avaliação Física</SelectItem>
                        <SelectItem value="consulta">Consulta</SelectItem>
                        <SelectItem value="treino">Acompanhamento de Treino</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="descricao" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Descrição (opcional)
                </label>
                <textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Alguma observação ou informação adicional"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button className="bg-fitness-primary hover:bg-fitness-primary/90" onClick={handleCriarAgendamento}>Agendar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Próximos Agendamentos</h2>

        {agendamentosFuturos.length > 0 ? (
          <div className="space-y-4">
            {agendamentosFuturos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getTipoAgendamento(agendamento.tipo)}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {format(new Date(agendamento.data), "dd/MM/yyyy")} às {agendamento.horario}
                      </span>
                    </div>
                    {agendamento.descricao && (
                      <p className="text-xs text-gray-500 mt-1">{agendamento.descricao}</p>
                    )}
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => setAgendamentoParaExcluir(agendamento.id)}
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setAgendamentoParaExcluir(null)}>Não, manter</AlertDialogCancel>
                      <AlertDialogAction onClick={handleExcluirAgendamento} className="bg-red-600 hover:bg-red-700">
                        Sim, cancelar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Você não tem agendamentos futuros.</p>
            <Button
              variant="link" 
              className="text-fitness-primary mt-2"
              onClick={() => setDialogOpen(true)}
            >
              Agendar agora
            </Button>
          </div>
        )}
      </div>

      {agendamentosAnteriores.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Histórico de Agendamentos</h2>
          
          <div className="space-y-3">
            {agendamentosAnteriores.map((agendamento) => (
              <div
                key={agendamento.id}
                className="flex justify-between items-center p-3 border border-gray-100 rounded-md bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="bg-gray-200 p-2 rounded-full mr-3">
                    <Calendar className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">
                      {getTipoAgendamento(agendamento.tipo)}
                    </h3>
                    <div className="flex items-center text-gray-500 text-xs mt-0.5">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(agendamento.data), "dd/MM/yyyy")} às {agendamento.horario}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full ${
                      agendamento.status === "concluido" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {agendamento.status === "concluido" ? "Concluído" : "Realizado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamento;
