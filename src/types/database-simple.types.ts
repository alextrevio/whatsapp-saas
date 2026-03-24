export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          plan: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          plan?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          organization_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          organization_id: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          organization_id?: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
          updated_at?: string
        }
      }
      whatsapp_sessions: {
        Row: {
          id: string
          name: string
          phone_number: string | null
          status: 'connecting' | 'connected' | 'disconnected' | 'error'
          qr_code: string | null
          organization_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone_number?: string | null
          status?: 'connecting' | 'connected' | 'disconnected' | 'error'
          qr_code?: string | null
          organization_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone_number?: string | null
          status?: 'connecting' | 'connected' | 'disconnected' | 'error'
          qr_code?: string | null
          organization_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          phone_number: string
          email: string | null
          tags: string[]
          custom_fields: Record<string, unknown>
          sub_account_id: string
          organization_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone_number: string
          email?: string | null
          tags?: string[]
          custom_fields?: Record<string, unknown>
          sub_account_id: string
          organization_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone_number?: string
          email?: string | null
          tags?: string[]
          custom_fields?: Record<string, unknown>
          sub_account_id?: string
          organization_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          contact_id: string
          session_id: string
          last_message: string | null
          last_message_at: string | null
          sub_account_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contact_id: string
          session_id: string
          last_message?: string | null
          last_message_at?: string | null
          sub_account_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          session_id?: string
          last_message?: string | null
          last_message_at?: string | null
          sub_account_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: 'user' | 'contact'
          message_type: 'text' | 'image' | 'document' | 'audio'
          content: string
          media_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_type: 'user' | 'contact'
          message_type?: 'text' | 'image' | 'document' | 'audio'
          content: string
          media_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_type?: 'user' | 'contact'
          message_type?: 'text' | 'image' | 'document' | 'audio'
          content?: string
          media_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}