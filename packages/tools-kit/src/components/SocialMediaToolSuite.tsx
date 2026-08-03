'use client';

import { useMemo, useState } from 'react';
import { DropdownControl } from './ui';

export type SocialMediaToolSlug =
  | 'social-media-tools' | 'instagram-bio-generator' | 'hashtag-cleaner' | 'youtube-timestamp-generator'
  | 'thumbnail-title-checker' | 'facebook-ad-formatter' | 'linkedin-post-formatter'
  | 'twitter-thread-splitter' | 'engagement-rate-calculator' | 'influencer-rate-calculator'
  | 'giveaway-winner-picker' | 'social-username-checker';

const input = 'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100';
const primary = 'rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40';
const secondary = 'rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-40';

function Layout({ form, result }: { form: React.ReactNode; result: React.ReactNode }) {
  return <div className="grid gap-5 lg:grid-cols-2"><section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">{form}</section><section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">{result}</section></div>;
}
function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">{label}</span><input className={input} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></label>;
}
function Area({ label, value, onChange, rows = 7, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">{label}</span><textarea className={input} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></label>;
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">{label}</span><DropdownControl className={input} ariaLabel={label} value={value} onChange={onChange} options={options}/></label>;
}
function CopyButton({ text, label = 'Copy result' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return <button className={primary} disabled={!text} onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1200); }}>{done ? 'Copied' : label}</button>;
}
function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div className="rounded-xl border border-gray-200 bg-gray-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold text-gray-950">{value}</p>{note && <p className="mt-1 text-xs text-gray-500">{note}</p>}</div>;
}
const num = (v: string) => Number(v) || 0;

export function SocialMediaToolSuite({ tool }: { tool: SocialMediaToolSlug }) {
  if (tool === 'social-media-tools') return <SocialMediaTools />;
  if (tool === 'instagram-bio-generator') return <InstagramBio />;
  if (tool === 'hashtag-cleaner') return <HashtagCleaner />;
  if (tool === 'youtube-timestamp-generator') return <YoutubeTimestamps />;
  if (tool === 'thumbnail-title-checker') return <ThumbnailChecker />;
  if (tool === 'facebook-ad-formatter') return <FacebookAd />;
  if (tool === 'linkedin-post-formatter') return <LinkedInPost />;
  if (tool === 'twitter-thread-splitter') return <ThreadSplitter />;
  if (tool === 'engagement-rate-calculator') return <EngagementRate />;
  if (tool === 'influencer-rate-calculator') return <InfluencerRate />;
  if (tool === 'giveaway-winner-picker') return <GiveawayPicker />;
  return <UsernameChecker />;
}

type SocialModule = Exclude<SocialMediaToolSlug, 'social-media-tools'> | 'caption-formatter';
const socialModules: { slug: SocialModule; title: string; group: string }[] = [
  { slug: 'instagram-bio-generator', title: 'Instagram Bio Generator', group: 'Create' },
  { slug: 'caption-formatter', title: 'Caption Line-Break Formatter', group: 'Create' },
  { slug: 'hashtag-cleaner', title: 'Hashtag Cleaner', group: 'Create' },
  { slug: 'youtube-timestamp-generator', title: 'YouTube Timestamp Generator', group: 'Video' },
  { slug: 'thumbnail-title-checker', title: 'Thumbnail Title Checker', group: 'Video' },
  { slug: 'facebook-ad-formatter', title: 'Facebook Ad Text Formatter', group: 'Publish' },
  { slug: 'linkedin-post-formatter', title: 'LinkedIn Post Formatter', group: 'Publish' },
  { slug: 'twitter-thread-splitter', title: 'X / Twitter Thread Splitter', group: 'Publish' },
  { slug: 'engagement-rate-calculator', title: 'Engagement Rate Calculator', group: 'Measure' },
  { slug: 'influencer-rate-calculator', title: 'Influencer Rate Calculator', group: 'Measure' },
  { slug: 'giveaway-winner-picker', title: 'Giveaway Winner Picker', group: 'Community' },
  { slug: 'social-username-checker', title: 'Username Availability Checker', group: 'Community' },
];

