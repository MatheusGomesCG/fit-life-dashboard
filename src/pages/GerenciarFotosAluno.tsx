
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, User, Camera, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buscarAlunoPorId, Aluno, FotoAluno } from "@/services/alunosService";
import AlunoFotosTracking from "@/components/AlunoFotosTracking";
import LoadingSpinner from "@/components/LoadingSpinner";

const GerenciarFotosAluno: React.FC = () => {
  const { alunoId } = useParams<{ alunoId: string }>();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [fotos, setFotos] = useState<FotoAluno[]>([]);

  useEffect(() => {
    const fetchAluno = async () => {
      if (!alunoId) {
        toast.error("ID do aluno não encontrado");
        navigate("/gerenciar-alunos");
        return;
      }
      
      try {
        setLoading(true);
        const alunoData = await buscarAlunoPorId(alunoId);
        setAluno(alunoData);
        setFotos(alunoData.fotos || []);
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
        toast.error("Erro ao buscar dados do aluno.");
        navigate("/gerenciar-alunos");
      } finally {
        setLoading(false);
      }
    };

    fetchAluno();
  }, [alunoId, navigate]);

  const handleUpdateFotos = (fotosAtualizadas: FotoAluno[]) => {
    setFotos(fotosAtualizadas);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center py-8">
            <p className="text-red-500 mb-4">Aluno não encontrado.</p>
            <Button
              onClick={() => navigate("/gerenciar-alunos")}
              variant="outline"
            >
              Voltar para lista de alunos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
        {/* Header responsivo */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/gerenciar-alunos")}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Acompanhamento Fotográfico
              </h1>
              <p className="text-gray-600 mt-1 truncate">
                {aluno.nome}
              </p>
            </div>
          </div>
        </div>

        {/* Card de informações do aluno - Layout responsivo */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Informações do Aluno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Nome</span>
                <p className="font-medium break-words">{aluno.nome}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Email</span>
                <p className="text-gray-600 break-all text-sm">{aluno.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Idade</span>
                <p className="font-medium">{aluno.idade} anos</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Peso</span>
                <p className="font-medium">{aluno.peso} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de estatísticas das fotos */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{fotos.length}</p>
                <p className="text-sm text-gray-600">Total de Fotos</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {fotos.length > 0 ? new Set(fotos.map(f => new Date(f.data || f.data_upload).getMonth())).size : 0}
                </p>
                <p className="text-sm text-gray-600">Meses com Fotos</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {fotos.length > 0 ? Math.ceil((Date.now() - new Date(fotos[fotos.length - 1]?.data || fotos[fotos.length - 1]?.data_upload).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </p>
                <p className="text-sm text-gray-600">Dias desde última foto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Componente de tracking de fotos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <AlunoFotosTracking 
            alunoId={aluno.id!} 
            fotos={fotos} 
            onUpdate={handleUpdateFotos} 
          />
        </div>
      </div>
    </div>
  );
};

export default GerenciarFotosAluno;
