
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, ChevronRight, Calendar, Image, Trash2 } from "lucide-react";
import { FotoAluno, adicionarFotoAluno, removerFotoAluno } from "@/services/alunosService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AlunoFotosTrackingProps {
  alunoId: string;
  fotos: FotoAluno[];
  onUpdate: (fotos: FotoAluno[]) => void;
}

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const AlunoFotosTracking: React.FC<AlunoFotosTrackingProps> = ({ alunoId, fotos, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [activeMonth, setActiveMonth] = useState(currentMonth);
  const [activeYear, setActiveYear] = useState(currentYear);
  
  // Group photos by month and year
  const groupPhotosByMonth = () => {
    const photoGroups: Record<string, FotoAluno[]> = {};
    
    fotos.forEach(foto => {
      const photoDate = new Date(foto.data || foto.data_upload);
      const key = `${photoDate.getFullYear()}-${photoDate.getMonth()}`;
      
      if (!photoGroups[key]) {
        photoGroups[key] = [];
      }
      
      photoGroups[key].push(foto);
    });
    
    return photoGroups;
  };
  
  const photosByMonth = groupPhotosByMonth();
  const currentMonthKey = `${activeYear}-${activeMonth}`;
  const currentMonthPhotos = photosByMonth[currentMonthKey] || [];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (activeMonth === 0) {
        setActiveMonth(11);
        setActiveYear(activeYear - 1);
      } else {
        setActiveMonth(activeMonth - 1);
      }
    } else {
      if (activeMonth === 11) {
        setActiveMonth(0);
        setActiveYear(activeYear + 1);
      } else {
        setActiveMonth(activeMonth + 1);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem é muito grande. O tamanho máximo é 5MB.");
      return;
    }

    try {
      setIsUploading(true);

      // In a real application, you would upload the file to a server
      // For our mock implementation, we'll use a local URL
      const imageUrl = URL.createObjectURL(file);

      // Create a date for the current month view
      const photoDate = new Date(activeYear, activeMonth, 15); // middle of the month

      // Add the photo to the student's record with correct properties
      const novaFoto = await adicionarFotoAluno(alunoId, {
        url: imageUrl,
        tipo: "frente",
        descricao: `${monthNames[activeMonth]} ${activeYear}`,
        data_upload: photoDate.toISOString(),
        observacoes: ""
      });

      // Update the local state
      const fotosAtualizadas = [...fotos, novaFoto];
      onUpdate(fotosAtualizadas);

      toast.success("Foto adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      toast.error("Erro ao fazer upload da foto. Tente novamente.");
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = "";
    }
  };

  const handleRemovePhoto = async (fotoId: string) => {
    try {
      await removerFotoAluno(fotoId);
      
      // Update the local state
      const fotosAtualizadas = fotos.filter(foto => foto.id !== fotoId);
      onUpdate(fotosAtualizadas);
      
      toast.success("Foto removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover foto:", error);
      toast.error("Erro ao remover foto. Tente novamente.");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-medium text-gray-900">
            Acompanhamento Mensal de Fotos
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Acompanhe o progresso do aluno mês a mês através de fotos
          </p>
        </div>
        <div>
          <input
            type="file"
            id="foto-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label htmlFor="foto-upload">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              className="flex items-center gap-2 cursor-pointer w-full sm:w-auto"
              asChild
            >
              <span>
                {isUploading ? "Enviando..." : (
                  <>
                    <Camera className="h-4 w-4" />
                    <span>Adicionar Foto</span>
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Navegação de mês responsiva */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigateMonth('prev')}
          className="flex items-center text-gray-500 w-full sm:w-auto justify-center sm:justify-start"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Mês Anterior
        </Button>
        
        <div className="flex items-center justify-center gap-2 font-medium text-center">
          <Calendar className="h-4 w-4" />
          <span className="text-sm sm:text-base">
            {monthNames[activeMonth]} {activeYear}
          </span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigateMonth('next')}
          className="flex items-center text-gray-500 w-full sm:w-auto justify-center sm:justify-start"
        >
          Próximo Mês
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Grid de fotos responsivo */}
      {currentMonthPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {currentMonthPhotos.map(foto => (
            <Card key={foto.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square">
                <img 
                  src={foto.url} 
                  alt={foto.descricao || "Foto do aluno"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {format(new Date(foto.data || foto.data_upload), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                    {foto.observacoes && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {foto.observacoes}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => foto.id && handleRemovePhoto(foto.id)}
                    className="text-red-600 hover:text-red-700 shrink-0 p-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 sm:p-12 flex flex-col items-center justify-center text-center">
          <Image className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma foto para {monthNames[activeMonth]} {activeYear}
          </h3>
          <p className="text-gray-500 text-sm mb-4 max-w-md">
            Adicione fotos para acompanhar o progresso do aluno neste mês
          </p>
          <label htmlFor="foto-upload-empty">
            <input
              type="file"
              id="foto-upload-empty"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              className="cursor-pointer"
              asChild
            >
              <span>
                <Camera className="h-4 w-4 mr-2" />
                Adicionar primeira foto
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
};

export default AlunoFotosTracking;
