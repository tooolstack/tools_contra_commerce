import {
  DropdownControl
} from "./chunk-NCBI5OCB.js";

// src/components/EducationToolsStudio.tsx
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var tools = [{ id: "gpa", name: "GPA Calculator by Country", group: "Grades", help: "Calculate weighted GPA using common 4.0, 5.0, 10.0 or percentage scales." }, { id: "grade", name: "Grade Percentage Calculator", group: "Grades", help: "Convert earned marks into percentage and grade." }, { id: "marks-needed", name: "Marks Needed Calculator", group: "Grades", help: "Find marks required from remaining assessment points." }, { id: "pass-marks", name: "What Marks Do I Need to Pass?", group: "Grades", help: "Calculate the exact remaining pass requirement." }, { id: "final-grade", name: "Final Exam Grade Needed", group: "Grades", help: "Find the final-exam percentage required for a target course grade." }, { id: "citation", name: "Citation Generator", group: "Write", help: "Format a basic book, article or web citation in APA, MLA or Chicago." }, { id: "word-count", name: "Word Counter", group: "Write", help: "Count words, characters, sentences and paragraphs." }, { id: "reading-level", name: "Reading Level Checker", group: "Write", help: "Estimate readability using sentence and syllable signals." }, { id: "vocabulary", name: "Vocabulary Difficulty Checker", group: "Write", help: "Flag long and uncommon-looking words for review." }, { id: "essay", name: "Essay Outline Generator", group: "Write", help: "Create a structured thesis, body and conclusion outline." }, { id: "schedule", name: "Study Schedule Generator", group: "Study", help: "Distribute subjects across available days and sessions." }, { id: "study-hours", name: "Study Hours Planner", group: "Study", help: "Calculate a confidence-adjusted daily study target." }, { id: "countdown", name: "Exam Countdown Planner", group: "Study", help: "Create revision phases leading to an exam." }, { id: "flashcards", name: "Flashcard Generator", group: "Practice", help: "Turn term-definition notes into printable study cards." }, { id: "quiz", name: "Quiz Generator", group: "Practice", help: "Generate short-answer and multiple-choice prompts from notes." }, { id: "question-paper", name: "Question Paper Maker", group: "Practice", help: "Build a balanced question paper with marks and instructions." }, { id: "typing", name: "Typing Speed Test", group: "Practice", help: "Measure words per minute and accuracy from a timed sample." }];
var defaults = { gpa: ["Mathematics,85,3\nEnglish,78,2\nScience,92,4", "4.0 scale"], grade: ["78", "100"], citation: ["Practical E-commerce\nAsif Khan Nirob\n2026\nContra Press\nhttps://example.com/book", "APA"], schedule: ["Mathematics: 8\nEnglish: 4\nScience: 10", "14 days, 3 hours/day"], quiz: ["Photosynthesis: Plants convert light energy into chemical energy.\nMitochondria: The organelle responsible for cellular respiration.", "6"], flashcards: ["Revenue: Total income before expenses.\nProfit: Revenue remaining after all costs.\nMargin: Profit expressed as a percentage of revenue.", ""], "word-count": ["Paste or write your text here. This tool counts words, characters, sentences and paragraphs.", ""], "reading-level": ["Clear writing uses familiar words and varied sentence lengths. It explains difficult ideas without unnecessary complexity.", ""], typing: ["Clear communication helps teams make better decisions and complete meaningful work.", "60\nClear communication helps teams make better decisions and complete meaningful work."], vocabulary: ["Leverage comprehensive methodologies to facilitate organizational interoperability and practical customer outcomes.", ""], essay: ["How digital tools improve small-business decision making", "Digital tools improve decisions by making costs visible, reducing manual work, and supporting faster experiments."], countdown: ["2026-12-10", "Mathematics, English, Science"], "marks-needed": ["52", "100\n40\n60"], "pass-marks": ["38", "50\n100"], "final-grade": ["72", "40\n80"], "study-hours": ["80", "30\n50"], "question-paper": ["E-commerce fundamentals\nProfit, revenue, contribution margin, customer acquisition cost, returns", "100\n120"] };
var c = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var btn = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white";
var num = (x) => Number(x) || 0;
function EducationToolsStudio() {
  const [active, setActive] = useState("gpa");
  const [a, setA] = useState(defaults.gpa[0]);
  const [b, setB] = useState(defaults.gpa[1]);
  const groups = Array.from(new Set(tools.map((x) => x.group)));
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
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-sky-600", children: "17 learning utilities" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold", children: "Education Tools" })
      ] }),
      groups.map((g) => /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: g }),
        tools.filter((x) => x.group === g).map((x) => /* @__PURE__ */ jsx("button", { onClick: () => choose(x.id), className: `mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${active === x.id ? "bg-gray-950 font-semibold text-white" : "text-gray-700 hover:bg-gray-100"}`, children: x.name }, x.id))
      ] }, g))
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border bg-gradient-to-r from-sky-50 to-blue-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-sky-700", children: "Education Tools" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold", children: selected.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: selected.help })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][0] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: active === "word-count" || active === "reading-level" || active === "vocabulary" ? 14 : 9, value: a, onChange: (e) => setA(e.target.value) })
          ] }),
          labels[active][1] && /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][1] }),
            ["gpa", "citation"].includes(active) ? /* @__PURE__ */ jsx(DropdownControl, { className: c, ariaLabel: labels[active][1], value: b, onChange: setB, options: active === "gpa" ? ["4.0 scale", "5.0 scale", "10.0 scale", "Percentage"] : ["APA", "MLA", "Chicago"] }) : /* @__PURE__ */ jsx("textarea", { className: c, rows: 4, value: b, onChange: (e) => setB(e.target.value) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: "Verify institutional grading rules, citation requirements and exam policies. Generated study material should be reviewed by the learner or teacher." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Result" }),
          /* @__PURE__ */ jsx("pre", { className: "max-h-[700px] min-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-gray-950 p-5 text-sm leading-7 text-emerald-300", children: result }),
          /* @__PURE__ */ jsx("button", { className: btn, onClick: () => navigator.clipboard.writeText(result), children: "Copy result" })
        ] })
      ] })
    ] })
  ] });
}
var labels = { gpa: ["Courses: name, percentage, credits", "Scale"], grade: ["Marks earned", "Total marks"], citation: ["Title, author, year, publisher, URL", "Citation style"], schedule: ["Subjects and estimated hours", "Days and available hours/day"], quiz: ["Term: definition \u2014 one per line", "Number of questions"], flashcards: ["Term: definition \u2014 one per line", ""], "word-count": ["Text", ""], "reading-level": ["Text", ""], typing: ["Reference text", "Elapsed seconds, then typed text"], vocabulary: ["Text", ""], essay: ["Essay topic", "Thesis or central claim"], countdown: ["Exam date", "Subjects \u2014 comma-separated"], "marks-needed": ["Marks already earned", "Total course points, completed points, target %"], "pass-marks": ["Marks already earned", "Completed points, total course points"], "final-grade": ["Current course percentage", "Final exam weight %, target course %"], "study-hours": ["Estimated syllabus hours", "Days remaining, confidence %"], "question-paper": ["Subject, then syllabus topics", "Total marks, duration in minutes"] };
function pctGrade(p) {
  return p >= 90 ? "A+" : p >= 80 ? "A" : p >= 70 ? "B" : p >= 60 ? "C" : p >= 50 ? "D" : "F";
}
function words(v) {
  return v.trim().match(/[\p{L}\p{N}'’-]+/gu) || [];
}
function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 1;
  return Math.max(1, (w.replace(/e$/, "").match(/[aeiouy]+/g) || []).length);
}
function run(t, a, b) {
  if (t === "gpa") {
    const max = b.startsWith("4") ? 4 : b.startsWith("5") ? 5 : b.startsWith("10") ? 10 : 100;
    const rows = a.split("\n").map((x) => x.split(",")).filter((x) => x.length >= 3);
    let points = 0, credits = 0;
    const lines = rows.map(([name, mark, credit]) => {
      const p = num(mark), c2 = num(credit), gp = max === 100 ? p : max === 4 ? p >= 93 ? 4 : p >= 90 ? 3.7 : p >= 87 ? 3.3 : p >= 83 ? 3 : p >= 80 ? 2.7 : p >= 77 ? 2.3 : p >= 73 ? 2 : p >= 70 ? 1.7 : p >= 67 ? 1.3 : p >= 60 ? 1 : 0 : p / 100 * max;
      points += gp * c2;
      credits += c2;
      return `${name.trim()}: ${gp.toFixed(2)} \xD7 ${c2} credits`;
    });
    return `${b} GPA: ${credits ? (points / credits).toFixed(2) : "0.00"}
Total credits: ${credits}

${lines.join("\n")}

Scale mappings vary by institution and country; confirm the official policy.`;
  }
  if (t === "grade") {
    const p = num(b) ? num(a) / num(b) * 100 : 0;
    return `Percentage: ${p.toFixed(2)}%
Indicative grade: ${pctGrade(p)}
Marks: ${a} / ${b}
Marks not earned: ${Math.max(0, num(b) - num(a))}`;
  }
  if (t === "marks-needed") {
    const [total, completed, target] = b.split("\n").map(num), remaining = total - completed, needed = total * target / 100 - num(a);
    return `Target: ${target}% (${(total * target / 100).toFixed(2)} points)
Remaining available: ${remaining} points
Needed from remaining work: ${Math.max(0, needed).toFixed(2)} points
Required remaining percentage: ${remaining ? Math.max(0, needed) / remaining * 100 : 0}%
Status: ${needed > remaining ? "Target is no longer mathematically reachable." : needed <= 0 ? "Target already secured." : "Target remains reachable."}`;
  }
  if (t === "pass-marks") {
    const [completed, total] = b.split("\n").map(num), target = total * 0.5, needed = target - num(a), remaining = total - completed;
    return `Assumed pass mark: 50% (${target} points)
Marks still needed: ${Math.max(0, needed).toFixed(2)}
Required on remaining points: ${remaining ? Math.max(0, needed) / remaining * 100 : 0}%
${needed <= 0 ? "You have already reached the assumed pass threshold." : needed > remaining ? "Passing is not mathematically possible under these inputs." : "Passing remains achievable."}`;
  }
  if (t === "final-grade") {
    const [weight, target] = b.split("\n").map(num), current = num(a), required = (target - current * (1 - weight / 100)) / (weight / 100);
    return `Current grade: ${current}%
Final exam weight: ${weight}%
Target course grade: ${target}%
Required final exam grade: ${required.toFixed(2)}%
${required > 100 ? "Target is not reachable from the final exam alone." : required <= 0 ? "Target is already secured." : "Target is mathematically reachable."}`;
  }
  if (t === "citation") {
    const [title = "", author = "", year = "", publisher = "", url = ""] = a.split("\n");
    if (b === "MLA") return `${author}. \u201C${title}.\u201D ${publisher}, ${year}. ${url}.`;
    if (b === "Chicago") return `${author}. \u201C${title}.\u201D ${publisher}, ${year}. ${url}.`;
    return `${author} (${year}). ${title}. ${publisher}. ${url}`;
  }
  if (t === "word-count") {
    const w = words(a), sent = (a.match(/[.!?]+(?:\s|$)/g) || []).length, paras = a.split(/\n\s*\n/).filter((x) => x.trim()).length;
    return `Words: ${w.length.toLocaleString()}
Characters: ${a.length.toLocaleString()}
Characters without spaces: ${a.replace(/\s/g, "").length.toLocaleString()}
Sentences: ${sent}
Paragraphs: ${paras}
Estimated reading time: ${Math.max(1, Math.ceil(w.length / 200))} minutes`;
  }
  if (t === "reading-level") {
    const w = words(a), sent = Math.max(1, (a.match(/[.!?]+(?:\s|$)/g) || []).length), syll = w.reduce((s, x) => s + syllables(x), 0), score = 206.835 - 1.015 * (w.length / sent) - 84.6 * (syll / Math.max(1, w.length)), grade = 0.39 * (w.length / sent) + 11.8 * (syll / Math.max(1, w.length)) - 15.59;
    return `Flesch reading ease: ${score.toFixed(1)} / 100
Approximate US grade level: ${Math.max(0, grade).toFixed(1)}
Words per sentence: ${(w.length / sent).toFixed(1)}
Syllables per word: ${(syll / Math.max(1, w.length)).toFixed(2)}

This English-language estimate is a writing signal, not a measure of reader intelligence.`;
  }
  if (t === "vocabulary") {
    const w = words(a), unique = Array.from(new Set(w.map((x) => x.toLowerCase()))), hard = unique.filter((x) => x.length >= 10 || syllables(x) >= 4).sort((x, y) => y.length - x.length);
    return `Words: ${w.length}
Unique words: ${unique.length}
Potentially difficult words: ${hard.length}

REVIEW LIST
${hard.map((x) => `\u2022 ${x} (${syllables(x)} syllables)`).join("\n") || "No obviously difficult words detected."}

Keep technical terms when they are precise; explain them at first use.`;
  }
  if (t === "essay") return `TITLE
${a}

THESIS
${b}

I. INTRODUCTION
\u2022 Context and importance
\u2022 Define the central problem
\u2022 Present the thesis

II. BODY 1 \u2014 First reason
\u2022 Claim
\u2022 Evidence or example
\u2022 Link to thesis

III. BODY 2 \u2014 Second reason
\u2022 Claim
\u2022 Evidence or example
\u2022 Address a limitation

IV. BODY 3 \u2014 Implications
\u2022 Practical effect
\u2022 Counterargument and response

V. CONCLUSION
\u2022 Synthesize the argument
\u2022 Restate significance
\u2022 End with a forward-looking insight`;
  if (t === "schedule") {
    const subjects = a.split("\n").map((x) => {
      const [n, h] = x.split(":");
      return { name: n.trim(), hours: num(h) };
    }).filter((x) => x.name), [days, hpd] = b.match(/[\d.]+/g)?.map(Number) || [7, 2], total = subjects.reduce((s, x) => s + x.hours, 0), sessions = [];
    for (let d = 1; d <= days; d++) {
      const sub = subjects[(d - 1) % subjects.length];
      sessions.push(`Day ${d}: ${sub.name} \u2014 ${Math.min(hpd, sub.hours).toFixed(1)}h \xB7 ${d % 7 === 0 ? "weekly review" : "practice + recall"}`);
    }
    return `Workload: ${total} hours \xB7 Capacity: ${days * hpd} hours
Status: ${days * hpd >= total ? "Capacity covers the estimate." : "Add days/hours or reduce scope."}

${sessions.join("\n")}`;
  }
  if (t === "study-hours") {
    const [days, confidence] = b.split("\n").map(num), daily = num(a) / Math.max(1, days) * (1 + (100 - confidence) / 100);
    return `Recommended daily study: ${daily.toFixed(1)} hours
Weekly target: ${(daily * 7).toFixed(1)} hours
30-minute sessions: ${Math.ceil(daily * 2)} per day
Reserve the final 20% of available days for practice and revision.`;
  }
  if (t === "countdown") {
    const exam = new Date(a), today = /* @__PURE__ */ new Date(), left = Math.max(0, Math.ceil((+exam - +today) / 864e5)), subs = b.split(",").map((x) => x.trim());
    return `Exam: ${exam.toLocaleDateString(void 0, { dateStyle: "full" })}
Days remaining: ${left}

PHASE 1 \u2014 Learn and organize (${Math.round(left * 0.5)} days)
${subs.map((x) => `\u2022 ${x}: concepts + notes`).join("\n")}

PHASE 2 \u2014 Practice (${Math.round(left * 0.3)} days)
\u2022 Timed problems and past questions

PHASE 3 \u2014 Final revision (${Math.max(1, Math.round(left * 0.2))} days)
\u2022 Error log, recall and sleep protection`;
  }
  if (t === "flashcards") {
    return a.split("\n").map((x, i) => {
      const [q, ...rest] = x.split(":");
      return `CARD ${i + 1}
FRONT: ${q.trim()}
BACK: ${rest.join(":").trim()}`;
    }).join("\n\n");
  }
  if (t === "quiz") {
    const pairs = a.split("\n").map((x) => x.split(":")).filter((x) => x.length > 1), count = Math.min(num(b) || pairs.length, pairs.length * 2);
    const qs = [];
    for (let i = 0; i < count; i++) {
      const p = pairs[i % pairs.length], term = p[0].trim(), def = p.slice(1).join(":").trim();
      qs.push(i % 2 === 0 ? `${i + 1}. Define ${term}.` : `${i + 1}. Which term matches this description? \u201C${def}\u201D`);
    }
    return `QUIZ
${qs.join("\n")}

ANSWER KEY
${qs.map((_, i) => `${i + 1}. ${pairs[i % pairs.length][i % 2 === 0 ? 1 : 0].trim()}`).join("\n")}`;
  }
  if (t === "question-paper") {
    const [subject, ...topics] = a.split("\n"), [marks, duration] = b.split("\n").map(num), topicList = topics.join(",").split(",").map((x) => x.trim()).filter(Boolean);
    const short = Math.round(marks * 0.3), long = marks - short;
    return `${subject.toUpperCase()}
Time: ${duration} minutes \xB7 Total marks: ${marks}

Instructions: Answer all questions. Show reasoning where applicable.

SECTION A \u2014 Short answer (${short} marks)
${topicList.map((x, i) => `${i + 1}. Explain ${x} with one practical example. [${Math.max(2, Math.floor(short / topicList.length))}]`).join("\n")}

SECTION B \u2014 Applied questions (${long} marks)
1. Compare and connect two major ideas from the syllabus. [${Math.round(long / 2)}]
2. Analyze a realistic scenario using the course concepts. [${long - Math.round(long / 2)}]

Teacher review required before use.`;
  }
  const [secondsLine, ...typedLines] = b.split("\n"), typed = typedLines.join("\n"), seconds = Math.max(1, num(secondsLine)), refWords = words(a), typedWords = words(typed);
  let correct = 0;
  typedWords.forEach((x, i) => {
    if (x === refWords[i]) correct++;
  });
  return `Gross speed: ${(typedWords.length / (seconds / 60)).toFixed(1)} WPM
Accuracy: ${typedWords.length ? correct / typedWords.length * 100 : 0}%
Net speed: ${(correct / (seconds / 60)).toFixed(1)} WPM
Typed words: ${typedWords.length}
Elapsed: ${seconds} seconds`;
}
var calculateEducationTool = (tool, a, b) => run(tool, a, b);

export {
  EducationToolsStudio,
  calculateEducationTool
};
