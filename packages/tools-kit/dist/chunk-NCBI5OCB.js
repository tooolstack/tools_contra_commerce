// src/components/ui.tsx
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function useResultTracking(tool, payload, endpoint = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_TRACK_ENDPOINT : void 0) {
  const serialized = JSON.stringify(payload ?? null);
  useEffect(() => {
    if (!endpoint) return;
    const t = setTimeout(() => {
      fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tool, payload: JSON.parse(serialized) }),
        keepalive: true
      }).catch(() => {
      });
    }, 2500);
    return () => clearTimeout(t);
  }, [tool, serialized, endpoint]);
}
var bdt = (n) => "\u09F3" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
  Math.round(Number.isFinite(n) ? n : 0)
);
var pct = (n, places = 1) => `${(Number.isFinite(n) ? n : 0).toFixed(places)}%`;
var dec = (n, places = 2) => (Number.isFinite(n) ? n : 0).toFixed(places);
var num = (n) => new Intl.NumberFormat("en-IN").format(Math.round(Number.isFinite(n) ? n : 0));
function CalculatorShell({
  className = "",
  children
}) {
  return /* @__PURE__ */ jsx("div", { className: `grid min-w-0 items-start gap-6 lg:grid-cols-2 ${className}`, children });
}
function InputCard({
  title = "Enter your numbers",
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 self-start rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg font-semibold text-gray-900", children: title }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children })
  ] });
}
function ResultsColumn({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "min-w-0 flex flex-col gap-5", children });
}
function NumberField({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step = "any"
}) {
  return /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: label }),
    /* @__PURE__ */ jsxs("span", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          inputMode: "decimal",
          value,
          min,
          max,
          step,
          onChange: (e) => onChange(e.target.value),
          className: "w-32 rounded-lg border border-gray-300 px-3 py-2 pr-7 text-right text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }
      ),
      suffix && /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400", children: suffix })
    ] })
  ] });
}
function ResultHero({
  label,
  value,
  positive = true,
  neutral = false,
  sub
}) {
  const containerColor = neutral ? "border-amber-200 bg-amber-50" : positive ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50";
  const valueColor = neutral ? "text-amber-700" : positive ? "text-emerald-700" : "text-red-700";
  return /* @__PURE__ */ jsxs("div", { className: `rounded-2xl border p-6 ${containerColor}`, children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: label }),
    /* @__PURE__ */ jsx("p", { className: `mt-1 text-4xl font-bold ${valueColor}`, children: value }),
    sub && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: sub })
  ] });
}
function StatGrid({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children });
}
function Stat({
  label,
  value,
  tone = "default"
}) {
  const color = tone === "red" ? "text-red-600" : tone === "emerald" ? "text-emerald-700" : "text-gray-900";
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: label }),
    /* @__PURE__ */ jsx("p", { className: `mt-1 text-lg font-semibold ${color}`, children: value })
  ] });
}
function Panel({
  label,
  value,
  sub
}) {
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-2xl border border-gray-200 bg-white p-5", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xl font-bold text-gray-900", children: value }),
    sub && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: sub })
  ] });
}
function TextField({
  label,
  value,
  onChange,
  placeholder
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm text-gray-700", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value,
        placeholder,
        onChange: (e) => onChange(e.target.value),
        className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      }
    )
  ] });
}
function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm text-gray-700", children: label }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        value,
        rows,
        placeholder,
        onChange: (e) => onChange(e.target.value),
        className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      }
    )
  ] });
}
function SelectField({
  label,
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm text-gray-700", children: label }),
    /* @__PURE__ */ jsx(
      DropdownControl,
      {
        value,
        onChange,
        options,
        ariaLabel: label,
        className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      }
    )
  ] });
}
function DropdownControl({ value, onChange, options, className = "", ariaLabel = "Choose an option", disabled = false }) {
  const items = options.map((option) => typeof option === "string" ? { value: option, label: option } : option);
  const selectedIndex = Math.max(0, items.findIndex((item) => item.value === value));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(selectedIndex);
  const root = useRef(null);
  const listId = `dropdown-${useId().replace(/:/g, "")}`;
  useEffect(() => setActive(selectedIndex), [selectedIndex]);
  useEffect(() => {
    const close = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const choose = (index) => {
    const item = items[index];
    if (!item || item.disabled) return;
    onChange(item.value);
    setActive(index);
    setOpen(false);
  };
  const nextEnabled = (from, direction) => {
    for (let step = 1; step <= items.length; step++) {
      const index = (from + direction * step + items.length) % items.length;
      if (!items[index]?.disabled) return index;
    }
    return from;
  };
  const keys = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setOpen(true);
      setActive((index) => nextEnabled(index, direction));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else setOpen(true);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setOpen(true);
      setActive(nextEnabled(-1, 1));
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setOpen(true);
      setActive(nextEnabled(0, -1));
    }
  };
  return /* @__PURE__ */ jsxs("div", { ref: root, className: "relative min-w-0", children: [
    /* @__PURE__ */ jsxs("button", { type: "button", "aria-label": ariaLabel, "aria-haspopup": "listbox", "aria-expanded": open, "aria-controls": listId, "aria-activedescendant": open ? `${listId}-${active}` : void 0, disabled, onClick: () => setOpen((value2) => !value2), onKeyDown: keys, className: `${className} flex min-h-10 items-center justify-between gap-3 pr-3 text-left disabled:cursor-not-allowed disabled:opacity-60`, children: [
      /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children: items[selectedIndex]?.label || value || "Select\u2026" }),
      /* @__PURE__ */ jsx(ChevronDown, { "aria-hidden": "true", className: `h-4 w-4 shrink-0 text-gray-500 transition-transform ${open ? "rotate-180" : ""}` })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "sr-only", "aria-hidden": "true", children: items.map((item) => item.label).join(" ") }),
    open && /* @__PURE__ */ jsx("div", { id: listId, role: "listbox", "aria-label": ariaLabel, "aria-activedescendant": `${listId}-${active}`, className: "absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,.16)]", children: items.map((item, index) => /* @__PURE__ */ jsxs("button", { id: `${listId}-${index}`, type: "button", role: "option", "aria-selected": item.value === value, disabled: item.disabled, onMouseEnter: () => setActive(index), onClick: () => choose(index), className: `flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${index === active ? "bg-gray-100 text-gray-950" : "text-gray-700 hover:bg-gray-50"} ${item.disabled ? "cursor-not-allowed opacity-40" : ""}`, children: [
      /* @__PURE__ */ jsx("span", { children: item.label }),
      item.value === value && /* @__PURE__ */ jsx(Check, { "aria-hidden": "true", className: "h-4 w-4 shrink-0" })
    ] }, `${item.value}-${index}`)) })
  ] });
}
function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3", children: [
    label && /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs text-gray-500", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-start", children: [
      /* @__PURE__ */ jsx("code", { className: "min-w-0 flex-1 break-all text-sm leading-6 text-gray-800", children: value }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: copy,
          className: "shrink-0 self-end rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-700 sm:self-start",
          children: copied ? "Copied!" : "Copy"
        }
      )
    ] })
  ] });
}
function OutputBox({ title, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6", children: [
    title && /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm font-semibold text-gray-900", children: title }),
    children
  ] });
}
function CtaCard({
  href = "#",
  text,
  brand = "Contra Commerce"
}) {
  const trackAndAttribute = (event) => {
    if (typeof window === "undefined") return;
    const tool = window.location.hostname.split(".")[0] || window.location.pathname.split("/").filter(Boolean)[0] || "tools-hub";
    const endpoint = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_TRACK_ENDPOINT : void 0;
    if (endpoint) {
      fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tool, payload: { action: "cta_click", href } }),
        keepalive: true
      }).catch(() => {
      });
    }
    if (href && !href.startsWith("#")) {
      try {
        const url = new URL(href, window.location.href);
        url.searchParams.set("utm_source", "contra_free_tools");
        url.searchParams.set("utm_medium", "result_cta");
        url.searchParams.set("utm_campaign", tool);
        event.currentTarget.href = url.toString();
      } catch {
      }
    }
  };
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      onClick: trackAndAttribute,
      className: "group relative block w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 px-5 py-5 text-white shadow-sm transition hover:border-gray-700 hover:bg-gray-900 sm:px-6",
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full border border-white/10 transition-transform duration-500 group-hover:scale-110",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "pointer-events-none absolute -bottom-16 right-10 h-28 w-28 rounded-full border border-white/5",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "relative flex min-w-0 items-center justify-between gap-5", children: [
          /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-sm font-semibold leading-5 text-white sm:text-base", children: text }),
            /* @__PURE__ */ jsxs("span", { className: "mt-1 block text-xs leading-5 text-gray-300", children: [
              "See it live with ",
              brand
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-lg transition duration-300 group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-gray-950", "aria-hidden": "true", children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4", strokeWidth: 2 }) })
        ] })
      ]
    }
  );
}

export {
  useResultTracking,
  bdt,
  pct,
  dec,
  num,
  CalculatorShell,
  InputCard,
  ResultsColumn,
  NumberField,
  ResultHero,
  StatGrid,
  Stat,
  Panel,
  TextField,
  TextArea,
  SelectField,
  DropdownControl,
  CopyField,
  OutputBox,
  CtaCard
};
