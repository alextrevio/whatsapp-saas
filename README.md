# WhatsApp SaaS Platform

Una plataforma completa de automatización de WhatsApp para agencias de marketing. Clon funcional de GoGHL.ai construido con Next.js 14 y Supabase.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **UI**: shadcn/ui components
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **WhatsApp**: whatsapp-web.js
- **Pagos**: Stripe
- **AI**: OpenAI API, ElevenLabs

## 🏗️ Arquitectura

### Fases de Desarrollo

#### ✅ FASE 1 - CORE (Completada)
- [x] Autenticación Supabase (login/register/OAuth)
- [x] Sistema multi-tenant (organizaciones)
- [x] Dashboard con layout responsive
- [x] Gestión de sesiones WhatsApp
- [x] Dark mode y temas
- [x] Componentes UI base

#### 🔧 FASE 2 - FEATURES (En desarrollo)
- [ ] Gestión de contactos (CSV import, tags)
- [ ] Sistema de campañas (bulk, spintax, drip)
- [ ] Auto-respuesta AI con ChatGPT
- [ ] Builder de botones y listas
- [ ] Notas de voz (ElevenLabs + Whisper)
- [ ] Configuración de proxy SOCKS5

#### 💰 FASE 3 - BUSINESS (Pendiente)
- [ ] Integración con Stripe
- [ ] Sistema white-label
- [ ] REST API + API keys
- [ ] Dashboard para agencias
- [ ] Webhooks con N8N

#### 📱 FASE 4 - LANDING (Pendiente)
- [ ] Landing page estilo GoGHL.ai
- [ ] Pricing con toggle
- [ ] Centro de ayuda
- [ ] Blog y SEO

## 🗄️ Base de Datos

### Tablas Principales

- `organizations` - Multi-tenant, planes, Stripe
- `sub_accounts` - Sub-cuentas por organización
- `whatsapp_sessions` - Sesiones WhatsApp (QR, proxy, estado)
- `contacts` - Contactos con tags y campos personalizados
- `conversations` - Conversaciones en tiempo real
- `messages` - Mensajes (texto/imagen/video/audio/botones/listas)

## 🚦 Empezar

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase
- Cuenta de OpenAI (opcional)
- Cuenta de Stripe (para pagos)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/alextrevio/whatsapp-saas
cd whatsapp-saas

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

### Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role

# OpenAI (opcional)
OPENAI_API_KEY=tu_clave_openai

# ElevenLabs (opcional)
ELEVENLABS_API_KEY=tu_clave_elevenlabs

# Stripe (para pagos)
STRIPE_PUBLISHABLE_KEY=tu_clave_publica_stripe
STRIPE_SECRET_KEY=tu_clave_secreta_stripe
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con watch
npm run test:watch

# Type checking
npm run type-check
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Deploy automático conectando repositorio GitHub
# Las variables de entorno se configuran en el dashboard de Vercel
```

### Docker

```bash
# Build de la imagen
docker build -t whatsapp-saas .

# Ejecutar contenedor
docker run -p 3000:3000 whatsapp-saas
```

## 📝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'feat: agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🤝 Soporte

- 📧 Email: soporte@whatsappsaas.com
- 💬 Discord: [Server de la comunidad]
- 📚 Documentación: [docs.whatsappsaas.com]

---

**Desarrollado con ❤️ por Atlas - Orquestador de Desarrollo**