
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, ChevronRight, Calendar, Image } from "lucide-react";
import { FotoAluno, adicionarFotoAluno, removerFotoAluno } from "@/services/alunosService";
import { format } from "date-fns";

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
      const photoDate = new Date(foto.data);
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

      // Add the photo to the student's record
      const novaFoto = await adicionarFotoAluno(alunoId, {
        url: imageUrl,
        descricao: `${monthNames[activeMonth]} ${activeYear}`,
        data: photoDate.toISOString() // Use the current month view date
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
      await removerFotoAluno(alunoId, fotoId);
      
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Acompanhamento Mensal de Fotos
          </CardTitle>
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
                className="flex items-center gap-2 cursor-pointer"
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
        <CardDescription>
          Acompanhe o progresso do aluno mês a mês através de fotos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateMonth('prev')}
            className="flex items-center text-gray-500"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="h-4 w-4" />
            {monthNames[activeMonth]} {activeYear}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateMonth('next')}
            className="flex items-center text-gray-500"
          >
            Próximo
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {currentMonthPhotos.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {currentMonthPhotos.map(foto => (
              <div key={foto.id} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="relative pt-[75%]">
                  <img 
                    src={foto.url} 
                    alt={foto.descricao || "Foto do aluno"} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {format(new Date(foto.data), "dd/MM/yyyy")}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => foto.id && handleRemovePhoto(foto.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400">
            <Image className="h-12 w-12 mb-2" />
            <p>Nenhuma foto para {monthNames[activeMonth]} {activeYear}</p>
            <p className="text-sm mt-1">Adicione fotos para acompanhar o progresso</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlunoFotosTracking;
