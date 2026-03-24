-- Crear tablas principales para WhatsApp SaaS
-- Ejecutar en Supabase SQL Editor

-- Tabla de organizaciones
CREATE TABLE IF NOT EXISTS organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'owner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sesiones WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'disconnected',
    qr_code TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contactos
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}',
    sub_account_id VARCHAR(255),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    lead_score INTEGER DEFAULT 0,
    last_interaction TIMESTAMP WITH TIME ZONE,
    interaction_count INTEGER DEFAULT 0,
    conversation_context JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    session_id UUID,
    whatsapp_session_id UUID REFERENCES whatsapp_sessions(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    sub_account_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open',
    bot_enabled BOOLEAN DEFAULT false,
    human_handoff_requested BOOLEAN DEFAULT false,
    last_bot_response TIMESTAMP WITH TIME ZONE,
    conversation_intent VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) DEFAULT 'user', -- 'user', 'contact', 'bot', 'human'
    message_type VARCHAR(20) DEFAULT 'text',
    content TEXT NOT NULL,
    media_url TEXT,
    metadata JSONB DEFAULT '{}',
    whatsapp_message_id VARCHAR(255),
    intent VARCHAR(100),
    confidence_score DECIMAL(3,2),
    automated BOOLEAN DEFAULT false,
    bot_personality VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para workflows de automatización
CREATE TABLE IF NOT EXISTS automation_workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    trigger JSONB NOT NULL,
    actions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para configuración de bots por sesión
CREATE TABLE IF NOT EXISTS bot_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES whatsapp_sessions(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT false,
    personality_id VARCHAR(50) DEFAULT 'friendly',
    auto_reply BOOLEAN DEFAULT true,
    business_hours_only BOOLEAN DEFAULT false,
    response_delay_seconds INTEGER DEFAULT 2,
    handoff_keywords TEXT[] DEFAULT array['humano', 'persona', 'agente'],
    welcome_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id)
);

-- Tabla para métricas de IA
CREATE TABLE IF NOT EXISTS ai_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES whatsapp_sessions(id),
    contact_id UUID REFERENCES contacts(id),
    conversation_id UUID REFERENCES conversations(id),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para logs de automatización
CREATE TABLE IF NOT EXISTS automation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES automation_workflows(id),
    contact_id UUID REFERENCES contacts(id),
    trigger_data JSONB,
    actions_executed JSONB,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
BEGIN
    -- Crear organización
    INSERT INTO organizations (name) VALUES ('Mi Organización') RETURNING id INTO new_org_id;
    
    -- Crear perfil
    INSERT INTO profiles (id, email, organization_id) 
    VALUES (NEW.id, NEW.email, new_org_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Habilitar RLS (Row Level Security)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas
CREATE POLICY "Users can view their own profiles" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profiles" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view their WhatsApp sessions" ON whatsapp_sessions
    FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage their contacts" ON contacts
    FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage their conversations" ON conversations
    FOR ALL USING (contact_id IN (SELECT id FROM contacts WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())));

CREATE POLICY "Users can manage their messages" ON messages
    FOR ALL USING (conversation_id IN (SELECT id FROM conversations WHERE contact_id IN (SELECT id FROM contacts WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()))));

CREATE POLICY "Users can manage their automation workflows" ON automation_workflows
    FOR ALL USING (true);

CREATE POLICY "Users can manage their bot configurations" ON bot_configurations
    FOR ALL USING (session_id IN (SELECT id FROM whatsapp_sessions WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())));

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_contacts_organization ON contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_contact ON conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_org ON whatsapp_sessions(organization_id);

-- Datos iniciales
INSERT INTO automation_workflows (name, description, is_active, trigger, actions) VALUES 
(
    'Saludo Automático',
    'Responde automáticamente a saludos',
    true,
    '{"type": "keyword", "conditions": {"keywords": ["hola", "buenos días", "buenas tardes", "hey", "saludos"]}}',
    '[{"type": "send_message", "data": {"message": "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?"}, "delayMinutes": 0}]'
),
(
    'Información de Productos',
    'Responde a consultas sobre productos',
    true,
    '{"type": "keyword", "conditions": {"keywords": ["producto", "precio", "información", "catalogo", "servicio"]}}',
    '[{"type": "send_message", "data": {"message": "Te puedo ayudar con información de nuestros productos. ¿Hay algo específico que te interese?"}, "delayMinutes": 0}, {"type": "add_tag", "data": {"tags": ["interesado_productos"]}}]'
)
ON CONFLICT DO NOTHING;