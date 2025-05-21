
import React, { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { enviarComprovantePagamento } from "@/services/pagamentosService";

interface EnviarComprovanteProps {
  pagamentoId: string;
  onSuccess?: () => void;
}

const EnviarComprovante: React.FC<EnviarComprovanteProps> = ({ pagamentoId, onSuccess }) => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificando se o arquivo é uma imagem ou PDF
      if (!file.type.match('image.*') && !file.type.match('application/pdf')) {
        toast.error("Por favor, selecione uma imagem ou um arquivo PDF.");
        return;
      }
      
      // Verificando tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
        return;
      }
      
      setArquivo(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!arquivo) {
      toast.error("Por favor, selecione um arquivo para enviar.");
      return;
    }
    
    try {
      setIsUploading(true);
      await enviarComprovantePagamento(pagamentoId, arquivo);
      toast.success("Comprovante enviado com sucesso!");
      
      // Limpar o formulário
      setArquivo(null);
      
      // Callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao enviar comprovante:", error);
      toast.error("Erro ao enviar o comprovante. Por favor, tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="comprovante">Anexar Comprovante</Label>
        <div className="mt-1 flex items-center">
          <label 
            htmlFor="comprovante" 
            className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-4 w-4 text-gray-600" />
            <span>{arquivo ? arquivo.name : "Selecionar arquivo"}</span>
          </label>
          <Input
            id="comprovante"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Formatos aceitos: imagens (JPG, PNG) e PDF. Tamanho máximo: 5MB.
        </p>
      </div>
      <Button type="submit" disabled={!arquivo || isUploading} className="w-full">
        {isUploading ? "Enviando..." : "Enviar Comprovante"}
      </Button>
    </form>
  );
};

export default EnviarComprovante;
