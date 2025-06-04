
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Users, Search, Eye, Edit, Trash2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buscarAlunosPorProfessor, excluirAluno, Aluno } from "@/services/alunosService";
import LoadingSpinner from "@/components/LoadingSpinner";

const GerenciarAlunos: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const alunosData = await buscarAlunosPorProfessor(user.id);
        setAlunos(alunosData);
      }
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Erro ao carregar lista de alunos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, [user]);

  const handleExcluirAluno = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        await excluirAluno(id);
        toast.success("Aluno excluído com sucesso!");
        carregarAlunos();
      } catch (error) {
        console.error("Erro ao excluir aluno:", error);
        toast.error("Erro ao excluir aluno.");
      }
    }
  };

  const alunosFiltrados = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os seus alunos cadastrados
          </p>
        </div>
        <Link to="/alunos/cadastrar">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar alunos por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            {alunosFiltrados.length} aluno(s) encontrado(s)
          </div>
        </div>

        {alunosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Tente ajustar os termos de busca." 
                : "Comece cadastrando seu primeiro aluno."
              }
            </p>
            {!searchTerm && (
              <Link to="/alunos/cadastrar">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Aluno
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alunosFiltrados.map((aluno) => (
              <div key={aluno.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{aluno.nome}</h3>
                    <p className="text-sm text-gray-500">{aluno.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>Idade: {aluno.idade} anos</div>
                  <div>Peso: {aluno.peso} kg</div>
                  <div>Altura: {aluno.altura} cm</div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/alunos/editar/${aluno.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/fotos-aluno/${aluno.id}`}>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExcluirAluno(aluno.id!)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GerenciarAlunos;
