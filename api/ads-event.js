const crypto=require('crypto');
const SOURCE=(process.env.ROCIMAR_ADS_BACKEND_URL||'').replace(/\/$/,'');
function hash(value,secret){return crypto.createHmac('sha256',secret).update(value).digest('hex')}
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST')return res.status(405).json({error:'Método no permitido'});
 const origin=req.headers.origin;const host=req.headers['x-forwarded-host']||req.headers.host;
 if(!origin||!host||origin!=='https://'+host)return res.status(403).json({error:'Origen no permitido'});
 const id=String(req.body?.id||''),type=req.body?.type;
 if(!/^[0-9a-f-]{36}$/i.test(id)||!['impression','click'].includes(type))return res.status(400).json({error:'Evento inválido'});
 if(!process.env.ROCIMAR_ADS_BACKEND_URL)return res.status(503).json({error:'Servidor de anuncios no configurado'});
 const token=process.env.ROCIMAR_ADS_ADMIN_TOKEN,secret=process.env.ROCIMAR_ADS_COOKIE_SECRET;
 if(!token||token.length<32||!secret||secret.length<32)return res.status(503).json({error:'Medición no configurada'});
 const ip=String(req.headers['x-forwarded-for']||'').split(',')[0].trim().slice(0,100);
 const ua=String(req.headers['user-agent']||'').slice(0,150);
 const key=hash(ip+'|'+ua+'|'+id,secret);
 const headers={Authorization:'Bearer '+token,'Content-Type':'application/json'};
 try{
  const limit=await fetch(SOURCE+'/ads/limit',{method:'POST',headers,body:JSON.stringify({key,kind:type}),signal:AbortSignal.timeout(5000)});
  if(!limit.ok)throw Error('Limiter unavailable');
  const result=await limit.json();
  if(!result.allowed)return res.status(429).json({error:'Límite de medición alcanzado'});
  const recorded=await fetch(SOURCE+'/ads/event',{method:'POST',headers,body:JSON.stringify({id,type}),signal:AbortSignal.timeout(5000)});
  return res.status(recorded.ok?204:recorded.status).end();
 }catch(e){console.error('ads event:',e.message);return res.status(503).json({error:'Medición no disponible'})}
};
