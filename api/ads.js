// Public read-only ROCIMAR ADS API. No credentials or campaign editing exposed.
const fs=require('fs');
const path=require('path');
const SLOTS=new Set(['home-top','news-inline','news-sidebar','news-between','cabimas']);
function https(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:null}catch{return null}}
function valid(a,now){return a&&typeof a==='object'&&a.status==='approved'&&SLOTS.has(a.slot)&&https(a.url)&&https(a.image)&&typeof a.name==='string'&&a.name.length<=100&&typeof a.alt==='string'&&a.alt.length<=140&&(!a.start||(Number.isFinite(Date.parse(a.start))&&Date.parse(a.start)<=now))&&(!a.end||(Number.isFinite(Date.parse(a.end))&&Date.parse(a.end)>now))&&(!a.start||!a.end||Date.parse(a.end)>Date.parse(a.start))}
module.exports=(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=120');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Método no permitido'})}
 try{
  const data=JSON.parse(fs.readFileSync(path.join(process.cwd(),'ads','config.json'),'utf8'));
  const now=Date.now();
  const campaigns=(Array.isArray(data.campaigns)?data.campaigns:[]).filter(a=>valid(a,now)).map(a=>({id:String(a.id||'').slice(0,80),name:a.name,slot:a.slot,url:https(a.url),image:https(a.image),alt:a.alt}));
  return res.status(200).json({version:1,campaigns});
 }catch(e){console.error('ads configuration unavailable',e.message);return res.status(503).json({error:'Publicidad temporalmente no disponible',campaigns:[]})}
};
