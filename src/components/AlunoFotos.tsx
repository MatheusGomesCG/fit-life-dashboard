
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, Upload } from "lucide-react";
import { FotoAluno, adicionarFotoAluno, removerFotoAluno } from "@/services/alunosService";
import { format } from "date-fns";

interface AlunoFotosProps {
  alunoId: string;
  fotos: FotoAluno[];
  onUpdate: (fotos: FotoAluno[]) => void;
}

const AlunoFotos: React.FC<AlunoFotosProps> = ({ alunoId, fotos, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 4 photos
    if (fotos.length >= 4) {
      toast.error("Limite de 4 fotos atingido. Remova uma foto antes de adicionar outra.");
      return;
    }

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

      // Add the photo to the student's record with correct properties
      const novaFoto = await adicionarFotoAluno(alunoId, {
        url: imageUrl,
        tipo: "frente",
        descricao: `Foto ${fotos.length + 1}`,
        data_upload: new Date().toISOString(),
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Fotos do Aluno</h3>
        <div>
          <input
            type="file"
            id="foto-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading || fotos.length >= 4}
          />
          <label htmlFor="foto-upload">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading || fotos.length >= 4}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {fotos.map((foto) => (
          <div key={foto.id} className="border border-gray-200 rounded-md overflow-hidden">
            <div className="relative pt-[100%]">
              <img 
                src={foto.url} 
                alt={foto.descricao || "Foto do aluno"} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-2 bg-gray-50 flex justify-between items-center">
              <span className="text-xs">
                {format(new Date(foto.data || foto.data_upload), "dd/MM/yyyy")}
              </span>
              <button
                onClick={() => foto.id && handleRemovePhoto(foto.id)}
                className="text-red-500 hover:text-red-700"
                title="Remover foto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {Array.from({ length: Math.max(0, 4 - fotos.length) }).map((_, index) => (
          <div 
            key={`placeholder-${index}`}
            className="border border-dashed border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-50"
            style={{ paddingTop: "100%" }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Upload className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500">
        Adicione até 4 fotos do aluno para acompanhamento de evolução. 
        As fotos serão anexadas à ficha de treino com suas respectivas datas.
      </p>
    </div>
  );
};

export default AlunoFotos;
