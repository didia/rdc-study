export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          origin_country: string | null
          phone: string | null
          phone_e164: string | null
          preferred_channel: string | null
          updated_at: string
          address: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          origin_country?: string | null
          phone?: string | null
          phone_e164?: string | null
          preferred_channel?: string | null
          updated_at?: string
          address?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          origin_country?: string | null
          phone?: string | null
          phone_e164?: string | null
          preferred_channel?: string | null
          updated_at?: string
          address?: string | null
        }
        Relationships: []
      }
      request_events: {
        Row: {
          actor_id: string | null
          body: string | null
          channel: string | null
          created_at: string
          from_status: string | null
          id: number
          metadata: Json
          request_id: string
          to_status: string | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          channel?: string | null
          created_at?: string
          from_status?: string | null
          id?: never
          metadata?: Json
          request_id: string
          to_status?: string | null
          type: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          channel?: string | null
          created_at?: string
          from_status?: string | null
          id?: never
          metadata?: Json
          request_id?: string
          to_status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_events_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      lost_reasons: {
        Row: {
          code: string
          is_active: boolean
          label_fr: string
          sort_order: number
        }
        Insert: {
          code: string
          is_active?: boolean
          label_fr: string
          sort_order: number
        }
        Update: {
          code?: string
          is_active?: boolean
          label_fr?: string
          sort_order?: number
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          body_fr: string
          channel: string
          code: string
          id: string
          is_active: boolean
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          body_fr: string
          channel: string
          code: string
          id?: string
          is_active?: boolean
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          body_fr?: string
          channel?: string
          code?: string
          id?: string
          is_active?: boolean
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      saved_views: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          params: Json
          shared: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          params: Json
          shared?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          params?: Json
          shared?: boolean
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          actor_id: string | null
          created_at: string
          id: number
          metadata: Json
          type: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: number
          metadata?: Json
          type: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: number
          metadata?: Json
          type?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          external_ref: string | null
          id: string
          kind: string
          method: string
          note: string | null
          paid_at: string
          recorded_by: string | null
          request_id: string
          void_reason: string | null
          voided_at: string | null
          voided_by: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          external_ref?: string | null
          id?: string
          kind: string
          method: string
          note?: string | null
          paid_at: string
          recorded_by?: string | null
          request_id: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          external_ref?: string | null
          id?: string
          kind?: string
          method?: string
          note?: string | null
          paid_at?: string
          recorded_by?: string | null
          request_id?: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Relationships: []
      }
      request_documents: {
        Row: {
          created_at: string
          file_name: string
          id: string
          kind: string
          mime_type: string | null
          request_id: string
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          kind: string
          mime_type?: string | null
          request_id: string
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          kind?: string
          mime_type?: string | null
          request_id?: string
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          kind: string
          title: string
          version: number
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          kind: string
          title: string
          version: number
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          title?: string
          version?: number
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          hits: number
          key: string
          window_start: string
        }
        Insert: {
          hits?: number
          key: string
          window_start: string
        }
        Update: {
          hits?: number
          key?: string
          window_start?: string
        }
        Relationships: []
      }
      request_statuses: {
        Row: {
          code: string
          color: string | null
          is_active: boolean
          label_fr: string
          sort_order: number
          stage: string
        }
        Insert: {
          code: string
          color?: string | null
          is_active?: boolean
          label_fr: string
          sort_order: number
          stage: string
        }
        Update: {
          code?: string
          color?: string | null
          is_active?: boolean
          label_fr?: string
          sort_order?: number
          stage?: string
        }
        Relationships: []
      }
      service_price_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          currency: string
          id: number
          new_amount_cents: number | null
          old_amount_cents: number | null
          reason: string | null
          scope: string
          service_type: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          currency: string
          id?: never
          new_amount_cents: number | null
          old_amount_cents?: number | null
          reason?: string | null
          scope: string
          service_type: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          currency?: string
          id?: never
          new_amount_cents?: number | null
          old_amount_cents?: number | null
          reason?: string | null
          scope?: string
          service_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_price_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_prices: {
        Row: {
          amount_cents: number
          currency: string
          scope: string
          service_type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount_cents: number
          currency?: string
          scope?: string
          service_type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount_cents?: number
          currency?: string
          scope?: string
          service_type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_prices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          assigned_to: string | null
          client_id: string
          closed_at: string | null
          created_at: string
          destination_country: string | null
          displayed_price_cents: number | null
          form_answers: Json
          has_dispute: boolean
          id: string
          idempotency_key: string | null
          last_activity_at: string
          next_follow_up_at: string | null
          original_message: string | null
          package_slug: string | null
          quoted_currency: string | null
          quoted_price_cents: number | null
          reference: string
          service_type: string
          source: string
          source_url: string | null
          status: string
          status_reason: string | null
          submitted_at: string
          updated_at: string
          lost_reason: string | null
          agreed_price_cents: number | null
          agreed_currency: string
          mentor_id: string | null
          delivery_checklist: Json
        }
        Insert: {
          assigned_to?: string | null
          client_id: string
          closed_at?: string | null
          created_at?: string
          destination_country?: string | null
          displayed_price_cents?: number | null
          form_answers?: Json
          has_dispute?: boolean
          id?: string
          idempotency_key?: string | null
          last_activity_at?: string
          next_follow_up_at?: string | null
          original_message?: string | null
          package_slug?: string | null
          quoted_currency?: string | null
          quoted_price_cents?: number | null
          reference?: string
          service_type: string
          source: string
          source_url?: string | null
          status?: string
          status_reason?: string | null
          submitted_at?: string
          updated_at?: string
          lost_reason?: string | null
          agreed_price_cents?: number | null
          agreed_currency?: string
          mentor_id?: string | null
          delivery_checklist?: Json
        }
        Update: {
          assigned_to?: string | null
          client_id?: string
          closed_at?: string | null
          created_at?: string
          destination_country?: string | null
          displayed_price_cents?: number | null
          form_answers?: Json
          has_dispute?: boolean
          id?: string
          idempotency_key?: string | null
          last_activity_at?: string
          next_follow_up_at?: string | null
          original_message?: string | null
          package_slug?: string | null
          quoted_currency?: string | null
          quoted_price_cents?: number | null
          reference?: string
          service_type?: string
          source?: string
          source_url?: string | null
          status?: string
          status_reason?: string | null
          submitted_at?: string
          updated_at?: string
          lost_reason?: string | null
          agreed_price_cents?: number | null
          agreed_currency?: string
          mentor_id?: string | null
          delivery_checklist?: Json
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "request_statuses"
            referencedColumns: ["code"]
          },
        ]
      }
      staff_profiles: {
        Row: {
          active: boolean
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["staff_role"]
          whatsapp: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["staff_role"]
          whatsapp?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["staff_role"]
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      request_paid: {
        Row: {
          currency: string | null
          net_cents: number | null
          request_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number }
        Returns: boolean
      }
      remove_service_price: {
        Args: { p_reason: string; p_scope: string; p_service_type: string }
        Returns: undefined
      }
      set_service_price: {
        Args: { p_amount_cents: number; p_reason: string; p_scope: string; p_service_type: string }
        Returns: undefined
      }
      submit_service_request: {
        Args: { payload: Json }
        Returns: Json
      }
      fn_funnel: {
        Args: { p_from: string; p_to: string }
        Returns: { step: string; ord: number; n: number }[]
      }
      fn_conversion_by: {
        Args: { p_dimension: string; p_from: string; p_to: string }
        Returns: { label: string; total: number; won: number }[]
      }
      fn_speed: {
        Args: { p_from: string; p_to: string }
        Returns: { median_hours_to_contact: number | null; contacted_count: number; median_hours_to_won: number | null; won_count: number }[]
      }
      fn_loss_analysis: {
        Args: { p_from: string; p_to: string }
        Returns: { kind: string; label: string; n: number }[]
      }
      fn_trend: {
        Args: { p_from: string; p_grain: string; p_to: string }
        Returns: { period: string; n: number }[]
      }
      fn_client_duplicates: {
        Args: never
        Returns: { a_id: string; b_id: string; reason: string; score: number }[]
      }
      merge_clients: {
        Args: { p_drop: string; p_keep: string }
        Returns: number
      }
      fn_revenue_by: {
        Args: { p_dimension: string; p_from: string; p_to: string }
        Returns: { label: string; currency: string; net_cents: number; payments: number }[]
      }
      fn_outstanding: {
        Args: never
        Returns: { currency: string; outstanding_cents: number; requests: number }[]
      }
      fn_delivery_stats: {
        Args: { p_from: string; p_to: string }
        Returns: { avg_days_deposit_to_completed: number | null; completed_count: number; refunded_share: number | null }[]
      }
      is_my_request: {
        Args: { p_request_id: string }
        Returns: boolean
      }
      resolve_price: {
        Args: { p_package_slug?: string; p_service_type: string }
        Returns: number
      }
      staff_role: {
        Args: never
        Returns: Database["public"]["Enums"]["staff_role"]
      }
    }
    Enums: {
      staff_role: "admin" | "agent" | "mentor" | "viewer"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      staff_role: ["admin", "agent", "mentor", "viewer"],
    },
  },
} as const

