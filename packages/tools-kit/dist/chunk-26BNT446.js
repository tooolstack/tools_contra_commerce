// src/components/CreatorToolsStudio.tsx
import { useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var tools = [{ id: "script-timer", name: "Video Script Timer", group: "Video" }, { id: "speech-time", name: "Words-to-Speech-Time", group: "Video" }, { id: "scene", name: "Short Video Scene Planner", group: "Video" }, { id: "subtitle", name: "Subtitle Line Breaker", group: "Video" }, { id: "teleprompter", name: "Teleprompter", group: "Video" }, { id: "podcast", name: "Podcast Episode Planner", group: "Plan" }, { id: "calendar", name: "Content Calendar Generator", group: "Plan" }, { id: "repurpose", name: "Content Repurposing Planner", group: "Plan" }, { id: "hook", name: "Hook Generator", group: "Write" }, { id: "proposal", name: "Brand Collaboration Proposal", group: "Business" }, { id: "sponsorship", name: "Sponsorship Rate Calculator", group: "Business" }, { id: "youtube-revenue", name: "YouTube Revenue Estimator", group: "Business" }];
var defaults = { "script-timer": ["Most businesses do not have a revenue problem. They have a visibility problem. Revenue can look healthy while delivery fees, returns and advertising quietly remove the margin. Track contribution profit, not only sales.", "135"], "speech-time": ["Paste a speech, narration or presentation script here to estimate delivery time.", "130,15"], podcast: ["How small businesses can understand real profit", "30\nSolo educational"], hook: ["Real profit after advertising and delivery costs", "E-commerce owners\nEducational"], calendar: ["E-commerce profitability, customer trust, operations", "3 posts/week\n4 weeks"], sponsorship: ["50000,4.2,25000", "Dedicated video\n30-day paid usage"], "youtube-revenue": ["250000,3.5", "35\n10"], scene: ["Most businesses look at revenue. But revenue is not profit. Subtract product cost, delivery, returns and ads. Then you can see what each order really earns.", "45"], subtitle: ["Most businesses look at revenue, but revenue is not profit. Track every important cost before making a decision.", "32"], proposal: ["Contra Commerce Tools\nExample Brand", "One dedicated tutorial video\nTwo short vertical videos\n30-day organic usage\nCampaign goal: demonstrate practical business decisions"], repurpose: ["A detailed guide explaining how online stores can calculate real order profit after product cost, delivery fees, returns and advertising.", "YouTube video\nLinkedIn\nInstagram\nEmail newsletter"] };
var c = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var btn = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white";
var num = (x) => Number(x) || 0;
var words = (x) => x.trim().split(/\s+/).filter(Boolean);
var duration = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
function CreatorToolsStudio() {
  const [active, setActive] = useState("script-timer");
  const [a, setA] = useState(defaults["script-timer"][0]);
  const [b, setB] = useState(defaults["script-timer"][1]);
  const selected = tools.find((x) => x.id === active);
  const groups = Array.from(new Set(tools.map((x) => x.group)));
  const choose = (id) => {
    setActive(id);
    if (id !== "teleprompter") {
      setA(defaults[id][0]);
      setB(defaults[id][1]);
    }
  };
  const result = useMemo(() => active === "teleprompter" ? "" : run(active, a, b), [active, a, b]);
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "self-start rounded-2xl border bg-white p-3 shadow-sm xl:sticky xl:top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-3 pb-3 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-fuchsia-600", children: "12 creator utilities" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold", children: "Creator Tools" })
      ] }),
      groups.map((g) => /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: g }),
        tools.filter((x) => x.group === g).map((x) => /* @__PURE__ */ jsx("button", { onClick: () => choose(x.id), className: `mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${active === x.id ? "bg-gray-950 font-semibold text-white" : "text-gray-700 hover:bg-gray-100"}`, children: x.name }, x.id))
      ] }, g))
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border bg-gradient-to-r from-fuchsia-50 to-violet-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-fuchsia-700", children: "Creator Tools" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold", children: selected.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Plan, produce and price creator work privately in your browser." })
      ] }),
      active === "teleprompter" ? /* @__PURE__ */ jsx(Teleprompter, {}) : /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][0] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: active === "script-timer" || active === "speech-time" || active === "scene" || active === "subtitle" || active === "repurpose" ? 12 : 7, value: a, onChange: (e) => setA(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][1] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: 5, value: b, onChange: (e) => setB(e.target.value) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: "Revenue and sponsorship estimates are planning ranges. Actual results depend on audience, niche, geography, rights, conversion and platform policies." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
          /* @__PURE__ */ jsx("pre", { className: "max-h-[720px] min-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-gray-950 p-5 text-sm leading-7 text-emerald-300", children: result }),
          /* @__PURE__ */ jsx("button", { className: btn, onClick: () => navigator.clipboard.writeText(result), children: "Copy result" })
        ] })
      ] })
    ] })
  ] });
}
var labels = { "script-timer": ["Video script", "Speaking speed (words/minute)"], "speech-time": ["Text", "Speaking speed, pause allowance %"], podcast: ["Episode topic", "Duration minutes, format"], hook: ["Topic or promise", "Audience, content style"], calendar: ["Content pillars \u2014 comma-separated", "Posts/week, weeks"], sponsorship: ["Followers, engagement %, average views", "Deliverable, usage rights"], "youtube-revenue": ["Monthly views, playback CPM USD", "Monetized playback %, creator share %"], scene: ["Short-video script", "Target duration seconds"], subtitle: ["Subtitle text", "Maximum characters/line"], proposal: ["Creator/project, brand", "Deliverables and campaign goal"], repurpose: ["Source content summary", "Target channels \u2014 one per line"] };
function run(t, a, b) {
  if (t === "script-timer") {
    const count = words(a).length, seconds = count / Math.max(1, num(b)) * 60;
    return `Words: ${count}
Estimated narration: ${duration(seconds)}
Suggested scenes (one every 6\u20138 sec): ${Math.max(1, Math.ceil(seconds / 7))}
Suggested B-roll changes: ${Math.max(1, Math.ceil(seconds / 4))}

Read aloud once; emphasis and pauses change timing.`;
  }
  if (t === "speech-time") {
    const [speed, pause] = b.split(",").map(num), count = words(a).length, base = count / speed * 60, total = base * (1 + pause / 100);
    return `Words: ${count}
Base speaking time: ${duration(base)}
With ${pause}% pause allowance: ${duration(total)}
Fast rehearsal (160 wpm): ${duration(count / 160 * 60)}
Measured delivery (120 wpm): ${duration(count / 120 * 60)}`;
  }
  if (t === "podcast") {
    const [durationText, format] = b.split("\n"), minutes = num(durationText);
    return `${a.toUpperCase()}
Format: ${format} \xB7 Target: ${minutes} minutes

00:00\u2013${duration(minutes * 0.08 * 60)}  Cold open and listener promise
${duration(minutes * 0.08 * 60)}\u2013${duration(minutes * 0.18 * 60)}  Context and stakes
${duration(minutes * 0.18 * 60)}\u2013${duration(minutes * 0.65 * 60)}  Main discussion / three ideas
${duration(minutes * 0.65 * 60)}\u2013${duration(minutes * 0.85 * 60)}  Example, story or case study
${duration(minutes * 0.85 * 60)}\u2013${duration(minutes * 0.95 * 60)}  Practical takeaways
${duration(minutes * 0.95 * 60)}\u2013${duration(minutes * 60)}  CTA and next episode

PRE-PUBLISH
[ ] Fact-check claims \xB7 [ ] Clean audio \xB7 [ ] Title and artwork \xB7 [ ] Chapters and links`;
  }
  if (t === "hook") {
    const [audience = "your audience", style = "Practical"] = b.split("\n");
    const variants = [`Most ${audience.toLowerCase()} get ${a.toLowerCase()} wrong. Here\u2019s the practical fix.`, `Before you try ${a.toLowerCase()}, check these three things.`, `I tested a simpler way to approach ${a.toLowerCase()}.`, `The expensive mistake hiding inside ${a.toLowerCase()}.`, `If I had to achieve ${a.toLowerCase()} from zero, I would start here.`, `You do not need more complexity to improve ${a.toLowerCase()}.`];
    return `${style.toUpperCase()} HOOKS

${variants.map((x, i) => `${i + 1}. ${x}`).join("\n\n")}

Use a hook that the content genuinely fulfills.`;
  }
  if (t === "calendar") {
    const pillars = a.split(",").map((x) => x.trim()).filter(Boolean), [weekly, weeks] = b.match(/\d+/g)?.map(Number) || [3, 4];
    return `CONTENT CALENDAR \u2014 ${weeks} WEEKS \xD7 ${weekly} POSTS

${Array.from({ length: weeks }, (_, w) => `WEEK ${w + 1}
${Array.from({ length: weekly }, (_2, i) => {
      const p = pillars[(w * weekly + i) % pillars.length];
      return `${i + 1}. ${p} \u2014 ${i % 3 === 0 ? "Teach one practical method" : i % 3 === 1 ? "Share a proof, example or mistake" : "Ask a focused audience question"}`;
    }).join("\n")}`).join("\n\n")}

Balance creation with distribution, replies and review of actual performance.`;
  }
  if (t === "sponsorship") {
    const [followers, engagement, views] = a.split(",").map(num), [deliverable = "Dedicated video", rights = "Organic only"] = b.split("\n"), base = Math.max(followers / 1e3 * 700, views / 1e3 * 1200), factor = Math.max(0.7, engagement / 3) * (deliverable.toLowerCase().includes("dedicated") ? 1.5 : 1) * (rights.toLowerCase().includes("paid") ? 1.5 : 1), low = base * factor, high = low * 1.6;
    return `Suggested range: \u09F3${Math.round(low).toLocaleString()}\u2013\u09F3${Math.round(high).toLocaleString()}
Opening quote: \u09F3${Math.round(high * 1.1).toLocaleString()}
Deliverable: ${deliverable}
Rights: ${rights}

Price production, revisions, exclusivity, usage term, whitelisting, travel and taxes separately. Put every right in writing.`;
  }
  if (t === "youtube-revenue") {
    const [views, cpm] = a.split(",").map(num), [monetized, share] = b.split("\n").map(num), gross = views * monetized / 100 / 1e3 * cpm, creator = gross * share / 100;
    return `Estimated monetized playbacks: ${Math.round(views * monetized / 100).toLocaleString()}
Estimated gross ad value: $${gross.toFixed(2)}
Estimated creator revenue: $${creator.toFixed(2)}
Effective revenue per 1,000 total views: $${(creator / views * 1e3).toFixed(2)}

Not a guarantee. Geography, season, niche, ad inventory, video length and eligibility materially affect revenue.`;
  }
  if (t === "scene") {
    const seconds = num(b), chunks = a.split(/(?<=[.!?])\s+/).filter(Boolean), per = seconds / Math.max(1, chunks.length);
    return `SHORT VIDEO \u2014 ${seconds}s

${chunks.map((line, i) => `${duration(i * per)}\u2013${duration((i + 1) * per)}
VOICE: ${line}
VISUAL: ${i === 0 ? "Direct-to-camera hook / bold title" : i === chunks.length - 1 ? "Return to camera / CTA" : "Demonstration, screen recording or relevant B-roll"}
TEXT: ${words(line).slice(0, 6).join(" ")}`).join("\n\n")}

Keep on-screen text inside platform-safe areas and verify the final spoken timing.`;
  }
  if (t === "subtitle") {
    const max = Math.max(12, num(b)), tokens = words(a), lines = [];
    let line = "";
    tokens.forEach((word) => {
      if (line && `${line} ${word}`.length > max) {
        lines.push(line);
        line = word;
      } else line = line ? `${line} ${word}` : word;
    });
    if (line) lines.push(line);
    return `${lines.join("\n")}

${lines.length} lines \xB7 maximum ${max} characters requested
Review line breaks for meaning, speaker timing and reading speed.`;
  }
  if (t === "proposal") {
    const [creator, brand] = a.split("\n"), lines = b.split("\n");
    return `BRAND COLLABORATION PROPOSAL
${creator} \xD7 ${brand}

OBJECTIVE
${lines.find((x) => x.toLowerCase().startsWith("campaign goal"))?.split(":").slice(1).join(":").trim() || "Create useful content that connects the brand with a relevant audience."}

DELIVERABLES
${lines.filter((x) => !x.toLowerCase().startsWith("campaign goal")).map((x) => `\u2022 ${x}`).join("\n")}

CREATIVE APPROACH
The content will lead with a real audience problem, demonstrate the product or service clearly, and end with a measurable action. Claims and required disclosures will be approved before publication.

TIMELINE
\u2022 Brief and contract \xB7 concept approval \xB7 production \xB7 one consolidated revision \xB7 scheduled publication

COMMERCIAL TERMS TO CONFIRM
\u2022 Fee and payment timing
\u2022 Usage period, channels and territory
\u2022 Exclusivity and whitelisting
\u2022 Revision limit and cancellation
\u2022 Reporting window and disclosure requirements`;
  }
  const channels = b.split("\n").filter(Boolean);
  return `SOURCE IDEA
${a}

REPURPOSING MAP
${channels.map((channel, i) => `${i + 1}. ${channel.toUpperCase()}
${channel.toLowerCase().includes("youtube") ? "8\u201312 minute explanation with chapters and demonstration" : channel.toLowerCase().includes("linkedin") ? "Problem-led text post with one framework and discussion prompt" : channel.toLowerCase().includes("instagram") ? "30\u201345 second vertical video plus carousel summary" : channel.toLowerCase().includes("email") ? "Personal opening, three takeaways and one focused CTA" : "Adapt the core promise to the platform format"}
Angle: ${i % 2 ? "proof / example" : "how-to / mistake"}`).join("\n\n")}

Do not merely repost. Adapt hook, depth, aspect ratio and CTA to each channel.`;
}
function Teleprompter() {
  const [text, setText] = useState("Assalamu Alaikum. Paste your script here, choose a comfortable speed, and start the full-screen teleprompter.");
  const [speed, setSpeed] = useState("35");
  const box = useRef(null);
  const start = () => {
    box.current?.requestFullscreen();
    const el = box.current;
    if (!el) return;
    const id = setInterval(() => {
      el.scrollTop += 1;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) clearInterval(id);
    }, Math.max(15, 90 - num(speed)));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: "Script" }),
      /* @__PURE__ */ jsx("textarea", { className: c, rows: 9, value: text, onChange: (e) => setText(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-3", children: [
      /* @__PURE__ */ jsxs("label", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: "Scroll speed" }),
        /* @__PURE__ */ jsx("input", { className: c, type: "number", value: speed, onChange: (e) => setSpeed(e.target.value) })
      ] }),
      /* @__PURE__ */ jsx("button", { className: btn, onClick: start, children: "Start full screen" })
    ] }),
    /* @__PURE__ */ jsxs("div", { ref: box, className: "h-[520px] overflow-y-auto rounded-2xl bg-black px-[8vw] py-[38vh] text-center text-4xl font-semibold leading-relaxed text-white", children: [
      text,
      /* @__PURE__ */ jsx("div", { className: "h-[50vh]" })
    ] })
  ] });
}
var calculateCreatorTool = (tool, a, b) => run(tool, a, b);

export {
  CreatorToolsStudio,
  calculateCreatorTool
};
