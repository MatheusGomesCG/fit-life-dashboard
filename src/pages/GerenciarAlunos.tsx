
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listarAlunos, Aluno, excluirAluno } from "@/services/alunosService";
import { toast } from "sonner";
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  FileText, 
  ArrowUpDown,
  RefreshCw 
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const GerenciarAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Aluno>("nome");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        setLoading(true);
        const data = await listarAlunos();
        setAlunos(data);
      } catch (error) {
        console.error("Erro ao listar alunos:", error);
        toast.error("Não foi possível carregar a lista de alunos.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, [refreshTrigger]);

  const handleSort = (field: keyof Aluno) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExcluirAluno = async (id?: string) => {
    if (!id) return;
    
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        await excluirAluno(id);
        toast.success("Aluno excluído com sucesso!");
        // Atualizar a lista
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error("Erro ao excluir aluno:", error);
        toast.error("Erro ao excluir aluno.");
      }
    }
  };

  // Filtrar alunos com base no termo de busca
  const filteredAlunos = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar alunos
  const sortedAlunos = [...filteredAlunos].sort((a, b) => {
    if (!a[sortField] || !b[sortField]) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h1>
          <p className="text-gray-600 mt-1">
            Visualize, edite e organize seus alunos
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
            title="Atualizar lista"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <Link 
            to="/cadastrar-aluno" 
            className="bg-fitness-primary text-white px-4 py-2 rounded-md hover:bg-fitness-primary/90 transition-colors flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Novo Aluno</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alunos por nome..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <LoadingSpinner size="large" />
          </div>
        ) : sortedAlunos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="fitness-table">
              <thead className="fitness-table-header">
                <tr>
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("nome")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nome</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("idade")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Idade</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("peso")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Peso (kg)</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("percentualGordura")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>% Gordura</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3">Experiência</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedAlunos.map((aluno) => (
                  <tr
                    key={aluno.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium">{aluno.nome}</td>
                    <td className="px-6 py-4">{aluno.idade} anos</td>
                    <td className="px-6 py-4">{aluno.peso} kg</td>
                    <td className="px-6 py-4">
                      {aluno.percentualGordura?.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 capitalize">{aluno.experiencia}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/editar-aluno/${aluno.id}`}
                          className="text-blue-500 hover:text-blue-700"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleExcluirAluno(aluno.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Excluir"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <Link
                          to={`/ficha-treino/${aluno.id}`}
                          className="text-green-500 hover:text-green-700"
                          title="Ver ficha de treino"
                        >
                          <FileText className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "Nenhum aluno encontrado com o termo de busca."
                : "Nenhum aluno cadastrado ainda."}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-fitness-secondary hover:text-fitness-primary"
              >
                Limpar busca
              </button>
            ) : (
              <Link
                to="/cadastrar-aluno"
                className="mt-2 inline-block text-fitness-secondary hover:text-fitness-primary"
              >
                Cadastrar um aluno
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GerenciarAlunos;
