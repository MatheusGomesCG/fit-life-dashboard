
-- Criar tabela de exercícios cadastrados pelos professores
CREATE TABLE public.exercicios_cadastrados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professor_id UUID NOT NULL,
  nome TEXT NOT NULL,
  grupo_muscular TEXT NOT NULL,
  equipamento TEXT,
  instrucoes TEXT,
  video_url TEXT,
  exercicio_similar_id UUID REFERENCES public.exercicios_cadastrados(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de técnicas de treinamento
CREATE TABLE public.tecnicas_treinamento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir técnicas de treinamento padrão
INSERT INTO public.tecnicas_treinamento (nome, descricao) VALUES
  ('Normal', 'Execução tradicional do exercício'),
  ('Biset', 'Dois exercícios executados em sequência sem descanso'),
  ('Triset', 'Três exercícios executados em sequência sem descanso'),
  ('Rest-Pause', 'Execução com pausas breves entre repetições'),
  ('Drop Set', 'Redução progressiva da carga durante a série'),
  ('Super Set', 'Dois exercícios para grupos musculares opostos'),
  ('Giant Set', 'Quatro ou mais exercícios em sequência'),
  ('Cluster Set', 'Séries divididas em clusters com descanso interno');

-- Criar tabela para relacionar exercícios com técnicas
CREATE TABLE public.exercicio_tecnicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exercicio_treino_id UUID NOT NULL REFERENCES public.exercicios_treino(id) ON DELETE CASCADE,
  tecnica_id UUID NOT NULL REFERENCES public.tecnicas_treinamento(id),
  exercicio_relacionado_id UUID REFERENCES public.exercicios_treino(id),
  ordem INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de progressão de carga controlada pelo professor
CREATE TABLE public.progressao_professor (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno_id UUID NOT NULL,
  exercise_id UUID NOT NULL,
  professor_id UUID NOT NULL,
  carga_anterior NUMERIC NOT NULL,
  carga_nova NUMERIC NOT NULL,
  data_progressao DATE NOT NULL DEFAULT CURRENT_DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Atualizar tabela de exercícios_treino para incluir referência aos exercícios cadastrados
ALTER TABLE public.exercicios_treino 
ADD COLUMN exercicio_cadastrado_id UUID REFERENCES public.exercicios_cadastrados(id),
ADD COLUMN equipamento TEXT,
ADD COLUMN instrucoes TEXT;

-- Adicionar RLS para exercícios cadastrados
ALTER TABLE public.exercicios_cadastrados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professores podem gerenciar seus exercícios cadastrados"
  ON public.exercicios_cadastrados
  FOR ALL
  USING (professor_id = auth.uid());

-- Adicionar RLS para técnicas de treinamento (leitura pública)
ALTER TABLE public.tecnicas_treinamento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver técnicas de treinamento"
  ON public.tecnicas_treinamento
  FOR SELECT
  USING (true);

-- Adicionar RLS para exercicio_tecnicas
ALTER TABLE public.exercicio_tecnicas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso através do exercício de treino"
  ON public.exercicio_tecnicas
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM exercicios_treino et
    JOIN fichas_treino ft ON et.ficha_treino_id = ft.id
    WHERE et.id = exercicio_tecnicas.exercicio_treino_id
    AND (ft.professor_id = auth.uid() OR ft.aluno_id = auth.uid())
  ));

-- Adicionar RLS para progressão do professor
ALTER TABLE public.progressao_professor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professores podem gerenciar progressão de seus alunos"
  ON public.progressao_professor
  FOR ALL
  USING (professor_id = auth.uid() OR aluno_id = auth.uid());

-- Criar índices para performance
CREATE INDEX idx_exercicios_cadastrados_professor ON public.exercicios_cadastrados(professor_id);
CREATE INDEX idx_exercicio_tecnicas_exercicio ON public.exercicio_tecnicas(exercicio_treino_id);
CREATE INDEX idx_progressao_professor_aluno ON public.progressao_professor(aluno_id, exercise_id);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_exercicios_cadastrados_updated_at 
  BEFORE UPDATE ON public.exercicios_cadastrados 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
