-- Políticas de seguridad adicionales para producción

-- Política más específica para sesiones WhatsApp
DROP POLICY IF EXISTS "Users can manage own WhatsApp sessions" ON public.whatsapp_sessions;
CREATE POLICY "Users can manage own WhatsApp sessions" ON public.whatsapp_sessions
  FOR ALL USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política para que admins puedan ver todas las campañas
CREATE POLICY "Admins can view all campaigns" ON public.campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Función para crear automáticamente el perfil de usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  -- Verificar si es el primer usuario (será admin)
  SELECT NOT EXISTS (SELECT 1 FROM public.users LIMIT 1) INTO is_first_user;

  -- Insertar nuevo usuario
  INSERT INTO public.users (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE WHEN is_first_user THEN 'admin' ELSE 'user' END,
    true
  );

  RETURN NEW;
END;
$$;

-- Trigger para crear usuario automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Aplicar triggers a todas las tablas que necesiten updated_at
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('users', 'whatsapp_sessions', 'contacts', 'conversations', 'campaigns', 'webhooks')
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS %I_updated_at ON public.%I;
      CREATE TRIGGER %I_updated_at
        BEFORE UPDATE ON public.%I
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    ', table_name, table_name, table_name, table_name);
  END LOOP;
END;
$$;