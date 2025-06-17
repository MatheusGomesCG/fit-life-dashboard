
-- Adicionar nova coluna para armazenar as medidas corporais na tabela historico_medidas
ALTER TABLE public.historico_medidas 
ADD COLUMN IF NOT EXISTS medidas_corporais JSONB;

-- Adicionar nova coluna para medidas corporais na tabela aluno_profiles também
ALTER TABLE public.aluno_profiles 
ADD COLUMN IF NOT EXISTS medidas_corporais JSONB;

-- Criar índice para melhor performance nas consultas JSONB
CREATE INDEX IF NOT EXISTS idx_historico_medidas_corporais 
ON public.historico_medidas USING GIN (medidas_corporais);

CREATE INDEX IF NOT EXISTS idx_aluno_medidas_corporais 
ON public.aluno_profiles USING GIN (medidas_corporais);
