export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      exercicios_treino: {
        Row: {
          carga_ideal: number
          created_at: string
          dia_treino: string
          estrategia: string | null
          ficha_treino_id: string
          grupo_muscular: string
          id: string
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
          estrategia?: string | null
          ficha_treino_id: string
          grupo_muscular: string
          id?: string
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
          estrategia?: string | null
          ficha_treino_id?: string
          grupo_muscular?: string
          id?: string
          nome_exercicio?: string
          repeticoes?: number
          series?: number
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
