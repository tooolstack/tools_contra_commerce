// src/components/HomeToolsStudio.tsx
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var tools = [{ id: "paint", name: "Room Paint Calculator", group: "Renovate" }, { id: "tile", name: "Tile Calculator", group: "Renovate" }, { id: "curtain", name: "Curtain Size Calculator", group: "Renovate" }, { id: "furniture", name: "Furniture Fit Checker", group: "Move & Fit" }, { id: "moving", name: "Moving Box Calculator", group: "Move & Fit" }, { id: "grocery", name: "Grocery Budget Calculator", group: "Kitchen" }, { id: "recipe", name: "Recipe Quantity Converter", group: "Kitchen" }, { id: "cooking", name: "Cooking Measurement Converter", group: "Kitchen" }, { id: "ac", name: "AC Size Calculator", group: "Energy" }, { id: "generator", name: "Generator Runtime Calculator", group: "Energy" }, { id: "solar", name: "Solar Panel Requirement Calculator", group: "Energy" }];
var defaults = { paint: ["20,2.8,2", "1,2\n10"], tile: ["4.5,3.8", "0.6,0.6\n10"], curtain: ["2.2,1.8", "2\n0.2"], furniture: ["2.1,0.9,0.85", "2.05,0.82\n2.4,1.1"], moving: ["2 bedrooms, 4 people", "Moderate belongings"], grocery: ["4,30000", "Rice:6000\nProtein:9000\nVegetables:5000\nDairy:3500\nHousehold:4000"], recipe: ["4", "10\nFlour: 500 g\nMilk: 300 ml\nEggs: 2\nSugar: 80 g"], cooking: ["2.5,cup", "ml"], ac: ["5,4,2.8", "4\nSunny"], generator: ["20,5", "2.5"], solar: ["450", "5\n5\n80"] };
var c = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var btn = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white";
var num = (x) => Number(x) || 0;
function HomeToolsStudio() {
  const [active, setActive] = useState("paint");
  const [a, setA] = useState(defaults.paint[0]);
  const [b, setB] = useState(defaults.paint[1]);
  const selected = tools.find((x) => x.id === active);
  const groups = Array.from(new Set(tools.map((x) => x.group)));
  const choose = (id) => {
    setActive(id);
    setA(defaults[id][0]);
    setB(defaults[id][1]);
  };
  const result = useMemo(() => run(active, a, b), [active, a, b]);
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "self-start rounded-2xl border bg-white p-3 shadow-sm xl:sticky xl:top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-3 pb-3 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-lime-700", children: "11 home utilities" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold", children: "Home & Everyday Tools" })
      ] }),
      groups.map((g) => /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: g }),
        tools.filter((x) => x.group === g).map((x) => /* @__PURE__ */ jsx("button", { onClick: () => choose(x.id), className: `mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${active === x.id ? "bg-gray-950 font-semibold text-white" : "text-gray-700 hover:bg-gray-100"}`, children: x.name }, x.id))
      ] }, g))
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border bg-gradient-to-r from-lime-50 to-green-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-lime-800", children: "Home & Everyday Tools" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold", children: selected.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Create a practical estimate from your measurements and assumptions." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][0] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: active === "grocery" || active === "recipe" ? 10 : 4, value: a, onChange: (e) => setA(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][1] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: active === "grocery" || active === "recipe" ? 9 : 4, value: b, onChange: (e) => setB(e.target.value) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: "Allow for local building standards, professional installation, manufacturer guidance, climate and actual appliance loads." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
          /* @__PURE__ */ jsx("pre", { className: "min-h-64 whitespace-pre-wrap rounded-xl bg-gray-950 p-5 text-sm leading-7 text-emerald-300", children: result }),
          /* @__PURE__ */ jsx("button", { className: btn, onClick: () => navigator.clipboard.writeText(result), children: "Copy result" })
        ] })
      ] })
    ] })
  ] });
}
var labels = { paint: ["Room perimeter m, wall height m, coats", "Doors, windows; then coverage m\xB2/litre"], tile: ["Floor length m, width m", "Tile length m, width m; then waste %"], curtain: ["Window width m, height m", "Fullness multiplier; floor/rod allowance m"], furniture: ["Furniture width, depth, height m", "Door width, height; room clearance width, depth m"], moving: ["Home size, people", "Amount of belongings"], grocery: ["People, monthly budget", "Category: planned amount \u2014 one per line"], recipe: ["Original servings", "Target servings, then ingredients"], cooking: ["Value, source unit", "Target unit"], ac: ["Room length, width, height m", "People; sun exposure"], generator: ["Fuel tank litres, consumption litres/hour", "Average electrical load kW"], solar: ["Daily energy use kWh", "Peak sun hours, system loss %, panel wattage"] };
function run(t, a, b) {
  if (t === "paint") {
    const [perimeter, height, coats] = a.split(",").map(num), [openings, coverageLine] = b.split("\n"), [doors, windows] = openings.split(",").map(num), coverage = num(coverageLine) || 10, area = Math.max(0, perimeter * height - doors * 1.9 - windows * 1.4), litres = area * coats / coverage;
    return `Paintable wall area: ${area.toFixed(1)} m\xB2
Paint before waste: ${litres.toFixed(1)} L
Recommended purchase (+10%): ${(litres * 1.1).toFixed(1)} L
Coats: ${coats}

Primer, texture, color change and surface porosity can change coverage.`;
  }
  if (t === "tile") {
    const [length, width] = a.split(",").map(num), [tileLine, wasteLine] = b.split("\n"), [tl, tw] = tileLine.split(",").map(num), waste = num(wasteLine), area = length * width, tileArea = tl * tw, count = Math.ceil(area / tileArea * (1 + waste / 100));
    return `Floor area: ${area.toFixed(2)} m\xB2
Tile area: ${tileArea.toFixed(3)} m\xB2
Base tiles: ${Math.ceil(area / tileArea)}
With ${waste}% waste: ${count} tiles
Purchase area: ${(area * (1 + waste / 100)).toFixed(2)} m\xB2`;
  }
  if (t === "curtain") {
    const [w, h] = a.split(",").map(num), [fullness, allowance] = b.split("\n").map(num), fabricWidth = w * fullness, drop = h + allowance;
    return `Finished curtain coverage: ${w.toFixed(2)} m wide \xD7 ${h.toFixed(2)} m high
Total fabric width at ${fullness}\xD7 fullness: ${fabricWidth.toFixed(2)} m
Recommended finished drop: ${drop.toFixed(2)} m
Two panels: ${(fabricWidth / 2).toFixed(2)} m finished width each

Add hems, heading allowance and pattern matching according to the fabric and maker.`;
  }
  if (t === "furniture") {
    const [fw, fd, fh] = a.split(",").map(num), [door, room] = b.split("\n"), [dw, dh] = door.split(",").map(num), [rw, rd] = room.split(",").map(num);
    const doorFits = fw <= dw && fh <= dh || fd <= dw && fh <= dh || fh <= dw && fw <= dh;
    return `Door opening: ${doorFits ? "LIKELY FITS in at least one simple orientation" : "DOES NOT FIT in the tested rectangular orientations"}
Room footprint: ${fw <= rw && fd <= rd || fd <= rw && fw <= rd ? "Fits entered clear floor rectangle" : "Does not fit entered clear floor rectangle"}
Furniture: ${fw} \xD7 ${fd} \xD7 ${fh} m
Clearance: ${rw} \xD7 ${rd} m

This does not model hall turns, stairs, handles, packaging or diagonal rotation. Measure the entire route.`;
  }
  if (t === "moving") {
    const bedrooms = num(a), people = num(a.match(/\d+(?=\s*people)/i)?.[0] || "1"), factor = b.toLowerCase().includes("many") ? 1.3 : b.toLowerCase().includes("minimal") ? 0.8 : 1, small = Math.ceil((bedrooms * 12 + people * 4) * factor), medium = Math.ceil((bedrooms * 10 + people * 3) * factor), large = Math.ceil((bedrooms * 5 + people * 2) * factor);
    return `Estimated boxes
Small: ${small}
Medium: ${medium}
Large: ${large}
Total: ${small + medium + large}

Also plan wardrobe boxes, book boxes, fragile-item protection, labels and an essentials box. Estimates vary greatly by household.`;
  }
  if (t === "grocery") {
    const [people, budget] = a.split(",").map(num), rows = b.split("\n").map((x) => {
      const [n, v] = x.split(":");
      return { name: n.trim(), value: num(v) };
    }), planned = rows.reduce((s, x) => s + x.value, 0);
    return `Monthly budget: \u09F3${budget.toLocaleString()}
Planned categories: \u09F3${planned.toLocaleString()}
Remaining buffer: \u09F3${(budget - planned).toLocaleString()}
Per person/month: \u09F3${(budget / people).toFixed(0)}
Per person/day: \u09F3${(budget / people / 30).toFixed(0)}

${rows.map((x) => `${x.name}: \u09F3${x.value.toLocaleString()} (${(x.value / budget * 100).toFixed(1)}%)`).join("\n")}`;
  }
  if (t === "recipe") {
    const original = num(a), [targetLine, ...ingredients] = b.split("\n"), target = num(targetLine), factor = target / original;
    return `Scale factor: ${factor.toFixed(2)}\xD7
${original} servings \u2192 ${target} servings

${ingredients.map((line) => line.replace(/(-?\d+(?:\.\d+)?)/, (m) => String(Number((num(m) * factor).toFixed(2))))).join("\n")}

Seasoning, leavening and cooking time may not scale perfectly; adjust and test.`;
  }
  if (t === "cooking") {
    const [valueText, fromRaw] = a.split(","), to = b.trim().toLowerCase(), from = fromRaw.trim().toLowerCase(), value = num(valueText);
    const ml = { ml: 1, l: 1e3, tsp: 4.92892, tbsp: 14.7868, cup: 236.588, "fl oz": 29.5735, pint: 473.176, quart: 946.353 };
    const g = { g: 1, kg: 1e3, oz: 28.3495, lb: 453.592 };
    let out;
    if (ml[from] && ml[to]) out = value * ml[from] / ml[to];
    if (g[from] && g[to]) out = value * g[from] / g[to];
    return out === void 0 ? "Unsupported conversion. Volume: ml, l, tsp, tbsp, cup, fl oz, pint, quart. Weight: g, kg, oz, lb." : `${value} ${from} = ${Number(out.toFixed(4))} ${to}

Weight and volume cannot be converted without ingredient density.`;
  }
  if (t === "ac") {
    const [l, w, h] = a.split(",").map(num), [peopleLine, sun2] = b.split("\n"), people = num(peopleLine), volume = l * w * h, base = l * w * 600 * (h / 2.8), adjust = base + (people - 1) * 500 + (sun2.toLowerCase().includes("sunny") ? base * 0.15 : 0), tons = adjust / 12e3;
    return `Room area: ${(l * w).toFixed(1)} m\xB2
Room volume: ${volume.toFixed(1)} m\xB3
Estimated cooling load: ${Math.round(adjust).toLocaleString()} BTU/h
Approximate nominal size: ${tons.toFixed(2)} tons
Suggested common class: ${tons <= 1 ? "1 ton" : tons <= 1.5 ? "1.5 ton" : tons <= 2 ? "2 ton" : "Professional load calculation recommended"}

Insulation, windows, climate, ceiling, occupancy and appliances materially affect sizing.`;
  }
  if (t === "generator") {
    const [tank, rate] = a.split(",").map(num), load = num(b), runtime = tank / rate;
    return `Estimated runtime: ${runtime.toFixed(1)} hours
Fuel tank: ${tank} L
Entered consumption: ${rate} L/hour
Average load: ${load} kW
Estimated energy delivered: ${(runtime * load).toFixed(1)} kWh

Use manufacturer fuel curves at the actual load. Maintain ventilation and never operate a fuel generator indoors.`;
  }
  const daily = num(a), [sun, loss, panel] = b.split("\n").map(num), required = daily / (sun * (1 - loss / 100)), panels = Math.ceil(required * 1e3 / panel);
  return `Daily energy target: ${daily} kWh
Required array after ${loss}% loss allowance: ${required.toFixed(2)} kW
${panel} W panels required: ${panels}
Nominal installed array: ${(panels * panel / 1e3).toFixed(2)} kW

Battery storage, inverter surge, roof orientation, shading, seasonal sun and local electrical rules require professional design.`;
}
var calculateHomeTool = (tool, a, b) => run(tool, a, b);

export {
  HomeToolsStudio,
  calculateHomeTool
};