function SocialMediaTools() {
  const [active, setActive] = useState<SocialModule>('instagram-bio-generator');
  const selected = socialModules.find((item) => item.slug === active)!;
  const groups = Array.from(new Set(socialModules.map((item) => item.group)));
  return <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
    <aside className="self-start rounded-2xl border border-gray-200 bg-white p-3 shadow-sm xl:sticky xl:top-4">
      <div className="px-3 pb-3 pt-2"><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-600">12 focused tools</p><h2 className="mt-1 text-lg font-bold text-gray-950">Social Media Tools</h2></div>
      {groups.map((group) => <div key={group} className="mb-3"><p className="px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400">{group}</p>{socialModules.filter((item) => item.group === group).map((item) => <button key={item.slug} onClick={() => setActive(item.slug)} className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${active === item.slug ? 'bg-gray-950 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}>{item.title}</button>)}</div>)}
    </aside>
    <div className="min-w-0"><div className="mb-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-violet-50 to-pink-50 p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-violet-600">Social Media Tools</p><h2 className="mt-1 text-2xl font-bold text-gray-950">{selected.title}</h2><p className="mt-1 text-sm text-gray-600">Work privately in your browser, then copy the finished result to your platform.</p></div>{active === 'caption-formatter' ? <CaptionLineBreakFormatter /> : <SocialMediaToolSuite tool={active} />}</div>
  </div>;
}

function CaptionLineBreakFormatter() {
  const [text,setText]=useState('New collection available now. Order today. #fashion #bangladesh'); const [width,setWidth]=useState('42');
  const output=useMemo(()=>text.split(/\s+/).reduce((lines:string[],word)=>{const last=lines.at(-1)||'';if(!last||last.length+word.length+1>num(width))lines.push(word);else lines[lines.length-1]=`${last} ${word}`;return lines},[]).join('\n'),[text,width]);
  return <Layout form={<><Area label="Caption" value={text} onChange={setText} rows={12}/><Field type="number" label="Maximum characters per line" value={width} onChange={setWidth}/></>} result={<><Area label="Formatted caption" value={output} onChange={()=>{}} rows={12}/><Metric label="Caption length" value={`${text.length} characters`} note={`${output.split('\n').length} formatted lines`}/><CopyButton text={output}/></>} />;
}

function InstagramBio() {
  const [name,setName]=useState('Nirob'); const [role,setRole]=useState('E-commerce growth partner'); const [value,setValue]=useState('Helping brands sell more with practical tools'); const [proof,setProof]=useState('500+ businesses supported'); const [cta,setCta]=useState('Get the free tools ↓'); const [style,setStyle]=useState('Clean');
  const emoji = style === 'Emoji-led';
  const variants = [
    `${emoji?'🚀 ':''}${role}\n${emoji?'💡 ':''}${value}\n${emoji?'✓ ':''}${proof}\n${emoji?'👇 ':''}${cta}`,
    `${name} | ${role}\n${value}\n${proof}\n${cta}`,
    `${role}\n${proof}\n${value}\n${cta}`,
  ];
  return <Layout form={<><Field label="Name or brand" value={name} onChange={setName}/><Field label="What you do" value={role} onChange={setRole}/><Field label="Value you provide" value={value} onChange={setValue}/><Field label="Proof or credibility" value={proof} onChange={setProof}/><Field label="Call to action" value={cta} onChange={setCta}/><Select label="Style" value={style} onChange={setStyle} options={['Clean','Emoji-led']}/></>} result={<><p className="text-sm font-semibold">Three ready-to-test bios</p>{variants.map((bio,i)=><div key={i} className="rounded-xl border border-gray-200 p-4"><div className="whitespace-pre-wrap text-sm leading-6">{bio}</div><div className="mt-3 flex items-center justify-between"><span className={`text-xs ${bio.length>150?'text-red-600':'text-gray-500'}`}>{bio.length}/150 characters</span><CopyButton text={bio} label="Copy bio"/></div></div>)}</>} />;
}

function HashtagCleaner() {
  const [raw,setRaw]=useState('#SmallBusiness, #Marketing #marketing\n#Bangladesh!! ecommerce growth');
  const tags=useMemo(()=>Array.from(new Set(raw.split(/[\s,;]+/).map(t=>t.trim().replace(/^#+/,'').replace(/[^\p{L}\p{N}_]/gu,'')).filter(Boolean).map(t=>t.toLocaleLowerCase()))),[raw]);
  const output=tags.map(t=>`#${t}`).join(' ');
  return <Layout form={<><Area label="Paste hashtags or keywords" value={raw} onChange={setRaw} rows={11}/><p className="text-xs text-gray-500">Removes duplicates, punctuation, empty tags and inconsistent capitalization. Unicode hashtags are preserved.</p></>} result={<><Metric label="Unique hashtags" value={`${tags.length}`} note={tags.length>30?'Instagram posts allow at most 30 hashtags. Reduce this list.':'Ready for review.'}/><Area label="Cleaned hashtags" value={output} onChange={()=>{}} rows={9}/><CopyButton text={output}/></>} />;
}

function YoutubeTimestamps() {
  const [raw,setRaw]=useState('0:00 Introduction\n1:24 The main problem\n4:08 Step-by-step solution\n8:32 Final recommendations');
  const lines=raw.split('\n').map(l=>l.trim()).filter(Boolean); const valid=lines.filter(l=>/^(?:\d+:)?\d{1,2}:\d{2}\s+.+/.test(l));
  const output=valid.map((l,i)=>`${l}${i===0&&!/^0+:00\s/.test(l)?'':''}`).join('\n'); const startsZero=/^0+:00\s/.test(valid[0]||'');
  return <Layout form={<><Area label="Timestamps and chapter titles" value={raw} onChange={setRaw} rows={12} placeholder="0:00 Introduction"/><div className="rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-900">YouTube chapters need at least three timestamps, the first must start at 0:00, and each chapter should be at least 10 seconds long.</div></>} result={<><Metric label="Valid chapters" value={`${valid.length}`} note={!startsZero?'First timestamp must be 0:00.':valid.length<3?'Add at least three chapters.':'Basic chapter requirements satisfied.'}/><Area label="YouTube-ready chapters" value={output} onChange={()=>{}} rows={10}/><CopyButton text={output}/></>} />;
}

function ThumbnailChecker() {
  const [title,setTitle]=useState('STOP WASTING MONEY ON FACEBOOK ADS'); const words=title.trim().split(/\s+/).filter(Boolean); const score=Math.max(0,100-Math.max(0,title.length-45)*2-Math.max(0,words.length-7)*7-(title===title.toUpperCase()?8:0));
  const checks=[['Readable length',title.length<=45],['Seven words or fewer',words.length<=7],['Contains a strong verb',/\b(stop|make|build|fix|grow|save|avoid|learn|get|win)\b/i.test(title)],['No ending punctuation',!/[.!?,;:]$/.test(title)]] as const;
  return <Layout form={<><Field label="Thumbnail title" value={title} onChange={setTitle}/><p className="text-xs text-gray-500">This evaluates readability and scan speed; it cannot predict click-through rate.</p></>} result={<><div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-gray-950 to-blue-900 p-8 text-center text-3xl font-black uppercase leading-tight text-white shadow-inner">{title||'Your title'}</div><Metric label="Readability score" value={`${score}/100`} note={`${title.length} characters · ${words.length} words`}/><div className="grid gap-2 sm:grid-cols-2">{checks.map(([label,pass])=><div key={label} className={`rounded-lg p-3 text-sm font-medium ${pass?'bg-green-50 text-green-800':'bg-amber-50 text-amber-800'}`}>{pass?'✓':'△'} {label}</div>)}</div></>} />;
}

function FacebookAd() {
  const [hook,setHook]=useState('Running ads but still unsure where your profit goes?'); const [body,setBody]=useState('Calculate your real profit after delivery fees, returns and advertising costs.'); const [headline,setHeadline]=useState('Know Your Real Profit'); const [description,setDescription]=useState('Free calculator. No signup required.'); const [cta,setCta]=useState('Learn More');
  const text=`${hook}\n\n${body}\n\n${headline}\n${description}`;
  return <Layout form={<><Area label="Opening hook" value={hook} onChange={setHook} rows={3}/><Area label="Primary message" value={body} onChange={setBody} rows={5}/><Field label="Headline" value={headline} onChange={setHeadline}/><Field label="Description" value={description} onChange={setDescription}/><Select label="Call-to-action button" value={cta} onChange={setCta} options={['Learn More','Shop Now','Sign Up','Get Offer','Contact Us','Send Message']}/></>} result={<><div className="overflow-hidden rounded-xl border border-gray-300 bg-white"><div className="p-4 text-sm whitespace-pre-wrap">{`${hook}\n\n${body}`}</div><div className="aspect-[1.91/1] bg-gradient-to-br from-blue-700 to-gray-950 p-8 text-2xl font-bold text-white">{headline}</div><div className="flex items-center justify-between bg-gray-50 p-4"><div><p className="font-semibold">{headline}</p><p className="text-xs text-gray-500">{description}</p></div><span className="rounded-md bg-gray-200 px-3 py-2 text-xs font-semibold">{cta}</span></div></div><div className="flex items-center justify-between"><span className="text-xs text-gray-500">Primary text: {hook.length+body.length+2} characters</span><CopyButton text={text}/></div></>} />;
}

function LinkedInPost() {
  const [hook,setHook]=useState('Most businesses do not have a revenue problem. They have a visibility problem.'); const [body,setBody]=useState('Revenue can look healthy while delivery fees, returns and advertising costs quietly remove the margin.\n\nTrack contribution profit—not only sales.'); const [cta,setCta]=useState('What metric changed how you run your business?'); const [tags,setTags]=useState('#ecommerce #businessgrowth');
  const output=`${hook}\n\n${body}\n\n${cta}\n\n${tags}`;
  return <Layout form={<><Area label="Opening hook" value={hook} onChange={setHook} rows={3}/><Area label="Main post" value={body} onChange={setBody} rows={8}/><Field label="Conversation prompt" value={cta} onChange={setCta}/><Field label="Hashtags" value={tags} onChange={setTags}/></>} result={<><div className="rounded-xl border border-gray-200 p-5"><div className="mb-4 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-blue-700 font-bold text-white">in</div><div><p className="text-sm font-semibold">Your profile</p><p className="text-xs text-gray-500">Just now · 🌐</p></div></div><div className="whitespace-pre-wrap text-sm leading-6">{output}</div></div><Metric label="Post length" value={`${output.length}/3,000`} note={hook.length>210?'Your hook may be truncated before “see more”.':'Hook is compact enough for the opening preview.'}/><CopyButton text={output}/></>} />;
}

function ThreadSplitter() {
  const [text,setText]=useState('A useful social media thread starts with one clear promise. Then each post should deliver one idea, use specific evidence, and create a reason to continue. End with a practical takeaway and a focused call to action.'); const [limit,setLimit]=useState('280'); const [numbering,setNumbering]=useState('Numbered');
  const posts=useMemo(()=>{const max=Math.max(40,num(limit)-(numbering==='Numbered'?8:0)); const words=text.trim().split(/\s+/); const chunks:string[]=[]; let line=''; for(const word of words){if(line&&`${line} ${word}`.length>max){chunks.push(line);line=word}else line=line?`${line} ${word}`:word}if(line)chunks.push(line);return chunks.map((c,i)=>numbering==='Numbered'?`${i+1}/${chunks.length} ${c}`:c)},[text,limit,numbering]);
  return <Layout form={<><Area label="Long post or article" value={text} onChange={setText} rows={14}/><div className="grid gap-3 sm:grid-cols-2"><Select label="Character limit" value={limit} onChange={setLimit} options={['280','250','200']}/><Select label="Thread numbering" value={numbering} onChange={setNumbering} options={['Numbered','No numbering']}/></div></>} result={<><Metric label="Thread length" value={`${posts.length} posts`}/><div className="space-y-3">{posts.map((post,i)=><div key={i} className="rounded-xl border border-gray-200 p-4"><p className="whitespace-pre-wrap text-sm">{post}</p><div className="mt-2 flex items-center justify-between"><span className={`text-xs ${post.length>num(limit)?'text-red-600':'text-gray-500'}`}>{post.length}/{limit}</span><CopyButton text={post} label="Copy"/></div></div>)}</div><CopyButton text={posts.join('\n\n')} label="Copy full thread"/></>} />;
}

function EngagementRate() {
  const [followers,setFollowers]=useState('25000'); const [likes,setLikes]=useState('950'); const [comments,setComments]=useState('75'); const [saves,setSaves]=useState('120'); const [shares,setShares]=useState('55'); const [posts,setPosts]=useState('10');
  const total=num(likes)+num(comments)+num(saves)+num(shares), perPost=total/Math.max(1,num(posts)), rate=perPost/Math.max(1,num(followers))*100;
  return <Layout form={<><Field type="number" label="Followers" value={followers} onChange={setFollowers}/><p className="text-sm font-semibold">Totals across the measured posts</p><div className="grid gap-3 sm:grid-cols-2"><Field type="number" label="Likes" value={likes} onChange={setLikes}/><Field type="number" label="Comments" value={comments} onChange={setComments}/><Field type="number" label="Saves" value={saves} onChange={setSaves}/><Field type="number" label="Shares" value={shares} onChange={setShares}/></div><Field type="number" label="Number of posts" value={posts} onChange={setPosts}/></>} result={<><Metric label="Engagement rate by followers" value={`${rate.toFixed(2)}%`} note="(Average engagements per post ÷ followers) × 100"/><Metric label="Average engagements per post" value={Math.round(perPost).toLocaleString()}/><Metric label="Total measured engagements" value={total.toLocaleString()} note="Compare accounts using the same formula, platform and content period."/></>} />;
}

function InfluencerRate() {
  const [followers,setFollowers]=useState('50000'); const [engagement,setEngagement]=useState('4.2'); const [format,setFormat]=useState('Instagram Reel'); const [usage,setUsage]=useState('Organic post only'); const [exclusivity,setExclusivity]=useState('None');
  const base=num(followers)/1000*900; const engagementFactor=Math.max(.65,Math.min(2,num(engagement)/3)); const formatFactor:Record<string,number>={'Instagram Story':.45,'Instagram Post':1,'Instagram Reel':1.6,'YouTube Integration':2.4,'TikTok Video':1.4}; const usageFactor=usage==='Organic post only'?1:usage==='30-day paid usage'?1.5:2; const exclusive=exclusivity==='None'?1:exclusivity==='30 days'?1.2:1.4; const low=base*engagementFactor*(formatFactor[format]||1)*usageFactor*exclusive, high=low*1.6;
  return <Layout form={<><Field type="number" label="Followers" value={followers} onChange={setFollowers}/><Field type="number" label="Average engagement rate (%)" value={engagement} onChange={setEngagement}/><Select label="Deliverable" value={format} onChange={setFormat} options={['Instagram Story','Instagram Post','Instagram Reel','TikTok Video','YouTube Integration']}/><Select label="Content usage rights" value={usage} onChange={setUsage} options={['Organic post only','30-day paid usage','90-day paid usage']}/><Select label="Category exclusivity" value={exclusivity} onChange={setExclusivity} options={['None','30 days','90 days']}/></>} result={<><Metric label="Suggested negotiation range" value={`৳${Math.round(low).toLocaleString()}–৳${Math.round(high).toLocaleString()}`} note="Planning estimate—not a guaranteed market price."/><Metric label="Recommended opening quote" value={`৳${Math.round(high*1.1).toLocaleString()}`} note="Leaves room for negotiation."/><div className="rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-900">Adjust for audience location, content quality, production cost, niche demand, conversion history, licensing and taxes. Put deliverables and usage rights in writing.</div></>} />;
}

function GiveawayPicker() {
  const [raw,setRaw]=useState('Ayesha\nRahim\nNusrat\nAyesha\nTanvir\nMaliha'); const [count,setCount]=useState('1'); const [winners,setWinners]=useState<string[]>([]);
  const entries=useMemo(()=>Array.from(new Map(raw.split('\n').map(v=>v.trim()).filter(Boolean).map(v=>[v.toLocaleLowerCase(),v])).values()),[raw]);
  const pick=()=>{const pool=[...entries], chosen:string[]=[]; const take=Math.min(Math.max(1,num(count)),pool.length); while(chosen.length<take){const values=new Uint32Array(1);crypto.getRandomValues(values);const index=values[0]%pool.length;chosen.push(pool.splice(index,1)[0])}setWinners(chosen)};
  return <Layout form={<><Area label="Entries — one name or username per line" value={raw} onChange={setRaw} rows={14}/><Field type="number" label="Number of winners" value={count} onChange={setCount}/><div className="flex items-center justify-between text-xs text-gray-500"><span>{entries.length} unique eligible entries</span><span>{raw.split('\n').filter(v=>v.trim()).length-entries.length} duplicates removed</span></div><button className={primary} disabled={!entries.length} onClick={pick}>Pick winner{num(count)>1?'s':''}</button></>} result={<><p className="text-sm font-semibold">Winner results</p>{winners.length?<div className="space-y-3">{winners.map((winner,i)=><div key={winner} className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 p-5 text-white"><p className="text-xs font-semibold uppercase tracking-wider">Winner {i+1}</p><p className="mt-1 text-2xl font-bold">{winner}</p></div>)}</div>:<div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-500">Winners will appear here</div>}<p className="text-xs leading-5 text-gray-500">Uses cryptographically secure browser randomness and removes case-insensitive duplicates. Save your original entrant list for audit purposes.</p>{winners.length>0&&<CopyButton text={winners.join('\n')} label="Copy winners"/>}</>} />;
}

function UsernameChecker() {
  const [name,setName]=useState('contra.tools'); const clean=name.trim().replace(/^@/,'').replace(/\s+/g,''); const platforms=[['Instagram',`https://www.instagram.com/${clean}/`],['TikTok',`https://www.tiktok.com/@${clean}`],['YouTube',`https://www.youtube.com/@${clean}`],['X / Twitter',`https://x.com/${clean}`],['Facebook',`https://www.facebook.com/${clean}`],['LinkedIn',`https://www.linkedin.com/in/${clean}`]]; const [status,setStatus]=useState<Record<string,string>>({});
  return <Layout form={<><Field label="Username" value={name} onChange={(v)=>{setName(v);setStatus({})}} placeholder="yourbrand"/><div className="rounded-xl bg-blue-50 p-4 text-xs leading-5 text-blue-900">Platforms block reliable automatic bulk checks. Open each official profile URL, confirm whether it exists, then record the result here. This avoids false availability claims.</div><CopyButton text={`@${clean}`} label="Copy username"/></>} result={<><p className="text-sm font-semibold">Check official platform pages</p><div className="space-y-2">{platforms.map(([platform,url])=><div key={platform} className="rounded-xl border border-gray-200 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-semibold">{platform}</p><p className="text-xs text-gray-500">@{clean}</p></div><div className="flex gap-2"><a className={secondary} href={url} target="_blank" rel="noreferrer">Open check</a><DropdownControl ariaLabel={`${platform} status`} className="rounded-xl border border-gray-300 px-2 text-xs" value={status[platform]||'Unchecked'} onChange={(value)=>setStatus(old=>({...old,[platform]:value}))} options={['Unchecked','Available','Taken','Reserved']}/></div></div></div>)}</div></>} />;
}
