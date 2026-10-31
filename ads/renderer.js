/* ROCIMAR ADS: public renderer, no administrative privileges. */
(function () {
  'use strict';
  const allowed = new Set(['home-top','news-inline','news-sidebar','news-between','cabimas']);
  const css = document.createElement('style');
  css.textContent = '.rocimar-ad{margin:22px auto;max-width:1100px}.rocimar-ad__label{display:block;font:10px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#697985;margin-bottom:6px}.rocimar-ad__link{display:block;border:1px solid #e6e1d8;border-radius:8px;overflow:hidden;background:#f6f3ee}.rocimar-ad__image{display:block;width:100%;height:auto;max-height:420px;object-fit:contain}.rocimar-ad__link:focus-visible{outline:3px solid #b58b4c;outline-offset:3px}@media(max-width:740px){.rocimar-ad{margin:16px 12px}.rocimar-ad__image{max-height:320px}}';
  css.textContent += '.rocimar-ad[data-rocimar-ad="home-top"]{width:calc(100% - 32px);max-width:1200px;margin:18px auto;padding:0}.rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__link{display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:4/1;min-height:0;background:#f5efe2;overflow:hidden}.rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__image{display:block;width:100%;height:100%;max-height:none;object-fit:contain}.rocimar-ad--available[data-rocimar-ad="home-top"] .rocimar-ad__available-link{width:100%;min-height:0;aspect-ratio:4/1;box-sizing:border-box}@media(max-width:740px){.rocimar-ad[data-rocimar-ad="home-top"]{width:calc(100% - 20px);margin:12px auto}.rocimar-ad--available[data-rocimar-ad="home-top"] .rocimar-ad__available-link{min-height:130px;aspect-ratio:auto}}';
  css.textContent += '.hero > .rocimar-ad[data-rocimar-ad="home-top"]{grid-column:1/-1;width:min(100%,1200px);max-width:1200px;margin:64px auto 0;padding:0}.hero > .rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__label{margin:0 0 3px 0;padding-left:5px}.hero > .rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__link{display:block;width:100%;height:auto;aspect-ratio:auto;min-height:0;background:transparent;border:0;border-radius:0}.hero > .rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__image{width:100%;height:auto;max-height:none;object-fit:contain}.hero > .rocimar-ad--available[data-rocimar-ad="home-top"] .rocimar-ad__available-link{aspect-ratio:auto;min-height:125px;border-radius:0}@media(max-width:740px){.hero > .rocimar-ad[data-rocimar-ad="home-top"]{width:100%;margin:64px auto 0}.hero > .rocimar-ad--available[data-rocimar-ad="home-top"] .rocimar-ad__available-link{min-height:110px}}';
  css.textContent += 'body > .rocimar-ad[data-rocimar-ad="home-top"]{display:block;width:min(100%,1200px);max-width:1200px;margin:0 auto;padding:0}body > .rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__label{margin:0;padding:2px 5px}body > .rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__link{display:block;width:100%;height:auto;min-height:0;aspect-ratio:auto;background:transparent;border:0;border-radius:0}body > .rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__image{display:block;width:100%;height:auto;max-height:none;object-fit:contain}body > .rocimar-ad--available[data-rocimar-ad="home-top"] .rocimar-ad__available-link{aspect-ratio:auto;min-height:125px;border-radius:0}@media(max-width:740px){body > .rocimar-ad[data-rocimar-ad="home-top"]{width:100%;margin:0 auto}body > .rocimar-ad--available[data-rocimar-ad="home-top"] .rocimar-ad__available-link{min-height:110px}}';
  css.textContent += 'body > .rocimar-ad[data-rocimar-ad="home-top"]{width:100%!important;max-width:none!important;margin:0!important;padding:0!important}body > .rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__label{padding-left:12px}body > .rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__link{width:100%;border:0;border-radius:0}body > .rocimar-ad[data-rocimar-ad="home-top"] .rocimar-ad__image{width:100%;height:auto;max-height:none;object-fit:fill}';
  css.textContent += '.rocimar-ad--available{margin:20px auto;max-width:1100px}.rocimar-ad__available-link{position:relative;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;text-align:center;min-height:180px;padding:26px 20px;overflow:hidden;border:2px solid #c18a25;border-radius:16px;background:radial-gradient(ellipse at 50% 36%,#fff4cf 0%,#f5d78c 54%,#d79a37 100%);color:#082d4c;text-decoration:none;box-shadow:inset 0 0 0 3px rgba(255,249,226,.55);font-family:Arial,sans-serif}.rocimar-ad__available-link::after{content:"";position:absolute;inset:auto -8% -42% -8%;height:58%;border-top:2px solid rgba(255,255,255,.65);border-radius:50%;transform:rotate(-4deg);pointer-events:none}.rocimar-ad__available-icon{font-size:25px;line-height:1}.rocimar-ad__available-kicker{font:700 11px Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase}.rocimar-ad__available-link strong{position:relative;z-index:1;font:700 clamp(20px,3vw,38px) Georgia,serif;line-height:1.13;max-width:90%}.rocimar-ad__available-cta{position:relative;z-index:1;display:inline-block;background:#092e4c;color:#fff;border:1px solid #bd8a32;border-radius:40px;padding:11px 24px;font:700 12px Arial,sans-serif;letter-spacing:.07em;text-transform:uppercase}.rocimar-ad__available-link:focus-visible{outline:3px solid #0c4e7d;outline-offset:3px}.rocimar-ad--available[data-rocimar-ad="home-top"] .rocimar-ad__available-link{min-height:250px}.rocimar-ad--available[data-rocimar-ad="news-between"] .rocimar-ad__available-link{min-height:205px}.rocimar-ad--available[data-rocimar-ad="news-inline"] .rocimar-ad__available-link{min-height:200px}.rocimar-ad--available[data-rocimar-ad="news-sidebar"] .rocimar-ad__available-link{min-height:260px}.rocimar-ad--available[data-rocimar-ad="cabimas"] .rocimar-ad__available-link{min-height:210px}@media(max-width:740px){.rocimar-ad--available{margin:16px 12px}.rocimar-ad__available-link,.rocimar-ad--available[data-rocimar-ad] .rocimar-ad__available-link{min-height:150px;padding:20px 12px;gap:7px}.rocimar-ad__available-link strong{font-size:clamp(18px,5vw,27px)}.rocimar-ad__available-kicker{font-size:9px}.rocimar-ad__available-cta{font-size:10px;padding:9px 16px}}';
  document.head.appendChild(css);
  const safeUrl = value => { try { const u = new URL(value, location.origin); return u.protocol === 'https:' ? u.href : null; } catch { return null; } };
  async function render() {
    const targets = [...document.querySelectorAll('[data-rocimar-ad]')].filter(el=>allowed.has(el.dataset.rocimarAd));
    if (!targets.length) return;
    let campaigns;
    try {
      const res = await fetch('/api/ads', {cache:'no-store'});
      if (!res.ok) throw Error('Ads unavailable');
      const config = await res.json();
      campaigns = Array.isArray(config.campaigns) ? config.campaigns : [];
    } catch { campaigns = []; }
    targets.forEach(target => {
      const slot = target.dataset.rocimarAd;
      const eligible = campaigns.filter(a => a && a.slot===slot && safeUrl(a.url) && safeUrl(a.image));
      if (!eligible.length) {
        const label=document.createElement('span');label.className='rocimar-ad__label';label.textContent='Espacio publicitario disponible';
        const link=document.createElement('a');link.className='rocimar-ad__available-link';
        const message='Hola, deseo información sobre los espacios publicitarios de Rocimar Morales ('+slot+').';
        link.href='https://wa.me/584141675017?text='+encodeURIComponent(message);
        link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Solicitar información sobre publicidad por WhatsApp');
        const icon=document.createElement('span');icon.className='rocimar-ad__available-icon';icon.setAttribute('aria-hidden','true');icon.textContent='📣';
        const kicker=document.createElement('span');kicker.className='rocimar-ad__available-kicker';kicker.textContent='Espacio publicitario disponible';
        const title=document.createElement('strong');title.textContent='Tu negocio puede anunciarse aquí';
        const action=document.createElement('span');action.className='rocimar-ad__available-cta';action.textContent='Solicita información ↗';
        link.append(icon,kicker,title,action);target.replaceChildren(label,link);target.classList.add('rocimar-ad','rocimar-ad--available');return;
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
