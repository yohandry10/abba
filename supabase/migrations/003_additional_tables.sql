-- Tabla para configuraciones del sistema
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla para notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla para auditoría de acciones
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla para sesiones de usuario
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla para bancos disponibles
CREATE TABLE banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL, -- 'PE' para Perú, 'VE' para Venezuela
  code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insertar bancos peruanos
INSERT INTO banks (name, country, code) VALUES
('Banco de Crédito del Perú (BCP)', 'PE', 'BCP'),
('BBVA Continental', 'PE', 'BBVA'),
('Scotiabank Perú', 'PE', 'SCOTIA'),
('Interbank', 'PE', 'INTERBANK'),
('Banco de la Nación', 'PE', 'BN'),
('Banco Falabella', 'PE', 'FALABELLA'),
('Banco Ripley', 'PE', 'RIPLEY'),
('Banco Santander', 'PE', 'SANTANDER'),
('Banco GNB', 'PE', 'GNB'),
('Banco Pichincha', 'PE', 'PICHINCHA');

-- Insertar bancos venezolanos
INSERT INTO banks (name, country, code) VALUES
('Banco de Venezuela', 'VE', 'BDV'),
('Banesco', 'VE', 'BANESCO'),
('Banco Mercantil', 'VE', 'MERCANTIL'),
('Banco Provincial', 'VE', 'PROVINCIAL'),
('Banco Occidental de Descuento (BOD)', 'VE', 'BOD'),
('Banco Venezolano de Crédito', 'VE', 'BVC'),
('Banco del Tesoro', 'VE', 'TESORO'),
('Banco Bicentenario', 'VE', 'BICENTENARIO'),
('Banco Agrícola de Venezuela', 'VE', 'BAV'),
('Banco Activo', 'VE', 'ACTIVO');

-- Crear índices
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_banks_country ON banks(country);
CREATE INDEX idx_banks_active ON banks(is_active);

-- Agregar trigger para updated_at en system_settings
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS policies
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

-- System settings policies (solo admins)
CREATE POLICY "Admins can manage system settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications" ON notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Audit logs policies (solo lectura para admins)
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User sessions policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions" ON user_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Banks policies (todos pueden ver bancos activos)
CREATE POLICY "Anyone can view active banks" ON banks
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage banks" ON banks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insertar configuraciones iniciales del sistema
INSERT INTO system_settings (key, value, description) VALUES
('site_name', 'Casa de Cambio', 'Nombre del sitio web'),
('maintenance_mode', 'false', 'Modo de mantenimiento'),
('max_daily_amount', '10000', 'Monto máximo diario por usuario'),
('min_order_amount', '50', 'Monto mínimo por orden'),
('kyc_required', 'true', 'KYC requerido para nuevos usuarios'),
('auto_confirm_orders', 'false', 'Confirmación automática de órdenes'),
('notification_email', 'admin@casadecambio.com', 'Email para notificaciones'),
('whatsapp_number', '+51999999999', 'Número de WhatsApp de soporte'),
('telegram_channel', '@casadecambio', 'Canal de Telegram'),
('business_hours', '9:00-18:00', 'Horario de atención');