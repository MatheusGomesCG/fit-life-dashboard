
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { buscarAlunoPorId, Aluno, FotoAluno } from "@/services/alunosService";
import AlunoFotosTracking from "@/components/AlunoFotosTracking";
import LoadingSpinner from "@/components/LoadingSpinner";

const GerenciarFotosAluno: React.FC = () => {
  const { alunoId } = useParams<{ alunoId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [fotos, setFotos] = useState<FotoAluno[]>([]);

  console.log("🔍 [GerenciarFotosAluno] Estado:", {
    alunoId,
    isAuthenticated,
    userId: user?.id,
    authLoading
  });

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user) {
        console.log("❌ [GerenciarFotosAluno] Usuário não autenticado, redirecionando");
        toast.error("Você precisa estar logado para acessar esta página");
        navigate("/login");
        return;
      }

      if (user.tipo !== "professor") {
        console.log("❌ [GerenciarFotosAluno] Usuário não é professor");
        toast.error("Acesso negado");
        navigate("/dashboard-professor");
        return;
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    const fetchAluno = async () => {
      if (!alunoId || authLoading || !isAuthenticated || !user) {
        console.log("⏸️ [GerenciarFotosAluno] Aguardando autenticação...");
        return;
      }
      
      try {
        setLoading(true);
        console.log("🔍 [GerenciarFotosAluno] Buscando aluno:", alunoId);
        
        const alunoData = await buscarAlunoPorId(alunoId);
        
        console.log("✅ [GerenciarFotosAluno] Aluno encontrado:", {
          id: alunoData.id,
          nome: alunoData.nome,
          fotos: alunoData.fotos?.length || 0
        });
        
        setAluno(alunoData);
        setFotos(alunoData.fotos || []);
      } catch (error) {
        console.error("❌ [GerenciarFotosAluno] Erro ao buscar aluno:", error);
        toast.error("Erro ao buscar dados do aluno.");
        navigate("/gerenciar-alunos");
      } finally {
        setLoading(false);
      }
    };

    fetchAluno();
  }, [alunoId, authLoading, isAuthenticated, user, navigate]);

  const handleUpdateFotos = (fotosAtualizadas: FotoAluno[]) => {
    console.log("📸 [GerenciarFotosAluno] Atualizando fotos:", fotosAtualizadas.length);
    setFotos(fotosAtualizadas);
  };

  // Mostrar loading durante autenticação
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Não renderizar se não estiver autenticado
  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Aluno não encontrado.</p>
        <button
          onClick={() => navigate("/gerenciar-alunos")}
          className="mt-4 text-fitness-primary hover:underline"
        >
          Voltar para lista de alunos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate("/gerenciar-alunos")}
          className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Acompanhamento Fotográfico</h1>
          <p className="text-gray-600 mt-1">
            {aluno.nome}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informações do Aluno</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium">{aluno.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Idade</p>
              <p className="font-medium">{aluno.idade} anos</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Peso</p>
              <p className="font-medium">{aluno.peso} kg</p>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        <AlunoFotosTracking 
          alunoId={aluno.id!} 
          fotos={fotos} 
          onUpdate={handleUpdateFotos} 
        />
      </div>
    </div>
  );
};

export default GerenciarFotosAluno;
