-- Configurar la autenticación de Supabase
-- Esta migración configura los triggers y funciones necesarias para sincronizar
-- la tabla auth.users con nuestra tabla users personalizada

-- Función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, status, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    'client',
    'pending_kyc',
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear usuario en nuestra tabla cuando se registra en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar el email en nuestra tabla cuando cambia en auth.users
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET email = NEW.email,
      updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar email
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_update();

-- Función para eliminar usuario de nuestra tabla cuando se elimina de auth.users
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para eliminar usuario
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- Actualizar las políticas RLS para usar auth.uid() correctamente
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Política para permitir inserción durante el registro
DROP POLICY IF EXISTS "Enable insert for authentication" ON users;
CREATE POLICY "Enable insert for authentication" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Configurar el esquema de autenticación
-- Nota: La configuración de auth se hace desde el dashboard de Supabase
-- No desde SQL ya que auth.config no existe en todas las versiones

-- Insertar configuraciones adicionales si no existen
INSERT INTO system_settings (key, value, description) VALUES
('auth_require_email_confirmation', 'false', 'Requerir confirmación de email para nuevos usuarios'),
('auth_password_min_length', '8', 'Longitud mínima de contraseña'),
('auth_session_timeout', '86400', 'Tiempo de expiración de sesión en segundos (24 horas)')
ON CONFLICT (key) DO NOTHING;