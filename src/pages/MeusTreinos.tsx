
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FileText, Play, Clock, CheckCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Treino {
  id: string;
  nome: string;
  descricao: string;
  exercicios: number;
  duracao: string;
  nivel: "iniciante" | "intermediario" | "avancado";
  status: "pendente" | "em_andamento" | "concluido";
  professor_nome: string;
  created_at: string;
}

const MeusTreinos: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [treinos, setTreinos] = useState<Treino[]>([]);

  useEffect(() => {
    // Simular carregamento de treinos
    setTimeout(() => {
      setTreinos([
        {
          id: "1",
          nome: "Treino Superior A",
          descricao: "Foco em peito, ombros e tríceps",
          exercicios: 8,
          duracao: "45 min",
          nivel: "intermediario",
          status: "pendente",
          professor_nome: "Prof. Carlos Silva",
          created_at: "2024-06-01"
        },
        {
          id: "2",
          nome: "Treino Inferior B", 
          descricao: "Foco em pernas e glúteos",
          exercicios: 10,
          duracao: "50 min",
          nivel: "intermediario",
          status: "concluido",
          professor_nome: "Prof. Carlos Silva",
          created_at: "2024-05-28"
        },
        {
          id: "3",
          nome: "Cardio HIIT",
          descricao: "Treino cardiovascular intenso",
          exercicios: 6,
          duracao: "30 min", 
          nivel: "avancado",
          status: "em_andamento",
          professor_nome: "Prof. Carlos Silva",
          created_at: "2024-06-03"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [user]);

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "iniciante": return "bg-green-100 text-green-800";
      case "intermediario": return "bg-yellow-100 text-yellow-800";
      case "avancado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-blue-100 text-blue-800";
      case "em_andamento": return "bg-orange-100 text-orange-800";
      case "concluido": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "em_andamento": return "Em Andamento";
      case "concluido": return "Concluído";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente": return <Clock className="h-4 w-4" />;
      case "em_andamento": return <Play className="h-4 w-4" />;
      case "concluido": return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const treinosPendentes = treinos.filter(t => t.status === "pendente");
  const treinosAndamento = treinos.filter(t => t.status === "em_andamento");
  const treinosConcluidos = treinos.filter(t => t.status === "concluido");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Treinos</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe seus treinos e progresso
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Treinos</p>
                <p className="text-2xl font-bold">{treinos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold">{treinosPendentes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold">{treinosAndamento.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold">{treinosConcluidos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Treinos */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Treinos</CardTitle>
        </CardHeader>
        <CardContent>
          {treinos.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum treino encontrado
              </h3>
              <p className="text-gray-500">
                Seu professor ainda não criou treinos para você.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {treinos.map((treino) => (
                <div key={treino.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{treino.nome}</h3>
                        <Badge className={getStatusColor(treino.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(treino.status)}
                            {getStatusText(treino.status)}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{treino.descricao}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{treino.exercicios} exercícios</span>
                        <span>{treino.duracao}</span>
                        <span>Prof: {treino.professor_nome}</span>
                      </div>
                    </div>
                    <Badge className={getNivelColor(treino.nivel)}>
                      {treino.nivel.charAt(0).toUpperCase() + treino.nivel.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/ficha-treino/${treino.id}`}>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </Link>
                    {treino.status === "pendente" && (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Iniciar Treino
                      </Button>
                    )}
                    {treino.status === "em_andamento" && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Finalizar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeusTreinos;
