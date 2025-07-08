
import React, { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FeedPostProps {
  id: string;
  autorNome: string;
  conteudo: string;
  urlMidia?: string;
  tipo: string;
  createdAt: string;
  onCurtir?: (postId: string) => void;
  onComentar?: (postId: string) => void;
  onCompartilhar?: (postId: string) => void;
}

const FeedPost: React.FC<FeedPostProps> = ({
  id,
  autorNome,
  conteudo,
  urlMidia,
  tipo,
  createdAt,
  onCurtir,
  onComentar,
  onCompartilhar
}) => {
  const [curtido, setCurtido] = useState(false);
  const [curtidas, setCurtidas] = useState(0);

  const handleCurtir = () => {
    setCurtido(!curtido);
    setCurtidas(prev => curtido ? prev - 1 : prev + 1);
    onCurtir?.(id);
  };

  const tempoAtras = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 mb-4">
      <div className="flex items-start space-x-2 md:space-x-3">
        <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
          <AvatarFallback className="bg-fitness-primary text-white text-xs md:text-sm">
            {autorNome.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {autorNome}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {tempoAtras}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-2">
            <p className="text-sm md:text-base text-gray-900 dark:text-white whitespace-pre-wrap break-words">
              {conteudo}
            </p>
            
            {urlMidia && (
              <div className="mt-3">
                {tipo === 'imagem' ? (
                  <img
                    src={urlMidia}
                    alt="Post media"
                    className="rounded-lg max-w-full h-auto object-cover"
                    loading="lazy"
                  />
                ) : tipo === 'video' ? (
                  <video
                    src={urlMidia}
                    controls
                    className="rounded-lg max-w-full h-auto"
                    preload="metadata"
                  />
                ) : null}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3 md:mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCurtir}
                className={`flex items-center space-x-1 p-1 md:p-2 ${
                  curtido ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Heart className={`h-3 w-3 md:h-4 md:w-4 ${curtido ? 'fill-current' : ''}`} />
                <span className="text-xs">{curtidas}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComentar?.(id)}
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 p-1 md:p-2"
              >
                <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs hidden sm:inline">Comentar</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCompartilhar?.(id)}
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 p-1 md:p-2"
              >
                <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs hidden sm:inline">Compartilhar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;
