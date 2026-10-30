# ROCIMAR ADS — Configuración con Railway

## Servicios existentes
- Sitio web: Vercel, repositorio `salasclara/RocimarMoralesAzul`.
- Backend: Railway, repositorio `salasclara/rocimar-servidor-v2`.
- Base de datos: PostgreSQL del proyecto Railway, conectado mediante `ROCIMAR_PG`.

## Variables necesarias
En **Railway** (servicio `rocimar-servidor-v2`):
- `ROCIMAR_ADS_ADMIN_TOKEN`: cadena aleatoria de al menos 32 caracteres. Se usa exclusivamente para comunicar el servidor con Vercel.

En **Vercel** (proyecto web):
- `ROCIMAR_ADS_ADMIN_TOKEN`: mismo valor que en Railway.
- `ROCIMAR_ADS_PASSWORD`: contraseña exclusiva del panel, mínimo 16 caracteres.
- `ROCIMAR_ADS_COOKIE_SECRET`: secreto aleatorio independiente, mínimo 32 caracteres.

**No compartir estas variables en el chat ni agregarlas a GitHub.** Configurarlas en los paneles de cada proveedor.

## Orden de puesta en marcha
1. Respaldar PostgreSQL de Railway.
2. Ejecutar el SQL aditivo `ads/schema.sql` del repositorio backend en PostgreSQL.
3. Configurar el token de servicio en Railway y desplegar el backend en un entorno de prueba.
4. Configurar las tres variables de Vercel en el entorno Preview.
5. Revisar el PR de la web y probar `/admin/publicidad` en Preview.
6. Comprobar acceso incorrecto, sesión válida, creación en borrador, aprobación, pausa y fechas.
7. Verificar que las noticias y la aplicación de Rocimar siguen funcionando.
8. Antes de producción: implementar limitación de intentos de inicio de sesión, auditoría y protección de eventos.

## Limitaciones conocidas
- La contraseña del panel todavía no tiene limitación persistente de intentos; **no desplegar el panel públicamente** sin esa protección.
- Las estadísticas son una consulta agregada de una tabla que aún no recibe eventos reales.
- Los banners necesitan URLs de imagen HTTPS; la subida de archivos no está integrada.
- El backend de anuncios solo está preparado en una rama: el despliegue actual de Railway no incorpora estas rutas.
- El sitio web sigue intacto en `main`.

## Enlaces
- Web PR: https://github.com/salasclara/RocimarMoralesAzul/pull/22
- Backend PR: https://github.com/salasclara/rocimar-servidor-v2/pull/2
