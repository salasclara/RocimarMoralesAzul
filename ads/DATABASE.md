# ROCIMAR ADS — Base de datos y acceso privado

## Base de datos
Se agregó `ads/schema.sql` para crear tablas de campañas y eventos en Supabase con RLS habilitada y sin políticas públicas. Para activarlas, se necesita ejecutar el SQL en el proyecto Supabase autorizado.

## Administración privada — primera etapa
Usar **Supabase Studio** (panel de Supabase con acceso a la cuenta del propietario) para crear y aprobar campañas en `rocimar_ad_campaigns`. Esto evita exponer una contraseña administrativa propia en una web estática.

## Estadísticas
`rocimar_ad_events` guarda eventos de tipo `impression` o `click` asociados a una campaña. Las métricas deben agregarse desde el servidor y excluir tráfico sospechoso antes de usarse para facturación.

## Pendiente de conectar
- Identificador del proyecto Supabase y variables de entorno configuradas en Vercel.
- API de lectura desde Supabase con clave de servicio **solo del lado servidor**.
- Panel de Rocimar autenticado con Supabase Auth, autorización por usuario y validación de sesiones.
- Eventos de impresión y clic con límites de frecuencia y protección contra bots.
- Pruebas de seguridad y verificación del despliegue.

**No** copiar claves, contraseñas ni datos personales al repositorio.
