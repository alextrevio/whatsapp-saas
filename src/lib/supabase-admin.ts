import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database-simple.types'

// Cliente administrativo para APIs server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Cliente para autenticación en APIs
export const supabaseAuth = createClient<Database>(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)