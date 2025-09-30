# Casa de Cambio - Plataforma de Intercambio de Moneda

Plataforma web para intercambio de moneda entre Perú (Soles) y Venezuela (Bolívares) con verificación KYC y gestión de órdenes.

## Características

- 🏠 Landing page con efectos parallax y animaciones
- 🔐 Sistema de autenticación con roles (Admin/Cliente)
- 📋 Proceso de verificación KYC con carga de documentos
- 💱 Calculadora de cambio en tiempo real
- 📊 Dashboard de cliente con gestión de órdenes
- 👨‍💼 Panel de administración para gestión de tasas y órdenes
- 💳 Sistema de carga de comprobantes de pago

## Configuración

### 1. Variables de Entorno

Debes configurar las siguientes variables de entorno en **Project Settings**:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
\`\`\`

Para obtener estos valores:
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia la **Project URL** y la **anon/public key**

### 2. Configuración de Base de Datos

Ejecuta las migraciones SQL en tu proyecto de Supabase:

1. Ve a tu dashboard de Supabase
2. Abre el **SQL Editor**
3. Ejecuta los scripts en orden:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`

### 3. Configuración de Vercel Blob

Para la carga de archivos (documentos KYC y comprobantes de pago), asegúrate de tener Vercel Blob configurado en tu proyecto.

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── page.tsx                 # Landing page
│   ├── login/                   # Página de inicio de sesión
│   ├── register/                # Página de registro
│   ├── onboarding/              # Flujo de verificación KYC
│   ├── dashboard/               # Dashboard del cliente
│   │   ├── calculator/          # Calculadora de cambio
│   │   └── orders/              # Gestión de órdenes
│   └── admin/                   # Panel de administración
│       ├── rates/               # Gestión de tasas
│       ├── kyc/                 # Revisión de KYC
│       └── orders/              # Gestión de órdenes
├── components/
│   ├── auth/                    # Componentes de autenticación
│   ├── dashboard/               # Componentes del dashboard
│   ├── admin/                   # Componentes del admin
│   ├── orders/                  # Componentes de órdenes
│   └── onboarding/              # Componentes de KYC
├── lib/
│   ├── supabase/                # Clientes de Supabase
│   ├── auth/                    # Utilidades de autenticación
│   └── types/                   # Tipos TypeScript
└── supabase/
    └── migrations/              # Scripts SQL

\`\`\`

## Roles de Usuario

### Cliente
- Completar verificación KYC
- Calcular tasas de cambio
- Crear órdenes de intercambio
- Subir comprobantes de pago
- Ver historial de órdenes

### Administrador
- Publicar tasas de cambio diarias
- Revisar y aprobar documentos KYC
- Gestionar órdenes de clientes
- Ver estadísticas del sistema

## Credenciales de Administrador

Después de ejecutar las migraciones, puedes iniciar sesión como administrador con:
- Email: `admin@casadecambio.com`
- Contraseña: Deberás configurarla en Supabase Auth

## Tecnologías

- **Framework**: Next.js 15 con App Router
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Vercel Blob
- **Estilos**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **TypeScript**: Para type safety

## Desarrollo Local

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura las variables de entorno
4. Ejecuta las migraciones de base de datos
5. Inicia el servidor: `npm run dev`

## Despliegue

La aplicación está lista para desplegarse en Vercel. Asegúrate de:
1. Configurar las variables de entorno en Vercel
2. Conectar tu proyecto de Supabase
3. Habilitar Vercel Blob para almacenamiento de archivos
