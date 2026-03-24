-- Extensiones para automatizaciones y IA
-- Ejecutar esto en Supabase SQL Editor

-- Tabla para workflows de automatización
CREATE TABLE IF NOT EXISTS automation_workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    trigger JSONB NOT NULL, -- {type: 'keyword', conditions: {...}}
    actions JSONB NOT NULL, -- [{type: 'send_message', data: {...}}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar campos a la tabla contacts para IA
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_interaction TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS interaction_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS conversation_context JSONB DEFAULT '{}';

-- Agregar campos a la tabla conversations para IA
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS bot_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS human_handoff_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_bot_response TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS conversation_intent VARCHAR(100);

-- Agregar campos a la tabla messages para IA
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS sender_type VARCHAR(20) DEFAULT 'user', -- 'user', 'bot', 'human'
ADD COLUMN IF NOT EXISTS intent VARCHAR(100),
ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS automated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS bot_personality VARCHAR(50);

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
    event_type VARCHAR(50) NOT NULL, -- 'message_sent', 'intent_detected', 'handoff_requested'
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

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_contacts_lead_score ON contacts(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_last_interaction ON contacts(last_interaction DESC);
CREATE INDEX IF NOT EXISTS idx_messages_automated ON messages(automated) WHERE automated = true;
CREATE INDEX IF NOT EXISTS idx_messages_intent ON messages(intent);
CREATE INDEX IF NOT EXISTS idx_ai_metrics_timestamp ON ai_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_active ON automation_workflows(is_active) WHERE is_active = true;

-- RLS Policies (Row Level Security)
ALTER TABLE automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Policy para automation_workflows (ejemplo - ajustar según tu auth)
CREATE POLICY "Users can manage their automation workflows" ON automation_workflows
    FOR ALL USING (true); -- Ajustar según tu esquema de auth

-- Policy para bot_configurations
CREATE POLICY "Users can manage their bot configurations" ON bot_configurations
    FOR ALL USING (true); -- Ajustar según tu esquema de auth

-- Policy para ai_metrics
CREATE POLICY "Users can view their AI metrics" ON ai_metrics
    FOR SELECT USING (true); -- Ajustar según tu esquema de auth

-- Policy para automation_logs
CREATE POLICY "Users can view their automation logs" ON automation_logs
    FOR SELECT USING (true); -- Ajustar según tu esquema de auth

-- Funciones útiles para métricas
CREATE OR REPLACE FUNCTION get_contact_lead_score_history(contact_uuid UUID)
RETURNS TABLE(date DATE, score INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(created_at) as date,
        lead_score as score
    FROM ai_metrics 
    WHERE contact_id = contact_uuid 
        AND event_type = 'lead_score_updated'
    ORDER BY created_at;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar timestamps automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_automation_workflows_updated_at 
    BEFORE UPDATE ON automation_workflows 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_configurations_updated_at 
    BEFORE UPDATE ON bot_configurations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para limpiar logs antiguos (ejecutar como cron job)
CREATE OR REPLACE FUNCTION cleanup_old_logs(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM ai_metrics 
    WHERE timestamp < NOW() - INTERVAL '1 day' * days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comentarios para documentación
COMMENT ON TABLE automation_workflows IS 'Workflows de automatización configurados por el usuario';
COMMENT ON TABLE bot_configurations IS 'Configuración de bots IA por sesión WhatsApp';
COMMENT ON TABLE ai_metrics IS 'Métricas y eventos generados por la IA';
COMMENT ON TABLE automation_logs IS 'Logs de ejecución de automatizaciones';

COMMENT ON COLUMN contacts.lead_score IS 'Puntuación de lead de 0-100 generada por IA';
COMMENT ON COLUMN conversations.bot_enabled IS 'Si el bot IA está activo en esta conversación';
COMMENT ON COLUMN messages.intent IS 'Intención detectada por IA: greeting, question, interest, etc';

-- Datos iniciales para testing
INSERT INTO automation_workflows (name, description, is_active, trigger, actions) 
VALUES 
(
    'Saludo Automático',
    'Responde automáticamente a saludos nuevos',
    true,
    '{"type": "keyword", "conditions": {"keywords": ["hola", "buenos días", "buenas tardes", "hey"]}}',
    '[{"type": "send_message", "data": {"message": "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?"}, "delayMinutes": 0}]'
),
(
    'Información de Productos',
    'Responde a preguntas sobre productos',
    true,
    '{"type": "keyword", "conditions": {"keywords": ["producto", "precio", "información", "catalogo"]}}',
    '[{"type": "send_message", "data": {"message": "Te puedo ayudar con información de nuestros productos. ¿Hay algo específico que te interese?"}, "delayMinutes": 0}, {"type": "add_tag", "data": {"tags": ["interesado_productos"]}}]'
)
ON CONFLICT DO NOTHING;

-- Verificar que todo se creó correctamente
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('automation_workflows', 'bot_configurations', 'ai_metrics', 'automation_logs')
ORDER BY table_name, ordinal_position;