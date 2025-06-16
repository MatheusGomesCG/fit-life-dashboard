
-- Criar tabela para histórico de medidas corporais
CREATE TABLE public.historico_medidas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES public.aluno_profiles(user_id) ON DELETE CASCADE,
  peso NUMERIC,
  altura NUMERIC,
  imc NUMERIC,
  percentual_gordura NUMERIC,
  dobras_cutaneas JSONB,
  observacoes TEXT,
  data_medicao DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar campos faltantes na tabela aluno_profiles para dados completos
ALTER TABLE public.aluno_profiles 
ADD COLUMN IF NOT EXISTS data_nascimento DATE,
ADD COLUMN IF NOT EXISTS genero TEXT CHECK (genero IN ('masculino', 'feminino', 'outro')),
ADD COLUMN IF NOT EXISTS endereco TEXT,
ADD COLUMN IF NOT EXISTS observacoes TEXT,
ADD COLUMN IF NOT EXISTS valor_mensalidade NUMERIC,
ADD COLUMN IF NOT EXISTS data_vencimento DATE,
ADD COLUMN IF NOT EXISTS dobras_cutaneas JSONB,
ADD COLUMN IF NOT EXISTS imc NUMERIC,
ADD COLUMN IF NOT EXISTS percentual_gordura NUMERIC;

-- Habilitar RLS na tabela de histórico
ALTER TABLE public.historico_medidas ENABLE ROW LEVEL SECURITY;

-- Política para que professores vejam apenas histórico de seus alunos
CREATE POLICY "Professores podem ver histórico de seus alunos" 
  ON public.historico_medidas 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.aluno_profiles ap 
      WHERE ap.user_id = historico_medidas.aluno_id 
      AND ap.professor_id = auth.uid()
    )
  );

-- Política para que professores possam inserir histórico de seus alunos
CREATE POLICY "Professores podem inserir histórico de seus alunos" 
  ON public.historico_medidas 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.aluno_profiles ap 
      WHERE ap.user_id = historico_medidas.aluno_id 
      AND ap.professor_id = auth.uid()
    )
  );

-- Política para que professores possam atualizar histórico de seus alunos
CREATE POLICY "Professores podem atualizar histórico de seus alunos" 
  ON public.historico_medidas 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.aluno_profiles ap 
      WHERE ap.user_id = historico_medidas.aluno_id 
      AND ap.professor_id = auth.uid()
    )
  );

-- Política para que professores possam deletar histórico de seus alunos
CREATE POLICY "Professores podem deletar histórico de seus alunos" 
  ON public.historico_medidas 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.aluno_profiles ap 
      WHERE ap.user_id = historico_medidas.aluno_id 
      AND ap.professor_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
CREATE TRIGGER update_historico_medidas_updated_at
  BEFORE UPDATE ON public.historico_medidas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
