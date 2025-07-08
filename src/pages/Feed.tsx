
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { criarPost, listarPostsFeed, FeedPost as FeedPostType } from "@/services/feedService";
import CriarPost from "@/components/feed/CriarPost";
import FeedPost from "@/components/feed/FeedPost";
import LoadingSpinner from "@/components/LoadingSpinner";

const Feed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [criandoPost, setCriandoPost] = useState(false);

  useEffect(() => {
    carregarPosts();
  }, [user]);

  const carregarPosts = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const postsData = await listarPostsFeed(user.id);
      setPosts(postsData);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      toast.error("Erro ao carregar posts do feed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCriarPost = async (conteudo: string, tipo: "texto" | "imagem" | "video", urlMidia?: string) => {
    if (!user?.id) return;
    
    try {
      setCriandoPost(true);
      await criarPost({
        user_id: user.id,
        professor_id: user.id, // Assumindo que o usuário é professor por enquanto
        conteudo,
        tipo,
        url_midia: urlMidia
      });
      
      toast.success("Post publicado com sucesso!");
      carregarPosts();
    } catch (error) {
      console.error("Erro ao criar post:", error);
      toast.error("Erro ao publicar post. Tente novamente.");
    } finally {
      setCriandoPost(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Feed</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compartilhe suas conquistas e acompanhe a evolução da comunidade
        </p>
      </div>
      
      <CriarPost onCriarPost={handleCriarPost} isLoading={criandoPost} />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum post encontrado. Seja o primeiro a publicar!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <FeedPost
              key={post.id}
              id={post.id}
              autorNome={post.autor_nome || "Usuário"}
              conteudo={post.conteudo}
              urlMidia={post.url_midia}
              tipo={post.tipo}
              createdAt={post.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
