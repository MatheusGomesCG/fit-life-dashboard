
-- Criar tabela para transações/pagamentos dos professores
CREATE TABLE public.professor_transacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professor_id UUID NOT NULL,
  plano_id UUID REFERENCES public.professor_planos(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  moeda VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) NOT NULL DEFAULT 'pendente', -- pendente, pago, cancelado, falhou
  metodo_pagamento VARCHAR(100), -- pix, cartao_credito, boleto, etc
  gateway_pagamento VARCHAR(50), -- stripe, mercadopago, pagseguro, etc
  gateway_transaction_id TEXT, -- ID da transação no gateway
  data_vencimento DATE,
  data_pagamento TIMESTAMPTZ,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela para métricas administrativas
CREATE TABLE public.admin_metricas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_referencia DATE NOT NULL,
  total_professores_ativos INTEGER DEFAULT 0,
  total_professores_inativos INTEGER DEFAULT 0,
  novos_professores_mes INTEGER DEFAULT 0,
  receita_mensal DECIMAL(12,2) DEFAULT 0,
  receita_acumulada DECIMAL(12,2) DEFAULT 0,
  planos_25_ativos INTEGER DEFAULT 0,
  planos_50_ativos INTEGER DEFAULT 0,
  planos_100_ativos INTEGER DEFAULT 0,
  planos_100plus_ativos INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(data_referencia)
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.professor_transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_metricas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para transações (apenas admins podem ver tudo)
CREATE POLICY "Admins podem gerenciar todas as transações" 
  ON public.professor_transacoes 
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Professores podem ver suas próprias transações" 
  ON public.professor_transacoes 
  FOR SELECT 
  USING (professor_id = auth.uid());

-- Políticas RLS para métricas (apenas admins)
CREATE POLICY "Admins podem gerenciar métricas" 
  ON public.admin_metricas 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Função para calcular métricas administrativas
CREATE OR REPLACE FUNCTION public.calcular_metricas_admin(data_ref DATE DEFAULT CURRENT_DATE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_prof_ativos INTEGER;
  total_prof_inativos INTEGER;
  novos_prof INTEGER;
  receita_mes DECIMAL(12,2);
  receita_total DECIMAL(12,2);
  planos_25 INTEGER;
  planos_50 INTEGER;
  planos_100 INTEGER;
  planos_100plus INTEGER;
BEGIN
  -- Contar professores ativos/inativos
  SELECT COUNT(*) INTO total_prof_ativos 
  FROM professor_profiles WHERE status = 'ativo';
  
  SELECT COUNT(*) INTO total_prof_inativos 
  FROM professor_profiles WHERE status IN ('inativo', 'suspenso');
  
  -- Novos professores no mês
  SELECT COUNT(*) INTO novos_prof
  FROM professor_profiles 
  WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', data_ref);
  
  -- Receita do mês
  SELECT COALESCE(SUM(valor), 0) INTO receita_mes
  FROM professor_transacoes 
  WHERE status = 'pago' 
    AND DATE_TRUNC('month', data_pagamento) = DATE_TRUNC('month', data_ref);
  
  -- Receita total acumulada
  SELECT COALESCE(SUM(valor), 0) INTO receita_total
  FROM professor_transacoes 
  WHERE status = 'pago';
  
  -- Contar planos ativos por tipo
  SELECT COUNT(*) INTO planos_25
  FROM professor_planos WHERE tipo_plano = '25' AND status = 'ativo';
  
  SELECT COUNT(*) INTO planos_50
  FROM professor_planos WHERE tipo_plano = '50' AND status = 'ativo';
  
  SELECT COUNT(*) INTO planos_100
  FROM professor_planos WHERE tipo_plano = '100' AND status = 'ativo';
  
  SELECT COUNT(*) INTO planos_100plus
  FROM professor_planos WHERE tipo_plano = '100+' AND status = 'ativo';
  
  -- Inserir ou atualizar métricas
  INSERT INTO admin_metricas (
    data_referencia, total_professores_ativos, total_professores_inativos,
    novos_professores_mes, receita_mensal, receita_acumulada,
    planos_25_ativos, planos_50_ativos, planos_100_ativos, planos_100plus_ativos
  ) VALUES (
    data_ref, total_prof_ativos, total_prof_inativos,
    novos_prof, receita_mes, receita_total,
    planos_25, planos_50, planos_100, planos_100plus
  )
  ON CONFLICT (data_referencia) 
  DO UPDATE SET
    total_professores_ativos = EXCLUDED.total_professores_ativos,
    total_professores_inativos = EXCLUDED.total_professores_inativos,
    novos_professores_mes = EXCLUDED.novos_professores_mes,
    receita_mensal = EXCLUDED.receita_mensal,
    receita_acumulada = EXCLUDED.receita_acumulada,
    planos_25_ativos = EXCLUDED.planos_25_ativos,
    planos_50_ativos = EXCLUDED.planos_50_ativos,
    planos_100_ativos = EXCLUDED.planos_100_ativos,
    planos_100plus_ativos = EXCLUDED.planos_100plus_ativos,
    updated_at = now();
END;
$$;

-- Trigger para atualizar métricas automaticamente
CREATE OR REPLACE FUNCTION public.trigger_atualizar_metricas()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.calcular_metricas_admin(CURRENT_DATE);
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Criar triggers
CREATE TRIGGER trigger_metricas_professor_profiles
  AFTER INSERT OR UPDATE OR DELETE ON professor_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_atualizar_metricas();

CREATE TRIGGER trigger_metricas_professor_planos
  AFTER INSERT OR UPDATE OR DELETE ON professor_planos
  FOR EACH ROW EXECUTE FUNCTION trigger_atualizar_metricas();

CREATE TRIGGER trigger_metricas_transacoes
  AFTER INSERT OR UPDATE OR DELETE ON professor_transacoes
  FOR EACH ROW EXECUTE FUNCTION trigger_atualizar_metricas();
