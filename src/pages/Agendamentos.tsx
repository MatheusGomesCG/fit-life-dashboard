
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Calendar, Clock, User, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Agendamento {
  id: string;
  cliente_nome: string;
  cliente_telefone: string;
  data: string;
  hora: string;
  tipo: string;
  status: "agendado" | "confirmado" | "cancelado" | "concluido";
  observacoes?: string;
}

const Agendamentos: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    // Simular carregamento de agendamentos
    setTimeout(() => {
      setAgendamentos([
        {
          id: "1",
          cliente_nome: "João Silva",
          cliente_telefone: "(11) 99999-9999",
          data: "2024-06-05",
          hora: "09:00",
          tipo: "Avaliação Física",
          status: "agendado",
          observacoes: "Primeira consulta"
        },
        {
          id: "2",
          cliente_nome: "Maria Santos", 
          cliente_telefone: "(11) 88888-8888",
          data: "2024-06-05",
          hora: "14:00",
          tipo: "Consulta de Acompanhamento",
          status: "confirmado",
          observacoes: "Revisão do plano de treino"
        },
        {
          id: "3",
          cliente_nome: "Pedro Costa",
          cliente_telefone: "(11) 77777-7777", 
          data: "2024-06-06",
          hora: "10:30",
          tipo: "Avaliação Física",
          status: "agendado"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado": return "bg-blue-100 text-blue-800";
      case "confirmado": return "bg-green-100 text-green-800";
      case "cancelado": return "bg-red-100 text-red-800";
      case "concluido": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "agendado": return "Agendado";
      case "confirmado": return "Confirmado";
      case "cancelado": return "Cancelado";
      case "concluido": return "Concluído";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const agendamentosHoje = agendamentos.filter(ag => ag.data === "2024-06-05");
  const proximosAgendamentos = agendamentos.filter(ag => ag.data > "2024-06-05");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus agendamentos e consultas
          </p>
        </div>
        <Link to="/novo-agendamento">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agendamentos de Hoje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Hoje - {new Date().toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {agendamentosHoje.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum agendamento para hoje
              </p>
            ) : (
              <div className="space-y-3">
                {agendamentosHoje.map((agendamento) => (
                  <div key={agendamento.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{agendamento.cliente_nome}</h4>
                        <p className="text-sm text-gray-600">{agendamento.tipo}</p>
                      </div>
                      <Badge className={getStatusColor(agendamento.status)}>
                        {getStatusText(agendamento.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {agendamento.hora}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {agendamento.cliente_telefone}
                      </div>
                    </div>
                    {agendamento.observacoes && (
                      <p className="text-sm text-gray-500 mt-2">
                        {agendamento.observacoes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximos Agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {proximosAgendamentos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum agendamento futuro
              </p>
            ) : (
              <div className="space-y-3">
                {proximosAgendamentos.map((agendamento) => (
                  <div key={agendamento.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{agendamento.cliente_nome}</h4>
                        <p className="text-sm text-gray-600">{agendamento.tipo}</p>
                      </div>
                      <Badge className={getStatusColor(agendamento.status)}>
                        {getStatusText(agendamento.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(agendamento.data).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {agendamento.hora}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <Phone className="h-4 w-4" />
                      {agendamento.cliente_telefone}
                    </div>
                    {agendamento.observacoes && (
                      <p className="text-sm text-gray-500 mt-2">
                        {agendamento.observacoes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {agendamentosHoje.length}
              </div>
              <div className="text-sm text-gray-600">Hoje</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {proximosAgendamentos.length}
              </div>
              <div className="text-sm text-gray-600">Próximos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {agendamentos.filter(ag => ag.status === "confirmado").length}
              </div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {agendamentos.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agendamentos;
