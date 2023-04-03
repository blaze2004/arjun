export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          id: number
          key: string | null
          owner: string | null
        }
        Insert: {
          id?: number
          key?: string | null
          owner?: string | null
        }
        Update: {
          id?: number
          key?: string | null
          owner?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          google_refresh_token: string | null
          id: string
          phone_number: string | null
          timeZone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          google_refresh_token?: string | null
          id: string
          phone_number?: string | null
          timeZone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          google_refresh_token?: string | null
          id?: string
          phone_number?: string | null
          timeZone?: string | null
          updated_at?: string | null
        }
      }
      testers: {
        Row: {
          created_at: string | null
          email: string
          id: number
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
        }
      }
      user_sessions: {
        Row: {
          expire: string | null
          sess: Json | null
          sid: string
        }
        Insert: {
          expire?: string | null
          sess?: Json | null
          sid: string
        }
        Update: {
          expire?: string | null
          sess?: Json | null
          sid?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
