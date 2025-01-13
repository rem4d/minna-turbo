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
          id: number
          kanji: string
          kun: string[] | null
          means: string | null
          on_: string[] | null
          position: number
        }
        Insert: {
          id?: number
          kanji?: string
          kun?: string[] | null
          means?: string | null
          on_?: string[] | null
          position: number
        }
        Update: {
          id?: number
          kanji?: string
          kun?: string[] | null
          means?: string | null
          on_?: string[] | null
          position?: number
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
          original_sentence: string | null
          pos: string
          pos_detail_1: string
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
          original_sentence?: string | null
          pos: string
          pos_detail_1?: string
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
          original_sentence?: string | null
          pos?: string
          pos_detail_1?: string
          ru?: string | null
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
      user_kanji_setting: {
        Row: {
          is_hidden: boolean
          kanji_id: number
          user_id: number
        }
        Insert: {
          is_hidden?: boolean
          kanji_id: number
          user_id: number
        }
        Update: {
          is_hidden?: boolean
          kanji_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_kanji_setting_kanji_id_fkey"
            columns: ["kanji_id"]
            isOneToOne: false
            referencedRelation: "kanji"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_kanji_setting_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: number
          last_visited: string | null
          setting_hide_kana: boolean
          setting_hide_translation: boolean
          telegram_id: string | null
          telegram_username: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          last_visited?: string | null
          setting_hide_kana?: boolean
          setting_hide_translation?: boolean
          telegram_id?: string | null
          telegram_username?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          last_visited?: string | null
          setting_hide_kana?: boolean
          setting_hide_translation?: boolean
          telegram_id?: string | null
          telegram_username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      additional_sentences:
        | {
            Args: Record<PropertyKey, never>
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
        | {
            Args: {
              k_set_input: number
              lvl_input: number
            }
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
        | {
            Args: {
              k_set_input: string
            }
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
        | {
            Args: {
              k_set_input: string
              lvl_input: number
            }
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
        Args: {
          k_set_input: number
          lvl_input: number
        }
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
      stat_kanji_list: {
        Args: {
          shift_input: number
        }
        Returns: {
          col1: string
          col2: number
          col3: number
        }[]
      }
      stat_kanji_list1: {
        Args: {
          shift_input: number
        }
        Returns: {
          col1: string
          col2: number
          col3: number
        }[]
      }
      stat_kanji_list2: {
        Args: {
          shift_input: number
        }
        Returns: {
          col1: string
          col2: number
          col3: number
        }[]
      }
      stat_kanji_list3: {
        Args: {
          shift_input: number
        }
        Returns: {
          kanji: string
          lvl: number
          cnt: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
