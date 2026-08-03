import {
  DropdownControl
} from "./chunk-NCBI5OCB.js";

// src/components/TravelToolsStudio.tsx
import { useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var tools = [{ id: "budget", name: "Travel Budget Calculator", group: "Budget" }, { id: "currency", name: "Currency Conversion Calculator", group: "Budget" }, { id: "fuel-toll", name: "Fuel & Toll Splitter", group: "Budget" }, { id: "hotel", name: "Hotel Price Per Person", group: "Budget" }, { id: "packing", name: "Trip Packing List Generator", group: "Prepare" }, { id: "visa-photo", name: "Visa Photo Maker", group: "Prepare" }, { id: "luggage", name: "Luggage Weight Splitter", group: "Prepare" }, { id: "plug", name: "Country Power Plug Finder", group: "Prepare" }, { id: "clothing", name: "International Clothing Size Converter", group: "Prepare" }, { id: "flight", name: "Flight Time Calculator", group: "Plan" }, { id: "jetlag", name: "Jet Lag Planner", group: "Plan" }, { id: "itinerary", name: "Travel Itinerary Generator", group: "Plan" }];
var defaults = { budget: ["4,5", "120000,8000,10"], packing: ["Sweden, 7 days, winter", "Business + sightseeing"], currency: ["1000,BDT", "0.0082,USD"], luggage: ["23,23", "Ayesha:18, Rahim:27, Nusrat:20"], flight: ["2026-08-10,22:30,+06:00", "8.5,-04:00"], jetlag: ["+06:00", "-04:00,2026-08-10"], "fuel-toll": ["600,12,130", "2500,4"], itinerary: ["Stockholm,5", "Museums, local food, business meeting\nModerate pace"], plug: ["Sweden", ""], clothing: ["Men top,EU,42", "US"], hotel: ["65000,5", "4,2"] };
var c = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var btn = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40";
var num = (x) => Number(x) || 0;
var cash = (x) => `\u09F3${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(x)}`;
var off = (v) => {
  const m = v.match(/([+-])(\d+):?(\d{2})/);
  return m ? (m[1] === "-" ? -1 : 1) * (num(m[2]) * 60 + num(m[3])) : 0;
};
function TravelToolsStudio() {
  const [active, setActive] = useState("budget");
  const [a, setA] = useState(defaults.budget[0]);
  const [b, setB] = useState(defaults.budget[1]);
  const groups = Array.from(new Set(tools.map((x) => x.group)));
  const choose = (id) => {
    setActive(id);
    if (id !== "visa-photo") {
      setA(defaults[id][0]);
      setB(defaults[id][1]);
    }
  };
  const result = useMemo(() => active === "visa-photo" ? "" : run(active, a, b), [active, a, b]);
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "self-start rounded-2xl border bg-white p-3 shadow-sm xl:sticky xl:top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-3 pb-3 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-cyan-600", children: "12 integrated utilities" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold", children: "Travel Budget Calculator" })
      ] }),
      groups.map((g) => /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: g }),
        tools.filter((x) => x.group === g).map((x) => /* @__PURE__ */ jsx("button", { onClick: () => choose(x.id), className: `mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${active === x.id ? "bg-gray-950 font-semibold text-white" : "text-gray-700 hover:bg-gray-100"}`, children: x.name }, x.id))
      ] }, g))
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border bg-gradient-to-r from-cyan-50 to-sky-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-cyan-700", children: "Travel Budget Calculator" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold", children: tools.find((x) => x.id === active)?.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Build your budget first, then plan the practical details of the same trip in one private workspace." })
      ] }),
      active === "visa-photo" ? /* @__PURE__ */ jsx(VisaPhoto, {}) : /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][0] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: active === "itinerary" ? 5 : 3, value: a, onChange: (e) => setA(e.target.value) })
          ] }),
          labels[active][1] && /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][1] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: active === "itinerary" ? 5 : 3, value: b, onChange: (e) => setB(e.target.value) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: "Exchange rates, visa rules, plug standards, baggage policies and schedules can change. Verify with official providers." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
          /* @__PURE__ */ jsx("pre", { className: "min-h-64 whitespace-pre-wrap rounded-xl bg-gray-950 p-5 text-sm leading-7 text-emerald-300", children: result }),
          /* @__PURE__ */ jsx("button", { className: btn, onClick: () => navigator.clipboard.writeText(result), children: "Copy result" })
        ] })
      ] })
    ] })
  ] });
}
var labels = { budget: ["Travellers, days", "Fixed costs, daily cost/person, buffer %"], packing: ["Destination, duration, season", "Trip style"], currency: ["Amount, source currency", "Exchange rate, target currency"], luggage: ["Bag limits kg \u2014 comma-separated", "Traveller: packed kg \u2014 comma-separated"], flight: ["Departure date, time, UTC offset", "Flight hours, arrival UTC offset"], jetlag: ["Origin UTC offset", "Destination UTC offset, arrival date"], "fuel-toll": ["Distance km, km/litre, fuel price", "Tolls, travellers"], itinerary: ["Destination, days", "Interests, then travel pace"], plug: ["Country", ""], clothing: ["Category, source system, size", "Target system"], hotel: ["Total room cost, nights", "Travellers, rooms"] };
function run(t, a, b) {
  if (t === "budget") {
    const [p, d] = a.split(",").map(num), [fixed, daily, buffer] = b.split(",").map(num), base = fixed + p * d * daily, total = base * (1 + buffer / 100);
    return `Total trip budget: ${cash(total)}
Per traveller: ${cash(total / p)}
Per day: ${cash(total / d)}
Emergency buffer: ${cash(total - base)}`;
  }
  if (t === "currency") {
    const [amount, source2] = a.split(","), [rate, target2] = b.split(",");
    return `${Number(amount).toLocaleString()} ${source2.trim()} \xD7 ${rate.trim()} = ${(num(amount) * num(rate)).toLocaleString(void 0, { maximumFractionDigits: 4 })} ${target2.trim()}

Rate entered by user. Check provider fees and the live transaction rate.`;
  }
  if (t === "fuel-toll") {
    const [distance, eff, price] = a.split(",").map(num), [tolls, people] = b.split(",").map(num), fuel = distance / eff * price, total = fuel + tolls;
    return `Fuel: ${cash(fuel)}
Tolls: ${cash(tolls)}
Trip total: ${cash(total)}
Per traveller: ${cash(total / people)}
Fuel required: ${(distance / eff).toFixed(1)} litres`;
  }
  if (t === "hotel") {
    const [total, nights] = a.split(",").map(num), [people, rooms] = b.split(",").map(num);
    return `Total booking: ${cash(total)}
Per traveller: ${cash(total / people)}
Per traveller per night: ${cash(total / people / nights)}
Per room per night: ${cash(total / rooms / nights)}`;
  }
  if (t === "packing") {
    const [dest, duration, season] = a.split(",").map((x) => x.trim()), days = num(duration);
    const clothing = Math.min(days, 7);
    return `${dest.toUpperCase()} \u2014 ${days}-DAY ${season.toUpperCase()} LIST

DOCUMENTS
[ ] Passport and visa/entry evidence
[ ] Tickets, accommodation and insurance
[ ] Copies and emergency contacts

CLOTHING
[ ] ${clothing} tops \xB7 ${Math.ceil(clothing / 2)} bottoms
[ ] ${days + 1} underwear and socks
[ ] Weather layer suitable for ${season}
[ ] Comfortable walking shoes

ESSENTIALS
[ ] Prescribed medicine in original packaging
[ ] Phone, charger and verified plug adapter
[ ] Toiletries within transport limits
[ ] Payment methods and small emergency reserve

STYLE: ${b}
Customize for activities, laundry access and official restrictions.`;
  }
  if (t === "luggage") {
    const limits = a.split(",").map(num), travellers = b.split(",").map((x) => {
      const [n, w] = x.split(":");
      return { name: n.trim(), weight: num(w) };
    }), capacity = limits.reduce((x, y) => x + y, 0), packed = travellers.reduce((x, y) => x + y.weight, 0);
    return `Total allowance: ${capacity} kg
Packed: ${packed} kg
Remaining group allowance: ${capacity - packed} kg

${travellers.map((x, i) => `${x.name}: ${x.weight} kg \xB7 compared with bag ${i + 1} limit ${limits[i] ?? limits.at(-1)} kg \u2192 ${x.weight - (limits[i] ?? limits.at(-1) ?? 0) > 0 ? `${(x.weight - (limits[i] ?? limits.at(-1) ?? 0)).toFixed(1)} kg over` : "within entered limit"}`).join("\n")}

Airlines may enforce per-bag limits even when total group weight is lower.`;
  }
  if (t === "flight") {
    const [date, time, origin] = a.split(",").map((x) => x.trim()), [hours, target2] = b.split(",").map((x) => x.trim()), [h, m] = time.split(":").map(num), utc = Date.UTC(...date.split("-").map((x, i) => num(x) - (i === 1 ? 1 : 0)), h, m) - off(origin) * 6e4, arrival = new Date(utc + num(hours) * 36e5 + off(target2) * 6e4);
    return `Departure: ${date} ${time} (UTC${origin})
Flight duration: ${hours} hours
Arrival local: ${arrival.toISOString().slice(0, 16).replace("T", " ")} (UTC${target2})
UTC arrival: ${new Date(utc + num(hours) * 36e5).toISOString()}

Schedules and daylight-saving offsets must be verified with the airline.`;
  }
  if (t === "jetlag") {
    const [target2, date] = b.split(",").map((x) => x.trim()), diff = (off(target2) - off(a)) / 60, direction = diff > 0 ? "earlier" : "later";
    return `Time-zone shift: ${Math.abs(diff)} hours
Direction: destination clock is ${diff > 0 ? "ahead" : "behind"}
Arrival: ${date}

3 DAYS BEFORE
\u2022 Move sleep and wake time 30\u201360 minutes ${direction} each day
\u2022 Shift meal timing gradually

TRAVEL DAY
\u2022 Use destination time after boarding
\u2022 Hydrate and avoid excessive alcohol

AFTER ARRIVAL
\u2022 Seek morning light when shifting earlier; evening light when shifting later
\u2022 Keep naps short and protect a full sleep opportunity

Consult a clinician before using melatonin or sleep medication.`;
  }
  if (t === "itinerary") {
    const [dest, dayText] = a.split(","), days = num(dayText), [interests, pace = "Moderate"] = b.split("\n");
    return `${dest.trim().toUpperCase()} \u2014 ${days}-DAY ITINERARY
Interests: ${interests}
Pace: ${pace}

${Array.from({ length: days }, (_, i) => `DAY ${i + 1}
09:00  ${i === 0 ? "Arrival orientation / neighborhood walk" : `Priority experience ${i}`}
12:30  Local lunch and rest
14:00  ${i % 2 ? "Museum / indoor activity" : "District exploration / booked activity"}
18:00  Flexible dinner and notes
Buffer: Keep one unbooked block for delays or discovery.`).join("\n\n")}

Verify opening hours, transport and reservation requirements.`;
  }
  if (t === "plug") {
    const data = { Bangladesh: "C, D, G, K \xB7 220V \xB7 50Hz", Sweden: "C, F \xB7 230V \xB7 50Hz", USA: "A, B \xB7 120V \xB7 60Hz", Canada: "A, B \xB7 120V \xB7 60Hz", UK: "G \xB7 230V \xB7 50Hz", India: "C, D, M \xB7 230V \xB7 50Hz", Japan: "A, B \xB7 100V \xB7 50/60Hz", Australia: "I \xB7 230V \xB7 50Hz", UAE: "G \xB7 230V \xB7 50Hz", Singapore: "G \xB7 230V \xB7 50Hz" };
    return `${a.trim()}: ${data[a.trim()] || "Country not in the quick reference. Check an official destination or IEC travel source."}

A plug adapter changes shape, not voltage. Check every device input label before connecting it.`;
  }
  const [category, source, size] = a.split(",").map((x) => x.trim()), target = b.trim();
  const tables = { "Men top": { EU: { "42": "US 32 / UK 32 / International S", "44": "US 34 / UK 34 / International M", "46": "US 36 / UK 36 / International M", "48": "US 38 / UK 38 / International L" } }, "Women dress": { EU: { "36": "US 4 / UK 8 / International S", "38": "US 6 / UK 10 / International M", "40": "US 8 / UK 12 / International M", "42": "US 10 / UK 14 / International L" } } };
  return `${category}: ${source} ${size}
Approximate conversion: ${tables[category]?.[source]?.[size] || `No quick-table match for ${target}.`}

Brand sizing and body measurements vary. Use the retailer\u2019s garment measurements whenever possible.`;
}
function VisaPhoto() {
  const [file, setFile] = useState("");
  const [preset, setPreset] = useState("35\xD745 mm (413\xD7531 px)");
  const canvas = useRef(null);
  const sizes = { "35\xD745 mm (413\xD7531 px)": [413, 531], "2\xD72 inch (600\xD7600 px)": [600, 600], "50\xD770 mm (591\xD7827 px)": [591, 827] };
  const render = () => {
    const el = canvas.current;
    if (!el || !file) return;
    const [w, h] = sizes[preset];
    el.width = w;
    el.height = h;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const image = new Image();
    image.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, w, h);
      const scale = Math.max(w / image.width, h / image.height), dw = image.width * scale, dh = image.height * scale;
      ctx.drawImage(image, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };
    image.src = file;
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: "Portrait image" }),
        /* @__PURE__ */ jsx("input", { className: c, type: "file", accept: "image/*", onChange: (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = () => setFile(String(r.result));
          r.readAsDataURL(f);
        } })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: "Output preset" }),
        /* @__PURE__ */ jsx(DropdownControl, { className: c, ariaLabel: "Output preset", value: preset, onChange: setPreset, options: Object.keys(sizes) })
      ] }),
      /* @__PURE__ */ jsx("button", { className: btn, disabled: !file, onClick: render, children: "Create centered crop" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: "This creates dimensions only. Official requirements may also specify head size, eye position, expression, background, recency and print quality. Verify the destination authority\u2019s current rules." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-gray-100 p-5", children: [
      /* @__PURE__ */ jsx("canvas", { ref: canvas, className: "mx-auto max-h-[600px] max-w-full bg-white shadow" }),
      /* @__PURE__ */ jsx("button", { className: btn, disabled: !file, onClick: () => {
        render();
        setTimeout(() => {
          const link = document.createElement("a");
          link.download = "visa-photo.png";
          link.href = canvas.current?.toDataURL("image/png") || "";
          link.click();
        }, 80);
      }, children: "Download PNG" })
    ] })
  ] });
}
var calculateTravelTool = (tool, a, b) => run(tool, a, b);

export {
  TravelToolsStudio,
  calculateTravelTool
};
