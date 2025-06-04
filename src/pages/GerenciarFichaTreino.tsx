
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, FileText, Search, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/LoadingSpinner";

interface FichaTreino {
  id: string;
  nome: string;
  descricao: string;
  aluno_nome: string;
  created_at: string;
}

const GerenciarFichaTreino: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fichas, setFichas] = useState<FichaTreino[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simular carregamento de fichas
    setTimeout(() => {
      setFichas([
        {
          id: "1",
          nome: "Treino Completo A",
          descricao: "Treino focado em membros superiores",
          aluno_nome: "João Silva",
          created_at: "2024-01-15"
        },
        {
          id: "2", 
          nome: "Treino Cardio B",
          descricao: "Treino cardiovascular intenso",
          aluno_nome: "Maria Santos",
          created_at: "2024-01-14"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [user]);

  const fichasFiltradas = fichas.filter(ficha =>
    ficha.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ficha.aluno_nome.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Fichas de Treino</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as fichas de treino dos seus alunos
          </p>
        </div>
        <Link to="/cadastrar-treino">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Ficha
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar fichas por nome ou aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            {fichasFiltradas.length} ficha(s) encontrada(s)
          </div>
        </div>

        {fichasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Nenhuma ficha encontrada" : "Nenhuma ficha cadastrada"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Tente ajustar os termos de busca." 
                : "Comece criando sua primeira ficha de treino."
              }
            </p>
            {!searchTerm && (
              <Link to="/cadastrar-treino">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Ficha
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fichasFiltradas.map((ficha) => (
              <div key={ficha.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{ficha.nome}</h3>
                    <p className="text-sm text-gray-500">{ficha.descricao}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {ficha.aluno_nome}
                  </div>
                  <div>Criado em: {new Date(ficha.created_at).toLocaleDateString()}</div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/ficha-treino/${ficha.id}`}>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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

export default GerenciarFichaTreino;
