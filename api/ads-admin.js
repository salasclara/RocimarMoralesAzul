// ROCIMAR ADS administrator proxy. All secrets remain server-side on Vercel.
const crypto=require('crypto');
const SOURCE=(process.env.ROCIMAR_ADS_BACKEND_URL||'').replace(/\/$/,'');
function response(res,status,data){res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');return res.status(status).json(data)}
function secrets(){const password=process.env.ROCIMAR_ADS_PASSWORD,signing=process.env.ROCIMAR_ADS_COOKIE_SECRET,token=process.env.ROCIMAR_ADS_ADMIN_TOKEN;if(!password||password.length<16||!signing||signing.length<32||!token||token.length<32)throw Error('Ads secrets missing or too short');return {password,signing,token}}
function equal(a,b){const x=crypto.createHash('sha256').update(a).digest(),y=crypto.createHash('sha256').update(b).digest();return crypto.timingSafeEqual(x,y)}
function sig(s,key){return crypto.createHmac('sha256',key).update(s).digest('base64url')}
function authorized(req,key){try{const raw=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('rocimar_ads='));if(!raw)return false;const [body,signature]=raw.slice('rocimar_ads='.length).split('.');if(!body||!signature||!equal(signature,sig(body,key)))return false;const data=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));return data.admin===true&&data.exp>Date.now()}catch{return false}}
function sameOrigin(req){try{const origin=new URL(req.headers.origin);const host=req.headers['x-forwarded-host']||req.headers.host;return origin.protocol==='https:'&&origin.host===host}catch{return false}}
module.exports=async(req,res)=>{
 try{
  if(!process.env.ROCIMAR_ADS_BACKEND_URL)throw Error('Ads backend not configured');
  const {password,signing,token}=secrets();
  const action=String(req.query.action||'');
  if(req.method!=='GET'&&!sameOrigin(req))return response(res,403,{error:'Origen no permitido'});
  if(action==='login'&&req.method==='POST'){
   const ip=String(req.headers['x-forwarded-for']||'').split(',')[0].trim().slice(0,100);
   const key=crypto.createHmac('sha256',signing).update('login|'+ip).digest('hex');
   const limited=await fetch(SOURCE+'/ads/limit',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({key,kind:'login'}),signal:AbortSignal.timeout(5000)});
   if(!limited.ok)throw Error('Login limiter unavailable');
   if(!(await limited.json()).allowed)return response(res,429,{error:'Demasiados intentos. Inténtalo en 15 minutos'});
   if(!equal(String(req.body?.password||''),password))return response(res,401,{error:'Credenciales incorrectas'});
   const body=Buffer.from(JSON.stringify({admin:true,exp:Date.now()+4*3600000})).toString('base64url');
   res.setHeader('Set-Cookie','rocimar_ads='+body+'.'+sig(body,signing)+'; Path=/api/ads-admin; HttpOnly; Secure; SameSite=Strict; Max-Age=14400');
   return response(res,200,{ok:true});
  }
  if(!authorized(req,signing))return response(res,401,{error:'Acceso no autorizado'});
  if(action==='logout'&&req.method==='POST'){
   res.setHeader('Set-Cookie','rocimar_ads=; Path=/api/ads-admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
   return response(res,200,{ok:true});
  }
  if(action==='session'&&req.method==='GET')return response(res,200,{authenticated:true});
  const allowed={campaigns:['GET','POST','PATCH'],stats:['GET']};
  if(!allowed[action]?.includes(req.method))return response(res,405,{error:'Operación no permitida'});
  const id=String(req.query.id||'');
  if(req.method==='PATCH'&&!/^[0-9a-f-]{36}$/i.test(id))return response(res,400,{error:'ID inválido'});
  const path=action==='stats'?'/ads/stats':'/ads/campaigns'+(req.method==='PATCH'?'?id='+encodeURIComponent(id):'');
  const upstream=await fetch(SOURCE+path,{method:req.method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(req.method==='GET'?{}:{body:JSON.stringify(req.body||{})}),signal:AbortSignal.timeout(7000)});
  const result=await upstream.json();
  return response(res,upstream.status,result);
 }catch(e){console.error('ads admin:',e.message);return response(res,503,{error:'Administración no disponible',codigo:e.message.startsWith('Ads secrets missing')?'CONFIG_SECRETOS':e.message==='Ads backend not configured'?'CONFIG_BACKEND':e.message==='Login limiter unavailable'?'LIMITE_RAILWAY':'CONEXION_RAILWAY'})}
};
