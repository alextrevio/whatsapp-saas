export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          plan: 'free' | 'pro' | 'enterprise'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          white_label_config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>
      }
      sub_accounts: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['sub_accounts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['sub_accounts']['Insert']>
      }
      whatsapp_sessions: {
        Row: {
          id: string
          sub_account_id: string
          session_name: string
          qr_code: string | null
          status: 'disconnected' | 'connecting' | 'connected' | 'error'
          proxy_config: Json | null
          phone_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['whatsapp_sessions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['whatsapp_sessions']['Insert']>
      }
      contacts: {
        Row: {
          id: string
          sub_account_id: string
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
          sub_account_id: string
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
      api_keys: {
        Row: {
          id: string
          organization_id: string
          name: string
          key: string
          prefix: string
          permissions: string[]
          last_used_at: string | null
          expires_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['api_keys']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['api_keys']['Insert']>
      }
      campaigns: {
        Row: {
          id: string
          sub_account_id: string
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