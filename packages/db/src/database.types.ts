export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      example: {
        Row: {
          id: string
          kana: string
          kanji_id: number | null
          means: string
          position: number | null
          postfix: string | null
          prefix: string | null
          sentence: string
        }
        Insert: {
          id?: string
          kana?: string
          kanji_id?: number | null
          means?: string
          position?: number | null
          postfix?: string | null
          prefix?: string | null
          sentence?: string
        }
        Update: {
          id?: string
          kana?: string
          kanji_id?: number | null
          means?: string
          position?: number | null
          postfix?: string | null
          prefix?: string | null
          sentence?: string
        }
        Relationships: [
          {
            foreignKeyName: "example_kanji_id_fkey"
            columns: ["kanji_id"]
            isOneToOne: false
            referencedRelation: "kanji"
            referencedColumns: ["id"]
          },
        ]
      }
      kanji: {
        Row: {
          en: string | null
          id: number
          kanji: string
          kun: string[] | null
          means: string | null
          on_: string[] | null
          position: number
          ru: string | null
          updated_at: string | null
        }
        Insert: {
          en?: string | null
          id?: number
          kanji?: string
          kun?: string[] | null
          means?: string | null
          on_?: string[] | null
          position: number
          ru?: string | null
          updated_at?: string | null
        }
        Update: {
          en?: string | null
          id?: number
          kanji?: string
          kun?: string[] | null
          means?: string | null
          on_?: string[] | null
          position?: number
          ru?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          basic_form: string
          created_at: string
          en: string | null
          id: number
          is_hidden: boolean | null
          is_invalid: boolean | null
          level: number | null
          original_sentence: string | null
          pos: string
          pos_detail_1: string
          reading: string | null
          ru: string | null
          ruby: string | null
          updated_at: string | null
        }
        Insert: {
          basic_form: string
          created_at?: string
          en?: string | null
          id?: number
          is_hidden?: boolean | null
          is_invalid?: boolean | null
          level?: number | null
          original_sentence?: string | null
          pos: string
          pos_detail_1?: string
          reading?: string | null
          ru?: string | null
          ruby?: string | null
          updated_at?: string | null
        }
        Update: {
          basic_form?: string
          created_at?: string
          en?: string | null
          id?: number
          is_hidden?: boolean | null
          is_invalid?: boolean | null
          level?: number | null
          original_sentence?: string | null
          pos?: string
          pos_detail_1?: string
          reading?: string | null
          ru?: string | null
          ruby?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      members2: {
        Row: {
          basic_form: string
          created_at: string
          en: string | null
          id: number
          is_hidden: boolean | null
          is_invalid: boolean | null
          level: number | null
          original: string | null
          pos: string
          reading: string | null
          ru: string
          ruby: string | null
          updated_at: string | null
        }
        Insert: {
          basic_form: string
          created_at?: string
          en?: string | null
          id?: number
          is_hidden?: boolean | null
          is_invalid?: boolean | null
          level?: number | null
          original?: string | null
          pos: string
          reading?: string | null
          ru: string
          ruby?: string | null
          updated_at?: string | null
        }
        Update: {
          basic_form?: string
          created_at?: string
          en?: string | null
          id?: number
          is_hidden?: boolean | null
          is_invalid?: boolean | null
          level?: number | null
          original?: string | null
          pos?: string
          reading?: string | null
          ru?: string
          ruby?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sentence_member: {
        Row: {
          member_id: number
          position: number
          sentence_id: number
        }
        Insert: {
          member_id?: number
          position?: number
          sentence_id?: number
        }
        Update: {
          member_id?: number
          position?: number
          sentence_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sentence_member_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentence_member_sentence_id_fkey"
            columns: ["sentence_id"]
            isOneToOne: false
            referencedRelation: "sentences"
            referencedColumns: ["id"]
          },
        ]
      }
      sentence_member2: {
        Row: {
          member_id: number
          position: number
          sentence_id: number
        }
        Insert: {
          member_id?: number
          position?: number
          sentence_id?: number
        }
        Update: {
          member_id?: number
          position?: number
          sentence_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sentence_member2_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentence_member2_sentence_id_fkey"
            columns: ["sentence_id"]
            isOneToOne: false
            referencedRelation: "sentences"
            referencedColumns: ["id"]
          },
        ]
      }
      sentences: {
        Row: {
          created_at: string
          en: string | null
          id: number
          level: number | null
          ru: string | null
          ruby: string | null
          source: string | null
          status: string
          text: string
          text_with_furigana: string | null
          translation: string | null
          unknown_kanji_number: number | null
          updated_at: string | null
          vox_file_path: string | null
          vox_speaker_id: number | null
        }
        Insert: {
          created_at?: string
          en?: string | null
          id?: number
          level?: number | null
          ru?: string | null
          ruby?: string | null
          source?: string | null
          status?: string
          text?: string
          text_with_furigana?: string | null
          translation?: string | null
          unknown_kanji_number?: number | null
          updated_at?: string | null
          vox_file_path?: string | null
          vox_speaker_id?: number | null
        }
        Update: {
          created_at?: string
          en?: string | null
          id?: number
          level?: number | null
          ru?: string | null
          ruby?: string | null
          source?: string | null
          status?: string
          text?: string
          text_with_furigana?: string | null
          translation?: string | null
          unknown_kanji_number?: number | null
          updated_at?: string | null
          vox_file_path?: string | null
          vox_speaker_id?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          id: number
          last_visited: string | null
          level: number
          setting_hide_kana: boolean
          setting_hide_translation: boolean
          telegram_id: string | null
          telegram_username: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          last_visited?: string | null
          level?: number
          setting_hide_kana?: boolean
          setting_hide_translation?: boolean
          telegram_id?: string | null
          telegram_username?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          last_visited?: string | null
          level?: number
          setting_hide_kana?: boolean
          setting_hide_translation?: boolean
          telegram_id?: string | null
          telegram_username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      suggested_vocabularies: {
        Row: {
          basic_form: string | null
          cnt: number | null
          en: string | null
          level: number | null
          member_id: number | null
          pos: string | null
          reading: string | null
          ruby: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentence_member_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      suggested_vocabularies_list: {
        Row: {
          cnt: number | null
          level_from: number | null
          level_to: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      additional_sentences: {
        Args:
          | Record<PropertyKey, never>
          | { k_set_input: number; lvl_input: number }
          | { k_set_input: string }
          | { k_set_input: string; lvl_input: number }
        Returns: {
          created_at: string
          en: string | null
          id: number
          level: number | null
          ru: string | null
          ruby: string | null
          source: string | null
          status: string
          text: string
          text_with_furigana: string | null
          translation: string | null
          unknown_kanji_number: number | null
          updated_at: string | null
          vox_file_path: string | null
          vox_speaker_id: number | null
        }[]
      }
      additional_sentences_p: {
        Args: { k_set_input: number; lvl_input: number }
        Returns: {
          en: string
          id: number
          level: number
          ru: string
          ruby: string
          text: string
          text_with_furigana: string
          vox_file_path: string
          vox_speaker_id: number
        }[]
      }
      kanji_examples: {
        Args: { kanji_input: string }
        Returns: {
          basic_form: string
          cnt: number
          en: string
          reading: string
        }[]
      }
      stat_kanji_list: {
        Args: { shift_input: number }
        Returns: {
          col1: string
          col2: number
          col3: number
        }[]
      }
      stat_kanji_list1: {
        Args: { shift_input: number }
        Returns: {
          col1: string
          col2: number
          col3: number
        }[]
      }
      stat_kanji_list2: {
        Args: { shift_input: number }
        Returns: {
          col1: string
          col2: number
          col3: number
        }[]
      }
      stat_kanji_list3: {
        Args: { shift_input: number }
        Returns: {
          cnt: number
          kanji: string
          lvl: number
        }[]
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
