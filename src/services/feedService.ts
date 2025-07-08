
import { supabase } from "@/integrations/supabase/client";

export interface PostFeed {
  id?: string;
  user_id: string;
  professor_id: string;
  tipo: "texto" | "imagem" | "video";
  conteudo: string;
  url_midia?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ComentarioFeed {
  id?: string;
  post_id: string;
  user_id: string;
  comentario: string;
  created_at?: string;
}

export const criarPost = async (post: Omit<PostFeed, "id" | "created_at" | "updated_at">): Promise<PostFeed> => {
  try {
    const { data, error } = await supabase
      .from('feed_posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data as PostFeed;
  } catch (error) {
    console.error("Erro ao criar post:", error);
    throw error;
  }
};

export const buscarFeedProfessor = async (professorId: string): Promise<PostFeed[]> => {
  try {
    const { data, error } = await supabase
      .from('feed_posts')
      .select(`
        *,
        aluno_profiles!inner(nome),
        feed_comentarios(
          id,
          comentario,
          created_at,
          aluno_profiles!inner(nome)
        )
      `)
      .eq('professor_id', professorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar feed:", error);
    throw error;
  }
};

export const adicionarComentario = async (comentario: Omit<ComentarioFeed, "id" | "created_at">): Promise<ComentarioFeed> => {
  try {
    const { data, error } = await supabase
      .from('feed_comentarios')
      .insert(comentario)
      .select()
      .single();

    if (error) throw error;
    return data as ComentarioFeed;
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    throw error;
  }
};

export const uploadMidiaFeed = async (file: File, userId: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('feed-midia')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('feed-midia')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    throw error;
  }
};
