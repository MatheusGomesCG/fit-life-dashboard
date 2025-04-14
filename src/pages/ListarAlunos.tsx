
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listarAlunos, Aluno } from "@/services/alunosService";
import { toast } from "sonner";
import { Search, UserPlus, ArrowUpDown } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const ListarAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Aluno>("nome");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-900">Alunos Cadastrados</h1>
        <Link 
          to="/cadastrar-aluno" 
          className="bg-fitness-primary text-white px-4 py-2 rounded-md hover:bg-fitness-primary/90 transition-colors flex items-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          <span>Novo Aluno</span>
        </Link>
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
                    onClick={() => handleSort("altura")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Altura (cm)</span>
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
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("imc")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>IMC</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3">Experiência</th>
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
                    <td className="px-6 py-4">{aluno.altura} cm</td>
                    <td className="px-6 py-4">
                      {aluno.percentualGordura?.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4">{aluno.imc?.toFixed(2)}</td>
                    <td className="px-6 py-4 capitalize">{aluno.experiencia}</td>
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

export default ListarAlunos;
