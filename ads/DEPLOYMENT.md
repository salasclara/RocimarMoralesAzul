# ROCIMAR ADS — Puesta en marcha segura

## Arquitectura implementada
- `/api/ads` es de **solo lectura**: entrega exclusivamente campañas con estado `approved`, URLs HTTPS, ubicación válida y fechas vigentes.
- `/ads/renderer.js` consulta la API y no muestra contenedores vacíos como publicidad.
- `/ads/preparar.html` es un **prototipo local**: exporta borradores JSON; no tiene login ni guarda campañas en el servidor.
- `/ads/config.json` es el inventario inicial, sin campañas aprobadas. Su contenido se publica con el sitio: **no poner información privada allí**.
- Los cambios están aislados en `feature/rocimar-ads`.

## Prueba local
```bash
node ads/test-api.js
```
El script crea temporalmente casos de prueba en el archivo JSON, lo restaura en `finally` y comprueba métodos HTTP, aprobación, fechas y validación de URLs.

## Prueba en Vercel
1. Revisar el pull request y abrir el enlace de **Preview Deployment** de Vercel (si la integración de GitHub con Vercel está configurada).
2. Verificar `/api/ads` → `{"version":1,"campaigns":[]}`.
3. Visitar portada, `/noticias`, un artículo y `/cabimas-y-su-gente`; sin campañas no debe aparecer un bloque publicitario vacío ni romperse el contenido.
4. Abrir `/ads/preparar.html`, agregar un borrador, exportar el JSON y verificar que su estado sea `draft`.
5. Probar pantalla móvil y consola del navegador.
6. **No fusionar** hasta confirmar las pruebas de preview.

## Pendiente antes de operar con anunciantes reales
1. Elegir proveedor de base de datos y almacenamiento de imágenes (no guardar imágenes ni datos de clientes en Git).
2. Crear login y autorización del administrador, con credenciales y secretos en variables de entorno de Vercel.
3. Implementar endpoints protegidos de alta, edición, aprobación, pausa y vencimiento de campañas.
4. Conectar el formulario a los endpoints autenticados; añadir registro de auditoría.
5. Implementar medición agregada de impresiones y clics con mitigación de bots y política de privacidad.
6. Actualizar la API pública para consultar la base de datos, conservando validaciones y caché.
7. Ejecutar pruebas E2E y revisar el despliegue antes de fusionar.

## Reglas editoriales
- Identificar anuncios con «Publicidad».
- No confundir métricas de Facebook con impresiones de la web.
- No prometer exclusividad ni rotación garantizada sin soporte de reservas por espacio.
- Mantener el contenido editorial y las rutas de Railway intactas.
