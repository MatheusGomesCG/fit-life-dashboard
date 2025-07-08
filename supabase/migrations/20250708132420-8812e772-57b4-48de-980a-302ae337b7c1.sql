
-- Create table for exercise check-ins
CREATE TABLE public.checkins_exercicios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for workout feedback
CREATE TABLE public.feedbacks_treino (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('geral', 'exercicio')),
  mensagem TEXT NOT NULL,
  exercise_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for weight progression tracking
CREATE TABLE public.registros_carga (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL,
  peso NUMERIC NOT NULL,
  repeticoes INTEGER NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for social feed posts
CREATE TABLE public.feed_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  professor_id UUID NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('texto', 'imagem', 'video')),
  conteudo TEXT NOT NULL,
  url_midia TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for feed comments
CREATE TABLE public.feed_comentarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comentario TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.checkins_exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_carga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_comentarios ENABLE ROW LEVEL SECURITY;

-- RLS policies for checkins_exercicios
CREATE POLICY "Users can view their own checkins"
  ON public.checkins_exercicios
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkins"
  ON public.checkins_exercicios
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for feedbacks_treino
CREATE POLICY "Users can view their own feedback"
  ON public.feedbacks_treino
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback"
  ON public.feedbacks_treino
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Professors can view feedback from their students"
  ON public.feedbacks_treino
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.aluno_profiles ap 
    WHERE ap.user_id = feedbacks_treino.user_id 
    AND ap.professor_id = auth.uid()
  ));

-- RLS policies for registros_carga
CREATE POLICY "Users can view their own weight records"
  ON public.registros_carga
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weight records"
  ON public.registros_carga
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight records"
  ON public.registros_carga
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for feed_posts
CREATE POLICY "Users can view posts from their professor"
  ON public.feed_posts
  FOR SELECT
  USING (
    auth.uid() = user_id OR 
    auth.uid() = professor_id OR
    EXISTS (
      SELECT 1 FROM public.aluno_profiles ap 
      WHERE ap.user_id = auth.uid() 
      AND ap.professor_id = feed_posts.professor_id
    )
  );

CREATE POLICY "Users can create their own posts"
  ON public.feed_posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for feed_comentarios
CREATE POLICY "Users can view comments on accessible posts"
  ON public.feed_comentarios
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.feed_posts fp 
    WHERE fp.id = feed_comentarios.post_id
    AND (
      auth.uid() = fp.user_id OR 
      auth.uid() = fp.professor_id OR
      EXISTS (
        SELECT 1 FROM public.aluno_profiles ap 
        WHERE ap.user_id = auth.uid() 
        AND ap.professor_id = fp.professor_id
      )
    )
  ));

CREATE POLICY "Users can create comments on accessible posts"
  ON public.feed_comentarios
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.feed_posts fp 
      WHERE fp.id = feed_comentarios.post_id
      AND (
        auth.uid() = fp.user_id OR 
        auth.uid() = fp.professor_id OR
        EXISTS (
          SELECT 1 FROM public.aluno_profiles ap 
          WHERE ap.user_id = auth.uid() 
          AND ap.professor_id = fp.professor_id
        )
      )
    )
  );

-- Create storage bucket for feed media
INSERT INTO storage.buckets (id, name, public) VALUES ('feed-midia', 'feed-midia', true);

-- Storage policies for feed media
CREATE POLICY "Anyone can view feed media" ON storage.objects
  FOR SELECT USING (bucket_id = 'feed-midia');

CREATE POLICY "Authenticated users can upload feed media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'feed-midia' AND auth.role() = 'authenticated');
