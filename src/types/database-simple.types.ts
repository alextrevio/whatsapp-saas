export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'user'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      whatsapp_sessions: {
        Row: {
          id: string
          user_id: string
          session_name: string
          qr_code: string | null
          status: 'disconnected' | 'connecting' | 'connected' | 'error'
          phone_number: string | null
          proxy_config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['whatsapp_sessions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['whatsapp_sessions']['Insert']>
      }
      contacts: {
        Row: {
          id: string
          phone_number: string
          name: string | null
          tags: string[]
          custom_fields: Json
          last_interaction: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['contacts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>
      }
      conversations: {
        Row: {
          id: string
          contact_id: string
          whatsapp_session_id: string
          status: 'open' | 'closed' | 'assigned'
          assigned_to: string | null
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: 'user' | 'contact'
          message_type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'button' | 'list'
          content: string
          media_url: string | null
          metadata: Json | null
          whatsapp_message_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      campaigns: {
        Row: {
          id: string
          created_by: string
          name: string
          message: string
          status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused'
          target_tags: string[]
          scheduled_at: string | null
          completed_at: string | null
          total_contacts: number
          sent_count: number
          delivered_count: number
          read_count: number
          failed_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>
      }
      webhooks: {
        Row: {
          id: string
          name: string
          url: string
          events: string[]
          secret: string
          is_active: boolean
          headers: Json
          retry_policy: Json
          total_triggers: number
          failed_triggers: number
          last_triggered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['webhooks']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['webhooks']['Insert']>
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
  }
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]