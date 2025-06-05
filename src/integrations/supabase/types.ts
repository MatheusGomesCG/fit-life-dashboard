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
      aluno_profiles: {
        Row: {
          altura: number | null
          created_at: string
          email: string
          experiencia: string | null
          id: string
          idade: number | null
          nome: string
          objetivo: string | null
          peso: number | null
          professor_id: string
          restricoes_medicas: string | null
          senha_temporaria: boolean | null
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          altura?: number | null
          created_at?: string
          email: string
          experiencia?: string | null
          id?: string
          idade?: number | null
          nome: string
          objetivo?: string | null
          peso?: number | null
          professor_id: string
          restricoes_medicas?: string | null
          senha_temporaria?: boolean | null
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          altura?: number | null
          created_at?: string
          email?: string
          experiencia?: string | null
          id?: string
          idade?: number | null
          nome?: string
          objetivo?: string | null
          peso?: number | null
          professor_id?: string
          restricoes_medicas?: string | null
          senha_temporaria?: boolean | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      [_ in never]: never
    }
    Functions: {
      contar_alunos_professor: {
        Args: { professor_id: string }
        Returns: number
      }
      is_admin: {
        Args: { user_uuid: string }
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
