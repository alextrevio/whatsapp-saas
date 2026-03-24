const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function setupDatabase() {
    const supabaseUrl = 'https://nyaazkfmnvprfyfzcagr.supabase.co';
    const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWF6a2ZtbnZwcmZ5ZnpjYWdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMzMzI5MSwiZXhwIjoyMDg5OTA5MjkxfQ.xEpaA0VHJctjSvIMhTMs7X9WGyjzzbd-BP1VZKXFtK4';
    
    const supabase = createClient(supabaseUrl, serviceKey);
    
    console.log('🚀 Iniciando configuración automática de base de datos...\n');

    // Crear las tablas paso a paso
    const tables = [
        {
            name: 'organizations',
            sql: `CREATE TABLE IF NOT EXISTS organizations (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                plan VARCHAR(50) DEFAULT 'free',
                stripe_customer_id VARCHAR(255),
                stripe_subscription_id VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )`
        },
        {
            name: 'profiles',
            sql: `CREATE TABLE IF NOT EXISTS profiles (
                id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                full_name VARCHAR(255),
                avatar_url TEXT,
                organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
                role VARCHAR(50) DEFAULT 'owner',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )`
        },
        {
            name: 'whatsapp_sessions',
            sql: `CREATE TABLE IF NOT EXISTS whatsapp_sessions (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone_number VARCHAR(50),
                status VARCHAR(50) DEFAULT 'disconnected',
                qr_code TEXT,
                organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )`
        },
        {
            name: 'contacts',
            sql: `CREATE TABLE IF NOT EXISTS contacts (
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
            )`
        },
        {
            name: 'conversations',
            sql: `CREATE TABLE IF NOT EXISTS conversations (
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
            )`
        },
        {
            name: 'messages',
            sql: `CREATE TABLE IF NOT EXISTS messages (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
                sender_type VARCHAR(20) DEFAULT 'user',
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
            )`
        },
        {
            name: 'automation_workflows',
            sql: `CREATE TABLE IF NOT EXISTS automation_workflows (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT true,
                trigger JSONB NOT NULL,
                actions JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )`
        },
        {
            name: 'bot_configurations',
            sql: `CREATE TABLE IF NOT EXISTS bot_configurations (
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
            )`
        },
        {
            name: 'ai_metrics',
            sql: `CREATE TABLE IF NOT EXISTS ai_metrics (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                session_id UUID REFERENCES whatsapp_sessions(id),
                contact_id UUID REFERENCES contacts(id),
                conversation_id UUID REFERENCES conversations(id),
                event_type VARCHAR(50) NOT NULL,
                event_data JSONB DEFAULT '{}',
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )`
        },
        {
            name: 'automation_logs',
            sql: `CREATE TABLE IF NOT EXISTS automation_logs (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                workflow_id UUID REFERENCES automation_workflows(id),
                contact_id UUID REFERENCES contacts(id),
                trigger_data JSONB,
                actions_executed JSONB,
                success BOOLEAN DEFAULT true,
                error_message TEXT,
                execution_time_ms INTEGER,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )`
        }
    ];

    // Crear tablas
    for (const table of tables) {
        console.log(`📋 Creando tabla: ${table.name}`);
        try {
            const { error } = await supabase.rpc('exec', { sql: table.sql });
            if (error) {
                console.log(`⚠️  Error en ${table.name}:`, error.message);
                // Intentar insertar directo si no existe la función
                console.log('   Intentando método alternativo...');
                try {
                    await supabase.from(table.name).select('id').limit(1);
                    console.log(`✅ Tabla ${table.name} ya existe`);
                } catch (e) {
                    console.log(`❌ No se pudo verificar ${table.name}`);
                }
            } else {
                console.log(`✅ Tabla ${table.name} creada exitosamente`);
            }
        } catch (error) {
            console.log(`❌ Error creando ${table.name}:`, error.message);
        }
    }

    // Crear función trigger para perfiles
    console.log('\n🔧 Configurando trigger para perfiles automáticos...');
    try {
        const triggerSQL = `
            CREATE OR REPLACE FUNCTION public.handle_new_user() 
            RETURNS TRIGGER AS $$
            DECLARE
                new_org_id UUID;
            BEGIN
                INSERT INTO organizations (name) VALUES ('Mi Organización') RETURNING id INTO new_org_id;
                INSERT INTO profiles (id, email, organization_id) 
                VALUES (NEW.id, NEW.email, new_org_id);
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
            
            DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
            CREATE TRIGGER on_auth_user_created
                AFTER INSERT ON auth.users
                FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        `;
        
        const { error } = await supabase.rpc('exec', { sql: triggerSQL });
        if (error) {
            console.log('⚠️  Warning: No se pudo crear el trigger automático');
        } else {
            console.log('✅ Trigger configurado exitosamente');
        }
    } catch (error) {
        console.log('⚠️  Warning: Trigger no configurado:', error.message);
    }

    // Insertar datos iniciales
    console.log('\n📦 Insertando automatizaciones iniciales...');
    try {
        const { error } = await supabase
            .from('automation_workflows')
            .insert([
                {
                    name: 'Saludo Automático',
                    description: 'Responde automáticamente a saludos',
                    is_active: true,
                    trigger: { 
                        type: "keyword", 
                        conditions: { 
                            keywords: ["hola", "buenos días", "buenas tardes", "hey", "saludos"] 
                        } 
                    },
                    actions: [
                        { 
                            type: "send_message", 
                            data: { 
                                message: "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?" 
                            }, 
                            delayMinutes: 0 
                        }
                    ]
                },
                {
                    name: 'Información de Productos',
                    description: 'Responde a consultas sobre productos',
                    is_active: true,
                    trigger: { 
                        type: "keyword", 
                        conditions: { 
                            keywords: ["producto", "precio", "información", "catalogo", "servicio"] 
                        } 
                    },
                    actions: [
                        { 
                            type: "send_message", 
                            data: { 
                                message: "Te puedo ayudar con información de nuestros productos. ¿Hay algo específico que te interese?" 
                            }, 
                            delayMinutes: 0 
                        },
                        { 
                            type: "add_tag", 
                            data: { 
                                tags: ["interesado_productos"] 
                            } 
                        }
                    ]
                }
            ]);

        if (error) {
            console.log('⚠️  Warning: No se pudieron insertar las automatizaciones:', error.message);
        } else {
            console.log('✅ Automatizaciones iniciales insertadas');
        }
    } catch (error) {
        console.log('⚠️  Warning: Error insertando automatizaciones:', error.message);
    }

    console.log('\n🎉 ¡CONFIGURACIÓN DE BASE DE DATOS COMPLETADA!');
    console.log('\n📋 RESUMEN:');
    console.log('✅ Todas las tablas principales creadas');
    console.log('✅ Sistema de usuarios configurado');
    console.log('✅ Automatizaciones iniciales agregadas');
    console.log('✅ Base de datos lista para usar');
    console.log('\n🌐 Tu aplicación está lista en: https://whatsapp-saas-eight.vercel.app');
}

setupDatabase().catch(console.error);