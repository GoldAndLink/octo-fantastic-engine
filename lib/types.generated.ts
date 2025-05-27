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
      client_stage_progress: {
        Row: {
          client_id: string | null
          completed_at: string | null
          id: string
          stage_id: number | null
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          id?: string
          stage_id?: number | null
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          id?: string
          stage_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_stage_progress_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_stage_progress_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
        ]
      }
      client_users: {
        Row: {
          client_id: string
          department_id: string | null
          is_admin: boolean | null
          is_billing: boolean | null
          user_id: string
        }
        Insert: {
          client_id: string
          department_id?: string | null
          is_admin?: boolean | null
          is_billing?: boolean | null
          user_id: string
        }
        Update: {
          client_id?: string
          department_id?: string | null
          is_admin?: boolean | null
          is_billing?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_users_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          id: string
          name: string
          plan_id: string | null
          url: string | null
        }
        Insert: {
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          id?: string
          name: string
          plan_id?: string | null
          url?: string | null
        }
        Update: {
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          id?: string
          name?: string
          plan_id?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_plan"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials: {
        Row: {
          client_id: string | null
          connected: boolean | null
          created_at: string | null
          fields: Json | null
          id: string
          service_name: string | null
        }
        Insert: {
          client_id?: string | null
          connected?: boolean | null
          created_at?: string | null
          fields?: Json | null
          id?: string
          service_name?: string | null
        }
        Update: {
          client_id?: string | null
          connected?: boolean | null
          created_at?: string | null
          fields?: Json | null
          id?: string
          service_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credentials_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          client_id: string | null
          id: string
          name: string
        }
        Insert: {
          client_id?: string | null
          id?: string
          name: string
        }
        Update: {
          client_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      exceptions: {
        Row: {
          e_type: Database["public"]["Enums"]["exception_type"] | null
          id: string
          notified: Json | null
          remedy: string | null
          reported_at: string | null
          severity: Database["public"]["Enums"]["exception_severity"] | null
          status: string | null
          workflow_id: string | null
        }
        Insert: {
          e_type?: Database["public"]["Enums"]["exception_type"] | null
          id?: string
          notified?: Json | null
          remedy?: string | null
          reported_at?: string | null
          severity?: Database["public"]["Enums"]["exception_severity"] | null
          status?: string | null
          workflow_id?: string | null
        }
        Update: {
          e_type?: Database["public"]["Enums"]["exception_type"] | null
          id?: string
          notified?: Json | null
          remedy?: string | null
          reported_at?: string | null
          severity?: Database["public"]["Enums"]["exception_severity"] | null
          status?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exceptions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      executions: {
        Row: {
          duration_ms: number | null
          executed_at: string | null
          id: string
          raw_log: Json | null
          status: string | null
          workflow_id: string | null
        }
        Insert: {
          duration_ms?: number | null
          executed_at?: string | null
          id?: string
          raw_log?: Json | null
          status?: string | null
          workflow_id?: string | null
        }
        Update: {
          duration_ms?: number | null
          executed_at?: string | null
          id?: string
          raw_log?: Json | null
          status?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number | null
          client_id: string | null
          due_date: string | null
          id: string
          invoice_date: string | null
          pdf_url: string | null
          plan_snapshot: Json | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          client_id?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          pdf_url?: string | null
          plan_snapshot?: Json | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          client_id?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          pdf_url?: string | null
          plan_snapshot?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      nodes: {
        Row: {
          id: string
          name: string | null
          type: string | null
          workflow_id: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          type?: string | null
          workflow_id?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          type?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nodes_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          billing_cadence: Database["public"]["Enums"]["billing_cadence"] | null
          cap_amount: number | null
          contract_length: Database["public"]["Enums"]["contract_length"] | null
          credits_per_period: number | null
          description: string | null
          id: string
          name: string | null
          overage_cost: number | null
          prepayment_percent: number | null
          price_per_credit: number | null
          pricing_model: Database["public"]["Enums"]["pricing_model"] | null
          setup_fee: number | null
        }
        Insert: {
          billing_cadence?:
            | Database["public"]["Enums"]["billing_cadence"]
            | null
          cap_amount?: number | null
          contract_length?:
            | Database["public"]["Enums"]["contract_length"]
            | null
          credits_per_period?: number | null
          description?: string | null
          id?: string
          name?: string | null
          overage_cost?: number | null
          prepayment_percent?: number | null
          price_per_credit?: number | null
          pricing_model?: Database["public"]["Enums"]["pricing_model"] | null
          setup_fee?: number | null
        }
        Update: {
          billing_cadence?:
            | Database["public"]["Enums"]["billing_cadence"]
            | null
          cap_amount?: number | null
          contract_length?:
            | Database["public"]["Enums"]["contract_length"]
            | null
          credits_per_period?: number | null
          description?: string | null
          id?: string
          name?: string | null
          overage_cost?: number | null
          prepayment_percent?: number | null
          price_per_credit?: number | null
          pricing_model?: Database["public"]["Enums"]["pricing_model"] | null
          setup_fee?: number | null
        }
        Relationships: []
      }
      se_assignments: {
        Row: {
          client_id: string
          se_id: string
        }
        Insert: {
          client_id: string
          se_id: string
        }
        Update: {
          client_id?: string
          se_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "se_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "se_assignments_se_id_fkey"
            columns: ["se_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      
      : {
        Row: {
          id: number
          name: string | null
          sort_order: number | null
        }
        Insert: {
          id?: number
          name?: string | null
          sort_order?: number | null
        }
        Update: {
          id?: number
          name?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          hourly_rate_billable: number | null
          hourly_rate_cost: number | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          hourly_rate_billable?: number | null
          hourly_rate_cost?: number | null
          id?: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          hourly_rate_billable?: number | null
          hourly_rate_cost?: number | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      workflows: {
        Row: {
          active: boolean | null
          client_id: string | null
          created_at: string | null
          department_id: string | null
          description: string | null
          id: string
          money_saved_per_exec: number | null
          name: string
          time_saved_per_exec: number | null
        }
        Insert: {
          active?: boolean | null
          client_id?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          money_saved_per_exec?: number | null
          name: string
          time_saved_per_exec?: number | null
        }
        Update: {
          active?: boolean | null
          client_id?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          money_saved_per_exec?: number | null
          name?: string
          time_saved_per_exec?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workflows_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflows_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_app_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_client: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_se: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      billing_cadence: "MONTHLY" | "QUARTERLY" | "YEARLY"
      contract_length: "MONTH" | "QUARTER" | "YEAR"
      exception_severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
      exception_type:
        | "AUTHENTICATION"
        | "DATA_PROCESS"
        | "INTEGRATION"
        | "WORKFLOW_LOGIC"
        | "BROWSER_AUTOMATION"
      pricing_model: "CONSUMPTION" | "SUBSCRIPTION"
      user_role: "ADMIN" | "SE" | "CLIENT"
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
    Enums: {
      billing_cadence: ["MONTHLY", "QUARTERLY", "YEARLY"],
      contract_length: ["MONTH", "QUARTER", "YEAR"],
      exception_severity: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
      exception_type: [
        "AUTHENTICATION",
        "DATA_PROCESS",
        "INTEGRATION",
        "WORKFLOW_LOGIC",
        "BROWSER_AUTOMATION",
      ],
      pricing_model: ["CONSUMPTION", "SUBSCRIPTION"],
      user_role: ["ADMIN", "SE", "CLIENT"],
    },
  },
} as const
