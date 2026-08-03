// src/components/HealthToolsStudio.tsx
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var tools = [{ id: "bmi", name: "BMI Calculator", help: "Calculate adult BMI as a screening number." }, { id: "water", name: "Water Intake Calculator", help: "Create a baseline hydration estimate from body weight and activity." }, { id: "sleep", name: "Sleep Cycle Calculator", help: "Plan approximate wake or bedtime options using 90-minute cycles." }, { id: "calorie", name: "Calorie Calculator", help: "Estimate adult basal and daily energy expenditure." }, { id: "walking", name: "Walking Distance Calculator", help: "Convert steps to distance, time and an approximate energy range." }, { id: "caffeine", name: "Caffeine Timing Calculator", help: "Estimate caffeine remaining over time using an assumed half-life." }, { id: "screen", name: "Screen-Time Cost Calculator", help: "Translate daily screen time into weekly, yearly and long-term time." }, { id: "pregnancy", name: "Pregnancy Week Calculator", help: "Estimate gestational week and due date from the last menstrual period." }, { id: "baby", name: "Baby Feeding Tracker", help: "Create a blank feeding log and interval summary." }, { id: "medicine", name: "Medicine Reminder Schedule", help: "Generate reminder times from clinician-provided instructions." }];
var defaults = { bmi: ["70", "170"], water: ["70", "45"], sleep: ["07:00", "Wake at"], calorie: ["Female,30,70,165", "Moderately active"], walking: ["8000", "0.72,80"], caffeine: ["200,14:00", "22:00,5"], screen: ["4.5", "30"], pregnancy: ["2026-05-01", ""], baby: ["07:00, Breast milk, 15 min\n10:30, Formula, 90 ml\n14:00, Breast milk, 18 min", ""], medicine: ["08:00", "3\n7\nMedicine name \u2014 use only as prescribed"] };
var c = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var btn = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white";
var num = (x) => Number(x) || 0;
function HealthToolsStudio() {
  const [active, setActive] = useState("bmi");
  const [a, setA] = useState(defaults[active][0]);
  const [b, setB] = useState(defaults[active][1]);
  const selected = tools.find((x) => x.id === active);
  const choose = (id) => {
    setActive(id);
    setA(defaults[id][0]);
    setB(defaults[id][1]);
  };
  const result = useMemo(() => run(active, a, b), [active, a, b]);
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "self-start rounded-2xl border bg-white p-3 shadow-sm xl:sticky xl:top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-3 pb-3 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-rose-600", children: "10 wellbeing utilities" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold", children: "Health & Lifestyle" })
      ] }),
      tools.map((x) => /* @__PURE__ */ jsx("button", { onClick: () => choose(x.id), className: `mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm ${active === x.id ? "bg-gray-950 font-semibold text-white" : "text-gray-700 hover:bg-gray-100"}`, children: x.name }, x.id))
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border bg-gradient-to-r from-rose-50 to-orange-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-rose-700", children: "Health & Lifestyle" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold", children: selected.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: selected.help })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950", children: [
        /* @__PURE__ */ jsx("b", { children: "Health information only:" }),
        " These tools provide general estimates and schedules. They do not diagnose, prescribe, calculate medicine doses or replace advice from a qualified clinician. Seek urgent medical care for concerning symptoms."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][0] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: active === "baby" ? 10 : 4, value: a, onChange: (e) => setA(e.target.value) })
          ] }),
          labels[active][1] && /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][1] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: 4, value: b, onChange: (e) => setB(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
          /* @__PURE__ */ jsx("pre", { className: "min-h-64 whitespace-pre-wrap rounded-xl bg-gray-950 p-5 text-sm leading-7 text-emerald-300", children: result }),
          /* @__PURE__ */ jsx("button", { className: btn, onClick: () => navigator.clipboard.writeText(result), children: "Copy result" })
        ] })
      ] })
    ] })
  ] });
}
var labels = { bmi: ["Weight (kg)", "Height (cm)"], water: ["Weight (kg)", "Exercise minutes/day"], sleep: ["Target time", "Wake at / Sleep at"], calorie: ["Sex, age, weight kg, height cm", "Activity level"], walking: ["Steps", "Stride length metres, body weight kg"], caffeine: ["Dose mg, consumption time", "Target time, assumed half-life hours"], screen: ["Daily screen hours", "Years"], pregnancy: ["First day of last menstrual period", ""], baby: ["One feed per line: time, type, amount/duration", ""], medicine: ["First reminder time", "Reminders/day, days, medicine label"] };
function clock(m) {
  m = (m % 1440 + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;
}
function time(v) {
  const [h, m] = v.split(":").map(Number);
  return h * 60 + m;
}
function run(t, a, b) {
  if (t === "bmi") {
    const bmi = num(a) / Math.pow(num(b) / 100, 2), band = bmi < 18.5 ? "below the common reference range" : bmi < 25 ? "within the common reference range" : bmi < 30 ? "above the common reference range" : "well above the common reference range";
    return `BMI: ${bmi.toFixed(1)}
Screening interpretation: ${band}
Common adult reference range: 18.5\u201324.9

BMI does not account for muscle mass, pregnancy, age-related needs or individual health. Discuss concerns with a clinician.`;
  }
  if (t === "water") {
    const base = num(a) * 35, exercise = num(b) / 30 * 350, total = base + exercise;
    return `Baseline estimate: ${(base / 1e3).toFixed(2)} L/day
Activity adjustment: ${(exercise / 1e3).toFixed(2)} L/day
Estimated total: ${(total / 1e3).toFixed(2)} L/day
Approximately ${Math.round(total / 250)} \xD7 250 ml glasses

Needs vary with climate, illness, pregnancy, diet and medical conditions. Some people must restrict fluids.`;
  }
  if (t === "sleep") {
    const at = time(a), wake = b === "Wake at";
    return `${wake ? "BEDTIME OPTIONS" : "WAKE OPTIONS"}
${[6, 5, 4].map((cycles) => `${cycles} cycles (${cycles * 1.5}h): ${clock(wake ? at - cycles * 90 - 15 : at + cycles * 90 + 15)}`).join("\n")}

Includes an assumed 15 minutes to fall asleep. Sleep cycles vary; consistent sleep opportunity and sufficient total sleep matter more than exact cycle timing.`;
  }
  if (t === "calorie") {
    const [sex, age, kg, cm] = a.split(",").map((x) => x.trim()), base = 10 * num(kg) + 6.25 * num(cm) - 5 * num(age) + (sex.toLowerCase().startsWith("m") ? 5 : -161), factors = { "Sedentary": 1.2, "Lightly active": 1.375, "Moderately active": 1.55, "Very active": 1.725 }, daily = base * (factors[b] || 1.55);
    return `Estimated resting energy: ${Math.round(base)} kcal/day
Estimated maintenance energy: ${Math.round(daily)} kcal/day
Activity assumption: ${b}

This is a population estimate, not a diet prescription. Children, pregnancy, breastfeeding, illness and eating-disorder concerns require qualified guidance.`;
  }
  if (t === "walking") {
    const [stride, kg] = b.split(",").map(num), km = num(a) * stride / 1e3, minutes = km / 5 * 60, cal = km * kg * 0.5;
    return `Estimated distance: ${km.toFixed(2)} km
At 5 km/h: ${Math.round(minutes)} minutes
Approximate energy range: ${Math.round(cal * 0.75)}\u2013${Math.round(cal * 1.25)} kcal
Steps: ${num(a).toLocaleString()}

Stride, terrain, pace and physiology change these estimates.`;
  }
  if (t === "caffeine") {
    const [dose, consumed] = a.split(","), [target, half] = b.split(","), elapsed = (time(target.trim()) - time(consumed.trim()) + 1440) % 1440 / 60, remaining = num(dose) * Math.pow(0.5, elapsed / num(half));
    return `Elapsed time: ${elapsed.toFixed(1)} hours
Estimated caffeine remaining: ${remaining.toFixed(0)} mg of ${dose} mg
Assumed half-life: ${half} hours

Caffeine metabolism varies widely with pregnancy, medications, smoking and health conditions. This is not a safety clearance.`;
  }
  if (t === "screen") {
    const daily = num(a), years = num(b), annual = daily * 365;
    return `Daily: ${daily} hours
Weekly: ${(daily * 7).toFixed(1)} hours
Yearly: ${annual.toLocaleString()} hours (${(annual / 24).toFixed(1)} days)
Over ${years} years: ${(annual * years).toLocaleString()} hours (${(annual * years / 8760).toFixed(1)} years)

Not all screen time is equal. Separate purposeful work, connection and learning from low-value use.`;
  }
  if (t === "pregnancy") {
    const lmp = new Date(a), today = /* @__PURE__ */ new Date(), gest = Math.floor((+today - +lmp) / 864e5), due = new Date(lmp);
    due.setDate(due.getDate() + 280);
    return `Estimated gestational age today: ${Math.floor(gest / 7)} weeks, ${gest % 7} days
Estimated due date: ${due.toLocaleDateString(void 0, { dateStyle: "full" })}
Calculation method: 40 weeks from entered LMP

Dates can change after clinical assessment and ultrasound. Contact a maternity-care professional for personalized care or concerning symptoms.`;
  }
  if (t === "baby") {
    const rows = a.split("\n").filter(Boolean).map((x) => x.split(",").map((y) => y.trim()));
    const intervals = rows.slice(1).map((x, i) => (time(x[0]) - time(rows[i][0]) + 1440) % 1440);
    return `FEEDING LOG
${rows.map((x, i) => `${i + 1}. ${x.join(" \xB7 ")}`).join("\n")}

Recorded feeds: ${rows.length}
Average entered interval: ${intervals.length ? (intervals.reduce((x, y) => x + y, 0) / intervals.length / 60).toFixed(1) : "\u2014"} hours

Follow your baby\u2019s cues and clinician\u2019s advice. Seek prompt care for feeding difficulty, dehydration signs, unusual sleepiness or other concerns.`;
  }
  const [start] = a.split(","), [perDay, days, label] = b.split("\n"), gap = 1440 / Math.max(1, num(perDay));
  return `${label || "Medicine"}
Use only according to the prescription/label.

DAILY REMINDERS
${Array.from({ length: Math.max(1, num(perDay)) }, (_, i) => `${i + 1}. ${clock(time(start) + i * gap)}`).join("\n")}

Schedule duration entered: ${days} days

This tool schedules reminders only. It does not determine dose, frequency, interactions or whether missed doses should be taken. Confirm those instructions with a pharmacist or prescriber.`;
}
var calculateHealthTool = (tool, a, b) => run(tool, a, b);

export {
  HealthToolsStudio,
  calculateHealthTool
};
