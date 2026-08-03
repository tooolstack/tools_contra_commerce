import { NextResponse } from 'next/server';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

const RATE_WINDOW_MS=60_000;
const RATE_LIMIT=20;
const allowedModes=new Set(['api-viewer','headers','redirect','seo-audit','broken-links']);
type RateEntry={count:number;resetAt:number};
const rateStore=(globalThis as typeof globalThis&{__contraUrlInspectRates?:Map<string,RateEntry>}).__contraUrlInspectRates??=new Map<string,RateEntry>();

export function rateLimitKey(request:Request){
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||request.headers.get('x-real-ip')||'anonymous';
}
export function consumeRateLimit(key:string,now=Date.now()){
  if(rateStore.size>5_000)for(const [storedKey,entry] of rateStore)if(entry.resetAt<=now)rateStore.delete(storedKey);
  const current=rateStore.get(key);
  if(!current||current.resetAt<=now){rateStore.set(key,{count:1,resetAt:now+RATE_WINDOW_MS});return {allowed:true,retryAfter:0,remaining:RATE_LIMIT-1}}
  if(current.count>=RATE_LIMIT)return {allowed:false,retryAfter:Math.max(1,Math.ceil((current.resetAt-now)/1000)),remaining:0};
  current.count+=1;return {allowed:true,retryAfter:0,remaining:RATE_LIMIT-current.count};
}

export async function readTextLimited(response:Response,maxBytes:number){
  const reader=response.body?.getReader();
  if(!reader)return {text:'',bytes:0,truncated:false};
  const decoder=new TextDecoder();let bytes=0,text='',truncated=false;
  try{
    while(true){
      const {done,value}=await reader.read();if(done)break;
      const available=maxBytes-bytes;
      if(value.byteLength>available){if(available>0)text+=decoder.decode(value.subarray(0,available),{stream:true});bytes=maxBytes;truncated=true;await reader.cancel();break}
      bytes+=value.byteLength;text+=decoder.decode(value,{stream:true});
      if(bytes===maxBytes){truncated=true;await reader.cancel();break}
    }
    text+=decoder.decode();
    return {text,bytes,truncated};
  }finally{reader.releaseLock()}
}

