import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { listarAlunos, Aluno, excluirAluno } from "@/services/alunosService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";

const GerenciarAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      const data = await listarAlunos();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Erro ao carregar alunos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirAluno = async (id: string) => {
    try {
      setLoading(true);
      await excluirAluno(id);
      setAlunos((prev) => prev.filter((aluno) => aluno.id !== id));
      toast.success("Aluno excluído com sucesso!");
      setConfirmDelete(null);
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      toast.error("Erro ao excluir aluno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h1>
          <p className="text-gray-600 mt-1">
            Visualize, edite e organize seus alunos cadastrados
          </p>
        </div>
        <Link
          to="/cadastrar-aluno"
          className="flex items-center px-4 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors w-full md:w-auto justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Cadastrar Novo Aluno
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar alunos por nome..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-fitness-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && !alunos.length ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : alunosFiltrados.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500">
            {searchTerm
              ? "Nenhum aluno encontrado com esse nome."
              : "Nenhum aluno cadastrado. Adicione um novo aluno para começar."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nome
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Idade
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Peso/Altura
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    IMC
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data Cadastro
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alunosFiltrados.map((aluno) => (
                  <tr
                    key={aluno.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {aluno.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {aluno.experiencia === "iniciante"
                          ? "Iniciante"
                          : aluno.experiencia === "intermediario"
                          ? "Intermediário"
                          : "Avançado"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {aluno.idade} anos
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{aluno.peso} kg</div>
                      <div className="text-sm text-gray-500">
                        {aluno.altura} cm
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{aluno.imc?.toFixed(1)}</div>
                      <div className="text-sm text-gray-500">
                        {aluno.percentualGordura?.toFixed(1)}% gordura
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {aluno.dataCadastro
                        ? format(
                            new Date(aluno.dataCadastro),
                            "dd/MM/yyyy"
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <Link
                        to={`/editar-aluno/${aluno.id}`}
                        className="text-amber-600 hover:text-amber-800 inline-flex items-center mr-2"
                        title="Editar aluno"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      {confirmDelete === aluno.id ? (
                        <>
                          <button
                            onClick={() => handleExcluirAluno(aluno.id!)}
                            className="text-red-600 hover:text-red-800"
                            title="Confirmar exclusão"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-gray-600 hover:text-gray-800 ml-2"
                            title="Cancelar exclusão"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(aluno.id!)}
                          className="text-red-600 hover:text-red-800"
                          title="Excluir aluno"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciarAlunos;
