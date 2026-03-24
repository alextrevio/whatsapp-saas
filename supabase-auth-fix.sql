-- Ejecutar en Supabase SQL Editor para desactivar confirmación de email
-- Esto permite registro inmediato sin necesidad de confirmar email

-- Actualizar configuración de auth para no requerir confirmación
ALTER TABLE auth.users ALTER COLUMN email_confirmed_at SET DEFAULT NOW();

-- Opción alternativa: Actualizar usuarios existentes que no han confirmado
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- Ver usuarios existentes
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;