export function privateAddress(address:string){
  const value=address.toLowerCase();
  if(value==='::1'||value==='::'||value.startsWith('fc')||value.startsWith('fd')||value.startsWith('fe80:'))return true;
  if(value.startsWith('::ffff:'))return privateAddress(value.slice(7));
  if(!isIP(value))return true;
  if(isIP(value)===4){const [a,b]=value.split('.').map(Number);return a===10||a===127||a===0||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&b===168||a>=224}
  return false;
}
async function assertPublic(url:URL){
  if(!['http:','https:'].includes(url.protocol))throw new Error('Only HTTP and HTTPS URLs are supported.');
  if(url.username||url.password)throw new Error('URLs containing credentials are not allowed.');
  if(url.port&&!['80','443'].includes(url.port))throw new Error('Only standard web ports are allowed.');
  const records=await lookup(url.hostname,{all:true,verbatim:true});
  if(!records.length||records.some(record=>privateAddress(record.address)))throw new Error('Local, private and reserved network destinations are blocked.');
}
function headersObject(headers:Headers){return Object.fromEntries(Array.from(headers.entries()).sort(([a],[b])=>a.localeCompare(b)))}
function attr(html:string,tag:string,name:string,value:string){const patterns=[new RegExp(`<${tag}[^>]*${name}=["']${value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["'][^>]*content=["']([^"']*)["']`,'i'),new RegExp(`<${tag}[^>]*content=["']([^"']*)["'][^>]*${name}=["']${value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`,'i')];return patterns.map(p=>html.match(p)?.[1]).find(Boolean)||null}
function linkAttr(html:string,rel:string){const tags=html.match(/<link\b[^>]*>/gi)||[];const tag=tags.find(item=>new RegExp(`rel=["'][^"']*\\b${rel}\\b`,'i').test(item));return tag?.match(/href=["']([^"']+)/i)?.[1]||null}
function titleOf(html:string){return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].replace(/\s+/g,' ').trim()||null}
function technologies(html:string,headers:Headers){const found:string[]=[];const signals:[string,RegExp][]=[['WordPress',/wp-content|wp-includes/i],['Shopify',/cdn\.shopify\.com|Shopify\.theme/i],['WooCommerce',/woocommerce/i],['Next.js',/_next\/static|__NEXT_DATA__/i],['React',/data-reactroot|__REACT_DEVTOOLS_GLOBAL_HOOK__/i],['Vue',/data-v-|__VUE__/i],['Google Analytics',/googletagmanager\.com\/gtag|google-analytics\.com/i],['Google Tag Manager',/googletagmanager\.com\/gtm\.js/i],['Meta Pixel',/connect\.facebook\.net\/.*fbevents/i],['Cloudflare',/cdn-cgi/i]];for(const [name,re] of signals)if(re.test(html))found.push(name);const powered=headers.get('x-powered-by');const server=headers.get('server');if(powered)found.push(`X-Powered-By: ${powered}`);if(server)found.push(`Server: ${server}`);return Array.from(new Set(found))}

export async function POST(request:Request){
  try{
    const rate=consumeRateLimit(rateLimitKey(request));
    if(!rate.allowed)return NextResponse.json({error:'Too many URL inspection requests. Please try again shortly.'},{status:429,headers:{'Retry-After':String(rate.retryAfter),'X-RateLimit-Remaining':'0'}});
    const requestLength=Number(request.headers.get('content-length')||0);
    if(requestLength>8_192)return NextResponse.json({error:'Request body is too large.'},{status:413});
    const body=await request.json() as {url?:string;mode?:string};
    if(typeof body.url!=='string'||body.url.length>2048)return NextResponse.json({error:'Enter a valid public URL.'},{status:400});
    if(typeof body.mode!=='string'||!allowedModes.has(body.mode))return NextResponse.json({error:'Unsupported inspection mode.'},{status:400});
    let current=new URL(body.url); const chain:Array<{url:string;status:number;location?:string}> = [];
    for(let hop=0;hop<8;hop++){
      await assertPublic(current);
      const response=await fetch(current,{method:'GET',redirect:'manual',headers:{'user-agent':'ContraCommerce-URL-Inspector/1.0','accept':'application/json,text/plain,text/html;q=0.8'},signal:AbortSignal.timeout(10000)});
      const location=response.headers.get('location')||undefined;
      chain.push({url:current.toString(),status:response.status,...(location?{location}:{})});
      if(location&&response.status>=300&&response.status<400){current=new URL(location,current);continue}
      const base={requestedUrl:body.url,finalUrl:current.toString(),status:response.status,statusText:response.statusText,redirects:chain,headers:headersObject(response.headers)};
      if(body.mode==='api-viewer'){
        const contentType=response.headers.get('content-type')||'';const limited=await readTextLimited(response,200_000);let responseBody:unknown=limited.text;if(contentType.includes('json'))try{responseBody=JSON.parse(limited.text)}catch{}
        return NextResponse.json({...base,contentType,body:responseBody,bytesRead:limited.bytes,truncated:limited.truncated});
      }
      if(body.mode==='seo-audit'||body.mode==='broken-links'){
        const limited=await readTextLimited(response,1_000_000);const raw=limited.text;const canonicalRaw=linkAttr(raw,'canonical');const canonical=canonicalRaw?new URL(canonicalRaw,current).toString():null;
        const metadata={title:titleOf(raw),description:attr(raw,'meta','name','description'),canonical,robots:attr(raw,'meta','name','robots'),openGraph:{title:attr(raw,'meta','property','og:title'),description:attr(raw,'meta','property','og:description'),image:attr(raw,'meta','property','og:image'),url:attr(raw,'meta','property','og:url')},twitter:{card:attr(raw,'meta','name','twitter:card'),title:attr(raw,'meta','name','twitter:title'),description:attr(raw,'meta','name','twitter:description'),image:attr(raw,'meta','name','twitter:image')}};
        const hrefs=Array.from(raw.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)).map(match=>{try{return new URL(match[1],current).toString()}catch{return null}}).filter((value):value is string=>Boolean(value)&&/^https?:/i.test(value!));
        const images=(raw.match(/<img\b/gi)||[]).length,scripts=(raw.match(/<script\b[^>]*src=/gi)||[]).length,styles=(raw.match(/<link\b[^>]*rel=["'][^"']*stylesheet/gi)||[]).length;
        if(body.mode==='broken-links'){
          const unique=Array.from(new Set(hrefs)).slice(0,25);const checks=await Promise.all(unique.map(async url=>{try{const target=new URL(url);await assertPublic(target);const checked=await fetch(target,{method:'HEAD',redirect:'manual',headers:{'user-agent':'ContraCommerce-Link-Checker/1.0'},signal:AbortSignal.timeout(7000)});return {url,status:checked.status,ok:checked.status<400,location:checked.headers.get('location')}}catch(error){return {url,status:0,ok:false,error:error instanceof Error?error.message:'Check failed'}}}));
          return NextResponse.json({...base,documentTruncated:limited.truncated,discoveredLinks:new Set(hrefs).size,checkedLinks:checks.length,broken:checks.filter(item=>!item.ok),links:checks});
        }
        return NextResponse.json({...base,metadata,page:{htmlBytes:limited.bytes,htmlKilobytes:Number((limited.bytes/1024).toFixed(1)),truncated:limited.truncated,images,scripts,styles,links:new Set(hrefs).size},technologies:technologies(raw,response.headers),checks:{canonicalMatchesFinalUrl:canonical===current.toString(),hasViewport:/<meta[^>]*name=["']viewport["']/i.test(raw),hasLang:/<html[^>]*lang=["'][^"']+/i.test(raw),hasOpenGraph:Boolean(metadata.openGraph.title&&metadata.openGraph.image),hasTwitterCard:Boolean(metadata.twitter.card)}});
      }
      return NextResponse.json(base);
    }
    return NextResponse.json({error:'Too many redirects.',redirects:chain},{status:400});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'URL inspection failed.'},{status:400})}
}
