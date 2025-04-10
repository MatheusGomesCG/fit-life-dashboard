
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  buscarAlunoPorId,
  gerarFichaTreino,
  FichaTreino,
  CargaExercicio,
} from "@/services/alunosService";
import { gerarPDFFichaTreino, downloadPDF } from "@/services/pdfService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ArrowLeft, Download, Printer, FileText } from "lucide-react";

const VisualizarFichaTreino: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState<FichaTreino | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlunoEGerarFicha = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const aluno = await buscarAlunoPorId(id);
        const fichaTreino = gerarFichaTreino(aluno);
        setFicha(fichaTreino);
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
        toast.error("Erro ao buscar dados do aluno.");
        navigate("/gerenciar-alunos");
      } finally {
        setLoading(false);
      }
    };

    fetchAlunoEGerarFicha();
  }, [id, navigate]);

  const handleDownloadPDF = () => {
    if (!ficha) return;
    
    try {
      const doc = gerarPDFFichaTreino(ficha);
      downloadPDF(doc, `ficha_treino_${ficha.aluno.nome.replace(/\s+/g, "_")}.pdf`);
      toast.success("Ficha de treino baixada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF da ficha de treino:", error);
      toast.error("Erro ao gerar PDF da ficha de treino.");
    }
  };

  // Agrupar exercícios por grupo muscular
  const exerciciosPorGrupo = ficha?.exercicios.reduce<Record<string, CargaExercicio[]>>((grupos, exercicio) => {
    if (!grupos[exercicio.grupoMuscular]) {
      grupos[exercicio.grupoMuscular] = [];
    }
    grupos[exercicio.grupoMuscular].push(exercicio);
    return grupos;
  }, {}) || {};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro ao carregar ficha de treino.</p>
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ficha de Treino</h1>
          <p className="text-gray-600 mt-1">
            {ficha.aluno.nome}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/gerenciar-alunos")}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1 px-3 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Baixar PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-fitness-primary mr-2" />
            <h2 className="text-xl font-bold text-center">Ficha de Treino Personalizada</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Informações do Aluno</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 pr-4 font-medium text-gray-600">Nome:</td>
                    <td>{ficha.aluno.nome}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium text-gray-600">Idade:</td>
                    <td>{ficha.aluno.idade} anos</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium text-gray-600">Peso:</td>
                    <td>{ficha.aluno.peso} kg</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium text-gray-600">Altura:</td>
                    <td>{ficha.aluno.altura} cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Métricas</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 pr-4 font-medium text-gray-600">IMC:</td>
                    <td>{ficha.aluno.imc?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium text-gray-600">% de Gordura:</td>
                    <td>{ficha.aluno.percentualGordura?.toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium text-gray-600">Experiência:</td>
                    <td className="capitalize">{ficha.aluno.experiencia}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4 font-medium text-gray-600">Data da Avaliação:</td>
                    <td>{new Date(ficha.dataAvaliacao).toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Treinos Recomendados</h3>
          
          {Object.entries(exerciciosPorGrupo).map(([grupo, exercicios]) => (
            <div key={grupo} className="mb-6">
              <h4 className="bg-fitness-primary/10 text-fitness-primary font-semibold p-2 rounded-md mb-2">{grupo}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercício</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carga (kg)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Séries</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repetições</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {exercicios.map((exercicio, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{exercicio.nomeExercicio}</td>
                        <td className="px-4 py-3">{exercicio.cargaIdeal}</td>
                        <td className="px-4 py-3">{exercicio.series}</td>
                        <td className="px-4 py-3">{exercicio.repeticoes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualizarFichaTreino;
