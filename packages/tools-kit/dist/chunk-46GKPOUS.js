import {
  DropdownControl
} from "./chunk-NCBI5OCB.js";

// src/components/DeveloperToolsStudio.tsx
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var tools = [
  { id: "json-format", name: "JSON Formatter", group: "JSON & API", help: "Format, minify and validate JSON safely in your browser." },
  { id: "json-diff", name: "JSON Difference Checker", group: "JSON & API", help: "Compare two JSON documents by property path." },
  { id: "api-viewer", name: "API Response Viewer", group: "JSON & API", help: "Inspect status, headers and JSON response structure." },
  { id: "api-error", name: "API Error Explainer", group: "JSON & API", help: "Turn common HTTP errors into actionable debugging checks." },
  { id: "webhook", name: "Webhook Payload Viewer", group: "JSON & API", help: "Explore nested webhook payloads and copy paths." },
  { id: "pixel", name: "Facebook Pixel Event Tester", group: "JSON & API", help: "Validate common Meta Pixel event names and required parameters." },
  { id: "jwt", name: "JWT Decoder", group: "Encode & Convert", help: "Decode JWT header and payload locally without verifying its signature." },
  { id: "timestamp", name: "Timestamp Converter", group: "Encode & Convert", help: "Convert Unix seconds, milliseconds and ISO dates." },
  { id: "json-ts", name: "JSON to TypeScript Interface", group: "Encode & Convert", help: "Infer TypeScript interfaces from a JSON sample." },
  { id: "html-table", name: "HTML Table Generator", group: "Generate", help: "Convert CSV or tab-separated rows into accessible HTML." },
  { id: "gradient", name: "CSS Gradient Generator", group: "Generate", help: "Build and preview production-ready CSS gradients." },
  { id: "meta", name: "Meta Tag Generator", group: "Generate", help: "Generate title, description, canonical and social metadata." },
  { id: "schema", name: "Schema Markup Generator", group: "Generate", help: "Create JSON-LD for products, organizations and articles." },
  { id: "cron", name: "Cron Expression Generator", group: "Generate", help: "Create common five-field cron schedules with a readable explanation." },
  { id: "utm", name: "UTM Builder", group: "Generate", help: "Build correctly encoded campaign links." },
  { id: "regex", name: "Regex Tester", group: "Inspect & Compare", help: "Test regular expressions with flags and visible matches." },
  { id: "env-diff", name: ".env Difference Checker", group: "Inspect & Compare", help: "Compare environment keys without exposing values." },
  { id: "sql", name: "SQL Query Formatter", group: "Inspect & Compare", help: "Format common SQL clauses for easier review." },
  { id: "db-schema", name: "Database Schema Visualizer", group: "Inspect & Compare", help: "Turn CREATE TABLE statements into a table relationship summary." },
  { id: "headers", name: "HTTP Header Checker", group: "Web Diagnostics", help: "Inspect public URL response headers through a guarded server check." },
  { id: "redirect", name: "Redirect Checker", group: "Web Diagnostics", help: "Follow and display a public URL redirect chain." }
];
var control = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var button = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40";
var defaults = {
  "json-format": ['{"customer":{"name":"Ayesha","orders":3},"active":true}', ""],
  "json-diff": ['{"name":"Product","price":100,"stock":8}', '{"name":"Product","price":120,"active":true}'],
  "api-viewer": ["https://jsonplaceholder.typicode.com/todos/1", ""],
  "api-error": ['{"status":429,"message":"Too many requests"}', ""],
  "webhook": ['{"event":"order.created","data":{"id":"ORD-1001","total":1250}}', ""],
  pixel: ["Purchase", '{"value":1250,"currency":"BDT","content_ids":["SKU-1"]}'],
  jwt: ["Paste a JWT token here", ""],
  timestamp: [`${Math.floor(Date.now() / 1e3)}`, ""],
  "json-ts": ['{"id":1,"name":"Ayesha","active":true,"tags":["customer"]}', "Root"],
  "html-table": ["Name,Email,Orders\nAyesha,ayesha@example.com,3\nRahim,rahim@example.com,5", ""],
  gradient: ["#7c3aed", "#ec4899"],
  meta: ["Contra Commerce Tools", "Free practical tools for commerce, creators and everyday work."],
  schema: ["Product", '{"name":"Wireless Earbuds","description":"Clear sound and long battery life","price":"2490","currency":"BDT"}'],
  cron: ["Every day", "09:00"],
  utm: ["https://example.com/product", "facebook,social,summer-sale"],
  regex: ["\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b", "gi\nContact sales@example.com or support@example.org"],
  "env-diff": ["API_URL=https://api.example.com\nAPI_KEY=secret\nDEBUG=true", "API_URL=https://api.example.com\nDATABASE_URL=postgres://...\nDEBUG=false"],
  sql: ["select id,name,email from users where active=true order by created_at desc limit 20", ""],
  "db-schema": ["CREATE TABLE users (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE orders (id INT PRIMARY KEY, user_id INT REFERENCES users(id), total DECIMAL);", ""],
  headers: ["https://example.com", ""],
  redirect: ["https://example.com", ""]
};
function safeJson(value) {
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid JSON" };
  }
}
function flatten(value, path = "$", rows = []) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, `${path}[${i}]`, rows));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => flatten(v, `${path}.${k}`, rows));
  } else rows.push(`${path} = ${JSON.stringify(value)}`);
  return rows;
}
function inferTs(value, name = "Root", defs = []) {
  if (Array.isArray(value)) {
    return value.length ? `${inferTs(value[0], name.replace(/s$/, "Item"), defs)}[]` : "unknown[]";
  }
  if (value === null) return "null";
  if (typeof value !== "object") return typeof value;
  const lines = Object.entries(value).map(([k, v]) => `  ${JSON.stringify(k)}: ${inferTs(v, k[0]?.toUpperCase() + k.slice(1), defs)};`);
  const def = `interface ${name.replace(/\W/g, "") || "Root"} {
${lines.join("\n")}
}`;
  defs.unshift(def);
  return name.replace(/\W/g, "") || "Root";
}
function formatSql(sql) {
  return sql.replace(/\s+/g, " ").trim().replace(/\b(SELECT|FROM|WHERE|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|VALUES|SET|RETURNING|UNION ALL|UNION|INSERT INTO|UPDATE|DELETE FROM)\b/gi, "\n$1").replace(/\b(AND|OR)\b/gi, "\n  $1").replace(/^\n/, "").replace(/,/g, ",\n  ");
}
function DeveloperToolsStudio({ inspectEndpoint = "/api/url-inspect" }) {
  const [active, setActive] = useState("json-format");
  const [a, setA] = useState(defaults[active][0]);
  const [b, setB] = useState(defaults[active][1]);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("Format");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const selected = tools.find((t) => t.id === active);
  const groups = Array.from(new Set(tools.map((t) => t.group)));
  const choose = (id) => {
    setActive(id);
    setA(defaults[id][0]);
    setB(defaults[id][1]);
    setOutput("");
    setMode("Format");
  };
  const localResult = useMemo(() => runLocal(active, a, b, mode), [active, a, b, mode]);
  const result = output || localResult;
  const execute = async () => {
    if (!["api-viewer", "headers", "redirect"].includes(active)) return;
    setBusy(true);
    setOutput("");
    try {
      const response = await fetch(inspectEndpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: a, mode: active }) });
      const data = await response.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (error) {
      setOutput(`Request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setBusy(false);
    }
  };
  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "self-start rounded-2xl border border-gray-200 bg-white p-3 shadow-sm xl:sticky xl:top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-3 pb-3 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-blue-600", children: "21 focused utilities" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold", children: "Developer Tools" })
      ] }),
      groups.map((group) => /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: group }),
        tools.filter((t) => t.group === group).map((t) => /* @__PURE__ */ jsx("button", { onClick: () => choose(t.id), className: `mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${active === t.id ? "bg-gray-950 font-semibold text-white" : "text-gray-700 hover:bg-gray-100"}`, children: t.name }, t.id))
      ] }, group))
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-blue-600", children: "Developer Tools" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold", children: selected.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: selected.help })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx(ToolInputs, { tool: active, a, b, setA, setB, mode, setMode }),
          ["api-viewer", "headers", "redirect"].includes(active) && /* @__PURE__ */ jsx("button", { className: button, disabled: busy, onClick: execute, children: busy ? "Checking\u2026" : "Run secure check" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: "Input is processed locally unless this tool explicitly performs a public URL check. Never paste production secrets or private tokens." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Result" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
              result.length.toLocaleString(),
              " characters"
            ] })
          ] }),
          active === "gradient" ? /* @__PURE__ */ jsx("div", { className: "h-44 rounded-xl border", style: { background: `linear-gradient(135deg, ${a}, ${b})` } }) : active === "regex" ? /* @__PURE__ */ jsx(RegexPreview, { pattern: a, source: b.split("\n").slice(1).join("\n"), flags: b.split("\n")[0] || "g" }) : null,
          /* @__PURE__ */ jsx("pre", { className: "max-h-[620px] min-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-gray-950 p-4 text-xs leading-5 text-emerald-300", children: result || "Enter valid input to see the result." }),
          /* @__PURE__ */ jsx("button", { className: button, disabled: !result, onClick: copy, children: copied ? "Copied" : "Copy result" })
        ] })
      ] })
    ] })
  ] });
}
function ToolInputs({ tool, a, b, setA, setB, mode, setMode }) {
  const labels = {
    "json-diff": ["Original JSON", "Changed JSON"],
    pixel: ["Event name", "Event parameters JSON"],
    "json-ts": ["JSON sample", "Root interface name"],
    gradient: ["Start color", "End color"],
    meta: ["Page title", "Meta description"],
    schema: ["Schema type", "Entity data JSON"],
    cron: ["Schedule", "Time (24-hour)"],
    utm: ["Destination URL", "Source, medium, campaign"],
    regex: ["Regular expression", "Flags on first line, then test text"],
    "env-diff": ["Environment A", "Environment B"]
  };
  const pair = labels[tool];
  const shortA = ["api-viewer", "headers", "redirect", "jwt", "timestamp", "sql"].includes(tool);
  const options = { "json-format": ["Format", "Minify"], schema: ["Product", "Organization", "Article"], cron: ["Every hour", "Every day", "Every weekday", "Every week", "Every month"] };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    options[tool] && /* @__PURE__ */ jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: "Mode" }),
      /* @__PURE__ */ jsx(DropdownControl, { className: control, ariaLabel: "Mode", value: tool === "schema" || tool === "cron" ? a : mode, onChange: (value) => tool === "schema" || tool === "cron" ? setA(value) : setMode(value), options: options[tool] })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: pair?.[0] || (["api-viewer", "headers", "redirect"].includes(tool) ? "Public URL" : "Input") }),
      shortA ? /* @__PURE__ */ jsx("input", { className: control, value: a, onChange: (e) => setA(e.target.value) }) : /* @__PURE__ */ jsx("textarea", { className: control, rows: tool === "json-diff" || tool === "env-diff" ? 8 : 12, value: a, onChange: (e) => setA(e.target.value) })
    ] }),
    (pair || ["json-diff", "env-diff"].includes(tool)) && /* @__PURE__ */ jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: pair?.[1] || "Second input" }),
      /* @__PURE__ */ jsx("textarea", { className: control, rows: tool === "json-diff" || tool === "env-diff" ? 8 : 5, value: b, onChange: (e) => setB(e.target.value) })
    ] })
  ] });
}
function RegexPreview({ pattern, source, flags }) {
  let parts = source;
  try {
    const f = flags.includes("g") ? flags : `${flags}g`;
    const re = new RegExp(pattern, f);
    const nodes = [];
    let last = 0;
    for (const match of source.matchAll(re)) {
      const at = match.index || 0;
      nodes.push(source.slice(last, at), /* @__PURE__ */ jsx("mark", { className: "rounded bg-yellow-200 px-0.5", children: match[0] }, `${at}-${match[0]}`));
      last = at + match[0].length;
      if (!match[0]) break;
    }
    nodes.push(source.slice(last));
    parts = nodes;
  } catch {
  }
  return /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap rounded-xl border border-gray-200 bg-white p-4 text-sm leading-6", children: parts || "No test text." });
}
function runLocal(tool, a, b, mode) {
  if (["api-viewer", "headers", "redirect"].includes(tool)) return "";
  if (tool === "json-format") {
    const p = safeJson(a);
    return p.ok ? JSON.stringify(p.value, null, mode === "Minify" ? 0 : 2) : `Invalid JSON: ${p.error}`;
  }
  if (tool === "json-diff") {
    const x = safeJson(a), y = safeJson(b);
    if (!x.ok || !y.ok) return `Invalid JSON: ${!x.ok ? x.error : !y.ok ? y.error : ""}`;
    const left = new Map(flatten(x.value).map((v) => [v.split(" = ")[0], v.split(" = ").slice(1).join(" = ")]));
    const right = new Map(flatten(y.value).map((v) => [v.split(" = ")[0], v.split(" = ").slice(1).join(" = ")]));
    return Array.from(/* @__PURE__ */ new Set([...left.keys(), ...right.keys()])).filter((k) => left.get(k) !== right.get(k)).map((k) => `${k}
- ${left.get(k) ?? "(missing)"}
+ ${right.get(k) ?? "(missing)"}`).join("\n\n") || "No differences found.";
  }
  if (tool === "webhook") {
    const p = safeJson(a);
    return p.ok ? flatten(p.value).join("\n") : `Invalid payload: ${p.error}`;
  }
  if (tool === "jwt") {
    try {
      const [h, p] = a.trim().split(".");
      const decode = (v) => JSON.parse(decodeURIComponent(escape(atob(v.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(v.length / 4) * 4, "=")))));
      return `HEADER
${JSON.stringify(decode(h), null, 2)}

PAYLOAD
${JSON.stringify(decode(p), null, 2)}

Warning: decoded only; signature and trust are NOT verified.`;
    } catch {
      return "Invalid JWT structure or Base64URL payload.";
    }
  }
  if (tool === "timestamp") {
    const raw = a.trim();
    const numeric = Number(raw);
    const date = Number.isFinite(numeric) ? new Date(raw.length <= 10 ? numeric * 1e3 : numeric) : new Date(raw);
    return Number.isNaN(date.getTime()) ? "Invalid timestamp or date." : `ISO 8601: ${date.toISOString()}
Unix seconds: ${Math.floor(date.getTime() / 1e3)}
Unix milliseconds: ${date.getTime()}
UTC: ${date.toUTCString()}
Local: ${date.toLocaleString()}`;
  }
  if (tool === "json-ts") {
    const p = safeJson(a);
    if (!p.ok) return `Invalid JSON: ${p.error}`;
    const defs = [];
    inferTs(p.value, b.trim() || "Root", defs);
    return defs.join("\n\n");
  }
  if (tool === "html-table") {
    const rows = a.split("\n").filter(Boolean).map((r) => r.split(a.includes("	") ? "	" : ",").map((c) => c.trim()));
    if (!rows.length) return "";
    const [head, ...body] = rows;
    return `<table>
  <thead>
    <tr>${head.map((c) => `<th scope="col">${c}</th>`).join("")}</tr>
  </thead>
  <tbody>
${body.map((r) => `    <tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("\n")}
  </tbody>
</table>`;
  }
  if (tool === "gradient") return `background: ${a};
background: linear-gradient(135deg, ${a} 0%, ${b} 100%);`;
  if (tool === "meta") {
    const title = a.replace(/"/g, "&quot;"), desc = b.replace(/"/g, "&quot;");
    return `<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="https://example.com/page">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://example.com/social-image.jpg">
<meta name="twitter:card" content="summary_large_image">`;
  }
  if (tool === "schema") {
    const p = safeJson(b);
    if (!p.ok) return `Invalid entity JSON: ${p.error}`;
    const type = a;
    const data = p.value;
    const schema = type === "Product" ? { "@context": "https://schema.org", "@type": "Product", name: data.name, description: data.description, offers: { "@type": "Offer", price: data.price, priceCurrency: data.currency || "USD", availability: "https://schema.org/InStock" } } : { "@context": "https://schema.org", "@type": type, ...data };
    return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
  }
  if (tool === "cron") {
    const map = { "Every hour": "0 * * * *", "Every day": `${b.split(":")[1] || "0"} ${b.split(":")[0] || "9"} * * *`, "Every weekday": `${b.split(":")[1] || "0"} ${b.split(":")[0] || "9"} * * 1-5`, "Every week": `${b.split(":")[1] || "0"} ${b.split(":")[0] || "9"} * * 1`, "Every month": `${b.split(":")[1] || "0"} ${b.split(":")[0] || "9"} 1 * *` };
    return `${map[a] || "0 9 * * *"}

${a}${a === "Every hour" ? "" : ` at ${b || "09:00"}`} (server timezone)`;
  }
  if (tool === "utm") {
    try {
      const [source = "source", medium = "social", campaign = "campaign"] = b.split(",").map((x) => x.trim());
      const u = new URL(a);
      u.searchParams.set("utm_source", source);
      u.searchParams.set("utm_medium", medium);
      u.searchParams.set("utm_campaign", campaign);
      return u.toString();
    } catch {
      return "Enter a complete URL beginning with http:// or https://.";
    }
  }
  if (tool === "regex") {
    try {
      const [flags, ...lines] = b.split("\n");
      const re = new RegExp(a, flags || "g");
      const matches = Array.from(lines.join("\n").matchAll(re.global ? re : new RegExp(re.source, `${re.flags}g`)));
      return matches.length ? matches.map((m, i) => `${i + 1}. ${JSON.stringify(m[0])} at index ${m.index}${m.length > 1 ? `
   groups: ${JSON.stringify(m.slice(1))}` : ""}`).join("\n") : "No matches.";
    } catch (error) {
      return `Invalid regular expression: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  }
  if (tool === "env-diff") {
    const parse = (v) => new Map(v.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#")).map((l) => {
      const at = l.indexOf("=");
      return [at < 0 ? l.trim() : l.slice(0, at).trim(), at < 0 ? "" : l.slice(at + 1)];
    }));
    const x = parse(a), y = parse(b);
    return Array.from(/* @__PURE__ */ new Set([...x.keys(), ...y.keys()])).map((k) => !x.has(k) ? `+ ${k} (only in B)` : !y.has(k) ? `- ${k} (only in A)` : x.get(k) !== y.get(k) ? `~ ${k} (value differs)` : `= ${k}`).join("\n");
  }
  if (tool === "sql") return formatSql(a);
  if (tool === "db-schema") {
    const tables = Array.from(a.matchAll(/CREATE\s+TABLE\s+(\w+)\s*\(([^;]+)\)/gis));
    return tables.map((m) => {
      const refs = Array.from(m[2].matchAll(/(\w+)\s+[^,]*REFERENCES\s+(\w+)\s*\((\w+)\)/gi)).map((r) => `${m[1]}.${r[1]} \u2192 ${r[2]}.${r[3]}`);
      return `TABLE ${m[1]}
${m[2].split(",").map((c) => `  \u2022 ${c.trim().replace(/\s+/g, " ")}`).join("\n")}${refs.length ? `
Relationships:
  ${refs.join("\n  ")}` : ""}`;
    }).join("\n\n") || "No CREATE TABLE statements detected.";
  }
  if (tool === "pixel") {
    const p = safeJson(b);
    if (!p.ok) return `Invalid parameter JSON: ${p.error}`;
    const standard = ["PageView", "ViewContent", "Search", "AddToCart", "InitiateCheckout", "Purchase", "Lead", "CompleteRegistration"];
    const data = p.value;
    const issues = [];
    if (!standard.includes(a)) issues.push("Use a standard event when possible, or explicitly configure a custom event.");
    if (["Purchase", "AddToCart", "InitiateCheckout"].includes(a) && typeof data.value !== "number") issues.push("value should be a number.");
    if (["Purchase", "AddToCart", "InitiateCheckout"].includes(a) && !data.currency) issues.push("currency is required for commerce value reporting.");
    return `${issues.length ? "ISSUES\n" + issues.map((x) => `\u2022 ${x}`).join("\n") : "\u2713 Basic event validation passed."}

TEST EVENT
fbq('track', '${a}', ${JSON.stringify(data, null, 2)});

Use Meta Events Manager Test Events to confirm browser delivery and deduplication.`;
  }
  if (tool === "api-error") {
    const p = safeJson(a);
    let status = 0, message = a;
    if (p.ok && p.value && typeof p.value === "object") {
      status = Number(p.value.status || 0);
      message = String(p.value.message || "");
    }
    const advice = { 400: "Validate request JSON, content type, required fields and parameter formats.", 401: "Check whether the access token exists, is current and uses the expected authentication scheme.", 403: "Authentication succeeded but permission, scope, ownership or policy denied the action.", 404: "Verify base URL, route, API version and resource identifier.", 409: "The request conflicts with current state; check duplicates, versions or idempotency keys.", 422: "The request parsed correctly but failed business validation. Inspect field-level errors.", 429: "Respect Retry-After, reduce concurrency and implement exponential backoff with jitter.", 500: "Log the request ID and sanitized context, retry only idempotent calls, and check service status.", 502: "An upstream service returned an invalid response; retry with backoff and inspect gateway logs.", 503: "The service is unavailable or overloaded; honor Retry-After and use a circuit breaker." };
    return `Detected status: ${status || "unknown"}
Message: ${message}

Likely next checks:
${advice[status] || "Check the HTTP status, structured error fields, request ID, API documentation and sanitized request payload."}

Do not expose credentials or full customer data in logs.`;
  }
  return "";
}

export {
  DeveloperToolsStudio
};
