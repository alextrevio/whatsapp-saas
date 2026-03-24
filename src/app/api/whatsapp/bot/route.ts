import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { whatsappManager } from '@/lib/whatsapp'
import { DEFAULT_PERSONALITIES } from '@/lib/openai'

export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    const botStatus = whatsappManager.getBotStatus(sessionId)
    
    return NextResponse.json({
      botStatus,
      availablePersonalities: DEFAULT_PERSONALITIES
    })

  } catch (error) {
    console.error('Error getting bot status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, action, personalityId, autoReply } = await req.json()

    if (!sessionId || !action) {
      return NextResponse.json({ error: 'Session ID and action required' }, { status: 400 })
    }

    switch (action) {
      case 'enable':
        whatsappManager.enableBot(sessionId, personalityId || 'friendly', autoReply !== false)
        break

      case 'disable':
        whatsappManager.disableBot(sessionId)
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const botStatus = whatsappManager.getBotStatus(sessionId)
    
    return NextResponse.json({
      success: true,
      botStatus
    })

  } catch (error) {
    console.error('Error managing bot:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}