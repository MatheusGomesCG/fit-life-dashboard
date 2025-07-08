import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  exercicioNome: string;
}

const YouTubeModal: React.FC<YouTubeModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  exercicioNome,
}) => {
  // Extrair o ID do vídeo do YouTube
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return null;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900 truncate">
              {exercicioNome}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="px-4 pb-4">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={embedUrl}
              title={exercicioNome}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YouTubeModal;