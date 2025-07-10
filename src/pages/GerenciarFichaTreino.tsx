
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  listarAlunos,
  Aluno,
  buscarFichaTreinoAluno
} from "@/services/alunosService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  PlusCircle,
  Search,
  Edit,
  User,
  Activity,
  TrendingUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";

const GerenciarFichaTreino: React.FC = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [fichasStatus, setFichasStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      const alunosData = await listarAlunos();
      setAlunos(alunosData);
      
      // Verificar quais alunos já têm ficha de treino
      const statusFichas: Record<string, boolean> = {};
      for (const aluno of alunosData) {
        try {
          const temFicha = await buscarFichaTreinoAluno(aluno.id);
          statusFichas[aluno.id] = !!temFicha;
        } catch (error) {
          statusFichas[aluno.id] = false;
        }
      }
      setFichasStatus(statusFichas);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de alunos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const navegarParaFicha = (alunoId: string) => {
    navigate(`/ficha-treino/${alunoId}`);
  };

  const navegarParaCadastrarFicha = (alunoId: string) => {
    navigate(`/cadastrar-treino/${alunoId}`);
  };
  
  const navegarParaEditarFicha = (alunoId: string) => {
    navigate(`/cadastrar-treino/${alunoId}`);
  };

  // Filtra os alunos com base no campo de busca
  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Fichas de Treino</h1>
          <p className="text-gray-600 mt-1">
            Visualize, edite ou crie novas fichas de treino para seus alunos
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center relative">
        <Search className="h-5 w-5 absolute left-3 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por nome do aluno..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="pl-10 pr-4 py-2 w-full max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner size="large" />
        </div>
      ) : alunosFiltrados.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum aluno encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alunosFiltrados.map((aluno) => (
            <Card key={aluno.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate">
                      {aluno.nome}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{aluno.idade} anos</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Informações do aluno */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">IMC:</span>
                  </div>
                  <span className="text-sm font-medium">
                    {aluno.imc?.toFixed(2) || "-"}
                  </span>
                </div>
                
                {/* Status da ficha */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Status:</span>
                  </div>
                  {fichasStatus[aluno.id] ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Ficha criada
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                      Sem ficha
                    </span>
                  )}
                </div>
                
                {/* Ações */}
                <div className="pt-2 border-t">
                  {fichasStatus[aluno.id] ? (
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => navegarParaFicha(aluno.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Ficha
                      </Button>
                      <Button
                        onClick={() => navegarParaEditarFicha(aluno.id)}
                        variant="outline"
                        className="w-full border-green-200 text-green-600 hover:bg-green-50"
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Ficha
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => navegarParaCadastrarFicha(aluno.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Criar Ficha
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GerenciarFichaTreino;
