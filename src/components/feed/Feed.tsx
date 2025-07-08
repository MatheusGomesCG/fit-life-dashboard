
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, Send, Upload, Image, Video, Type } from "lucide-react";
import { toast } from "sonner";
import { criarPost, buscarFeedProfessor, adicionarComentario, uploadMidiaFeed } from "@/services/feedService";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";

interface FeedProps {
  professorId: string;
}

const Feed: React.FC<FeedProps> = ({ professorId }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoPost, setNovoPost] = useState("");
  const [tipoPost, setTipoPost] = useState<"texto" | "imagem" | "video">("texto");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviandoPost, setEnviandoPost] = useState(false);
  const [comentarios, setComentarios] = useState<{[key: string]: string}>({});

  useEffect(() => {
    carregarFeed();
  }, [professorId]);

  const carregarFeed = async () => {
    try {
      setLoading(true);
      const feedData = await buscarFeedProfessor(professorId);
      setPosts(feedData);
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
      toast.error("Erro ao carregar o feed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !novoPost.trim()) {
      toast.error("Por favor, escreva algo para publicar.");
      return;
    }

    setEnviandoPost(true);
    try {
      let urlMidia = undefined;
      
      if (arquivo && (tipoPost === "imagem" || tipoPost === "video")) {
        urlMidia = await uploadMidiaFeed(arquivo, user.id);
      }

      await criarPost({
        user_id: user.id,
        professor_id: professorId,
        tipo: tipoPost,
        conteudo: novoPost.trim(),
        url_midia: urlMidia
      });

      toast.success("Post publicado com sucesso!");
      setNovoPost("");
      setArquivo(null);
      setTipoPost("texto");
      carregarFeed();
    } catch (error) {
      console.error("Erro ao publicar post:", error);
      toast.error("Erro ao publicar. Tente novamente.");
    } finally {
      setEnviandoPost(false);
    }
  };

  const handleComentario = async (postId: string) => {
    const comentario = comentarios[postId];
    if (!user?.id || !comentario?.trim()) return;

    try {
      await adicionarComentario({
        post_id: postId,
        user_id: user.id,
        comentario: comentario.trim()
      });

      setComentarios(prev => ({ ...prev, [postId]: "" }));
      carregarFeed();
      toast.success("Comentário adicionado!");
    } catch (error) {
      console.error("Erro ao comentar:", error);
      toast.error("Erro ao comentar.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulário para novo post */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Compartilhar</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div className="flex gap-2">
              <Select value={tipoPost} onValueChange={(value: "texto" | "imagem" | "video") => setTipoPost(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="texto">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Texto
                    </div>
                  </SelectItem>
                  <SelectItem value="imagem">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Imagem
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Vídeo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {(tipoPost === "imagem" || tipoPost === "video") && (
                <div className="flex-1">
                  <Input
                    type="file"
                    accept={tipoPost === "imagem" ? "image/*" : "video/*"}
                    onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                  />
                </div>
              )}
            </div>

            <Textarea
              value={novoPost}
              onChange={(e) => setNovoPost(e.target.value)}
              placeholder="Compartilhe seu progresso, conquistas ou dicas..."
              rows={3}
            />

            <Button
              type="submit"
              disabled={enviandoPost || !novoPost.trim()}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {enviandoPost ? "Publicando..." : "Publicar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              <p>Nenhuma publicação ainda.</p>
              <p className="text-sm">Seja o primeiro a compartilhar algo!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header do post */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{post.aluno_profiles?.nome}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(post.created_at), "dd/MM/yyyy 'às' HH:mm")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      {post.tipo === "imagem" && <Image className="w-4 h-4" />}
                      {post.tipo === "video" && <Video className="w-4 h-4" />}
                      {post.tipo === "texto" && <Type className="w-4 h-4" />}
                      {post.tipo}
                    </div>
                  </div>

                  {/* Conteúdo do post */}
                  <p className="text-gray-800">{post.conteudo}</p>

                  {/* Mídia */}
                  {post.url_midia && (
                    <div className="mt-3">
                      {post.tipo === "imagem" && (
                        <img 
                          src={post.url_midia} 
                          alt="Post" 
                          className="max-w-full h-auto rounded-lg"
                        />
                      )}
                      {post.tipo === "video" && (
                        <video 
                          src={post.url_midia} 
                          controls 
                          className="max-w-full h-auto rounded-lg"
                        />
                      )}
                    </div>
                  )}

                  {/* Comentários */}
                  {post.feed_comentarios?.length > 0 && (
                    <div className="border-t pt-4 space-y-2">
                      <h4 className="font-medium text-sm">Comentários:</h4>
                      {post.feed_comentarios.map((comentario: any) => (
                        <div key={comentario.id} className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-sm">{comentario.aluno_profiles?.nome}</p>
                          <p className="text-sm text-gray-700">{comentario.comentario}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(comentario.created_at), "dd/MM/yyyy 'às' HH:mm")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Adicionar comentário */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Input
                      value={comentarios[post.id] || ""}
                      onChange={(e) => setComentarios(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Escreva um comentário..."
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleComentario(post.id)}
                      disabled={!comentarios[post.id]?.trim()}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
