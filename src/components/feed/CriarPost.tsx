
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Image, Video, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CriarPostProps {
  onCriarPost: (conteudo: string, tipo: string, urlMidia?: string) => void;
  isLoading?: boolean;
}

const CriarPost: React.FC<CriarPostProps> = ({ onCriarPost, isLoading }) => {
  const { user } = useAuth();
  const [conteudo, setConteudo] = useState("");
  const [urlMidia, setUrlMidia] = useState("");
  const [tipoMidia, setTipoMidia] = useState<'texto' | 'imagem' | 'video'>('texto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!conteudo.trim()) return;
    
    onCriarPost(conteudo, tipoMidia, urlMidia || undefined);
    setConteudo("");
    setUrlMidia("");
    setTipoMidia('texto');
  };

  // Simular nome do usuário (será substituído por dados reais do perfil)
  const nomeUsuario = user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 mb-6">
      <div className="flex items-start space-x-2 md:space-x-3">
        <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
          <AvatarFallback className="bg-fitness-primary text-white text-xs md:text-sm">
            {nomeUsuario.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <Textarea
            placeholder="Compartilhe suas conquistas, dicas ou motivação..."
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="min-h-[60px] md:min-h-[80px] resize-none border-0 bg-gray-50 dark:bg-gray-700 focus:ring-0 focus:border-0 text-sm md:text-base"
          />
          
          {tipoMidia !== 'texto' && (
            <div className="mt-3">
              <input
                type="url"
                placeholder={`URL da ${tipoMidia}...`}
                value={urlMidia}
                onChange={(e) => setUrlMidia(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-fitness-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 md:mt-4 gap-3 sm:gap-0">
            <div className="flex items-center space-x-1 md:space-x-2 flex-wrap gap-1 md:gap-0">
              <Button
                type="button"
                variant={tipoMidia === 'imagem' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTipoMidia(tipoMidia === 'imagem' ? 'texto' : 'imagem')}
                className="text-xs md:text-sm"
              >
                <Image className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span className="hidden sm:inline">Imagem</span>
                <span className="sm:hidden">Img</span>
              </Button>
              
              <Button
                type="button"
                variant={tipoMidia === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTipoMidia(tipoMidia === 'video' ? 'texto' : 'video')}
                className="text-xs md:text-sm"
              >
                <Video className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span className="hidden sm:inline">Vídeo</span>
                <span className="sm:hidden">Vid</span>
              </Button>
            </div>
            
            <Button
              type="submit"
              disabled={!conteudo.trim() || isLoading}
              className="bg-fitness-primary hover:bg-fitness-primary/90 text-xs md:text-sm w-full sm:w-auto"
            >
              <Send className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              {isLoading ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriarPost;
