import { z } from 'zod'

// Auth schemas
export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  organizationName: z.string().min(2, 'El nombre de la organización debe tener al menos 2 caracteres'),
})

export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

// Organization schemas
export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  plan: z.enum(['free', 'pro', 'enterprise']).default('free'),
})

// Sub-account schemas
export const createSubAccountSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
})

// WhatsApp session schemas
export const createWhatsAppSessionSchema = z.object({
  sessionName: z.string().min(2, 'El nombre de la sesión debe tener al menos 2 caracteres'),
  proxyConfig: z.object({
    host: z.string().optional(),
    port: z.number().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
  }).optional(),
})

// Contact schemas
export const createContactSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Número de teléfono inválido'),
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
  customFields: z.record(z.unknown()).default({}),
})

// Message schemas
export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  messageType: z.enum(['text', 'image', 'video', 'audio', 'document', 'button', 'list']),
  content: z.string().min(1, 'El contenido es requerido'),
  mediaUrl: z.string().url().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>
export type CreateSubAccountInput = z.infer<typeof createSubAccountSchema>
export type CreateWhatsAppSessionInput = z.infer<typeof createWhatsAppSessionSchema>
export type CreateContactInput = z.infer<typeof createContactSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>