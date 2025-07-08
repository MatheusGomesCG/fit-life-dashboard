export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_metricas: {
        Row: {
          created_at: string
          data_referencia: string
          id: string
          novos_professores_mes: number | null
          planos_100_ativos: number | null
          planos_100plus_ativos: number | null
          planos_25_ativos: number | null
          planos_50_ativos: number | null
          receita_acumulada: number | null
          receita_mensal: number | null
          total_professores_ativos: number | null
          total_professores_inativos: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_referencia: string
          id?: string
          novos_professores_mes?: number | null
          planos_100_ativos?: number | null
          planos_100plus_ativos?: number | null
          planos_25_ativos?: number | null
          planos_50_ativos?: number | null
          receita_acumulada?: number | null
          receita_mensal?: number | null
          total_professores_ativos?: number | null
          total_professores_inativos?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_referencia?: string
          id?: string
          novos_professores_mes?: number | null
          planos_100_ativos?: number | null
          planos_100plus_ativos?: number | null
          planos_25_ativos?: number | null
          planos_50_ativos?: number | null
          receita_acumulada?: number | null
          receita_mensal?: number | null
          total_professores_ativos?: number | null
          total_professores_inativos?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agendamentos: {
        Row: {
          aluno_id: string
          created_at: string
          data: string
          descricao: string | null
          horario: string
          id: string
          observacoes: string | null
          professor_id: string
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          aluno_id: string
          created_at?: string
          data: string
          descricao?: string | null
          horario: string
          id?: string
          observacoes?: string | null
          professor_id: string
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          aluno_id?: string
          created_at?: string
          data?: string
          descricao?: string | null
          horario?: string
          id?: string
          observacoes?: string | null
          professor_id?: string
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_agendamento_aluno"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "aluno_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      aluno_profiles: {
        Row: {
          altura: number | null
          created_at: string
          data_nascimento: string | null
          data_vencimento: string | null
          dobras_cutaneas: Json | null
          email: string
          endereco: string | null
          experiencia: string | null
          genero: string | null
          id: string
          idade: number | null
          imc: number | null
          medidas_corporais: Json | null
          nome: string
          objetivo: string | null
          observacoes: string | null
          percentual_gordura: number | null
          peso: number | null
          professor_id: string
          restricoes_medicas: string | null
          senha_temporaria: boolean | null
          telefone: string | null
          updated_at: string
          user_id: string
          valor_mensalidade: number | null
        }
        Insert: {
          altura?: number | null
          created_at?: string
          data_nascimento?: string | null
          data_vencimento?: string | null
          dobras_cutaneas?: Json | null
          email: string
          endereco?: string | null
          experiencia?: string | null
          genero?: string | null
          id?: string
          idade?: number | null
          imc?: number | null
          medidas_corporais?: Json | null
          nome: string
          objetivo?: string | null
          observacoes?: string | null
          percentual_gordura?: number | null
          peso?: number | null
          professor_id: string
          restricoes_medicas?: string | null
          senha_temporaria?: boolean | null
          telefone?: string | null
          updated_at?: string
          user_id: string
          valor_mensalidade?: number | null
        }
        Update: {
          altura?: number | null
          created_at?: string
          data_nascimento?: string | null
          data_vencimento?: string | null
          dobras_cutaneas?: Json | null
          email?: string
          endereco?: string | null
          experiencia?: string | null
          genero?: string | null
          id?: string
          idade?: number | null
          imc?: number | null
          medidas_corporais?: Json | null
          nome?: string
          objetivo?: string | null
          observacoes?: string | null
          percentual_gordura?: number | null
          peso?: number | null
          professor_id?: string
          restricoes_medicas?: string | null
          senha_temporaria?: boolean | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
          valor_mensalidade?: number | null
        }
        Relationships: []
      }
      avaliacoes_fisicas: {
        Row: {
          aluno_id: string
          created_at: string
          data_avaliacao: string
          id: string
          observacoes: string | null
          professor_id: string
          updated_at: string
        }
        Insert: {
          aluno_id: string
          created_at?: string
          data_avaliacao?: string
          id?: string
          observacoes?: string | null
          professor_id: string
          updated_at?: string
        }
        Update: {
          aluno_id?: string
          created_at?: string
          data_avaliacao?: string
          id?: string
          observacoes?: string | null
          professor_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      checkins_exercicios: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          timestamp?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      conversas: {
        Row: {
          aluno_id: string
          created_at: string
          id: string
          professor_id: string
          ultima_mensagem: string | null
          updated_at: string
        }
        Insert: {
          aluno_id: string
          created_at?: string
          id?: string
          professor_id: string
          ultima_mensagem?: string | null
          updated_at?: string
        }
        Update: {
          aluno_id?: string
          created_at?: string
          id?: string
          professor_id?: string
          ultima_mensagem?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dados_avaliacao: {
        Row: {
          avaliacao_id: string
          created_at: string
          estrategia: string
          grupo_estrategia: string
          id: string
          unidade: string | null
          valor: number | null
          valor_texto: string | null
        }
        Insert: {
          avaliacao_id: string
          created_at?: string
          estrategia: string
          grupo_estrategia: string
          id?: string
          unidade?: string | null
          valor?: number | null
          valor_texto?: string | null
        }
        Update: {
          avaliacao_id?: string
          created_at?: string
          estrategia?: string
          grupo_estrategia?: string
          id?: string
          unidade?: string | null
          valor?: number | null
          valor_texto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dados_avaliacao_avaliacao_id_fkey"
            columns: ["avaliacao_id"]
            isOneToOne: false
            referencedRelation: "avaliacoes_completas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dados_avaliacao_avaliacao_id_fkey"
            columns: ["avaliacao_id"]
            isOneToOne: false
            referencedRelation: "avaliacoes_fisicas"
            referencedColumns: ["id"]
          },
        ]
      }
      exercicio_tecnicas: {
        Row: {
          created_at: string
          exercicio_relacionado_id: string | null
          exercicio_treino_id: string
          id: string
          ordem: number | null
          tecnica_id: string
        }
        Insert: {
          created_at?: string
          exercicio_relacionado_id?: string | null
          exercicio_treino_id: string
          id?: string
          ordem?: number | null
          tecnica_id: string
        }
        Update: {
          created_at?: string
          exercicio_relacionado_id?: string | null
          exercicio_treino_id?: string
          id?: string
          ordem?: number | null
          tecnica_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercicio_tecnicas_exercicio_relacionado_id_fkey"
            columns: ["exercicio_relacionado_id"]
            isOneToOne: false
            referencedRelation: "exercicios_treino"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercicio_tecnicas_exercicio_treino_id_fkey"
            columns: ["exercicio_treino_id"]
            isOneToOne: false
            referencedRelation: "exercicios_treino"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercicio_tecnicas_tecnica_id_fkey"
            columns: ["tecnica_id"]
            isOneToOne: false
            referencedRelation: "tecnicas_treinamento"
            referencedColumns: ["id"]
          },
        ]
      }
      exercicios_cadastrados: {
        Row: {
          created_at: string
          equipamento: string | null
          exercicio_similar_id: string | null
          grupo_muscular: string
          id: string
          instrucoes: string | null
          nome: string
          professor_id: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          equipamento?: string | null
          exercicio_similar_id?: string | null
          grupo_muscular: string
          id?: string
          instrucoes?: string | null
          nome: string
          professor_id: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          equipamento?: string | null
          exercicio_similar_id?: string | null
          grupo_muscular?: string
          id?: string
          instrucoes?: string | null
          nome?: string
          professor_id?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercicios_cadastrados_exercicio_similar_id_fkey"
            columns: ["exercicio_similar_id"]
            isOneToOne: false
            referencedRelation: "exercicios_cadastrados"
            referencedColumns: ["id"]
          },
        ]
      }
      exercicios_treino: {
        Row: {
          carga_ideal: number
          created_at: string
          dia_treino: string
          equipamento: string | null
          estrategia: string | null
          exercicio_cadastrado_id: string | null
          ficha_treino_id: string
          grupo_muscular: string
          id: string
          instrucoes: string | null
          nome_exercicio: string
          repeticoes: number
          series: number
          updated_at: string
          video_url: string | null
        }
        Insert: {
          carga_ideal?: number
          created_at?: string
          dia_treino: string
          equipamento?: string | null
          estrategia?: string | null
          exercicio_cadastrado_id?: string | null
          ficha_treino_id: string
          grupo_muscular: string
          id?: string
          instrucoes?: string | null
          nome_exercicio: string
          repeticoes?: number
          series?: number
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          carga_ideal?: number
          created_at?: string
          dia_treino?: string
          equipamento?: string | null
          estrategia?: string | null
          exercicio_cadastrado_id?: string | null
          ficha_treino_id?: string
          grupo_muscular?: string
          id?: string
          instrucoes?: string | null
          nome_exercicio?: string
          repeticoes?: number
          series?: number
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercicios_treino_exercicio_cadastrado_id_fkey"
            columns: ["exercicio_cadastrado_id"]
            isOneToOne: false
            referencedRelation: "exercicios_cadastrados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercicios_treino_ficha_treino_id_fkey"
            columns: ["ficha_treino_id"]
            isOneToOne: false
            referencedRelation: "fichas_treino"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercicios_treino_ficha_treino_id_fkey"
            columns: ["ficha_treino_id"]
            isOneToOne: false
            referencedRelation: "fichas_treino_completas"
            referencedColumns: ["ficha_id"]
          },
        ]
      }
      feed_comentarios: {
        Row: {
          comentario: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          comentario: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          comentario?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_comentarios_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_posts: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          professor_id: string
          tipo: string
          updated_at: string
          url_midia: string | null
          user_id: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          id?: string
          professor_id: string
          tipo: string
          updated_at?: string
          url_midia?: string | null
          user_id: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          professor_id?: string
          tipo?: string
          updated_at?: string
          url_midia?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feedbacks_treino: {
        Row: {
          created_at: string
          exercise_id: string | null
          id: string
          mensagem: string
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exercise_id?: string | null
          id?: string
          mensagem: string
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exercise_id?: string | null
          id?: string
          mensagem?: string
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fichas_treino: {
        Row: {
          aluno_id: string
          created_at: string
          id: string
          professor_id: string
          updated_at: string
        }
        Insert: {
          aluno_id: string
          created_at?: string
          id?: string
          professor_id: string
          updated_at?: string
        }
        Update: {
          aluno_id?: string
          created_at?: string
          id?: string
          professor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fichas_treino_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "aluno_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      historico_medidas: {
        Row: {
          altura: number | null
          aluno_id: string
          created_at: string
          data_medicao: string
          dobras_cutaneas: Json | null
          id: string
          imc: number | null
          medidas_corporais: Json | null
          observacoes: string | null
          percentual_gordura: number | null
          peso: number | null
          updated_at: string
        }
        Insert: {
          altura?: number | null
          aluno_id: string
          created_at?: string
          data_medicao?: string
          dobras_cutaneas?: Json | null
          id?: string
          imc?: number | null
          medidas_corporais?: Json | null
          observacoes?: string | null
          percentual_gordura?: number | null
          peso?: number | null
          updated_at?: string
        }
        Update: {
          altura?: number | null
          aluno_id?: string
          created_at?: string
          data_medicao?: string
          dobras_cutaneas?: Json | null
          id?: string
          imc?: number | null
          medidas_corporais?: Json | null
          observacoes?: string | null
          percentual_gordura?: number | null
          peso?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_medidas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "aluno_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mensagens: {
        Row: {
          conteudo: string
          conversa_id: string
          created_at: string
          destinatario_id: string
          id: string
          lida: boolean
          remetente_id: string
          tipo: string
        }
        Insert: {
          conteudo: string
          conversa_id: string
          created_at?: string
          destinatario_id: string
          id?: string
          lida?: boolean
          remetente_id: string
          tipo?: string
        }
        Update: {
          conteudo?: string
          conversa_id?: string
          created_at?: string
          destinatario_id?: string
          id?: string
          lida?: boolean
          remetente_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas_completas"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          aluno_id: string
          aluno_nome: string
          ano: number
          comprovante_url: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          descricao: string | null
          id: string
          mes: number
          metodo_pagamento: string | null
          observacao: string | null
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          aluno_id: string
          aluno_nome: string
          ano: number
          comprovante_url?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          descricao?: string | null
          id?: string
          mes: number
          metodo_pagamento?: string | null
          observacao?: string | null
          status: string
          updated_at?: string
          valor: number
        }
        Update: {
          aluno_id?: string
          aluno_nome?: string
          ano?: number
          comprovante_url?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string | null
          id?: string
          mes?: number
          metodo_pagamento?: string | null
          observacao?: string | null
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      professor_planos: {
        Row: {
          created_at: string
          data_inicio: string
          data_vencimento: string
          id: string
          limite_alunos: number
          preco_mensal: number
          professor_id: string
          status: string
          tipo_plano: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_inicio?: string
          data_vencimento: string
          id?: string
          limite_alunos: number
          preco_mensal: number
          professor_id: string
          status?: string
          tipo_plano: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_inicio?: string
          data_vencimento?: string
          id?: string
          limite_alunos?: number
          preco_mensal?: number
          professor_id?: string
          status?: string
          tipo_plano?: string
          updated_at?: string
        }
        Relationships: []
      }
      professor_profiles: {
        Row: {
          biografia: string | null
          created_at: string
          documento: string | null
          endereco: string | null
          especialidade: string | null
          foto_url: string | null
          id: string
          nome: string
          status: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          biografia?: string | null
          created_at?: string
          documento?: string | null
          endereco?: string | null
          especialidade?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          biografia?: string | null
          created_at?: string
          documento?: string | null
          endereco?: string | null
          especialidade?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      professor_transacoes: {
        Row: {
          created_at: string
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string | null
          gateway_pagamento: string | null
          gateway_transaction_id: string | null
          id: string
          metodo_pagamento: string | null
          moeda: string | null
          plano_id: string | null
          professor_id: string
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          gateway_pagamento?: string | null
          gateway_transaction_id?: string | null
          id?: string
          metodo_pagamento?: string | null
          moeda?: string | null
          plano_id?: string | null
          professor_id: string
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          gateway_pagamento?: string | null
          gateway_transaction_id?: string | null
          id?: string
          metodo_pagamento?: string | null
          moeda?: string | null
          plano_id?: string | null
          professor_id?: string
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "professor_transacoes_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "professor_planos"
            referencedColumns: ["id"]
          },
        ]
      }
      progressao_professor: {
        Row: {
          aluno_id: string
          carga_anterior: number
          carga_nova: number
          created_at: string
          data_progressao: string
          exercise_id: string
          id: string
          observacoes: string | null
          professor_id: string
        }
        Insert: {
          aluno_id: string
          carga_anterior: number
          carga_nova: number
          created_at?: string
          data_progressao?: string
          exercise_id: string
          id?: string
          observacoes?: string | null
          professor_id: string
        }
        Update: {
          aluno_id?: string
          carga_anterior?: number
          carga_nova?: number
          created_at?: string
          data_progressao?: string
          exercise_id?: string
          id?: string
          observacoes?: string | null
          professor_id?: string
        }
        Relationships: []
      }
      registros_carga: {
        Row: {
          created_at: string
          data: string
          exercise_id: string
          id: string
          peso: number
          repeticoes: number
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: string
          exercise_id: string
          id?: string
          peso: number
          repeticoes: number
          user_id: string
        }
        Update: {
          created_at?: string
          data?: string
          exercise_id?: string
          id?: string
          peso?: number
          repeticoes?: number
          user_id?: string
        }
        Relationships: []
      }
      tecnicas_treinamento: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
    }
    Views: {
      agendamentos_com_aluno: {
        Row: {
          aluno_email: string | null
          aluno_id: string | null
          aluno_nome: string | null
          aluno_telefone: string | null
          created_at: string | null
          data: string | null
          descricao: string | null
          horario: string | null
          id: string | null
          observacoes: string | null
          professor_id: string | null
          status: string | null
          tipo: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_agendamento_aluno"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "aluno_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      avaliacoes_completas: {
        Row: {
          aluno_email: string | null
          aluno_id: string | null
          aluno_nome: string | null
          created_at: string | null
          dados: Json | null
          data_avaliacao: string | null
          id: string | null
          observacoes: string | null
          professor_id: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      conversas_completas: {
        Row: {
          aluno_email: string | null
          aluno_id: string | null
          aluno_nome: string | null
          created_at: string | null
          id: string | null
          mensagens_nao_lidas: number | null
          professor_id: string | null
          ultima_mensagem: string | null
          ultima_mensagem_data: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      fichas_treino_completas: {
        Row: {
          altura: number | null
          aluno_email: string | null
          aluno_id: string | null
          aluno_nome: string | null
          created_at: string | null
          exercicios: Json | null
          experiencia: string | null
          ficha_id: string | null
          idade: number | null
          objetivo: string | null
          peso: number | null
          professor_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fichas_treino_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "aluno_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      calcular_metricas_admin: {
        Args: { data_ref?: string }
        Returns: undefined
      }
      contar_alunos_professor: {
        Args: { professor_id: string }
        Returns: number
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_professor: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_student_of_professor: {
        Args: { student_id: string; professor_id: string }
        Returns: boolean
      }
      verificar_limite_alunos: {
        Args: { professor_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
