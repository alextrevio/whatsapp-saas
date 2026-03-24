#!/usr/bin/env node

// 🧪 Test de producción para WhatsApp SaaS
// Ejecuta: node test-production.js

const https = require('https');
const { createClient } = require('@supabase/supabase-js');

async function testProduction() {
  console.log('🧪 Testing WhatsApp SaaS Production...');
  
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de entorno faltantes');
    process.exit(1);
  }
  
  console.log('✅ Variables de entorno cargadas');
  
  // Test Supabase connection
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows, but connection works
      throw error;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
  } catch (error) {
    console.error('❌ Error conectando a Supabase:', error.message);
    process.exit(1);
  }
  
  // Test Next.js build
  const { exec } = require('child_process');
  
  console.log('🔨 Testing Next.js build...');
  
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Build failed:', error);
      return;
    }
    
    console.log('✅ Build exitoso');
    console.log('📊 Build output:', stdout.split('\n').slice(-10).join('\n'));
    
    console.log('\n🎉 Tests completados!');
    console.log('🚀 Ready to deploy with: ./deploy.sh');
  });
}

testProduction().catch(console.error);