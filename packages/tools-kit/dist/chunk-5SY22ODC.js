import {
  DropdownControl
} from "./chunk-NCBI5OCB.js";

// src/components/WebsiteSeoStudio.tsx
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var tools = [
  { id: "title", name: "Meta Title Length Checker", group: "Metadata", help: "Check title length, pixel estimate and search-result readability." },
  { id: "serp", name: "SERP Preview Tool", group: "Metadata", help: "Preview desktop and mobile-style organic search snippets." },
  { id: "og", name: "Open Graph Preview", group: "Metadata", help: "Preview link cards and generate Open Graph tags." },
  { id: "share-debug", name: "Social Sharing Preview Debugger", group: "Metadata", help: "Inspect live Open Graph and Twitter metadata." },
  { id: "robots", name: "Robots.txt Generator", group: "Crawl & Index", help: "Create a crawl policy with sitemap and AI crawler controls." },
  { id: "sitemap", name: "Sitemap Generator", group: "Crawl & Index", help: "Build standards-compliant sitemap XML from a URL list." },
  { id: "canonical", name: "Canonical URL Checker", group: "Crawl & Index", help: "Compare a live page canonical with its final URL." },
  { id: "broken", name: "Broken Link Checker", group: "Crawl & Index", help: "Check a sample of links discovered on a public page." },
  { id: "redirect-map", name: "Redirect Mapping Generator", group: "Crawl & Index", help: "Convert old/new URL pairs into CSV, Apache or Nginx rules." },
  { id: "density", name: "Keyword Density Checker", group: "Content", help: "Count words and phrases without encouraging keyword stuffing." },
  { id: "slug", name: "Slug Generator", group: "Content", help: "Create clean, lowercase URL slugs." },
  { id: "multilingual-slug", name: "Multilingual Slug Generator", group: "Content", help: "Preserve Unicode or transliterate common Bangla characters." },
  { id: "product-schema", name: "Product Schema Generator", group: "Content", help: "Generate validated Product and Offer JSON-LD." },
  { id: "domain", name: "Domain Name Generator", group: "Research", help: "Generate memorable domain candidates from a topic and benefit." },
  { id: "technology", name: "Website Technology Checker", group: "Research", help: "Detect common technologies from public page signals." },
  { id: "page-size", name: "Page Size Calculator", group: "Research", help: "Measure the downloaded HTML and declared resource counts." },
  { id: "vitals", name: "Core Web Vitals Checklist", group: "Quality", help: "Create a practical LCP, INP and CLS improvement checklist." },
  { id: "facebook-browser", name: "Facebook In-App Browser Tester", group: "Quality", help: "Audit mobile, redirect and sharing risks for Facebook traffic." },
  { id: "launch", name: "Website Launch Checklist Generator", group: "Quality", help: "Track essential launch checks and copy a handoff report." }
];
var c = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var btn = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40";
var defaults = { title: ["Free Business Tools for Better Decisions", ""], serp: ["Free Business Tools for Better Decisions", "Practical calculators and generators for commerce, creators and everyday work.\nhttps://example.com/free-tools"], og: ["Create Better Business Decisions", "Free private tools for practical everyday work.\nhttps://example.com/social-card.jpg"], robots: ["https://example.com/sitemap.xml", "Allow"], sitemap: ["https://example.com/\nhttps://example.com/products\nhttps://example.com/contact", "weekly"], canonical: ["https://example.com/page", ""], broken: ["https://example.com", ""], density: ["ecommerce", "Ecommerce businesses need clear ecommerce metrics. Revenue alone does not show ecommerce profit after delivery, returns and advertising."], slug: ["A Better Product Page: 10 Practical Ideas", ""], "redirect-map": ["/old-page,/new-page\n/previous-product,/products/new-product", "CSV"], domain: ["commerce tools", "better decisions"], technology: ["https://example.com", ""], "page-size": ["https://example.com", ""], vitals: ["E-commerce store", "Needs improvement"], "facebook-browser": ["https://example.com", ""], "share-debug": ["https://example.com", ""], "multilingual-slug": ["\u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7\u09B0 \u09B8\u09C7\u09B0\u09BE \u0985\u09A8\u09B2\u09BE\u0987\u09A8 \u09B6\u09AA", "Preserve Unicode"], "product-schema": ["Wireless Earbuds", "2490,BDT,InStock\nClear sound and long battery life."], launch: ["Business website", "Pre-launch"] };
var esc = (v) => v.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m]);
var slugify = (v, preserve = true) => v.normalize("NFKC").toLowerCase().trim().replace(preserve ? /[^\p{L}\p{N}]+/gu : /[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
var banglaMap = { "\u0986": "a", "\u0987": "i", "\u0988": "i", "\u0989": "u", "\u098F": "e", "\u0993": "o", "\u0995": "k", "\u0996": "kh", "\u0997": "g", "\u0998": "gh", "\u099A": "ch", "\u099B": "chh", "\u099C": "j", "\u099D": "jh", "\u099F": "t", "\u09A0": "th", "\u09A1": "d", "\u09A2": "dh", "\u09A4": "t", "\u09A5": "th", "\u09A6": "d", "\u09A7": "dh", "\u09A8": "n", "\u09AA": "p", "\u09AB": "f", "\u09AC": "b", "\u09AD": "bh", "\u09AE": "m", "\u09AF": "y", "\u09B0": "r", "\u09B2": "l", "\u09B6": "sh", "\u09B7": "sh", "\u09B8": "s", "\u09B9": "h", "\u0982": "ng", "\u09DF": "y", "\u09BE": "a", "\u09BF": "i", "\u09C0": "i", "\u09C1": "u", "\u09C2": "u", "\u09C7": "e", "\u09C8": "oi", "\u09CB": "o", "\u09CC": "ou", "\u09CD": "" };
function WebsiteSeoStudio({ endpoint = "/api/url-inspect" }) {
  const [active, setActive] = useState("title");
  const [a, setA] = useState(defaults.title[0]);
  const [b, setB] = useState(defaults.title[1]);
  const [remote, setRemote] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const selected = tools.find((t) => t.id === active);
  const groups = Array.from(new Set(tools.map((t) => t.group)));
  const choose = (id) => {
    setActive(id);
    setA(defaults[id][0]);
    setB(defaults[id][1]);
    setRemote("");
  };
  const local = useMemo(() => run(active, a, b), [active, a, b]);
  const result = remote || local;
  const isRemote = ["canonical", "broken", "technology", "page-size", "facebook-browser", "share-debug"].includes(active);
  const inspect = async () => {
    setBusy(true);
    setRemote("");
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: a, mode: active === "broken" ? "broken-links" : "seo-audit" }) });
      setRemote(JSON.stringify(await res.json(), null, 2));
    } catch (e) {
      setRemote(e instanceof Error ? e.message : "Inspection failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "self-start rounded-2xl border border-gray-200 bg-white p-3 shadow-sm xl:sticky xl:top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-3 pb-3 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-emerald-600", children: "19 focused utilities" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold", children: "Website & SEO Tools" })
      ] }),
      groups.map((g) => /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: g }),
        tools.filter((t) => t.group === g).map((t) => /* @__PURE__ */ jsx("button", { onClick: () => choose(t.id), className: `mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${active === t.id ? "bg-gray-950 font-semibold text-white" : "text-gray-700 hover:bg-gray-100"}`, children: t.name }, t.id))
      ] }, g))
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border border-gray-200 bg-gradient-to-r from-emerald-50 to-cyan-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-emerald-700", children: "Website & SEO Tools" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold", children: selected.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: selected.help })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx(Inputs, { tool: active, a, b, setA, setB }),
          isRemote && /* @__PURE__ */ jsx("button", { className: btn, disabled: busy, onClick: inspect, children: busy ? "Inspecting\u2026" : "Inspect public page" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: "Generators run locally. Public page checks use a guarded request that blocks private and local network destinations." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx(Preview, { tool: active, a, b }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Result" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
              result.length.toLocaleString(),
              " characters"
            ] })
          ] }),
          /* @__PURE__ */ jsx("pre", { className: "max-h-[620px] min-h-52 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-gray-950 p-4 text-xs leading-5 text-emerald-300", children: result || "Complete the inputs or run the page inspection." }),
          /* @__PURE__ */ jsx("button", { className: btn, disabled: !result, onClick: async () => {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }, children: copied ? "Copied" : "Copy result" })
        ] })
      ] })
    ] })
  ] });
}
function Inputs({ tool, a, b, setA, setB }) {
  const url = ["canonical", "broken", "technology", "page-size", "facebook-browser", "share-debug"].includes(tool);
  const labels = { serp: ["Meta title", "Description, then URL on a new line"], og: ["Card title", "Description, then image URL"], robots: ["Sitemap URL", "Crawler policy"], sitemap: ["URLs \u2014 one per line", "Change frequency"], density: ["Target keyword or phrase", "Page text"], "redirect-map": ["Old URL, new URL \u2014 one pair per line", "Output format"], domain: ["Topic or keyword", "Benefit or differentiator"], vitals: ["Website type", "Current assessment"], "multilingual-slug": ["Title or phrase", "Slug mode"], "product-schema": ["Product name", "Price, currency, availability \u2014 then description"], launch: ["Website type", "Launch stage"] };
  const pair = labels[tool];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    pair && ["robots", "sitemap", "redirect-map", "vitals", "multilingual-slug", "launch"].includes(tool) ? /* @__PURE__ */ jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: pair[1] }),
      /* @__PURE__ */ jsx(DropdownControl, { className: c, ariaLabel: pair[1], value: b, onChange: setB, options: { robots: ["Allow", "Block admin", "Block all", "Block AI training crawlers"], sitemap: ["daily", "weekly", "monthly", "yearly"], "redirect-map": ["CSV", "Apache .htaccess", "Nginx"], vitals: ["Good", "Needs improvement", "Poor"], "multilingual-slug": ["Preserve Unicode", "Transliterate Bangla", "ASCII only"], launch: ["Planning", "Pre-launch", "Post-launch"] }[tool] })
    ] }) : null,
    /* @__PURE__ */ jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: url ? "Public page URL" : pair?.[0] || "Input" }),
      url || tool === "title" || tool === "slug" ? /* @__PURE__ */ jsx("input", { className: c, value: a, onChange: (e) => setA(e.target.value) }) : /* @__PURE__ */ jsx("textarea", { className: c, rows: tool === "density" || tool === "sitemap" || tool === "redirect-map" ? 11 : 6, value: a, onChange: (e) => setA(e.target.value) })
    ] }),
    pair && !["robots", "sitemap", "redirect-map", "vitals", "multilingual-slug", "launch"].includes(tool) && /* @__PURE__ */ jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: pair[1] }),
      /* @__PURE__ */ jsx("textarea", { className: c, rows: tool === "density" ? 12 : 5, value: b, onChange: (e) => setB(e.target.value) })
    ] }),
    ["robots", "sitemap", "redirect-map", "vitals", "multilingual-slug", "launch"].includes(tool) && tool !== "title" && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
      "Selected option: ",
      /* @__PURE__ */ jsx("b", { children: b })
    ] })
  ] });
}
function Preview({ tool, a, b }) {
  if (tool === "serp") {
    const [desc, url = "https://example.com/page"] = b.split("\n");
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border p-5 font-sans", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-700", children: url }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl text-blue-800", children: a || "Page title" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-5 text-gray-600", children: desc })
    ] });
  }
  if (tool === "og") {
    const [desc, image] = b.split("\n");
    return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border", children: [
      /* @__PURE__ */ jsx("div", { className: "aspect-[1.91/1] bg-gray-100", children: image ? /* @__PURE__ */ jsx("img", { src: image, alt: "Open Graph preview", className: "h-full w-full object-cover" }) : null }),
      /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: a }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: desc })
      ] })
    ] });
  }
  if (tool === "title") return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xl text-blue-800", children: a }),
    /* @__PURE__ */ jsxs("p", { className: `mt-2 text-sm font-semibold ${a.length >= 30 && a.length <= 60 ? "text-emerald-700" : "text-amber-700"}`, children: [
      a.length,
      " characters \xB7 approximately ",
      Math.round(a.length * 8.2),
      " px"
    ] })
  ] });
  return null;
}
function run(tool, a, b) {
  if (["canonical", "broken", "technology", "page-size", "facebook-browser", "share-debug"].includes(tool)) return "";
  if (tool === "title") {
    const px = Math.round(a.length * 8.2);
    const issues = [a.length < 30 ? "Title may be too short." : "", a.length > 60 ? "Title may truncate in many results." : "", px > 580 ? "Estimated desktop width is above the common display range." : ""].filter(Boolean);
    return `Characters: ${a.length}
Estimated width: ${px}px
Status: ${issues.length ? issues.join(" ") : "Good working length. Review in context."}`;
  }
  if (tool === "serp") {
    const [desc, url = "https://example.com/page"] = b.split("\n");
    return `TITLE (${a.length}): ${a}
DESCRIPTION (${desc.length}): ${desc}
URL: ${url}

${a.length > 60 ? "\u25B3 Title may truncate." : "\u2713 Title length is workable."}
${desc.length > 160 ? "\u25B3 Description may truncate." : "\u2713 Description length is workable."}`;
  }
  if (tool === "og") {
    const [desc, image] = b.split("\n");
    return `<meta property="og:type" content="website">
<meta property="og:title" content="${esc(a)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(image || "https://example.com/social-card.jpg")}">
<meta name="twitter:card" content="summary_large_image">`;
  }
  if (tool === "robots") {
    const map = { Allow: "User-agent: *\nAllow: /", "Block admin": "User-agent: *\nDisallow: /admin/\nDisallow: /checkout/", "Block all": "User-agent: *\nDisallow: /", "Block AI training crawlers": "User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /" };
    return `${map[b] || map.Allow}

Sitemap: ${a}`;
  }
  if (tool === "sitemap") {
    const urls = a.split("\n").map((x) => x.trim()).filter(Boolean);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${esc(u)}</loc>
    <changefreq>${b}</changefreq>
  </url>`).join("\n")}
</urlset>`;
  }
  if (tool === "density") {
    const text = b.toLocaleLowerCase(), key = a.trim().toLocaleLowerCase();
    const words = text.match(/[\p{L}\p{N}]+/gu) || [];
    const count = key ? text.split(key).length - 1 : 0;
    const density = words.length ? count * Math.max(1, key.split(/\s+/).length) / words.length * 100 : 0;
    return `Total words: ${words.length}
Exact phrase occurrences: ${count}
Approximate density: ${density.toFixed(2)}%

Use this as an editing signal, not a ranking target. Cover the topic naturally and satisfy the reader\u2019s intent.`;
  }
  if (tool === "slug") return slugify(a, true);
  if (tool === "multilingual-slug") {
    if (b === "Preserve Unicode") return slugify(a, true);
    if (b === "ASCII only") return slugify(a.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""), false);
    return slugify(Array.from(a).map((ch) => banglaMap[ch] ?? ch).join(""), false);
  }
  if (tool === "redirect-map") {
    const pairs = a.split("\n").map((l) => l.split(",").map((x) => x.trim())).filter((p) => p[0] && p[1]);
    if (b === "Apache .htaccess") return pairs.map(([x, y]) => `Redirect 301 ${x} ${y}`).join("\n");
    if (b === "Nginx") return pairs.map(([x, y]) => `rewrite ^${x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$ ${y} permanent;`).join("\n");
    return `old_url,new_url,status
${pairs.map(([x, y]) => `${x},${y},301`).join("\n")}`;
  }
  if (tool === "domain") {
    const core = slugify(a, false).replace(/-/g, ""), benefit = slugify(b, false).split("-")[0];
    const starts = ["get", "try", "use", "my", "go"];
    const names = Array.from(/* @__PURE__ */ new Set([core, `${core}${benefit}`, `${benefit}${core}`, ...starts.map((x) => `${x}${core}`)])).filter(Boolean);
    return names.flatMap((name) => [".com", ".io", ".co"].map((tld) => `${name}${tld}`)).slice(0, 15).join("\n") + "\n\nAvailability is not guaranteed. Verify trademark, domain registration and matching social usernames.";
  }
  if (tool === "product-schema") {
    const [line, ...desc] = b.split("\n");
    const [price, currency = "USD", availability = "InStock"] = line.split(",").map((x) => x.trim());
    return `<script type="application/ld+json">
${JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: a, description: desc.join("\n"), offers: { "@type": "Offer", price, priceCurrency: currency, availability: `https://schema.org/${availability}` } }, null, 2)}
</script>`;
  }
  if (tool === "vitals") {
    const checks = ["LCP: optimize the hero asset, server response and critical CSS.", "INP: reduce long JavaScript tasks and unnecessary hydration.", "CLS: reserve width and height for images, ads and embeds.", "Test representative mobile pages with field data when available.", "Measure templates separately: home, category, product, article and checkout."];
    return `${a} \u2014 ${b}

${checks.map((x, i) => `[ ] ${i + 1}. ${x}`).join("\n")}`;
  }
  if (tool === "launch") {
    const items = ["HTTPS and preferred domain redirect", "Unique titles and descriptions", "Canonical URLs and indexability", "Robots.txt and sitemap.xml", "404 page and redirect map", "Analytics consent and key events", "Open Graph image and share preview", "Forms, email delivery and validation", "Mobile navigation and keyboard access", "Performance on representative mobile devices", "Backups, monitoring and rollback owner", "Privacy, terms and contact details"];
    return `${a} \u2014 ${b}
Generated: ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}

${items.map((x) => `[ ] ${x}`).join("\n")}`;
  }
  return "";
}

export {
  WebsiteSeoStudio
};
