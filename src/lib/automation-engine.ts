import { supabaseAdmin } from './supabase-admin'

export interface AutomationTrigger {
  id: string
  name: string
  type: 'keyword' | 'time_delay' | 'tag_added' | 'message_received' | 'first_message'
  conditions: {
    keywords?: string[]
    delayHours?: number
    tags?: string[]
    timeOfDay?: string
    dayOfWeek?: number[]
  }
}

export interface AutomationAction {
  id: string
  type: 'send_message' | 'add_tag' | 'remove_tag' | 'notify_human' | 'update_lead_score' | 'webhook'
  data: {
    message?: string
    tags?: string[]
    webhookUrl?: string
    leadScoreChange?: number
    notifyEmail?: string
  }
  delayMinutes?: number
}

export interface AutomationWorkflow {
  id: string
  name: string
  description: string
  isActive: boolean
  trigger: AutomationTrigger
  actions: AutomationAction[]
  createdAt: string
  updatedAt: string
}

export class AutomationEngine {
  
  // Procesar mensaje entrante para triggers
  async processIncomingMessage(
    contactId: string,
    message: string,
    conversationId: string,
    sessionId: string
  ): Promise<void> {
    try {
      // Obtener workflows activos
      const workflows = await this.getActiveWorkflows()
      
      for (const workflow of workflows) {
        const shouldTrigger = await this.evaluateTrigger(
          workflow.trigger, 
          {
            contactId,
            message,
            conversationId,
            sessionId,
            isFirstMessage: await this.isFirstMessage(contactId)
          }
        )

        if (shouldTrigger) {
          console.log(`Triggering workflow: ${workflow.name} for contact: ${contactId}`)
          await this.executeWorkflow(workflow, contactId, conversationId, sessionId)
        }
      }
    } catch (error) {
      console.error('Error processing automation triggers:', error)
    }
  }

  private async evaluateTrigger(
    trigger: AutomationTrigger,
    context: {
      contactId: string
      message: string
      conversationId: string
      sessionId: string
      isFirstMessage: boolean
    }
  ): Promise<boolean> {
    switch (trigger.type) {
      case 'keyword':
        return this.evaluateKeywordTrigger(trigger.conditions.keywords || [], context.message)
      
      case 'first_message':
        return context.isFirstMessage
      
      case 'message_received':
        return true // Cualquier mensaje
      
      case 'tag_added':
        // Se evaluará cuando se agreguen tags
        return false
        
      case 'time_delay':
        // Se manejará con jobs programados
        return false
        
      default:
        return false
    }
  }

