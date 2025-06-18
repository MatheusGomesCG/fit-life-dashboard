
-- Tabela para armazenar as avaliações físicas
CREATE TABLE public.avaliacoes_fisicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno_id UUID NOT NULL,
  professor_id UUID NOT NULL,
  data_avaliacao DATE NOT NULL DEFAULT CURRENT_DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para armazenar os dados específicos de cada estratégia
CREATE TABLE public.dados_avaliacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  avaliacao_id UUID NOT NULL REFERENCES public.avaliacoes_fisicas(id) ON DELETE CASCADE,
  grupo_estrategia TEXT NOT NULL,
  estrategia TEXT NOT NULL,
  valor NUMERIC,
  valor_texto TEXT,
  unidade TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_avaliacoes_fisicas_aluno_id ON public.avaliacoes_fisicas(aluno_id);
CREATE INDEX idx_avaliacoes_fisicas_professor_id ON public.avaliacoes_fisicas(professor_id);
CREATE INDEX idx_avaliacoes_fisicas_data ON public.avaliacoes_fisicas(data_avaliacao);
CREATE INDEX idx_dados_avaliacao_avaliacao_id ON public.dados_avaliacao(avaliacao_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_avaliacoes_fisicas_updated_at
  BEFORE UPDATE ON public.avaliacoes_fisicas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.avaliacoes_fisicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dados_avaliacao ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para avaliacoes_fisicas
CREATE POLICY "Professores podem ver suas próprias avaliações" 
  ON public.avaliacoes_fisicas 
  FOR SELECT 
  USING (professor_id = auth.uid());

CREATE POLICY "Professores podem criar avaliações" 
  ON public.avaliacoes_fisicas 
  FOR INSERT 
  WITH CHECK (professor_id = auth.uid());

CREATE POLICY "Professores podem atualizar suas próprias avaliações" 
  ON public.avaliacoes_fisicas 
  FOR UPDATE 
  USING (professor_id = auth.uid());

CREATE POLICY "Professores podem deletar suas próprias avaliações" 
  ON public.avaliacoes_fisicas 
  FOR DELETE 
  USING (professor_id = auth.uid());

-- Políticas RLS para dados_avaliacao
CREATE POLICY "Dados de avaliação visíveis para o professor responsável" 
  ON public.dados_avaliacao 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.avaliacoes_fisicas af 
    WHERE af.id = avaliacao_id AND af.professor_id = auth.uid()
  ));

CREATE POLICY "Professor pode inserir dados de suas avaliações" 
  ON public.dados_avaliacao 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.avaliacoes_fisicas af 
    WHERE af.id = avaliacao_id AND af.professor_id = auth.uid()
  ));

CREATE POLICY "Professor pode atualizar dados de suas avaliações" 
  ON public.dados_avaliacao 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.avaliacoes_fisicas af 
    WHERE af.id = avaliacao_id AND af.professor_id = auth.uid()
  ));

CREATE POLICY "Professor pode deletar dados de suas avaliações" 
  ON public.dados_avaliacao 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.avaliacoes_fisicas af 
    WHERE af.id = avaliacao_id AND af.professor_id = auth.uid()
  ));

-- View para facilitar consultas completas
CREATE OR REPLACE VIEW public.avaliacoes_completas AS
SELECT 
  af.id,
  af.aluno_id,
  af.professor_id,
  af.data_avaliacao,
  af.observacoes,
  af.created_at,
  af.updated_at,
  ap.nome as aluno_nome,
  ap.email as aluno_email,
  COALESCE(
    json_agg(
      json_build_object(
        'grupo_estrategia', da.grupo_estrategia,
        'estrategia', da.estrategia,
        'valor', da.valor,
        'valor_texto', da.valor_texto,
        'unidade', da.unidade
      )
    ) FILTER (WHERE da.id IS NOT NULL), 
    '[]'::json
  ) as dados
FROM public.avaliacoes_fisicas af
LEFT JOIN public.aluno_profiles ap ON af.aluno_id = ap.user_id
LEFT JOIN public.dados_avaliacao da ON af.id = da.avaliacao_id
GROUP BY af.id, af.aluno_id, af.professor_id, af.data_avaliacao, af.observacoes, af.created_at, af.updated_at, ap.nome, ap.email;
