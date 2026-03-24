# WhatsApp SaaS - Plataforma de Uso Interno

Plataforma de gestión de WhatsApp para uso interno - simplificada y enfocada en funcionalidad core.

## 🚀 Características

### 📱 WhatsApp Management
- **Sesiones WhatsApp**: Gestión de múltiples conexiones
- **Inbox en tiempo real**: Mensajes entrantes y salientes
- **QR Code authentication**: Conexión segura de dispositivos

### 👥 Gestión de Contactos  
- **Base de datos centralizada**: Todos tus contactos organizados
- **Importación CSV**: Carga masiva de contactos
- **Sistema de tags**: Categorización flexible

### 📢 Campañas de Mensajería
- **Envíos masivos**: Campañas a múltiples contactos
- **Programación**: Mensajes programados
- **Tracking**: Seguimiento de entregas

### ⚙️ Configuración
- **Configuración personal**: Ajustes de perfil
- **Parámetros WhatsApp**: Timeouts y delays
- **API interna**: Token para integraciones
- **Notificaciones**: Webhooks y emails

## 🛠 Stack Técnico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: API Routes + Supabase
- **Base de datos**: PostgreSQL (Supabase)
- **WhatsApp**: whatsapp-web.js
- **UI**: shadcn/ui + Radix UI
- **Autenticación**: Supabase Auth

## 📦 Instalación

```bash
# Clonar repositorio
git clone [repo]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/              # Login/Register
│   ├── (dashboard)/         # Dashboard principal
│   └── api/whatsapp/        # APIs de WhatsApp
├── components/
│   ├── dashboard/           # Componentes del dashboard
│   └── ui/                  # Componentes base (shadcn/ui)
├── hooks/                   # Hooks personalizados
├── lib/                     # Utilidades y configuración
└── types/                   # Tipos TypeScript
```

## 🔐 Funcionalidades

### Dashboard Principal
- Vista general de estadísticas
- Actividad reciente
- Acceso rápido a funciones

### WhatsApp Sessions
- Conectar múltiples dispositivos WhatsApp
- Monitoreo de estado de conexión
- QR Code para autenticación

### Inbox
- Chat interface en tiempo real
- Historial de conversaciones
- Respuestas rápidas

### Contactos
- Lista completa de contactos
- Búsqueda y filtrado
- Importación desde CSV
- Sistema de etiquetas

### Campañas
- Crear campañas de mensajes
- Selección de audiencia
- Programación de envíos
- Métricas de entrega

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Deploy con Vercel CLI
vercel --prod

# O conectar repositorio GitHub en vercel.com
```

### Variables de Entorno en Producción
- Configurar todas las variables en Vercel Dashboard
- Asegurar que Supabase tenga la URL correcta
- Verificar WhatsApp web connection en producción

## 📊 Métricas del Build

- **Páginas generadas**: 14
- **Bundle size**: ~87KB shared
- **Rutas API**: 3 (todas WhatsApp)
- **Componentes**: Optimizados para producción

## 🔧 Desarrollo

```bash
# Ejecutar tests
npm test

# Linting
npm run lint

# Type checking
npm run type-check

# Build local
npm run build && npm start
```

---

**Versión**: 1.0.0 - Uso Interno  
**Última actualización**: 2024-03-24  
**Desarrollado por**: Atlas 🏗️