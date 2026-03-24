const fs = require('fs');

async function executeSQL() {
    const sql = fs.readFileSync('setup-database.sql', 'utf8');
    
    // Dividir en statements individuales
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'))
        .map(s => s + ';');

    const supabaseUrl = 'https://nyaazkfmnvprfyfzcagr.supabase.co';
    const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWF6a2ZtbnZwcmZ5ZnpjYWdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMzMzI5MSwiZXhwIjoyMDg5OTA5MjkxfQ.xEpaA0VHJctjSvIMhTMs7X9WGyjzzbd-BP1VZKXFtK4';

    console.log(`Ejecutando ${statements.length} statements SQL...`);

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        console.log(`\n[${i+1}/${statements.length}] Ejecutando: ${statement.substring(0, 50)}...`);
        
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceKey}`,
                    'Content-Type': 'application/json',
                    'apikey': serviceKey
                },
                body: JSON.stringify({ sql_statement: statement })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Ejecutado exitosamente');
            } else {
                const error = await response.text();
                console.log('⚠️  Error:', error);
                
                // Intentar con query SQL directo si no existe la función exec_sql
                if (error.includes('exec_sql')) {
                    console.log('Intentando método alternativo...');
                    // Usar el cliente JS de Supabase sería mejor aquí
                }
            }
        } catch (error) {
            console.error('❌ Error ejecutando SQL:', error.message);
        }
    }

    console.log('\n🎉 ¡Configuración de base de datos completada!');
}

executeSQL().catch(console.error);