#!/bin/bash

# 🚀 WhatsApp SaaS - Script de Deploy Automático
# Ejecuta: chmod +x deploy.sh && ./deploy.sh

set -e

echo "🏗️  WhatsApp SaaS - Deployment Script"
echo "=================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local no encontrado"
    echo "Crea .env.local con las variables necesarias:"
    echo "NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=tu_service_key"
    exit 1
fi

echo "✅ Variables de entorno encontradas"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Type check
echo "🔍 Verificando tipos TypeScript..."
npm run type-check

# Build locally to check for errors
echo "🔨 Building proyecto..."
npm run build

echo "✅ Build exitoso!"

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying a Vercel..."
vercel --prod

echo ""
echo "🎉 Deploy completado!"
echo "📱 Próximos pasos:"
echo "1. Ve a tu URL de Vercel"
echo "2. Registra el primer usuario (será admin)"
echo "3. Crea una sesión de WhatsApp"
echo "4. Escanea el QR code"
echo "5. ¡A enviar mensajes!"
echo ""
echo "📊 Monitoring:"
echo "- Logs: vercel logs"
echo "- Dashboard: https://vercel.com/dashboard"
echo "- Supabase: https://supabase.com/dashboard"