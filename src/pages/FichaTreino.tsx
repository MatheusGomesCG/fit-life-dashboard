import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  buscarAlunoPorId,
  gerarFichaTreino,
  FichaTreino,
  CargaExercicio,
  criarOuAtualizarFichaTreino
} from "@/services/alunosService";
import { gerarPDFFichaTreino, downloadPDF } from "@/services/pdfService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ArrowLeft, Download, Video, Youtube, Save, Edit, X, Calendar } from "lucide-react";
import { FileText } from "lucide-react";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";

const gruposMusculares = [
  "Peito",
  "Costas",
  "Pernas",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Abdômen",
  "Glúteos",
  "Antebraço",
  "Panturrilha"
];

const diasSemana = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado-feira",
  "Domingo-feira",
  "Segunda e Quinta-feira",
  "Terça e Sexta-feira",
  "Quarta e Sábado-feira"
];

const VisualizarFichaTreino: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState<FichaTreino | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editableExercicios, setEditableExercicios] = useState<CargaExercicio[]>([]);
  const [filtroExercicios, setFiltroExercicios] = useState<string>("todos");

  useEffect(() => {
    const fetchAlunoEGerarFicha = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const aluno = await buscarAlunoPorId(id);
        const fichaTreino = gerarFichaTreino(aluno);
        setFicha(fichaTreino);
        setEditableExercicios([...fichaTreino.exercicios]);
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
        toast.error("Erro ao buscar dados do aluno.");
        navigate("/gerenciar-fichas");
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

  const handleExercicioChange = (index: number, field: keyof CargaExercicio, value: string | number) => {
    const updatedExercicios = [...editableExercicios];
    updatedExercicios[index] = {
      ...updatedExercicios[index],
      [field]: value
    };
    setEditableExercicios(updatedExercicios);
  };

  const salvarFichaTreino = async () => {
    if (!id || !ficha) return;
    
    try {
      setSaving(true);
      await criarOuAtualizarFichaTreino(id, editableExercicios);
      
      setFicha({
        ...ficha,
        exercicios: editableExercicios
      });
      
      setEditMode(false);
      toast.success("Ficha de treino atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar ficha de treino:", error);
      toast.error("Erro ao atualizar ficha de treino.");
    } finally {
      setSaving(false);
    }
  };

  const renderYoutubeEmbed = (videoUrl: string) => {
    if (!videoUrl) return null;
    
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = videoUrl.match(regex);
    const videoId = match ? match[1] : null;
    
    if (!videoId) return <p className="text-red-500">URL de vídeo inválida</p>;
    
    return (
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const getDiasUnicos = () => {
    if (!ficha) return [];
    
    const dias = ficha.exercicios
      .map(ex => ex.diaTreino)
      .filter((dia, index, self) => dia && self.indexOf(dia) === index);
    
    return dias;
  };

  const agruparExerciciosPorDia = () => {
    if (!ficha) return {};
    
    const exercicios = editMode ? editableExercicios : ficha.exercicios;
    
    return exercicios.reduce<Record<string, CargaExercicio[]>>((grupos, exercicio) => {
      const dia = exercicio.diaTreino || "Sem dia definido";
      if (!grupos[dia]) {
        grupos[dia] = [];
      }
      grupos[dia].push(exercicio);
      return grupos;
    }, {});
  };

  const getExerciciosFiltrados = () => {
    if (!ficha) return {};
    
    const exerciciosPorDia = agruparExerciciosPorDia();
    
    if (filtroExercicios === "todos") {
      return exerciciosPorDia;
    } else {
      return {
        [filtroExercicios]: exerciciosPorDia[filtroExercicios] || []
      };
    }
  };

  const diasUnicos = getDiasUnicos();
  const exerciciosFiltrados = getExerciciosFiltrados();
  
  const agruparPorGrupoMuscular = (exercicios: CargaExercicio[]) => {
    return exercicios.reduce<Record<string, CargaExercicio[]>>((grupos, exercicio) => {
      if (!grupos[exercicio.grupoMuscular]) {
        grupos[exercicio.grupoMuscular] = [];
      }
      grupos[exercicio.grupoMuscular].push(exercicio);
      return grupos;
    }, {});
  };

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
          onClick={() => navigate("/gerenciar-fichas")}
          className="mt-4 text-fitness-primary hover:underline"
        >
          Voltar para gerenciamento de fichas
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
            onClick={() => navigate("/gerenciar-fichas")}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>
          {!editMode && (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1 px-3 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Baixar PDF</span>
              </button>
            </>
          )}
          {editMode && (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={salvarFichaTreino}
                disabled={saving}
                className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                {saving ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </>
                )}
              </button>
            </>
          )}
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
          
          {ficha.aluno.fotos && ficha.aluno.fotos.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Fotos do Aluno</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {ficha.aluno.fotos.map((foto, index) => (
                  <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="relative pt-[100%]">
                      <img 
                        src={foto.url} 
                        alt={`Foto ${index + 1}`} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 bg-gray-50 text-xs text-center">
                      {new Date(foto.data).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Treinos Recomendados</h3>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <select 
                value={filtroExercicios}
                onChange={(e) => setFiltroExercicios(e.target.value)}
                className="border-gray-300 rounded-md text-sm"
              >
                <option value="todos">Todos os dias</option>
                {diasUnicos.map((dia) => (
                  <option key={dia} value={dia}>{dia}</option>
                ))}
              </select>
            </div>
          </div>
          
          {editMode ? (
            Object.entries(exerciciosFiltrados).map(([dia, exercicios]) => (
              <div key={dia} className="mb-8">
                <h4 className="bg-fitness-primary/10 text-fitness-primary font-semibold p-2 rounded-md mb-4">
                  {dia}
                </h4>
                {Object.entries(agruparPorGrupoMuscular(exercicios)).map(([grupo, exerciciosGrupo]) => (
                  <div key={grupo} className="mb-6">
                    <h5 className="text-gray-800 font-medium mb-3 border-l-4 border-fitness-primary pl-2">
                      {grupo}
                    </h5>
                    <div className="space-y-4">
                      {exerciciosGrupo.map((exercicio, index) => {
                        const globalIndex = editableExercicios.findIndex(ex => 
                          ex.nomeExercicio === exercicio.nomeExercicio && 
                          ex.grupoMuscular === exercicio.grupoMuscular
                        );
                        return (
                          <div key={index} className="bg-gray-50 p-4 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                              <FormInput
                                id={`exercicio-${index}-nome`}
                                label="Nome do Exercício"
                                value={exercicio.nomeExercicio}
                                onChange={(e) => handleExercicioChange(globalIndex, "nomeExercicio", e.target.value)}
                                required
                              />
                              
                              <FormSelect
                                id={`exercicio-${index}-grupo`}
                                label="Grupo Muscular"
                                value={exercicio.grupoMuscular}
                                onChange={(e) => handleExercicioChange(globalIndex, "grupoMuscular", e.target.value)}
                                options={gruposMusculares.map(grupo => ({ value: grupo, label: grupo }))}
                                required
                              />
                              
                              <FormSelect
                                id={`exercicio-${index}-dia`}
                                label="Dia do Treino"
                                value={exercicio.diaTreino || ""}
                                onChange={(e) => handleExercicioChange(globalIndex, "diaTreino", e.target.value)}
                                options={diasSemana.map(dia => ({ value: dia, label: dia }))}
                                required
                              />
                              
                              <FormInput
                                id={`exercicio-${index}-carga`}
                                label="Carga (kg)"
                                type="number"
                                value={exercicio.cargaIdeal.toString()}
                                onChange={(e) => handleExercicioChange(globalIndex, "cargaIdeal", Number(e.target.value))}
                                required
                              />
                              
                              <FormInput
                                id={`exercicio-${index}-series`}
                                label="Séries"
                                type="number"
                                value={exercicio.series.toString()}
                                onChange={(e) => handleExercicioChange(globalIndex, "series", Number(e.target.value))}
                                required
                              />
                              
                              <FormInput
                                id={`exercicio-${index}-repeticoes`}
                                label="Repetições"
                                type="number"
                                value={exercicio.repeticoes.toString()}
                                onChange={(e) => handleExercicioChange(globalIndex, "repeticoes", Number(e.target.value))}
                                required
                              />
                              
                              <FormInput
                                id={`exercicio-${index}-estrategia`}
                                label="Estratégia/Técnica"
                                value={exercicio.estrategia || ""}
                                onChange={(e) => handleExercicioChange(globalIndex, "estrategia", e.target.value)}
                              />
                              
                              <FormInput
                                id={`exercicio-${index}-video`}
                                label="Link do Vídeo (YouTube)"
                                value={exercicio.videoUrl || ""}
                                onChange={(e) => handleExercicioChange(globalIndex, "videoUrl", e.target.value)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            Object.entries(exerciciosFiltrados).map(([dia, exercicios]) => (
              <div key={dia} className="mb-8">
                <h4 className="bg-fitness-primary/10 text-fitness-primary font-semibold p-2 rounded-md mb-4">
                  {dia}
                </h4>
                {Object.entries(agruparPorGrupoMuscular(exercicios)).map(([grupo, exerciciosGrupo]) => (
                  <div key={grupo} className="mb-6">
                    <h5 className="text-gray-800 font-medium mb-3 border-l-4 border-fitness-primary pl-2">
                      {grupo}
                    </h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercício</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carga (kg)</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Séries</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repetições</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estratégia</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vídeo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {exerciciosGrupo.map((exercicio, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3">{exercicio.nomeExercicio}</td>
                              <td className="px-4 py-3">{exercicio.cargaIdeal}</td>
                              <td className="px-4 py-3">{exercicio.series}</td>
                              <td className="px-4 py-3">{exercicio.repeticoes}</td>
                              <td className="px-4 py-3">{exercicio.estrategia || "-"}</td>
                              <td className="px-4 py-3">
                                {exercicio.videoUrl ? (
                                  <button
                                    onClick={() => setActiveVideoUrl(exercicio.videoUrl || null)}
                                    className="text-fitness-primary hover:text-fitness-primary/80 flex items-center"
                                  >
                                    <Youtube className="h-4 w-4 mr-1" />
                                    Ver vídeo
                                  </button>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {activeVideoUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Vídeo de Demonstração</h3>
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            {renderYoutubeEmbed(activeVideoUrl)}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarFichaTreino;
