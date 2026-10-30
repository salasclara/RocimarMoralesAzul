// Public read-only ROCIMAR ADS API. No credentials or campaign editing exposed.
const SOURCE='https://rocimar-servidor-v2-production.up.railway.app/ads/public';
module.exports=async(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=120');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Método no permitido'})}
 try{
  const upstream=await fetch(SOURCE,{signal:AbortSignal.timeout(5000)});
  if(!upstream.ok)throw Error('Railway unavailable '+upstream.status);
  const data=await upstream.json();
  if(!Array.isArray(data.campaigns))throw Error('Invalid ads payload');
  return res.status(200).json({version:1,campaigns:data.campaigns});
 }catch(e){console.error('ads proxy:',e.message);return res.status(200).json({version:1,campaigns:[]})}
};
