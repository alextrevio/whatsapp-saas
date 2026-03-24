import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabaseAdmin.from('profiles').select('count').limit(1)
    
    return NextResponse.json({
      status: 'ok',
      supabase: error ? 'error' : 'connected',
      error: error?.message,
      timestamp: new Date().toISOString(),
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'not_set',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'not_set',
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not_set'
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}