// Utilidades compartidas por las funciones de noticias.
const API = 'https://rocimar-servidor-v2-production.up.railway.app';
const SITIO = 'https://rocimarmorales.com';
const IMAGEN_POR_DEFECTO = `${SITIO}/rocimar-portada.png`;

function escapar(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resumen(contenido, max = 160) {
  const limpio = String(contenido || '')
    .replace(/^#+[^\n]*\n?/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (limpio.length <= max) return limpio;
  const corte = limpio.slice(0, max);
  return corte.slice(0, corte.lastIndexOf(' ') > 80 ? corte.lastIndexOf(' ') : max).trim() + '…';
}

function imagenValida(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : IMAGEN_POR_DEFECTO;
  } catch {
    return IMAGEN_POR_DEFECTO;
  }
}

async function obtenerNoticias() {
  const controlador = new AbortController();
  const espera = setTimeout(() => controlador.abort(), 6000);
  try {
    const r = await fetch(`${API}/blog`, { signal: controlador.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const datos = await r.json();
    return Array.isArray(datos) ? datos : [];
  } finally {
    clearTimeout(espera);
  }
}

module.exports = { API, SITIO, IMAGEN_POR_DEFECTO, escapar, resumen, imagenValida, obtenerNoticias };
