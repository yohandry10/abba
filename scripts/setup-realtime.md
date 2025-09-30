# Configuración de Realtime en Supabase

## Pasos para habilitar Realtime en tu proyecto de Supabase:

### 1. Ejecutar Migraciones
Ejecuta todas las migraciones en orden:
```sql
-- En el SQL Editor de Supabase Dashboard
-- Ejecutar en orden: 001, 002, 003, 004, 005
```

### 2. Habilitar Realtime en el Dashboard
1. Ve a **Database > Replication** en tu dashboard de Supabase
2. Habilita las siguientes tablas para Realtime:
   - ✅ `orders`
   - ✅ `exchange_rates`
   - ✅ `notifications`
   - ✅ `users`
   - ✅ `kyc_documents`

### 3. Configurar Variables de Entorno
Asegúrate de tener estas variables en tu `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 4. Verificar Configuración RLS
Las políticas RLS ya están configuradas en las migraciones, pero verifica que estén activas:

```sql
-- Verificar que RLS esté habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'exchange_rates', 'notifications', 'users');
```

### 5. Probar Realtime
1. Abre dos pestañas del dashboard
2. En una pestaña, actualiza el estado de una orden
3. En la otra pestaña, deberías ver la actualización automáticamente

### 6. Configuración Opcional: Cron Jobs
Para habilitar la limpieza automática de notificaciones (requiere extensión pg_cron):

```sql
-- Solo si tienes pg_cron habilitado
SELECT cron.schedule(
  'cleanup-notifications',
  '0 2 * * *', -- Todos los días a las 2 AM
  'SELECT cleanup_old_notifications();'
);
```

## Funcionalidades Implementadas

### ✅ Actualizaciones en Tiempo Real
- **Órdenes**: Los cambios de estado se reflejan inmediatamente
- **Tasas de Cambio**: Nuevas tasas aparecen automáticamente
- **Notificaciones**: Alertas instantáneas para usuarios

### ✅ Notificaciones Automáticas
- Cambios de estado de órdenes
- Nuevas tasas de cambio publicadas
- Sistema de limpieza automática

### ✅ Indicadores de Conexión
- Estado de conexión en tiempo real
- Botones de actualización manual
- Manejo de reconexión automática

### ✅ Experiencia de Usuario Mejorada
- Toasts para notificaciones importantes
- Contadores de notificaciones no leídas
- Indicadores visuales de actividad en tiempo real

## Troubleshooting

### Problema: Realtime no funciona
1. Verifica que las tablas estén habilitadas en Database > Replication
2. Confirma que las políticas RLS permitan las operaciones
3. Revisa la consola del navegador para errores de conexión

### Problema: Notificaciones no aparecen
1. Verifica que los triggers estén creados correctamente
2. Confirma que el usuario tenga permisos en la tabla notifications
3. Revisa que la función notify_order_change esté funcionando

### Problema: Conexión se pierde frecuentemente
1. Verifica la estabilidad de tu conexión a internet
2. Considera ajustar los parámetros de realtime en el cliente
3. Implementa lógica de reconexión más robusta si es necesario