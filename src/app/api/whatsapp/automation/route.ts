import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { automationEngine } from '@/lib/automation-engine'

export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workflows = await automationEngine.getWorkflows()
    
    return NextResponse.json({ workflows })

  } catch (error) {
    console.error('Error getting workflows:', error)
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

    const workflowData = await req.json()

    // Validar datos básicos
    if (!workflowData.name || !workflowData.trigger || !workflowData.actions) {
      return NextResponse.json({ error: 'Name, trigger, and actions are required' }, { status: 400 })
    }

    const workflow = await automationEngine.createWorkflow(workflowData)
    
    return NextResponse.json({ workflow })

  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...updates } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Workflow ID required' }, { status: 400 })
    }

    const workflow = await automationEngine.updateWorkflow(id, updates)
    
    return NextResponse.json({ workflow })

  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Workflow ID required' }, { status: 400 })
    }

    await automationEngine.deleteWorkflow(id)
    
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}