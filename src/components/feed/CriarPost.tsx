
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-fitness-primary text-white">
            {nomeUsuario.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <form onSubmit={handleSubmit} className="flex-1">
          <Textarea
            placeholder="Compartilhe suas conquistas, dicas ou motivação..."
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="min-h-[80px] resize-none border-0 bg-gray-50 dark:bg-gray-700 focus:ring-0 focus:border-0"
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
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant={tipoMidia === 'imagem' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTipoMidia(tipoMidia === 'imagem' ? 'texto' : 'imagem')}
              >
                <Image className="h-4 w-4 mr-1" />
                Imagem
              </Button>
              
              <Button
                type="button"
                variant={tipoMidia === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTipoMidia(tipoMidia === 'video' ? 'texto' : 'video')}
              >
                <Video className="h-4 w-4 mr-1" />
                Vídeo
              </Button>
            </div>
            
            <Button
              type="submit"
              disabled={!conteudo.trim() || isLoading}
              className="bg-fitness-primary hover:bg-fitness-primary/90"
            >
              <Send className="h-4 w-4 mr-1" />
              Publicar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriarPost;
