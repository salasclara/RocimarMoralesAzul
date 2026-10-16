// Sirve /noticias/<slug> con título, descripción, imagen y canónica propios de cada nota,
// para que Facebook, WhatsApp y Google vean cada noticia por separado.
// La página sigue siendo noticias.html: el script del navegador funciona igual que antes.
const fs = require('fs');
const path = require('path');
const { SITIO, escapar, resumen, imagenValida, obtenerNoticias } = require('./_comun');

const plantilla = fs.readFileSync(path.join(process.cwd(), 'noticias.html'), 'utf8');

function metaNoticia(p) {
  const url = `${SITIO}/noticias/${encodeURIComponent(p.slug)}`;
  const titulo = String(p.titulo || 'Noticia').trim();
  const descripcion = resumen(p.contenido) || titulo;
  const imagen = imagenValida(p.imagen);
  const fecha = p.created_at ? new Date(p.created_at).toISOString() : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: titulo.slice(0, 110),
    description: descripcion,
    image: [imagen],
    datePublished: fecha,
    dateModified: fecha,
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: 'Rocimar Morales', url: SITIO },
    publisher: { '@type': 'Organization', name: 'Rocimar Morales', logo: { '@type': 'ImageObject', url: `${SITIO}/rocimar-portada.png` } },
  };
  return [
    `<title>${escapar(titulo)} — Rocimar Morales</title>`,
    `<meta name="description" content="${escapar(descripcion)}">`,
    `<link rel="canonical" href="${escapar(url)}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:site_name" content="Rocimar Morales">`,
    `<meta property="og:locale" content="es_VE">`,
    `<meta property="og:title" content="${escapar(titulo)}">`,
    `<meta property="og:description" content="${escapar(descripcion)}">`,
    `<meta property="og:url" content="${escapar(url)}">`,
    `<meta property="og:image" content="${escapar(imagen)}">`,
    fecha ? `<meta property="article:published_time" content="${fecha}">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapar(titulo)}">`,
    `<meta name="twitter:description" content="${escapar(descripcion)}">`,
    `<meta name="twitter:image" content="${escapar(imagen)}">`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n');
}

function reemplazarCabecera(html, bloque) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta name="description"[^>]*>\s*/i, '')
    .replace(/<link rel="canonical"[^>]*>\s*/i, '')
    .replace(/<meta name="viewport"[^>]*>/i, (m) => `${m}\n${bloque}`);
}

module.exports = async (req, res) => {
  const slug = String((req.query && req.query.slug) || '').replace(/\/+$/, '');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  let noticia = null;
  try {
    const noticias = await obtenerNoticias();
    // /blog ya viene ordenado de la más reciente a la más antigua; si un slug se repite, gana la más reciente.
    noticia = noticias.find((p) => p && p.slug === slug) || null;
  } catch (e) {
    console.error('No se pudo leer /blog:', e.message);
    // Si el servidor de noticias falla, se sirve la página normal sin cachear el error.
    res.setHeader('Cache-Control', 'no-store');
    res.statusCode = 200;
    res.end(plantilla);
    return;
  }

  if (!noticia) {
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    res.statusCode = 404;
    res.end(plantilla.replace(/<meta name="viewport"[^>]*>/i, (m) => `${m}\n<meta name="robots" content="noindex">`));
    return;
  }

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  res.statusCode = 200;
  res.end(reemplazarCabecera(plantilla, metaNoticia(noticia)));
};
