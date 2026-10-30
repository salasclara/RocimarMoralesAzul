// Execute locally with: node ads/test-api.js
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const api=require('../api/ads');
const configPath=path.join(__dirname,'config.json');
const original=fs.readFileSync(configPath,'utf8');
function call(method='GET'){let code=200,headers={};const res={setHeader(k,v){headers[k]=v},status(n){code=n;return this},json(data){return {code,headers,data}}};return api({method},res)}
try{
 const empty=call();assert.equal(empty.code,200);assert.deepEqual(empty.data.campaigns,[]);
 assert.equal(call('POST').code,405);
 const now=Date.now(),past=new Date(now-3600000).toISOString(),future=new Date(now+3600000).toISOString();
 const base={id:'a',name:'Negocio',slot:'cabimas',url:'https://example.com',image:'https://example.com/ad.png',alt:'Publicidad local',status:'approved',start:past,end:future};
 const cases=[base,{...base,id:'b',status:'draft'},{...base,id:'c',url:'javascript:alert(1)'},{...base,id:'d',end:past},{...base,id:'e',slot:'unknown'},{...base,id:'f',start:future,end:null}];
 fs.writeFileSync(configPath,JSON.stringify({version:1,campaigns:cases}));
 const result=call();assert.equal(result.code,200);assert.equal(result.data.campaigns.length,1);assert.equal(result.data.campaigns[0].id,'a');
 assert.equal(Object.hasOwn(result.data.campaigns[0],'status'),false);
 process.stdout.write('ROCIMAR ADS API: 5 checks passed\n');
}finally{fs.writeFileSync(configPath,original)}
