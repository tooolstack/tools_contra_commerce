// src/components/ProductivityToolsStudio.tsx
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var tools = [{ id: "daily", name: "Daily Planner Generator", group: "Plan", help: "Turn priorities and available hours into a realistic day." }, { id: "weekly", name: "Weekly Time-Block Maker", group: "Plan", help: "Create a repeatable weekday schedule." }, { id: "priority", name: "Priority Matrix", group: "Decide", help: "Classify tasks by urgency and importance." }, { id: "decision", name: "Decision Matrix", group: "Decide", help: "Score options against weighted criteria." }, { id: "goal", name: "Goal Breakdown Generator", group: "Execute", help: "Turn an outcome into milestones and next actions." }, { id: "deadline", name: "Project Deadline Calculator", group: "Execute", help: "Estimate a buffered completion date from effort and capacity." }, { id: "random", name: "Random Task Picker", group: "Execute", help: "Choose securely from a task list when you feel stuck." }, { id: "pomodoro", name: "Pomodoro Timer", group: "Focus", help: "Run focused work and break intervals." }, { id: "focus", name: "Focus Session Generator", group: "Focus", help: "Create a distraction-resistant focus ritual." }, { id: "habit", name: "Habit Streak Calculator", group: "Review", help: "Measure current and longest completion streaks." }, { id: "meeting", name: "Meeting Cost Calculator", group: "Review", help: "Expose the time and salary cost of meetings." }, { id: "reading", name: "Reading Time Calculator", group: "Review", help: "Estimate silent and spoken reading time." }];
var defaults = { daily: ["Finish proposal\nReview campaign numbers\nReply to key clients", "8"], weekly: ["Deep work, Client delivery, Marketing, Admin, Learning", "09:00\u201317:00"], priority: ["Submit tax return | urgent | important\nUpdate website copy | not urgent | important\nReply to routine email | urgent | not important\nBrowse design ideas | not urgent | not important", ""], pomodoro: ["25", "5"], habit: ["2026-07-25,2026-07-26,2026-07-27,2026-07-29,2026-07-30,2026-07-31,2026-08-01", "2026-08-01"], goal: ["Launch the new online store", "2026-10-01"], decision: ["Option A: 8,7,6\nOption B: 6,9,8\nOption C: 7,8,9", "Cost:3, Quality:5, Speed:2"], meeting: ["6", "850"], reading: ["Paste an article, speech or script here to estimate its reading time. Add more text for a more representative result.", "200"], deadline: ["160", "6"], random: ["Prepare invoice\nWrite product description\nReview supplier quotation\nSchedule campaign", ""], focus: ["Write the proposal introduction", "50"] };
var c = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var btn = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40";
var num = (v) => Number(v) || 0;
function ProductivityToolsStudio() {
  const [active, setActive] = useState("daily");
  const [a, setA] = useState(defaults.daily[0]);
  const [b, setB] = useState(defaults.daily[1]);
  const [picked, setPicked] = useState("");
  const selected = tools.find((t) => t.id === active);
  const groups = Array.from(new Set(tools.map((t) => t.group)));
  const choose = (id) => {
    setActive(id);
    setA(defaults[id][0]);
    setB(defaults[id][1]);
    setPicked("");
  };
  const result = useMemo(() => run(active, a, b, picked), [active, a, b, picked]);
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "self-start rounded-2xl border bg-white p-3 shadow-sm xl:sticky xl:top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-3 pb-3 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-indigo-600", children: "12 focused utilities" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold", children: "Productivity Tools" })
      ] }),
      groups.map((g) => /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: g }),
        tools.filter((t) => t.group === g).map((t) => /* @__PURE__ */ jsx("button", { onClick: () => choose(t.id), className: `mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${active === t.id ? "bg-gray-950 font-semibold text-white" : "text-gray-700 hover:bg-gray-100"}`, children: t.name }, t.id))
      ] }, g))
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border bg-gradient-to-r from-indigo-50 to-violet-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-indigo-700", children: "Productivity Tools" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold", children: selected.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: selected.help })
      ] }),
      active === "pomodoro" ? /* @__PURE__ */ jsx(Timer, { work: Math.max(1, num(a)), rest: Math.max(1, num(b)), setWork: setA, setRest: setB }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][0] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: active === "reading" ? 14 : active === "daily" || active === "priority" || active === "decision" || active === "random" ? 9 : 4, value: a, onChange: (e) => setA(e.target.value) })
          ] }),
          labels[active][1] && /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][1] }),
            /* @__PURE__ */ jsx("input", { className: c, value: b, type: ["goal", "habit"].includes(active) ? "date" : active === "weekly" ? "text" : "number", step: "any", onChange: (e) => setB(e.target.value) })
          ] }),
          active === "random" && /* @__PURE__ */ jsx("button", { className: btn, onClick: () => {
            const items = a.split("\n").map((x) => x.trim()).filter(Boolean);
            if (items.length) {
              const v = new Uint32Array(1);
              crypto.getRandomValues(v);
              setPicked(items[v[0] % items.length]);
            }
          }, children: "Pick a task" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: "Plans are generated locally. Adjust them to match your real energy, responsibilities and constraints." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Your result" }),
          /* @__PURE__ */ jsx("pre", { className: "min-h-64 whitespace-pre-wrap rounded-xl bg-gray-950 p-5 text-sm leading-7 text-emerald-300", children: result }),
          /* @__PURE__ */ jsx("button", { className: btn, onClick: () => navigator.clipboard.writeText(result), children: "Copy result" })
        ] })
      ] })
    ] })
  ] });
}
var labels = { daily: ["Priorities \u2014 one per line", "Available work hours"], weekly: ["Weekly focus areas \u2014 comma-separated", ""], priority: ["Task | urgency | importance", ""], pomodoro: ["Focus minutes", "Break minutes"], habit: ["Completion dates \u2014 comma-separated", "Today / streak end date"], goal: ["Goal or outcome", "Target date"], decision: ["Options: name: scores", ""], meeting: ["Attendees", "Average hourly cost per person"], reading: ["Text", "Reading speed (words per minute)"], deadline: ["Estimated effort (hours)", "Productive hours per day"], random: ["Tasks \u2014 one per line", ""], focus: ["Focus objective", "Session minutes"] };
function Timer({ work, rest, setWork, setRest }) {
  const [phase, setPhase] = useState("Focus");
  const [seconds, setSeconds] = useState(work * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => {
      if (s > 1) return s - 1;
      setPhase((p) => {
        const next = p === "Focus" ? "Break" : "Focus";
        setSeconds((next === "Focus" ? work : rest) * 60);
        return next;
      });
      return 0;
    }), 1e3);
    return () => clearInterval(id);
  }, [running, work, rest]);
  const reset = () => {
    setRunning(false);
    setPhase("Focus");
    setSeconds(work * 60);
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-[1fr_1.2fr]", children: [
    /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: "Focus minutes" }),
        /* @__PURE__ */ jsx("input", { className: c, type: "number", value: work, onChange: (e) => {
          setWork(e.target.value);
          setSeconds(num(e.target.value) * 60);
        } })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: "Break minutes" }),
        /* @__PURE__ */ jsx("input", { className: c, type: "number", value: rest, onChange: (e) => setRest(e.target.value) })
      ] }),
      /* @__PURE__ */ jsx("button", { className: btn, onClick: reset, children: "Reset" })
    ] }),
    /* @__PURE__ */ jsx("section", { className: `grid min-h-80 place-items-center rounded-2xl border p-8 text-center ${phase === "Focus" ? "bg-gray-950 text-white" : "bg-emerald-100 text-emerald-950"}`, children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold uppercase tracking-[.2em]", children: phase }),
      /* @__PURE__ */ jsxs("p", { className: "my-5 text-7xl font-black tabular-nums", children: [
        String(Math.floor(seconds / 60)).padStart(2, "0"),
        ":",
        String(seconds % 60).padStart(2, "0")
      ] }),
      /* @__PURE__ */ jsx("button", { className: `rounded-xl px-6 py-3 font-bold ${phase === "Focus" ? "bg-white text-gray-950" : "bg-emerald-900 text-white"}`, onClick: () => setRunning((x) => !x), children: running ? "Pause" : "Start" })
    ] }) })
  ] });
}
function run(t, a, b, picked) {
  if (t === "daily") {
    const tasks = a.split("\n").filter(Boolean), hours = Math.max(1, num(b)), start = 9 * 60, block = hours * 60 / Math.max(1, tasks.length);
    return `DAILY PLAN

${tasks.map((task, i) => `${clock(start + i * block)}\u2013${clock(start + (i + 1) * block - 10)}  ${task}
${clock(start + (i + 1) * block - 10)}\u2013${clock(start + (i + 1) * block)}  Reset / notes`).join("\n\n")}

Protect the first block for the highest-impact task.`;
  }
  if (t === "weekly") {
    const areas = a.split(",").map((x) => x.trim()).filter(Boolean);
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, i) => `${day}
09:00\u201311:00  ${areas[i % areas.length]}
11:30\u201313:00  Delivery / collaboration
14:00\u201315:30  ${areas[(i + 1) % areas.length]}
16:00\u201317:00  Admin and shutdown`).join("\n\n");
  }
  if (t === "priority") {
    const q = { "DO NOW": [], "SCHEDULE": [], "DELEGATE": [], "ELIMINATE / LIMIT": [] };
    a.split("\n").forEach((line) => {
      const [task, u = "", i = ""] = line.split("|").map((x) => x.trim());
      const urgent = !u.includes("not"), important = !i.includes("not");
      q[urgent && important ? "DO NOW" : !urgent && important ? "SCHEDULE" : urgent && !important ? "DELEGATE" : "ELIMINATE / LIMIT"].push(task);
    });
    return Object.entries(q).map(([k, v]) => `${k}
${v.length ? v.map((x) => `\u2022 ${x}`).join("\n") : "\u2022 None"}`).join("\n\n");
  }
  if (t === "habit") {
    const dates = a.split(",").map((x) => x.trim()).filter(Boolean).sort();
    const set = new Set(dates);
    let longest = 0, current = 0, run2 = 0, previous = null;
    dates.forEach((x) => {
      const d = new Date(x);
      run2 = previous && Math.round((+d - +previous) / 864e5) === 1 ? run2 + 1 : 1;
      longest = Math.max(longest, run2);
      previous = d;
    });
    let cursor = new Date(b);
    while (set.has(cursor.toISOString().slice(0, 10))) {
      current++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return `Current streak: ${current} days
Longest streak: ${longest} days
Recorded completions: ${dates.length}
Completion window: ${dates[0] || "\u2014"} to ${dates.at(-1) || "\u2014"}

Aim to resume quickly after a miss instead of protecting a perfect record.`;
  }
  if (t === "goal") {
    const target = new Date(b), today = /* @__PURE__ */ new Date(), left = Math.max(0, Math.ceil((+target - +today) / 864e5));
    return `${a.toUpperCase()}
Target: ${target.toLocaleDateString()} \xB7 ${left} days

MILESTONE 1 \u2014 Define success (${Math.round(left * 0.15)} days)
\u2022 Write measurable acceptance criteria
\u2022 List constraints and owners

MILESTONE 2 \u2014 Build the first complete version (${Math.round(left * 0.45)} days)
\u2022 Deliver the smallest end-to-end result
\u2022 Review risks weekly

MILESTONE 3 \u2014 Test and improve (${Math.round(left * 0.25)} days)
\u2022 Gather evidence and fix priority issues

MILESTONE 4 \u2014 Launch and hand off (${Math.round(left * 0.15)} days)
\u2022 Complete checklist, communication and follow-up

NEXT ACTION: Schedule 30 minutes to define success.`;
  }
  if (t === "decision") {
    const criteria = b.split(",").map((x) => {
      const [name, w] = x.split(":");
      return { name: name.trim(), weight: num(w) };
    }), options = a.split("\n").map((line) => {
      const [name, scores = ""] = line.split(":");
      const nums = scores.split(",").map(num);
      return { name: name.trim(), total: nums.reduce((sum, x, i) => sum + x * (criteria[i]?.weight || 1), 0), scores: nums };
    }).sort((x, y) => y.total - x.total);
    return `CRITERIA
${criteria.map((x) => `\u2022 ${x.name}: weight ${x.weight}`).join("\n")}

RANKING
${options.map((x, i) => `${i + 1}. ${x.name} \u2014 weighted score ${x.total}
   ${x.scores.join(", ")}`).join("\n")}`;
  }
  if (t === "meeting") {
    const people = num(a), hourly = num(b);
    return `Cost per meeting hour: \u09F3${(people * hourly).toLocaleString()}
30-minute meeting: \u09F3${(people * hourly / 2).toLocaleString()}
Weekly one-hour meeting per year: \u09F3${(people * hourly * 52).toLocaleString()}
Participant-hours per meeting: ${people}

Include only essential decision-makers and publish an agenda.`;
  }
  if (t === "reading") {
    const words = a.trim().split(/\s+/).filter(Boolean).length, speed = Math.max(1, num(b)), minutes = words / speed;
    return `Words: ${words.toLocaleString()}
Silent reading (${speed} wpm): ${duration(minutes)}
Careful reading (${Math.round(speed * 0.65)} wpm): ${duration(words / (speed * 0.65))}
Spoken delivery (135 wpm): ${duration(words / 135)}`;
  }
  if (t === "deadline") {
    const effort = num(a), daily = Math.max(0.1, num(b)), workdays = Math.ceil(effort / daily), buffer = Math.ceil(workdays * 0.2), date = /* @__PURE__ */ new Date();
    let added = 0;
    while (added < workdays + buffer) {
      date.setDate(date.getDate() + 1);
      if (![0, 6].includes(date.getDay())) added++;
    }
    return `Base workdays: ${workdays}
20% delivery buffer: ${buffer} workdays
Planned duration: ${workdays + buffer} workdays
Estimated buffered completion: ${date.toLocaleDateString(void 0, { dateStyle: "full" })}

Recalculate when scope or available capacity changes.`;
  }
  if (t === "random") return picked ? `NEXT TASK

${picked}

Start with a 10-minute commitment. When finished, return and pick again.` : "Click \u201CPick a task\u201D to choose securely from the list.";
  return `FOCUS SESSION \u2014 ${b} MINUTES
Objective: ${a}

1. PREPARE (3 min)
\u2022 Close unrelated tabs and silence notifications
\u2022 Write the single visible finish line

2. FOCUS (${Math.max(5, num(b) - 8)} min)
\u2022 Work only on the objective
\u2022 Capture distractions instead of following them

3. CLOSE (5 min)
\u2022 Record what changed
\u2022 Write the very next action
\u2022 Decide whether another session is needed.`;
}
function clock(v) {
  const h = Math.floor(v / 60) % 24, m = Math.round(v % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function duration(minutes) {
  const sec = Math.round(minutes * 60);
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}
var calculateProductivityTool = (tool, a, b, picked = "") => run(tool, a, b, picked);

export {
  ProductivityToolsStudio,
  calculateProductivityTool
};
