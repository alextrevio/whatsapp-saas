import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export interface BotPersonality {
  id: string
  name: string
  description: string
  prompt: string
  temperature: number
  maxTokens: number
}

export interface ConversationContext {
  contactName?: string
  contactPhone: string
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  tags: string[]
  lastActivity: string
  leadScore?: number
}

export class WhatsAppBotEngine {
  private personality: BotPersonality
  
  constructor(personality: BotPersonality) {
    this.personality = personality
  }

  async generateResponse(
    message: string, 
    context: ConversationContext
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context)
    const messages = this.buildMessageHistory(message, context)

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: this.personality.temperature,
        max_tokens: this.personality.maxTokens,
      })

      return completion.choices[0]?.message?.content || 'Lo siento, no pude procesar tu mensaje.'
    } catch (error) {
      console.error('OpenAI API Error:', error)
      return 'Disculpa, estoy experimentando problemas técnicos. Por favor intenta de nuevo.'
    }
  }

  private buildSystemPrompt(context: ConversationContext): string {
    const basePrompt = this.personality.prompt
    const contactInfo = context.contactName ? `El contacto se llama ${context.contactName}` : 'Contacto sin nombre registrado'
    const tags = context.tags.length > 0 ? `Tags del contacto: ${context.tags.join(', ')}` : ''
    
    return `${basePrompt}

INFORMACIÓN DEL CONTACTO:
- ${contactInfo}
- Teléfono: ${context.contactPhone}
- ${tags}
- Última actividad: ${context.lastActivity}

INSTRUCCIONES:
- Responde de manera natural y conversacional
- Usa el nombre del contacto cuando sea apropiado
- Mantén el tono de la personalidad definida
- Si el usuario pide hablar con un humano, indica que lo transferirás
- Máximo 200 caracteres por respuesta (WhatsApp limit)
- Nunca reveles que eres un bot a menos que te pregunten directamente`
  }

  private buildMessageHistory(
    currentMessage: string, 
    context: ConversationContext
  ): Array<{ role: 'user' | 'assistant', content: string }> {
    const history = context.conversationHistory
      .slice(-10) // Solo últimos 10 mensajes para no exceder límites
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))

    // Agregar mensaje actual
    history.push({ role: 'user', content: currentMessage })

    return history
  }

  // Detectar si el usuario quiere hablar con humano
  detectHumanHandoff(message: string): boolean {
    const handoffKeywords = [
      'humano', 'persona', 'agente', 'representante',
      'hablar con alguien', 'atención al cliente',
      'supervisor', 'manager', 'vendedor'
    ]

    const lowerMessage = message.toLowerCase()
    return handoffKeywords.some(keyword => lowerMessage.includes(keyword))
  }

  // Detectar intent/propósito del mensaje
  detectIntent(message: string): 'greeting' | 'question' | 'complaint' | 'interest' | 'goodbye' | 'other' {
    const lowerMessage = message.toLowerCase()

    // Saludos
    if (['hola', 'buenos', 'buenas', 'saludos', 'hey'].some(word => lowerMessage.includes(word))) {
      return 'greeting'
    }

    // Preguntas
    if (['?', 'cómo', 'cuándo', 'dónde', 'qué', 'por qué', 'precio', 'costo'].some(word => lowerMessage.includes(word))) {
      return 'question'
    }

    // Interés/compra
    if (['quiero', 'necesito', 'comprar', 'cotización', 'información', 'interesa'].some(word => lowerMessage.includes(word))) {
      return 'interest'
    }

    // Despedidas
    if (['adiós', 'bye', 'gracias', 'hasta luego', 'nos vemos'].some(word => lowerMessage.includes(word))) {
      return 'goodbye'
    }

    // Quejas
    if (['problema', 'error', 'mal', 'falla', 'queja', 'reclamo'].some(word => lowerMessage.includes(word))) {
      return 'complaint'
    }

    return 'other'
  }
}

// Personalidades predefinidas
export const DEFAULT_PERSONALITIES: BotPersonality[] = [
  {
    id: 'sales',
    name: 'Vendedor Profesional',
    description: 'Enfocado en generar leads y cerrar ventas',
    prompt: `Eres un vendedor profesional y experto en WhatsApp. Tu objetivo es:
- Generar interés en nuestros productos/servicios
- Calificar leads potenciales
- Programar citas o demos
- Mantener conversaciones amigables pero orientadas a resultados
- Usar técnicas de venta consultiva
- Crear urgencia cuando sea apropiado`,
    temperature: 0.7,
    maxTokens: 150
  },
  {
    id: 'support',
    name: 'Soporte Técnico',
    description: 'Especializado en resolver problemas y dudas',
    prompt: `Eres un agente de soporte técnico especializado. Tu objetivo es:
- Resolver problemas técnicos de forma clara
- Proporcionar instrucciones paso a paso
- Ser paciente y empático
- Escalar a humanos cuando sea necesario
- Documentar problemas para mejorar el servicio`,
    temperature: 0.3,
    maxTokens: 200
  },
  {
    id: 'friendly',
    name: 'Asistente Amigable',
    description: 'Conversacional y orientado al customer service',
    prompt: `Eres un asistente virtual amigable y servicial. Tu objetivo es:
- Proporcionar información sobre la empresa
- Responder preguntas frecuentes
- Dirigir consultas al departamento correcto
- Mantener un tono cálido y profesional
- Hacer que los clientes se sientan valorados`,
    temperature: 0.8,
    maxTokens: 180
  }
]