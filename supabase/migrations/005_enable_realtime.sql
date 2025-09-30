-- Habilitar Realtime para las tablas críticas
-- Esta migración configura las tablas para recibir actualizaciones en tiempo real

-- Configurar replica identity para las tablas que necesitan realtime
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE exchange_rates REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE users REPLICA IDENTITY FULL;
ALTER TABLE kyc_documents REPLICA IDENTITY FULL;

-- Crear función para notificar cambios importantes
CREATE OR REPLACE FUNCTION notify_order_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificar cambios en órdenes
  IF TG_OP = 'UPDATE' THEN
    -- Si cambió el estado, crear notificación
    IF OLD.status != NEW.status THEN
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (
        NEW.client_id,
        'Estado de orden actualizado',
        'Tu orden #' || NEW.order_number || ' cambió a: ' || NEW.status,
        CASE 
          WHEN NEW.status = 'confirmed' THEN 'success'
          WHEN NEW.status = 'completed' THEN 'success'
          WHEN NEW.status = 'cancelled' THEN 'error'
          ELSE 'info'
        END
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para notificaciones automáticas
DROP TRIGGER IF EXISTS order_status_change_notification ON orders;
CREATE TRIGGER order_status_change_notification
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_change();

-- Crear función para notificar nuevas tasas de cambio
CREATE OR REPLACE FUNCTION notify_rate_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = TRUE THEN
    -- Notificar a todos los usuarios activos sobre nueva tasa
    INSERT INTO notifications (user_id, title, message, type)
    SELECT 
      u.id,
      'Nueva tasa de cambio disponible',
      'PEN → VES: ' || NEW.soles_to_bolivares || ' | VES → PEN: ' || NEW.bolivares_to_soles,
      'info'
    FROM users u 
    WHERE u.status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para notificaciones de tasas
DROP TRIGGER IF EXISTS rate_change_notification ON exchange_rates;
CREATE TRIGGER rate_change_notification
  AFTER INSERT ON exchange_rates
  FOR EACH ROW
  EXECUTE FUNCTION notify_rate_change();

-- Crear función para limpiar notificaciones antiguas
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  -- Eliminar notificaciones leídas de más de 30 días
  DELETE FROM notifications 
  WHERE read = TRUE 
  AND created_at < NOW() - INTERVAL '30 days';
  
  -- Eliminar notificaciones no leídas de más de 90 días
  DELETE FROM notifications 
  WHERE read = FALSE 
  AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Programar limpieza automática (esto se debe configurar en el cron de Supabase)
-- SELECT cron.schedule('cleanup-notifications', '0 2 * * *', 'SELECT cleanup_old_notifications();');

-- Insertar configuraciones para realtime
INSERT INTO system_settings (key, value, description) VALUES
('realtime_enabled', 'true', 'Habilitar actualizaciones en tiempo real'),
('notification_retention_days', '90', 'Días para mantener notificaciones no leídas'),
('notification_cleanup_enabled', 'true', 'Habilitar limpieza automática de notificaciones')
ON CONFLICT (key) DO NOTHING;