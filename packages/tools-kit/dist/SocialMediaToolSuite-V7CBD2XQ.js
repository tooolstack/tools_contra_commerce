"use client";
import {
  DropdownControl
} from "./chunk-NCBI5OCB.js";

// src/components/SocialMediaToolSuite.tsx
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var input = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var primary = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40";
var secondary = "rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-40";
function Layout({ form, result }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
    /* @__PURE__ */ jsx("section", { className: "space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: form }),
    /* @__PURE__ */ jsx("section", { className: "space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: result })
  ] });
}
function Field({ label, value, onChange, type = "text", placeholder }) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx("input", { className: input, type, value, placeholder, onChange: (e) => onChange(e.target.value) })
  ] });
}
function Area({ label, value, onChange, rows = 7, placeholder }) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx("textarea", { className: input, rows, value, placeholder, onChange: (e) => onChange(e.target.value) })
  ] });
}
function Select({ label, value, onChange, options }) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx(DropdownControl, { className: input, ariaLabel: label, value, onChange, options })
  ] });
}
function CopyButton({ text, label = "Copy result" }) {
  const [done, setDone] = useState(false);
  return /* @__PURE__ */ jsx("button", { className: primary, disabled: !text, onClick: async () => {
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  }, children: done ? "Copied" : label });
}
function Metric({ label, value, note }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-gray-50 p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-gray-500", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xl font-bold text-gray-950", children: value }),
    note && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: note })
  ] });
}
var num = (v) => Number(v) || 0;
function SocialMediaToolSuite({ tool }) {
  if (tool === "social-media-tools") return /* @__PURE__ */ jsx(SocialMediaTools, {});
  if (tool === "instagram-bio-generator") return /* @__PURE__ */ jsx(InstagramBio, {});
  if (tool === "hashtag-cleaner") return /* @__PURE__ */ jsx(HashtagCleaner, {});
  if (tool === "youtube-timestamp-generator") return /* @__PURE__ */ jsx(YoutubeTimestamps, {});
  if (tool === "thumbnail-title-checker") return /* @__PURE__ */ jsx(ThumbnailChecker, {});
  if (tool === "facebook-ad-formatter") return /* @__PURE__ */ jsx(FacebookAd, {});
  if (tool === "linkedin-post-formatter") return /* @__PURE__ */ jsx(LinkedInPost, {});
  if (tool === "twitter-thread-splitter") return /* @__PURE__ */ jsx(ThreadSplitter, {});
  if (tool === "engagement-rate-calculator") return /* @__PURE__ */ jsx(EngagementRate, {});
  if (tool === "influencer-rate-calculator") return /* @__PURE__ */ jsx(InfluencerRate, {});
  if (tool === "giveaway-winner-picker") return /* @__PURE__ */ jsx(GiveawayPicker, {});
  return /* @__PURE__ */ jsx(UsernameChecker, {});
}
var socialModules = [
  { slug: "instagram-bio-generator", title: "Instagram Bio Generator", group: "Create" },
  { slug: "caption-formatter", title: "Caption Line-Break Formatter", group: "Create" },
  { slug: "hashtag-cleaner", title: "Hashtag Cleaner", group: "Create" },
  { slug: "youtube-timestamp-generator", title: "YouTube Timestamp Generator", group: "Video" },
  { slug: "thumbnail-title-checker", title: "Thumbnail Title Checker", group: "Video" },
  { slug: "facebook-ad-formatter", title: "Facebook Ad Text Formatter", group: "Publish" },
  { slug: "linkedin-post-formatter", title: "LinkedIn Post Formatter", group: "Publish" },
  { slug: "twitter-thread-splitter", title: "X / Twitter Thread Splitter", group: "Publish" },
  { slug: "engagement-rate-calculator", title: "Engagement Rate Calculator", group: "Measure" },
  { slug: "influencer-rate-calculator", title: "Influencer Rate Calculator", group: "Measure" },
  { slug: "giveaway-winner-picker", title: "Giveaway Winner Picker", group: "Community" },
  { slug: "social-username-checker", title: "Username Availability Checker", group: "Community" }
];
function SocialMediaTools() {
  const [active, setActive] = useState("instagram-bio-generator");
  const selected = socialModules.find((item) => item.slug === active);
  const groups = Array.from(new Set(socialModules.map((item) => item.group)));
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "self-start rounded-2xl border border-gray-200 bg-white p-3 shadow-sm xl:sticky xl:top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-3 pb-3 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-violet-600", children: "12 focused tools" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold text-gray-950", children: "Social Media Tools" })
      ] }),
      groups.map((group) => /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: group }),
        socialModules.filter((item) => item.group === group).map((item) => /* @__PURE__ */ jsx("button", { onClick: () => setActive(item.slug), className: `mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${active === item.slug ? "bg-gray-950 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`, children: item.title }, item.slug))
      ] }, group))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-violet-50 to-pink-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-violet-600", children: "Social Media Tools" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold text-gray-950", children: selected.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Work privately in your browser, then copy the finished result to your platform." })
      ] }),
      active === "caption-formatter" ? /* @__PURE__ */ jsx(CaptionLineBreakFormatter, {}) : /* @__PURE__ */ jsx(SocialMediaToolSuite, { tool: active })
    ] })
  ] });
}
function CaptionLineBreakFormatter() {
  const [text, setText] = useState("New collection available now. Order today. #fashion #bangladesh");
  const [width, setWidth] = useState("42");
  const output = useMemo(() => text.split(/\s+/).reduce((lines, word) => {
    const last = lines.at(-1) || "";
    if (!last || last.length + word.length + 1 > num(width)) lines.push(word);
    else lines[lines.length - 1] = `${last} ${word}`;
    return lines;
  }, []).join("\n"), [text, width]);
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Area, { label: "Caption", value: text, onChange: setText, rows: 12 }),
    /* @__PURE__ */ jsx(Field, { type: "number", label: "Maximum characters per line", value: width, onChange: setWidth })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Area, { label: "Formatted caption", value: output, onChange: () => {
    }, rows: 12 }),
    /* @__PURE__ */ jsx(Metric, { label: "Caption length", value: `${text.length} characters`, note: `${output.split("\n").length} formatted lines` }),
    /* @__PURE__ */ jsx(CopyButton, { text: output })
  ] }) });
}
function InstagramBio() {
  const [name, setName] = useState("Nirob");
  const [role, setRole] = useState("E-commerce growth partner");
  const [value, setValue] = useState("Helping brands sell more with practical tools");
  const [proof, setProof] = useState("500+ businesses supported");
  const [cta, setCta] = useState("Get the free tools \u2193");
  const [style, setStyle] = useState("Clean");
  const emoji = style === "Emoji-led";
  const variants = [
    `${emoji ? "\u{1F680} " : ""}${role}
${emoji ? "\u{1F4A1} " : ""}${value}
${emoji ? "\u2713 " : ""}${proof}
${emoji ? "\u{1F447} " : ""}${cta}`,
    `${name} | ${role}
${value}
${proof}
${cta}`,
    `${role}
${proof}
${value}
${cta}`
  ];
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Field, { label: "Name or brand", value: name, onChange: setName }),
    /* @__PURE__ */ jsx(Field, { label: "What you do", value: role, onChange: setRole }),
    /* @__PURE__ */ jsx(Field, { label: "Value you provide", value, onChange: setValue }),
    /* @__PURE__ */ jsx(Field, { label: "Proof or credibility", value: proof, onChange: setProof }),
    /* @__PURE__ */ jsx(Field, { label: "Call to action", value: cta, onChange: setCta }),
    /* @__PURE__ */ jsx(Select, { label: "Style", value: style, onChange: setStyle, options: ["Clean", "Emoji-led"] })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Three ready-to-test bios" }),
    variants.map((bio, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap text-sm leading-6", children: bio }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: `text-xs ${bio.length > 150 ? "text-red-600" : "text-gray-500"}`, children: [
          bio.length,
          "/150 characters"
        ] }),
        /* @__PURE__ */ jsx(CopyButton, { text: bio, label: "Copy bio" })
      ] })
    ] }, i))
  ] }) });
}
function HashtagCleaner() {
  const [raw, setRaw] = useState("#SmallBusiness, #Marketing #marketing\n#Bangladesh!! ecommerce growth");
  const tags = useMemo(() => Array.from(new Set(raw.split(/[\s,;]+/).map((t) => t.trim().replace(/^#+/, "").replace(/[^\p{L}\p{N}_]/gu, "")).filter(Boolean).map((t) => t.toLocaleLowerCase()))), [raw]);
  const output = tags.map((t) => `#${t}`).join(" ");
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Area, { label: "Paste hashtags or keywords", value: raw, onChange: setRaw, rows: 11 }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Removes duplicates, punctuation, empty tags and inconsistent capitalization. Unicode hashtags are preserved." })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Metric, { label: "Unique hashtags", value: `${tags.length}`, note: tags.length > 30 ? "Instagram posts allow at most 30 hashtags. Reduce this list." : "Ready for review." }),
    /* @__PURE__ */ jsx(Area, { label: "Cleaned hashtags", value: output, onChange: () => {
    }, rows: 9 }),
    /* @__PURE__ */ jsx(CopyButton, { text: output })
  ] }) });
}
function YoutubeTimestamps() {
  const [raw, setRaw] = useState("0:00 Introduction\n1:24 The main problem\n4:08 Step-by-step solution\n8:32 Final recommendations");
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const valid = lines.filter((l) => /^(?:\d+:)?\d{1,2}:\d{2}\s+.+/.test(l));
  const output = valid.map((l, i) => `${l}${i === 0 && !/^0+:00\s/.test(l) ? "" : ""}`).join("\n");
  const startsZero = /^0+:00\s/.test(valid[0] || "");
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Area, { label: "Timestamps and chapter titles", value: raw, onChange: setRaw, rows: 12, placeholder: "0:00 Introduction" }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-900", children: "YouTube chapters need at least three timestamps, the first must start at 0:00, and each chapter should be at least 10 seconds long." })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Metric, { label: "Valid chapters", value: `${valid.length}`, note: !startsZero ? "First timestamp must be 0:00." : valid.length < 3 ? "Add at least three chapters." : "Basic chapter requirements satisfied." }),
    /* @__PURE__ */ jsx(Area, { label: "YouTube-ready chapters", value: output, onChange: () => {
    }, rows: 10 }),
    /* @__PURE__ */ jsx(CopyButton, { text: output })
  ] }) });
}
function ThumbnailChecker() {
  const [title, setTitle] = useState("STOP WASTING MONEY ON FACEBOOK ADS");
  const words = title.trim().split(/\s+/).filter(Boolean);
  const score = Math.max(0, 100 - Math.max(0, title.length - 45) * 2 - Math.max(0, words.length - 7) * 7 - (title === title.toUpperCase() ? 8 : 0));
  const checks = [["Readable length", title.length <= 45], ["Seven words or fewer", words.length <= 7], ["Contains a strong verb", /\b(stop|make|build|fix|grow|save|avoid|learn|get|win)\b/i.test(title)], ["No ending punctuation", !/[.!?,;:]$/.test(title)]];
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Field, { label: "Thumbnail title", value: title, onChange: setTitle }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "This evaluates readability and scan speed; it cannot predict click-through rate." })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-gray-950 to-blue-900 p-8 text-center text-3xl font-black uppercase leading-tight text-white shadow-inner", children: title || "Your title" }),
    /* @__PURE__ */ jsx(Metric, { label: "Readability score", value: `${score}/100`, note: `${title.length} characters \xB7 ${words.length} words` }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: checks.map(([label, pass]) => /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-3 text-sm font-medium ${pass ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`, children: [
      pass ? "\u2713" : "\u25B3",
      " ",
      label
    ] }, label)) })
  ] }) });
}
function FacebookAd() {
  const [hook, setHook] = useState("Running ads but still unsure where your profit goes?");
  const [body, setBody] = useState("Calculate your real profit after delivery fees, returns and advertising costs.");
  const [headline, setHeadline] = useState("Know Your Real Profit");
  const [description, setDescription] = useState("Free calculator. No signup required.");
  const [cta, setCta] = useState("Learn More");
  const text = `${hook}

${body}

${headline}
${description}`;
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Area, { label: "Opening hook", value: hook, onChange: setHook, rows: 3 }),
    /* @__PURE__ */ jsx(Area, { label: "Primary message", value: body, onChange: setBody, rows: 5 }),
    /* @__PURE__ */ jsx(Field, { label: "Headline", value: headline, onChange: setHeadline }),
    /* @__PURE__ */ jsx(Field, { label: "Description", value: description, onChange: setDescription }),
    /* @__PURE__ */ jsx(Select, { label: "Call-to-action button", value: cta, onChange: setCta, options: ["Learn More", "Shop Now", "Sign Up", "Get Offer", "Contact Us", "Send Message"] })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-300 bg-white", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 text-sm whitespace-pre-wrap", children: `${hook}

${body}` }),
      /* @__PURE__ */ jsx("div", { className: "aspect-[1.91/1] bg-gradient-to-br from-blue-700 to-gray-950 p-8 text-2xl font-bold text-white", children: headline }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-gray-50 p-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: headline }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: description })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "rounded-md bg-gray-200 px-3 py-2 text-xs font-semibold", children: cta })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
        "Primary text: ",
        hook.length + body.length + 2,
        " characters"
      ] }),
      /* @__PURE__ */ jsx(CopyButton, { text })
    ] })
  ] }) });
}
function LinkedInPost() {
  const [hook, setHook] = useState("Most businesses do not have a revenue problem. They have a visibility problem.");
  const [body, setBody] = useState("Revenue can look healthy while delivery fees, returns and advertising costs quietly remove the margin.\n\nTrack contribution profit\u2014not only sales.");
  const [cta, setCta] = useState("What metric changed how you run your business?");
  const [tags, setTags] = useState("#ecommerce #businessgrowth");
  const output = `${hook}

${body}

${cta}

${tags}`;
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Area, { label: "Opening hook", value: hook, onChange: setHook, rows: 3 }),
    /* @__PURE__ */ jsx(Area, { label: "Main post", value: body, onChange: setBody, rows: 8 }),
    /* @__PURE__ */ jsx(Field, { label: "Conversation prompt", value: cta, onChange: setCta }),
    /* @__PURE__ */ jsx(Field, { label: "Hashtags", value: tags, onChange: setTags })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-full bg-blue-700 font-bold text-white", children: "in" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Your profile" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Just now \xB7 \u{1F310}" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap text-sm leading-6", children: output })
    ] }),
    /* @__PURE__ */ jsx(Metric, { label: "Post length", value: `${output.length}/3,000`, note: hook.length > 210 ? "Your hook may be truncated before \u201Csee more\u201D." : "Hook is compact enough for the opening preview." }),
    /* @__PURE__ */ jsx(CopyButton, { text: output })
  ] }) });
}
function ThreadSplitter() {
  const [text, setText] = useState("A useful social media thread starts with one clear promise. Then each post should deliver one idea, use specific evidence, and create a reason to continue. End with a practical takeaway and a focused call to action.");
  const [limit, setLimit] = useState("280");
  const [numbering, setNumbering] = useState("Numbered");
  const posts = useMemo(() => {
    const max = Math.max(40, num(limit) - (numbering === "Numbered" ? 8 : 0));
    const words = text.trim().split(/\s+/);
    const chunks = [];
    let line = "";
    for (const word of words) {
      if (line && `${line} ${word}`.length > max) {
        chunks.push(line);
        line = word;
      } else line = line ? `${line} ${word}` : word;
    }
    if (line) chunks.push(line);
    return chunks.map((c, i) => numbering === "Numbered" ? `${i + 1}/${chunks.length} ${c}` : c);
  }, [text, limit, numbering]);
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Area, { label: "Long post or article", value: text, onChange: setText, rows: 14 }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Select, { label: "Character limit", value: limit, onChange: setLimit, options: ["280", "250", "200"] }),
      /* @__PURE__ */ jsx(Select, { label: "Thread numbering", value: numbering, onChange: setNumbering, options: ["Numbered", "No numbering"] })
    ] })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Metric, { label: "Thread length", value: `${posts.length} posts` }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: posts.map((post, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 p-4", children: [
      /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap text-sm", children: post }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: `text-xs ${post.length > num(limit) ? "text-red-600" : "text-gray-500"}`, children: [
          post.length,
          "/",
          limit
        ] }),
        /* @__PURE__ */ jsx(CopyButton, { text: post, label: "Copy" })
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsx(CopyButton, { text: posts.join("\n\n"), label: "Copy full thread" })
  ] }) });
}
function EngagementRate() {
  const [followers, setFollowers] = useState("25000");
  const [likes, setLikes] = useState("950");
  const [comments, setComments] = useState("75");
  const [saves, setSaves] = useState("120");
  const [shares, setShares] = useState("55");
  const [posts, setPosts] = useState("10");
  const total = num(likes) + num(comments) + num(saves) + num(shares), perPost = total / Math.max(1, num(posts)), rate = perPost / Math.max(1, num(followers)) * 100;
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Field, { type: "number", label: "Followers", value: followers, onChange: setFollowers }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Totals across the measured posts" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Field, { type: "number", label: "Likes", value: likes, onChange: setLikes }),
      /* @__PURE__ */ jsx(Field, { type: "number", label: "Comments", value: comments, onChange: setComments }),
      /* @__PURE__ */ jsx(Field, { type: "number", label: "Saves", value: saves, onChange: setSaves }),
      /* @__PURE__ */ jsx(Field, { type: "number", label: "Shares", value: shares, onChange: setShares })
    ] }),
    /* @__PURE__ */ jsx(Field, { type: "number", label: "Number of posts", value: posts, onChange: setPosts })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Metric, { label: "Engagement rate by followers", value: `${rate.toFixed(2)}%`, note: "(Average engagements per post \xF7 followers) \xD7 100" }),
    /* @__PURE__ */ jsx(Metric, { label: "Average engagements per post", value: Math.round(perPost).toLocaleString() }),
    /* @__PURE__ */ jsx(Metric, { label: "Total measured engagements", value: total.toLocaleString(), note: "Compare accounts using the same formula, platform and content period." })
  ] }) });
}
function InfluencerRate() {
  const [followers, setFollowers] = useState("50000");
  const [engagement, setEngagement] = useState("4.2");
  const [format, setFormat] = useState("Instagram Reel");
  const [usage, setUsage] = useState("Organic post only");
  const [exclusivity, setExclusivity] = useState("None");
  const base = num(followers) / 1e3 * 900;
  const engagementFactor = Math.max(0.65, Math.min(2, num(engagement) / 3));
  const formatFactor = { "Instagram Story": 0.45, "Instagram Post": 1, "Instagram Reel": 1.6, "YouTube Integration": 2.4, "TikTok Video": 1.4 };
  const usageFactor = usage === "Organic post only" ? 1 : usage === "30-day paid usage" ? 1.5 : 2;
  const exclusive = exclusivity === "None" ? 1 : exclusivity === "30 days" ? 1.2 : 1.4;
  const low = base * engagementFactor * (formatFactor[format] || 1) * usageFactor * exclusive, high = low * 1.6;
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Field, { type: "number", label: "Followers", value: followers, onChange: setFollowers }),
    /* @__PURE__ */ jsx(Field, { type: "number", label: "Average engagement rate (%)", value: engagement, onChange: setEngagement }),
    /* @__PURE__ */ jsx(Select, { label: "Deliverable", value: format, onChange: setFormat, options: ["Instagram Story", "Instagram Post", "Instagram Reel", "TikTok Video", "YouTube Integration"] }),
    /* @__PURE__ */ jsx(Select, { label: "Content usage rights", value: usage, onChange: setUsage, options: ["Organic post only", "30-day paid usage", "90-day paid usage"] }),
    /* @__PURE__ */ jsx(Select, { label: "Category exclusivity", value: exclusivity, onChange: setExclusivity, options: ["None", "30 days", "90 days"] })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Metric, { label: "Suggested negotiation range", value: `\u09F3${Math.round(low).toLocaleString()}\u2013\u09F3${Math.round(high).toLocaleString()}`, note: "Planning estimate\u2014not a guaranteed market price." }),
    /* @__PURE__ */ jsx(Metric, { label: "Recommended opening quote", value: `\u09F3${Math.round(high * 1.1).toLocaleString()}`, note: "Leaves room for negotiation." }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-900", children: "Adjust for audience location, content quality, production cost, niche demand, conversion history, licensing and taxes. Put deliverables and usage rights in writing." })
  ] }) });
}
function GiveawayPicker() {
  const [raw, setRaw] = useState("Ayesha\nRahim\nNusrat\nAyesha\nTanvir\nMaliha");
  const [count, setCount] = useState("1");
  const [winners, setWinners] = useState([]);
  const entries = useMemo(() => Array.from(new Map(raw.split("\n").map((v) => v.trim()).filter(Boolean).map((v) => [v.toLocaleLowerCase(), v])).values()), [raw]);
  const pick = () => {
    const pool = [...entries], chosen = [];
    const take = Math.min(Math.max(1, num(count)), pool.length);
    while (chosen.length < take) {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      const index = values[0] % pool.length;
      chosen.push(pool.splice(index, 1)[0]);
    }
    setWinners(chosen);
  };
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Area, { label: "Entries \u2014 one name or username per line", value: raw, onChange: setRaw, rows: 14 }),
    /* @__PURE__ */ jsx(Field, { type: "number", label: "Number of winners", value: count, onChange: setCount }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        entries.length,
        " unique eligible entries"
      ] }),
      /* @__PURE__ */ jsxs("span", { children: [
        raw.split("\n").filter((v) => v.trim()).length - entries.length,
        " duplicates removed"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("button", { className: primary, disabled: !entries.length, onClick: pick, children: [
      "Pick winner",
      num(count) > 1 ? "s" : ""
    ] })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Winner results" }),
    winners.length ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: winners.map((winner, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 p-5 text-white", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold uppercase tracking-wider", children: [
        "Winner ",
        i + 1
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xl font-bold", children: winner })
    ] }, winner)) }) : /* @__PURE__ */ jsx("div", { className: "grid min-h-52 place-items-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-500", children: "Winners will appear here" }),
    /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: "Uses cryptographically secure browser randomness and removes case-insensitive duplicates. Save your original entrant list for audit purposes." }),
    winners.length > 0 && /* @__PURE__ */ jsx(CopyButton, { text: winners.join("\n"), label: "Copy winners" })
  ] }) });
}
function UsernameChecker() {
  const [name, setName] = useState("contra.tools");
  const clean = name.trim().replace(/^@/, "").replace(/\s+/g, "");
  const platforms = [["Instagram", `https://www.instagram.com/${clean}/`], ["TikTok", `https://www.tiktok.com/@${clean}`], ["YouTube", `https://www.youtube.com/@${clean}`], ["X / Twitter", `https://x.com/${clean}`], ["Facebook", `https://www.facebook.com/${clean}`], ["LinkedIn", `https://www.linkedin.com/in/${clean}`]];
  const [status, setStatus] = useState({});
  return /* @__PURE__ */ jsx(Layout, { form: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Field, { label: "Username", value: name, onChange: (v) => {
      setName(v);
      setStatus({});
    }, placeholder: "yourbrand" }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-blue-50 p-4 text-xs leading-5 text-blue-900", children: "Platforms block reliable automatic bulk checks. Open each official profile URL, confirm whether it exists, then record the result here. This avoids false availability claims." }),
    /* @__PURE__ */ jsx(CopyButton, { text: `@${clean}`, label: "Copy username" })
  ] }), result: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Check official platform pages" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: platforms.map(([platform, url]) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: platform }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
          "@",
          clean
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("a", { className: secondary, href: url, target: "_blank", rel: "noreferrer", children: "Open check" }),
        /* @__PURE__ */ jsx(DropdownControl, { ariaLabel: `${platform} status`, className: "rounded-xl border border-gray-300 px-2 text-xs", value: status[platform] || "Unchecked", onChange: (value) => setStatus((old) => ({ ...old, [platform]: value })), options: ["Unchecked", "Available", "Taken", "Reserved"] })
      ] })
    ] }) }, platform)) })
  ] }) });
}
export {
  SocialMediaToolSuite
};
