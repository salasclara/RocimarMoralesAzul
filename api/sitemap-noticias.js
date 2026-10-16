// Sitemap con todas las noticias publicadas; se actualiza solo con cada nota nueva.
const { SITIO, escapar, obtenerNoticias } = require('./_comun');

module.exports = async (req, res) => {
  let noticias = [];
  try {
    noticias = await obtenerNoticias();
  } catch (e) {
    console.error('No se pudo leer /blog:', e.message);
    res.statusCode = 503;
    res.setHeader('Cache-Control', 'no-store');
    res.end('Sitemap no disponible temporalmente');
    return;
  }
  const vistos = new Set();
  const urls = noticias
    .filter((p) => p && p.slug && !vistos.has(p.slug) && vistos.add(p.slug))
    .map((p) => {
      const fecha = p.created_at ? `<lastmod>${new Date(p.created_at).toISOString()}</lastmod>` : '';
      return `  <url><loc>${escapar(`${SITIO}/noticias/${encodeURIComponent(p.slug)}`)}</loc>${fecha}</url>`;
    });
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
  res.statusCode = 200;
  res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
};
