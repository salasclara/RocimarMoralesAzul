/* ROCIMAR ADS: public renderer, no administrative privileges. */
(function () {
  'use strict';
  const allowed = new Set(['home-top','news-inline','news-sidebar','news-between','cabimas']);
  const css = document.createElement('style');
  css.textContent = '.rocimar-ad{margin:22px auto;max-width:1100px}.rocimar-ad__label{display:block;font:10px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#697985;margin-bottom:6px}.rocimar-ad__link{display:block;border:1px solid #e6e1d8;border-radius:8px;overflow:hidden;background:#f6f3ee}.rocimar-ad__image{display:block;width:100%;height:auto;max-height:420px;object-fit:contain}.rocimar-ad__link:focus-visible{outline:3px solid #b58b4c;outline-offset:3px}@media(max-width:740px){.rocimar-ad{margin:16px 12px}.rocimar-ad__image{max-height:320px}}';
  css.textContent += '.rocimar-ad[data-rocimar-ad="home-top"]{max-width:960px;padding:12px 16px 20px}.rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__link{display:flex;justify-content:center;align-items:center;min-height:0;background:#fff}.rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__image{width:auto;max-width:100%;height:auto;max-height:460px;object-fit:contain}@media(max-width:740px){.rocimar-ad[data-rocimar-ad="home-top"]{padding:8px 0 14px}.rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__image{max-height:360px}}';
  css.textContent += '.rocimar-ad--available{margin:20px auto;max-width:1100px}.rocimar-ad__available-link{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:7px;text-align:center;min-height:128px;padding:24px 18px;border:1.5px dashed #bb965d;border-radius:10px;background:linear-gradient(110deg,#f9f6ef,#f0e9dd);color:#17374b;text-decoration:none;font:600 15px Arial,sans-serif}.rocimar-ad__available-link strong{font:700 clamp(18px,2.5vw,28px) Georgia,serif}.rocimar-ad__available-link small{font:400 13px Arial,sans-serif;color:#556875}.rocimar-ad__available-link:focus-visible{outline:3px solid #b58b4c;outline-offset:3px}.rocimar-ad--available[data-rocimar-ad="news-inline"] .rocimar-ad__available-link,.rocimar-ad--available[data-rocimar-ad="news-sidebar"] .rocimar-ad__available-link{min-height:150px}@media(max-width:740px){.rocimar-ad__available-link{min-height:105px;padding:18px 12px}}';
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
      if (!eligible.length) {
        const label=document.createElement('span');label.className='rocimar-ad__label';label.textContent='Espacio publicitario disponible';
        const link=document.createElement('a');link.className='rocimar-ad__available-link';link.href='/cabimas-y-su-gente.html#publicidad';
        const title=document.createElement('strong');title.textContent='Tu negocio puede anunciarse aquí';
        const detail=document.createElement('small');detail.textContent='Conoce los patrocinios Bronce, Plata y Oro de Rocimar Morales';
        const action=document.createElement('span');action.textContent='Solicita información publicitaria →';
        link.append(title,detail,action);target.replaceChildren(label,link);target.classList.add('rocimar-ad','rocimar-ad--available');return;
      }
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
