/* ROCIMAR ADS: public renderer, no administrative privileges. */
(function () {
  'use strict';
  const allowed = new Set(['home-top','news-inline','news-sidebar','news-between','cabimas']);
  const css = document.createElement('style');
  css.textContent = '.rocimar-ad{margin:22px auto;max-width:1100px}.rocimar-ad__label{display:block;font:10px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#697985;margin-bottom:6px}.rocimar-ad__link{display:block;border:1px solid #e6e1d8;border-radius:8px;overflow:hidden;background:#f6f3ee}.rocimar-ad__image{display:block;width:100%;height:auto;max-height:250px;object-fit:contain}.rocimar-ad__link:focus-visible{outline:3px solid #b58b4c;outline-offset:3px}@media(max-width:740px){.rocimar-ad{margin:16px 12px}.rocimar-ad__image{max-height:180px}}';
  document.head.appendChild(css);
  const safeUrl = value => { try { const u = new URL(value, location.origin); return u.protocol === 'https:' ? u.href : null; } catch { return null; } };
  async function render() {
    const targets = [...document.querySelectorAll('[data-rocimar-ad]')].filter(el=>allowed.has(el.dataset.rocimarAd));
    if (!targets.length) return;
    let campaigns;
    try {
      const res = await fetch('/api/ads', {cache:'no-store'});
      if (!res.ok) return;
      const config = await res.json();
      campaigns = Array.isArray(config.campaigns) ? config.campaigns : [];
    } catch { return; }
    targets.forEach(target => {
      const slot = target.dataset.rocimarAd;
      const eligible = campaigns.filter(a => a && a.slot===slot && safeUrl(a.url) && safeUrl(a.image));
      if (!eligible.length) return;
      const ad = eligible[Math.floor(Math.random()*eligible.length)];
      const link = document.createElement('a');
      link.className='rocimar-ad__link'; link.href=safeUrl(ad.url); link.target='_blank'; link.rel='sponsored noopener noreferrer';
      const image=document.createElement('img'); image.className='rocimar-ad__image'; image.src=safeUrl(ad.image); image.alt=String(ad.alt||ad.name||'Anuncio publicitario').slice(0,140); image.loading='lazy'; image.decoding='async';
      const label=document.createElement('span'); label.className='rocimar-ad__label'; label.textContent='Publicidad';
      link.appendChild(image); target.replaceChildren(label,link); target.classList.add('rocimar-ad');
      const report = type => fetch('/api/ads-event', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:ad.id,type}),keepalive:true}).catch(()=>{});
      link.addEventListener('click',()=>report('click'));
      if('IntersectionObserver' in window) {
        const observer=new IntersectionObserver(entries=>{
          if(entries.some(e=>e.intersectionRatio>=0.5)){report('impression');observer.disconnect();}
        },{threshold:0.5});
        observer.observe(target);
      }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render,{once:true}); else render();
})();