  private evaluateKeywordTrigger(keywords: string[], message: string): boolean {
    const lowerMessage = message.toLowerCase()
    return keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))
  }

  private async executeWorkflow(
    workflow: AutomationWorkflow,
    contactId: string,
    conversationId: string,
    sessionId: string
  ): Promise<void> {
    for (const action of workflow.actions) {
      try {
        // Aplicar delay si existe
        if (action.delayMinutes && action.delayMinutes > 0) {
          await this.scheduleDelayedAction(action, contactId, conversationId, sessionId, action.delayMinutes)
          continue
        }

        await this.executeAction(action, contactId, conversationId, sessionId)
      } catch (error) {
        console.error(`Error executing action ${action.type}:`, error)
      }
    }
  }

  private async executeAction(
    action: AutomationAction,
    contactId: string,
    conversationId: string,
    sessionId: string
  ): Promise<void> {
    switch (action.type) {
      case 'send_message':
        if (action.data.message) {
          await this.sendAutomatedMessage(conversationId, sessionId, action.data.message)
        }
        break

      case 'add_tag':
        if (action.data.tags) {
          await this.addTagsToContact(contactId, action.data.tags)
        }
        break

      case 'remove_tag':
        if (action.data.tags) {
          await this.removeTagsFromContact(contactId, action.data.tags)
        }
        break

      case 'update_lead_score':
        if (action.data.leadScoreChange) {
          await this.updateLeadScore(contactId, action.data.leadScoreChange)
        }
        break

      case 'notify_human':
        if (action.data.notifyEmail) {
          await this.notifyHuman(contactId, conversationId, action.data.notifyEmail)
        }
        break

      case 'webhook':
        if (action.data.webhookUrl) {
          await this.callWebhook(action.data.webhookUrl, {
            contactId,
            conversationId,
            sessionId,
            actionType: action.type
          })
        }
        break
    }
  }

  private async sendAutomatedMessage(
    conversationId: string,
    sessionId: string,
    message: string
  ): Promise<void> {
    // Integrar con WhatsApp manager
    const whatsappManager = (global as any).whatsappManager
    
    if (whatsappManager) {
      // Obtener información de la conversación
      const { data: conversation } = await supabaseAdmin
        .from('conversations')
        .select('contacts(*)')
        .eq('id', conversationId)
        .single()

      if (conversation && (conversation as any).contacts) {
        const contact = (conversation as any).contacts
        await whatsappManager.sendMessage(
          sessionId,
          contact.phone_number,
          message
        )

        // Guardar mensaje en BD
        await (supabaseAdmin as any)
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_type: 'bot',
            message_type: 'text',
            content: message,
            metadata: { automated: true }
          })
      }
    }
  }

  private async addTagsToContact(contactId: string, tags: string[]): Promise<void> {
    const { data: contact } = await supabaseAdmin
      .from('contacts')
      .select('tags')
      .eq('id', contactId)
      .single()

    if (contact) {
      const currentTags = (contact as any).tags || []
      const newTags = Array.from(new Set([...currentTags, ...tags]))

      await (supabaseAdmin as any)
        .from('contacts')
        .update({ tags: newTags })
        .eq('id', contactId)
    }
  }

  private async removeTagsFromContact(contactId: string, tags: string[]): Promise<void> {
    const { data: contact } = await supabaseAdmin
      .from('contacts')
      .select('tags')
      .eq('id', contactId)
      .single()

    if (contact) {
      const currentTags = (contact as any).tags || []
      const newTags = currentTags.filter((tag: string) => !tags.includes(tag))

      await (supabaseAdmin as any)
        .from('contacts')
        .update({ tags: newTags })
        .eq('id', contactId)
    }
  }

  private async updateLeadScore(contactId: string, scoreChange: number): Promise<void> {
    const { data: contact } = await supabaseAdmin
      .from('contacts')
      .select('lead_score')
      .eq('id', contactId)
      .single()

    if (contact) {
      const currentScore = (contact as any).lead_score || 0
      const newScore = Math.max(0, Math.min(100, currentScore + scoreChange))

      await (supabaseAdmin as any)
        .from('contacts')
        .update({ lead_score: newScore })
        .eq('id', contactId)
    }
  }

  private async notifyHuman(
    contactId: string,
    conversationId: string,
    email: string
  ): Promise<void> {
    // En una implementación real, enviarías email/notification
    console.log(`Human notification needed for contact ${contactId} - send to ${email}`)
  }

  private async callWebhook(url: string, data: any): Promise<void> {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.error('Webhook call failed:', error)
    }
  }

  private async scheduleDelayedAction(
    action: AutomationAction,
    contactId: string,
    conversationId: string,
    sessionId: string,
    delayMinutes: number
  ): Promise<void> {
    // En una implementación completa, usarías un job queue como Bull/Agenda
    setTimeout(async () => {
      await this.executeAction(action, contactId, conversationId, sessionId)
    }, delayMinutes * 60 * 1000)
  }

  private async isFirstMessage(contactId: string): Promise<boolean> {
    const { count } = await supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('contact_id', contactId)

    return (count || 0) <= 1
  }

  private async getActiveWorkflows(): Promise<AutomationWorkflow[]> {
    const { data } = await supabaseAdmin
      .from('automation_workflows')
      .select('*')
      .eq('is_active', true)

    return (data || []) as AutomationWorkflow[]
  }

  // API pública para gestión de workflows
  async createWorkflow(workflow: Omit<AutomationWorkflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<AutomationWorkflow> {
    const { data, error } = await (supabaseAdmin as any)
      .from('automation_workflows')
      .insert({
        ...workflow,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateWorkflow(id: string, updates: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> {
    const { data, error } = await (supabaseAdmin as any)
      .from('automation_workflows')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteWorkflow(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('automation_workflows')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async getWorkflows(): Promise<AutomationWorkflow[]> {
    const { data } = await supabaseAdmin
      .from('automation_workflows')
      .select('*')
      .order('created_at', { ascending: false })

    return (data || []) as AutomationWorkflow[]
  }
}

export const automationEngine = new AutomationEngine()