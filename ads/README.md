# ROCIMAR ADS — fase inicial

Rama aislada de producción. Cinco espacios definidos en `config.json`. Ningún anuncio se publica hasta configurar almacenamiento persistente, autenticación y controles de aprobación.

## Seguridad y despliegue
- No guardar contraseñas ni tokens en el repositorio.
- No exponer un administrador editable en HTML público.
- No publicar campañas sin autorización ni registrar clics sin protección contra abuso.
- Mantener noticias y servicio Railway sin cambios.

## Siguiente implementación
1. Elegir almacenamiento persistente y autenticación.
2. API de campañas con validación de enlaces HTTPS, fechas, espacios y estado.
3. Endpoint público de anuncios aprobados y componente responsivo.
4. Medición agregada de impresiones y clics, con política de privacidad.
5. Pruebas en preview de Vercel antes de fusionar a main.
