
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { listarAlunos, Aluno } from "@/services/alunosService";
import { TrendingUp, Search, History, User, Calendar } from "lucide-react";

const HistoricoGeral: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filtro, setFiltro] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const carregarAlunos = async () => {
    try {
      setIsLoading(true);
      const data = await listarAlunos();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Erro ao carregar lista de alunos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.tipo === "professor") {
      carregarAlunos();
    } else if (!authLoading && (!isAuthenticated || user?.tipo !== "professor")) {
      setIsLoading(false);
      if (user?.tipo !== "professor") {
        toast.error("Acesso negado. Apenas professores podem acessar o histórico.");
        navigate("/");
      }
    }
  }, [authLoading, isAuthenticated, user?.tipo, navigate]);

  const navegarParaHistoricoMedidas = (alunoId: string) => {
    navigate(`/historico-medidas/${alunoId}`);
  };

  if (authLoading || (isAuthenticated && user?.tipo === "professor" && isLoading)) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated || user?.tipo !== "professor") {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Acesso restrito a professores.</p>
      </div>
    );
  }

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-orange-100 p-3 rounded-lg">
          <TrendingUp className="h-8 w-8 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Evolução</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe a evolução das medidas corporais de todos os seus alunos
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico por Aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center relative">
            <Search className="h-5 w-5 absolute left-3 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar aluno por nome..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>

          {alunosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {alunos.length === 0 ? (
                <div className="space-y-2">
                  <History className="h-12 w-12 mx-auto text-gray-300" />
                  <p>Nenhum aluno cadastrado ainda.</p>
                  <p className="text-sm">Cadastre alunos para começar a acompanhar o histórico de evolução.</p>
                </div>
              ) : (
                "Nenhum aluno encontrado."
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Aluno</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Peso Atual</TableHead>
                    <TableHead>Altura</TableHead>
                    <TableHead className="text-center">Ver Histórico</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunosFiltrados.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {aluno.nome}
                      </TableCell>
                      <TableCell>{aluno.email}</TableCell>
                      <TableCell>{aluno.telefone || "Não informado"}</TableCell>
                      <TableCell>{aluno.idade ? `${aluno.idade} anos` : "Não informado"}</TableCell>
                      <TableCell>{aluno.peso ? `${aluno.peso} kg` : "Não informado"}</TableCell>
                      <TableCell>{aluno.altura ? `${aluno.altura} cm` : "Não informado"}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() => navegarParaHistoricoMedidas(aluno.id!)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Ver Evolução
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {alunos.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Dica para Acompanhamento</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Clique em "Ver Evolução" para acessar o histórico completo de medidas de cada aluno, 
                    incluindo gráficos de progresso e comparativos ao longo do tempo.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HistoricoGeral;
