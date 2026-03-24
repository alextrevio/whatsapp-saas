# 🚀 WhatsApp SaaS - Setup Completo para Producción

## 📋 Checklist de Deploy

### 1. ✅ SUPABASE SETUP (10 mins)

**Paso 1.1: Crear Proyecto**
1. Ve a [supabase.com](https://supabase.com)
2. Crea nueva organización → Nuevo proyecto
3. Nombre: `whatsapp-saas-prod`
4. Región: `East US` (más cercana)
5. Database Password: ¡Guárdala bien!

**Paso 1.2: Ejecutar Schema**
1. En Supabase Dashboard → SQL Editor
2. Copia todo el contenido de `database-schema.sql`
3. Ejecuta el script completo
4. ✅ Debe crear 7 tablas + políticas RLS

**Paso 1.3: Configurar Auth**
1. Authentication → Providers
2. Activar Email (ya está activo)
3. Activar Google OAuth:
   - Client ID: `tu_google_client_id`
   - Client Secret: `tu_google_secret`
   - Redirect URL: `https://tu-proyecto.supabase.co/auth/v1/callback`

**Paso 1.4: Obtener Keys**
```bash
# Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. ⚙️ VARIABLES DE ENTORNO

**Crear `.env.local`:**
```bash
# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# WhatsApp (REQUERIDO)
WHATSAPP_SESSION_SECRET=mi-secret-super-seguro-2024

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=otro-secret-muy-seguro
```

### 3. 🚀 DEPLOY A VERCEL (15 mins)

**Paso 3.1: Preparar Deploy**
```bash
# Install Vercel CLI
npm install -g vercel

# Desde el directorio del proyecto
cd /root/.openclaw/workspace/projects/whatsapp-saas

# Login a Vercel
vercel login

# Deploy inicial
vercel --prod
```

**Paso 3.2: Configurar Variables en Vercel**
1. Vercel Dashboard → Tu proyecto → Settings → Environment Variables
2. Agregar todas las variables de `.env.local`
3. Redeploy: `vercel --prod`

**Paso 3.3: Configurar Dominio (Opcional)**
- Vercel → Domains
- Agregar: `whatsapp.tuempresa.com`
- Configurar DNS CNAME

### 4. 📱 CONFIGURAR WHATSAPP

**Paso 4.1: Dependencias del Servidor**
```bash
# En el servidor de producción (si usas VPS)
sudo apt update
sudo apt install -y chromium-browser

# Variables adicionales para Puppeteer
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**Para Vercel, agregar en `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['localhost', 'supabase.co'],
  },
  // Configuración para WhatsApp en serverless
  webpack: (config) => {
    config.externals.push({ 'puppeteer': 'commonjs puppeteer' })
    return config
  }
}

module.exports = nextConfig
```

### 5. ✅ TESTING COMPLETO

**Paso 5.1: Test Local**
```bash
npm run dev
# → http://localhost:3000
```

**Paso 5.2: Test Producción**
1. Registro de usuario
2. Login exitoso
3. Dashboard carga
4. Crear sesión WhatsApp
5. Ver código QR
6. ¡Escanear con WhatsApp!

**Paso 5.3: Test Features**
- ✅ Gestión de contactos
- ✅ Import CSV
- ✅ Crear campaña
- ✅ Inbox real-time
- ✅ Envío de mensajes

## 🎯 URLs IMPORTANTES

**Desarrollo:** http://localhost:3000
**Producción:** https://tu-app.vercel.app
**Supabase:** https://tu-proyecto.supabase.co
**Dashboard:** https://supabase.com/dashboard

## 🆘 TROUBLESHOOTING

**Error: Cannot connect to Supabase**
- Verificar URLs y keys en `.env.local`
- Verificar que RLS policies estén activas

**Error: WhatsApp QR no aparece**
- Verificar que Puppeteer esté instalado
- En Vercel, puede tardar más en primera ejecución

**Error: No autorizado**
- Verificar que el usuario esté registrado
- Verificar RLS policies en Supabase

## 📞 SOPORTE

Si algo no funciona:
1. Verificar logs en Vercel Dashboard
2. Verificar logs en Supabase Dashboard → Logs
3. Verificar que todas las variables estén configuradas

---
**Desarrollo por Atlas - Orquestador 🏗️**