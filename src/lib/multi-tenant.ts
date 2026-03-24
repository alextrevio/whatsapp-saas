import { supabaseAdmin } from './supabase'
import type { Database } from '@/types/database.types'

type Organization = Database['public']['Tables']['organizations']['Row']
type SubAccount = Database['public']['Tables']['sub_accounts']['Row']

export interface AgencyStats {
  totalSubAccounts: number
  activeSubAccounts: number
  totalContacts: number
  totalMessages: number
  totalCampaigns: number
  activeSessions: number
}

export interface SubAccountUsage {
  subAccount: SubAccount
  contacts: number
  messages: number
  campaigns: number
  sessions: number
  lastActivity?: string
}

// Obtener estadísticas de agencia
export async function getAgencyStats(organizationId: string): Promise<AgencyStats> {
  try {
    // Sub-cuentas
    const { count: totalSubAccounts } = await supabaseAdmin
      .from('sub_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)

    const { count: activeSubAccounts } = await supabaseAdmin
      .from('sub_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_active', true)

    // Contactos totales
    const { count: totalContacts } = await supabaseAdmin
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .in('sub_account_id', 
        (await supabaseAdmin
          .from('sub_accounts')
          .select('id')
          .eq('organization_id', organizationId)
        ).data?.map(s => s.id) || []
      )

    // Mensajes totales
    const { count: totalMessages } = await supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .in('conversation_id',
        (await supabaseAdmin
          .from('conversations')
          .select('id')
          .in('sub_account_id',
            (await supabaseAdmin
              .from('sub_accounts')
              .select('id')
              .eq('organization_id', organizationId)
            ).data?.map(s => s.id) || []
          )
        ).data?.map(c => c.id) || []
      )

    // Campañas totales
    const { count: totalCampaigns } = await supabaseAdmin
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .in('sub_account_id',
        (await supabaseAdmin
          .from('sub_accounts')
          .select('id')
          .eq('organization_id', organizationId)
        ).data?.map(s => s.id) || []
      )

    // Sesiones activas
    const { count: activeSessions } = await supabaseAdmin
      .from('whatsapp_sessions')
      .select('*', { count: 'exact', head: true })
      .in('sub_account_id',
        (await supabaseAdmin
          .from('sub_accounts')
          .select('id')
          .eq('organization_id', organizationId)
        ).data?.map(s => s.id) || []
      )
      .eq('status', 'connected')

    return {
      totalSubAccounts: totalSubAccounts || 0,
      activeSubAccounts: activeSubAccounts || 0,
      totalContacts: totalContacts || 0,
      totalMessages: totalMessages || 0,
      totalCampaigns: totalCampaigns || 0,
      activeSessions: activeSessions || 0
    }

  } catch (error) {
    console.error('Error getting agency stats:', error)
    throw error
  }
}

// Obtener uso detallado por sub-cuenta
export async function getSubAccountsUsage(organizationId: string): Promise<SubAccountUsage[]> {
  try {
    const { data: subAccounts } = await supabaseAdmin
      .from('sub_accounts')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (!subAccounts) return []

    const usage: SubAccountUsage[] = []

    for (const subAccount of subAccounts) {
      // Contar contactos
      const { count: contacts } = await supabaseAdmin
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('sub_account_id', subAccount.id)

      // Contar mensajes
      const { count: messages } = await supabaseAdmin
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id',
          (await supabaseAdmin
            .from('conversations')
            .select('id')
            .eq('sub_account_id', subAccount.id)
          ).data?.map(c => c.id) || []
        )

      // Contar campañas
      const { count: campaigns } = await supabaseAdmin
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('sub_account_id', subAccount.id)

      // Contar sesiones
      const { count: sessions } = await supabaseAdmin
        .from('whatsapp_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('sub_account_id', subAccount.id)

      // Última actividad
      const { data: lastMessage } = await supabaseAdmin
        .from('messages')
        .select('created_at')
        .in('conversation_id',
          (await supabaseAdmin
            .from('conversations')
            .select('id')
            .eq('sub_account_id', subAccount.id)
          ).data?.map(c => c.id) || []
        )
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      usage.push({
        subAccount,
        contacts: contacts || 0,
        messages: messages || 0,
        campaigns: campaigns || 0,
        sessions: sessions || 0,
        lastActivity: lastMessage?.created_at
      })
    }

    return usage

  } catch (error) {
    console.error('Error getting sub-accounts usage:', error)
    throw error
  }
}

// Crear nueva sub-cuenta
export async function createSubAccount(
  organizationId: string,
  name: string,
  description?: string
): Promise<SubAccount> {
  try {
    const { data, error } = await supabaseAdmin
      .from('sub_accounts')
      .insert({
        organization_id: organizationId,
        name,
        description,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    return data

  } catch (error) {
    console.error('Error creating sub-account:', error)
    throw error
  }
}

// Actualizar sub-cuenta
export async function updateSubAccount(
  subAccountId: string,
  updates: Partial<Pick<SubAccount, 'name' | 'description' | 'is_active'>>
): Promise<SubAccount> {
  try {
    const { data, error } = await supabaseAdmin
      .from('sub_accounts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', subAccountId)
      .select()
      .single()

    if (error) throw error
    return data

  } catch (error) {
    console.error('Error updating sub-account:', error)
    throw error
  }
}

// Eliminar sub-cuenta (soft delete)
export async function deleteSubAccount(subAccountId: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('sub_accounts')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', subAccountId)

    if (error) throw error

  } catch (error) {
    console.error('Error deleting sub-account:', error)
    throw error
  }
}

// Verificar si una organización tiene acceso a agency features
export function hasAgencyAccess(plan: string): boolean {
  return ['pro', 'enterprise'].includes(plan)
}

// Obtener límites de sub-cuentas por plan
export function getSubAccountLimits(plan: string): number {
  const limits = {
    free: 1,
    pro: 5,
    enterprise: -1 // Ilimitado
  }
  return limits[plan as keyof typeof limits] || 1
}

// Verificar si se puede crear una nueva sub-cuenta
export async function canCreateSubAccount(organizationId: string): Promise<{
  allowed: boolean
  reason?: string
  current: number
  limit: number
}> {
  try {
    // Obtener plan de la organización
    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('plan')
      .eq('id', organizationId)
      .single()

    if (!org) {
      return { allowed: false, reason: 'Organization not found', current: 0, limit: 0 }
    }

    // Verificar si tiene acceso a agency
    if (!hasAgencyAccess(org.plan)) {
      return { 
        allowed: false, 
        reason: 'Agency features require Pro or Enterprise plan',
        current: 0,
        limit: 0
      }
    }

    // Contar sub-cuentas actuales
    const { count: currentSubAccounts } = await supabaseAdmin
      .from('sub_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_active', true)

    const limit = getSubAccountLimits(org.plan)
    const current = currentSubAccounts || 0

    // Si es ilimitado (enterprise)
    if (limit === -1) {
      return { allowed: true, current, limit }
    }

    // Verificar límite
    if (current >= limit) {
      return { 
        allowed: false, 
        reason: `Sub-account limit reached (${current}/${limit})`,
        current,
        limit
      }
    }

    return { allowed: true, current, limit }

  } catch (error) {
    console.error('Error checking sub-account creation:', error)
    return { allowed: false, reason: 'Error checking permissions', current: 0, limit: 0 }
  }
}

// Obtener actividad reciente de la agencia
export async function getAgencyActivity(
  organizationId: string,
  limit: number = 10
): Promise<Array<{
  type: 'message' | 'contact' | 'campaign' | 'session'
  description: string
  subAccountName: string
  timestamp: string
}>> {
  try {
    const activity: Array<{
      type: 'message' | 'contact' | 'campaign' | 'session'
      description: string
      subAccountName: string
      timestamp: string
    }> = []

    // Obtener sub-cuentas
    const { data: subAccounts } = await supabaseAdmin
      .from('sub_accounts')
      .select('id, name')
      .eq('organization_id', organizationId)

    if (!subAccounts) return activity

    const subAccountIds = subAccounts.map(s => s.id)
    const subAccountsMap = Object.fromEntries(subAccounts.map(s => [s.id, s.name]))

    // Mensajes recientes
    const { data: recentMessages } = await supabaseAdmin
      .from('messages')
      .select(`
        created_at,
        sender_type,
        conversations(sub_account_id)
      `)
      .in('conversation_id',
        (await supabaseAdmin
          .from('conversations')
          .select('id')
          .in('sub_account_id', subAccountIds)
        ).data?.map(c => c.id) || []
      )
      .order('created_at', { ascending: false })
      .limit(5)

    recentMessages?.forEach(msg => {
      if (msg.conversations) {
        activity.push({
          type: 'message',
          description: `${msg.sender_type === 'user' ? 'Mensaje enviado' : 'Mensaje recibido'}`,
          subAccountName: subAccountsMap[msg.conversations.sub_account_id] || 'Unknown',
          timestamp: msg.created_at
        })
      }
    })

    // Contactos recientes
    const { data: recentContacts } = await supabaseAdmin
      .from('contacts')
      .select('created_at, name, sub_account_id')
      .in('sub_account_id', subAccountIds)
      .order('created_at', { ascending: false })
      .limit(3)

    recentContacts?.forEach(contact => {
      activity.push({
        type: 'contact',
        description: `Nuevo contacto: ${contact.name || 'Sin nombre'}`,
        subAccountName: subAccountsMap[contact.sub_account_id] || 'Unknown',
        timestamp: contact.created_at
      })
    })

    // Ordenar por timestamp y limitar
    return activity
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

  } catch (error) {
    console.error('Error getting agency activity:', error)
    return []
  }
}