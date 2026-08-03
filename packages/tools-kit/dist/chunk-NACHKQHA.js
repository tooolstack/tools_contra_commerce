// src/components/CareerToolsStudio.tsx
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var tools = [{ id: "resume-bullets", name: "Resume Bullet Generator", group: "Applications", help: "Turn responsibilities into outcome-focused r\xE9sum\xE9 bullets." }, { id: "ats", name: "ATS Resume Checker", group: "Applications", help: "Compare r\xE9sum\xE9 text with a job description and flag structural risks." }, { id: "cover-letter", name: "Cover Letter Generator", group: "Applications", help: "Create a focused application letter from real evidence." }, { id: "gap", name: "Employment Gap Explainer", group: "Applications", help: "Write an honest, concise explanation without oversharing." }, { id: "interview", name: "Interview Question Generator", group: "Interview", help: "Create role-specific behavioral, technical and situational questions." }, { id: "salary", name: "Salary Comparison Calculator", group: "Compare", help: "Normalize monthly and annual compensation plus benefits." }, { id: "job-offer", name: "Job Offer Comparison Tool", group: "Compare", help: "Compare salary, tax, rent, commute, benefits and career growth." }, { id: "career-matrix", name: "Career Decision Matrix", group: "Compare", help: "Rank career paths using weighted priorities." }, { id: "freelance", name: "Freelance Hourly Rate Calculator", group: "Plan", help: "Calculate a sustainable minimum and quote rate." }, { id: "notice", name: "Notice Period Calculator", group: "Plan", help: "Estimate a final working day and handover checkpoints." }, { id: "linkedin", name: "LinkedIn Headline Generator", group: "Brand", help: "Generate keyword-rich headlines within LinkedIn\u2019s limit." }, { id: "bio", name: "Professional Bio Generator", group: "Brand", help: "Create short, medium and speaker-style bios." }];
var defaults = {
  "resume-bullets": ["Managed Facebook advertising campaigns for an online store\nPrepared weekly performance reports\nCoordinated designers and copywriters", "Revenue increased 28%; CPA decreased 17%; managed \u09F32M annual spend"],
  ats: ["ASIF KHAN NIROB\nE-commerce Growth Specialist\nExperience\nManaged paid social campaigns and improved conversion rates.\nSkills: Meta Ads, Google Analytics, Excel", "We need an E-commerce Growth Manager with Meta Ads, GA4, conversion optimization, reporting, stakeholder management and experimentation experience."],
  "cover-letter": ["E-commerce Growth Manager at Example Ltd.", "I improved campaign revenue by 28%, reduced CPA by 17%, and built weekly reporting used by leadership.\nThe company is expanding its digital commerce operation."],
  interview: ["E-commerce Growth Manager", "Meta Ads, analytics, experimentation, leadership"],
  salary: ["120000,10000,5000", "135000,5000,12000"],
  freelance: ["1800000,300000,20", "25,46"],
  notice: ["2026-08-02", "30"],
  "job-offer": ["Offer A,120000,10,18000,6000,10000,8\nOffer B,140000,15,26000,3000,6000,6", "Salary, tax %, rent, commute, monthly benefits, growth score /10"],
  "career-matrix": ["Agency role: 8,7,9,6\nIn-house role: 7,9,7,9\nFreelancing: 9,6,8,8", "Income:4, Stability:5, Learning:4, Flexibility:3"],
  linkedin: ["E-commerce growth specialist", "Meta Ads, conversion optimization, analytics\nHelping online brands grow profitably"],
  bio: ["Asif Khan Nirob", "E-commerce growth specialist\n5 years\nPaid media, analytics and conversion optimization\nImproved campaign revenue by 28%\nHelping practical businesses grow profitably"],
  gap: ["2024-01 to 2024-09", "Family responsibilities\nCompleted analytics training and freelance projects\nNow ready for a full-time growth role"]
};
var c = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var btn = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white";
var num = (x) => Number(x) || 0;
var cash = (x) => `\u09F3${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(x)}`;
function CareerToolsStudio() {
  const [active, setActive] = useState("resume-bullets");
  const [a, setA] = useState(defaults[active][0]);
  const [b, setB] = useState(defaults[active][1]);
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
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-teal-600", children: "12 career utilities" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold", children: "Career & Job Tools" })
      ] }),
      groups.map((g) => /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: g }),
        tools.filter((x) => x.group === g).map((x) => /* @__PURE__ */ jsx("button", { onClick: () => choose(x.id), className: `mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${active === x.id ? "bg-gray-950 font-semibold text-white" : "text-gray-700 hover:bg-gray-100"}`, children: x.name }, x.id))
      ] }, g))
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border bg-gradient-to-r from-teal-50 to-emerald-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-teal-700", children: "Career & Job Tools" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold", children: selected.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: selected.help })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][0] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: active === "ats" ? 13 : 8, value: a, onChange: (e) => setA(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: labels[active][1] }),
            /* @__PURE__ */ jsx("textarea", { className: c, rows: active === "ats" ? 10 : 6, value: b, onChange: (e) => setB(e.target.value) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: "Generated writing must remain truthful. Review compensation, tax and employment-law assumptions for your location." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Result" }),
          /* @__PURE__ */ jsx("pre", { className: "max-h-[720px] min-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-gray-950 p-5 text-sm leading-7 text-emerald-300", children: result }),
          /* @__PURE__ */ jsx("button", { className: btn, onClick: () => navigator.clipboard.writeText(result), children: "Copy result" })
        ] })
      ] })
    ] })
  ] });
}
var labels = { "resume-bullets": ["Responsibilities \u2014 one per line", "Real results, scale and metrics"], "ats": ["R\xE9sum\xE9 text", "Job description"], "cover-letter": ["Role and company", "Evidence, then company motivation"], interview: ["Target role", "Required skills \u2014 comma-separated"], salary: ["Offer A: monthly salary, benefits, monthly costs", "Offer B: monthly salary, benefits, monthly costs"], freelance: ["Annual income, overhead, tax/reserve %", "Billable hours/week, working weeks/year"], notice: ["Resignation date", "Notice period in calendar days"], "job-offer": ["One offer per line: name, salary, tax %, rent, commute, benefits, growth /10", "Field order"], "career-matrix": ["Options: name: scores", "Criteria: name: weight"], linkedin: ["Professional role", "Skills, then value proposition"], bio: ["Name", "Role, years, expertise, achievement, mission"], gap: ["Gap period", "Reason, productive activity, current readiness"] };
var actionVerbs = ["Led", "Built", "Improved", "Reduced", "Increased", "Delivered", "Coordinated", "Analyzed"];
function run(t, a, b) {
  if (t === "resume-bullets") {
    const metrics = b.split(";").map((x) => x.trim());
    return a.split("\n").filter(Boolean).map((line, i) => `\u2022 ${actionVerbs[i % actionVerbs.length]} ${line.trim().replace(/^(managed|prepared|coordinated|worked on)\s*/i, "").replace(/^./, (x) => x.toLowerCase())}${metrics[i] ? `, resulting in ${metrics[i].replace(/^./, (x) => x.toLowerCase())}` : ""}.`).join("\n") + "\n\nUse only outcomes you can explain and defend in an interview.";
  }
  if (t === "ats") {
    const tokenize = (x) => Array.from(new Set((x.toLowerCase().match(/[a-z][a-z0-9+.#-]{2,}/g) || []).filter((w) => !["with", "and", "the", "for", "that", "this", "from", "need", "experience"].includes(w))));
    const req = tokenize(b), have = new Set(tokenize(a)), matched = req.filter((x) => have.has(x)), missing = req.filter((x) => !have.has(x)), score = req.length ? matched.length / req.length * 100 : 0;
    const issues = [!/@/.test(a) ? "Add a professional email address." : "", !/(experience|employment)/i.test(a) ? "Add a clearly labeled Experience section." : "", !/(skills|technical)/i.test(a) ? "Add a Skills section." : "", a.length < 500 ? "R\xE9sum\xE9 may be too sparse for the target role." : ""].filter(Boolean);
    return `Keyword coverage: ${score.toFixed(0)}%
Matched: ${matched.join(", ") || "None"}
Missing or review: ${missing.slice(0, 30).join(", ") || "None"}

STRUCTURE CHECKS
${issues.length ? issues.map((x) => `\u25B3 ${x}`).join("\n") : "\u2713 Basic text structure detected."}

Do not copy keywords dishonestly. Add relevant terms only where your experience supports them.`;
  }
  if (t === "cover-letter") {
    const [role2, company = "the organization"] = a.split(" at "), [evidence = "", motivation = ""] = b.split("\n");
    return `Dear Hiring Manager,

I am applying for the ${role2} position at ${company}. My experience aligns with the role\u2019s focus on measurable execution and clear decision-making.

In my recent work, ${evidence.replace(/^./, (x) => x.toLowerCase())}. This experience strengthened my ability to connect day-to-day execution with commercial outcomes.

I am particularly interested in ${company} because ${motivation.replace(/^./, (x) => x.toLowerCase())}. I would welcome the opportunity to discuss how my experience could support your team\u2019s priorities.

Sincerely,
[Your name]`;
  }
  if (t === "gap") {
    const [reason = "", activity = "", ready = ""] = b.split("\n");
    return `CONCISE VERSION
From ${a}, I stepped away from full-time employment due to ${reason.toLowerCase()}. During that period, I ${activity.replace(/^./, (x) => x.toLowerCase())}. ${ready}.

INTERVIEW VERSION
\u201CI had a planned employment gap from ${a} because of ${reason.toLowerCase()}. I used the period productively by ${activity.replace(/^./, (x) => x.toLowerCase())}. The situation is now resolved, and ${ready.replace(/^./, (x) => x.toLowerCase())}. I\u2019m happy to focus on how my experience fits this role.\u201D

Keep the explanation truthful, brief and forward-looking.`;
  }
  if (t === "interview") {
    const skills = b.split(",").map((x) => x.trim()).filter(Boolean);
    return `${a.toUpperCase()} \u2014 INTERVIEW PRACTICE

BEHAVIORAL
1. Tell me about a result you achieved with limited time or resources.
2. Describe a decision that did not work and what you changed.
3. How do you align stakeholders with different priorities?

ROLE-SPECIFIC
${skills.map((x, i) => `${i + 1}. How have you used ${x} to produce a measurable outcome?`).join("\n")}

SITUATIONAL
1. What would you assess during your first 30 days?
2. How would you prioritize competing urgent requests?
3. Which metrics would you report to leadership, and why?

QUESTIONS TO ASK
\u2022 What does success look like after six months?
\u2022 Which constraint most limits the team today?
\u2022 How are priorities and performance evaluated?`;
  }
  if (t === "salary") {
    const x = a.split(",").map(num), y = b.split(",").map(num), annual = (z) => z[0] * 12 + z[1] * 12 - z[2] * 12;
    return `OFFER A
Annual cash value after entered costs: ${cash(annual(x))}
Monthly adjusted value: ${cash(annual(x) / 12)}

OFFER B
Annual cash value after entered costs: ${cash(annual(y))}
Monthly adjusted value: ${cash(annual(y) / 12)}

Difference: ${cash(Math.abs(annual(x) - annual(y)))} per year
Stronger entered cash value: ${annual(x) === annual(y) ? "Equal" : annual(x) > annual(y) ? "Offer A" : "Offer B"}`;
  }
  if (t === "freelance") {
    const [income, over, tax] = a.split(",").map(num), [hours, weeks] = b.split(",").map(num), required = (income + over) / (1 - tax / 100), rate = required / (hours * weeks);
    return `Minimum sustainable rate: ${cash(rate)}/hour
Recommended quote rate (+20%): ${cash(rate * 1.2)}/hour
Half day: ${cash(rate * 4)}
Full day: ${cash(rate * 8)}
Required annual revenue: ${cash(required)}
Billable hours/year: ${hours * weeks}`;
  }
  if (t === "notice") {
    const start = new Date(a), end = new Date(start);
    end.setDate(end.getDate() + num(b));
    const checkpoints = [0.25, 0.5, 0.75, 1].map((p) => {
      const d = new Date(start);
      d.setDate(d.getDate() + Math.round(num(b) * p));
      return `${Math.round(p * 100)}% \u2014 ${d.toLocaleDateString()}`;
    });
    return `Resignation date: ${start.toLocaleDateString()}
Notice period: ${b} calendar days
Estimated final working day: ${end.toLocaleDateString(void 0, { dateStyle: "full" })}

HANDOVER CHECKPOINTS
${checkpoints.join("\n")}

Confirm whether the contract counts the resignation date, weekends, holidays and approved leave.`;
  }
  if (t === "job-offer") {
    const offers = a.split("\n").map((line) => {
      const [name, salary, tax, rent, commute, benefits, growth] = line.split(",").map((x) => x.trim());
      const monthly = num(salary) * (1 - num(tax) / 100) - num(rent) - num(commute) + num(benefits), score = monthly * 12 + num(growth) * 5e4;
      return { name, monthly, annual: monthly * 12, growth: num(growth), score };
    }).sort((x, y) => y.score - x.score);
    return `COMPARISON
${offers.map((x, i) => `${i + 1}. ${x.name}
   Adjusted monthly cash: ${cash(x.monthly)}
   Adjusted annual cash: ${cash(x.annual)}
   Growth score: ${x.growth}/10
   Planning score: ${cash(x.score)}`).join("\n\n")}

The planning score values each growth point at \u09F350,000/year. Change the decision if your personal value differs. Also compare stability, manager quality, leave, flexibility and role scope.`;
  }
  if (t === "career-matrix") {
    const criteria = b.split(",").map((x) => {
      const [n, w] = x.split(":");
      return { name: n.trim(), weight: num(w) };
    });
    const options = a.split("\n").map((line) => {
      const [n, s] = line.split(":");
      const scores = s.split(",").map(num);
      return { name: n.trim(), total: scores.reduce((z, x, i) => z + x * (criteria[i]?.weight || 1), 0), scores };
    }).sort((x, y) => y.total - x.total);
    return `WEIGHTS
${criteria.map((x) => `${x.name}: ${x.weight}`).join("\n")}

RANKING
${options.map((x, i) => `${i + 1}. ${x.name} \u2014 ${x.total}
   ${x.scores.join(", ")}`).join("\n")}`;
  }
  if (t === "linkedin") {
    const [skills = "", value = ""] = b.split("\n");
    const variants = [`${a} | ${skills} | ${value}`, `${a} helping brands ${value.replace(/^helping\s*/i, "")} | ${skills}`, `${skills} specialist | ${a} | ${value}`];
    return variants.map((x, i) => `OPTION ${i + 1} (${x.length}/220)
${x}`).join("\n\n");
  }
  const [role = "", years = "", expertise = "", achievement = "", mission = ""] = b.split("\n");
  return `SHORT BIO
${a} is a ${role.toLowerCase()} specializing in ${expertise}. ${achievement}.

PROFESSIONAL BIO
${a} is a ${role.toLowerCase()} with ${years} of experience in ${expertise}. ${achievement}. Their work focuses on ${mission.replace(/^helping\s*/i, "helping ")}.

SPEAKER BIO
${a} helps teams turn ${expertise} into practical commercial results. With ${years} of experience, ${a.split(" ")[0]} has ${achievement.replace(/^./, (x) => x.toLowerCase())}. ${mission}.`;
}
var calculateCareerTool = (tool, a, b) => run(tool, a, b);

export {
  CareerToolsStudio,
  calculateCareerTool
};
