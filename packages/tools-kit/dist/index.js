import {
  EducationToolsStudio
} from "./chunk-KIGX4WCE.js";
import {
  CareerToolsStudio
} from "./chunk-NACHKQHA.js";
import {
  HealthToolsStudio
} from "./chunk-6ABWRWQD.js";
import {
  TravelToolsStudio
} from "./chunk-HTI2FT5G.js";
import {
  CreatorToolsStudio
} from "./chunk-26BNT446.js";
import {
  TextUtilityStudio
} from "./chunk-5L6APR4Q.js";
import {
  HomeToolsStudio
} from "./chunk-EMQ6JDTS.js";
import {
  calcProfit
} from "./chunk-RVPDTR44.js";
import {
  ImageToolsStudio
} from "./chunk-MJTHEUXP.js";
import {
  DeveloperToolsStudio
} from "./chunk-46GKPOUS.js";
import {
  WebsiteSeoStudio
} from "./chunk-5SY22ODC.js";
import {
  CalculatorShell,
  CopyField,
  CtaCard,
  DropdownControl,
  InputCard,
  NumberField,
  OutputBox,
  Panel,
  ResultHero,
  ResultsColumn,
  SelectField,
  Stat,
  StatGrid,
  TextArea,
  TextField,
  bdt,
  dec,
  num,
  pct,
  useResultTracking
} from "./chunk-NCBI5OCB.js";
import {
  CalculatorToolsStudio
} from "./chunk-YWTWSC5T.js";
import {
  ProductivityToolsStudio
} from "./chunk-BFKKSNYC.js";

// src/components/ProfitCalculator.tsx
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var COST_FIELDS = [
  { key: "productCost", label: "Product cost", suffix: "\u09F3" },
  { key: "sellingPrice", label: "Selling price", suffix: "\u09F3" },
  { key: "adCostPerOrder", label: "Ad cost per order", suffix: "\u09F3" },
  { key: "forwardCharge", label: "Delivery charge (courier)", suffix: "\u09F3" },
  { key: "returnCharge", label: "Return charge (courier)", suffix: "\u09F3" },
  { key: "packagingCost", label: "Packaging cost", suffix: "\u09F3" }
];
var PROJECTION_FIELDS = [
  { key: "returnRatePct", label: "Return rate", suffix: "%" },
  { key: "monthlyOrders", label: "Monthly total orders (optional)" }
];
var DEFAULTS = {
  productCost: 300,
  sellingPrice: 800,
  adCostPerOrder: 120,
  forwardCharge: 70,
  returnCharge: 70,
  packagingCost: 20,
  codChargePct: 1,
  codChargeMode: "percentage",
  codChargeFixed: 10,
  returnRatePct: 20,
  monthlyOrders: 500,
  productRecoveredOnReturn: true
};
function ProfitCalculator({
  brand = "Contra Commerce",
  ctaText = "Auto-calculate profit for every order",
  ctaUrl = "#",
  className = "",
  onResult
}) {
  const [values, setValues] = useState(() => {
    const init = {};
    for (const f of [...COST_FIELDS, ...PROJECTION_FIELDS]) {
      init[f.key] = String(DEFAULTS[f.key] ?? "");
    }
    return init;
  });
  const [codChargeMode, setCodChargeMode] = useState("percentage");
  const [codChargePct, setCodChargePct] = useState(String(DEFAULTS.codChargePct));
  const [codChargeFixed, setCodChargeFixed] = useState(String(DEFAULTS.codChargeFixed));
  const [productRecoveredOnReturn, setProductRecoveredOnReturn] = useState(true);
  const input3 = useMemo(() => {
    const num2 = (k) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    const monthly = Number.parseFloat(values.monthlyOrders);
    return {
      productCost: num2("productCost"),
      sellingPrice: num2("sellingPrice"),
      adCostPerOrder: num2("adCostPerOrder"),
      forwardCharge: num2("forwardCharge"),
      returnCharge: num2("returnCharge"),
      packagingCost: num2("packagingCost"),
      codChargePct: Number.parseFloat(codChargePct) || 0,
      codChargeMode,
      codChargeFixed: Number.parseFloat(codChargeFixed) || 0,
      returnRatePct: num2("returnRatePct"),
      monthlyOrders: Number.isFinite(monthly) && monthly > 0 ? monthly : void 0,
      productRecoveredOnReturn
    };
  }, [
    values,
    codChargeMode,
    codChargePct,
    codChargeFixed,
    productRecoveredOnReturn
  ]);
  const result = useMemo(() => calcProfit(input3), [input3]);
  useEffect(() => {
    onResult?.(result, input3);
  }, [result, input3, onResult]);
  useResultTracking("profit-calculator", input3);
  const profitPositive = result.netProfitPerDelivered >= 0;
  const set = (k, v) => setValues((prev) => ({ ...prev, [k]: v }));
  return /* @__PURE__ */ jsxs(CalculatorShell, { className, children: [
    /* @__PURE__ */ jsxs(InputCard, { children: [
      COST_FIELDS.map((f) => /* @__PURE__ */ jsx(
        NumberField,
        {
          label: f.label,
          suffix: f.suffix,
          value: values[f.key],
          min: 0,
          onChange: (v) => set(f.key, v)
        },
        f.key
      )),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-gray-50 p-3", children: [
        /* @__PURE__ */ jsx(
          SelectField,
          {
            label: "COD charge type",
            value: codChargeMode,
            options: [
              { value: "percentage", label: "Percentage of collected amount (%)" },
              { value: "fixed", label: "Fixed amount per delivered order (\u09F3)" }
            ],
            onChange: (v) => setCodChargeMode(v)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
          NumberField,
          {
            label: codChargeMode === "percentage" ? "COD charge rate" : "Fixed COD charge",
            suffix: codChargeMode === "percentage" ? "%" : "\u09F3",
            value: codChargeMode === "percentage" ? codChargePct : codChargeFixed,
            min: 0,
            onChange: codChargeMode === "percentage" ? setCodChargePct : setCodChargeFixed
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs leading-relaxed text-gray-500", children: "Charged only on delivered orders where payment is collected." })
      ] }),
      PROJECTION_FIELDS.map((f) => /* @__PURE__ */ jsx(
        NumberField,
        {
          label: f.label,
          suffix: f.suffix,
          value: values[f.key],
          min: 0,
          max: f.key === "returnRatePct" ? 100 : void 0,
          onChange: (v) => set(f.key, v)
        },
        f.key
      )),
      /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: productRecoveredOnReturn,
            onChange: (e) => setProductRecoveredOnReturn(e.target.checked),
            className: "mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          }
        ),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-sm font-medium text-gray-800", children: "Returned product can be resold" }),
          /* @__PURE__ */ jsx("span", { className: "mt-0.5 block text-xs leading-relaxed text-gray-500", children: "Turn this off for damaged, perishable, or otherwise unsellable returns." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(ResultsColumn, { children: [
      /* @__PURE__ */ jsx(
        ResultHero,
        {
          label: "Real profit per delivered order",
          value: bdt(result.netProfitPerDelivered),
          positive: profitPositive,
          sub: `Margin ${result.profitMarginPct.toFixed(1)}% \xB7 Delivery rate ${(result.deliveryRate * 100).toFixed(0)}%`
        }
      ),
      /* @__PURE__ */ jsxs(StatGrid, { children: [
        /* @__PURE__ */ jsx(Stat, { label: "Break-even selling price", value: bdt(result.breakEvenPrice) }),
        /* @__PURE__ */ jsx(Stat, { label: "Max acceptable ad cost / order", value: bdt(result.maxAdCostPerOrder) }),
        /* @__PURE__ */ jsx(Stat, { label: "Loss per return", value: bdt(result.returnLossPerReturned) }),
        result.monthly && /* @__PURE__ */ jsx(
          Stat,
          {
            label: "Monthly loss from returns",
            value: bdt(result.monthly.returnLoss),
            tone: "red"
          }
        )
      ] }),
      result.monthly && /* @__PURE__ */ jsx(
        Panel,
        {
          label: "Monthly net profit (est.)",
          value: bdt(result.monthly.netProfit),
          sub: `${result.monthly.deliveredOrders} delivered \xB7 ${result.monthly.returnedOrders} returned`
        }
      ),
      /* @__PURE__ */ jsx(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/AdsBreakeven.tsx
import { useEffect as useEffect2, useMemo as useMemo2, useState as useState2 } from "react";

// src/logic/ads-breakeven.ts
var money = (n4) => Math.round(n4 * 100) / 100;
var nonNegative = (n4) => Number.isFinite(n4) ? Math.max(0, n4) : 0;
function clamp01(n4) {
  if (Number.isNaN(n4)) return 0;
  return Math.min(1, Math.max(0, n4));
}
function calcAdsBreakeven(input3) {
  const {
    sellingPrice,
    productCost,
    fulfillmentCost,
    returnRatePct,
    returnCostPerReturn,
    currentCpp,
    dailyAdBudget
  } = input3;
  const safeSellingPrice = nonNegative(sellingPrice);
  const safeProductCost = nonNegative(productCost);
  const safeFulfillmentCost = nonNegative(fulfillmentCost);
  const safeReturnCost = nonNegative(returnCostPerReturn);
  const safeCurrentCpp = currentCpp == null ? void 0 : nonNegative(currentCpp);
  const safeDailyAdBudget = dailyAdBudget == null ? void 0 : nonNegative(dailyAdBudget);
  const r = clamp01(returnRatePct / 100);
  const d = 1 - r;
  const marginPerDelivered = safeSellingPrice - safeProductCost - safeFulfillmentCost;
  const maxCpp = d * marginPerDelivered - r * safeReturnCost;
  const breakEvenRoas = maxCpp > 0 ? safeSellingPrice / maxCpp : Number.POSITIVE_INFINITY;
  const result = {
    marginPerDelivered: money(marginPerDelivered),
    maxCpp: money(maxCpp),
    breakEvenRoas: money(breakEvenRoas)
  };
  if (safeDailyAdBudget && safeDailyAdBudget > 0 && maxCpp > 0) {
    result.breakEvenSalesPerDay = Math.ceil(safeDailyAdBudget / maxCpp);
  }
  if (safeCurrentCpp && safeCurrentCpp > 0) {
    const reportedRoas = safeSellingPrice / safeCurrentCpp;
    const profitPerOrder = maxCpp - safeCurrentCpp;
    const breakEvenTolerance = 0.01;
    const verdict = Math.abs(profitPerOrder) <= breakEvenTolerance ? "break_even" : profitPerOrder < 0 ? "stop" : safeCurrentCpp <= maxCpp * 0.8 ? "keep_running" : "optimize";
    result.current = {
      profitPerOrder: money(profitPerOrder),
      reportedRoas: money(reportedRoas),
      actualRoas: money(d * reportedRoas),
      profitable: profitPerOrder > 0,
      verdict
    };
  }
  return result;
}

// src/components/AdsBreakeven.tsx
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var FIELDS = [
  { key: "sellingPrice", label: "Selling price", suffix: "\u09F3" },
  { key: "productCost", label: "Product cost", suffix: "\u09F3" },
  { key: "fulfillmentCost", label: "Fulfillment cost / order", suffix: "\u09F3" },
  {
    key: "returnRatePct",
    label: "Return rate",
    suffix: "%",
    max: 100,
    help: "Enter a value from 0% to 100%."
  },
  { key: "returnCostPerReturn", label: "Cost per return", suffix: "\u09F3" },
  {
    key: "currentCpp",
    label: "Current cost / purchase (optional)",
    suffix: "\u09F3",
    help: "Add this to see actual ROAS, profit per order, and campaign verdict."
  },
  {
    key: "dailyAdBudget",
    label: "Daily ad budget (optional)",
    suffix: "\u09F3",
    help: "Add this to see the purchases/orders needed per day."
  }
];
var DEFAULTS2 = {
  sellingPrice: 800,
  productCost: 300,
  fulfillmentCost: 110,
  returnRatePct: 20,
  returnCostPerReturn: 90,
  currentCpp: 150,
  dailyAdBudget: 5e3
};
var roas = (n4) => Number.isFinite(n4) ? `${dec(n4, 2)}x` : "\u2014";
var VERDICT = {
  keep_running: {
    stat: "Keep running",
    heading: "Campaign has a healthy profit buffer",
    tone: "emerald"
  },
  optimize: {
    stat: "Optimize",
    heading: "Profitable, but close to break-even",
    tone: "default"
  },
  break_even: {
    stat: "Break-even",
    heading: "Campaign is at break-even",
    tone: "default"
  },
  stop: {
    stat: "Stop ads",
    heading: "Stop or fix before spending more",
    tone: "red"
  }
};
function AdsBreakeven({
  brand = "Contra Commerce",
  ctaText = "Track real ROAS after returns in Contra Commerce",
  ctaUrl = "#",
  className = "",
  onResult
}) {
  const [values, setValues] = useState2(() => {
    const init = {};
    for (const f of FIELDS) init[f.key] = String(DEFAULTS2[f.key]);
    return init;
  });
  const input3 = useMemo2(() => {
    const n4 = (k) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    const cpp = Number.parseFloat(values.currentCpp);
    const budget = Number.parseFloat(values.dailyAdBudget);
    return {
      sellingPrice: n4("sellingPrice"),
      productCost: n4("productCost"),
      fulfillmentCost: n4("fulfillmentCost"),
      returnRatePct: n4("returnRatePct"),
      returnCostPerReturn: n4("returnCostPerReturn"),
      currentCpp: Number.isFinite(cpp) && cpp > 0 ? cpp : void 0,
      dailyAdBudget: Number.isFinite(budget) && budget > 0 ? budget : void 0
    };
  }, [values]);
  const result = useMemo2(() => calcAdsBreakeven(input3), [input3]);
  useEffect2(() => onResult?.(result, input3), [result, input3, onResult]);
  useResultTracking("ads-breakeven", input3);
  const set = (k, v) => {
    let next = v;
    const parsed = Number.parseFloat(v);
    if (Number.isFinite(parsed)) {
      if (parsed < 0) next = "0";
      if (k === "returnRatePct" && parsed > 100) next = "100";
    }
    setValues((p) => ({ ...p, [k]: next }));
  };
  const viable = result.maxCpp > 0;
  const currentVerdict = result.current ? VERDICT[result.current.verdict] : void 0;
  return /* @__PURE__ */ jsxs2(CalculatorShell, { className, children: [
    /* @__PURE__ */ jsx2(InputCard, { children: FIELDS.map((f) => /* @__PURE__ */ jsxs2("div", { children: [
      /* @__PURE__ */ jsx2(
        NumberField,
        {
          label: f.label,
          suffix: f.suffix,
          value: values[f.key],
          min: 0,
          max: f.max,
          onChange: (v) => set(f.key, v)
        }
      ),
      f.help && /* @__PURE__ */ jsx2("p", { className: "mt-1 text-right text-xs text-gray-500", children: f.help })
    ] }, f.key)) }),
    /* @__PURE__ */ jsxs2(ResultsColumn, { children: [
      /* @__PURE__ */ jsx2(
        ResultHero,
        {
          label: "Max cost per purchase (break-even)",
          value: bdt(result.maxCpp),
          positive: viable,
          sub: `Break-even ROAS ${roas(result.breakEvenRoas)} \xB7 margin/order ${bdt(
            result.marginPerDelivered
          )}`
        }
      ),
      result.breakEvenSalesPerDay != null && /* @__PURE__ */ jsx2(
        Panel,
        {
          label: "Purchases/day needed to break even",
          value: `${result.breakEvenSalesPerDay} orders placed/day`,
          sub: "Facebook purchases (orders placed), not delivered orders. Expected return losses are already included in the break-even CPP."
        }
      ),
      result.current && /* @__PURE__ */ jsxs2(Fragment, { children: [
        /* @__PURE__ */ jsxs2(StatGrid, { children: [
          /* @__PURE__ */ jsx2(
            Stat,
            {
              label: "Profit / order at current CPP",
              value: bdt(result.current.profitPerOrder),
              tone: result.current.profitable ? "emerald" : "red"
            }
          ),
          /* @__PURE__ */ jsx2(Stat, { label: "Actual ROAS (after returns)", value: roas(result.current.actualRoas) }),
          /* @__PURE__ */ jsx2(Stat, { label: "Reported ROAS", value: roas(result.current.reportedRoas) }),
          /* @__PURE__ */ jsx2(
            Stat,
            {
              label: "Verdict",
              value: currentVerdict?.stat ?? "\u2014",
              tone: currentVerdict?.tone
            }
          )
        ] }),
        /* @__PURE__ */ jsx2(
          Panel,
          {
            label: currentVerdict?.heading ?? "Campaign verdict",
            value: result.current.profitPerOrder > 0 ? `${bdt(result.current.profitPerOrder)} profit per order` : result.current.profitPerOrder < 0 ? `${bdt(-result.current.profitPerOrder)} loss per order` : "\u09F30 profit per order",
            sub: result.current.verdict === "keep_running" ? `Keep monitoring and keep CPP below ${bdt(result.maxCpp)}.` : result.current.verdict === "optimize" ? `Reduce CPP to build a safer buffer; ${bdt(result.maxCpp)} is the hard ceiling.` : result.current.verdict === "break_even" ? `Any sustained CPP above ${bdt(result.maxCpp)} will move the campaign into loss.` : `Current CPP is above the ${bdt(result.maxCpp)} break-even ceiling.`
          }
        )
      ] }),
      /* @__PURE__ */ jsx2(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/CbmCalculator.tsx
import { useEffect as useEffect3, useMemo as useMemo3, useState as useState3 } from "react";

// src/logic/cbm.ts
var money2 = (n4) => Math.round(n4 * 100) / 100;
var cbm4 = (n4) => Math.round(n4 * 1e4) / 1e4;
function calcCbm(input3) {
  const {
    productPrice,
    exchangeRate,
    quantity,
    unitsPerCarton,
    cartonLengthCm,
    cartonWidthCm,
    cartonHeightCm,
    shippingRatePerCbm,
    extraCost,
    wholesaleMarkupPct = 30,
    retailMarkupPct = 80
  } = input3;
  const cartons = unitsPerCarton > 0 ? Math.ceil(quantity / unitsPerCarton) : 0;
  const cbmPerCarton = cartonLengthCm * cartonWidthCm * cartonHeightCm / 1e6;
  const totalCbm = cbmPerCarton * cartons;
  const goodsCostBdt = productPrice * exchangeRate * quantity;
  const shippingCostBdt = totalCbm * shippingRatePerCbm;
  const totalLandedCostBdt = goodsCostBdt + shippingCostBdt + extraCost;
  const perUnitLandedCostBdt = quantity > 0 ? totalLandedCostBdt / quantity : 0;
  return {
    cartons,
    cbmPerCarton: cbm4(cbmPerCarton),
    totalCbm: cbm4(totalCbm),
    goodsCostBdt: money2(goodsCostBdt),
    shippingCostBdt: money2(shippingCostBdt),
    totalLandedCostBdt: money2(totalLandedCostBdt),
    perUnitLandedCostBdt: money2(perUnitLandedCostBdt),
    suggestedWholesale: money2(perUnitLandedCostBdt * (1 + wholesaleMarkupPct / 100)),
    suggestedRetail: money2(perUnitLandedCostBdt * (1 + retailMarkupPct / 100))
  };
}

// src/components/CbmCalculator.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var FIELDS2 = [
  { key: "productPrice", label: "Unit price (foreign)", suffix: "\xA5/$" },
  { key: "exchangeRate", label: "Exchange rate \u2192 \u09F3", suffix: "\u09F3" },
  { key: "quantity", label: "Total quantity", suffix: "pcs" },
  { key: "unitsPerCarton", label: "Units per carton", suffix: "pcs" },
  { key: "cartonLengthCm", label: "Carton length", suffix: "cm" },
  { key: "cartonWidthCm", label: "Carton width", suffix: "cm" },
  { key: "cartonHeightCm", label: "Carton height", suffix: "cm" },
  { key: "shippingRatePerCbm", label: "Freight rate / CBM", suffix: "\u09F3" },
  { key: "extraCost", label: "Customs + agent (total)", suffix: "\u09F3" }
];
var DEFAULTS3 = {
  productPrice: 10,
  exchangeRate: 17,
  quantity: 1e3,
  unitsPerCarton: 50,
  cartonLengthCm: 60,
  cartonWidthCm: 40,
  cartonHeightCm: 50,
  shippingRatePerCbm: 8e3,
  extraCost: 2e4,
  wholesaleMarkupPct: 30,
  retailMarkupPct: 80
};
function CbmCalculator({
  brand = "Contra Commerce",
  ctaText = "Manage import costs & pricing in Contra Commerce",
  ctaUrl = "#",
  className = "",
  onResult
}) {
  const [values, setValues] = useState3(() => {
    const init = {};
    for (const f of FIELDS2) init[f.key] = String(DEFAULTS3[f.key]);
    return init;
  });
  const input3 = useMemo3(() => {
    const n4 = (k) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      productPrice: n4("productPrice"),
      exchangeRate: n4("exchangeRate"),
      quantity: n4("quantity"),
      unitsPerCarton: n4("unitsPerCarton"),
      cartonLengthCm: n4("cartonLengthCm"),
      cartonWidthCm: n4("cartonWidthCm"),
      cartonHeightCm: n4("cartonHeightCm"),
      shippingRatePerCbm: n4("shippingRatePerCbm"),
      extraCost: n4("extraCost")
    };
  }, [values]);
  const result = useMemo3(() => calcCbm(input3), [input3]);
  useEffect3(() => onResult?.(result, input3), [result, input3, onResult]);
  useResultTracking("cbm-calculator", input3);
  const set = (k, v) => setValues((p) => ({ ...p, [k]: v }));
  return /* @__PURE__ */ jsxs3(CalculatorShell, { className, children: [
    /* @__PURE__ */ jsx3(InputCard, { children: FIELDS2.map((f) => /* @__PURE__ */ jsx3(
      NumberField,
      {
        label: f.label,
        suffix: f.suffix,
        value: values[f.key],
        onChange: (v) => set(f.key, v)
      },
      f.key
    )) }),
    /* @__PURE__ */ jsxs3(ResultsColumn, { children: [
      /* @__PURE__ */ jsx3(
        ResultHero,
        {
          label: "Per-piece landed cost",
          value: bdt(result.perUnitLandedCostBdt),
          sub: `Total landed ${bdt(result.totalLandedCostBdt)} \xB7 ${result.cartons} cartons`
        }
      ),
      /* @__PURE__ */ jsxs3(StatGrid, { children: [
        /* @__PURE__ */ jsx3(Stat, { label: "Total CBM", value: `${dec(result.totalCbm, 3)} m\xB3` }),
        /* @__PURE__ */ jsx3(Stat, { label: "Freight cost", value: bdt(result.shippingCostBdt) }),
        /* @__PURE__ */ jsx3(Stat, { label: "Goods cost", value: bdt(result.goodsCostBdt) }),
        /* @__PURE__ */ jsx3(Stat, { label: "CBM / carton", value: `${dec(result.cbmPerCarton, 3)} m\xB3` })
      ] }),
      /* @__PURE__ */ jsx3(
        Panel,
        {
          label: "Suggested selling prices",
          value: `${bdt(result.suggestedWholesale)} \u2014 ${bdt(result.suggestedRetail)}`,
          sub: "Wholesale (+30%) \u2192 Retail (+80%) on landed cost"
        }
      ),
      /* @__PURE__ */ jsx3(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/ReturnLossCalculator.tsx
import { useEffect as useEffect4, useMemo as useMemo4, useState as useState4 } from "react";

// src/logic/return-loss.ts
var money3 = (n4) => Math.round(n4 * 100) / 100;
var nonNegative2 = (n4) => Number.isFinite(n4) ? Math.max(0, n4) : 0;
function clamp012(n4) {
  if (Number.isNaN(n4)) return 0;
  return Math.min(1, Math.max(0, n4));
}
function calcReturnLoss(input3) {
  const {
    monthlyParcels,
    successRatePct,
    forwardCharge,
    returnCharge,
    packagingCost,
    improvementPct = 5
  } = input3;
  const safeMonthlyParcels = nonNegative2(monthlyParcels);
  const safeForwardCharge = nonNegative2(forwardCharge);
  const safeReturnCharge = nonNegative2(returnCharge);
  const safePackagingCost = nonNegative2(packagingCost);
  const safeImprovementPct = nonNegative2(improvementPct);
  const successRate = clamp012(successRatePct / 100);
  const r = 1 - successRate;
  const returnedParcels = safeMonthlyParcels * r;
  const lossPerReturn = safeForwardCharge + safeReturnCharge + safePackagingCost;
  const monthlyLoss = returnedParcels * lossPerReturn;
  const points = clamp012(safeImprovementPct / 100);
  const parcelsSaved = safeMonthlyParcels * Math.min(points, r);
  const monthlySaving = parcelsSaved * lossPerReturn;
  return {
    returnRatePct: money3(r * 100),
    returnedParcels: Math.round(returnedParcels),
    lossPerReturn: money3(lossPerReturn),
    monthlyLoss: money3(monthlyLoss),
    yearlyLoss: money3(monthlyLoss * 12),
    improvement: {
      points: safeImprovementPct,
      monthlySaving: money3(monthlySaving),
      yearlySaving: money3(monthlySaving * 12)
    }
  };
}

// src/components/ReturnLossCalculator.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var FIELDS3 = [
  { key: "monthlyParcels", label: "Monthly parcels", suffix: "pcs", step: 1 },
  {
    key: "successRatePct",
    label: "Delivery success rate",
    suffix: "%",
    max: 100,
    help: "Enter a value from 0% to 100%."
  },
  { key: "forwardCharge", label: "Forward charge", suffix: "\u09F3" },
  { key: "returnCharge", label: "Return charge", suffix: "\u09F3" },
  { key: "packagingCost", label: "Packaging cost", suffix: "\u09F3" }
];
var DEFAULTS4 = {
  monthlyParcels: 1e3,
  successRatePct: 80,
  forwardCharge: 70,
  returnCharge: 70,
  packagingCost: 20,
  improvementPct: 5
};
function ReturnLossCalculator({
  brand = "Contra Commerce",
  ctaText = "Cut returns with order verification in Contra Commerce",
  ctaUrl = "#",
  className = "",
  onResult
}) {
  const [values, setValues] = useState4(() => {
    const init = {};
    for (const f of FIELDS3) init[f.key] = String(DEFAULTS4[f.key]);
    return init;
  });
  const input3 = useMemo4(() => {
    const n4 = (k) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      monthlyParcels: n4("monthlyParcels"),
      successRatePct: n4("successRatePct"),
      forwardCharge: n4("forwardCharge"),
      returnCharge: n4("returnCharge"),
      packagingCost: n4("packagingCost")
    };
  }, [values]);
  const result = useMemo4(() => calcReturnLoss(input3), [input3]);
  useEffect4(() => onResult?.(result, input3), [result, input3, onResult]);
  useResultTracking("return-loss", input3);
  const set = (k, v) => {
    let next = v;
    const parsed = Number.parseFloat(v);
    if (Number.isFinite(parsed)) {
      if (parsed < 0) next = "0";
      if (k === "successRatePct" && parsed > 100) next = "100";
    }
    setValues((p) => ({ ...p, [k]: next }));
  };
  return /* @__PURE__ */ jsxs4(CalculatorShell, { className, children: [
    /* @__PURE__ */ jsx4(InputCard, { children: FIELDS3.map((f) => /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4(
        NumberField,
        {
          label: f.label,
          suffix: f.suffix,
          value: values[f.key],
          min: 0,
          max: f.max,
          step: f.step,
          onChange: (v) => set(f.key, v)
        }
      ),
      f.help && /* @__PURE__ */ jsx4("p", { className: "mt-1 text-right text-xs text-gray-500", children: f.help })
    ] }, f.key)) }),
    /* @__PURE__ */ jsxs4(ResultsColumn, { children: [
      /* @__PURE__ */ jsx4(
        ResultHero,
        {
          label: "Yearly loss from returns",
          value: bdt(result.yearlyLoss),
          positive: false,
          sub: `${bdt(result.monthlyLoss)} / month \xB7 ${result.returnedParcels} returns / month`
        }
      ),
      /* @__PURE__ */ jsxs4(StatGrid, { children: [
        /* @__PURE__ */ jsx4(Stat, { label: "Return rate", value: `${result.returnRatePct.toFixed(0)}%`, tone: "red" }),
        /* @__PURE__ */ jsx4(Stat, { label: "Loss per return", value: bdt(result.lossPerReturn) }),
        /* @__PURE__ */ jsx4(Stat, { label: "Returned parcels / mo", value: String(result.returnedParcels) }),
        /* @__PURE__ */ jsx4(Stat, { label: "Monthly loss", value: bdt(result.monthlyLoss), tone: "red" })
      ] }),
      /* @__PURE__ */ jsx4(
        Panel,
        {
          label: `If success rate improves by up to ${result.improvement.points} percentage points`,
          value: `${bdt(result.improvement.yearlySaving)} saved / year`,
          sub: `${bdt(result.improvement.monthlySaving)} back in your pocket every month`
        }
      ),
      /* @__PURE__ */ jsx4(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/SellingPriceCalculator.tsx
import { useEffect as useEffect5, useMemo as useMemo5, useState as useState5 } from "react";

// src/logic/selling-price.ts
var money4 = (n4) => Math.round(n4 * 100) / 100;
var nonNegative3 = (n4) => Number.isFinite(n4) ? Math.max(0, n4) : 0;
var margin = (n4) => Math.min(99.9, nonNegative3(n4));
function calcSellingPrice(input3) {
  const {
    productCost,
    overheadPct,
    targetMarginPct,
    vatPct = 0,
    wholesaleMarginPct = 15,
    retailMarginPct = 50
  } = input3;
  const safeProductCost = nonNegative3(productCost);
  const safeOverheadPct = nonNegative3(overheadPct);
  const safeTargetMarginPct = margin(targetMarginPct);
  const safeVatPct = nonNegative3(vatPct);
  const safeWholesaleMarkupPct = nonNegative3(wholesaleMarginPct);
  const safeRetailMarginPct = margin(retailMarginPct);
  const vat = 1 + safeVatPct / 100;
  const operatingCostAmount = safeProductCost * (safeOverheadPct / 100);
  const costWithOverhead = safeProductCost + operatingCostAmount;
  const breakEvenPrice = costWithOverhead * vat;
  const marginFactor = 1 - safeTargetMarginPct / 100;
  const targetPrice = costWithOverhead / marginFactor * vat;
  const retailFactor = 1 - safeRetailMarginPct / 100;
  const retailPrice = costWithOverhead / retailFactor * vat;
  const wholesalePrice = costWithOverhead * (1 + safeWholesaleMarkupPct / 100) * vat;
  const targetPriceExVat = targetPrice / vat;
  const vatAmount = targetPrice - targetPriceExVat;
  const profitAtTarget = targetPriceExVat - costWithOverhead;
  const maxDiscountPct = targetPrice > 0 && Number.isFinite(targetPrice) ? (targetPrice - breakEvenPrice) / targetPrice * 100 : 0;
  return {
    operatingCostAmount: money4(operatingCostAmount),
    costWithOverhead: money4(costWithOverhead),
    breakEvenPrice: money4(breakEvenPrice),
    targetPrice: money4(targetPrice),
    retailPrice: money4(retailPrice),
    wholesalePrice: money4(wholesalePrice),
    vatAmount: money4(vatAmount),
    targetPriceExVat: money4(targetPriceExVat),
    profitAtTarget: money4(profitAtTarget),
    maxDiscountPct: money4(maxDiscountPct)
  };
}

// src/components/SellingPriceCalculator.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var FIELDS4 = [
  { key: "productCost", label: "Product cost", suffix: "\u09F3" },
  {
    key: "overheadPct",
    label: "Operating cost",
    suffix: "%",
    help: "Added as a percentage of product cost."
  },
  {
    key: "targetMarginPct",
    label: "Target profit margin",
    suffix: "%",
    max: 99.9,
    help: "Profit as a percentage of the final selling price (0\u201399.9%)."
  },
  {
    key: "wholesaleMarginPct",
    label: "Wholesale markup",
    suffix: "%",
    help: "Amount added on top of product + operating cost."
  },
  {
    key: "retailMarginPct",
    label: "Retail (MRP) profit margin",
    suffix: "%",
    max: 99.9,
    help: "Profit as a percentage of the retail selling price (0\u201399.9%)."
  },
  {
    key: "vatPct",
    label: "VAT (optional)",
    suffix: "%",
    help: "Added on top and shown separately in the breakdown."
  }
];
var DEFAULTS5 = {
  productCost: 300,
  overheadPct: 10,
  targetMarginPct: 30,
  retailMarginPct: 50,
  vatPct: 0,
  wholesaleMarginPct: 15
};
function SellingPriceCalculator({
  brand = "Contra Commerce",
  ctaText = "Set prices & track margins live in Contra Commerce",
  ctaUrl = "#",
  className = "",
  onResult
}) {
  const [values, setValues] = useState5(() => {
    const init = {};
    for (const f of FIELDS4) init[f.key] = String(DEFAULTS5[f.key]);
    return init;
  });
  const input3 = useMemo5(() => {
    const n4 = (k) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      productCost: n4("productCost"),
      overheadPct: n4("overheadPct"),
      targetMarginPct: n4("targetMarginPct"),
      retailMarginPct: n4("retailMarginPct"),
      vatPct: n4("vatPct"),
      wholesaleMarginPct: n4("wholesaleMarginPct")
    };
  }, [values]);
  const result = useMemo5(() => calcSellingPrice(input3), [input3]);
  useEffect5(() => onResult?.(result, input3), [result, input3, onResult]);
  useResultTracking("selling-price", input3);
  const set = (k, v) => {
    let next = v;
    const parsed = Number.parseFloat(v);
    if (Number.isFinite(parsed)) {
      if (parsed < 0) next = "0";
      if ((k === "targetMarginPct" || k === "retailMarginPct") && parsed >= 100) {
        next = "99.9";
      }
    }
    setValues((p) => ({ ...p, [k]: next }));
  };
  return /* @__PURE__ */ jsxs5(CalculatorShell, { className, children: [
    /* @__PURE__ */ jsx5(InputCard, { children: FIELDS4.map((f) => /* @__PURE__ */ jsxs5("div", { children: [
      /* @__PURE__ */ jsx5(
        NumberField,
        {
          label: f.label,
          suffix: f.suffix,
          value: values[f.key],
          min: 0,
          max: f.max,
          onChange: (v) => set(f.key, v)
        }
      ),
      f.help && /* @__PURE__ */ jsx5("p", { className: "mt-1 text-right text-xs text-gray-500", children: f.help })
    ] }, f.key)) }),
    /* @__PURE__ */ jsxs5(ResultsColumn, { children: [
      /* @__PURE__ */ jsx5(
        ResultHero,
        {
          label: "Recommended selling price",
          value: bdt(result.targetPrice),
          sub: `${bdt(result.profitAtTarget)} profit per unit at your target margin`
        }
      ),
      /* @__PURE__ */ jsxs5(StatGrid, { children: [
        /* @__PURE__ */ jsx5(Stat, { label: "Break-even (minimum)", value: bdt(result.breakEvenPrice) }),
        /* @__PURE__ */ jsx5(Stat, { label: "Wholesale price", value: bdt(result.wholesalePrice) }),
        /* @__PURE__ */ jsx5(Stat, { label: "Retail (MRP) price", value: bdt(result.retailPrice) }),
        /* @__PURE__ */ jsx5(Stat, { label: "Max safe discount", value: `${result.maxDiscountPct.toFixed(0)}%`, tone: "emerald" })
      ] }),
      /* @__PURE__ */ jsx5(OutputBox, { title: "VAT & operating cost breakdown", children: /* @__PURE__ */ jsxs5("dl", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsx5("dt", { className: "text-gray-500", children: "Product cost" }),
          /* @__PURE__ */ jsx5("dd", { className: "font-medium text-gray-900", children: bdt(input3.productCost) })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs5("dt", { className: "text-gray-500", children: [
            "Operating cost (",
            input3.overheadPct,
            "%)"
          ] }),
          /* @__PURE__ */ jsx5("dd", { className: "font-medium text-gray-900", children: bdt(result.operatingCostAmount) })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between gap-3 border-t border-gray-100 pt-2", children: [
          /* @__PURE__ */ jsx5("dt", { className: "text-gray-600", children: "Cost including operations" }),
          /* @__PURE__ */ jsx5("dd", { className: "font-semibold text-gray-900", children: bdt(result.costWithOverhead) })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsx5("dt", { className: "text-gray-500", children: "Target price before VAT" }),
          /* @__PURE__ */ jsx5("dd", { className: "font-medium text-gray-900", children: bdt(result.targetPriceExVat) })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs5("dt", { className: "text-gray-500", children: [
            "VAT (",
            input3.vatPct ?? 0,
            "%)"
          ] }),
          /* @__PURE__ */ jsx5("dd", { className: "font-medium text-gray-900", children: bdt(result.vatAmount) })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between gap-3 border-t border-gray-100 pt-2", children: [
          /* @__PURE__ */ jsx5("dt", { className: "font-medium text-gray-700", children: "Final target price including VAT" }),
          /* @__PURE__ */ jsx5("dd", { className: "text-base font-bold text-gray-900", children: bdt(result.targetPrice) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx5(
        Panel,
        {
          label: "Never sell below",
          value: bdt(result.breakEvenPrice),
          sub: `Margin is profit \xF7 selling price. Markup is profit \xF7 cost. You can discount up to ${result.maxDiscountPct.toFixed(0)}% before losing money.`
        }
      ),
      /* @__PURE__ */ jsx5(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/DiscountCalculator.tsx
import { useEffect as useEffect6, useMemo as useMemo6, useState as useState6 } from "react";

// src/logic/discount.ts
var money5 = (n4) => Math.round(n4 * 100) / 100;
var nonNegative4 = (n4) => Number.isFinite(n4) ? Math.max(0, n4) : 0;
var discountPct = (n4) => Math.min(100, nonNegative4(n4));
var bundleQty = (n4) => Math.max(1, Math.floor(Number.isFinite(n4) ? n4 : 1));
var statusFor = (profit) => Math.abs(profit) < 5e-3 ? "break_even" : profit > 0 ? "profit" : "loss";
function row(regularPrice, productCost, pct2) {
  const safePct = discountPct(pct2);
  const price = regularPrice * (1 - safePct / 100);
  const profit = price - productCost;
  const status = statusFor(profit);
  return {
    discountPct: safePct,
    price: money5(price),
    profit: money5(profit),
    marginPct: price > 0 ? money5(profit / price * 100) : 0,
    profitable: status === "profit",
    status
  };
}
function bundle(regularPrice, productCost, buyQty, freeQty) {
  const itemsGiven = buyQty + freeQty;
  const customerPays = buyQty * regularPrice;
  const totalCost = itemsGiven * productCost;
  const profit = customerPays - totalCost;
  const status = statusFor(profit);
  return {
    buyQty,
    freeQty,
    itemsGiven,
    customerPays: money5(customerPays),
    totalCost: money5(totalCost),
    profit: money5(profit),
    profitable: status === "profit",
    status,
    effectiveDiscountPct: itemsGiven > 0 ? money5(freeQty / itemsGiven * 100) : 0,
    perUnitPrice: itemsGiven > 0 ? money5(customerPays / itemsGiven) : 0
  };
}
function calcDiscount(input3) {
  const {
    regularPrice,
    discountPct: discountPct2,
    productCost,
    additionalCostPerUnit = 0,
    bundleBuyQty = 2,
    bundleFreeQty = 1,
    comparePcts = [20, 30, 40]
  } = input3;
  const safeRegularPrice = nonNegative4(regularPrice);
  const totalUnitCost = nonNegative4(productCost) + nonNegative4(additionalCostPerUnit);
  const safeBuyQty = bundleQty(bundleBuyQty);
  const safeFreeQty = bundleQty(bundleFreeQty);
  const main = row(safeRegularPrice, totalUnitCost, discountPct2);
  return {
    totalUnitCost: money5(totalUnitCost),
    discountedPrice: main.price,
    savedAmount: money5(safeRegularPrice - main.price),
    profitAfterDiscount: main.profit,
    profitMarginPct: main.marginPct,
    profitable: main.profitable,
    status: main.status,
    bundle: bundle(
      safeRegularPrice,
      totalUnitCost,
      safeBuyQty,
      safeFreeQty
    ),
    comparisons: comparePcts.map((p) => row(safeRegularPrice, totalUnitCost, p))
  };
}

// src/components/DiscountCalculator.tsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var FIELDS5 = [
  { key: "regularPrice", label: "Regular price", suffix: "\u09F3" },
  {
    key: "discountPct",
    label: "Discount",
    suffix: "%",
    max: 100,
    help: "Enter a value from 0% to 100%."
  },
  { key: "productCost", label: "Product cost", suffix: "\u09F3" },
  {
    key: "additionalCostPerUnit",
    label: "Other cost per item",
    suffix: "\u09F3",
    help: "Packaging + fulfillment + operating cost for each item."
  },
  {
    key: "bundleBuyQty",
    label: "Bundle: Buy",
    suffix: "pcs",
    min: 1,
    step: 1
  },
  {
    key: "bundleFreeQty",
    label: "Bundle: Get free",
    suffix: "pcs",
    min: 1,
    step: 1,
    help: "Whole numbers only. Bundle payment uses regular price; the main discount is not stacked."
  }
];
var DEFAULTS6 = {
  regularPrice: 1e3,
  discountPct: 30,
  productCost: 500,
  additionalCostPerUnit: 0,
  bundleBuyQty: 2,
  bundleFreeQty: 1
};
function DiscountCalculator({
  brand = "Contra Commerce",
  ctaText = "Run profitable campaigns in Contra Commerce",
  ctaUrl = "#",
  className = "",
  onResult
}) {
  const [values, setValues] = useState6(() => {
    const init = {};
    for (const f of FIELDS5) init[f.key] = String(DEFAULTS6[f.key]);
    return init;
  });
  const input3 = useMemo6(() => {
    const n4 = (k) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      regularPrice: n4("regularPrice"),
      discountPct: n4("discountPct"),
      productCost: n4("productCost"),
      additionalCostPerUnit: n4("additionalCostPerUnit"),
      bundleBuyQty: n4("bundleBuyQty"),
      bundleFreeQty: n4("bundleFreeQty")
    };
  }, [values]);
  const result = useMemo6(() => calcDiscount(input3), [input3]);
  useEffect6(() => onResult?.(result, input3), [result, input3, onResult]);
  useResultTracking("discount", input3);
  const set = (k, v) => {
    let next = v;
    const parsed = Number.parseFloat(v);
    if (Number.isFinite(parsed)) {
      if (parsed < 0) next = "0";
      if (k === "discountPct" && parsed > 100) next = "100";
      if (k === "bundleBuyQty" || k === "bundleFreeQty") {
        next = String(Math.max(1, Math.floor(parsed)));
      }
    }
    setValues((p) => ({ ...p, [k]: next }));
  };
  const b = result.bundle;
  const statusLabel = (status) => status === "profit" ? "Profit" : status === "break_even" ? "Break-even" : "Loss";
  const statusTone = (status) => status === "profit" ? "emerald" : status === "loss" ? "red" : "default";
  return /* @__PURE__ */ jsxs6(CalculatorShell, { className, children: [
    /* @__PURE__ */ jsx6(InputCard, { children: FIELDS5.map((f) => /* @__PURE__ */ jsxs6("div", { children: [
      /* @__PURE__ */ jsx6(
        NumberField,
        {
          label: f.label,
          suffix: f.suffix,
          value: values[f.key],
          min: f.min ?? 0,
          max: f.max,
          step: f.step,
          onChange: (v) => set(f.key, v)
        }
      ),
      f.help && /* @__PURE__ */ jsx6("p", { className: "mt-1 text-right text-xs text-gray-500", children: f.help })
    ] }, f.key)) }),
    /* @__PURE__ */ jsxs6(ResultsColumn, { children: [
      /* @__PURE__ */ jsx6(
        ResultHero,
        {
          label: "Discounted price",
          value: bdt(result.discountedPrice),
          positive: result.status === "profit",
          neutral: result.status === "break_even",
          sub: `You save ${bdt(result.savedAmount)} \xB7 ${result.status === "profit" ? "still profitable" : result.status === "break_even" ? "break-even \u2014 no profit, no loss" : "below total cost \u2014 loss!"}`
        }
      ),
      /* @__PURE__ */ jsxs6(StatGrid, { children: [
        /* @__PURE__ */ jsx6(
          Stat,
          {
            label: "Profit after discount",
            value: bdt(result.profitAfterDiscount),
            tone: statusTone(result.status)
          }
        ),
        /* @__PURE__ */ jsx6(Stat, { label: "Margin after discount", value: `${result.profitMarginPct.toFixed(1)}%` }),
        /* @__PURE__ */ jsx6(Stat, { label: "Total cost per item", value: bdt(result.totalUnitCost) }),
        /* @__PURE__ */ jsx6(
          Stat,
          {
            label: "Offer status",
            value: statusLabel(result.status),
            tone: statusTone(result.status)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs6(
        "div",
        {
          className: `rounded-2xl border p-5 ${b.status === "profit" ? "border-emerald-200 bg-emerald-50" : b.status === "break_even" ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`,
          children: [
            /* @__PURE__ */ jsxs6("p", { className: "text-sm text-gray-600", children: [
              "Bundle offer \u2014 Buy ",
              b.buyQty,
              " Get ",
              b.freeQty,
              " Free"
            ] }),
            /* @__PURE__ */ jsx6(
              "p",
              {
                className: `mt-1 text-2xl font-bold ${b.status === "profit" ? "text-emerald-700" : b.status === "break_even" ? "text-amber-700" : "text-red-700"}`,
                children: b.status === "profit" ? `${bdt(b.profit)} profit` : b.status === "break_even" ? "Break-even \u2014 no profit, no loss" : `${bdt(-b.profit)} loss`
              }
            ),
            /* @__PURE__ */ jsxs6("p", { className: "mt-1 text-xs text-gray-500", children: [
              "Customer pays ",
              b.buyQty,
              " \xD7 regular price = ",
              bdt(b.customerPays),
              " for ",
              b.itemsGiven,
              " ",
              "items \xB7 total product + other costs ",
              bdt(b.totalCost),
              " \xB7 \u2248",
              b.effectiveDiscountPct.toFixed(0),
              "% off (",
              bdt(b.perUnitPrice),
              "/item). The main discount is not stacked."
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs6("div", { className: "rounded-2xl border border-gray-200 bg-white p-5", children: [
        /* @__PURE__ */ jsx6("p", { className: "mb-3 text-sm text-gray-600", children: "Compare discounts" }),
        /* @__PURE__ */ jsxs6("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx6("thead", { children: /* @__PURE__ */ jsxs6("tr", { className: "text-left text-xs text-gray-400", children: [
            /* @__PURE__ */ jsx6("th", { className: "pb-2 font-medium", children: "Discount" }),
            /* @__PURE__ */ jsx6("th", { className: "pb-2 text-right font-medium", children: "Price" }),
            /* @__PURE__ */ jsx6("th", { className: "pb-2 text-right font-medium", children: "Margin" }),
            /* @__PURE__ */ jsx6("th", { className: "pb-2 text-right font-medium", children: "Result" })
          ] }) }),
          /* @__PURE__ */ jsx6("tbody", { children: result.comparisons.map((c) => /* @__PURE__ */ jsxs6("tr", { className: "border-t border-gray-100", children: [
            /* @__PURE__ */ jsxs6("td", { className: "py-2 text-gray-700", children: [
              c.discountPct,
              "%"
            ] }),
            /* @__PURE__ */ jsx6("td", { className: "py-2 text-right text-gray-900", children: bdt(c.price) }),
            /* @__PURE__ */ jsxs6("td", { className: "py-2 text-right text-gray-700", children: [
              c.marginPct.toFixed(1),
              "%"
            ] }),
            /* @__PURE__ */ jsx6(
              "td",
              {
                className: `py-2 text-right font-medium ${c.status === "profit" ? "text-emerald-700" : c.status === "loss" ? "text-red-600" : "text-amber-700"}`,
                children: c.status === "profit" ? `Profit ${bdt(c.profit)}` : c.status === "break_even" ? "Break-even" : `Loss ${bdt(-c.profit)}`
              }
            )
          ] }, c.discountPct)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx6(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/DeadStockCalculator.tsx
import { useEffect as useEffect7, useMemo as useMemo7, useState as useState7 } from "react";

// src/logic/dead-stock.ts
var money6 = (n4) => Math.round(n4 * 100) / 100;
function calcDeadStock(input3) {
  const {
    stockQty,
    purchasePrice,
    currentSellingPrice,
    daysHeld,
    monthlyCarryingCostPct,
    bundleSize = 3,
    bundleDiscountPct = 25
  } = input3;
  const tiedCapital = stockQty * purchasePrice;
  const monthlyCarryingCost = tiedCapital * (monthlyCarryingCostPct / 100);
  const carryingCostToDate = monthlyCarryingCost * (daysHeld / 30);
  const marginPerUnit = currentSellingPrice - purchasePrice;
  const maxSafeDiscountPct = currentSellingPrice > 0 && marginPerUnit > 0 ? marginPerUnit / currentSellingPrice * 100 : 0;
  const liquidationPrice = purchasePrice * 0.9;
  const bundlePrice = bundleSize * currentSellingPrice * (1 - bundleDiscountPct / 100);
  const sellNowValue = stockQty * liquidationPrice;
  const waitOneMonthValue = stockQty * currentSellingPrice - monthlyCarryingCost;
  return {
    tiedCapital: money6(tiedCapital),
    monthlyCarryingCost: money6(monthlyCarryingCost),
    carryingCostToDate: money6(carryingCostToDate),
    breakEvenPrice: money6(purchasePrice),
    maxSafeDiscountPct: money6(maxSafeDiscountPct),
    suggestedLiquidationPrice: money6(liquidationPrice),
    costOfWaitingPerMonth: money6(monthlyCarryingCost),
    bundle: {
      size: bundleSize,
      discountPct: bundleDiscountPct,
      price: money6(bundlePrice),
      perUnit: money6(bundleSize > 0 ? bundlePrice / bundleSize : 0)
    },
    comparison: {
      sellNowValue: money6(sellNowValue),
      waitOneMonthValue: money6(waitOneMonthValue),
      sellNowBetter: sellNowValue >= waitOneMonthValue
    }
  };
}

// src/components/DeadStockCalculator.tsx
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var FIELDS6 = [
  { key: "stockQty", label: "Stock quantity", suffix: "pcs" },
  { key: "purchasePrice", label: "Purchase price / unit", suffix: "\u09F3" },
  { key: "currentSellingPrice", label: "Current selling price", suffix: "\u09F3" },
  { key: "daysHeld", label: "Days held", suffix: "days" },
  { key: "monthlyCarryingCostPct", label: "Monthly carrying cost", suffix: "%" },
  { key: "bundleSize", label: "Bundle size", suffix: "pcs" },
  { key: "bundleDiscountPct", label: "Bundle discount", suffix: "%" }
];
var DEFAULTS7 = {
  stockQty: 100,
  purchasePrice: 200,
  currentSellingPrice: 300,
  daysHeld: 60,
  monthlyCarryingCostPct: 3,
  bundleSize: 3,
  bundleDiscountPct: 25
};
function DeadStockCalculator({
  brand = "Contra Commerce",
  ctaText = "Spot & clear dead stock in Contra Commerce",
  ctaUrl = "#",
  className = "",
  onResult
}) {
  const [values, setValues] = useState7(() => {
    const init = {};
    for (const f of FIELDS6) init[f.key] = String(DEFAULTS7[f.key]);
    return init;
  });
  const input3 = useMemo7(() => {
    const n4 = (k) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      stockQty: n4("stockQty"),
      purchasePrice: n4("purchasePrice"),
      currentSellingPrice: n4("currentSellingPrice"),
      daysHeld: n4("daysHeld"),
      monthlyCarryingCostPct: n4("monthlyCarryingCostPct"),
      bundleSize: n4("bundleSize"),
      bundleDiscountPct: n4("bundleDiscountPct")
    };
  }, [values]);
  const result = useMemo7(() => calcDeadStock(input3), [input3]);
  useEffect7(() => onResult?.(result, input3), [result, input3, onResult]);
  useResultTracking("dead-stock", input3);
  const set = (k, v) => setValues((p) => ({ ...p, [k]: v }));
  return /* @__PURE__ */ jsxs7(CalculatorShell, { className, children: [
    /* @__PURE__ */ jsx7(InputCard, { children: FIELDS6.map((f) => /* @__PURE__ */ jsx7(
      NumberField,
      {
        label: f.label,
        suffix: f.suffix,
        value: values[f.key],
        onChange: (v) => set(f.key, v)
      },
      f.key
    )) }),
    /* @__PURE__ */ jsxs7(ResultsColumn, { children: [
      /* @__PURE__ */ jsx7(
        ResultHero,
        {
          label: "Capital tied up in this stock",
          value: bdt(result.tiedCapital),
          positive: false,
          sub: `Costing you ${bdt(result.monthlyCarryingCost)} / month to hold`
        }
      ),
      /* @__PURE__ */ jsxs7(StatGrid, { children: [
        /* @__PURE__ */ jsx7(Stat, { label: "Carrying cost so far", value: bdt(result.carryingCostToDate), tone: "red" }),
        /* @__PURE__ */ jsx7(Stat, { label: "Max safe discount", value: `${result.maxSafeDiscountPct.toFixed(0)}%`, tone: "emerald" }),
        /* @__PURE__ */ jsx7(Stat, { label: "Break-even (sell at cost)", value: bdt(result.breakEvenPrice) }),
        /* @__PURE__ */ jsx7(Stat, { label: "Quick liquidation price", value: bdt(result.suggestedLiquidationPrice) })
      ] }),
      /* @__PURE__ */ jsx7(
        Panel,
        {
          label: `Bundle offer \u2014 ${result.bundle.size} pcs, ${result.bundle.discountPct}% off`,
          value: bdt(result.bundle.price),
          sub: `${bdt(result.bundle.perUnit)} per unit \u2014 bundle to clear stock faster`
        }
      ),
      /* @__PURE__ */ jsxs7("div", { className: "rounded-2xl border border-gray-200 bg-white p-5", children: [
        /* @__PURE__ */ jsx7("p", { className: "mb-3 text-sm text-gray-600", children: "Sell now vs. wait a month" }),
        /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs7("div", { className: `rounded-xl p-3 ${result.comparison.sellNowBetter ? "bg-emerald-50" : "bg-gray-50"}`, children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-500", children: "Sell now (liquidate)" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-lg font-semibold text-gray-900", children: bdt(result.comparison.sellNowValue) })
          ] }),
          /* @__PURE__ */ jsxs7("div", { className: `rounded-xl p-3 ${!result.comparison.sellNowBetter ? "bg-emerald-50" : "bg-gray-50"}`, children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-500", children: "Wait 1 month (full price)" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-lg font-semibold text-gray-900", children: bdt(result.comparison.waitOneMonthValue) })
          ] })
        ] }),
        /* @__PURE__ */ jsx7("p", { className: "mt-2 text-xs text-gray-500", children: result.comparison.sellNowBetter ? "\u2192 Liquidating now recovers more once carrying cost is counted." : "\u2192 Waiting can recover more if you actually sell at full price." })
      ] }),
      /* @__PURE__ */ jsx7(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/SizeRatioCalculator.tsx
import { useEffect as useEffect8, useMemo as useMemo8, useState as useState8 } from "react";
import { AlertTriangle, BarChart3, BadgeCheck, ClipboardList, HelpCircle, PackageCheck, SlidersHorizontal, Sparkles } from "lucide-react";

// src/logic/size-ratio.ts
var SIZE_PRESETS = {
  "men-tshirt": { label: "Men's T-shirt (S\u2013XXL)", ratio: [{ size: "S", weight: 1 }, { size: "M", weight: 3 }, { size: "L", weight: 3 }, { size: "XL", weight: 2 }, { size: "XXL", weight: 1 }] },
  "women-tshirt": { label: "Women's T-shirt (S\u2013XL)", ratio: [{ size: "S", weight: 2 }, { size: "M", weight: 3 }, { size: "L", weight: 3 }, { size: "XL", weight: 2 }] },
  kids: { label: "Kids (2\u20139y)", ratio: [{ size: "2-3y", weight: 2 }, { size: "4-5y", weight: 3 }, { size: "6-7y", weight: 3 }, { size: "8-9y", weight: 2 }] },
  "shoes-men": { label: "Men's shoes (39\u201344)", ratio: [{ size: "39", weight: 1 }, { size: "40", weight: 2 }, { size: "41", weight: 3 }, { size: "42", weight: 3 }, { size: "43", weight: 2 }, { size: "44", weight: 1 }] }
};
var clean = (n4) => Number.isFinite(n4) ? Math.max(0, n4) : 0;
function calcSizeRatio(input3) {
  const totalQty = Math.max(0, Math.floor(clean(input3.totalQty)));
  const ratio = input3.ratio.map((r) => ({ ...r, weight: clean(r.weight) }));
  const sumW = ratio.reduce((s, r) => s + r.weight, 0);
  if (!sumW || !totalQty) return { rows: ratio.map((r) => ({ size: r.size, qty: 0, pct: 0 })), total: 0 };
  const allocated = ratio.map((r, index) => {
    const exact = totalQty * r.weight / sumW;
    return { size: r.size, index, qty: Math.floor(exact), rem: exact - Math.floor(exact) };
  });
  let remaining = totalQty - allocated.reduce((s, r) => s + r.qty, 0);
  [...allocated].sort((a, b) => b.rem - a.rem || a.index - b.index).forEach((r) => {
    if (remaining > 0) {
      r.qty++;
      remaining--;
    }
  });
  const rows = allocated.sort((a, b) => a.index - b.index).map((r) => ({ size: r.size, qty: r.qty, pct: Math.round(r.qty / totalQty * 1e3) / 10 }));
  return { rows, total: rows.reduce((s, r) => s + r.qty, 0) };
}
function calcDemandPlan(input3) {
  const forecastDays = Math.max(1, clean(input3.forecastDays));
  const growth = 1 + Math.max(-100, input3.growthPct || 0) / 100;
  const safety = 1 + clean(input3.safetyPct) / 100;
  const metrics = input3.history.map((h) => {
    const periodDays = Math.max(1, clean(h.periodDays));
    const inStockDays = Math.min(periodDays, Math.max(1, clean(h.inStockDays)));
    const effective = Math.max(0, clean(h.delivered) - clean(h.sizeReturns));
    const forecast = effective / inStockDays * forecastDays * growth * safety;
    const available = clean(h.currentStock) + clean(h.incomingStock);
    const need = Math.max(0, forecast - available);
    const confidence2 = effective >= 50 && inStockDays / periodDays >= 0.8 ? "High" : effective >= 15 && inStockDays / periodDays >= 0.5 ? "Medium" : "Low";
    return { h, effective, forecast, available, need, confidence: confidence2, inStockDays, periodDays };
  });
  const hasNeed = metrics.some((m) => m.need > 0);
  const allocation = calcSizeRatio({ totalQty: input3.totalQty, ratio: metrics.map((m) => ({ size: m.h.size, weight: hasNeed ? m.need : m.effective })) });
  const warnings = [];
  if (!metrics.some((m) => m.effective > 0)) warnings.push("No usable delivered-sales history. Enter data or use a custom ratio.");
  if (metrics.some((m) => m.inStockDays < m.periodDays * 0.5)) warnings.push("Some sizes were in stock for less than half the period; those forecasts have low confidence.");
  if (metrics.some((m) => clean(m.h.sizeReturns) > clean(m.h.delivered))) warnings.push("A size has more size-related returns than delivered units; check the inputs.");
  const rows = allocation.rows.map((a) => {
    const m = metrics.find((x) => x.h.size === a.size);
    return {
      ...a,
      effectiveDemand: m.effective,
      forecastDemand: m.forecast,
      availableStock: m.available,
      netNeed: m.need,
      confidence: m.confidence,
      reason: `${m.effective.toFixed(0)} net delivered across ${m.inStockDays}/${m.periodDays} in-stock days; ${m.available.toFixed(0)} already available.`
    };
  });
  const rank = { Low: 0, Medium: 1, High: 2 };
  const confidence = rows.length ? rows.reduce((lowest, r) => rank[r.confidence] < rank[lowest] ? r.confidence : lowest, "High") : "Low";
  return { rows, total: allocation.total, confidence, warnings };
}

// src/components/SizeRatioCalculator.tsx
import { Fragment as Fragment2, jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var n = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
var inputClass = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
var initialHistory = (preset) => SIZE_PRESETS[preset].ratio.map(({ size }, i) => ({ size, delivered: [12, 36, 40, 24, 10, 6][i] || 10, sizeReturns: i === 1 ? 2 : 1, inStockDays: i === 2 ? 24 : 30, periodDays: 30, currentStock: [3, 7, 5, 4, 2, 1][i] || 2, incomingStock: 0 }));
function SizeRatioCalculator({ brand = "Contra Commerce", ctaText = "Plan your inventory in Contra Commerce", ctaUrl = "#", className = "", onResult }) {
  const [mode, setMode] = useState8("history");
  const [total, setTotal] = useState8("100");
  const [preset, setPreset] = useState8("men-tshirt");
  const [forecastDays, setForecastDays] = useState8("30");
  const [growth, setGrowth] = useState8("0");
  const [safety, setSafety] = useState8("10");
  const [history, setHistory] = useState8(() => initialHistory("men-tshirt"));
  const [custom, setCustom] = useState8(() => SIZE_PRESETS["men-tshirt"].ratio.map((x) => ({ ...x })));
  const changePreset = (value) => {
    setPreset(value);
    setHistory(initialHistory(value));
    setCustom(SIZE_PRESETS[value].ratio.map((x) => ({ ...x })));
  };
  const simple = useMemo8(() => calcSizeRatio({ totalQty: n(total), ratio: mode === "starter" ? SIZE_PRESETS[preset].ratio : custom }), [total, mode, preset, custom]);
  const plan = useMemo8(() => calcDemandPlan({ totalQty: n(total), forecastDays: n(forecastDays), growthPct: n(growth), safetyPct: n(safety), history }), [total, forecastDays, growth, safety, history]);
  const result = mode === "history" ? plan : simple;
  const ratio = mode === "history" ? plan.rows.map((r) => ({ size: r.size, weight: r.netNeed })) : mode === "starter" ? SIZE_PRESETS[preset].ratio : custom;
  useEffect8(() => onResult?.(result, { totalQty: n(total), ratio }), [result, total, ratio, onResult]);
  useResultTracking("size-ratio", { mode, totalQty: n(total), preset, forecastDays: n(forecastDays), growthPct: n(growth), safetyPct: n(safety) });
  const updateHistory = (i, key, value) => setHistory((old) => old.map((row3, index) => index === i ? { ...row3, [key]: key === "size" ? value : n(value) } : row3));
  const confidence = mode === "history" ? plan.confidence : mode === "custom" ? "User-defined" : "Low";
  const tone = confidence === "High" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : confidence === "Medium" || confidence === "User-defined" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-800 border-amber-200";
  return /* @__PURE__ */ jsxs8("div", { className: `space-y-6 ${className}`, children: [
    /* @__PURE__ */ jsx8("section", { className: "rounded-2xl border border-gray-200 bg-white p-2 shadow-sm", children: /* @__PURE__ */ jsx8("div", { className: "grid gap-2 sm:grid-cols-3", children: [
      ["history", "Use sales history", "Best when you have order data"],
      ["custom", "Custom ratio", "Use your own experience"],
      ["starter", "Starter example", "No data \u2014 low confidence"]
    ].map(([id, title2, desc]) => {
      const Icon = id === "history" ? BarChart3 : id === "custom" ? SlidersHorizontal : Sparkles;
      return /* @__PURE__ */ jsxs8("button", { type: "button", onClick: () => setMode(id), className: `rounded-xl border p-4 text-left transition ${mode === id ? "border-gray-950 bg-gray-950 text-white shadow-sm" : "border-transparent text-gray-700 hover:bg-gray-50"}`, children: [
        /* @__PURE__ */ jsxs8("span", { className: "flex items-center gap-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsx8(Icon, { "aria-hidden": "true", className: "h-4 w-4" }),
          title2
        ] }),
        /* @__PURE__ */ jsx8("span", { className: `mt-1 block pl-6 text-xs ${mode === id ? "text-gray-300" : "text-gray-500"}`, children: desc })
      ] }, id);
    }) }) }),
    /* @__PURE__ */ jsxs8("div", { className: "min-w-0 space-y-6", children: [
      /* @__PURE__ */ jsxs8("section", { className: "min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsxs8("div", { className: "mb-5 flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs8("div", { children: [
            /* @__PURE__ */ jsxs8("p", { className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.16em] text-blue-600", children: [
              /* @__PURE__ */ jsx8(ClipboardList, { "aria-hidden": "true", className: "h-4 w-4" }),
              "Recommendation inputs"
            ] }),
            /* @__PURE__ */ jsx8("h2", { className: "mt-1 text-xl font-bold text-gray-950", children: mode === "history" ? "Forecast from real sales" : mode === "custom" ? "Set your size weights" : "Transparent starter example" })
          ] }),
          /* @__PURE__ */ jsxs8("span", { className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tone}`, children: [
            /* @__PURE__ */ jsx8(BadgeCheck, { "aria-hidden": "true", className: "h-3.5 w-3.5" }),
            confidence,
            " confidence"
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx8(Field, { label: "Purchase quantity", value: total, set: setTotal, suffix: "pcs" }),
          /* @__PURE__ */ jsxs8("label", { children: [
            /* @__PURE__ */ jsx8("span", { className: "mb-1.5 block text-sm font-medium text-gray-700", children: "Size set / category" }),
            /* @__PURE__ */ jsx8(DropdownControl, { className: inputClass, ariaLabel: "Size set / category", value: preset, onChange: changePreset, options: Object.entries(SIZE_PRESETS).map(([value, p]) => ({ value, label: p.label })) })
          ] })
        ] }),
        mode === "history" && /* @__PURE__ */ jsxs8(Fragment2, { children: [
          /* @__PURE__ */ jsxs8("div", { className: "mt-5 grid gap-3 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsx8(Field, { label: "Forecast period", value: forecastDays, set: setForecastDays, suffix: "days" }),
            /* @__PURE__ */ jsx8(Field, { label: "Expected growth", value: growth, set: setGrowth, suffix: "%" }),
            /* @__PURE__ */ jsx8(Field, { label: "Safety stock", value: safety, set: setSafety, suffix: "%" })
          ] }),
          /* @__PURE__ */ jsx8("div", { className: "mt-5 overflow-x-auto rounded-xl border border-gray-200", children: /* @__PURE__ */ jsxs8("table", { className: "w-full min-w-[760px] text-sm", children: [
            /* @__PURE__ */ jsx8("thead", { className: "bg-gray-50 text-left text-xs text-gray-500", children: /* @__PURE__ */ jsx8("tr", { children: ["Size", "Delivered", "Size returns", "In-stock days", "Period days", "On hand", "Incoming"].map((x) => /* @__PURE__ */ jsx8("th", { className: "px-3 py-3 font-medium", children: x }, x)) }) }),
            /* @__PURE__ */ jsx8("tbody", { children: history.map((row3, i) => /* @__PURE__ */ jsx8("tr", { className: "border-t border-gray-100", children: ["size", "delivered", "sizeReturns", "inStockDays", "periodDays", "currentStock", "incomingStock"].map((key) => /* @__PURE__ */ jsx8("td", { className: "p-2", children: /* @__PURE__ */ jsx8("input", { "aria-label": `${row3.size} ${key}`, className: `${inputClass} min-w-20 py-1.5`, type: key === "size" ? "text" : "number", min: "0", value: row3[key], onChange: (e) => updateHistory(i, key, e.target.value) }) }, key)) }, row3.size)) })
          ] }) }),
          /* @__PURE__ */ jsx8("p", { className: "mt-3 text-xs leading-5 text-gray-500", children: "Enter delivered units only. \u201CSize returns\u201D means returns caused by incorrect fit\u2014not courier failures or damaged products. In-stock days lets the system estimate demand hidden by stockouts." })
        ] }),
        mode === "custom" && /* @__PURE__ */ jsxs8("div", { className: "mt-5 space-y-2", children: [
          /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-[1fr_130px] gap-3 px-2 text-xs font-medium text-gray-500", children: [
            /* @__PURE__ */ jsx8("span", { children: "Size" }),
            /* @__PURE__ */ jsx8("span", { children: "Demand weight" })
          ] }),
          custom.map((row3, i) => /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-[1fr_130px] gap-3", children: [
            /* @__PURE__ */ jsx8("input", { className: inputClass, value: row3.size, onChange: (e) => setCustom((old) => old.map((x, j) => j === i ? { ...x, size: e.target.value } : x)) }),
            /* @__PURE__ */ jsx8("input", { className: inputClass, type: "number", min: "0", value: row3.weight, onChange: (e) => setCustom((old) => old.map((x, j) => j === i ? { ...x, weight: n(e.target.value) } : x)) })
          ] }, `${row3.size}-${i}`)),
          /* @__PURE__ */ jsx8("p", { className: "pt-2 text-xs text-gray-500", children: "Weights are relative. For example, 1 : 3 : 3 allocates 1/7, 3/7 and 3/7 of the purchase." })
        ] }),
        mode === "starter" && /* @__PURE__ */ jsxs8("div", { className: "mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950", children: [
          /* @__PURE__ */ jsx8(AlertTriangle, { "aria-hidden": "true", className: "mt-0.5 h-5 w-5 shrink-0" }),
          /* @__PURE__ */ jsxs8("p", { children: [
            /* @__PURE__ */ jsx8("b", { children: "Example only\u2014not market research." }),
            " This preset is a neutral starting assumption and is not based on your customers, location or sales history. Use it only when no better data exists, then replace it with actual results."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "min-w-0 space-y-6", children: [
        /* @__PURE__ */ jsxs8("section", { className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6", children: [
          /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs8("div", { children: [
              /* @__PURE__ */ jsxs8("p", { className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.16em] text-gray-500", children: [
                /* @__PURE__ */ jsx8(PackageCheck, { "aria-hidden": "true", className: "h-4 w-4" }),
                "Purchase recommendation"
              ] }),
              /* @__PURE__ */ jsx8("h2", { className: "mt-1 text-xl font-bold text-gray-950", children: "Order by size" })
            ] }),
            /* @__PURE__ */ jsxs8("span", { className: "text-sm font-semibold text-gray-700", children: [
              result.total,
              " pcs total"
            ] })
          ] }),
          plan.warnings.length > 0 && mode === "history" && /* @__PURE__ */ jsx8("div", { className: "mt-4 space-y-2", children: plan.warnings.map((w) => /* @__PURE__ */ jsxs8("p", { className: "flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900", children: [
            /* @__PURE__ */ jsx8(AlertTriangle, { "aria-hidden": "true", className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
            w
          ] }, w)) }),
          /* @__PURE__ */ jsx8("div", { className: "mt-4 overflow-x-auto", children: /* @__PURE__ */ jsxs8("table", { className: "w-full min-w-[390px] text-sm", children: [
            /* @__PURE__ */ jsx8("thead", { children: /* @__PURE__ */ jsxs8("tr", { className: "border-b text-left text-xs text-gray-400", children: [
              /* @__PURE__ */ jsx8("th", { className: "pb-2 font-medium", children: "Size" }),
              mode === "history" && /* @__PURE__ */ jsx8("th", { className: "pb-2 text-right font-medium", children: "Forecast" }),
              /* @__PURE__ */ jsx8("th", { className: "pb-2 text-right font-medium", children: "Order" }),
              /* @__PURE__ */ jsx8("th", { className: "pb-2 text-right font-medium", children: "Share" })
            ] }) }),
            /* @__PURE__ */ jsx8("tbody", { children: result.rows.map((row3) => {
              const detail = mode === "history" ? plan.rows.find((r) => r.size === row3.size) : void 0;
              return /* @__PURE__ */ jsxs8("tr", { className: "border-b border-gray-100", children: [
                /* @__PURE__ */ jsx8("td", { className: "py-3 font-semibold text-gray-800", children: row3.size }),
                detail && /* @__PURE__ */ jsx8("td", { className: "py-3 text-right text-gray-500", children: Math.round(detail.forecastDemand) }),
                /* @__PURE__ */ jsx8("td", { className: "py-3 text-right font-bold text-gray-950", children: row3.qty }),
                /* @__PURE__ */ jsxs8("td", { className: "py-3 text-right text-gray-500", children: [
                  row3.pct,
                  "%"
                ] })
              ] }, row3.size);
            }) })
          ] }) })
        ] }),
        mode === "history" && /* @__PURE__ */ jsxs8("section", { className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6", children: [
          /* @__PURE__ */ jsxs8("h3", { className: "flex items-center gap-2 text-sm font-semibold text-gray-900", children: [
            /* @__PURE__ */ jsx8(HelpCircle, { "aria-hidden": "true", className: "h-4 w-4 text-blue-600" }),
            "Why these quantities?"
          ] }),
          /* @__PURE__ */ jsx8("div", { className: "mt-3 grid gap-3 md:grid-cols-2", children: plan.rows.map((row3) => /* @__PURE__ */ jsxs8("div", { className: "rounded-xl bg-gray-50 p-3", children: [
            /* @__PURE__ */ jsxs8("div", { className: "flex justify-between gap-3", children: [
              /* @__PURE__ */ jsxs8("b", { className: "text-sm", children: [
                row3.size,
                ": ",
                row3.qty,
                " pcs"
              ] }),
              /* @__PURE__ */ jsx8("span", { className: `text-xs font-semibold ${row3.confidence === "High" ? "text-emerald-700" : row3.confidence === "Medium" ? "text-blue-700" : "text-amber-700"}`, children: row3.confidence })
            ] }),
            /* @__PURE__ */ jsxs8("p", { className: "mt-1 text-xs leading-5 text-gray-600", children: [
              row3.reason,
              " Forecast need after stock: ",
              Math.round(row3.netNeed),
              "."
            ] })
          ] }, row3.size)) })
        ] }),
        /* @__PURE__ */ jsx8(CtaCard, { href: ctaUrl, text: ctaText, brand })
      ] })
    ] })
  ] });
}
function Field({ label, value, set, suffix }) {
  return /* @__PURE__ */ jsxs8("label", { children: [
    /* @__PURE__ */ jsx8("span", { className: "mb-1.5 block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsxs8("div", { className: "relative", children: [
      /* @__PURE__ */ jsx8("input", { className: `${inputClass} ${suffix ? "pr-14" : ""}`, type: "number", value, onChange: (e) => set(e.target.value) }),
      suffix && /* @__PURE__ */ jsx8("span", { className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400", children: suffix })
    ] })
  ] });
}

// src/components/CodSettlementCalculator.tsx
import { useEffect as useEffect9, useMemo as useMemo9, useState as useState9 } from "react";

// src/logic/cod-settlement.ts
var money7 = (n4) => Math.round(n4 * 100) / 100;
function parseStatement(text) {
  const t = text || "";
  const num2 = (re) => {
    const m = t.match(re);
    return m ? Number(m[1].replace(/,/g, "")) : void 0;
  };
  const out = {
    totalCollected: num2(/(?:total\s*collected|collected\s*amount|cod\s*collected|total\s*cod)[^\d]*([\d,]+)/i),
    codChargePct: num2(/cod\s*(?:charge|fee|%)[^\d]*([\d.]+)\s*%/i),
    deliveredParcels: num2(/delivered[^\d]*([\d,]+)/i),
    deliveryChargePerParcel: num2(/delivery\s*charge[^\d]*([\d,]+)/i),
    returnedParcels: num2(/return(?:ed)?[^\d]*([\d,]+)/i),
    returnChargePerParcel: num2(/return\s*charge[^\d]*([\d,]+)/i),
    adjustments: num2(/adjust\w*[^\d-]*(-?[\d,]+)/i)
  };
  Object.keys(out).forEach((k) => {
    if (out[k] === void 0 || Number.isNaN(out[k])) delete out[k];
  });
  return out;
}
function calcCodSettlement(input3) {
  const {
    totalCollected,
    codChargePct,
    deliveredParcels,
    deliveryChargePerParcel,
    returnedParcels,
    returnChargePerParcel,
    adjustments
  } = input3;
  const codCharge = totalCollected * (codChargePct / 100);
  const deliveryCharges = deliveredParcels * deliveryChargePerParcel;
  const returnCharges = returnedParcels * returnChargePerParcel;
  const totalDeductions = codCharge + deliveryCharges + returnCharges;
  const netPayable = totalCollected - totalDeductions + adjustments;
  return {
    codCharge: money7(codCharge),
    deliveryCharges: money7(deliveryCharges),
    returnCharges: money7(returnCharges),
    totalDeductions: money7(totalDeductions),
    netPayable: money7(netPayable),
    effectiveChargePct: totalCollected > 0 ? money7(totalDeductions / totalCollected * 100) : 0
  };
}

// src/components/CodSettlementCalculator.tsx
import { jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
var FIELDS7 = [
  { key: "totalCollected", label: "Total COD collected", suffix: "\u09F3" },
  { key: "codChargePct", label: "COD charge", suffix: "%" },
  { key: "deliveredParcels", label: "Delivered parcels", suffix: "pcs" },
  { key: "deliveryChargePerParcel", label: "Delivery charge / parcel", suffix: "\u09F3" },
  { key: "returnedParcels", label: "Returned parcels", suffix: "pcs" },
  { key: "returnChargePerParcel", label: "Return charge / parcel", suffix: "\u09F3" },
  { key: "adjustments", label: "Adjustments (+/\u2212)", suffix: "\u09F3" }
];
var DEFAULTS8 = {
  totalCollected: 1e5,
  codChargePct: 1,
  deliveredParcels: 200,
  deliveryChargePerParcel: 70,
  returnedParcels: 20,
  returnChargePerParcel: 50,
  adjustments: 0
};
function CodSettlementCalculator({
  brand = "Contra Commerce",
  ctaText = "Reconcile every courier payout in Contra Commerce",
  ctaUrl = "#",
  className = "",
  onResult
}) {
  const [values, setValues] = useState9(() => {
    const init = {};
    for (const f of FIELDS7) init[f.key] = String(DEFAULTS8[f.key]);
    return init;
  });
  const input3 = useMemo9(() => {
    const n4 = (k) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      totalCollected: n4("totalCollected"),
      codChargePct: n4("codChargePct"),
      deliveredParcels: n4("deliveredParcels"),
      deliveryChargePerParcel: n4("deliveryChargePerParcel"),
      returnedParcels: n4("returnedParcels"),
      returnChargePerParcel: n4("returnChargePerParcel"),
      adjustments: n4("adjustments")
    };
  }, [values]);
  const result = useMemo9(() => calcCodSettlement(input3), [input3]);
  useEffect9(() => onResult?.(result, input3), [result, input3, onResult]);
  useResultTracking("cod-settlement", input3);
  const set = (k, v) => setValues((p) => ({ ...p, [k]: v }));
  const [paste, setPaste] = useState9("");
  const parseAndFill = () => {
    const parsed = parseStatement(paste);
    setValues((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(parsed)) next[k] = String(v);
      return next;
    });
  };
  return /* @__PURE__ */ jsxs9(CalculatorShell, { className, children: [
    /* @__PURE__ */ jsxs9(InputCard, { children: [
      /* @__PURE__ */ jsxs9("div", { className: "rounded-xl border border-dashed border-gray-300 p-3", children: [
        /* @__PURE__ */ jsx9(
          TextArea,
          {
            label: "Paste your courier statement (optional)",
            value: paste,
            onChange: setPaste,
            rows: 3,
            placeholder: "Paste the statement text \u2014 we'll auto-fill the fields below."
          }
        ),
        /* @__PURE__ */ jsx9(
          "button",
          {
            type: "button",
            onClick: parseAndFill,
            className: "mt-2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-700",
            children: "Auto-fill from statement"
          }
        )
      ] }),
      FIELDS7.map((f) => /* @__PURE__ */ jsx9(
        NumberField,
        {
          label: f.label,
          suffix: f.suffix,
          value: values[f.key],
          onChange: (v) => set(f.key, v)
        },
        f.key
      ))
    ] }),
    /* @__PURE__ */ jsxs9(ResultsColumn, { children: [
      /* @__PURE__ */ jsx9(
        ResultHero,
        {
          label: "You actually receive",
          value: bdt(result.netPayable),
          sub: `After ${bdt(result.totalDeductions)} in charges (${result.effectiveChargePct.toFixed(1)}% of collected)`
        }
      ),
      /* @__PURE__ */ jsxs9(StatGrid, { children: [
        /* @__PURE__ */ jsx9(Stat, { label: "COD charge", value: bdt(result.codCharge), tone: "red" }),
        /* @__PURE__ */ jsx9(Stat, { label: "Delivery charges", value: bdt(result.deliveryCharges), tone: "red" }),
        /* @__PURE__ */ jsx9(Stat, { label: "Return charges", value: bdt(result.returnCharges), tone: "red" }),
        /* @__PURE__ */ jsx9(Stat, { label: "Total deductions", value: bdt(result.totalDeductions), tone: "red" })
      ] }),
      /* @__PURE__ */ jsx9(
        Panel,
        {
          label: "Net payable to you",
          value: bdt(result.netPayable),
          sub: "Check this against what the courier actually deposits."
        }
      ),
      /* @__PURE__ */ jsx9(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/WhatsappLinkGenerator.tsx
import { useEffect as useEffect10, useMemo as useMemo10, useState as useState10 } from "react";
import { ExternalLink, Link2, MessageSquareText } from "lucide-react";

// src/logic/whatsapp-link.ts
function normalizeBdPhone(raw) {
  let digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) digits = digits.slice(1);
  return "880" + digits;
}
function buildWhatsappLink(input3) {
  const { phone, product, price, fields = ["Size", "Color", "Address"] } = input3;
  const normalizedPhone = normalizeBdPhone(phone);
  const valid = /^8801\d{9}$/.test(normalizedPhone);
  const lines2 = [];
  lines2.push(
    `I want to order ${product || "[product]"}${price ? ` (\u09F3${price})` : ""}.`
  );
  for (const f of fields) lines2.push(`${f}: `);
  const message = lines2.join("\n");
  const link = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
  return { normalizedPhone, message, link, valid };
}

// src/components/WhatsappLinkGenerator.tsx
import { jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
function WhatsappLinkGenerator({
  brand = "Contra Commerce",
  ctaText = "Take orders on autopilot with Contra Commerce",
  ctaUrl = "#",
  className = "",
  onResult
}) {
  const [phone, setPhone] = useState10("01712345678");
  const [product, setProduct] = useState10("Premium Polo Shirt");
  const [price, setPrice] = useState10("850");
  const input3 = useMemo10(() => ({ phone, product, price }), [phone, product, price]);
  const result = useMemo10(() => buildWhatsappLink(input3), [input3]);
  useEffect10(() => onResult?.(result, input3), [result, input3, onResult]);
  useResultTracking("whatsapp-link", input3);
  return /* @__PURE__ */ jsxs10("div", { className: `space-y-5 ${className}`, children: [
    /* @__PURE__ */ jsxs10(InputCard, { title: "Order details", children: [
      /* @__PURE__ */ jsxs10("div", { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsx10(TextField, { label: "Your WhatsApp number", value: phone, onChange: setPhone, placeholder: "01712345678" }),
        /* @__PURE__ */ jsx10(TextField, { label: "Product name", value: product, onChange: setProduct, placeholder: "Premium Polo Shirt" }),
        /* @__PURE__ */ jsx10(TextField, { label: "Price (\u09F3)", value: price, onChange: setPrice, placeholder: "850" })
      ] }),
      !result.valid && /* @__PURE__ */ jsx10("p", { className: "mt-3 text-xs text-red-600", children: "That doesn't look like a valid Bangladesh mobile number." })
    ] }),
    /* @__PURE__ */ jsxs10("div", { className: "grid items-stretch gap-5 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs10(OutputBox, { title: /* @__PURE__ */ jsxs10("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx10(Link2, { "aria-hidden": "true", className: "h-4 w-4" }),
        "Your shareable order link"
      ] }), children: [
        /* @__PURE__ */ jsx10(CopyField, { value: result.link }),
        /* @__PURE__ */ jsxs10(
          "a",
          {
            href: result.link,
            target: "_blank",
            rel: "noreferrer",
            "aria-disabled": !result.valid,
            onClick: (event) => {
              if (!result.valid) event.preventDefault();
            },
            className: `mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition ${result.valid ? "bg-ink hover:bg-gray-800" : "cursor-not-allowed bg-gray-400"}`,
            children: [
              "Open in WhatsApp ",
              /* @__PURE__ */ jsx10(ExternalLink, { "aria-hidden": "true", className: "h-4 w-4" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx10(OutputBox, { title: /* @__PURE__ */ jsxs10("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx10(MessageSquareText, { "aria-hidden": "true", className: "h-4 w-4" }),
        "Message preview"
      ] }), children: /* @__PURE__ */ jsx10("pre", { className: "min-h-28 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700", children: result.message }) })
    ] }),
    /* @__PURE__ */ jsx10(CtaCard, { href: ctaUrl, text: ctaText, brand })
  ] });
}

// src/components/InvoiceGenerator.tsx
import { useEffect as useEffect11, useMemo as useMemo11, useRef, useState as useState11 } from "react";

// src/logic/invoice.ts
var money8 = (n4) => Math.round((Number.isFinite(n4) ? n4 : 0) * 100) / 100;
var positive = (n4) => Math.max(0, Number.isFinite(n4) ? Number(n4) : 0);
function calcInvoice(input3) {
  const lines2 = input3.items.map((item) => ({
    ...item,
    qty: positive(item.qty),
    price: positive(item.price),
    total: money8(positive(item.qty) * positive(item.price))
  }));
  const subtotal = money8(lines2.reduce((sum, line) => sum + line.total, 0));
  const requestedDiscount = positive(input3.discount);
  const rawDiscount = input3.discountType === "percent" ? subtotal * Math.min(requestedDiscount, 100) / 100 : requestedDiscount;
  const discount = money8(Math.min(subtotal, rawDiscount));
  const taxableAmount = money8(Math.max(0, subtotal - discount));
  const tax = money8(taxableAmount * Math.min(positive(input3.taxRate), 100) / 100);
  const deliveryCharge = money8(positive(input3.deliveryCharge));
  const grandTotal = money8(taxableAmount + tax + deliveryCharge);
  return {
    lines: lines2,
    subtotal,
    deliveryCharge,
    discount,
    taxableAmount,
    tax,
    grandTotal,
    totalItems: lines2.reduce((sum, line) => sum + line.qty, 0)
  };
}

// src/components/InvoiceGenerator.tsx
import { Fragment as Fragment3, jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
var STORAGE_KEY = "contra-invoice-draft-v3";
var today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var row2 = (name = "", qty = "1", price = "") => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name,
  description: "",
  qty,
  price
});
var initialDraft = () => ({
  business: "Contra Digital",
  businessDetails: "House 57, Road 22, Rupnagar Abashik\nDhaka, Bangladesh\nagencycontradigital@gmail.com",
  customer: "Norvex",
  customerDetails: "Sadelmakaregatan 5\n252 48 Helsingborg, Sweden\nekonomi@norvex.se",
  invoiceNo: "00135",
  issueDate: today(),
  currency: "BDT",
  language: "bn-BD",
  taxLabel: "\u0995\u09B0",
  taxRate: "0",
  delivery: "0",
  discount: "0",
  discountType: "fixed",
  notes: "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B8\u0999\u09CD\u0997\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964",
  terms: "\u0989\u09B2\u09CD\u09B2\u09BF\u0996\u09BF\u09A4 \u09A4\u09BE\u09B0\u09BF\u0996\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09B8\u0999\u09CD\u0997\u09C7 \u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8 \u09A8\u09AE\u09CD\u09AC\u09B0\u099F\u09BF \u0989\u09B2\u09CD\u09B2\u09C7\u0996 \u0995\u09B0\u09C1\u09A8\u0964",
  payment: "\u09AC\u09CD\u09AF\u09BE\u0982\u0995, \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u0993\u09AF\u09BC\u09BE\u09B2\u09C7\u099F \u0985\u09A5\u09AC\u09BE \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09A8\u09BE \u098F\u0996\u09BE\u09A8\u09C7 \u09B2\u09BF\u0996\u09C1\u09A8\u0964",
  accent: "#b7965a",
  template: "editorial",
  logo: "",
  documentTitle: "\u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8",
  font: "sans",
  logoSize: "64",
  showSignature: true,
  paperSize: "A4",
  rows: [row2("Preem Website Development", "1", "400")]
});
var currencies = ["BDT", "USD", "EUR", "GBP", "SEK", "INR", "CAD", "AUD", "JPY", "AED"];
var tabs = ["Details", "Parties", "Items", "Payment", "Design"];
var bnText = {
  Details: "\u09AC\u09BF\u09AC\u09B0\u09A3",
  Parties: "\u09AA\u0995\u09CD\u09B7\u09B8\u09AE\u09C2\u09B9",
  Items: "\u09AA\u09A3\u09CD\u09AF/\u09B8\u09C7\u09AC\u09BE",
  Payment: "\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F",
  Design: "\u09A1\u09BF\u099C\u09BE\u0987\u09A8",
  "Invoice number": "\u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8 \u09A8\u09AE\u09CD\u09AC\u09B0",
  Currency: "\u09AE\u09C1\u09A6\u09CD\u09B0\u09BE",
  "Invoice date": "\u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8\u09C7\u09B0 \u09A4\u09BE\u09B0\u09BF\u0996",
  Language: "\u09AD\u09BE\u09B7\u09BE",
  "Your business / name": "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE / \u09A8\u09BE\u09AE",
  "Your address, email, tax ID": "\u0986\u09AA\u09A8\u09BE\u09B0 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE, \u0987\u09AE\u09C7\u0987\u09B2 \u0993 \u099F\u09CD\u09AF\u09BE\u0995\u09CD\u09B8 \u0986\u0987\u09A1\u09BF",
  "Client / company": "\u0995\u09CD\u09B0\u09C7\u09A4\u09BE / \u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8",
  "Client address and contact": "\u0995\u09CD\u09B0\u09C7\u09A4\u09BE\u09B0 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE \u0993 \u09AF\u09CB\u0997\u09BE\u09AF\u09CB\u0997",
  Name: "\u09A8\u09BE\u09AE",
  "Description (optional)": "\u09AC\u09BF\u09AC\u09B0\u09A3 (\u0990\u099A\u09CD\u099B\u09BF\u0995)",
  Quantity: "\u09AA\u09B0\u09BF\u09AE\u09BE\u09A3",
  Rate: "\u09A6\u09B0",
  Remove: "\u09AE\u09C1\u099B\u09C1\u09A8",
  "Add line item": "\u09A8\u09A4\u09C1\u09A8 \u0986\u0987\u099F\u09C7\u09AE \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8",
  "Discount type": "\u099B\u09BE\u09A1\u09BC\u09C7\u09B0 \u09A7\u09B0\u09A8",
  fixed: "\u09A8\u09BF\u09B0\u09CD\u09A6\u09BF\u09B7\u09CD\u099F",
  percent: "\u09B6\u09A4\u09BE\u0982\u09B6",
  Discount: "\u099B\u09BE\u09A1\u09BC",
  "Tax label": "\u0995\u09B0\u09C7\u09B0 \u09A8\u09BE\u09AE",
  "Tax rate": "\u0995\u09B0\u09C7\u09B0 \u09B9\u09BE\u09B0",
  "Shipping / delivery": "\u09B6\u09BF\u09AA\u09BF\u0982 / \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF",
  "Payment details": "\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09A4\u09A5\u09CD\u09AF",
  Notes: "\u09A8\u09CB\u099F",
  Terms: "\u09B6\u09B0\u09CD\u09A4\u09BE\u09AC\u09B2\u09BF",
  "Design preset": "\u09A1\u09BF\u099C\u09BE\u0987\u09A8 \u09A7\u09B0\u09A8",
  "Document title": "\u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09B6\u09BF\u09B0\u09CB\u09A8\u09BE\u09AE",
  "Paper size": "\u0995\u09BE\u0997\u099C\u09C7\u09B0 \u0986\u0995\u09BE\u09B0",
  Typography: "\u09AB\u09A8\u09CD\u099F\u09C7\u09B0 \u09A7\u09B0\u09A8",
  "Logo height": "\u09B2\u09CB\u0997\u09CB\u09B0 \u0989\u099A\u09CD\u099A\u09A4\u09BE",
  "Brand accent": "\u09AC\u09CD\u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1\u09C7\u09B0 \u09B0\u0982",
  "Business logo": "\u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09B0 \u09B2\u09CB\u0997\u09CB",
  "Choose image file": "\u099B\u09AC\u09BF\u09B0 \u09AB\u09BE\u0987\u09B2 \u09AC\u09BE\u099B\u09BE\u0987 \u0995\u09B0\u09C1\u09A8",
  "Replace image": "\u099B\u09AC\u09BF \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09C1\u09A8",
  "Authorized signature line": "\u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09B8\u09CD\u09AC\u09BE\u0995\u09CD\u09B7\u09B0\u09C7\u09B0 \u09B2\u09BE\u0987\u09A8",
  Reset: "\u09B0\u09BF\u09B8\u09C7\u099F",
  "Packing slip": "\u09AA\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u09B8\u09CD\u09B2\u09BF\u09AA",
  "Print preview": "\u09AA\u09CD\u09B0\u09BF\u09A8\u09CD\u099F \u09AA\u09CD\u09B0\u09BF\u09AD\u09BF\u0989",
  "Draft saved on this device": "\u09A1\u09CD\u09B0\u09BE\u09AB\u099F \u098F\u0987 \u09A1\u09BF\u09AD\u09BE\u0987\u09B8\u09C7 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4",
  "Saving changes\u2026": "\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u09B9\u099A\u09CD\u099B\u09C7\u2026",
  From: "\u09AA\u09CD\u09B0\u09C7\u09B0\u0995",
  "Bill to": "\u09AA\u09CD\u09B0\u09BE\u09AA\u0995",
  Description: "\u09AC\u09BF\u09AC\u09B0\u09A3",
  Qty: "\u09AA\u09B0\u09BF\u09AE\u09BE\u09A3",
  Amount: "\u09AE\u09CB\u099F",
  Subtotal: "\u0989\u09AA\u09AE\u09CB\u099F",
  Tax: "\u0995\u09B0",
  Shipping: "\u09B6\u09BF\u09AA\u09BF\u0982",
  Total: "\u09B8\u09B0\u09CD\u09AC\u09AE\u09CB\u099F",
  "Authorized signature": "\u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09B8\u09CD\u09AC\u09BE\u0995\u09CD\u09B7\u09B0",
  Date: "\u09A4\u09BE\u09B0\u09BF\u0996",
  Issued: "\u09A4\u09BE\u09B0\u09BF\u0996"
};
var n2 = (value) => Number.parseFloat(value) || 0;
var displayDate = (value) => {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}-${month}-${year}` : value;
};
var escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
})[char] || char);
var lines = (value) => escapeHtml(value).replace(/\n/g, "<br>");
function InvoiceGenerator({
  brand = "Contra Commerce",
  ctaText = "Automate invoices with Contra Commerce",
  ctaUrl = "#",
  className = ""
}) {
  const [draft, setDraft] = useState11(initialDraft);
  const [activeTab, setActiveTab] = useState11("Details");
  const [saved, setSaved] = useState11(false);
  const [ready, setReady] = useState11(false);
  const [downloading, setDownloading] = useState11(false);
  const fileRef = useRef(null);
  useEffect11(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDraft({ ...initialDraft(), ...JSON.parse(stored) });
    } catch {
    }
    setReady(true);
  }, []);
  useEffect11(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        setSaved(true);
      } catch {
        setSaved(false);
      }
    }, 500);
    setSaved(false);
    return () => clearTimeout(timer);
  }, [draft, ready]);
  const items = useMemo11(() => draft.rows.map((item) => ({
    name: item.name,
    description: item.description,
    qty: n2(item.qty),
    price: n2(item.price)
  })), [draft.rows]);
  const result = useMemo11(() => calcInvoice({
    items,
    deliveryCharge: n2(draft.delivery),
    discount: n2(draft.discount),
    discountType: draft.discountType,
    taxRate: n2(draft.taxRate)
  }), [items, draft.delivery, draft.discount, draft.discountType, draft.taxRate]);
  const bangla = draft.language === "bn-BD";
  const tx = (key) => bangla ? bnText[key] || key : key;
  const numberFormat = (value) => new Intl.NumberFormat(draft.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
  const money12 = (value) => draft.currency === "BDT" ? `\u09F3${numberFormat(value)}` : new Intl.NumberFormat(draft.language, { style: "currency", currency: draft.currency, minimumFractionDigits: 2 }).format(value);
  useResultTracking("invoice-generator", { currency: draft.currency, items: items.length, total: result.grandTotal });
  const patch = (key, value) => setDraft((old) => ({ ...old, [key]: value }));
  const setLanguage = (language) => setDraft((old) => {
    const toBangla = language === "bn-BD";
    return {
      ...old,
      language,
      documentTitle: ["Invoice", "\u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8"].includes(old.documentTitle) ? toBangla ? "\u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8" : "Invoice" : old.documentTitle,
      taxLabel: ["Tax", "\u0995\u09B0"].includes(old.taxLabel) ? toBangla ? "\u0995\u09B0" : "Tax" : old.taxLabel,
      notes: ["Thank you for your business.", "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B8\u0999\u09CD\u0997\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964"].includes(old.notes) ? toBangla ? "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B8\u0999\u09CD\u0997\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964" : "Thank you for your business." : old.notes,
      payment: ["Add bank, mobile wallet, or payment instructions here.", "\u09AC\u09CD\u09AF\u09BE\u0982\u0995, \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u0993\u09AF\u09BC\u09BE\u09B2\u09C7\u099F \u0985\u09A5\u09AC\u09BE \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09A8\u09BE \u098F\u0996\u09BE\u09A8\u09C7 \u09B2\u09BF\u0996\u09C1\u09A8\u0964"].includes(old.payment) ? toBangla ? "\u09AC\u09CD\u09AF\u09BE\u0982\u0995, \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u0993\u09AF\u09BC\u09BE\u09B2\u09C7\u099F \u0985\u09A5\u09AC\u09BE \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09A8\u09BE \u098F\u0996\u09BE\u09A8\u09C7 \u09B2\u09BF\u0996\u09C1\u09A8\u0964" : "Add bank, mobile wallet, or payment instructions here." : old.payment,
      terms: ["Payment is due by the date shown above. Please reference the invoice number with your payment.", "\u0989\u09B2\u09CD\u09B2\u09BF\u0996\u09BF\u09A4 \u09A4\u09BE\u09B0\u09BF\u0996\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09B8\u0999\u09CD\u0997\u09C7 \u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8 \u09A8\u09AE\u09CD\u09AC\u09B0\u099F\u09BF \u0989\u09B2\u09CD\u09B2\u09C7\u0996 \u0995\u09B0\u09C1\u09A8\u0964"].includes(old.terms) ? toBangla ? "\u0989\u09B2\u09CD\u09B2\u09BF\u0996\u09BF\u09A4 \u09A4\u09BE\u09B0\u09BF\u0996\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09B8\u0999\u09CD\u0997\u09C7 \u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8 \u09A8\u09AE\u09CD\u09AC\u09B0\u099F\u09BF \u0989\u09B2\u09CD\u09B2\u09C7\u0996 \u0995\u09B0\u09C1\u09A8\u0964" : "Payment is due by the date shown above. Please reference the invoice number with your payment." : old.terms
    };
  });
  const patchRow = (id, values) => patch("rows", draft.rows.map((item) => item.id === id ? { ...item, ...values } : item));
  const addRow = () => patch("rows", [...draft.rows, row2()]);
  const removeRow = (id) => patch("rows", draft.rows.length === 1 ? [row2()] : draft.rows.filter((item) => item.id !== id));
  const reset = () => {
    if (typeof window !== "undefined" && !window.confirm("Clear this invoice and restore the sample?")) return;
    const fresh = initialDraft();
    setDraft(fresh);
    localStorage.removeItem(STORAGE_KEY);
  };
  const uploadLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 15e5) {
      window.alert("Choose a PNG, JPG, WebP, or SVG smaller than 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch("logo", String(reader.result || ""));
    reader.readAsDataURL(file);
  };
  const downloadPdf = async () => {
    const paper = document.querySelector("[data-invoice-paper]");
    if (!paper || downloading) return;
    setDownloading(true);
    const previousTransform = paper.style.transform;
    const holder = paper.parentElement;
    const previousOverflow = holder?.style.overflow;
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf")
      ]);
      paper.style.transform = "none";
      if (holder) holder.style.overflow = "visible";
      await document.fonts.ready;
      const canvas = await html2canvas(paper, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        logging: false
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: draft.paperSize.toLowerCase() });
      const width = draft.paperSize === "A5" ? 148 : 210;
      const height = draft.paperSize === "A5" ? 210 : 297;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, height, void 0, "FAST");
      pdf.save(`invoice-${draft.invoiceNo || "draft"}.pdf`);
    } catch {
      window.alert("Could not create the PDF. Please try again.");
    } finally {
      paper.style.transform = previousTransform;
      if (holder) holder.style.overflow = previousOverflow ?? "";
      setDownloading(false);
    }
  };
  const printDocument = async (kind) => {
    if (kind === "invoice") {
      const popup2 = window.open("", "_blank", "width=980,height=900");
      if (!popup2) {
        window.alert("Allow pop-ups to open the print-ready invoice.");
        return;
      }
      popup2.document.write('<!doctype html><html><body style="font-family:Arial,sans-serif;padding:24px">Preparing print preview\u2026</body></html>');
      popup2.document.close();
      const paper = document.querySelector("[data-invoice-paper]");
      if (!paper) {
        popup2.close();
        return;
      }
      const holder = paper.parentElement;
      const previousTransform = paper.style.transform;
      const previousShadow = paper.style.boxShadow;
      const previousOverflow = holder?.style.overflow;
      try {
        const { default: html2canvas } = await import("html2canvas");
        await document.fonts.ready;
        paper.style.transform = "none";
        paper.style.boxShadow = "none";
        if (holder) holder.style.overflow = "visible";
        const canvas = await html2canvas(paper, {
          backgroundColor: "#ffffff",
          scale: 3,
          useCORS: true,
          logging: false
        });
        const image = canvas.toDataURL("image/png");
        popup2.document.open();
        popup2.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${escapeHtml(draft.invoiceNo)}</title><style>@page{size:auto;margin:10mm}*{box-sizing:border-box}html,body{margin:0;padding:0;background:white}main{width:100%;margin:0 auto}img{display:block;width:100%;height:auto;image-rendering:auto;-webkit-print-color-adjust:exact;print-color-adjust:exact}@media print{main{break-inside:avoid}}</style></head><body><main><img src="${image}" alt="Invoice"></main><script>const image=document.querySelector('img');const ready=()=>setTimeout(()=>print(),50);image.complete?ready():image.addEventListener('load',ready)</script></body></html>`);
        popup2.document.close();
      } catch {
        popup2.close();
        window.alert("Could not prepare the print preview. Please try again.");
      } finally {
        paper.style.transform = previousTransform;
        paper.style.boxShadow = previousShadow;
        if (holder) holder.style.overflow = previousOverflow ?? "";
      }
      return;
    }
    const pricedRows = result.lines.map((item) => `<tr><td><strong>${escapeHtml(item.name || "Untitled item")}</strong>${item.description ? `<small>${escapeHtml(item.description)}</small>` : ""}</td><td class="number">${item.qty}</td>${kind === "packing" ? "" : `<td class="number">${money12(item.price)}</td><td class="number">${money12(item.total)}</td>`}</tr>`).join("");
    const logo = draft.logo ? `<img class="logo" src="${draft.logo}" alt="">` : `<div class="wordmark">${escapeHtml(draft.business).slice(0, 2).toUpperCase()}</div>`;
    const documentTitle = kind === "packing" ? tx("Packing slip") : bangla && draft.documentTitle === "Invoice" ? "\u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8" : draft.documentTitle || tx("Invoice");
    const fontFamily = bangla ? '"Hind Siliguri",sans-serif' : draft.font === "serif" ? "Georgia,serif" : draft.font === "mono" ? "Courier New,monospace" : "Arial,sans-serif";
    const totals = kind === "packing" ? `<section class="packing-summary"><span><small>${bangla ? "\u09B2\u09BE\u0987\u09A8 \u0986\u0987\u099F\u09C7\u09AE" : "Line items"}</small><b>${result.lines.length}</b></span><span><small>${bangla ? "\u09AE\u09CB\u099F \u09AA\u09B0\u09BF\u09AE\u09BE\u09A3" : "Total quantity"}</small><b>${result.totalItems}</b></span></section>` : `<div class="totals"><p><span>${tx("Subtotal")}</span><b>${money12(result.subtotal)}</b></p>${result.discount ? `<p><span>${tx("Discount")}</span><b>\u2212${money12(result.discount)}</b></p>` : ""}${result.tax ? `<p><span>${bangla && draft.taxLabel === "Tax" ? "\u0995\u09B0" : escapeHtml(draft.taxLabel)} (${n2(draft.taxRate)}%)</span><b>${money12(result.tax)}</b></p>` : ""}${result.deliveryCharge ? `<p><span>${tx("Shipping")}</span><b>${money12(result.deliveryCharge)}</b></p>` : ""}<p class="grand"><span>${tx("Total")}</span><b>${money12(result.grandTotal)}</b></p></div>`;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${kind === "packing" ? "Packing slip" : "Invoice"} ${escapeHtml(draft.invoiceNo)}</title><style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');@page{size:${kind === "thermal" ? "80mm auto" : "auto"};margin:0}*{box-sizing:border-box}body{margin:0;color:#15171b;font:14px/1.55 ${fontFamily};-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{width:${kind === "thermal" ? "80mm" : "100%"};min-height:auto;padding:${kind === "thermal" ? "8mm 5mm" : draft.paperSize === "A5" ? "12mm" : "18mm"};margin:auto}.header{display:flex;justify-content:space-between;gap:30px;align-items:flex-start;border-bottom:${draft.template === "minimal" ? `1px solid ${draft.accent}` : `2px solid ${draft.accent}`};padding-bottom:20px;${draft.template === "bold" ? `background:${draft.accent};padding:18px;color:white;border:0` : ""}}.brand{display:flex;gap:14px;align-items:center}.logo{max-width:180px;max-height:${Math.max(36, Math.min(100, n2(draft.logoSize)))}px}.wordmark{width:52px;height:52px;background:${draft.template === "bold" ? "#17191d" : draft.accent};display:grid;place-items:center;color:white;font-weight:800;font-size:20px}.title{text-align:right}.title h1{margin:0;font-size:${kind === "thermal" ? "24px" : draft.paperSize === "A5" ? "26px" : "34px"};font-weight:300;letter-spacing:${bangla ? ".02em" : ".18em"};text-transform:${bangla ? "none" : "uppercase"}}.muted,small{display:block;color:#69707d;font-size:11px}.meta{margin-top:10px}.meta b{color:inherit}.parties{display:grid;grid-template-columns:1fr 1fr;gap:${draft.paperSize === "A5" ? "20px" : "40px"};margin:${draft.paperSize === "A5" ? "20px" : "28px"} 0}.eyebrow{color:${draft.accent};font-size:10px;text-transform:${bangla ? "none" : "uppercase"};letter-spacing:${bangla ? ".02em" : ".2em"};font-weight:700}.party h2{font-size:15px;margin:5px 0 2px}.party p{margin:0;color:#464b55}.items{width:100%;border-collapse:collapse}.items th{background:${draft.template === "minimal" ? "transparent" : draft.accent};color:${draft.template === "minimal" ? draft.accent : "white"};border-bottom:${draft.template === "minimal" ? `2px solid ${draft.accent}` : "0"};text-align:left;font-size:10px;text-transform:${bangla ? "none" : "uppercase"};letter-spacing:${bangla ? "0" : ".12em"};padding:11px}.items td{border-bottom:1px solid #e5e7eb;padding:11px}.number{text-align:right!important}.totals{width:${draft.paperSize === "A5" ? "250px" : "300px"};margin:20px 0 0 auto}.totals p{display:flex;justify-content:space-between;margin:0;padding:6px 0;color:#4b515c}.totals .grand{background:${draft.accent};color:white;padding:13px 15px;margin-top:6px;font-size:16px}.totals small{display:inline;color:#ddd;margin-left:4px}.item-count{text-align:right;font-size:16px;margin-top:18px}.footer{margin-top:34px;display:grid;grid-template-columns:1fr 1fr;gap:${draft.paperSize === "A5" ? "20px" : "30px"}}.panel{background:#f5f6f7;border-left:3px solid ${draft.accent};padding:14px}.panel h3{font-size:10px;text-transform:${bangla ? "none" : "uppercase"};letter-spacing:${bangla ? "0" : ".15em"};margin:0 0 5px}.panel p{margin:0;white-space:pre-wrap}.signature{margin-top:45px;border-top:1px solid ${draft.accent};padding-top:5px;width:190px}.powered{text-align:center;color:#999;font-size:9px;margin-top:28px}${kind === "thermal" ? ".header{display:block}.title{text-align:left;margin-top:15px}.parties{grid-template-columns:1fr;gap:12px;margin:18px 0}.items th:nth-child(n+3),.items td:nth-child(n+3){display:none}.footer{grid-template-columns:1fr}.totals{width:100%}" : ""}
      .packing{padding-left:4mm;padding-right:4mm}.packing .header{grid-template-columns:minmax(60px,1fr) auto;border-bottom:0;padding-bottom:0}.packing .brand,.packing .parties,.packing .items,.packing .signature{margin-left:0}.packing .title{width:auto}.packing .title h1{font-size:clamp(21px,5vw,31px);letter-spacing:.1em;overflow-wrap:normal;white-space:nowrap}.packing .parties{gap:18px;margin-top:24px;margin-bottom:24px}.packing .party{border:1px solid #e3e6ea;border-top:3px solid ${draft.accent};border-radius:4px;padding:15px 17px;min-height:112px}.packing .party h2{margin-top:7px}.packing .items{margin-top:8px}.packing .items th{padding:8px 12px}.packing .items td{padding:12px}.packing .items th:last-child,.packing .items td:last-child{width:110px}.packing-summary{display:flex;justify-content:flex-end;gap:0;margin:20px 0 0 auto}.packing-summary span{display:flex;min-width:135px;align-items:center;justify-content:space-between;gap:20px;border:1px solid #e3e6ea;padding:10px 13px}.packing-summary span+span{border-left:0}.packing-summary small{margin:0;color:#69707d}.packing-summary b{font-size:16px;color:#15171b}
      @media print{@page{size:${kind === "thermal" ? "80mm auto" : "auto"};margin:${kind === "thermal" ? "0" : "10mm"}}html,body{width:100%;margin:0;padding:0;background:#fff}body{font-synthesis:none;text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.page{width:${kind === "thermal" ? "80mm" : "100%"};max-width:100%;padding:${kind === "thermal" ? "8mm 5mm" : "7mm"};margin:0 auto;overflow:visible}.header{display:grid;grid-template-columns:minmax(0,1fr) minmax(155px,40%);gap:24px;align-items:start;padding-bottom:15px;page-break-inside:avoid}.brand{min-width:0}.logo{display:block;object-fit:contain}.title{min-width:0;text-align:right;padding-right:1mm}.title h1{max-width:100%;font-size:${kind === "thermal" ? "24px" : draft.paperSize === "A5" ? "25px" : "31px"};line-height:1.15;font-weight:400;letter-spacing:${bangla ? ".01em" : ".14em"};overflow-wrap:anywhere}.meta{margin-top:7px;white-space:nowrap}.items{table-layout:fixed}.items th{padding:7px 10px;line-height:1.25}.items td{padding:8px 10px}.totals .grand{padding:9px 13px}.header,.items thead,.totals,.footer,.panel,.packing-summary{break-inside:avoid;page-break-inside:avoid}}
    </style></head><body><main class="page ${kind === "packing" ? "packing" : ""}"><header class="header"><div class="brand">${logo}</div><div class="title"><h1>${escapeHtml(documentTitle)}</h1><div class="meta"><div><b>${bangla ? "\u09A8\u0982" : "No."}</b> #${escapeHtml(draft.invoiceNo)}</div><div><b>${tx("Date")}:</b> ${escapeHtml(displayDate(draft.issueDate))}</div></div></div></header><section class="parties"><div class="party"><span class="eyebrow">${kind === "packing" ? bangla ? "\u09AA\u09CD\u09B0\u09C7\u09B0\u0995" : "Sender" : tx("From")}</span><h2>${escapeHtml(draft.business)}</h2><p>${lines(draft.businessDetails)}</p></div><div class="party"><span class="eyebrow">${kind === "packing" ? bangla ? "\u09AA\u09CD\u09B0\u09BE\u09AA\u0995" : "Ship to" : tx("Bill to")}</span><h2>${escapeHtml(draft.customer)}</h2><p>${lines(draft.customerDetails)}</p></div></section><table class="items"><thead><tr><th>${tx("Description")}</th><th class="number">${tx("Qty")}</th>${kind === "packing" ? "" : `<th class="number">${tx("Rate")}</th><th class="number">${tx("Amount")}</th>`}</tr></thead><tbody>${pricedRows}</tbody></table>${totals}${kind === "packing" ? "" : `<section class="footer"><div class="panel"><h3>${tx("Payment details")}</h3><p>${lines(draft.payment)}</p></div><div><div class="panel"><h3>${tx("Notes")}</h3><p>${lines(draft.notes)}</p></div><p class="muted" style="margin-top:12px;white-space:pre-wrap">${lines(draft.terms)}</p></div></section>`}${draft.showSignature ? `<div class="signature">${tx("Authorized signature")}</div>` : ""}<div class="powered">${bangla ? "\u09A4\u09C8\u09B0\u09BF \u09B9\u09AF\u09BC\u09C7\u099B\u09C7" : "Created with"} ${escapeHtml(brand)}</div></main><script>addEventListener('load',async()=>{await document.fonts.ready;print()})</script></body></html>`;
    const popup = window.open("", "_blank", "width=980,height=900");
    if (!popup) {
      window.alert("Allow pop-ups to open the print-ready invoice.");
      return;
    }
    popup.document.write(html);
    popup.document.close();
  };
  return /* @__PURE__ */ jsxs11("div", { className: `space-y-5 ${className}`, lang: "en", children: [
    /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm", children: [
      /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx11("span", { className: `h-2 w-2 rounded-full ${saved ? "bg-emerald-500" : "bg-amber-400"}` }),
        /* @__PURE__ */ jsxs11("div", { children: [
          /* @__PURE__ */ jsxs11("p", { className: "text-sm font-semibold text-gray-900", children: [
            "Invoice #",
            draft.invoiceNo || "Draft"
          ] }),
          /* @__PURE__ */ jsx11("p", { className: "text-xs text-gray-500", children: saved ? "Draft saved on this device" : "Saving changes\u2026" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx11("button", { type: "button", onClick: reset, className: "rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:border-gray-400", children: "Reset" }),
        /* @__PURE__ */ jsx11("button", { type: "button", onClick: () => printDocument("packing"), className: "rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50", children: "Packing slip" }),
        /* @__PURE__ */ jsx11("button", { type: "button", onClick: () => printDocument("invoice"), className: "rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50", children: "Print invoice" }),
        /* @__PURE__ */ jsx11("button", { type: "button", onClick: downloadPdf, disabled: downloading, className: "rounded-lg bg-gray-950 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60", children: downloading ? "Creating PDF\u2026" : "Download PDF" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs11("div", { className: "grid items-start gap-5 xl:grid-cols-[minmax(360px,0.82fr)_minmax(560px,1.18fr)]", children: [
      /* @__PURE__ */ jsxs11("section", { className: "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm", children: [
        /* @__PURE__ */ jsx11("div", { className: "flex overflow-x-auto border-b border-gray-200 px-2", role: "tablist", children: tabs.map((tab) => /* @__PURE__ */ jsx11("button", { type: "button", onClick: () => setActiveTab(tab), className: `whitespace-nowrap border-b-2 px-3 py-3 text-xs font-semibold ${activeTab === tab ? "border-gray-950 text-gray-950" : "border-transparent text-gray-500 hover:text-gray-900"}`, children: tab }, tab)) }),
        /* @__PURE__ */ jsxs11("div", { className: "space-y-4 p-5", children: [
          activeTab === "Details" && /* @__PURE__ */ jsxs11(Fragment3, { children: [
            /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsx11(Field2, { label: "Invoice number", value: draft.invoiceNo, onChange: (v) => patch("invoiceNo", v) }),
              /* @__PURE__ */ jsx11(Select, { label: "Currency", value: draft.currency, options: currencies, onChange: (v) => patch("currency", v) })
            ] }),
            /* @__PURE__ */ jsx11(Field2, { type: "date", label: "Invoice date", value: draft.issueDate, onChange: (v) => patch("issueDate", v) }),
            /* @__PURE__ */ jsx11(Select, { label: "Invoice language", value: draft.language, options: [{ value: "en-US", label: "English invoice" }, { value: "bn-BD", label: "\u09AC\u09BE\u0982\u09B2\u09BE \u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8" }], onChange: setLanguage })
          ] }),
          activeTab === "Parties" && /* @__PURE__ */ jsxs11(Fragment3, { children: [
            /* @__PURE__ */ jsx11(Field2, { label: "Your business / name", value: draft.business, onChange: (v) => patch("business", v) }),
            /* @__PURE__ */ jsx11(Area, { label: "Your address, email, tax ID", value: draft.businessDetails, onChange: (v) => patch("businessDetails", v) }),
            /* @__PURE__ */ jsx11(Field2, { label: "Client / company", value: draft.customer, onChange: (v) => patch("customer", v) }),
            /* @__PURE__ */ jsx11(Area, { label: "Client address and contact", value: draft.customerDetails, onChange: (v) => patch("customerDetails", v) })
          ] }),
          activeTab === "Items" && /* @__PURE__ */ jsxs11(Fragment3, { children: [
            /* @__PURE__ */ jsx11("div", { className: "space-y-3", children: draft.rows.map((item, index) => /* @__PURE__ */ jsxs11("div", { className: "rounded-xl border border-gray-200 bg-gray-50/70 p-3", children: [
              /* @__PURE__ */ jsxs11("div", { className: "mb-2 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs11("span", { className: "text-xs font-semibold text-gray-500", children: [
                  "ITEM ",
                  index + 1
                ] }),
                /* @__PURE__ */ jsx11("button", { type: "button", onClick: () => removeRow(item.id), className: "text-xs text-gray-400 hover:text-red-600", children: "Remove" })
              ] }),
              /* @__PURE__ */ jsx11(Field2, { label: "Name", value: item.name, placeholder: "Product or service", onChange: (v) => patchRow(item.id, { name: v }) }),
              /* @__PURE__ */ jsx11("div", { className: "mt-2", children: /* @__PURE__ */ jsx11(Field2, { label: "Description (optional)", value: item.description, onChange: (v) => patchRow(item.id, { description: v }) }) }),
              /* @__PURE__ */ jsxs11("div", { className: "mt-2 grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsx11(Field2, { type: "number", label: "Quantity", value: item.qty, onChange: (v) => patchRow(item.id, { qty: v }) }),
                /* @__PURE__ */ jsx11(Field2, { type: "number", label: `Rate (${draft.currency})`, value: item.price, onChange: (v) => patchRow(item.id, { price: v }) })
              ] })
            ] }, item.id)) }),
            /* @__PURE__ */ jsx11("button", { type: "button", onClick: addRow, className: "w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:border-gray-700 hover:bg-gray-50", children: "+ Add line item" })
          ] }),
          activeTab === "Payment" && /* @__PURE__ */ jsxs11(Fragment3, { children: [
            /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsx11(Select, { label: "Discount type", value: draft.discountType, options: [{ value: "fixed", label: "Fixed" }, { value: "percent", label: "Percentage" }], onChange: (v) => patch("discountType", v) }),
              /* @__PURE__ */ jsx11(Field2, { type: "number", label: draft.discountType === "percent" ? "Discount (%)" : `Discount (${draft.currency})`, value: draft.discount, onChange: (v) => patch("discount", v) })
            ] }),
            /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsx11(Field2, { label: "Tax label", value: draft.taxLabel, onChange: (v) => patch("taxLabel", v) }),
              /* @__PURE__ */ jsx11(Field2, { type: "number", label: "Tax rate (%)", value: draft.taxRate, onChange: (v) => patch("taxRate", v) })
            ] }),
            /* @__PURE__ */ jsx11(Field2, { type: "number", label: `Shipping / delivery (${draft.currency})`, value: draft.delivery, onChange: (v) => patch("delivery", v) }),
            /* @__PURE__ */ jsx11(Area, { label: "Payment details", value: draft.payment, onChange: (v) => patch("payment", v) }),
            /* @__PURE__ */ jsx11(Area, { label: "Notes", value: draft.notes, onChange: (v) => patch("notes", v) }),
            /* @__PURE__ */ jsx11(Area, { label: "Terms", value: draft.terms, onChange: (v) => patch("terms", v) })
          ] }),
          activeTab === "Design" && /* @__PURE__ */ jsxs11(Fragment3, { children: [
            /* @__PURE__ */ jsxs11("div", { children: [
              /* @__PURE__ */ jsx11("span", { className: "mb-2 block text-sm text-gray-700", children: "Design preset" }),
              /* @__PURE__ */ jsx11("div", { className: "grid grid-cols-2 gap-2", children: ["editorial", "classic", "minimal", "bold"].map((template) => /* @__PURE__ */ jsx11("button", { type: "button", onClick: () => patch("template", template), className: `rounded-xl border p-3 text-xs font-semibold capitalize ${draft.template === template ? "border-gray-950 bg-gray-950 text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"}`, children: template }, template)) })
            ] }),
            /* @__PURE__ */ jsx11(Field2, { label: "Document title", value: draft.documentTitle, placeholder: "Invoice, Tax Invoice, Receipt\u2026", onChange: (v) => patch("documentTitle", v) }),
            /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsx11(Select, { label: "Paper size", value: draft.paperSize, options: ["A4", "A5"], onChange: (v) => patch("paperSize", v) }),
              /* @__PURE__ */ jsx11(Select, { label: "Typography", value: draft.font, options: ["sans", "serif", "mono"], onChange: (v) => patch("font", v) })
            ] }),
            /* @__PURE__ */ jsx11(Field2, { type: "number", label: "Logo height (px)", value: draft.logoSize, onChange: (v) => patch("logoSize", v) }),
            /* @__PURE__ */ jsxs11("label", { className: "block", children: [
              /* @__PURE__ */ jsx11("span", { className: "mb-1 block text-sm text-gray-700", children: "Brand accent" }),
              /* @__PURE__ */ jsxs11("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx11("input", { type: "color", value: draft.accent, onChange: (e) => patch("accent", e.target.value), className: "h-11 w-16 cursor-pointer rounded-lg border border-gray-300 bg-white p-1" }),
                /* @__PURE__ */ jsx11("input", { value: draft.accent, onChange: (e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && patch("accent", e.target.value), className: "min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm uppercase" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs11("div", { className: "rounded-xl border border-gray-200 bg-gray-50 p-3", children: [
              /* @__PURE__ */ jsx11("span", { className: "mb-2 block text-sm font-medium text-gray-800", children: "Business logo" }),
              /* @__PURE__ */ jsx11("input", { ref: fileRef, type: "file", accept: "image/png,image/jpeg,image/webp,image/svg+xml", onChange: uploadLogo, className: "hidden" }),
              /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-3", children: [
                draft.logo && /* @__PURE__ */ jsx11("img", { src: draft.logo, alt: "Business logo", className: "h-12 w-20 rounded border border-gray-200 bg-white object-contain p-1" }),
                /* @__PURE__ */ jsxs11("div", { className: "flex min-w-0 flex-1 gap-2", children: [
                  /* @__PURE__ */ jsx11("button", { type: "button", onClick: () => fileRef.current?.click(), className: "flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:border-gray-500", children: draft.logo ? "Replace image" : "Choose image file" }),
                  draft.logo && /* @__PURE__ */ jsx11("button", { type: "button", onClick: () => patch("logo", ""), className: "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500", children: "Remove" })
                ] })
              ] }),
              /* @__PURE__ */ jsx11("p", { className: "mt-2 text-xs text-gray-400", children: "PNG, JPG, WebP or SVG \xB7 maximum 1.5 MB \xB7 stored only on this device" })
            ] }),
            /* @__PURE__ */ jsxs11("label", { className: "flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-2.5", children: [
              /* @__PURE__ */ jsx11("span", { className: "text-sm text-gray-700", children: "Authorized signature line" }),
              /* @__PURE__ */ jsx11("input", { type: "checkbox", checked: draft.showSignature, onChange: (e) => patch("showSignature", e.target.checked), className: "h-4 w-4 accent-gray-950" })
            ] }),
            /* @__PURE__ */ jsx11("button", { type: "button", onClick: () => printDocument("thermal"), className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold", children: "Print compact 80mm receipt" }),
            /* @__PURE__ */ jsxs11("p", { className: "-mt-2 text-xs text-gray-400", children: [
              "Compact receipts intentionally omit rate and amount columns. Use the ",
              draft.paperSize,
              " invoice button above for a preview-matched document."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs11("section", { className: "sticky top-4 overflow-hidden rounded-2xl border border-gray-200 bg-[#e9eaec] p-3 shadow-sm sm:p-5", "aria-label": `${draft.paperSize} invoice preview`, children: [
        /* @__PURE__ */ jsxs11("div", { className: "mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-gray-500", children: [
          /* @__PURE__ */ jsx11("span", { children: "Print preview" }),
          /* @__PURE__ */ jsxs11("span", { children: [
            draft.paperSize,
            " \xB7 ",
            draft.paperSize === "A5" ? "148 \xD7 210 mm" : "210 \xD7 297 mm"
          ] })
        ] }),
        /* @__PURE__ */ jsx11(InvoicePreview, { draft, result, money: money12 })
      ] })
    ] }),
    /* @__PURE__ */ jsx11(CtaCard, { href: ctaUrl, text: ctaText, brand })
  ] });
}
function InvoicePreview({ draft, result, money: money12 }) {
  const bangla = draft.language === "bn-BD";
  const tx = (key) => bangla ? bnText[key] || key : key;
  const minimal = draft.template === "minimal";
  const font = draft.font === "serif" ? "font-serif" : draft.font === "mono" ? "font-mono" : "font-sans";
  const fontFamily = bangla ? 'var(--font-hind-siliguri), "Hind Siliguri", sans-serif' : draft.font === "serif" ? "Georgia, serif" : draft.font === "mono" ? '"Courier New", monospace' : "Arial, sans-serif";
  const bold = draft.template === "bold";
  const isA5 = draft.paperSize === "A5";
  const paperWidth = isA5 ? 559 : 794;
  const paperHeight = isA5 ? 794 : 1123;
  const paperPadding = isA5 ? 45 : 68;
  const previewHolder = useRef(null);
  const [previewScale, setPreviewScale] = useState11(1);
  useEffect11(() => {
    const holder = previewHolder.current;
    if (!holder) return;
    const update = () => setPreviewScale(Math.min(1, holder.clientWidth / paperWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(holder);
    return () => observer.disconnect();
  }, [paperWidth]);
  return /* @__PURE__ */ jsx11("div", { ref: previewHolder, className: "mx-auto w-full overflow-hidden", style: { height: `${paperHeight * previewScale}px`, maxWidth: `${paperWidth}px` }, children: /* @__PURE__ */ jsxs11("article", { "data-invoice-paper": true, style: { boxSizing: "border-box", fontFamily, height: `${paperHeight}px`, padding: `${paperPadding}px`, transform: `scale(${previewScale})`, transformOrigin: "top left", width: `${paperWidth}px` }, className: `overflow-hidden bg-white text-[#17191d] shadow-[0_12px_45px_rgba(0,0,0,.14)] ${font}`, children: [
    /* @__PURE__ */ jsxs11("header", { style: bold ? { background: draft.accent, margin: `-${paperPadding}px -${paperPadding}px 0`, padding: `${paperPadding}px` } : { borderColor: draft.accent }, className: `flex items-start justify-between gap-5 pb-5 ${bold ? "text-white" : minimal ? "border-b" : "border-b-2"}`, children: [
      /* @__PURE__ */ jsx11("div", { children: draft.logo ? /* @__PURE__ */ jsx11("img", { src: draft.logo, alt: bangla ? "\u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09B0 \u09B2\u09CB\u0997\u09CB" : "Business logo", style: { maxHeight: `${Math.max(36, Math.min(100, n2(draft.logoSize)))}px` }, className: "max-w-44 object-contain" }) : /* @__PURE__ */ jsx11("div", { style: { background: bold ? "#17191d" : draft.accent }, className: "grid h-14 w-14 place-items-center text-lg font-bold text-white", children: draft.business.slice(0, 2).toUpperCase() }) }),
      /* @__PURE__ */ jsxs11("div", { className: "text-right", children: [
        /* @__PURE__ */ jsx11("h2", { className: `${isA5 ? "text-2xl" : "text-3xl"} font-light ${bangla ? "" : "uppercase tracking-[.18em]"}`, children: bangla && draft.documentTitle === "Invoice" ? "\u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8" : draft.documentTitle || (bangla ? "\u0987\u09A8\u09AD\u09AF\u09BC\u09C7\u09B8" : "Invoice") }),
        /* @__PURE__ */ jsxs11("dl", { className: `mt-2 text-xs leading-5 ${bold ? "text-white/80" : "text-gray-500"}`, children: [
          /* @__PURE__ */ jsxs11("div", { children: [
            /* @__PURE__ */ jsxs11("dt", { className: `inline font-semibold ${bold ? "text-white" : "text-gray-800"}`, children: [
              bangla ? "\u09A8\u0982" : "No.",
              " "
            ] }),
            /* @__PURE__ */ jsxs11("dd", { className: "inline", children: [
              "#",
              draft.invoiceNo
            ] })
          ] }),
          /* @__PURE__ */ jsxs11("div", { children: [
            /* @__PURE__ */ jsxs11("dt", { className: `inline font-semibold ${bold ? "text-white" : "text-gray-800"}`, children: [
              tx("Date"),
              ": "
            ] }),
            /* @__PURE__ */ jsx11("dd", { className: "inline", children: displayDate(draft.issueDate) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs11("div", { className: `grid grid-cols-2 text-xs leading-5 ${isA5 ? "my-5 gap-5" : "my-7 gap-10"}`, children: [
      /* @__PURE__ */ jsx11(Party, { label: tx("From"), name: draft.business, details: draft.businessDetails, accent: draft.accent }),
      /* @__PURE__ */ jsx11(Party, { label: tx("Bill to"), name: draft.customer, details: draft.customerDetails, accent: draft.accent })
    ] }),
    /* @__PURE__ */ jsx11("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs11("table", { className: "w-full min-w-[420px] text-xs", children: [
      /* @__PURE__ */ jsx11("thead", { children: /* @__PURE__ */ jsxs11("tr", { style: minimal ? { borderColor: draft.accent, color: draft.accent } : { background: draft.accent }, className: minimal ? "border-y-2" : "text-white", children: [
        /* @__PURE__ */ jsx11("th", { className: `px-3 py-2 text-left font-semibold ${bangla ? "" : "uppercase tracking-wider"}`, children: tx("Description") }),
        /* @__PURE__ */ jsx11("th", { className: `px-3 py-2 text-right font-semibold ${bangla ? "" : "uppercase tracking-wider"}`, children: tx("Qty") }),
        /* @__PURE__ */ jsx11("th", { className: `px-3 py-2 text-right font-semibold ${bangla ? "" : "uppercase tracking-wider"}`, children: tx("Rate") }),
        /* @__PURE__ */ jsx11("th", { className: `px-3 py-2 text-right font-semibold ${bangla ? "" : "uppercase tracking-wider"}`, children: tx("Amount") })
      ] }) }),
      /* @__PURE__ */ jsx11("tbody", { children: result.lines.map((item, i) => /* @__PURE__ */ jsxs11("tr", { className: "border-b border-gray-200", children: [
        /* @__PURE__ */ jsxs11("td", { className: "px-3 py-3", children: [
          /* @__PURE__ */ jsx11("b", { className: "block", children: item.name || (bangla ? "\u09A8\u09BE\u09AE\u09B9\u09C0\u09A8 \u0986\u0987\u099F\u09C7\u09AE" : "Untitled item") }),
          item.description && /* @__PURE__ */ jsx11("span", { className: "text-[10px] text-gray-500", children: item.description })
        ] }),
        /* @__PURE__ */ jsx11("td", { className: "px-3 py-3 text-right", children: item.qty }),
        /* @__PURE__ */ jsx11("td", { className: "px-3 py-3 text-right", children: money12(item.price) }),
        /* @__PURE__ */ jsx11("td", { className: "px-3 py-3 text-right font-medium", children: money12(item.total) })
      ] }, draft.rows[i]?.id || i)) })
    ] }) }),
    /* @__PURE__ */ jsxs11("div", { className: "ml-auto mt-5 w-full max-w-[300px] text-xs", children: [
      /* @__PURE__ */ jsx11(Total, { label: tx("Subtotal"), value: money12(result.subtotal) }),
      result.discount > 0 && /* @__PURE__ */ jsx11(Total, { label: tx("Discount"), value: `\u2212${money12(result.discount)}` }),
      result.tax > 0 && /* @__PURE__ */ jsx11(Total, { label: `${bangla && draft.taxLabel === "Tax" ? "\u0995\u09B0" : draft.taxLabel} (${n2(draft.taxRate)}%)`, value: money12(result.tax) }),
      result.deliveryCharge > 0 && /* @__PURE__ */ jsx11(Total, { label: tx("Shipping"), value: money12(result.deliveryCharge) }),
      /* @__PURE__ */ jsxs11("div", { style: { background: draft.accent }, className: "mt-2 flex justify-between px-4 py-2.5 text-sm font-bold text-white", children: [
        /* @__PURE__ */ jsx11("span", { children: tx("Total") }),
        /* @__PURE__ */ jsx11("span", { children: money12(result.grandTotal) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs11("div", { className: "mt-9 grid grid-cols-2 gap-5 text-[10px] leading-4", children: [
      /* @__PURE__ */ jsxs11("div", { style: { borderColor: draft.accent }, className: "border-l-[3px] bg-gray-50 p-3", children: [
        /* @__PURE__ */ jsx11("b", { className: `mb-1 block ${bangla ? "" : "uppercase tracking-widest"}`, children: tx("Payment details") }),
        /* @__PURE__ */ jsx11("p", { className: "whitespace-pre-line text-gray-600", children: draft.payment })
      ] }),
      /* @__PURE__ */ jsxs11("div", { children: [
        /* @__PURE__ */ jsx11("b", { className: `mb-1 block ${bangla ? "" : "uppercase tracking-widest"}`, children: tx("Notes") }),
        /* @__PURE__ */ jsx11("p", { className: "whitespace-pre-line text-gray-600", children: draft.notes }),
        /* @__PURE__ */ jsx11("p", { className: "mt-3 whitespace-pre-line text-gray-400", children: draft.terms })
      ] })
    ] }),
    draft.showSignature && /* @__PURE__ */ jsx11("div", { style: { borderColor: draft.accent }, className: "mt-12 w-44 border-t pt-1 text-[10px] text-gray-500", children: tx("Authorized signature") })
  ] }) });
}
function Party({ label, name, details, accent }) {
  return /* @__PURE__ */ jsxs11("div", { children: [
    /* @__PURE__ */ jsx11("span", { style: { color: accent }, className: "text-[10px] font-bold uppercase tracking-[.2em]", children: label }),
    /* @__PURE__ */ jsx11("h3", { className: "mt-1 text-sm font-bold", children: name || "\u2014" }),
    /* @__PURE__ */ jsx11("p", { className: "mt-0.5 whitespace-pre-line text-gray-600", children: details })
  ] });
}
function Total({ label, value }) {
  return /* @__PURE__ */ jsxs11("div", { className: "flex justify-between border-b border-gray-100 py-1.5 text-gray-600", children: [
    /* @__PURE__ */ jsx11("span", { children: label }),
    /* @__PURE__ */ jsx11("b", { className: "text-gray-800", children: value })
  ] });
}
function Field2({ label, value, onChange, placeholder, type = "text" }) {
  return /* @__PURE__ */ jsxs11("label", { className: "block", children: [
    /* @__PURE__ */ jsx11("span", { className: "mb-1 block text-sm text-gray-700", children: label }),
    /* @__PURE__ */ jsx11("input", { type, min: type === "number" ? "0" : void 0, step: type === "number" ? "any" : void 0, value, placeholder, onChange: (e) => onChange(e.target.value), className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100" })
  ] });
}
function Area({ label, value, onChange }) {
  return /* @__PURE__ */ jsxs11("label", { className: "block", children: [
    /* @__PURE__ */ jsx11("span", { className: "mb-1 block text-sm text-gray-700", children: label }),
    /* @__PURE__ */ jsx11("textarea", { rows: 3, value, onChange: (e) => onChange(e.target.value), className: "w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100" })
  ] });
}
function Select({ label, value, options, onChange }) {
  return /* @__PURE__ */ jsxs11("label", { className: "block", children: [
    /* @__PURE__ */ jsx11("span", { className: "mb-1 block text-sm text-gray-700", children: label }),
    /* @__PURE__ */ jsx11(DropdownControl, { ariaLabel: label, value, onChange, options, className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900" })
  ] });
}

// src/components/LaunchToolSuite.tsx
import { lazy, Suspense, useEffect as useEffect12, useMemo as useMemo12, useRef as useRef2, useState as useState12 } from "react";
import { Fragment as Fragment4, jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
var SocialMediaToolSuite = lazy(() => import("./SocialMediaToolSuite-GAVF2PAD.js").then((module) => ({ default: module.SocialMediaToolSuite })));
var DeveloperToolsStudio2 = lazy(() => import("./DeveloperToolsStudio-NVG6252C.js").then((module) => ({ default: module.DeveloperToolsStudio })));
var WebsiteSeoStudio2 = lazy(() => import("./WebsiteSeoStudio-G2SHPBKC.js").then((module) => ({ default: module.WebsiteSeoStudio })));
var CalculatorToolsStudio2 = lazy(() => import("./CalculatorToolsStudio-DB7ZQIV6.js").then((module) => ({ default: module.CalculatorToolsStudio })));
var ProductivityToolsStudio2 = lazy(() => import("./ProductivityToolsStudio-ESW65IL3.js").then((module) => ({ default: module.ProductivityToolsStudio })));
var EducationToolsStudio2 = lazy(() => import("./EducationToolsStudio-XNTQTI2X.js").then((module) => ({ default: module.EducationToolsStudio })));
var CareerToolsStudio2 = lazy(() => import("./CareerToolsStudio-GTHF4G7L.js").then((module) => ({ default: module.CareerToolsStudio })));
var HealthToolsStudio2 = lazy(() => import("./HealthToolsStudio-XN64LVGP.js").then((module) => ({ default: module.HealthToolsStudio })));
var TravelToolsStudio2 = lazy(() => import("./TravelToolsStudio-PIB6PJ6G.js").then((module) => ({ default: module.TravelToolsStudio })));
var CreatorToolsStudio2 = lazy(() => import("./CreatorToolsStudio-5W3SGD7M.js").then((module) => ({ default: module.CreatorToolsStudio })));
var TextUtilityStudio2 = lazy(() => import("./TextUtilityStudio-Y4NJXD2X.js").then((module) => ({ default: module.TextUtilityStudio })));
var HomeToolsStudio2 = lazy(() => import("./HomeToolsStudio-YMOOKPPD.js").then((module) => ({ default: module.HomeToolsStudio })));
var ImageToolsStudio2 = lazy(() => import("./ImageToolsStudio-D64HA2B6.js").then((module) => ({ default: module.ImageToolsStudio })));
function LaunchToolSuite({ tool }) {
  if (tool === "developer-tools") return studio(tool, /* @__PURE__ */ jsx12(DeveloperToolsStudio2, {}));
  if (tool === "website-seo-tools") return studio(tool, /* @__PURE__ */ jsx12(WebsiteSeoStudio2, {}));
  if (tool === "calculator-tools") return studio(tool, /* @__PURE__ */ jsx12(CalculatorToolsStudio2, {}));
  if (tool === "productivity-tools") return studio(tool, /* @__PURE__ */ jsx12(ProductivityToolsStudio2, {}));
  if (tool === "education-tools") return studio(tool, /* @__PURE__ */ jsx12(EducationToolsStudio2, {}));
  if (tool === "career-job-tools") return studio(tool, /* @__PURE__ */ jsx12(CareerToolsStudio2, {}));
  if (tool === "health-tools") return studio(tool, /* @__PURE__ */ jsx12(HealthToolsStudio2, {}));
  if (tool === "travel-tools") return studio(tool, /* @__PURE__ */ jsx12(TravelToolsStudio2, {}));
  if (tool === "creator-tools") return studio(tool, /* @__PURE__ */ jsx12(CreatorToolsStudio2, {}));
  if (tool === "text-utility-tools") return studio(tool, /* @__PURE__ */ jsx12(TextUtilityStudio2, {}));
  if (tool === "home-everyday-tools") return studio(tool, /* @__PURE__ */ jsx12(HomeToolsStudio2, {}));
  if (tool === "image-tools") return studio(tool, /* @__PURE__ */ jsx12(ImageToolsStudio2, {}));
  if (["social-media-tools", "instagram-bio-generator", "hashtag-cleaner", "youtube-timestamp-generator", "thumbnail-title-checker", "facebook-ad-formatter", "linkedin-post-formatter", "twitter-thread-splitter", "engagement-rate-calculator", "influencer-rate-calculator", "giveaway-winner-picker", "social-username-checker"].includes(tool)) return studio(tool, /* @__PURE__ */ jsx12(SocialMediaToolSuite, { tool }));
  if (tool === "professional-message") return /* @__PURE__ */ jsx12(MessageRewriter, {});
  if (tool === "whatsapp-reply-generator") return /* @__PURE__ */ jsx12(WhatsAppReplyGenerator, {});
  if (tool === "supplier-message") return /* @__PURE__ */ jsx12(SupplierMessage, {});
  if (tool === "video-script-timer") return /* @__PURE__ */ jsx12(ScriptTimer, {});
  if (tool === "teleprompter") return /* @__PURE__ */ jsx12(Teleprompter, {});
  if (tool === "caption-formatter") return /* @__PURE__ */ jsx12(CaptionFormatter, {});
  if (tool === "utm-builder") return /* @__PURE__ */ jsx12(UtmBuilder, {});
  if (tool === "social-share-preview") return /* @__PURE__ */ jsx12(SocialPreview, {});
  if (tool === "product-photo-cleaner" || tool === "social-image-resizer" || tool === "passport-photo-maker") return /* @__PURE__ */ jsx12(ImageTool, { tool });
  return /* @__PURE__ */ jsx12(Calculator, { tool });
}
function studio(tool, content) {
  return /* @__PURE__ */ jsx12(Suspense, { fallback: /* @__PURE__ */ jsx12("div", { className: "flex min-h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-500", children: "Loading tool workspace\u2026" }), children: /* @__PURE__ */ jsx12(StudioWorkspace, { tool, children: content }) });
}
function StudioWorkspace({ tool, children }) {
  const workspace = useRef2(null);
  const [draftStatus, setDraftStatus] = useState12("Drafts stay only on this device.");
  const storageKey = `contra-studio-draft:${tool}`;
  const readControls = () => Array.from(workspace.current?.querySelectorAll('input:not([type="file"]), select, textarea') || []).map((element, index) => ({
    index,
    tag: element.tagName.toLowerCase(),
    type: element instanceof HTMLInputElement ? element.type : "",
    value: element.value,
    checked: element instanceof HTMLInputElement && ["checkbox", "radio"].includes(element.type) ? element.checked : void 0
  }));
  const saveDraft = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, tool, savedAt: (/* @__PURE__ */ new Date()).toISOString(), controls: readControls() }));
      setDraftStatus("Draft saved on this device.");
    } catch {
      setDraftStatus("This browser could not save the draft.");
    }
  };
  const restoreDraft = () => {
    try {
      const draft = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (!draft?.controls?.length) return setDraftStatus("No saved draft exists for this studio.");
      const elements = Array.from(workspace.current?.querySelectorAll('input:not([type="file"]), select, textarea') || []);
      draft.controls.forEach((saved) => {
        const element = elements[saved.index];
        if (!element || element.tagName.toLowerCase() !== saved.tag) return;
        if (element instanceof HTMLInputElement && ["checkbox", "radio"].includes(element.type)) {
          Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "checked")?.set?.call(element, Boolean(saved.checked));
          element.dispatchEvent(new Event("change", { bubbles: true }));
          return;
        }
        const prototype = element instanceof HTMLInputElement ? HTMLInputElement.prototype : element instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLTextAreaElement.prototype;
        Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(element, saved.value);
        element.dispatchEvent(new Event(element instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
      });
      setDraftStatus("Saved draft restored. File uploads must be selected again.");
    } catch {
      setDraftStatus("The saved draft is invalid and could not be restored.");
    }
  };
  const exportDraft = () => {
    const payload = JSON.stringify({ version: 1, tool, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), controls: readControls() }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tool}-draft.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5e3);
    setDraftStatus("Draft exported as JSON.");
  };
  return /* @__PURE__ */ jsxs12("div", { ref: workspace, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs12("div", { className: "flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs12("div", { children: [
        /* @__PURE__ */ jsx12("p", { className: "text-sm font-semibold text-gray-950", children: "Workspace draft" }),
        /* @__PURE__ */ jsx12("p", { className: "text-xs text-gray-500", "aria-live": "polite", children: draftStatus })
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx12("button", { type: "button", onClick: saveDraft, className: "rounded-xl bg-gray-950 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800", children: "Save draft" }),
        /* @__PURE__ */ jsx12("button", { type: "button", onClick: restoreDraft, className: "rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50", children: "Restore" }),
        /* @__PURE__ */ jsx12("button", { type: "button", onClick: exportDraft, className: "rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50", children: "Export JSON" })
      ] })
    ] }),
    children
  ] });
}
var n3 = (value) => Number(value) || 0;
var money9 = (value) => `\u09F3${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0)}`;
var fieldClass = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var buttonClass = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50";
function Shell({ inputs, result }) {
  return /* @__PURE__ */ jsxs12("div", { className: "grid gap-5 lg:grid-cols-2", children: [
    /* @__PURE__ */ jsx12("section", { className: "space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: inputs }),
    /* @__PURE__ */ jsx12("section", { className: "space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: result })
  ] });
}
function StackedShell({ inputs, result }) {
  return /* @__PURE__ */ jsxs12("div", { className: "grid min-w-0 grid-cols-1 gap-5", children: [
    /* @__PURE__ */ jsx12("section", { className: "min-w-0 space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: inputs }),
    /* @__PURE__ */ jsx12("section", { className: "min-w-0 space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: result })
  ] });
}
function ResultFirstShell({ inputs, result, resultColumns = 2 }) {
  return /* @__PURE__ */ jsxs12("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx12("section", { className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: /* @__PURE__ */ jsx12("div", { className: `grid items-stretch gap-4 md:grid-cols-2 ${resultColumns === 3 ? "lg:grid-cols-3" : ""}`, children: result }) }),
    /* @__PURE__ */ jsx12("section", { className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: /* @__PURE__ */ jsx12("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: inputs }) })
  ] });
}
function Field3({ label, value, onChange, type = "number", placeholder }) {
  return /* @__PURE__ */ jsxs12("label", { className: "block", children: [
    /* @__PURE__ */ jsx12("span", { className: "mb-1 block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx12("input", { className: fieldClass, type, value, placeholder, onChange: (e) => onChange(e.target.value) })
  ] });
}
function Area2({ label, value, onChange, rows = 7, placeholder }) {
  return /* @__PURE__ */ jsxs12("label", { className: "block", children: [
    /* @__PURE__ */ jsx12("span", { className: "mb-1 block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx12("textarea", { className: fieldClass, rows, value, placeholder, onChange: (e) => onChange(e.target.value) })
  ] });
}
function Select2({ label, value, onChange, options }) {
  return /* @__PURE__ */ jsxs12("label", { className: "block", children: [
    /* @__PURE__ */ jsx12("span", { className: "mb-1 block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx12(DropdownControl, { className: fieldClass, ariaLabel: label, value, onChange, options })
  ] });
}
function Result({ title: title2, value, note }) {
  return /* @__PURE__ */ jsxs12("div", { className: "rounded-xl border border-gray-200 bg-gray-50 p-4", children: [
    /* @__PURE__ */ jsx12("p", { className: "text-xs font-medium uppercase tracking-wider text-gray-500", children: title2 }),
    /* @__PURE__ */ jsx12("p", { className: "mt-1 text-2xl font-bold text-gray-950", children: value }),
    note && /* @__PURE__ */ jsx12("p", { className: "mt-1 text-sm text-gray-500", children: note })
  ] });
}
function Copy({ text }) {
  const [done, setDone] = useState12(false);
  return /* @__PURE__ */ jsx12("button", { className: buttonClass, onClick: async () => {
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  }, children: done ? "Copied" : "Copy result" });
}
function Calculator({ tool }) {
  const [v, setV] = useState12(() => ({
    "moq-decision": { a: "500", b: "250", c: "30000", d: "500", e: "0", f: "0" },
    "client-profitability": { a: "100000", b: "80", c: "15000", d: "1000", e: "0", f: "0" },
    "job-offer-comparison": { a: "1200000", b: "10000", c: "300", d: "22", e: "1350000", f: "5000" },
    "study-hours-planner": { a: "80", b: "30", c: "50", d: "0", e: "0", f: "0" },
    "room-paint-calculator": { a: "20", b: "2.8", c: "2", d: "10", e: "1", f: "2" }
  })[tool]);
  const set = (key) => (value) => setV((old) => ({ ...old, [key]: value }));
  if (tool === "moq-decision") {
    const investment = n3(v.a) * n3(v.b), landed = investment + n3(v.c), profit = n3(v.a) * n3(v.d) - landed, breakEven = n3(v.d) ? Math.ceil(landed / n3(v.d)) : 0;
    return /* @__PURE__ */ jsx12(Shell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
      /* @__PURE__ */ jsx12(Field3, { label: "MOQ quantity", value: v.a, onChange: set("a") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Unit purchase cost", value: v.b, onChange: set("b") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Freight and import cost", value: v.c, onChange: set("c") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Expected selling price per unit", value: v.d, onChange: set("d") })
    ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
      /* @__PURE__ */ jsx12(Result, { title: "Cash required", value: money9(landed) }),
      /* @__PURE__ */ jsx12(Result, { title: "Expected order profit", value: money9(profit), note: profit >= 0 ? "The order can recover its cost at your expected price." : "Price or order economics need revision." }),
      /* @__PURE__ */ jsx12(Result, { title: "Units needed to break even", value: `${breakEven} of ${n3(v.a)}` })
    ] }) });
  }
  if (tool === "client-profitability") {
    const revenue = n3(v.a), hours = n3(v.b), expenses = n3(v.c), target = n3(v.d), profit = revenue - expenses, hourly = hours ? profit / hours : 0;
    return /* @__PURE__ */ jsx12(Shell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
      /* @__PURE__ */ jsx12(Field3, { label: "Client revenue", value: v.a, onChange: set("a") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Hours spent", value: v.b, onChange: set("b") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Direct expenses", value: v.c, onChange: set("c") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Target hourly rate", value: v.d, onChange: set("d") })
    ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
      /* @__PURE__ */ jsx12(Result, { title: "Net client profit", value: money9(profit) }),
      /* @__PURE__ */ jsx12(Result, { title: "Effective hourly rate", value: money9(hourly), note: hourly >= target ? "Meets your target rate." : `Below target by ${money9(target - hourly)} per hour.` }),
      /* @__PURE__ */ jsx12(Result, { title: "Profit margin", value: `${revenue ? (profit / revenue * 100).toFixed(1) : 0}%` })
    ] }) });
  }
  if (tool === "job-offer-comparison") {
    const scoreA = n3(v.a) + n3(v.b) * 12 - n3(v.c) * n3(v.d), scoreB = n3(v.e) + n3(v.f) * 12 - n3(v.c) * n3(v.d);
    return /* @__PURE__ */ jsx12(ResultFirstShell, { resultColumns: 3, inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
      /* @__PURE__ */ jsx12(Field3, { label: "Offer A annual salary", value: v.a, onChange: set("a") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Offer A monthly benefits", value: v.b, onChange: set("b") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Offer B annual salary", value: v.e, onChange: set("e") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Offer B monthly benefits", value: v.f, onChange: set("f") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Daily commuting cost", value: v.c, onChange: set("c") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Workdays per month", value: v.d, onChange: set("d") })
    ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
      /* @__PURE__ */ jsx12(Result, { title: "Offer A adjusted value", value: money9(scoreA) }),
      /* @__PURE__ */ jsx12(Result, { title: "Offer B adjusted value", value: money9(scoreB) }),
      /* @__PURE__ */ jsx12(Result, { title: "Financially stronger offer", value: scoreA === scoreB ? "Equal" : scoreA > scoreB ? "Offer A" : "Offer B", note: "Also compare culture, growth, stability, leave, and flexibility before deciding." })
    ] }) });
  }
  if (tool === "study-hours-planner") {
    const total = n3(v.a), days = Math.max(1, n3(v.b)), confidence = Math.min(100, n3(v.c)), daily = total / days * (1 + (100 - confidence) / 100);
    return /* @__PURE__ */ jsx12(ResultFirstShell, { resultColumns: 3, inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
      /* @__PURE__ */ jsx12(Field3, { label: "Syllabus study hours", value: v.a, onChange: set("a") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Days remaining", value: v.b, onChange: set("b") }),
      /* @__PURE__ */ jsx12(Field3, { label: "Current confidence (%)", value: v.c, onChange: set("c") })
    ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
      /* @__PURE__ */ jsx12(Result, { title: "Recommended daily study", value: `${daily.toFixed(1)} hours` }),
      /* @__PURE__ */ jsx12(Result, { title: "Weekly target", value: `${(daily * 7).toFixed(1)} hours` }),
      /* @__PURE__ */ jsx12(Result, { title: "Session plan", value: `${Math.ceil(daily * 2)} \xD7 30 min`, note: "Use short focused sessions and reserve the final 20% for revision." })
    ] }) });
  }
  const area = n3(v.a) * n3(v.b), coats = Math.max(1, n3(v.c)), coverage = Math.max(1, n3(v.d)), doors = n3(v.e), windows = n3(v.f), paint = Math.max(0, (area - doors * 1.9 - windows * 1.4) * coats / coverage);
  return /* @__PURE__ */ jsx12(ResultFirstShell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Field3, { label: "Room perimeter (metres)", value: v.a, onChange: set("a") }),
    /* @__PURE__ */ jsx12(Field3, { label: "Wall height (metres)", value: v.b, onChange: set("b") }),
    /* @__PURE__ */ jsx12(Field3, { label: "Number of coats", value: v.c, onChange: set("c") }),
    /* @__PURE__ */ jsx12(Field3, { label: "Coverage per litre (m\xB2)", value: v.d, onChange: set("d") }),
    /* @__PURE__ */ jsx12(Field3, { label: "Doors", value: v.e, onChange: set("e") }),
    /* @__PURE__ */ jsx12(Field3, { label: "Windows", value: v.f, onChange: set("f") })
  ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Result, { title: "Paint required", value: `${(paint * 1.1).toFixed(1)} litres`, note: "Includes a 10% allowance for waste and touch-ups." }),
    /* @__PURE__ */ jsx12(Result, { title: "Paintable wall area", value: `${Math.max(0, area - doors * 1.9 - windows * 1.4).toFixed(1)} m\xB2` })
  ] }) });
}
function MessageRewriter() {
  const [text, setText] = useState12("Send this today. You are already late and this is causing problems.");
  const [workflow, setWorkflow] = useState12("Angry Message to Professional Message");
  const [tone, setTone] = useState12("Professional");
  const [recipient, setRecipient] = useState12("");
  const [goal, setGoal] = useState12("Confirm the delivery time");
  const output = useMemo12(() => {
    let clean3 = text.trim().replace(/\b(asap|immediately|right now)\b/gi, "as soon as practical").replace(/you (?:are|'re) (?:already )?late/gi, "the expected timeline has passed").replace(/this is (?:causing|creating) problems/gi, "this is affecting the schedule").replace(/this is (?:ridiculous|unacceptable|terrible)/gi, "this situation needs prompt attention").replace(/you (?:never|always)/gi, "there have been occasions when").replace(/\bfix it\b/gi, "please help resolve it").replace(/!+/g, ".").replace(/\s+/g, " ").trim();
    if (!clean3) return "";
    clean3 = clean3.charAt(0).toUpperCase() + clean3.slice(1);
    const name = recipient.trim() ? ` ${recipient.trim()}` : "";
    const greeting = workflow === "Polite Email Rewriter" ? `Subject: ${goal.trim() || "Follow-up"}

Dear${name || " Sir/Madam"},` : `Assalamu Alaikum${name},`;
    const context = workflow === "Angry Message to Professional Message" ? "I\u2019m writing to address this constructively. " : "";
    const request = goal.trim() ? ` Could you please ${goal.trim().replace(/^[A-Z]/, (c) => c.toLowerCase())}?` : tone === "Firm" ? " Please confirm the next step and completion time." : " Please let me know how we can move forward.";
    const close = tone === "Firm" ? "I would appreciate a clear update by the agreed deadline." : "Thank you for your time and assistance.";
    return `${greeting}

${context}${clean3}${request}

${close}

Regards`;
  }, [text, workflow, tone, recipient, goal]);
  return /* @__PURE__ */ jsx12(StackedShell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Select2, { label: "Rewriter workflow", value: workflow, onChange: setWorkflow, options: ["Polite Email Rewriter", "Angry Message to Professional Message", "General Professional Rewrite"] }),
    /* @__PURE__ */ jsx12(Area2, { label: "Original message", value: text, onChange: setText }),
    /* @__PURE__ */ jsxs12("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx12(Field3, { label: "Recipient name (optional)", value: recipient, onChange: setRecipient, type: "text" }),
      /* @__PURE__ */ jsx12(Select2, { label: "Tone", value: tone, onChange: setTone, options: ["Professional", "Polite", "Firm"] })
    ] }),
    /* @__PURE__ */ jsx12(Field3, { label: "Desired outcome", value: goal, onChange: setGoal, type: "text" }),
    /* @__PURE__ */ jsx12("p", { className: "text-xs leading-5 text-gray-500", children: "The rewriter softens hostile phrasing while preserving the factual request. Review names, dates and commitments before sending." })
  ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Area2, { label: "Rewritten professional message", value: output, onChange: () => {
    }, rows: 13 }),
    /* @__PURE__ */ jsx12(Copy, { text: output })
  ] }) });
}
function WhatsAppReplyGenerator() {
  const [incoming, setIncoming] = useState12("Hi, is this product available and how much does it cost?");
  const [context, setContext] = useState12("Customer enquiry");
  const [tone, setTone] = useState12("Friendly professional");
  const [length, setLength] = useState12("Short");
  const [language, setLanguage] = useState12("English");
  const [details, setDetails] = useState12("The product is available. Price: \u09F31,250. Delivery takes 2\u20133 working days.");
  const [customer, setCustomer] = useState12("");
  const [product, setProduct] = useState12("");
  const [phone, setPhone] = useState12("");
  const [business, setBusiness] = useState12("");
  const [signature, setSignature] = useState12("");
  const [activePreset, setActivePreset] = useState12("in-stock");
  const [reply, setReply] = useState12("");
  const [recent, setRecent] = useState12([]);
  const [notice, setNotice] = useState12("");
  const [storageReady, setStorageReady] = useState12(false);
  const presets = [
    { id: "in-stock", label: "In stock", labelBn: "\u09B8\u09CD\u099F\u0995\u09C7 \u0986\u099B\u09C7", type: "Price or availability", en: "The product is currently available. Price: [add price]. Delivery takes [add delivery time].", bn: "\u09AA\u09A3\u09CD\u09AF\u099F\u09BF \u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8\u09C7 \u09B8\u09CD\u099F\u0995\u09C7 \u0986\u099B\u09C7\u0964 \u09AE\u09C2\u09B2\u09CD\u09AF: [\u09AE\u09C2\u09B2\u09CD\u09AF \u09B2\u09BF\u0996\u09C1\u09A8]\u0964 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09B9\u09A4\u09C7 [\u09B8\u09AE\u09AF\u09BC \u09B2\u09BF\u0996\u09C1\u09A8] \u09B8\u09AE\u09AF\u09BC \u09B2\u09BE\u0997\u09AC\u09C7\u0964" },
    { id: "out-of-stock", label: "Out of stock", labelBn: "\u09B8\u09CD\u099F\u0995 \u09B6\u09C7\u09B7", type: "Price or availability", en: "This product is currently out of stock. Expected restock: [add date]. I can notify you when it becomes available.", bn: "\u09AA\u09A3\u09CD\u09AF\u099F\u09BF \u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8\u09C7 \u09B8\u09CD\u099F\u0995\u09C7 \u09A8\u09C7\u0987\u0964 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09CD\u09AF \u09AA\u09C1\u09A8\u09B0\u09BE\u09AF\u09BC \u09B8\u09CD\u099F\u0995\u09C7 \u0986\u09B8\u09BE\u09B0 \u09A4\u09BE\u09B0\u09BF\u0996: [\u09A4\u09BE\u09B0\u09BF\u0996 \u09B2\u09BF\u0996\u09C1\u09A8]\u0964 \u09AA\u09A3\u09CD\u09AF\u099F\u09BF \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u0997\u09C7\u09B2\u09C7 \u0986\u09AE\u09B0\u09BE \u0986\u09AA\u09A8\u09BE\u0995\u09C7 \u099C\u09BE\u09A8\u09BE\u09A4\u09C7 \u09AA\u09BE\u09B0\u09BF\u0964" },
    { id: "confirmed", label: "Order confirmed", labelBn: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4", type: "Order confirmation", en: "Your order has been confirmed. Order number: [add number]. Expected delivery: [add date].", bn: "\u0986\u09AA\u09A8\u09BE\u09B0 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u099F\u09BF \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A8\u09AE\u09CD\u09AC\u09B0: [\u09A8\u09AE\u09CD\u09AC\u09B0 \u09B2\u09BF\u0996\u09C1\u09A8]\u0964 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09CD\u09AF \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09B0 \u09A4\u09BE\u09B0\u09BF\u0996: [\u09A4\u09BE\u09B0\u09BF\u0996 \u09B2\u09BF\u0996\u09C1\u09A8]\u0964" },
    { id: "on-way", label: "On the way", labelBn: "\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u099A\u09B2\u099B\u09C7", type: "Delivery update", en: "Your order is on the way. Tracking information: [add tracking link or number].", bn: "\u0986\u09AA\u09A8\u09BE\u09B0 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u099F\u09BF \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09B0 \u09AA\u09A5\u09C7 \u09B0\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u09A4\u09A5\u09CD\u09AF: [\u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u09B2\u09BF\u0982\u0995 \u09AC\u09BE \u09A8\u09AE\u09CD\u09AC\u09B0 \u09B2\u09BF\u0996\u09C1\u09A8]\u0964" },
    { id: "payment", label: "Payment details", labelBn: "\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09A4\u09A5\u09CD\u09AF", type: "Customer enquiry", en: "You can pay using [add payment method]. Payment details: [add account or instructions].", bn: "\u0986\u09AA\u09A8\u09BF [\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF \u09B2\u09BF\u0996\u09C1\u09A8]-\u098F\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09A4\u09A5\u09CD\u09AF: [\u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F \u09AC\u09BE \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09A8\u09BE \u09B2\u09BF\u0996\u09C1\u09A8]\u0964" },
    { id: "complaint", label: "Resolve complaint", labelBn: "\u0985\u09AD\u09BF\u09AF\u09CB\u0997 \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8", type: "Complaint response", en: "I\u2019m sorry about this experience. Please share your order number and a photo or video of the issue so we can resolve it quickly.", bn: "\u098F\u0987 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0986\u09AE\u09B0\u09BE \u0986\u09A8\u09CD\u09A4\u09B0\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u09A6\u09C1\u0983\u0996\u09BF\u09A4\u0964 \u09A6\u09CD\u09B0\u09C1\u09A4 \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A8\u09AE\u09CD\u09AC\u09B0 \u098F\u09AC\u0982 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE\u099F\u09BF\u09B0 \u098F\u0995\u099F\u09BF \u099B\u09AC\u09BF \u09AC\u09BE \u09AD\u09BF\u09A1\u09BF\u0993 \u09AA\u09BE\u09A0\u09BE\u09A8\u0964" }
  ];
  useEffect12(() => {
    if (!activePreset) return;
    const preset = presets.find((item) => item.id === activePreset);
    if (preset) setDetails(language === "\u09AC\u09BE\u0982\u09B2\u09BE" ? preset.bn : preset.en);
  }, [language, activePreset]);
  useEffect12(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("contra-whatsapp-reply") || "{}");
      if (saved.business) setBusiness(saved.business);
      if (saved.signature) setSignature(saved.signature);
      if (saved.language) setLanguage(saved.language);
      if (Array.isArray(saved.recent)) setRecent(saved.recent.slice(0, 5));
    } catch {
    }
    setStorageReady(true);
  }, []);
  useEffect12(() => {
    if (!storageReady) return;
    localStorage.setItem("contra-whatsapp-reply", JSON.stringify({ business, signature, language, recent }));
  }, [business, signature, language, recent, storageReady]);
  const generated = useMemo12(() => {
    if (!incoming.trim()) return "";
    const isBn = language === "\u09AC\u09BE\u0982\u09B2\u09BE";
    const namedCustomer = customer.trim() ? ` ${customer.trim()}` : "";
    const open = isBn ? tone === "Warm" ? `\u0986\u09B8\u09B8\u09BE\u09B2\u09BE\u09AE\u09C1 \u0986\u09B2\u09BE\u0987\u0995\u09C1\u09AE${namedCustomer}! \u09AF\u09CB\u0997\u09BE\u09AF\u09CB\u0997 \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964` : tone === "Direct" ? `\u0986\u09B8\u09B8\u09BE\u09B2\u09BE\u09AE\u09C1 \u0986\u09B2\u09BE\u0987\u0995\u09C1\u09AE${namedCustomer}\u0964` : `\u0986\u09B8\u09B8\u09BE\u09B2\u09BE\u09AE\u09C1 \u0986\u09B2\u09BE\u0987\u0995\u09C1\u09AE${namedCustomer}, \u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09BE\u09B0\u09CD\u09A4\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964` : tone === "Warm" ? `Assalamu Alaikum${namedCustomer}! Thanks so much for reaching out.` : tone === "Direct" ? `Assalamu Alaikum${namedCustomer}.` : `Assalamu Alaikum${namedCustomer}, thank you for your message.`;
    const supplied = details.trim();
    const fallback = {
      "Customer enquiry": ["I\u2019d be happy to help with your enquiry.", "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09AC\u09BF\u09B7\u09DF\u09C7 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09A4\u09C7 \u09AA\u09C7\u09B0\u09C7 \u0986\u09A8\u09A8\u09CD\u09A6\u09BF\u09A4 \u09B9\u09AC\u0964"],
      "Price or availability": ["I\u2019ll confirm the latest price and availability for you.", "\u0986\u09AE\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09B0\u09CD\u09AC\u09B6\u09C7\u09B7 \u09AE\u09C2\u09B2\u09CD\u09AF \u0993 \u09B8\u09CD\u099F\u0995\u09C7\u09B0 \u09A4\u09A5\u09CD\u09AF \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u099B\u09BF\u0964"],
      "Order confirmation": ["Your order details have been received and are being confirmed.", "\u0986\u09AA\u09A8\u09BE\u09B0 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u09C7\u09B0 \u09A4\u09A5\u09CD\u09AF \u09AA\u09BE\u0993\u09DF\u09BE \u0997\u09C7\u099B\u09C7 \u098F\u09AC\u0982 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09BE \u09B9\u099A\u09CD\u099B\u09C7\u0964"],
      "Delivery update": ["I\u2019m checking the delivery status and will update you shortly.", "\u0986\u09AE\u09BF \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09B0 \u0985\u09AC\u09B8\u09CD\u09A5\u09BE \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u099B\u09BF \u098F\u09AC\u0982 \u09B6\u09BF\u0997\u0997\u09BF\u09B0\u0987 \u099C\u09BE\u09A8\u09BE\u099A\u09CD\u099B\u09BF\u0964"],
      "Complaint response": ["I\u2019m sorry about this experience. We\u2019re reviewing the issue and will help resolve it.", "\u098F\u0987 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0986\u09AE\u09B0\u09BE \u09A6\u09C1\u0983\u0996\u09BF\u09A4\u0964 \u09AC\u09BF\u09B7\u09DF\u099F\u09BF \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09C7 \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8\u09C7 \u09B8\u09B9\u09BE\u09DF\u09A4\u09BE \u0995\u09B0\u099B\u09BF\u0964"],
      "Supplier reply": ["Thank you for the update. Please share the relevant price, lead time, and shipping details.", "\u0986\u09AA\u09A1\u09C7\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964 \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u09AE\u09C2\u09B2\u09CD\u09AF, \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4\u09BF\u09B0 \u09B8\u09AE\u09DF \u0993 \u09B6\u09BF\u09AA\u09BF\u0982\u09DF\u09C7\u09B0 \u09A4\u09A5\u09CD\u09AF \u09A6\u09BF\u09A8\u0964"],
      "Delayed reply": ["Sorry for the delayed response, and thank you for your patience.", "\u09A6\u09C7\u09B0\u09BF\u09A4\u09C7 \u0989\u09A4\u09CD\u09A4\u09B0 \u09A6\u09C7\u0993\u09DF\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A6\u09C1\u0983\u0996\u09BF\u09A4 \u098F\u09AC\u0982 \u0985\u09AA\u09C7\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964"],
      "General reply": ["Thank you for the information.", "\u09A4\u09A5\u09CD\u09AF \u09A6\u09C7\u0993\u09DF\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964"]
    };
    const mainText = supplied || fallback[context]?.[isBn ? 1 : 0] || fallback["General reply"][isBn ? 1 : 0];
    const productLine = product.trim() ? isBn ? `\u09AA\u09A3\u09CD\u09AF: ${product.trim()}\u0964` : `Product: ${product.trim()}.` : "";
    const main = [productLine, mainText].filter(Boolean).join(" ");
    const close = isBn ? tone === "Direct" ? "\u09AA\u09CD\u09B0\u09DF\u09CB\u099C\u09A8\u09C7 \u0986\u09B0\u0993 \u09A4\u09A5\u09CD\u09AF \u099C\u09BE\u09A8\u09BE\u09A8\u0964" : "\u0986\u09B0 \u0995\u09CB\u09A8\u09CB \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09A5\u09BE\u0995\u09B2\u09C7 \u09A8\u09BF\u09B0\u09CD\u09A6\u09CD\u09AC\u09BF\u09A7\u09BE\u09DF \u099C\u09BE\u09A8\u09BE\u09AC\u09C7\u09A8\u0964 \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964" : tone === "Direct" ? "Let me know if you need anything else." : "Please let me know if you have any other questions. Thank you!";
    const signOff = [signature.trim(), business.trim()].filter(Boolean).join(isBn ? "\n" : "\n");
    if (length === "Very short") return `${open} ${main}${signOff ? `
${signOff}` : ""}`;
    if (length === "Detailed") {
      const reassurance = isBn ? "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09DF\u09CB\u099C\u09A8 \u0985\u09A8\u09C1\u09AF\u09BE\u09DF\u09C0 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09AA\u09A6\u0995\u09CD\u09B7\u09C7\u09AA\u09C7 \u0986\u09AE\u09B0\u09BE \u09B8\u09B9\u09BE\u09DF\u09A4\u09BE \u0995\u09B0\u09AC\u0964" : "We\u2019ll be happy to help with the next step based on what you need.";
      return `${open}

${main}

${reassurance}

${close}${signOff ? `

${signOff}` : ""}`;
    }
    return `${open}

${main}

${close}${signOff ? `

${signOff}` : ""}`;
  }, [incoming, context, tone, length, language, details, customer, product, business, signature]);
  useEffect12(() => setReply(generated), [generated]);
  const remember = (text) => {
    if (!text.trim()) return;
    setRecent((old) => [text, ...old.filter((item) => item !== text)].slice(0, 5));
  };
  const copyReply = async () => {
    if (!reply.trim()) return;
    await navigator.clipboard.writeText(reply);
    remember(reply);
    setNotice("Reply copied");
    setTimeout(() => setNotice(""), 1400);
  };
  const openWhatsApp = async () => {
    if (!reply.trim()) return;
    await navigator.clipboard.writeText(reply);
    remember(reply);
    const digits = phone.replace(/\D/g, "");
    window.open(digits ? `https://wa.me/${digits}?text=${encodeURIComponent(reply)}` : `https://wa.me/?text=${encodeURIComponent(reply)}`, "_blank", "noopener,noreferrer");
  };
  return /* @__PURE__ */ jsx12(StackedShell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsxs12("div", { children: [
      /* @__PURE__ */ jsx12("p", { className: "mb-2 text-sm font-medium text-gray-700", children: "Quick replies" }),
      /* @__PURE__ */ jsx12("div", { className: "flex flex-wrap gap-2", children: presets.map((preset) => /* @__PURE__ */ jsx12("button", { type: "button", className: `rounded-full border px-3 py-1.5 text-xs font-medium hover:border-gray-900 hover:text-gray-950 ${activePreset === preset.id ? "border-gray-900 bg-gray-950 text-white" : "border-gray-300 bg-white text-gray-700"}`, onClick: () => {
        setActivePreset(preset.id);
        setContext(preset.type);
        setDetails(language === "\u09AC\u09BE\u0982\u09B2\u09BE" ? preset.bn : preset.en);
      }, children: language === "\u09AC\u09BE\u0982\u09B2\u09BE" ? preset.labelBn : preset.label }, preset.id)) })
    ] }),
    /* @__PURE__ */ jsx12(Area2, { label: "Message you received", value: incoming, onChange: setIncoming, rows: 5, placeholder: "Paste the WhatsApp message here" }),
    /* @__PURE__ */ jsx12(Select2, { label: "Reply type", value: context, onChange: setContext, options: ["Customer enquiry", "Price or availability", "Order confirmation", "Delivery update", "Complaint response", "Supplier reply", "Delayed reply", "General reply"] }),
    /* @__PURE__ */ jsxs12("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx12(Field3, { type: "text", label: "Customer name (optional)", value: customer, onChange: setCustomer }),
      /* @__PURE__ */ jsx12(Field3, { type: "text", label: "Product or order (optional)", value: product, onChange: setProduct })
    ] }),
    /* @__PURE__ */ jsx12(Area2, { label: "Facts to include", value: details, onChange: (value) => {
      setActivePreset("");
      setDetails(value);
    }, rows: 4, placeholder: language === "\u09AC\u09BE\u0982\u09B2\u09BE" ? "\u09B8\u09A0\u09BF\u0995 \u09AE\u09C2\u09B2\u09CD\u09AF, \u09B8\u09CD\u099F\u0995, \u09A4\u09BE\u09B0\u09BF\u0996, \u09A8\u09C0\u09A4\u09BF \u09AC\u09BE \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09AA\u09A6\u0995\u09CD\u09B7\u09C7\u09AA \u09B2\u09BF\u0996\u09C1\u09A8" : "Add the correct price, availability, date, policy, or next step" }),
    /* @__PURE__ */ jsxs12("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx12(Select2, { label: "Tone", value: tone, onChange: setTone, options: ["Friendly professional", "Warm", "Direct"] }),
      /* @__PURE__ */ jsx12(Select2, { label: "Length", value: length, onChange: setLength, options: ["Very short", "Short", "Detailed"] })
    ] }),
    /* @__PURE__ */ jsx12(Select2, { label: "Reply language", value: language, onChange: setLanguage, options: ["English", "\u09AC\u09BE\u0982\u09B2\u09BE"] }),
    /* @__PURE__ */ jsxs12("details", { className: "rounded-xl border border-gray-200 bg-gray-50 p-4", children: [
      /* @__PURE__ */ jsx12("summary", { className: "cursor-pointer text-sm font-semibold text-gray-900", children: "Saved business defaults" }),
      /* @__PURE__ */ jsxs12("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsx12(Field3, { type: "text", label: "Business name", value: business, onChange: setBusiness, placeholder: "Added to replies automatically" }),
        /* @__PURE__ */ jsx12(Field3, { type: "text", label: "Your name or signature", value: signature, onChange: setSignature, placeholder: "For example: Nirob, Customer Support" }),
        /* @__PURE__ */ jsx12(Field3, { type: "tel", label: "Customer WhatsApp number (optional)", value: phone, onChange: setPhone, placeholder: "Include country code, for example 8801\u2026" }),
        /* @__PURE__ */ jsx12("p", { className: "text-xs text-gray-500", children: "Business name, signature and language are saved on this device. Customer numbers are never saved." })
      ] })
    ] }),
    /* @__PURE__ */ jsx12("p", { className: "text-xs leading-5 text-gray-500", children: "Your message stays in this browser. Review prices, dates and promises before sending." })
  ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Area2, { label: "Edit your WhatsApp-ready reply", value: reply, onChange: setReply, rows: 10 }),
    /* @__PURE__ */ jsx12("div", { className: "rounded-2xl rounded-tl-sm bg-[#e7ffdb] p-4 text-sm leading-6 text-gray-900 shadow-sm whitespace-pre-wrap", children: reply || "Your reply will appear here." }),
    /* @__PURE__ */ jsxs12("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsx12("button", { className: buttonClass, disabled: !reply.trim(), onClick: copyReply, children: notice || "Copy reply" }),
      /* @__PURE__ */ jsx12("button", { className: "rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50", disabled: !reply.trim(), onClick: openWhatsApp, children: "Copy & open WhatsApp" })
    ] }),
    recent.length > 0 && /* @__PURE__ */ jsxs12("div", { className: "border-t border-gray-200 pt-4", children: [
      /* @__PURE__ */ jsxs12("div", { className: "mb-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx12("p", { className: "text-sm font-semibold text-gray-900", children: "Recent replies" }),
        /* @__PURE__ */ jsx12("button", { className: "text-xs font-medium text-gray-500 hover:text-gray-900", onClick: () => setRecent([]), children: "Clear" })
      ] }),
      /* @__PURE__ */ jsx12("div", { className: "space-y-2", children: recent.map((item, index) => /* @__PURE__ */ jsx12("button", { type: "button", className: "block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-left text-xs leading-5 text-gray-600 hover:border-gray-400", onClick: () => setReply(item), children: item.length > 150 ? `${item.slice(0, 150)}\u2026` : item }, `${item}-${index}`)) })
    ] })
  ] }) });
}
function SupplierMessage() {
  const [product, setProduct] = useState12("Stainless steel water bottle");
  const [qty, setQty] = useState12("500");
  const [purpose, setPurpose] = useState12("Quotation request");
  const output = `Hello,

We are interested in ${product} for an initial order of ${qty} units. ${purpose === "Quotation request" ? "Please share your best unit price, MOQ, production lead time, packaging details, sample cost, and available shipping terms." : purpose === "Sample request" ? "Please confirm sample availability, sample cost, courier charge, specifications, and delivery time." : "Please provide the current production and shipping status, including the expected completion date."}

Please also send recent product photos and applicable certifications.

Thank you.`;
  return /* @__PURE__ */ jsx12(StackedShell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Field3, { type: "text", label: "Product", value: product, onChange: setProduct }),
    /* @__PURE__ */ jsx12(Field3, { label: "Quantity", value: qty, onChange: setQty }),
    /* @__PURE__ */ jsx12(Select2, { label: "Message purpose", value: purpose, onChange: setPurpose, options: ["Quotation request", "Sample request", "Order follow-up"] })
  ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Area2, { label: "Supplier-ready message", value: output, onChange: () => {
    }, rows: 16 }),
    /* @__PURE__ */ jsx12(Copy, { text: output })
  ] }) });
}
function ScriptTimer() {
  const [text, setText] = useState12("Paste your video script here to calculate its speaking time.");
  const [wpm, setWpm] = useState12("135");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0, seconds = wpm ? Math.round(words / n3(wpm) * 60) : 0;
  return /* @__PURE__ */ jsx12(Shell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Area2, { label: "Video script", value: text, onChange: setText, rows: 12 }),
    /* @__PURE__ */ jsx12(Field3, { label: "Speaking speed (words/minute)", value: wpm, onChange: setWpm })
  ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Result, { title: "Estimated duration", value: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` }),
    /* @__PURE__ */ jsx12(Result, { title: "Word count", value: `${words}` }),
    /* @__PURE__ */ jsx12(Result, { title: "Recommended scene count", value: `${Math.max(1, Math.ceil(seconds / 8))}`, note: "Based on a visual change approximately every eight seconds." })
  ] }) });
}
function CaptionFormatter() {
  const [text, setText] = useState12("New collection available now. Order today. #fashion #bangladesh");
  const [width, setWidth] = useState12("42");
  const output = useMemo12(() => text.split(/\s+/).reduce((lines2, word) => {
    const last = lines2.at(-1) || "";
    if (!last || last.length + word.length + 1 > n3(width)) lines2.push(word);
    else lines2[lines2.length - 1] = `${last} ${word}`;
    return lines2;
  }, []).join("\n"), [text, width]);
  return /* @__PURE__ */ jsx12(Shell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Area2, { label: "Caption", value: text, onChange: setText }),
    /* @__PURE__ */ jsx12(Field3, { label: "Maximum characters per line", value: width, onChange: setWidth })
  ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Area2, { label: "Formatted caption", value: output, onChange: () => {
    } }),
    /* @__PURE__ */ jsx12(Copy, { text: output })
  ] }) });
}
function Teleprompter() {
  const [text, setText] = useState12("Welcome. Paste your script here, then start the teleprompter.");
  const [speed, setSpeed] = useState12("35");
  const [notice, setNotice] = useState12("");
  const screen = useRef2(null);
  const start = () => {
    screen.current?.requestFullscreen();
    const el = screen.current;
    if (!el) return;
    const id = setInterval(() => {
      el.scrollTop += 1;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) clearInterval(id);
    }, Math.max(15, 80 - n3(speed)));
  };
  const copyScript = async () => {
    await navigator.clipboard.writeText(text);
    setNotice("Script copied\u2014paste it into any writing, recording or collaboration platform.");
    setTimeout(() => setNotice(""), 2200);
  };
  const downloadScript = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "teleprompter-script.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setNotice("Text file downloaded.");
    setTimeout(() => setNotice(""), 2200);
  };
  const printScript = () => {
    const popup = window.open("", "_blank", "width=900,height=800");
    if (!popup) {
      setNotice("Allow pop-ups to print or save the script as PDF.");
      return;
    }
    const safe = text.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
    popup.document.write(`<!doctype html><html><head><title>Teleprompter script</title><style>@page{margin:20mm}body{font-family:Arial,sans-serif;font-size:16px;line-height:1.7;text-align:justify;white-space:pre-wrap;color:#111}p{text-align-last:left}</style></head><body><p>${safe}</p><script>addEventListener('load',()=>print())</script></body></html>`);
    popup.document.close();
  };
  const importScript = (file) => {
    if (!file) return;
    if (file.type && file.type !== "text/plain") {
      setNotice("Choose a plain .txt file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result || ""));
      setNotice("Text file imported.");
      setTimeout(() => setNotice(""), 2200);
    };
    reader.readAsText(file);
  };
  return /* @__PURE__ */ jsxs12("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx12(Area2, { label: "Script", value: text, onChange: setText, rows: 8 }),
    /* @__PURE__ */ jsxs12("div", { className: "flex flex-wrap items-end gap-3", children: [
      /* @__PURE__ */ jsx12(Field3, { label: "Scroll speed", value: speed, onChange: setSpeed }),
      /* @__PURE__ */ jsx12("button", { className: `${buttonClass} h-[42px] shrink-0`, onClick: start, children: "Start full screen" })
    ] }),
    /* @__PURE__ */ jsxs12("section", { className: "rounded-2xl border border-gray-200 bg-gray-50 p-4", children: [
      /* @__PURE__ */ jsxs12("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs12("div", { children: [
          /* @__PURE__ */ jsx12("h3", { className: "text-sm font-semibold text-gray-900", children: "Use this script on another platform" }),
          /* @__PURE__ */ jsx12("p", { className: "mt-1 text-xs leading-5 text-gray-500", children: "Copy it into another app, download a reusable text file, or open the print dialog and choose Save as PDF." })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx12("button", { className: buttonClass, disabled: !text.trim(), onClick: copyScript, children: "Copy script" }),
          /* @__PURE__ */ jsx12("button", { className: "rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50", disabled: !text.trim(), onClick: downloadScript, children: "Download .txt" }),
          /* @__PURE__ */ jsx12("button", { className: "rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50", disabled: !text.trim(), onClick: printScript, children: "Print / Save PDF" }),
          /* @__PURE__ */ jsxs12("label", { className: "cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100", children: [
            "Import .txt",
            /* @__PURE__ */ jsx12("input", { type: "file", accept: "text/plain,.txt", className: "hidden", onChange: (event) => importScript(event.target.files?.[0]) })
          ] })
        ] })
      ] }),
      notice && /* @__PURE__ */ jsx12("p", { role: "status", className: "mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800", children: notice })
    ] }),
    /* @__PURE__ */ jsx12("div", { ref: screen, style: { textAlign: "justify", textAlignLast: "left" }, className: "h-[460px] overflow-y-auto whitespace-pre-wrap bg-black px-[10vw] py-[35vh] text-4xl font-semibold leading-relaxed text-white", children: text })
  ] });
}
function UtmBuilder() {
  const [base, setBase] = useState12("https://example.com/product");
  const [source, setSource] = useState12("facebook");
  const [medium, setMedium] = useState12("social");
  const [campaign, setCampaign] = useState12("summer-sale");
  const output = useMemo12(() => {
    try {
      const u = new URL(base);
      u.searchParams.set("utm_source", source);
      u.searchParams.set("utm_medium", medium);
      u.searchParams.set("utm_campaign", campaign);
      return u.toString();
    } catch {
      return "Enter a valid URL including https://";
    }
  }, [base, source, medium, campaign]);
  return /* @__PURE__ */ jsx12(Shell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Field3, { type: "url", label: "Destination URL", value: base, onChange: setBase }),
    /* @__PURE__ */ jsx12(Field3, { type: "text", label: "Campaign source", value: source, onChange: setSource }),
    /* @__PURE__ */ jsx12(Field3, { type: "text", label: "Campaign medium", value: medium, onChange: setMedium }),
    /* @__PURE__ */ jsx12(Field3, { type: "text", label: "Campaign name", value: campaign, onChange: setCampaign })
  ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Area2, { label: "Tagged campaign URL", value: output, onChange: () => {
    }, rows: 5 }),
    /* @__PURE__ */ jsx12(Copy, { text: output })
  ] }) });
}
function SocialPreview() {
  const [url, setUrl] = useState12("example.com");
  const [title2, setTitle] = useState12("A clear, compelling page title");
  const [desc, setDesc] = useState12("Write a concise description that tells people what they will find after clicking.");
  const [image, setImage] = useState12("");
  return /* @__PURE__ */ jsx12(Shell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12(Field3, { type: "text", label: "Domain", value: url, onChange: setUrl }),
    /* @__PURE__ */ jsx12(Field3, { type: "text", label: "Share title", value: title2, onChange: setTitle }),
    /* @__PURE__ */ jsx12(Area2, { label: "Description", value: desc, onChange: setDesc, rows: 4 }),
    /* @__PURE__ */ jsx12(Field3, { type: "url", label: "Image URL (optional)", value: image, onChange: setImage })
  ] }), result: /* @__PURE__ */ jsxs12("div", { className: "overflow-hidden rounded-xl border border-gray-300 bg-white", children: [
    image ? /* @__PURE__ */ jsx12("img", { src: image, alt: "Social preview", className: "aspect-[1.91/1] w-full object-cover" }) : /* @__PURE__ */ jsx12("div", { className: "aspect-[1.91/1] bg-gradient-to-br from-gray-100 to-gray-200" }),
    /* @__PURE__ */ jsxs12("div", { className: "p-4", children: [
      /* @__PURE__ */ jsx12("p", { className: "text-xs uppercase text-gray-500", children: url }),
      /* @__PURE__ */ jsx12("h3", { className: "mt-1 font-bold text-gray-950", children: title2 }),
      /* @__PURE__ */ jsx12("p", { className: "mt-1 line-clamp-2 text-sm text-gray-600", children: desc })
    ] })
  ] }) });
}
function ImageTool({ tool }) {
  const [src, setSrc] = useState12("");
  const [preset, setPreset] = useState12(tool === "passport-photo-maker" ? "600\xD7600" : "1080\xD71080");
  const canvas = useRef2(null);
  const load = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSrc(String(reader.result));
    reader.readAsDataURL(file);
  };
  const render = () => {
    const c = canvas.current;
    if (!c || !src) return;
    const [w, h] = preset.split("\xD7").map(Number);
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      const scale = tool === "passport-photo-maker" ? Math.max(w / img.width, h / img.height) : Math.min(w / img.width, h / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      if (tool === "product-photo-cleaner") {
        const data = ctx.getImageData(0, 0, w, h);
        for (let i = 0; i < data.data.length; i += 4) {
          const avg = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3;
          if (avg > 225) {
            data.data[i] = 255;
            data.data[i + 1] = 255;
            data.data[i + 2] = 255;
          }
        }
        ctx.putImageData(data, 0, 0);
      }
    };
    img.src = src;
  };
  const download2 = () => {
    render();
    setTimeout(() => {
      const a = document.createElement("a");
      a.download = `${tool}.png`;
      a.href = canvas.current?.toDataURL("image/png") || "";
      a.click();
    }, 80);
  };
  return /* @__PURE__ */ jsx12(Shell, { inputs: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsxs12("label", { className: "block", children: [
      /* @__PURE__ */ jsx12("span", { className: "mb-1 block text-sm font-medium text-gray-700", children: "Choose image" }),
      /* @__PURE__ */ jsx12("input", { className: fieldClass, type: "file", accept: "image/*", onChange: (e) => load(e.target.files?.[0]) })
    ] }),
    /* @__PURE__ */ jsx12(Select2, { label: "Output size", value: preset, onChange: setPreset, options: tool === "passport-photo-maker" ? ["600\xD7600", "413\xD7531", "600\xD7800"] : ["1080\xD71080", "1080\xD71350", "1080\xD71920", "1200\xD7628"] }),
    /* @__PURE__ */ jsx12("button", { className: buttonClass, disabled: !src, onClick: render, children: "Generate preview" })
  ] }), result: /* @__PURE__ */ jsxs12(Fragment4, { children: [
    /* @__PURE__ */ jsx12("canvas", { ref: canvas, className: "max-h-[500px] max-w-full border border-gray-200 bg-white" }),
    /* @__PURE__ */ jsx12("button", { className: buttonClass, disabled: !src, onClick: download2, children: "Download PNG" }),
    /* @__PURE__ */ jsx12("p", { className: "text-xs text-gray-500", children: "Processed locally in your browser. Product cleaning normalizes near-white backgrounds; complex background removal may require manual refinement." })
  ] }) });
}

// src/components/PdfDocumentStudio.tsx
import { useState as useState14 } from "react";

// src/components/LetterheadDesigner.tsx
import { useEffect as useEffect13, useRef as useRef3, useState as useState13 } from "react";
import { Fragment as Fragment5, jsx as jsx13, jsxs as jsxs13 } from "react/jsx-runtime";
var initial = { template: "geometric", paper: "A4", mode: "letter", primary: "#173f73", secondary: "#f59e0b", company: "Your Company", tagline: "Ideas. Service. Results.", address: "House 57, Road 22, Dhaka, Bangladesh", phone: "+880 1700-000000", email: "hello@example.com", website: "https://example.com", recipient: "Recipient Name", recipientDetails: "Company Name\nStreet address\nCity, Country", date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), reference: "REF-001", subject: "Subject of your business letter", body: "Dear Recipient,\n\nUse this space for your formal business letter. The layout preserves generous writing space while keeping your identity visible and consistent.\n\nAdd additional paragraphs as needed. The exported PDF is designed for professional email delivery and office printing.\n\nSincerely,", sender: "Your Name", designation: "Managing Director", logo: "", watermark: "", signature: "", watermarkOpacity: "8" };
var input = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var templates = ["corporate", "geometric", "elegant", "bold", "minimal"];
var labels = { corporate: "Corporate", geometric: "Geometric", elegant: "Elegant", bold: "Bold", minimal: "Minimal" };
var urlOk = (value) => !value || /^https?:\/\//i.test(value);
function LetterheadDesigner() {
  const [draft, setDraft] = useState13(initial);
  const [scale, setScale] = useState13(1);
  const [busy, setBusy] = useState13(false);
  const holder = useRef3(null);
  const fileRefs = { logo: useRef3(null), watermark: useRef3(null), signature: useRef3(null) };
  const width = draft.paper === "A4" ? 794 : 816, height = draft.paper === "A4" ? 1123 : 1056;
  useEffect13(() => {
    try {
      const saved = localStorage.getItem("contra-letterhead-draft");
      if (saved) setDraft({ ...initial, ...JSON.parse(saved) });
    } catch {
    }
  }, []);
  useEffect13(() => {
    const id = setTimeout(() => localStorage.setItem("contra-letterhead-draft", JSON.stringify(draft)), 300);
    return () => clearTimeout(id);
  }, [draft]);
  useEffect13(() => {
    const el = holder.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);
  const patch = (key, value) => setDraft((old) => ({ ...old, [key]: value }));
  const upload = (key, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2e6) {
      alert("Choose a PNG, JPG, WebP, or SVG smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch(key, String(reader.result || ""));
    reader.readAsDataURL(file);
  };
  const capture = async () => {
    const paper = document.querySelector("[data-letterhead-paper]");
    if (!paper) throw new Error("Preview is unavailable.");
    const previous = paper.style.transform;
    paper.style.transform = "none";
    try {
      await document.fonts.ready;
      const { default: html2canvas } = await import("html2canvas");
      return await html2canvas(paper, { scale: 3, useCORS: true, backgroundColor: "#fff", logging: false });
    } finally {
      paper.style.transform = previous;
    }
  };
  const downloadPdf = async () => {
    setBusy(true);
    try {
      const canvas = await capture();
      const { jsPDF } = await import("jspdf");
      const format = draft.paper === "A4" ? "a4" : "letter";
      const pdf = new jsPDF({ unit: "mm", format, orientation: "portrait" });
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pw, ph, void 0, "FAST");
      if (urlOk(draft.website) && draft.website) pdf.link(12, ph - 13, 65, 6, { url: draft.website });
      if (draft.email) pdf.link(80, ph - 13, 55, 6, { url: `mailto:${draft.email}` });
      pdf.save(`${draft.company.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "company"}-letterhead.pdf`);
    } finally {
      setBusy(false);
    }
  };
  const print = async () => {
    const popup = window.open("", "_blank", "width=950,height=900");
    if (!popup) {
      alert("Allow pop-ups to print the letterhead.");
      return;
    }
    popup.document.write('<p style="font-family:Arial;padding:20px">Preparing print preview\u2026</p>');
    try {
      const canvas = await capture(), image = canvas.toDataURL("image/png");
      popup.document.open();
      popup.document.write(`<!doctype html><html><head><title>${draft.company} Letterhead</title><style>@page{size:auto;margin:10mm}html,body{margin:0}img{display:block;width:100%;height:auto;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body><img src="${image}" onload="setTimeout(()=>print(),60)"></body></html>`);
      popup.document.close();
    } catch {
      popup.close();
      alert("Could not prepare print preview.");
    }
  };
  const valid = urlOk(draft.website);
  return /* @__PURE__ */ jsxs13("div", { className: "min-w-0 space-y-5 overflow-hidden", children: [
    /* @__PURE__ */ jsxs13("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3", children: [
      /* @__PURE__ */ jsxs13("div", { children: [
        /* @__PURE__ */ jsx13("b", { className: "text-sm text-gray-900", children: "Professional Letterhead Designer" }),
        /* @__PURE__ */ jsx13("p", { className: "text-xs text-gray-500", children: "Draft saves automatically on this device" })
      ] }),
      /* @__PURE__ */ jsxs13("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx13("button", { onClick: print, className: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold", children: "Print" }),
        /* @__PURE__ */ jsx13("button", { disabled: busy || !valid, onClick: downloadPdf, className: "rounded-lg bg-gray-950 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50", children: busy ? "Creating PDF\u2026" : "Download PDF" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "grid min-w-0 items-start gap-5", children: [
      /* @__PURE__ */ jsxs13("section", { className: "order-last min-w-0 space-y-5 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:p-5", children: [
        /* @__PURE__ */ jsxs13(Block, { title: "Choose a design", children: [
          /* @__PURE__ */ jsx13("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5", children: templates.map((item) => /* @__PURE__ */ jsxs13("button", { onClick: () => patch("template", item), className: `min-w-0 rounded-lg border p-2 text-[10px] font-semibold ${draft.template === item ? "border-gray-950 bg-gray-950 text-white" : "border-gray-200 text-gray-600"}`, children: [
            /* @__PURE__ */ jsx13("span", { style: { background: `linear-gradient(135deg,${draft.primary} 55%,${draft.secondary} 55%)` }, className: "mb-1 block h-8 rounded" }),
            /* @__PURE__ */ jsx13("span", { className: "block truncate", children: labels[item] })
          ] }, item)) }),
          /* @__PURE__ */ jsxs13("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx13(Select3, { label: "Paper", value: draft.paper, set: (v) => patch("paper", v), options: ["A4", "Letter"] }),
            /* @__PURE__ */ jsx13(Select3, { label: "Document mode", value: draft.mode, set: (v) => patch("mode", v), options: [["letter", "Completed letter"], ["blank", "Blank letterhead"]] })
          ] }),
          /* @__PURE__ */ jsxs13("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx13(Color, { label: "Primary", value: draft.primary, set: (v) => patch("primary", v) }),
            /* @__PURE__ */ jsx13(Color, { label: "Secondary", value: draft.secondary, set: (v) => patch("secondary", v) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs13(Block, { title: "Company identity", children: [
          /* @__PURE__ */ jsx13(Field4, { label: "Company name", value: draft.company, set: (v) => patch("company", v) }),
          /* @__PURE__ */ jsx13(Field4, { label: "Tagline", value: draft.tagline, set: (v) => patch("tagline", v) }),
          /* @__PURE__ */ jsx13(Area3, { label: "Address", value: draft.address, set: (v) => patch("address", v), rows: 2 }),
          /* @__PURE__ */ jsxs13("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsx13(Field4, { label: "Phone", value: draft.phone, set: (v) => patch("phone", v) }),
            /* @__PURE__ */ jsx13(Field4, { label: "Email", value: draft.email, set: (v) => patch("email", v), type: "email" })
          ] }),
          /* @__PURE__ */ jsx13(Field4, { label: "Website", value: draft.website, set: (v) => patch("website", v), type: "url", error: !valid ? "Use a complete http:// or https:// URL." : "" })
        ] }),
        /* @__PURE__ */ jsxs13(Block, { title: "Brand images", children: [
          /* @__PURE__ */ jsx13(Upload, { label: "Company logo", image: draft.logo, click: () => fileRefs.logo.current?.click(), remove: () => patch("logo", "") }),
          /* @__PURE__ */ jsx13("input", { hidden: true, ref: fileRefs.logo, type: "file", accept: "image/*", onChange: (e) => upload("logo", e.target.files?.[0]) }),
          /* @__PURE__ */ jsx13(Upload, { label: "Watermark", image: draft.watermark, click: () => fileRefs.watermark.current?.click(), remove: () => patch("watermark", "") }),
          /* @__PURE__ */ jsx13("input", { hidden: true, ref: fileRefs.watermark, type: "file", accept: "image/*", onChange: (e) => upload("watermark", e.target.files?.[0]) }),
          draft.watermark && /* @__PURE__ */ jsx13(Field4, { label: "Watermark opacity (%)", value: draft.watermarkOpacity, set: (v) => patch("watermarkOpacity", v), type: "number" }),
          /* @__PURE__ */ jsx13(Upload, { label: "Signature image", image: draft.signature, click: () => fileRefs.signature.current?.click(), remove: () => patch("signature", "") }),
          /* @__PURE__ */ jsx13("input", { hidden: true, ref: fileRefs.signature, type: "file", accept: "image/*", onChange: (e) => upload("signature", e.target.files?.[0]) })
        ] }),
        draft.mode === "letter" && /* @__PURE__ */ jsxs13(Fragment5, { children: [
          /* @__PURE__ */ jsxs13(Block, { title: "Recipient and reference", children: [
            /* @__PURE__ */ jsx13(Field4, { label: "Recipient", value: draft.recipient, set: (v) => patch("recipient", v) }),
            /* @__PURE__ */ jsx13(Area3, { label: "Recipient details", value: draft.recipientDetails, set: (v) => patch("recipientDetails", v), rows: 3 }),
            /* @__PURE__ */ jsxs13("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsx13(Field4, { label: "Date", value: draft.date, set: (v) => patch("date", v), type: "date" }),
              /* @__PURE__ */ jsx13(Field4, { label: "Reference", value: draft.reference, set: (v) => patch("reference", v) })
            ] }),
            /* @__PURE__ */ jsx13(Field4, { label: "Subject", value: draft.subject, set: (v) => patch("subject", v) })
          ] }),
          /* @__PURE__ */ jsxs13(Block, { title: "Letter content", children: [
            /* @__PURE__ */ jsx13(Area3, { label: "Body", value: draft.body, set: (v) => patch("body", v), rows: 10 }),
            /* @__PURE__ */ jsxs13("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsx13(Field4, { label: "Sender name", value: draft.sender, set: (v) => patch("sender", v) }),
              /* @__PURE__ */ jsx13(Field4, { label: "Designation", value: draft.designation, set: (v) => patch("designation", v) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs13("section", { className: "order-first min-w-0 overflow-hidden rounded-2xl bg-gray-100 p-3 sm:p-5", children: [
        /* @__PURE__ */ jsxs13("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx13("h3", { className: "text-sm font-bold text-gray-900", children: "Live preview" }),
          /* @__PURE__ */ jsxs13("span", { className: "text-xs text-gray-500", children: [
            draft.paper,
            " \xB7 ",
            labels[draft.template]
          ] })
        ] }),
        /* @__PURE__ */ jsx13("div", { ref: holder, style: { height: height * scale, maxWidth: width, width: "100%" }, className: "mx-auto overflow-hidden", children: /* @__PURE__ */ jsx13(LetterheadPaper, { draft, width, height, scale }) })
      ] })
    ] })
  ] });
}
function LetterheadPaper({ draft, width, height, scale }) {
  const geometric = draft.template === "geometric", bold = draft.template === "bold", elegant = draft.template === "elegant", minimal = draft.template === "minimal";
  return /* @__PURE__ */ jsxs13("article", { "data-letterhead-paper": true, style: { width, height, transform: `scale(${scale})`, transformOrigin: "top left", fontFamily: elegant ? "Georgia,serif" : "Arial,sans-serif" }, className: "relative overflow-hidden bg-white text-[#20242b] shadow-xl", children: [
    geometric && /* @__PURE__ */ jsxs13(Fragment5, { children: [
      /* @__PURE__ */ jsx13("i", { style: { background: draft.primary }, className: "absolute left-0 right-0 top-0 h-3" }),
      /* @__PURE__ */ jsx13("i", { style: { background: draft.secondary }, className: "absolute right-0 top-3 h-2 w-[32%]" }),
      /* @__PURE__ */ jsx13("i", { style: { background: draft.primary }, className: "absolute left-0 top-3 h-28 w-3" }),
      /* @__PURE__ */ jsx13("i", { style: { background: draft.secondary }, className: "absolute left-3 top-3 h-16 w-2" }),
      /* @__PURE__ */ jsx13("i", { style: { background: draft.primary }, className: "absolute bottom-0 right-0 h-24 w-3" }),
      /* @__PURE__ */ jsx13("i", { style: { background: draft.secondary }, className: "absolute bottom-0 right-3 h-12 w-2" })
    ] }),
    bold && /* @__PURE__ */ jsxs13(Fragment5, { children: [
      /* @__PURE__ */ jsx13("i", { style: { background: draft.primary }, className: "absolute left-0 top-0 h-full w-5" }),
      /* @__PURE__ */ jsx13("i", { style: { background: draft.secondary }, className: "absolute bottom-0 left-0 h-8 w-full" })
    ] }),
    elegant && /* @__PURE__ */ jsx13("div", { style: { borderColor: draft.primary }, className: "absolute inset-8 border" }),
    minimal && /* @__PURE__ */ jsx13("div", { style: { background: draft.primary }, className: "absolute left-12 right-12 top-32 h-px" }),
    /* @__PURE__ */ jsxs13("header", { style: draft.template === "corporate" ? { background: draft.primary, color: "white" } : {}, className: `relative z-10 flex items-start justify-between gap-8 ${draft.template === "corporate" ? "px-14 py-10" : "px-14 pt-12"}`, children: [
      /* @__PURE__ */ jsxs13("div", { className: "flex max-w-[58%] items-center gap-4", children: [
        draft.logo ? /* @__PURE__ */ jsx13("img", { src: draft.logo, alt: "Logo", className: "max-h-20 max-w-36 object-contain" }) : /* @__PURE__ */ jsx13("div", { style: { background: draft.secondary, color: draft.primary }, className: "grid h-16 w-16 shrink-0 place-items-center text-xl font-black", children: draft.company.slice(0, 2).toUpperCase() }),
        /* @__PURE__ */ jsxs13("div", { children: [
          /* @__PURE__ */ jsx13("h2", { className: "text-2xl font-bold leading-tight", children: draft.company }),
          /* @__PURE__ */ jsx13("p", { className: `mt-1 text-[11px] ${draft.template === "corporate" ? "text-white/75" : "text-gray-500"}`, children: draft.tagline })
        ] })
      ] }),
      /* @__PURE__ */ jsxs13("div", { style: geometric ? { borderColor: draft.secondary } : {}, className: `max-w-[38%] text-right text-[10px] leading-4 ${draft.template === "corporate" ? "text-white/80" : geometric ? "border-l-2 pl-3 text-gray-600" : "text-gray-500"}`, children: [
        /* @__PURE__ */ jsx13("p", { children: draft.phone }),
        /* @__PURE__ */ jsx13("p", { children: draft.email }),
        /* @__PURE__ */ jsx13("p", { className: "break-all", children: draft.website })
      ] })
    ] }),
    draft.watermark && /* @__PURE__ */ jsx13("img", { src: draft.watermark, alt: "", style: { opacity: Math.max(0, Math.min(30, Number(draft.watermarkOpacity) || 0)) / 100 }, className: "absolute left-1/2 top-1/2 z-0 max-h-[42%] max-w-[50%] -translate-x-1/2 -translate-y-1/2 object-contain" }),
    draft.mode === "letter" && /* @__PURE__ */ jsxs13("main", { className: "relative z-10 px-16 pb-32 pt-16 text-[12px] leading-[1.65]", children: [
      /* @__PURE__ */ jsxs13("div", { className: "flex justify-between gap-12", children: [
        /* @__PURE__ */ jsxs13("div", { children: [
          /* @__PURE__ */ jsx13("b", { className: "block text-[13px]", children: draft.recipient }),
          /* @__PURE__ */ jsx13("p", { className: "whitespace-pre-line text-gray-500", children: draft.recipientDetails })
        ] }),
        /* @__PURE__ */ jsxs13("dl", { className: "shrink-0 text-right text-[10px]", children: [
          /* @__PURE__ */ jsxs13("div", { children: [
            /* @__PURE__ */ jsx13("dt", { className: "inline font-bold", children: "Date: " }),
            /* @__PURE__ */ jsx13("dd", { className: "inline", children: draft.date })
          ] }),
          /* @__PURE__ */ jsxs13("div", { children: [
            /* @__PURE__ */ jsx13("dt", { className: "inline font-bold", children: "Reference: " }),
            /* @__PURE__ */ jsx13("dd", { className: "inline", children: draft.reference })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx13("h3", { style: { color: draft.primary, borderColor: draft.secondary }, className: "mt-8 border-b pb-2 text-[14px] font-bold", children: draft.subject }),
      /* @__PURE__ */ jsx13("p", { className: "mt-6 whitespace-pre-line", children: draft.body }),
      /* @__PURE__ */ jsxs13("div", { className: "mt-7", children: [
        draft.signature && /* @__PURE__ */ jsx13("img", { src: draft.signature, alt: "Signature", className: "mb-1 max-h-14 max-w-32 object-contain" }),
        /* @__PURE__ */ jsx13("b", { className: "block", children: draft.sender }),
        /* @__PURE__ */ jsx13("span", { className: "text-gray-500", children: draft.designation })
      ] })
    ] }),
    /* @__PURE__ */ jsx13("footer", { className: `absolute left-0 right-0 z-20 px-14 ${elegant ? "bottom-8" : bold ? "bottom-7" : geometric ? "bottom-4" : "bottom-0 pb-6"}`, children: /* @__PURE__ */ jsxs13("div", { style: { borderColor: draft.secondary }, className: `flex items-start justify-between gap-5 border-t px-3 py-2 text-[10px] leading-4 text-gray-600 ${elegant || bold ? "bg-white/95" : ""}`, children: [
      /* @__PURE__ */ jsx13("p", { className: "max-w-[48%]", children: draft.address }),
      /* @__PURE__ */ jsxs13("p", { className: "max-w-[48%] text-right", children: [
        /* @__PURE__ */ jsxs13("span", { children: [
          draft.phone,
          " \xA0 \u2022 \xA0 ",
          draft.email
        ] }),
        /* @__PURE__ */ jsx13("span", { className: "block break-all", children: draft.website })
      ] })
    ] }) })
  ] });
}
function Block({ title: title2, children }) {
  return /* @__PURE__ */ jsxs13("fieldset", { className: "min-w-0 space-y-3 border-b border-gray-100 pb-5", children: [
    /* @__PURE__ */ jsx13("legend", { className: "mb-3 text-sm font-bold text-gray-900", children: title2 }),
    children
  ] });
}
function Field4({ label, value, set, type = "text", error }) {
  return /* @__PURE__ */ jsxs13("label", { className: "block min-w-0", children: [
    /* @__PURE__ */ jsx13("span", { className: "mb-1 block text-xs font-medium text-gray-600", children: label }),
    /* @__PURE__ */ jsx13("input", { className: `${input} min-w-0 ${error ? "border-red-400" : ""}`, type, value, onChange: (e) => set(e.target.value) }),
    error && /* @__PURE__ */ jsx13("span", { className: "mt-1 block text-xs text-red-600", children: error })
  ] });
}
function Area3({ label, value, set, rows }) {
  return /* @__PURE__ */ jsxs13("label", { className: "block", children: [
    /* @__PURE__ */ jsx13("span", { className: "mb-1 block text-xs font-medium text-gray-600", children: label }),
    /* @__PURE__ */ jsx13("textarea", { className: input, rows, value, onChange: (e) => set(e.target.value) })
  ] });
}
function Select3({ label, value, set, options }) {
  return /* @__PURE__ */ jsxs13("label", { className: "block", children: [
    /* @__PURE__ */ jsx13("span", { className: "mb-1 block text-xs font-medium text-gray-600", children: label }),
    /* @__PURE__ */ jsx13(DropdownControl, { className: input, ariaLabel: label, value, onChange: set, options: options.map((o) => {
      const [value2, label2] = typeof o === "string" ? [o, o] : o;
      return { value: value2, label: label2 };
    }) })
  ] });
}
function Color({ label, value, set }) {
  return /* @__PURE__ */ jsxs13("label", { className: "min-w-0", children: [
    /* @__PURE__ */ jsx13("span", { className: "mb-1 block text-xs font-medium text-gray-600", children: label }),
    /* @__PURE__ */ jsxs13("div", { className: "flex min-w-0 gap-2", children: [
      /* @__PURE__ */ jsx13("input", { type: "color", value, onChange: (e) => set(e.target.value), className: "h-10 w-12 shrink-0 rounded border p-1" }),
      /* @__PURE__ */ jsx13("input", { value, onChange: (e) => set(e.target.value), className: `${input} min-w-0 font-mono uppercase` })
    ] })
  ] });
}
function Upload({ label, image, click, remove }) {
  return /* @__PURE__ */ jsxs13("div", { children: [
    /* @__PURE__ */ jsx13("span", { className: "mb-1 block text-xs font-medium text-gray-600", children: label }),
    /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2", children: [
      image && /* @__PURE__ */ jsx13("img", { src: image, alt: "", className: "h-10 w-16 rounded border bg-white object-contain" }),
      /* @__PURE__ */ jsx13("button", { onClick: click, className: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold", children: image ? "Replace" : "Choose image" }),
      image && /* @__PURE__ */ jsx13("button", { onClick: remove, className: "text-xs text-red-600", children: "Remove" })
    ] })
  ] });
}

// src/components/PdfDocumentStudio.tsx
import { Fragment as Fragment6, jsx as jsx14, jsxs as jsxs14 } from "react/jsx-runtime";
var modes = [
  { id: "merge", label: "Merge PDFs", group: "PDF editor" },
  { id: "split", label: "Split / extract", group: "PDF editor" },
  { id: "editor", label: "Rotate / remove / reorder", group: "PDF editor" },
  { id: "compress", label: "Optimize PDF", group: "PDF editor" },
  { id: "images-to-pdf", label: "Images to PDF", group: "Convert" },
  { id: "pdf-to-images", label: "PDF to images", group: "Convert" },
  { id: "numbering", label: "Page numbering", group: "Pages" },
  { id: "margin", label: "Margin adder / fixer", group: "Pages" },
  { id: "signature", label: "Signature tool", group: "Pages" },
  { id: "form", label: "Form filler", group: "Pages" },
  { id: "bank-cleaner", label: "Bank statement cleaner", group: "Specialized" },
  { id: "compare", label: "Compare documents", group: "Specialized" },
  { id: "resume", label: "Resume to PDF", group: "Generate" },
  { id: "letterhead", label: "Letterhead", group: "Generate" },
  { id: "certificate", label: "Certificate", group: "Generate" },
  { id: "minutes", label: "Meeting minutes", group: "Generate" },
  { id: "proposal", label: "Branded proposal", group: "Generate" }
];
var modeHelp = {
  merge: "Combine multiple PDF files into one document in the order selected.",
  split: "Extract selected pages or page ranges into a new PDF.",
  editor: "Keep, remove, reorder and rotate pages without changing their visible quality.",
  compress: "Clean metadata and optimize the PDF object structure without lowering image quality.",
  "images-to-pdf": "Place JPG or PNG images onto print-ready PDF pages.",
  "pdf-to-images": "Render every PDF page as high-resolution PNG or JPEG images and download a ZIP.",
  numbering: "Add consistent page numbers at your chosen corner or edge.",
  margin: "Scale and centre each page inside a safe printer margin while preserving its paper size.",
  signature: "Stamp a PNG or JPEG signature image onto selected PDF pages.",
  form: "Complete existing fillable text fields and flatten them into a shareable copy.",
  "bank-cleaner": "Remove metadata, flatten fields and retain only the statement pages you choose; transaction data is never altered.",
  compare: "Compare the extracted text of two PDFs and list sentences that were added, removed or changed.",
  resume: "Generate a professional PDF r\xE9sum\xE9 with optional clickable website, GitHub and portfolio links.",
  letterhead: "Design a branded, multi-colour letterhead with a live print-ready preview.",
  certificate: "Create a branded certificate of achievement with recipient, title, date and message.",
  minutes: "Turn meeting notes, decisions and actions into a clean PDF record.",
  proposal: "Create a branded proposal PDF with author, date, overview and structured content."
};
var input2 = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var button = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50";
var MAX_FILE_BYTES = 75 * 1024 * 1024;
var MAX_TOTAL_BYTES = 150 * 1024 * 1024;
var MAX_FILES = 20;
var mm = (value) => value * 72 / 25.4;
var safeName = (name) => name.replace(/\.pdf$/i, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "") || "document";
var formatBytes = (bytes) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
var documentCopy = {
  en: { language: "English", title: "Document title", name: "Name / organization", subtitle: "Subtitle", content: "Content", date: "Document date", heading: { resume: "Professional profile", certificate: "Certificate of achievement", minutes: "Meeting minutes", proposal: "Proposal overview" } },
  bn: { language: "\u09AC\u09BE\u0982\u09B2\u09BE", title: "\u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09B6\u09BF\u09B0\u09CB\u09A8\u09BE\u09AE", name: "\u09A8\u09BE\u09AE / \u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8", subtitle: "\u0989\u09AA\u09B6\u09BF\u09B0\u09CB\u09A8\u09BE\u09AE", content: "\u09AC\u09BF\u09B8\u09CD\u09A4\u09BE\u09B0\u09BF\u09A4 \u09B2\u09C7\u0996\u09BE", date: "\u09A1\u0995\u09C1\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09A4\u09BE\u09B0\u09BF\u0996", heading: { resume: "\u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u09AA\u09B0\u09BF\u099A\u09BF\u09A4\u09BF", certificate: "\u0985\u09B0\u09CD\u099C\u09A8\u09C7\u09B0 \u09B8\u09A8\u09A6", minutes: "\u09B8\u09AD\u09BE \u0995\u09BE\u09B0\u09CD\u09AF\u09AC\u09BF\u09AC\u09B0\u09A3\u09C0", proposal: "\u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09BE\u09AC\u09A8\u09BE\u09B0 \u09B8\u09BE\u09B0\u09B8\u0982\u0995\u09CD\u09B7\u09C7\u09AA" } }
};
function documentPreset(mode, language, date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) {
  const presets = {
    en: { resume: { title: "Professional Resume", name: "Your Name", subtitle: "Professional title and summary", body: "PROFILE\nWrite a focused professional summary.\n\nEXPERIENCE\nRole \u2014 Company \u2014 Dates\nDescribe measurable responsibilities and achievements.\n\nEDUCATION\nDegree \u2014 Institution \u2014 Year\n\nSKILLS\nAdd relevant skills separated by commas." }, certificate: { title: "Certificate of Achievement", name: "Recipient Name", subtitle: "Presented in recognition of outstanding achievement", body: "This certificate is proudly presented for commitment, excellence, and successful completion." }, minutes: { title: "Meeting Minutes", name: "Organization or meeting owner", subtitle: "Meeting topic \xB7 location or online", body: "ATTENDEES\nList attendees and roles.\n\nAGENDA\n1. First agenda item\n2. Second agenda item\n\nDECISIONS\nRecord decisions and their owners.\n\nACTION ITEMS\nOwner \u2014 Task \u2014 Due date\n\nNEXT MEETING\nAdd the proposed date and time." }, proposal: { title: "Project Proposal", name: "Your company or author", subtitle: "Prepared for client or project name", body: "EXECUTIVE SUMMARY\nState the client need and your proposed outcome.\n\nSCOPE\nList the work and deliverables.\n\nTIMELINE\nDescribe phases and target dates.\n\nINVESTMENT\nAdd pricing, payment schedule, and validity.\n\nNEXT STEPS\nExplain how the client can approve and begin." } },
    bn: { resume: { title: "\u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u099C\u09C0\u09AC\u09A8\u09AC\u09C3\u09A4\u09CD\u09A4\u09BE\u09A8\u09CD\u09A4", name: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09A8\u09BE\u09AE", subtitle: "\u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u09AA\u09A6\u09AC\u09BF \u0993 \u09B8\u0982\u0995\u09CD\u09B7\u09BF\u09AA\u09CD\u09A4 \u09AA\u09B0\u09BF\u099A\u09BF\u09A4\u09BF", body: "\u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u09AA\u09B0\u09BF\u099A\u09BF\u09A4\u09BF\n\u0986\u09AA\u09A8\u09BE\u09B0 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE \u0993 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u09B0 \u09B8\u0982\u0995\u09CD\u09B7\u09BF\u09AA\u09CD\u09A4 \u09AC\u09BF\u09AC\u09B0\u09A3 \u09B2\u09BF\u0996\u09C1\u09A8\u0964\n\n\u0995\u09B0\u09CD\u09AE-\u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\n\u09AA\u09A6\u09AC\u09BF \u2014 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8 \u2014 \u09B8\u09AE\u09AF\u09BC\u0995\u09BE\u09B2\n\u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC \u0993 \u09AA\u09B0\u09BF\u09AE\u09BE\u09AA\u09AF\u09CB\u0997\u09CD\u09AF \u0985\u09B0\u09CD\u099C\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8\u0964\n\n\u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u0997\u09A4 \u09AF\u09CB\u0997\u09CD\u09AF\u09A4\u09BE\n\u09A1\u09BF\u0997\u09CD\u09B0\u09BF \u2014 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8 \u2014 \u09B8\u09BE\u09B2\n\n\u09A6\u0995\u09CD\u09B7\u09A4\u09BE\n\u09AA\u09CD\u09B0\u09BE\u09B8\u0999\u09CD\u0997\u09BF\u0995 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE\u0997\u09C1\u09B2\u09CB \u0995\u09AE\u09BE \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B2\u09BF\u0996\u09C1\u09A8\u0964" }, certificate: { title: "\u0985\u09B0\u09CD\u099C\u09A8\u09C7\u09B0 \u09B8\u09A8\u09A6", name: "\u09AA\u09CD\u09B0\u09BE\u09AA\u0995\u09C7\u09B0 \u09A8\u09BE\u09AE", subtitle: "\u09AC\u09BF\u09B6\u09C7\u09B7 \u0985\u09B0\u09CD\u099C\u09A8\u09C7\u09B0 \u09B8\u09CD\u09AC\u09C0\u0995\u09C3\u09A4\u09BF\u09B8\u09CD\u09AC\u09B0\u09C2\u09AA \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09B2\u09CB", body: "\u09A8\u09BF\u09B7\u09CD\u09A0\u09BE, \u0989\u09CE\u0995\u09B0\u09CD\u09B7 \u098F\u09AC\u0982 \u09B8\u09AB\u09B2 \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8\u09A4\u09BE\u09B0 \u09B8\u09CD\u09AC\u09C0\u0995\u09C3\u09A4\u09BF\u09B8\u09CD\u09AC\u09B0\u09C2\u09AA \u098F\u0987 \u09B8\u09A8\u09A6 \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09BE \u09B9\u09B2\u09CB\u0964" }, minutes: { title: "\u09B8\u09AD\u09BE \u0995\u09BE\u09B0\u09CD\u09AF\u09AC\u09BF\u09AC\u09B0\u09A3\u09C0", name: "\u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8 \u09AC\u09BE \u09B8\u09AD\u09BE\u09B0 \u0986\u09AF\u09BC\u09CB\u099C\u0995", subtitle: "\u09B8\u09AD\u09BE\u09B0 \u09AC\u09BF\u09B7\u09AF\u09BC \xB7 \u09B8\u09CD\u09A5\u09BE\u09A8 \u09AC\u09BE \u0985\u09A8\u09B2\u09BE\u0987\u09A8", body: "\u0989\u09AA\u09B8\u09CD\u09A5\u09BF\u09A4 \u09B8\u09A6\u09B8\u09CD\u09AF\n\u09B8\u09A6\u09B8\u09CD\u09AF\u09A6\u09C7\u09B0 \u09A8\u09BE\u09AE \u0993 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC \u09B2\u09BF\u0996\u09C1\u09A8\u0964\n\n\u0986\u09B2\u09CB\u099A\u09CD\u09AF\u09B8\u09C2\u099A\u09BF\n\u09E7. \u09AA\u09CD\u09B0\u09A5\u09AE \u0986\u09B2\u09CB\u099A\u09CD\u09AF \u09AC\u09BF\u09B7\u09AF\u09BC\n\u09E8. \u09A6\u09CD\u09AC\u09BF\u09A4\u09C0\u09AF\u09BC \u0986\u09B2\u09CB\u099A\u09CD\u09AF \u09AC\u09BF\u09B7\u09AF\u09BC\n\n\u09B8\u09BF\u09A6\u09CD\u09A7\u09BE\u09A8\u09CD\u09A4\n\u0997\u09C3\u09B9\u09C0\u09A4 \u09B8\u09BF\u09A6\u09CD\u09A7\u09BE\u09A8\u09CD\u09A4 \u0993 \u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09AA\u09CD\u09B0\u09BE\u09AA\u09CD\u09A4 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF \u09B2\u09BF\u0996\u09C1\u09A8\u0964\n\n\u0995\u09B0\u09A3\u09C0\u09AF\u09BC \u0995\u09BE\u099C\n\u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09AA\u09CD\u09B0\u09BE\u09AA\u09CD\u09A4 \u2014 \u0995\u09BE\u099C \u2014 \u09B6\u09C7\u09B7 \u09A4\u09BE\u09B0\u09BF\u0996\n\n\u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09B8\u09AD\u09BE\n\u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09BE\u09AC\u09BF\u09A4 \u09A4\u09BE\u09B0\u09BF\u0996 \u0993 \u09B8\u09AE\u09AF\u09BC \u09B2\u09BF\u0996\u09C1\u09A8\u0964" }, proposal: { title: "\u09AA\u09CD\u09B0\u0995\u09B2\u09CD\u09AA \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09BE\u09AC\u09A8\u09BE", name: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A8 \u09AC\u09BE \u09A8\u09BE\u09AE", subtitle: "\u0995\u09CD\u09B2\u09BE\u09AF\u09BC\u09C7\u09A8\u09CD\u099F \u09AC\u09BE \u09AA\u09CD\u09B0\u0995\u09B2\u09CD\u09AA\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4", body: "\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u09B9\u09C0 \u09B8\u09BE\u09B0\u09B8\u0982\u0995\u09CD\u09B7\u09C7\u09AA\n\u0995\u09CD\u09B2\u09BE\u09AF\u09BC\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8 \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09BE\u09AC\u09BF\u09A4 \u09AB\u09B2\u09BE\u09AB\u09B2 \u09B2\u09BF\u0996\u09C1\u09A8\u0964\n\n\u0995\u09BE\u099C\u09C7\u09B0 \u09AA\u09B0\u09BF\u09A7\u09BF\n\u0995\u09BE\u099C \u0993 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09C7\u09AC\u09B2\u0997\u09C1\u09B2\u09CB \u09A4\u09BE\u09B2\u09BF\u0995\u09BE\u09AD\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09C1\u09A8\u0964\n\n\u09B8\u09AE\u09AF\u09BC\u09B8\u09C2\u099A\u09BF\n\u09A7\u09BE\u09AA \u0993 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09CD\u09AF \u09A4\u09BE\u09B0\u09BF\u0996 \u09B2\u09BF\u0996\u09C1\u09A8\u0964\n\n\u09AC\u09BF\u09A8\u09BF\u09AF\u09BC\u09CB\u0997\n\u09AE\u09C2\u09B2\u09CD\u09AF, \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09AF\u09BC\u09B8\u09C2\u099A\u09BF \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09BE\u09AC\u09C7\u09B0 \u09AE\u09C7\u09AF\u09BC\u09BE\u09A6 \u09B2\u09BF\u0996\u09C1\u09A8\u0964\n\n\u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09AA\u09A6\u0995\u09CD\u09B7\u09C7\u09AA\n\u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09A8 \u0993 \u0995\u09BE\u099C \u09B6\u09C1\u09B0\u09C1\u09B0 \u09AA\u09CD\u09B0\u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09BE \u09B2\u09BF\u0996\u09C1\u09A8\u0964" } }
  };
  return { ...presets[language][mode], accent: "#111827", date, website: "", github: "", drive: "" };
}
function generatedDocumentError(doc, mode) {
  if (!doc.title.trim()) return "Add a document title.";
  if (!doc.name.trim()) return mode === "certificate" ? "Add the certificate recipient." : "Add a name or organization.";
  if (!doc.body.trim()) return "Add document content.";
  if (doc.body.length > 12e3) return "Keep document content below 12,000 characters.";
  if (mode === "resume" && ![doc.website, doc.github, doc.drive].every(validHttpUrl)) return "Professional links must begin with http:// or https://.";
  return null;
}
function validateDocumentFiles(files, acceptImages = false) {
  if (!files.length) return "Choose at least one file.";
  if (files.length > MAX_FILES) return `Choose no more than ${MAX_FILES} files at once.`;
  const oversized = files.find((file) => file.size > MAX_FILE_BYTES);
  if (oversized) return `${oversized.name} is larger than the ${formatBytes(MAX_FILE_BYTES)} per-file limit.`;
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_TOTAL_BYTES) return `The selected files total ${formatBytes(total)}. Keep one operation below ${formatBytes(MAX_TOTAL_BYTES)}.`;
  const invalid = files.find((file) => acceptImages ? !["image/jpeg", "image/png"].includes(file.type) : file.type !== "application/pdf");
  if (invalid) return acceptImages ? "Only JPG and PNG images are supported." : "Only PDF files are supported.";
  return null;
}
function download(bytes, name, type = "application/pdf") {
  const blob = new Blob([new Uint8Array(bytes)], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function parsePages(value, total) {
  const pages = /* @__PURE__ */ new Set();
  for (const part of value.split(",")) {
    const [a, b] = part.trim().split("-").map(Number);
    if (!a) continue;
    for (let i = a; i <= (b || a); i++) if (i >= 1 && i <= total) pages.add(i - 1);
  }
  return [...pages];
}
async function pdfjs() {
  const lib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  if (!lib.GlobalWorkerOptions.workerSrc) lib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();
  return lib;
}
async function extractText(file) {
  const lib = await pdfjs();
  const doc = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => "str" in item ? item.str : "").join(" "));
  }
  return pages;
}
async function renderBanglaDocument(doc, mode) {
  const { default: html2canvas } = await import("html2canvas");
  const page = document.createElement("article");
  Object.assign(page.style, { position: "fixed", left: "-10000px", top: "0", width: "794px", height: "1123px", boxSizing: "border-box", padding: mode === "certificate" ? "74px" : "68px", overflow: "hidden", background: "#fff", color: "#20242b", fontFamily: 'var(--font-hind-siliguri), "Hind Siliguri", sans-serif' });
  if (mode === "certificate") page.style.border = `10px double ${doc.accent}`;
  const header = document.createElement("div");
  Object.assign(header.style, { background: mode === "certificate" ? "transparent" : doc.accent, color: mode === "certificate" ? doc.accent : "#fff", margin: mode === "certificate" ? "0" : "-68px -68px 42px", padding: mode === "certificate" ? "36px 0 12px" : "38px 68px 30px", textAlign: mode === "certificate" ? "center" : "left", fontSize: mode === "certificate" ? "26px" : "30px", fontWeight: "700" });
  header.textContent = mode === "resume" ? doc.name : doc.title;
  page.append(header);
  const subtitle = document.createElement("div");
  Object.assign(subtitle.style, { fontSize: mode === "certificate" ? "21px" : "17px", fontWeight: "600", textAlign: mode === "certificate" ? "center" : "left", marginTop: mode === "certificate" ? "40px" : "0" });
  subtitle.textContent = doc.subtitle;
  page.append(subtitle);
  if (mode === "certificate") {
    const recipient = document.createElement("h1");
    Object.assign(recipient.style, { fontSize: "44px", textAlign: "center", margin: "65px 0 25px", color: "#111827" });
    recipient.textContent = doc.name;
    page.append(recipient);
  } else {
    const meta = document.createElement("p");
    Object.assign(meta.style, { fontSize: "15px", color: "#6b7280", margin: "12px 0 14px" });
    meta.textContent = `${doc.name}  \xB7  ${doc.date}`;
    page.append(meta);
    if (mode === "resume") {
      const links = document.createElement("div");
      Object.assign(links.style, { fontSize: "13px", color: "#2563eb", lineHeight: "1.7", marginBottom: "20px" });
      links.textContent = [doc.website, doc.github, doc.drive].filter(Boolean).join("  \xB7  ");
      page.append(links);
    }
  }
  const body = document.createElement("div");
  Object.assign(body.style, { whiteSpace: "pre-wrap", fontSize: mode === "certificate" ? "18px" : "16px", lineHeight: "1.65", textAlign: mode === "certificate" ? "center" : "left", margin: mode === "certificate" ? "40px auto 0" : "20px 0", maxWidth: mode === "certificate" ? "620px" : "none" });
  body.textContent = doc.body;
  page.append(body);
  if (mode === "certificate") {
    const date = document.createElement("p");
    Object.assign(date.style, { position: "absolute", bottom: "105px", left: "0", right: "0", textAlign: "center", fontSize: "16px" });
    date.textContent = doc.date;
    page.append(date);
  }
  document.body.append(page);
  try {
    await document.fonts.ready;
    return await html2canvas(page, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  } finally {
    page.remove();
  }
}
function PdfDocumentStudio({ invoiceUrl = "/invoice-generator" }) {
  const [mode, setMode] = useState14("merge");
  const [files, setFiles] = useState14([]);
  const [busy, setBusy] = useState14(false);
  const [status, setStatus] = useState14("");
  const [optimization, setOptimization] = useState14(null);
  const [range, setRange] = useState14("1");
  const [margin2, setMargin] = useState14("12");
  const [rotation, setRotation] = useState14("90");
  const [position, setPosition] = useState14("Bottom right");
  const [signature, setSignature] = useState14(null);
  const [formFields, setFormFields] = useState14([]);
  const [documentLanguage, setDocumentLanguage] = useState14("en");
  const [doc, setDoc] = useState14(() => documentPreset("resume", "en"));
  const [comparison, setComparison] = useState14("");
  const [imageDpi, setImageDpi] = useState14("300");
  const [imageFormat, setImageFormat] = useState14("PNG");
  const [pagePreviews, setPagePreviews] = useState14([]);
  const groups = [...new Set(modes.map((item) => item.group))];
  const primary = files[0];
  const selectMode = (next) => {
    setMode(next);
    setFiles([]);
    setStatus("");
    setOptimization(null);
    if (["resume", "certificate", "minutes", "proposal"].includes(next)) setDoc(documentPreset(next, documentLanguage));
  };
  const changeDocumentLanguage = (language) => {
    setDocumentLanguage(language);
    if (["resume", "certificate", "minutes", "proposal"].includes(mode)) setDoc(documentPreset(mode, language, doc.date));
  };
  const chooseFiles = (selected, images = false) => {
    pagePreviews.forEach((page) => URL.revokeObjectURL(page.url));
    setPagePreviews([]);
    setOptimization(null);
    setComparison("");
    const error = validateDocumentFiles(selected, images);
    if (error) {
      setFiles([]);
      setStatus(error);
      return;
    }
    setFiles(selected);
    setStatus(`${selected.length} file${selected.length === 1 ? "" : "s"} ready \xB7 ${formatBytes(selected.reduce((sum, file) => sum + file.size, 0))} total.`);
  };
  const fileInput = (multiple = false, accept = "application/pdf") => /* @__PURE__ */ jsxs14("label", { className: "block", children: [
    /* @__PURE__ */ jsx14("span", { className: "mb-1 block text-sm font-medium text-gray-700", children: multiple ? "Choose files" : "Choose file" }),
    /* @__PURE__ */ jsx14("input", { className: input2, type: "file", multiple, accept, onChange: (e) => chooseFiles(Array.from(e.target.files || []), accept !== "application/pdf") })
  ] });
  const run = async () => {
    setBusy(true);
    setStatus("Working locally\u2026");
    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
      if (mode === "merge") {
        const out = await PDFDocument.create();
        for (const file of files) {
          const src = await PDFDocument.load(await file.arrayBuffer());
          const copied = await out.copyPages(src, src.getPageIndices());
          copied.forEach((p) => out.addPage(p));
        }
        download(await out.save({ useObjectStreams: true }), "merged-document.pdf");
      } else if (mode === "split") {
        if (!primary) return;
        const src = await PDFDocument.load(await primary.arrayBuffer());
        const indexes = parsePages(range, src.getPageCount());
        const out = await PDFDocument.create();
        (await out.copyPages(src, indexes)).forEach((p) => out.addPage(p));
        download(await out.save(), `${safeName(primary.name)}-pages.pdf`);
      } else if (mode === "editor") {
        if (!primary) return;
        const src = await PDFDocument.load(await primary.arrayBuffer());
        const order = parsePages(range, src.getPageCount());
        const chosen = order.length ? order : src.getPageIndices();
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, chosen);
        copied.forEach((p) => {
          p.setRotation(degrees((p.getRotation().angle + Number(rotation)) % 360));
          out.addPage(p);
        });
        download(await out.save(), `${safeName(primary.name)}-edited.pdf`);
      } else if (mode === "compress") {
        if (!primary) return;
        const src = await PDFDocument.load(await primary.arrayBuffer());
        src.setTitle("");
        src.setAuthor("");
        src.setSubject("");
        src.setKeywords([]);
        src.setProducer("Contra PDF Studio");
        const optimized = await src.save({ useObjectStreams: true, addDefaultPage: false });
        setOptimization({ before: primary.size, after: optimized.length });
        download(optimized, `${safeName(primary.name)}-optimized.pdf`);
      } else if (mode === "images-to-pdf") {
        const out = await PDFDocument.create();
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const image = file.type === "image/png" ? await out.embedPng(bytes) : await out.embedJpg(bytes);
          const page = out.addPage([595.28, 841.89]);
          const scale = Math.min((page.getWidth() - mm(20)) / image.width, (page.getHeight() - mm(20)) / image.height);
          page.drawImage(image, { x: (page.getWidth() - image.width * scale) / 2, y: (page.getHeight() - image.height * scale) / 2, width: image.width * scale, height: image.height * scale });
        }
        download(await out.save(), "images.pdf");
      } else if (mode === "pdf-to-images") {
        if (!primary) return;
        pagePreviews.forEach((page) => URL.revokeObjectURL(page.url));
        setPagePreviews([]);
        const [{ default: JSZip }, lib] = await Promise.all([import("jszip"), pdfjs()]);
        const loaded = await lib.getDocument({ data: new Uint8Array(await primary.arrayBuffer()) }).promise;
        const zip = new JSZip();
        const previews = [];
        const png = imageFormat === "PNG", extension = png ? "png" : "jpg", mime = png ? "image/png" : "image/jpeg";
        for (let i = 1; i <= loaded.numPages; i++) {
          setStatus(`Rendering page ${i} of ${loaded.numPages} at ${imageDpi} DPI\u2026`);
          const page = await loaded.getPage(i);
          const viewport = page.getViewport({ scale: Number(imageDpi) / 72 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext("2d", { alpha: false });
          context.fillStyle = "#fff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvas, canvasContext: context, viewport }).promise;
          const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Could not render this page.")), mime, png ? void 0 : 0.98));
          const name = `${safeName(primary.name)}-page-${String(i).padStart(2, "0")}.${extension}`;
          zip.file(name, blob);
          previews.push({ url: URL.createObjectURL(blob), name, width: canvas.width, height: canvas.height });
          canvas.width = 1;
          canvas.height = 1;
        }
        setPagePreviews(previews);
        const archive = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
        downloadBlob(archive, `${safeName(primary.name)}-${imageDpi}dpi-images.zip`);
      } else if (mode === "numbering") {
        if (!primary) return;
        const src = await PDFDocument.load(await primary.arrayBuffer());
        const font = await src.embedFont(StandardFonts.Helvetica);
        src.getPages().forEach((p, i) => {
          const text = `${i + 1} / ${src.getPageCount()}`;
          const size = 10, x = position.includes("right") ? p.getWidth() - font.widthOfTextAtSize(text, size) - mm(12) : position.includes("left") ? mm(12) : (p.getWidth() - font.widthOfTextAtSize(text, size)) / 2;
          const y = position.includes("Top") ? p.getHeight() - mm(12) : mm(9);
          p.drawText(text, { x, y, size, font, color: rgb(0.25, 0.27, 0.3) });
        });
        download(await src.save(), `${safeName(primary.name)}-numbered.pdf`);
      } else if (mode === "margin") {
        if (!primary) return;
        const src = await PDFDocument.load(await primary.arrayBuffer());
        const out = await PDFDocument.create();
        for (const p of src.getPages()) {
          const { width, height } = p.getSize();
          const target = out.addPage([width, height]);
          const [embedded] = await out.embedPages([p]);
          const m = Math.min(mm(Number(margin2) || 0), Math.min(width, height) * 0.45);
          const scale = Math.max(0.1, Math.min((width - m * 2) / width, (height - m * 2) / height));
          target.drawPage(embedded, { x: (width - width * scale) / 2, y: (height - height * scale) / 2, width: width * scale, height: height * scale });
        }
        download(await out.save(), `${safeName(primary.name)}-margin-fixed.pdf`);
      } else if (mode === "signature") {
        if (!primary || !signature) return;
        const src = await PDFDocument.load(await primary.arrayBuffer());
        const bytes = await signature.arrayBuffer();
        const sig = signature.type === "image/png" ? await src.embedPng(bytes) : await src.embedJpg(bytes);
        const targets = range.toLowerCase() === "all" ? src.getPages() : parsePages(range, src.getPageCount()).map((i) => src.getPage(i));
        for (const p of targets) {
          const w = Math.min(mm(45), p.getWidth() * 0.3), h = w * sig.height / sig.width;
          p.drawImage(sig, { x: p.getWidth() - w - mm(14), y: mm(16), width: w, height: h });
        }
        download(await src.save(), `${safeName(primary.name)}-signed.pdf`);
      } else if (mode === "form") {
        if (!primary) return;
        const src = await PDFDocument.load(await primary.arrayBuffer());
        const form = src.getForm();
        for (const item of formFields) {
          try {
            form.getTextField(item.name).setText(item.value);
          } catch {
          }
        }
        form.flatten();
        download(await src.save(), `${safeName(primary.name)}-filled.pdf`);
      } else if (mode === "bank-cleaner") {
        if (!primary) return;
        const src = await PDFDocument.load(await primary.arrayBuffer());
        src.setTitle("Clean bank statement");
        src.setAuthor("");
        src.setCreator("");
        src.setSubject("");
        src.setKeywords([]);
        try {
          src.getForm().flatten();
        } catch {
        }
        const selected = parsePages(range, src.getPageCount());
        if (selected.length && selected.length < src.getPageCount()) {
          const out = await PDFDocument.create();
          (await out.copyPages(src, selected)).forEach((p) => out.addPage(p));
          download(await out.save({ useObjectStreams: true }), `${safeName(primary.name)}-clean.pdf`);
        } else download(await src.save({ useObjectStreams: true }), `${safeName(primary.name)}-clean.pdf`);
      } else if (mode === "compare") {
        if (files.length < 2) return;
        const [a, b] = await Promise.all([extractText(files[0]), extractText(files[1])]);
        const aa = a.join("\n").split(/\n|(?<=[.!?])\s+/), bb = b.join("\n").split(/\n|(?<=[.!?])\s+/);
        const removed = aa.filter((line) => line.trim() && !bb.includes(line)), added = bb.filter((line) => line.trim() && !aa.includes(line));
        setComparison(`REMOVED / CHANGED
${removed.map((x) => `- ${x}`).join("\n") || "None"}

ADDED / CHANGED
${added.map((x) => `+ ${x}`).join("\n") || "None"}`);
      } else {
        const generatorMode = mode;
        const validation = generatedDocumentError(doc, generatorMode);
        if (validation) {
          setStatus(validation);
          return;
        }
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ unit: "mm", format: "a4" });
        if (documentLanguage === "bn") {
          const canvas = await renderBanglaDocument(doc, generatorMode);
          pdf.addImage(canvas.toDataURL("image/jpeg", 0.97), "JPEG", 0, 0, 210, 297, void 0, "FAST");
          if (mode === "resume") {
            [doc.website, doc.github, doc.drive].filter(Boolean).forEach((url, index) => pdf.link(15, 252 + index * 8, 180, 7, { url }));
          }
          pdf.save(`${mode}-${safeName(doc.title)}.pdf`);
        } else {
          const accent = doc.accent;
          pdf.setFillColor(accent);
          if (mode === "certificate") {
            pdf.setLineWidth(2);
            pdf.setDrawColor(accent);
            pdf.rect(12, 12, 186, 273);
            pdf.setFontSize(14);
            pdf.text(documentCopy.en.heading.certificate.toUpperCase(), 105, 55, { align: "center" });
            pdf.setFontSize(30);
            pdf.text(doc.name, 105, 100, { align: "center" });
            pdf.setFontSize(14);
            pdf.text(doc.subtitle, 105, 118, { align: "center", maxWidth: 160 });
            pdf.setFontSize(11);
            pdf.text(doc.body, 105, 150, { align: "center", maxWidth: 150 });
            pdf.text(doc.date, 105, 220, { align: "center" });
          } else {
            pdf.setFillColor(accent);
            pdf.rect(0, 0, 210, 24, "F");
            pdf.setTextColor(255);
            pdf.setFontSize(18);
            pdf.text(mode === "resume" ? doc.name : doc.title, 16, 15);
            pdf.setTextColor(30);
            pdf.setFontSize(11);
            pdf.text(mode === "resume" ? doc.subtitle : `${doc.name}  |  ${doc.date}`, 16, 34);
            let dividerY = 39;
            if (mode === "resume") {
              const links = [["Website", doc.website], ["GitHub", doc.github], ["Portfolio / Drive", doc.drive]].filter((item) => item[1]);
              pdf.setFontSize(9);
              pdf.setTextColor(37, 99, 235);
              links.forEach(([label, url], index) => pdf.textWithLink(`${label}: ${url}`, 16, 41 + index * 5, { url }));
              pdf.setTextColor(30);
              dividerY = links.length ? 44 + (links.length - 1) * 5 : 39;
            }
            pdf.setDrawColor(accent);
            pdf.line(16, dividerY, 194, dividerY);
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text(documentCopy.en.heading[generatorMode], 16, dividerY + 12);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10.5);
            pdf.text(doc.body, 16, dividerY + 22, { maxWidth: 178, lineHeightFactor: 1.5 });
          }
          pdf.save(`${mode}-${safeName(doc.title)}.pdf`);
        }
      }
      setStatus(mode === "compare" ? "Comparison ready." : "Download created successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not process this document.");
    } finally {
      setBusy(false);
    }
  };
  const inspectForm = async (file) => {
    const error = validateDocumentFiles([file]);
    if (error) {
      setFiles([]);
      setFormFields([]);
      setStatus(error);
      return;
    }
    setFiles([file]);
    setStatus(`Inspecting ${file.name} locally\u2026`);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const detected = pdf.getForm().getFields().map((f) => ({ name: f.getName(), value: "" }));
      setFormFields(detected);
      setStatus(detected.length ? `${detected.length} fillable field${detected.length === 1 ? "" : "s"} detected.` : "No supported fillable text fields were found.");
    } catch {
      setFormFields([]);
      setStatus("This PDF could not be opened or its form structure is unsupported.");
    }
  };
  const isLetterhead = mode === "letterhead";
  const isGenerator = ["resume", "certificate", "minutes", "proposal"].includes(mode);
  return /* @__PURE__ */ jsxs14("div", { className: "grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsx14("aside", { className: "rounded-2xl border border-gray-200 bg-white p-3 shadow-sm", children: groups.map((group) => /* @__PURE__ */ jsxs14("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx14("p", { className: "px-2 pb-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: group }),
      modes.filter((m) => m.group === group).map((m) => /* @__PURE__ */ jsx14("button", { onClick: () => selectMode(m.id), className: `mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${mode === m.id ? "bg-gray-950 font-semibold text-white" : "text-gray-600 hover:bg-gray-100"}`, children: m.label }, m.id))
    ] }, group)) }),
    /* @__PURE__ */ jsxs14("section", { className: `rounded-2xl border border-gray-200 bg-white shadow-sm ${isLetterhead ? "p-3" : "p-5"}`, children: [
      /* @__PURE__ */ jsxs14("div", { className: "mb-5 flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs14("div", { children: [
          /* @__PURE__ */ jsx14("p", { className: "text-xs font-semibold uppercase tracking-wider text-blue-600", children: "PDF & Document Studio" }),
          /* @__PURE__ */ jsx14("h2", { className: "mt-1 text-xl font-bold text-gray-950", children: modes.find((m) => m.id === mode)?.label }),
          /* @__PURE__ */ jsx14("p", { className: "mt-1 max-w-2xl text-sm leading-6 text-gray-600", children: modeHelp[mode] })
        ] }),
        /* @__PURE__ */ jsx14("p", { className: "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700", children: "Local processing" })
      ] }),
      isLetterhead ? /* @__PURE__ */ jsx14(LetterheadDesigner, {}) : /* @__PURE__ */ jsxs14("div", { className: "space-y-4", children: [
        mode === "merge" && fileInput(true),
        mode === "split" && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          fileInput(),
          /* @__PURE__ */ jsx14(Text, { label: "Pages to extract", value: range, set: setRange, help: "Examples: 1-3, 5, 8-10" })
        ] }),
        mode === "editor" && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          fileInput(),
          /* @__PURE__ */ jsx14(Text, { label: "New page order / pages to keep", value: range, set: setRange, help: "Example: 3, 1, 2. Omitted pages are removed." }),
          /* @__PURE__ */ jsx14(Choice, { label: "Rotate selected pages", value: rotation, set: setRotation, options: ["0", "90", "180", "270"] })
        ] }),
        mode === "compress" && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          fileInput(),
          /* @__PURE__ */ jsx14(Info, { children: "Optimizes the PDF object structure and removes unnecessary metadata. It preserves visual quality; image-heavy PDFs may see modest savings." }),
          optimization && /* @__PURE__ */ jsx14(OptimizationReport, { before: optimization.before, after: optimization.after })
        ] }),
        mode === "images-to-pdf" && fileInput(true, "image/jpeg,image/png"),
        mode === "pdf-to-images" && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          fileInput(),
          /* @__PURE__ */ jsxs14("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx14(Choice, { label: "Output resolution", value: imageDpi, set: setImageDpi, options: ["150", "300", "450"] }),
            /* @__PURE__ */ jsx14(Choice, { label: "Image format", value: imageFormat, set: setImageFormat, options: ["PNG", "JPEG"] })
          ] }),
          /* @__PURE__ */ jsxs14(Info, { children: [
            /* @__PURE__ */ jsxs14("b", { children: [
              imageDpi,
              " DPI:"
            ] }),
            " ",
            imageDpi === "150" ? "Good for screens and smaller files." : imageDpi === "300" ? "Print-quality output and the recommended default." : "Extra-high detail for zooming, OCR, and professional printing.",
            " PNG is lossless; JPEG uses 98% quality."
          ] }),
          pagePreviews.length > 0 && /* @__PURE__ */ jsxs14("div", { children: [
            /* @__PURE__ */ jsxs14("div", { className: "mb-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx14("h3", { className: "text-sm font-semibold text-gray-900", children: "High-resolution preview" }),
              /* @__PURE__ */ jsxs14("span", { className: "text-xs text-gray-500", children: [
                pagePreviews.length,
                " pages"
              ] })
            ] }),
            /* @__PURE__ */ jsx14("div", { className: "grid max-h-[720px] gap-4 overflow-y-auto rounded-xl bg-gray-100 p-4 sm:grid-cols-2", children: pagePreviews.map((page) => /* @__PURE__ */ jsxs14("figure", { className: "overflow-hidden rounded-lg bg-white p-2 shadow-sm", children: [
              /* @__PURE__ */ jsx14("img", { src: page.url, alt: page.name, className: "h-auto w-full" }),
              /* @__PURE__ */ jsxs14("figcaption", { className: "mt-2 flex justify-between gap-2 text-[10px] text-gray-500", children: [
                /* @__PURE__ */ jsx14("span", { className: "truncate", children: page.name }),
                /* @__PURE__ */ jsxs14("span", { className: "shrink-0", children: [
                  page.width,
                  " \xD7 ",
                  page.height
                ] })
              ] })
            ] }, page.name)) })
          ] })
        ] }),
        mode === "numbering" && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          fileInput(),
          /* @__PURE__ */ jsx14(Choice, { label: "Number position", value: position, set: setPosition, options: ["Bottom center", "Bottom left", "Bottom right", "Top center", "Top left", "Top right"] })
        ] }),
        mode === "margin" && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          fileInput(),
          /* @__PURE__ */ jsx14(Text, { label: "Safe margin (mm)", value: margin2, set: setMargin })
        ] }),
        mode === "signature" && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          fileInput(),
          /* @__PURE__ */ jsxs14("label", { className: "block", children: [
            /* @__PURE__ */ jsx14("span", { className: "mb-1 block text-sm font-medium", children: "Signature image" }),
            /* @__PURE__ */ jsx14("input", { className: input2, type: "file", accept: "image/png,image/jpeg", onChange: (e) => {
              const file = e.target.files?.[0];
              if (!file) return setSignature(null);
              const error = validateDocumentFiles([file], true);
              if (error) {
                setSignature(null);
                setStatus(error);
              } else {
                setSignature(file);
                setStatus(`Signature image ready \xB7 ${formatBytes(file.size)}.`);
              }
            } })
          ] }),
          /* @__PURE__ */ jsx14(Text, { label: "Pages", value: range, set: setRange, help: "Use all or a range such as 1,3-5" })
        ] }),
        mode === "form" && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          /* @__PURE__ */ jsxs14("label", { className: "block", children: [
            /* @__PURE__ */ jsx14("span", { className: "mb-1 block text-sm font-medium", children: "Fillable PDF" }),
            /* @__PURE__ */ jsx14("input", { className: input2, type: "file", accept: "application/pdf", onChange: (e) => e.target.files?.[0] && inspectForm(e.target.files[0]) })
          ] }),
          formFields.length ? formFields.map((f, i) => /* @__PURE__ */ jsx14(Text, { label: f.name, value: f.value, set: (value) => setFormFields((old) => old.map((x, j) => j === i ? { ...x, value } : x)) }, f.name)) : /* @__PURE__ */ jsx14(Info, { children: "Choose a PDF containing fillable text fields. Filled fields will be flattened into the exported copy." })
        ] }),
        mode === "bank-cleaner" && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          fileInput(),
          /* @__PURE__ */ jsx14(Text, { label: "Pages to keep", value: range, set: setRange, help: "Example: 1-6. Leave invalid to keep all pages." }),
          /* @__PURE__ */ jsx14(Info, { children: "Creates a clean shareable copy, removes document metadata, flattens form fields, and keeps only the selected statement pages. It does not alter transaction values." })
        ] }),
        mode === "compare" && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          fileInput(true),
          /* @__PURE__ */ jsx14(Info, { children: "Select exactly two text-based PDFs. The comparison identifies sentences present in only one document." }),
          comparison && /* @__PURE__ */ jsx14("textarea", { className: `${input2} font-mono`, rows: 16, readOnly: true, value: comparison })
        ] }),
        isGenerator && /* @__PURE__ */ jsxs14(Fragment6, { children: [
          /* @__PURE__ */ jsxs14("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx14(Choice, { label: "Document language", value: documentLanguage, set: (value) => changeDocumentLanguage(value), options: ["en", "bn"] }),
            /* @__PURE__ */ jsx14(Text, { label: documentCopy[documentLanguage].date, value: doc.date, set: (date) => setDoc({ ...doc, date }) })
          ] }),
          /* @__PURE__ */ jsx14(Info, { children: "Choose English or \u09AC\u09BE\u0982\u09B2\u09BE for this generated document only. Changing language loads a complete mode-specific template." }),
          /* @__PURE__ */ jsx14(Text, { label: documentCopy[documentLanguage].title, value: doc.title, set: (title2) => setDoc({ ...doc, title: title2 }) }),
          /* @__PURE__ */ jsx14(Text, { label: mode === "certificate" ? documentLanguage === "bn" ? "\u09B8\u09A8\u09A6\u09AA\u09CD\u09B0\u09BE\u09AA\u0995\u09C7\u09B0 \u09A8\u09BE\u09AE" : "Certificate recipient" : documentCopy[documentLanguage].name, value: doc.name, set: (name) => setDoc({ ...doc, name }) }),
          /* @__PURE__ */ jsx14(Text, { label: documentCopy[documentLanguage].subtitle, value: doc.subtitle, set: (subtitle) => setDoc({ ...doc, subtitle }) }),
          mode === "resume" && /* @__PURE__ */ jsxs14("div", { className: "rounded-xl border border-gray-200 bg-gray-50 p-4", children: [
            /* @__PURE__ */ jsx14("h3", { className: "mb-3 text-sm font-semibold text-gray-900", children: documentLanguage === "bn" ? "\u0995\u09CD\u09B2\u09BF\u0995\u09AF\u09CB\u0997\u09CD\u09AF \u09AA\u09C7\u09B6\u09BE\u0997\u09A4 \u09B2\u09BF\u0982\u0995" : "Clickable professional links" }),
            /* @__PURE__ */ jsxs14("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx14(UrlText, { label: "Website URL", value: doc.website, set: (website) => setDoc({ ...doc, website }) }),
              /* @__PURE__ */ jsx14(UrlText, { label: "GitHub URL", value: doc.github, set: (github) => setDoc({ ...doc, github }) }),
              /* @__PURE__ */ jsx14(UrlText, { label: "Portfolio or Drive URL", value: doc.drive, set: (drive) => setDoc({ ...doc, drive }) })
            ] }),
            /* @__PURE__ */ jsx14("p", { className: "mt-3 text-xs text-gray-500", children: documentLanguage === "bn" ? "\u0990\u099A\u09CD\u099B\u09BF\u0995 \u09B2\u09BF\u0982\u0995 \u0985\u09AC\u09B6\u09CD\u09AF\u0987 http:// \u0985\u09A5\u09AC\u09BE https:// \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B6\u09C1\u09B0\u09C1 \u09B9\u09AC\u09C7 \u098F\u09AC\u0982 PDF-\u098F \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09BE \u09AF\u09BE\u09AC\u09C7\u0964" : "Optional links must start with http:// or https:// and will be clickable in the PDF." })
          ] }),
          /* @__PURE__ */ jsxs14("label", { className: "block", children: [
            /* @__PURE__ */ jsx14("span", { className: "mb-1 block text-sm font-medium", children: documentCopy[documentLanguage].content }),
            /* @__PURE__ */ jsx14("textarea", { className: input2, rows: 14, value: doc.body, onChange: (e) => setDoc({ ...doc, body: e.target.value }) }),
            /* @__PURE__ */ jsxs14("span", { className: "mt-1 block text-right text-xs text-gray-400", children: [
              doc.body.length.toLocaleString(),
              " / 12,000"
            ] })
          ] }),
          /* @__PURE__ */ jsxs14("label", { className: "block", children: [
            /* @__PURE__ */ jsx14("span", { className: "mb-1 block text-sm font-medium", children: documentLanguage === "bn" ? "\u09AC\u09CD\u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1\u09C7\u09B0 \u09B0\u0982" : "Brand color" }),
            /* @__PURE__ */ jsx14("input", { type: "color", value: doc.accent, onChange: (e) => setDoc({ ...doc, accent: e.target.value }), className: "h-11 w-20 rounded border p-1" })
          ] }),
          generatedDocumentError(doc, mode) && /* @__PURE__ */ jsx14("p", { role: "alert", className: "rounded-xl bg-red-50 p-3 text-sm text-red-700", children: generatedDocumentError(doc, mode) })
        ] }),
        files.length > 0 && /* @__PURE__ */ jsxs14("div", { className: "rounded-xl border border-gray-200 bg-gray-50 p-3", children: [
          /* @__PURE__ */ jsxs14("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsx14("p", { className: "text-xs font-semibold uppercase tracking-wider text-gray-500", children: "Selected locally" }),
            /* @__PURE__ */ jsxs14("span", { className: "text-xs text-gray-500", children: [
              files.length,
              " file",
              files.length === 1 ? "" : "s",
              " \xB7 ",
              formatBytes(files.reduce((sum, file) => sum + file.size, 0))
            ] })
          ] }),
          /* @__PURE__ */ jsx14("ul", { className: "mt-2 max-h-32 space-y-1 overflow-auto", children: files.map((file, index) => /* @__PURE__ */ jsxs14("li", { className: "flex justify-between gap-3 text-xs text-gray-700", children: [
            /* @__PURE__ */ jsxs14("span", { className: "truncate", children: [
              index + 1,
              ". ",
              file.name
            ] }),
            /* @__PURE__ */ jsx14("span", { className: "shrink-0 text-gray-500", children: formatBytes(file.size) })
          ] }, `${file.name}-${index}`)) }),
          /* @__PURE__ */ jsxs14("p", { className: "mt-2 text-[11px] text-gray-500", children: [
            "Files remain in this browser tab. Maximum: ",
            MAX_FILES,
            " files, ",
            formatBytes(MAX_FILE_BYTES),
            " each, ",
            formatBytes(MAX_TOTAL_BYTES),
            " total."
          ] })
        ] }),
        /* @__PURE__ */ jsx14("button", { className: button, disabled: busy || !isGenerator && !files.length || mode === "compare" && files.length < 2 || isGenerator && Boolean(generatedDocumentError(doc, mode)), onClick: run, children: busy ? mode === "pdf-to-images" ? status || "Rendering pages\u2026" : "Processing\u2026" : mode === "compare" ? "Compare PDFs" : mode === "pdf-to-images" ? "Create previews and download ZIP" : "Create and download" }),
        status && (!busy || mode !== "pdf-to-images") && /* @__PURE__ */ jsx14("p", { className: "rounded-xl bg-gray-50 p-3 text-sm text-gray-600", children: status }),
        /* @__PURE__ */ jsxs14("div", { className: "mt-8 border-t border-gray-200 pt-5", children: [
          /* @__PURE__ */ jsx14("h3", { className: "text-sm font-semibold text-gray-900", children: "Specialized commerce documents" }),
          /* @__PURE__ */ jsxs14("div", { className: "mt-3 grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs14("a", { href: invoiceUrl, className: "rounded-xl border border-gray-200 p-4 hover:border-gray-500", children: [
              /* @__PURE__ */ jsx14("b", { className: "block text-sm", children: "Invoice PDF Generator" }),
              /* @__PURE__ */ jsx14("span", { className: "text-xs text-gray-500", children: "Branded invoices with A4/A5 PDF export" })
            ] }),
            /* @__PURE__ */ jsxs14("a", { href: invoiceUrl, className: "rounded-xl border border-gray-200 p-4 hover:border-gray-500", children: [
              /* @__PURE__ */ jsx14("b", { className: "block text-sm", children: "Printable Packing List" }),
              /* @__PURE__ */ jsx14("span", { className: "text-xs text-gray-500", children: "Open the invoice tool and select Packing slip" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Text({ label, value, set, help }) {
  return /* @__PURE__ */ jsxs14("label", { className: "block", children: [
    /* @__PURE__ */ jsx14("span", { className: "mb-1 block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx14("input", { className: input2, value, onChange: (e) => set(e.target.value) }),
    help && /* @__PURE__ */ jsx14("span", { className: "mt-1 block text-xs text-gray-400", children: help })
  ] });
}
function Choice({ label, value, set, options }) {
  return /* @__PURE__ */ jsxs14("label", { className: "block", children: [
    /* @__PURE__ */ jsx14("span", { className: "mb-1 block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx14(DropdownControl, { className: input2, ariaLabel: label, value, onChange: set, options: options.map((o) => ({ value: o, label: label === "Document language" ? o === "bn" ? "\u09AC\u09BE\u0982\u09B2\u09BE" : "English" : o })) })
  ] });
}
function Info({ children }) {
  return /* @__PURE__ */ jsx14("p", { className: "rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-800", children });
}
function validHttpUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
function UrlText({ label, value, set }) {
  const valid = validHttpUrl(value);
  return /* @__PURE__ */ jsxs14("label", { className: "block", children: [
    /* @__PURE__ */ jsx14("span", { className: "mb-1 block text-xs font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx14("input", { type: "url", inputMode: "url", className: `${input2} ${valid ? "" : "border-red-400 focus:border-red-500 focus:ring-red-100"}`, value, placeholder: "https://example.com", onChange: (e) => set(e.target.value) }),
    !valid && /* @__PURE__ */ jsx14("span", { className: "mt-1 block text-xs text-red-600", children: "Enter a complete URL beginning with http:// or https://" })
  ] });
}
function OptimizationReport({ before, after }) {
  const saved = before - after, pct2 = before ? saved / before * 100 : 0, reduced = saved > 0, format = (bytes) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return /* @__PURE__ */ jsxs14("div", { className: `rounded-2xl border p-4 ${reduced ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`, children: [
    /* @__PURE__ */ jsxs14("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs14("div", { children: [
        /* @__PURE__ */ jsx14("p", { className: "text-xs font-semibold uppercase tracking-wider text-gray-500", children: "Optimization result" }),
        /* @__PURE__ */ jsx14("p", { className: `mt-1 text-lg font-bold ${reduced ? "text-emerald-800" : "text-amber-800"}`, children: reduced ? `${pct2.toFixed(1)}% smaller` : "Already optimized - no size reduction" })
      ] }),
      /* @__PURE__ */ jsx14("span", { className: `rounded-full px-3 py-1 text-xs font-semibold ${reduced ? "bg-emerald-200 text-emerald-900" : "bg-amber-200 text-amber-900"}`, children: reduced ? "Reduced" : "No reduction" })
    ] }),
    /* @__PURE__ */ jsxs14("div", { className: "mt-4 grid grid-cols-3 gap-2 text-sm", children: [
      /* @__PURE__ */ jsxs14("div", { children: [
        /* @__PURE__ */ jsx14("span", { className: "block text-xs text-gray-500", children: "Original" }),
        /* @__PURE__ */ jsx14("b", { children: format(before) })
      ] }),
      /* @__PURE__ */ jsxs14("div", { children: [
        /* @__PURE__ */ jsx14("span", { className: "block text-xs text-gray-500", children: "Optimized" }),
        /* @__PURE__ */ jsx14("b", { children: format(after) })
      ] }),
      /* @__PURE__ */ jsxs14("div", { children: [
        /* @__PURE__ */ jsx14("span", { className: "block text-xs text-gray-500", children: "Saved" }),
        /* @__PURE__ */ jsx14("b", { children: reduced ? format(saved) : "0 KB" })
      ] })
    ] }),
    !reduced && /* @__PURE__ */ jsx14("p", { className: "mt-3 text-xs leading-5 text-amber-800", children: "The file structure and metadata were cleaned, but the resulting file is not smaller. The source PDF was likely already optimized." })
  ] });
}

// src/components/QrGenerator.tsx
import { useEffect as useEffect14, useMemo as useMemo13, useState as useState15 } from "react";

// src/logic/qr.ts
function normalizeBdPhone2(raw) {
  let d = (raw || "").replace(/\D/g, "");
  if (d.startsWith("880")) return d;
  if (d.startsWith("0")) d = d.slice(1);
  return "880" + d;
}
function buildQrContent({ type, value }) {
  const v = (value || "").trim();
  switch (type) {
    case "url":
      if (!v) return "";
      return /^https?:\/\//i.test(v) ? v : `https://${v}`;
    case "whatsapp":
      return v ? `https://wa.me/${normalizeBdPhone2(v)}` : "";
    case "phone":
      return v ? `tel:${v}` : "";
    case "payment":
      if (!v) return "";
      return /^https?:\/\//i.test(v) ? v : `bKash/Nagad Personal: ${v}`;
    case "email":
      return v ? `mailto:${v}` : "";
    case "text":
    default:
      return v;
  }
}
var QR_TYPE_OPTIONS = [
  { value: "url", label: "Website / Product URL", placeholder: "contracommerce.com" },
  { value: "whatsapp", label: "WhatsApp number", placeholder: "01712345678" },
  { value: "phone", label: "Phone number", placeholder: "01712345678" },
  { value: "payment", label: "Payment (bKash/Nagad/link)", placeholder: "01712345678 or payment URL" },
  { value: "email", label: "Email", placeholder: "hello@shop.com" },
  { value: "text", label: "Plain text", placeholder: "Any text" }
];

// src/components/QrGenerator.tsx
import { jsx as jsx15, jsxs as jsxs15 } from "react/jsx-runtime";
function QrGenerator({
  brand = "Contra Commerce",
  ctaText = "Generate branded QR codes in Contra Commerce",
  ctaUrl = "#",
  className = ""
}) {
  const [type, setType] = useState15("url");
  const [value, setValue] = useState15("contracommerce.com");
  const [dataUrl, setDataUrl] = useState15("");
  const content = useMemo13(() => buildQrContent({ type, value }), [type, value]);
  const placeholder = QR_TYPE_OPTIONS.find((o) => o.value === type)?.placeholder;
  useResultTracking("qr-generator", { type });
  useEffect14(() => {
    let cancelled = false;
    if (!content) {
      setDataUrl("");
      return;
    }
    import("qrcode").then((mod) => mod.toDataURL(content, { width: 320, margin: 2 })).then((url) => {
      if (!cancelled) setDataUrl(url);
    }).catch(() => {
      if (!cancelled) setDataUrl("");
    });
    return () => {
      cancelled = true;
    };
  }, [content]);
  const download2 = () => {
    if (!dataUrl || typeof document === "undefined") return;
    const img = new Image();
    img.onload = () => {
      const pad = 16;
      const cap = 44;
      const size = img.width;
      const canvas = document.createElement("canvas");
      canvas.width = size + pad * 2;
      canvas.height = size + pad + cap;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, pad, pad, size, size);
      ctx.fillStyle = "#6b7280";
      ctx.font = "600 16px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Powered by ${brand}`, canvas.width / 2, size + pad + 28);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "qr-code.png";
      a.click();
    };
    img.src = dataUrl;
  };
  return /* @__PURE__ */ jsxs15("div", { className: `grid items-start gap-6 lg:grid-cols-2 ${className}`, children: [
    /* @__PURE__ */ jsxs15(InputCard, { title: "What should the QR link to?", children: [
      /* @__PURE__ */ jsx15(
        SelectField,
        {
          label: "Type",
          value: type,
          options: QR_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
          onChange: (v) => setType(v)
        }
      ),
      /* @__PURE__ */ jsx15(TextField, { label: "Value", value, onChange: setValue, placeholder }),
      content && /* @__PURE__ */ jsxs15("p", { className: "break-all text-xs text-gray-400", children: [
        "Encodes: ",
        content
      ] })
    ] }),
    /* @__PURE__ */ jsxs15(ResultsColumn, { children: [
      /* @__PURE__ */ jsx15(OutputBox, { title: "Your QR code", children: dataUrl ? /* @__PURE__ */ jsxs15("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsx15("img", { src: dataUrl, alt: "QR code", width: 220, height: 220, className: "rounded-lg border border-gray-200" }),
        /* @__PURE__ */ jsx15(
          "button",
          {
            type: "button",
            onClick: download2,
            className: "rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700",
            children: "Download branded PNG"
          }
        )
      ] }) : /* @__PURE__ */ jsx15("p", { className: "py-8 text-center text-sm text-gray-400", children: "Enter a value to generate a QR code." }) }),
      /* @__PURE__ */ jsx15(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/CampaignOfferBuilder.tsx
import { useMemo as useMemo14, useState as useState16 } from "react";

// src/logic/campaign-offer.ts
var money10 = (n4) => Math.round(n4 * 100) / 100;
var TEMPLATES = {
  "stock-clearance": { label: "Stock Clearance", urgency: "Only while stocks last!", ctaWord: "Grab Yours" },
  "new-launch": { label: "New Launch", urgency: "Be the first to own it.", ctaWord: "Shop Now" },
  "eid-offer": { label: "Eid Special", urgency: "Eid offer \u2014 limited time only.", ctaWord: "Order for Eid" },
  "flash-sale": { label: "Flash Sale", urgency: "Ends tonight \u2014 hurry!", ctaWord: "Buy Now" },
  "repeat-customer": { label: "Loyalty Offer", urgency: "A thank-you just for you.", ctaWord: "Claim Offer" },
  bundle: { label: "Bundle Deal", urgency: "Bundle & save more.", ctaWord: "Get the Bundle" }
};
var CAMPAIGN_GOALS = Object.keys(TEMPLATES).map((value) => ({ value, label: TEMPLATES[value].label }));
function buildCampaignOffer(input3) {
  const { goal, product, originalPrice, discountPct: discountPct2 } = input3;
  const t = TEMPLATES[goal];
  const name = product || "this product";
  const offerPrice = money10(originalPrice * (1 - discountPct2 / 100));
  const saved = money10(originalPrice - offerPrice);
  const headline = `${t.label}: ${discountPct2}% OFF ${name}!`;
  const body = `Get ${name} now for just \u09F3${offerPrice} instead of \u09F3${originalPrice} \u2014 that's \u09F3${saved} saved. ${t.urgency}`;
  const cta = `${t.ctaWord} \u2192 \u09F3${offerPrice}`;
  return { offerPrice, saved, headline, body, cta, urgency: t.urgency };
}

// src/components/CampaignOfferBuilder.tsx
import { jsx as jsx16, jsxs as jsxs16 } from "react/jsx-runtime";
function CampaignOfferBuilder({
  brand = "Contra Commerce",
  ctaText = "Launch campaigns in minutes with Contra Commerce",
  ctaUrl = "#",
  className = ""
}) {
  const [goal, setGoal] = useState16("flash-sale");
  const [product, setProduct] = useState16("Premium Polo Shirt");
  const [price, setPrice] = useState16("1000");
  const [discount, setDiscount] = useState16("30");
  const result = useMemo14(
    () => buildCampaignOffer({
      goal,
      product,
      originalPrice: Number.parseFloat(price) || 0,
      discountPct: Number.parseFloat(discount) || 0
    }),
    [goal, product, price, discount]
  );
  useResultTracking("campaign-offer", { goal, product });
  return /* @__PURE__ */ jsxs16("div", { className: `grid items-start gap-6 lg:grid-cols-2 ${className}`, children: [
    /* @__PURE__ */ jsxs16(InputCard, { title: "Campaign setup", children: [
      /* @__PURE__ */ jsx16(SelectField, { label: "Goal", value: goal, options: CAMPAIGN_GOALS, onChange: (v) => setGoal(v) }),
      /* @__PURE__ */ jsx16(TextField, { label: "Product", value: product, onChange: setProduct }),
      /* @__PURE__ */ jsx16(NumberField, { label: "Original price", suffix: "\u09F3", value: price, onChange: setPrice }),
      /* @__PURE__ */ jsx16(NumberField, { label: "Discount", suffix: "%", value: discount, onChange: setDiscount })
    ] }),
    /* @__PURE__ */ jsxs16(ResultsColumn, { children: [
      /* @__PURE__ */ jsxs16(StatGrid, { children: [
        /* @__PURE__ */ jsx16(Stat, { label: "Offer price", value: bdt(result.offerPrice), tone: "emerald" }),
        /* @__PURE__ */ jsx16(Stat, { label: "Customer saves", value: bdt(result.saved) })
      ] }),
      /* @__PURE__ */ jsx16(OutputBox, { title: "Ready-to-post copy", children: /* @__PURE__ */ jsxs16("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx16(CopyField, { label: "Headline", value: result.headline }),
        /* @__PURE__ */ jsx16(CopyField, { label: "Body", value: result.body }),
        /* @__PURE__ */ jsx16(CopyField, { label: "Call to action", value: result.cta })
      ] }) }),
      /* @__PURE__ */ jsx16(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/CourierChargeComparison.tsx
import { useEffect as useEffect15, useMemo as useMemo15, useRef as useRef4, useState as useState17 } from "react";

// src/logic/courier-charge.ts
var money11 = (n4) => Math.round(n4 * 100) / 100;
var RATE_REVIEW_DATE = "2026-07-26";
var DISTRICT_OPTIONS = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon"
].map((district) => ({ value: district, label: district }));
var DHAKA_SUBURB_TERMS = [
  "ashulia",
  "dhamrai",
  "dohar",
  "hemayetpur",
  "keraniganj",
  "nawabganj",
  "savar",
  "tongi"
];
var normaliseLocation = (value) => (value || "").trim().toLowerCase().replace(/[^a-z0-9ঀ-৿]+/g, " ");
function detectCourierZone({
  pickupDistrict,
  destinationDistrict,
  destinationArea = ""
}) {
  const pickup = normaliseLocation(pickupDistrict);
  const destination = normaliseLocation(destinationDistrict);
  const area = normaliseLocation(destinationArea);
  if (!pickup || !destination) return "outside-city";
  const isDhakaSuburb = pickup === "dhaka" && (destination === "gazipur" || destination === "narayanganj" || DHAKA_SUBURB_TERMS.some((term) => area.includes(term)));
  if (isDhakaSuburb) return "sub-city";
  return pickup === destination ? "inside-city" : "outside-city";
}
var singleTier = (inside, subCity, outside) => ({
  "inside-city": [{ maxKg: 1, charge: inside }],
  "sub-city": [{ maxKg: 1, charge: subCity }],
  "outside-city": [{ maxKg: 1, charge: outside }]
});
var COURIER_RATES = [
  {
    courier: "Steadfast",
    weightTiers: singleTier(70, 100, 130),
    perExtraKg: { "inside-city": 15, "sub-city": 20, "outside-city": 20 },
    codPct: { "inside-city": 1, "sub-city": 1, "outside-city": 1 },
    returnRule: { type: "none" },
    days: { "inside-city": "1\u20132", "sub-city": "2\u20133", "outside-city": "2\u20134" },
    sourceLabel: "Steadfast public pricing",
    sourceUrl: "https://steadfast.com.bd/pricing",
    sourceStatus: "published",
    asOf: RATE_REVIEW_DATE,
    note: "Extra-weight and delivery-time figures remain estimates; contract rates can differ."
  },
  {
    courier: "Pathao",
    weightTiers: {
      "inside-city": [
        { maxKg: 0.5, charge: 60 },
        { maxKg: 1, charge: 70 },
        { maxKg: 2, charge: 90 }
      ],
      "sub-city": [
        { maxKg: 0.5, charge: 80 },
        { maxKg: 1, charge: 100 },
        { maxKg: 2, charge: 130 }
      ],
      "outside-city": [
        { maxKg: 0.5, charge: 110 },
        { maxKg: 1, charge: 130 },
        { maxKg: 2, charge: 170 }
      ]
    },
    perExtraKg: { "inside-city": 15, "sub-city": 25, "outside-city": 25 },
    codPct: { "inside-city": 0.5, "sub-city": 1, "outside-city": 1 },
    returnRule: {
      type: "percentage-of-delivery",
      percentage: { "inside-city": 0, "sub-city": 50, "outside-city": 50 }
    },
    days: { "inside-city": "1", "sub-city": "3", "outside-city": "3" },
    sourceLabel: "Pathao Courier rate card",
    sourceUrl: "https://pathao.com/courier/?lang=en",
    sourceStatus: "published",
    asOf: RATE_REVIEW_DATE
  },
  {
    courier: "Paperfly",
    weightTiers: singleTier(70, 110, 130),
    perExtraKg: { "inside-city": 15, "sub-city": 15, "outside-city": 30 },
    codPct: { "inside-city": 0.5, "sub-city": 1, "outside-city": 1 },
    returnRule: { type: "none" },
    days: { "inside-city": "1", "sub-city": "1\u20133", "outside-city": "1\u20133" },
    sourceLabel: "Paperfly terms and rate card",
    sourceUrl: "https://paperfly.com.bd/terms/",
    sourceStatus: "published",
    asOf: RATE_REVIEW_DATE
  },
  {
    courier: "RedX",
    weightTiers: singleTier(65, 90, 120),
    perExtraKg: { "inside-city": 15, "sub-city": 15, "outside-city": 15 },
    codPct: { "inside-city": 1, "sub-city": 1, "outside-city": 1 },
    returnRule: {
      type: "fixed",
      charge: { "inside-city": 30, "sub-city": 45, "outside-city": 60 }
    },
    days: { "inside-city": "1\u20132", "sub-city": "2\u20133", "outside-city": "3\u20135" },
    sourceLabel: "RedX indicative estimate",
    sourceUrl: "https://redx.com.bd/",
    sourceStatus: "indicative",
    asOf: RATE_REVIEW_DATE,
    note: "A complete public rate card was not available; verify this estimate in your merchant panel."
  }
];
var ZONE_OPTIONS = [
  { value: "inside-city", label: "Inside city / same district" },
  { value: "sub-city", label: "Dhaka nearby / suburb" },
  { value: "outside-city", label: "Outside city / different district" }
];
function normaliseNumber(value, minimum) {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, value);
}
function deliveryForWeight(rate, zone, weightKg) {
  const tiers = rate.weightTiers[zone];
  const matchingTier = tiers.find((tier) => weightKg <= tier.maxKg);
  if (matchingTier) return matchingTier.charge;
  const finalTier = tiers[tiers.length - 1];
  const extraKg = Math.ceil(weightKg - finalTier.maxKg);
  return finalTier.charge + extraKg * rate.perExtraKg[zone];
}
function returnChargeFor(rate, zone, deliveryCharge) {
  if (rate.returnRule.type === "none") return 0;
  if (rate.returnRule.type === "fixed") return rate.returnRule.charge[zone];
  return deliveryCharge * (rate.returnRule.percentage[zone] / 100);
}
function compareCourierCharges(input3, rates = COURIER_RATES) {
  const zone = input3.zone;
  const weightKg = normaliseNumber(input3.weightKg, 0.1);
  const codAmount = normaliseNumber(input3.codAmount, 0);
  const quotes = rates.map((rate) => {
    const deliveryCharge = deliveryForWeight(rate, zone, weightKg);
    const codCharge = codAmount * (rate.codPct[zone] / 100);
    const returnCharge = returnChargeFor(rate, zone, deliveryCharge);
    const deliveredTotal = deliveryCharge + codCharge;
    const returnTotal = deliveryCharge + returnCharge;
    return {
      courier: rate.courier,
      deliveryCharge: money11(deliveryCharge),
      codCharge: money11(codCharge),
      returnCharge: money11(returnCharge),
      total: money11(deliveredTotal),
      deliveredTotal: money11(deliveredTotal),
      returnTotal: money11(returnTotal),
      estDays: rate.days[zone],
      sourceLabel: rate.sourceLabel,
      sourceUrl: rate.sourceUrl,
      sourceStatus: rate.sourceStatus,
      asOf: rate.asOf,
      note: rate.note
    };
  }).sort((a, b) => a.deliveredTotal - b.deliveredTotal);
  return {
    quotes,
    cheapest: quotes[0]?.courier ?? "",
    zone,
    weightKg,
    codAmount
  };
}

// src/components/CourierChargeComparison.tsx
import { jsx as jsx17, jsxs as jsxs17 } from "react/jsx-runtime";
var zoneLabel = (zone) => ZONE_OPTIONS.find((option) => option.value === zone)?.label ?? zone;
var nonNegativeInput = (value, minimum, setter) => {
  if (value === "") {
    setter(value);
    return;
  }
  const parsed = Number(value);
  setter(Number.isFinite(parsed) && parsed < minimum ? String(minimum) : value);
};
function bookingHref(base, values) {
  const params = new URLSearchParams(values).toString();
  return `${base}${base.includes("?") ? "&" : "?"}${params}`;
}
function CourierChargeComparison({
  brand = "Contra Commerce",
  ctaText = "Book the cheapest courier in one click",
  ctaUrl = "https://app.contracommerce.com/login",
  ratesEndpoint,
  bookingStatusEndpoint,
  bookingEndpoint,
  className = ""
}) {
  const [pickupDistrict, setPickupDistrict] = useState17("Dhaka");
  const [destinationDistrict, setDestinationDistrict] = useState17("Dhaka");
  const [destinationArea, setDestinationArea] = useState17("Dhanmondi");
  const [weight, setWeight] = useState17("1");
  const [cod, setCod] = useState17("1000");
  const [remoteRates, setRemoteRates] = useState17(null);
  const [ratesLoading, setRatesLoading] = useState17(false);
  const [rateNotice, setRateNotice] = useState17("");
  const [bookingStatus, setBookingStatus] = useState17(null);
  const [customerName, setCustomerName] = useState17("");
  const [customerPhone, setCustomerPhone] = useState17("");
  const [deliveryAddress, setDeliveryAddress] = useState17("");
  const [invoice, setInvoice] = useState17("");
  const [itemDescription, setItemDescription] = useState17("");
  const [bookingLoading, setBookingLoading] = useState17(false);
  const [bookingMessage, setBookingMessage] = useState17("");
  const [bookingError, setBookingError] = useState17("");
  const bookingKey = useRef4("");
  const zone = useMemo15(
    () => detectCourierZone({
      pickupDistrict,
      destinationDistrict,
      destinationArea
    }),
    [pickupDistrict, destinationDistrict, destinationArea]
  );
  const numericWeight = Number.parseFloat(weight) || 0.1;
  const numericCod = Number.parseFloat(cod) || 0;
  const localResult = useMemo15(
    () => compareCourierCharges({
      zone,
      weightKg: numericWeight,
      codAmount: numericCod
    }),
    [zone, numericWeight, numericCod]
  );
  useEffect15(() => {
    if (!ratesEndpoint) {
      setRemoteRates(null);
      setRateNotice("");
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setRatesLoading(true);
      try {
        const response = await fetch(ratesEndpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            pickupDistrict,
            destinationDistrict,
            destinationArea,
            zone,
            weightKg: numericWeight,
            codAmount: numericCod
          }),
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`Rate service returned ${response.status}`);
        const payload = await response.json();
        if (!payload.result?.quotes?.length) throw new Error("No courier quotes returned");
        setRemoteRates(payload);
        setRateNotice(payload.fallbackReason ?? "");
      } catch (error) {
        if (error.name !== "AbortError") {
          setRemoteRates(null);
          setRateNotice("Live rate service unavailable\u2014showing the published-rate fallback.");
        }
      } finally {
        if (!controller.signal.aborted) setRatesLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [
    ratesEndpoint,
    pickupDistrict,
    destinationDistrict,
    destinationArea,
    zone,
    numericWeight,
    numericCod
  ]);
  useEffect15(() => {
    if (!bookingStatusEndpoint) {
      setBookingStatus({
        configured: false,
        authenticated: false,
        loginUrl: ctaUrl
      });
      return;
    }
    const controller = new AbortController();
    fetch(bookingStatusEndpoint, {
      credentials: "include",
      signal: controller.signal
    }).then(async (response) => {
      if (!response.ok) throw new Error(`Booking status returned ${response.status}`);
      setBookingStatus(await response.json());
    }).catch((error) => {
      if (error.name !== "AbortError") {
        setBookingStatus({
          configured: false,
          authenticated: false,
          loginUrl: ctaUrl
        });
      }
    });
    return () => controller.abort();
  }, [bookingStatusEndpoint, ctaUrl]);
  const result = remoteRates?.result ?? localResult;
  const rateMode = remoteRates?.mode ?? "published";
  const cheapestQuote = result.quotes.find((quote) => quote.courier === result.cheapest);
  const bookingBase = bookingStatus?.authenticated ? bookingStatus.bookingUrl : bookingStatus?.loginUrl ?? ctaUrl;
  const actionUrl = bookingBase ? bookingHref(bookingBase, {
    courier: result.cheapest,
    pickupDistrict,
    destinationDistrict,
    destinationArea,
    weightKg: String(result.weightKg),
    codAmount: String(result.codAmount)
  }) : "";
  const submitBooking = async (event) => {
    event.preventDefault();
    if (!bookingEndpoint) return;
    setBookingLoading(true);
    setBookingError("");
    setBookingMessage("");
    if (!bookingKey.current) {
      bookingKey.current = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    try {
      const response = await fetch(bookingEndpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "idempotency-key": bookingKey.current
        },
        body: JSON.stringify({
          courierId: result.cheapest.toLowerCase().replace(/[^a-z0-9_-]+/g, "-"),
          invoice,
          customerName,
          customerPhone,
          deliveryAddress,
          codAmount: result.codAmount,
          weightKg: result.weightKg,
          itemDescription,
          itemQuantity: 1
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Courier booking failed");
      const reference = payload.booking?.trackingCode || payload.booking?.externalId || invoice;
      setBookingMessage(
        `${payload.reused ? "Existing booking found" : "Courier booked"} \xB7 reference ${reference}`
      );
      bookingKey.current = "";
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Courier booking failed");
    } finally {
      setBookingLoading(false);
    }
  };
  useResultTracking("courier-charge", {
    pickupDistrict,
    destinationDistrict,
    destinationArea,
    zone,
    weight,
    cod
  });
  return /* @__PURE__ */ jsxs17("div", { className: `grid min-w-0 grid-cols-1 gap-6 ${className}`, children: [
    /* @__PURE__ */ jsxs17(InputCard, { title: "Customer location & parcel", children: [
      /* @__PURE__ */ jsx17(
        SelectField,
        {
          label: "Pickup district",
          value: pickupDistrict,
          options: DISTRICT_OPTIONS,
          onChange: setPickupDistrict
        }
      ),
      /* @__PURE__ */ jsx17(
        SelectField,
        {
          label: "Customer district",
          value: destinationDistrict,
          options: DISTRICT_OPTIONS,
          onChange: setDestinationDistrict
        }
      ),
      /* @__PURE__ */ jsx17(
        TextField,
        {
          label: "Customer area / thana (optional)",
          value: destinationArea,
          placeholder: "e.g. Dhanmondi, Savar",
          onChange: setDestinationArea
        }
      ),
      /* @__PURE__ */ jsxs17("div", { className: "rounded-lg border border-info/20 bg-info/10 px-3 py-2 text-xs text-info", children: [
        "Detected rate zone: ",
        /* @__PURE__ */ jsx17("b", { children: zoneLabel(zone) })
      ] }),
      /* @__PURE__ */ jsx17(
        NumberField,
        {
          label: "Weight",
          suffix: "kg",
          value: weight,
          min: 0.1,
          step: 0.1,
          onChange: (value) => nonNegativeInput(value, 0.1, setWeight)
        }
      ),
      /* @__PURE__ */ jsx17(
        NumberField,
        {
          label: "COD amount",
          suffix: "\u09F3",
          value: cod,
          min: 0,
          step: 1,
          onChange: (value) => nonNegativeInput(value, 0, setCod)
        }
      ),
      /* @__PURE__ */ jsx17("p", { className: "text-xs text-gray-400", children: "Weight must be at least 0.1 kg and COD cannot be negative. The zone is calculated from the pickup district, customer district and nearby-Dhaka area." })
    ] }),
    /* @__PURE__ */ jsxs17(ResultsColumn, { children: [
      /* @__PURE__ */ jsxs17(OutputBox, { title: "Estimated charges by courier", children: [
        /* @__PURE__ */ jsxs17("div", { className: "mb-3 flex flex-wrap items-center gap-2 text-xs", children: [
          /* @__PURE__ */ jsx17(
            "span",
            {
              className: `rounded-full px-2.5 py-1 font-medium ${rateMode === "contract" ? "bg-emerald-100 text-emerald-800" : rateMode === "live" ? "bg-info/10 text-info" : "bg-amber-100 text-amber-800"}`,
              children: rateMode === "contract" ? "Merchant-contract rates" : rateMode === "live" ? "Live provider rates" : "Published-rate estimates"
            }
          ),
          ratesLoading && /* @__PURE__ */ jsx17("span", { className: "text-gray-400", children: "Refreshing rates\u2026" })
        ] }),
        rateNotice && /* @__PURE__ */ jsx17("p", { className: "mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800", children: rateNotice }),
        /* @__PURE__ */ jsx17("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs17("table", { className: "w-full min-w-[760px] text-sm", children: [
          /* @__PURE__ */ jsx17("thead", { children: /* @__PURE__ */ jsxs17("tr", { className: "text-left text-xs text-gray-400", children: [
            /* @__PURE__ */ jsx17("th", { className: "pb-2 font-medium", children: "Courier" }),
            /* @__PURE__ */ jsx17("th", { className: "pb-2 text-right font-medium", children: "Delivery" }),
            /* @__PURE__ */ jsx17("th", { className: "pb-2 text-right font-medium", children: "COD" }),
            /* @__PURE__ */ jsx17("th", { className: "pb-2 text-right font-medium", children: "If delivered" }),
            /* @__PURE__ */ jsx17("th", { className: "pb-2 text-right font-medium", children: "Return extra" }),
            /* @__PURE__ */ jsx17("th", { className: "pb-2 text-right font-medium", children: "If returned" }),
            /* @__PURE__ */ jsx17("th", { className: "pb-2 text-right font-medium", children: "Time" })
          ] }) }),
          /* @__PURE__ */ jsx17("tbody", { children: result.quotes.map((quote) => {
            const cheapest = quote.courier === result.cheapest;
            return /* @__PURE__ */ jsxs17(
              "tr",
              {
                className: `border-t border-gray-100 ${cheapest ? "bg-emerald-50" : ""}`,
                children: [
                  /* @__PURE__ */ jsxs17("td", { className: "py-2 font-medium text-gray-800", children: [
                    quote.courier,
                    " ",
                    cheapest && /* @__PURE__ */ jsx17("span", { className: "text-xs text-emerald-600", children: "\xB7 cheapest" }),
                    quote.sourceStatus === "indicative" && /* @__PURE__ */ jsx17("span", { className: "block text-[10px] font-normal text-amber-600", children: "indicative" })
                  ] }),
                  /* @__PURE__ */ jsx17("td", { className: "py-2 text-right text-gray-600", children: bdt(quote.deliveryCharge) }),
                  /* @__PURE__ */ jsx17("td", { className: "py-2 text-right text-gray-600", children: bdt(quote.codCharge) }),
                  /* @__PURE__ */ jsx17(
                    "td",
                    {
                      className: `py-2 text-right font-semibold ${cheapest ? "text-emerald-700" : "text-gray-900"}`,
                      children: bdt(quote.deliveredTotal)
                    }
                  ),
                  /* @__PURE__ */ jsx17("td", { className: "py-2 text-right text-red-500", children: bdt(quote.returnCharge) }),
                  /* @__PURE__ */ jsx17("td", { className: "py-2 text-right font-medium text-red-700", children: bdt(quote.returnTotal) }),
                  /* @__PURE__ */ jsxs17("td", { className: "py-2 text-right text-gray-500", children: [
                    quote.estDays,
                    " day(s)"
                  ] })
                ]
              },
              quote.courier
            );
          }) })
        ] }) }),
        /* @__PURE__ */ jsxs17("p", { className: "mt-3 text-xs text-gray-500", children: [
          /* @__PURE__ */ jsx17("b", { children: "If delivered" }),
          " = forward delivery + COD. ",
          /* @__PURE__ */ jsx17("b", { children: "If returned" }),
          " = forward delivery attempt + any additional return charge; COD is not included."
        ] }),
        /* @__PURE__ */ jsxs17("div", { className: "mt-4 border-t border-gray-100 pt-3", children: [
          /* @__PURE__ */ jsx17("p", { className: "text-xs font-medium text-gray-700", children: "Rate sources" }),
          /* @__PURE__ */ jsx17("ul", { className: "mt-1 space-y-1 text-xs text-gray-500", children: result.quotes.map((quote) => /* @__PURE__ */ jsxs17("li", { children: [
            /* @__PURE__ */ jsxs17(
              "a",
              {
                href: quote.sourceUrl,
                target: "_blank",
                rel: "noreferrer",
                className: "text-blue-600 hover:underline",
                children: [
                  quote.courier,
                  ": ",
                  quote.sourceLabel
                ]
              }
            ),
            " ",
            "\xB7 reviewed ",
            quote.asOf,
            quote.note ? ` \xB7 ${quote.note}` : ""
          ] }, `${quote.courier}-source`)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs17("div", { className: "rounded-2xl bg-gray-900 p-5 text-white", children: [
        /* @__PURE__ */ jsx17("p", { className: "text-sm font-medium", children: bookingStatus?.authenticated ? `${ctaText}: ${result.cheapest}` : "One-click booking is for Contra Commerce members" }),
        /* @__PURE__ */ jsx17("p", { className: "mt-1 text-xs text-gray-300", children: bookingStatus?.authenticated ? `${cheapestQuote ? `${bdt(cheapestQuote.deliveredTotal)} estimated delivered cost. ` : ""}Continue with these parcel details prefilled.` : bookingStatus?.configured ? "Sign in to detect your merchant session and continue to courier booking." : "The booking bridge is ready, but this host still needs the Contra Commerce session endpoint configured." }),
        bookingStatus?.authenticated && bookingEndpoint ? /* @__PURE__ */ jsxs17("form", { onSubmit: submitBooking, className: "mt-4 space-y-3", children: [
          /* @__PURE__ */ jsxs17("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx17(
              "input",
              {
                value: customerName,
                onChange: (event) => setCustomerName(event.target.value),
                placeholder: "Customer name",
                maxLength: 100,
                required: true,
                className: "rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400"
              }
            ),
            /* @__PURE__ */ jsx17(
              "input",
              {
                value: customerPhone,
                onChange: (event) => setCustomerPhone(event.target.value.replace(/\D/g, "").slice(0, 13)),
                placeholder: "01XXXXXXXXX",
                inputMode: "tel",
                pattern: "(?:88)?01[0-9]{9}",
                required: true,
                className: "rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400"
              }
            ),
            /* @__PURE__ */ jsx17(
              "input",
              {
                value: invoice,
                onChange: (event) => setInvoice(event.target.value),
                placeholder: "Unique invoice / order ID",
                maxLength: 100,
                required: true,
                className: "rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400"
              }
            ),
            /* @__PURE__ */ jsx17(
              "input",
              {
                value: itemDescription,
                onChange: (event) => setItemDescription(event.target.value),
                placeholder: "Item description (optional)",
                maxLength: 300,
                className: "rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400"
              }
            )
          ] }),
          /* @__PURE__ */ jsx17(
            "textarea",
            {
              value: deliveryAddress,
              onChange: (event) => setDeliveryAddress(event.target.value),
              placeholder: "Full delivery address",
              minLength: 8,
              maxLength: 500,
              required: true,
              rows: 2,
              className: "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400"
            }
          ),
          bookingMessage && /* @__PURE__ */ jsx17("p", { role: "status", className: "rounded-lg bg-emerald-900/60 px-3 py-2 text-xs text-emerald-100", children: bookingMessage }),
          bookingError && /* @__PURE__ */ jsx17("p", { role: "alert", className: "rounded-lg bg-red-900/60 px-3 py-2 text-xs text-red-100", children: bookingError }),
          /* @__PURE__ */ jsx17(
            "button",
            {
              type: "submit",
              disabled: bookingLoading,
              className: "inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 disabled:opacity-60",
              children: bookingLoading ? "Booking\u2026" : `Book ${result.cheapest} now \u2192`
            }
          ),
          /* @__PURE__ */ jsx17("p", { className: "text-[11px] text-gray-400", children: "The booking is idempotent: retrying the same submission will not create a duplicate parcel." })
        ] }) : actionUrl ? /* @__PURE__ */ jsx17(
          "a",
          {
            href: actionUrl,
            className: "mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100",
            children: bookingStatus?.authenticated ? "Book cheapest courier \u2192" : `Sign in with ${brand} \u2192`
          }
        ) : null
      ] })
    ] })
  ] });
}

// src/logic/order-risk.ts
function assessOperationalOrderRisk(evidence) {
  const reasons = [];
  if (evidence.successRate != null) {
    reasons.push(
      `${evidence.successRate.toFixed(0)}% delivery success across ${evidence.totalOrders} recorded order(s)`
    );
  }
  if (evidence.cancellations > 0) {
    reasons.push(`${evidence.cancellations} customer-attributable cancellation/return(s)`);
  }
  if (evidence.repeatedAttempts > 0) {
    reasons.push(`${evidence.repeatedAttempts} unreachable/no-show attempt(s)`);
  }
  if (evidence.addressSuspicious) {
    reasons.push(...evidence.addressReasons?.length ? evidence.addressReasons : ["Delivery address needs verification"]);
  }
  if (evidence.riskLevel === "insufficient_data" || evidence.totalOrders < 3) {
    return {
      verdict: "insufficient_data",
      heading: "Not enough verified history",
      recommendation: "Confirm the customer by phone before shipping.",
      reasons: reasons.length ? reasons : ["Fewer than 3 verified delivery attempts are available"]
    };
  }
  if (evidence.riskLevel === "high" || evidence.riskScore != null && evidence.riskScore >= 70 || evidence.successRate != null && evidence.successRate < 40) {
    return {
      verdict: "hold",
      heading: "High delivery risk \u2014 hold for verification",
      recommendation: "Call the customer, confirm product/price/address and consider an advance payment before dispatch.",
      reasons
    };
  }
  if (evidence.riskLevel === "medium" || evidence.addressSuspicious || evidence.successRate != null && evidence.successRate < 75) {
    return {
      verdict: "verify",
      heading: "Verification recommended",
      recommendation: "Confirm the order and address by phone before handing it to the courier.",
      reasons
    };
  }
  return {
    verdict: "approve",
    heading: "Normal delivery risk",
    recommendation: "The available history supports normal fulfilment. Continue routine verification.",
    reasons: reasons.length ? reasons : [`${evidence.delivered} delivered order(s) recorded`]
  };
}

// src/components/AddressFormatter.tsx
import { useMemo as useMemo16, useState as useState18 } from "react";

// src/logic/address-formatter.ts
var BD_DISTRICTS = [
  "bagerhat",
  "bandarban",
  "barguna",
  "barisal",
  "bhola",
  "bogura",
  "bogra",
  "brahmanbaria",
  "chandpur",
  "chapainawabganj",
  "chattogram",
  "chittagong",
  "chuadanga",
  "comilla",
  "cumilla",
  "cox's bazar",
  "coxs bazar",
  "dhaka",
  "dinajpur",
  "faridpur",
  "feni",
  "gaibandha",
  "gazipur",
  "gopalganj",
  "habiganj",
  "jamalpur",
  "jashore",
  "jessore",
  "jhalokati",
  "jhenaidah",
  "joypurhat",
  "khagrachhari",
  "khulna",
  "kishoreganj",
  "kurigram",
  "kushtia",
  "lakshmipur",
  "lalmonirhat",
  "madaripur",
  "magura",
  "manikganj",
  "meherpur",
  "moulvibazar",
  "munshiganj",
  "mymensingh",
  "naogaon",
  "narail",
  "narayanganj",
  "narsingdi",
  "natore",
  "netrokona",
  "nilphamari",
  "noakhali",
  "pabna",
  "panchagarh",
  "patuakhali",
  "pirojpur",
  "rajbari",
  "rajshahi",
  "rangamati",
  "rangpur",
  "satkhira",
  "shariatpur",
  "sherpur",
  "sirajganj",
  "sunamganj",
  "sylhet",
  "tangail",
  "thakurgaon"
];
function extractPhone(text) {
  const m = text.replace(/[\s-]/g, "").match(/(?:\+?88)?(01\d{9})/);
  return m ? m[1] : "";
}
function findDistrict(text) {
  const lower = text.toLowerCase();
  const hit = [...BD_DISTRICTS].sort((a, b) => b.length - a.length).find((d) => lower.includes(d));
  if (!hit) return "";
  return hit.replace(/\b\w/g, (c) => c.toUpperCase());
}
function parseAddress({ raw }) {
  const text = (raw || "").trim();
  const phone = extractPhone(text);
  const district = findDistrict(text);
  const lines2 = text.split(/[\n,]+/).map((l) => l.trim()).filter(Boolean);
  let name = "";
  for (const line of lines2) {
    const stripped = line.replace(/[\s-]/g, "");
    const isPhone = /(?:\+?88)?01\d{9}/.test(stripped);
    const isDistrictOnly = district && line.toLowerCase() === district.toLowerCase();
    if (!isPhone && !isDistrictOnly && /[A-Za-zঀ-৿]/.test(line) && line.length <= 40) {
      name = line;
      break;
    }
  }
  let address = text.replace(/(?:\+?88)?01[\s-]?\d{4}[\s-]?\d{5}/g, "").trim();
  if (name) address = address.replace(name, "").trim();
  address = address.replace(/^[\s,;-]+|[\s,;-]+$/g, "").replace(/\s*,\s*,\s*/g, ", ");
  const cap = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
  const thanaMatch = text.match(/(?:thana|upazila|ps)\s*[:\-]?\s*([A-Za-zঀ-৿]+)/i) || text.match(/([A-Za-zঀ-৿]+)\s+(?:thana|upazila)\b/i);
  const thana = thanaMatch ? cap(thanaMatch[1].trim()) : "";
  let area = "";
  if (district) {
    const di = lines2.findIndex((l) => l.toLowerCase() === district.toLowerCase());
    const prev = di > 0 ? lines2[di - 1] : "";
    if (prev && !/^(house|road|holding|block|sector|flat|plot|bldg|building|\d)/i.test(prev) && prev.toLowerCase() !== name.toLowerCase()) {
      area = prev;
    }
  }
  const lm = text.match(
    /(?:near|beside|opposite|behind|in front of|পাশে|সামনে|কাছে|বিপরীতে)\s+([^,\n]+)/i
  );
  const landmark = lm ? lm[0].trim() : "";
  const warnings = [];
  if (!phone) warnings.push("No phone number found");
  if (!district) warnings.push("District not recognised");
  if (!name) warnings.push("Could not detect a name");
  if (address.length < 8) warnings.push("Address looks too short");
  return { name, phone, district, thana, area, landmark, address, warnings };
}

// src/components/AddressFormatter.tsx
import { jsx as jsx18, jsxs as jsxs18 } from "react/jsx-runtime";
var SAMPLE = "Rahim Uddin 01712345678 House 5, Road 3, Dhanmondi, Dhaka";
function AddressFormatter({
  brand = "Contra Commerce",
  ctaText = "Clean every order address automatically in Contra Commerce",
  ctaUrl = "#",
  className = ""
}) {
  const [raw, setRaw] = useState18(SAMPLE);
  const result = useMemo16(() => parseAddress({ raw }), [raw]);
  useResultTracking("address-formatter", { warnings: result.warnings.length });
  const formatted = [
    result.name && `Name: ${result.name}`,
    result.phone && `Phone: ${result.phone}`,
    result.area && `Area: ${result.area}`,
    result.thana && `Thana/Upazila: ${result.thana}`,
    result.district && `District: ${result.district}`,
    result.landmark && `Landmark: ${result.landmark}`,
    result.address && `Address: ${result.address}`
  ].filter(Boolean).join("\n");
  const Field5 = ({ label, value }) => /* @__PURE__ */ jsxs18("div", { className: "flex justify-between gap-3 border-b border-gray-100 py-2 text-sm", children: [
    /* @__PURE__ */ jsx18("span", { className: "text-gray-500", children: label }),
    /* @__PURE__ */ jsx18(
      "span",
      {
        className: "text-right font-medium text-gray-900",
        suppressHydrationWarning: true,
        translate: "no",
        children: value || "\u2014"
      }
    )
  ] });
  return /* @__PURE__ */ jsxs18("div", { className: `grid items-start gap-6 lg:grid-cols-2 ${className}`, children: [
    /* @__PURE__ */ jsx18(InputCard, { title: "Paste the messy address", children: /* @__PURE__ */ jsx18(TextArea, { label: "Customer address", value: raw, onChange: setRaw, rows: 6, placeholder: SAMPLE }) }),
    /* @__PURE__ */ jsxs18(ResultsColumn, { children: [
      /* @__PURE__ */ jsxs18(OutputBox, { title: "Cleaned & structured", children: [
        /* @__PURE__ */ jsx18(Field5, { label: "Name", value: result.name }),
        /* @__PURE__ */ jsx18(Field5, { label: "Phone", value: result.phone }),
        /* @__PURE__ */ jsx18(Field5, { label: "Area", value: result.area }),
        /* @__PURE__ */ jsx18(Field5, { label: "Thana / Upazila", value: result.thana }),
        /* @__PURE__ */ jsx18(Field5, { label: "District", value: result.district }),
        /* @__PURE__ */ jsx18(Field5, { label: "Landmark", value: result.landmark }),
        /* @__PURE__ */ jsx18(Field5, { label: "Address", value: result.address }),
        result.warnings.length > 0 && /* @__PURE__ */ jsxs18("div", { className: "mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-700", children: [
          "\u26A0\uFE0F ",
          result.warnings.join(" \xB7 ")
        ] })
      ] }),
      formatted && /* @__PURE__ */ jsx18(CopyField, { label: "Copy formatted", value: formatted }),
      /* @__PURE__ */ jsx18(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/AdCopyGenerator.tsx
import { useState as useState19 } from "react";
import { jsx as jsx19, jsxs as jsxs19 } from "react/jsx-runtime";
var DAILY_LIMIT = 10;
function AdCopyGenerator({
  brand = "Contra Commerce",
  ctaText = "Generate unlimited ad copy inside Contra Commerce",
  ctaUrl = "#",
  className = "",
  endpoint = "/api/ad-copy"
}) {
  const [product, setProduct] = useState19("Premium Polo Shirt");
  const [audience, setAudience] = useState19("Young men, 18\u201330");
  const [offer, setOffer] = useState19("20% off this week");
  const [loading, setLoading] = useState19(false);
  const [result, setResult] = useState19(null);
  const [limitReached, setLimitReached] = useState19(false);
  const generate = async () => {
    const key = `contra-adcopy-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`;
    const used = Number(typeof localStorage !== "undefined" && localStorage.getItem(key) || "0");
    if (used >= DAILY_LIMIT) {
      setLimitReached(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product, audience, offer })
      });
      setResult(await res.json());
      if (typeof localStorage !== "undefined") localStorage.setItem(key, String(used + 1));
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs19("div", { className: `grid items-start gap-6 lg:grid-cols-2 ${className}`, children: [
    /* @__PURE__ */ jsxs19(InputCard, { title: "Product details", children: [
      /* @__PURE__ */ jsx19(TextField, { label: "Product", value: product, onChange: setProduct }),
      /* @__PURE__ */ jsx19(TextField, { label: "Target audience", value: audience, onChange: setAudience }),
      /* @__PURE__ */ jsx19(TextField, { label: "Offer", value: offer, onChange: setOffer }),
      /* @__PURE__ */ jsx19(
        "button",
        {
          type: "button",
          onClick: generate,
          disabled: loading,
          className: "mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60",
          children: loading ? "Generating\u2026" : "\u2728 Generate ad copy"
        }
      ),
      limitReached && /* @__PURE__ */ jsxs19("p", { className: "text-xs text-amber-600", children: [
        "You've hit today's free limit (",
        DAILY_LIMIT,
        "). Unlimited generations are available in ",
        brand,
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxs19(ResultsColumn, { children: [
      result ? /* @__PURE__ */ jsxs19(OutputBox, { title: result.demo ? "Generated copy (demo)" : "Generated copy", children: [
        result.demo && /* @__PURE__ */ jsx19("p", { className: "mb-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700", children: "Demo output \u2014 connect an AI key for tailored copy." }),
        /* @__PURE__ */ jsxs19("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx19(CopyField, { label: "Headline", value: result.headline }),
          /* @__PURE__ */ jsx19(CopyField, { label: "Primary text", value: result.primaryText }),
          /* @__PURE__ */ jsx19(CopyField, { label: "Call to action", value: result.cta }),
          /* @__PURE__ */ jsx19(CopyField, { label: "Caption", value: result.caption }),
          result.offerCopy && /* @__PURE__ */ jsx19(CopyField, { label: "Offer copy", value: result.offerCopy }),
          result.retargetingCopy && /* @__PURE__ */ jsx19(CopyField, { label: "Retargeting copy", value: result.retargetingCopy }),
          result.videoHook && /* @__PURE__ */ jsx19(CopyField, { label: "Video hook", value: result.videoHook })
        ] })
      ] }) : /* @__PURE__ */ jsx19(OutputBox, { title: "Generated copy", children: /* @__PURE__ */ jsx19("p", { className: "py-8 text-center text-sm text-gray-400", children: "Fill in the details and hit generate." }) }),
      /* @__PURE__ */ jsx19(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/ProductDescriptionGenerator.tsx
import { useState as useState20 } from "react";
import { jsx as jsx20, jsxs as jsxs20 } from "react/jsx-runtime";
function ProductDescriptionGenerator({
  brand = "Contra Commerce",
  ctaText = "Publish straight to your Contra Commerce store",
  ctaUrl = "#",
  className = "",
  endpoint = "/api/product-description"
}) {
  const [product, setProduct] = useState20("Premium Polo Shirt");
  const [details, setDetails] = useState20("100% cotton, 5 colours, sizes S\u2013XXL");
  const [image, setImage] = useState20("");
  const [loading, setLoading] = useState20(false);
  const [result, setResult] = useState20(null);
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(f);
  };
  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product, details, image })
      });
      setResult(await res.json());
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs20("div", { className: `grid items-start gap-6 lg:grid-cols-2 ${className}`, children: [
    /* @__PURE__ */ jsxs20(InputCard, { title: "Product details", children: [
      /* @__PURE__ */ jsx20(TextField, { label: "Product name", value: product, onChange: setProduct }),
      /* @__PURE__ */ jsx20(TextArea, { label: "Details / features", value: details, onChange: setDetails, rows: 4 }),
      /* @__PURE__ */ jsxs20("label", { className: "block", children: [
        /* @__PURE__ */ jsx20("span", { className: "mb-1 block text-sm text-gray-700", children: "Product image (optional)" }),
        /* @__PURE__ */ jsx20("input", { type: "file", accept: "image/*", onChange: onFile, className: "block w-full text-xs text-gray-500" })
      ] }),
      image && // eslint-disable-next-line @next/next/no-img-element
      /* @__PURE__ */ jsx20("img", { src: image, alt: "Product", className: "max-h-28 rounded-lg border border-gray-200" }),
      /* @__PURE__ */ jsx20(
        "button",
        {
          type: "button",
          onClick: generate,
          disabled: loading,
          className: "mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60",
          children: loading ? "Generating\u2026" : "\u2728 Generate description"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs20(ResultsColumn, { children: [
      result ? /* @__PURE__ */ jsxs20(OutputBox, { title: result.demo ? "Generated content (demo)" : "Generated content", children: [
        result.demo && /* @__PURE__ */ jsx20("p", { className: "mb-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700", children: "Demo output \u2014 connect an AI key for tailored content (and image reading)." }),
        /* @__PURE__ */ jsxs20("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx20(CopyField, { label: "Title", value: result.title }),
          /* @__PURE__ */ jsx20(CopyField, { label: "Short description", value: result.shortDescription }),
          /* @__PURE__ */ jsx20(CopyField, { label: "Full description", value: result.fullDescription }),
          /* @__PURE__ */ jsx20(CopyField, { label: "Features", value: result.features.map((f) => `\u2022 ${f}`).join("\n") }),
          /* @__PURE__ */ jsx20(CopyField, { label: "SEO title", value: result.seoTitle }),
          /* @__PURE__ */ jsx20(CopyField, { label: "Meta description", value: result.metaDescription }),
          result.facebookCaption && /* @__PURE__ */ jsx20(CopyField, { label: "Facebook caption", value: result.facebookCaption })
        ] }),
        /* @__PURE__ */ jsxs20(
          "a",
          {
            href: ctaUrl,
            className: "mt-3 block rounded-xl bg-ink p-3 text-center text-sm font-medium text-white transition hover:bg-gray-800",
            children: [
              "Publish to ",
              brand,
              " store \u2192"
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsx20(OutputBox, { title: "Generated content", children: /* @__PURE__ */ jsx20("p", { className: "py-8 text-center text-sm text-gray-400", children: "Enter your product (or upload an image) and hit generate." }) }),
      /* @__PURE__ */ jsx20(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/FraudChecker.tsx
import { useMemo as useMemo17, useState as useState21 } from "react";
import { Fragment as Fragment7, jsx as jsx21, jsxs as jsxs21 } from "react/jsx-runtime";
var VERDICT_STYLE = {
  approve: {
    border: "border-emerald-200 bg-emerald-50",
    text: "text-emerald-800",
    badge: "Normal risk"
  },
  verify: {
    border: "border-amber-200 bg-amber-50",
    text: "text-amber-800",
    badge: "Verify"
  },
  hold: {
    border: "border-red-200 bg-red-50",
    text: "text-red-800",
    badge: "Hold"
  },
  insufficient_data: {
    border: "border-gray-200 bg-gray-50",
    text: "text-gray-800",
    badge: "Not enough data"
  }
};
function FraudChecker({
  brand = "Contra Commerce",
  ctaText = "Auto-verify every order with Contra Commerce",
  ctaUrl = "#",
  className = "",
  endpoint = "/api/fraud-check"
}) {
  const [orderReference, setOrderReference] = useState21("");
  const [phone, setPhone] = useState21("");
  const [address, setAddress] = useState21("");
  const [consent, setConsent] = useState21(false);
  const [freshLookup, setFreshLookup] = useState21(false);
  const [loading, setLoading] = useState21(false);
  const [result, setResult] = useState21(null);
  const [error, setError] = useState21("");
  const validPhone = useMemo17(() => {
    const digits = phone.replace(/\D/g, "");
    return /^(?:88)?01\d{9}$/.test(digits);
  }, [phone]);
  const check = async () => {
    if (!validPhone || !consent) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          orderReference,
          phone,
          address,
          consent,
          refresh: freshLookup
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        setResult(null);
        setError(
          payload.error === "rate_limited" ? "Free check limit reached. Please try again later." : payload.error === "consent_required" ? "Please confirm permission to check this number." : "Enter a valid Bangladesh mobile number."
        );
        return;
      }
      setResult(payload);
    } catch {
      setResult(null);
      setError("Could not reach the risk checker. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const style = result ? VERDICT_STYLE[result.assessment.verdict] : null;
  return /* @__PURE__ */ jsxs21(CalculatorShell, { className, children: [
    /* @__PURE__ */ jsxs21(InputCard, { title: "Check a COD order", children: [
      /* @__PURE__ */ jsx21(
        TextField,
        {
          label: "Order ID / invoice (optional)",
          value: orderReference,
          onChange: setOrderReference,
          placeholder: "e.g. CC-10482"
        }
      ),
      /* @__PURE__ */ jsx21(
        TextField,
        {
          label: "Customer mobile number",
          value: phone,
          onChange: setPhone,
          placeholder: "017XXXXXXXX"
        }
      ),
      phone && !validPhone && /* @__PURE__ */ jsx21("p", { className: "text-xs text-red-600", children: "Enter an 11-digit Bangladesh mobile number." }),
      /* @__PURE__ */ jsx21(
        TextArea,
        {
          label: "Delivery address (optional)",
          value: address,
          onChange: setAddress,
          rows: 3,
          placeholder: "House, Road, Area, District"
        }
      ),
      /* @__PURE__ */ jsxs21("label", { className: "flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3", children: [
        /* @__PURE__ */ jsx21(
          "input",
          {
            type: "checkbox",
            checked: consent,
            onChange: (event) => setConsent(event.target.checked),
            className: "mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
          }
        ),
        /* @__PURE__ */ jsxs21("span", { className: "text-xs leading-relaxed text-gray-600", children: [
          "I am authorised to check this customer number for order fulfilment and accept the",
          " ",
          /* @__PURE__ */ jsx21("a", { href: "/privacy", target: "_blank", className: "font-medium text-blue-600 hover:underline", children: "privacy notice" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs21("label", { className: "flex items-start gap-2 px-1", children: [
        /* @__PURE__ */ jsx21(
          "input",
          {
            type: "checkbox",
            checked: freshLookup,
            onChange: (event) => setFreshLookup(event.target.checked),
            className: "mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
          }
        ),
        /* @__PURE__ */ jsx21("span", { className: "text-xs leading-relaxed text-gray-500", children: "Request a fresh connected-source lookup instead of using cached history. This may use courier or aggregator quota." })
      ] }),
      /* @__PURE__ */ jsx21(
        "button",
        {
          type: "button",
          onClick: check,
          disabled: loading || !validPhone || !consent,
          className: "mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
          children: loading ? "Checking courier history\u2026" : "Check delivery risk"
        }
      ),
      error && /* @__PURE__ */ jsx21("p", { className: "text-xs text-red-600", children: error }),
      /* @__PURE__ */ jsx21("p", { className: "text-xs leading-relaxed text-gray-400", children: "Results support fulfilment decisions; they do not prove fraud or criminal intent." })
    ] }),
    /* @__PURE__ */ jsxs21(ResultsColumn, { children: [
      result && style ? /* @__PURE__ */ jsxs21(Fragment7, { children: [
        result.demo && /* @__PURE__ */ jsxs21("div", { className: "rounded-2xl border-2 border-amber-400 bg-amber-50 p-4", children: [
          /* @__PURE__ */ jsx21("p", { className: "text-sm font-bold text-amber-900", children: "\u26A0 Simulated numbers \u2014 not this customer\u2019s real history" }),
          /* @__PURE__ */ jsx21("p", { className: "mt-1 text-xs leading-relaxed text-amber-900", children: "No courier account is connected, so the figures below are generated from the phone number itself for demonstration. They are not a delivery record. Do not accept, reject or hold a real order based on this result." }),
          /* @__PURE__ */ jsx21("p", { className: "mt-2 text-xs font-medium text-amber-900", children: "Connect a courier account to check the customer\u2019s actual parcel history." })
        ] }),
        /* @__PURE__ */ jsxs21("div", { className: `rounded-2xl border p-5 ${style.border}`, children: [
          /* @__PURE__ */ jsxs21("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsx21("p", { className: "text-xs font-medium uppercase tracking-wide text-gray-500", children: result.orderReference ? `Order ${result.orderReference}` : "Current order assessment" }),
            /* @__PURE__ */ jsxs21("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx21(
                "span",
                {
                  className: `rounded-full px-2.5 py-1 text-xs font-semibold ${result.demo ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`,
                  children: result.demo ? "Simulated \u2014 not real data" : result.cached || result.served === "cache" ? "Connected \xB7 cached" : /courier|aggregator|history/.test(result.served) ? "Connected \xB7 fresh lookup" : "Connected \xB7 own history"
                }
              ),
              /* @__PURE__ */ jsx21("span", { className: `rounded-full bg-white px-2.5 py-1 text-xs font-semibold ${style.text}`, children: style.badge })
            ] })
          ] }),
          /* @__PURE__ */ jsx21("p", { className: `mt-2 text-xl font-bold ${style.text}`, children: result.assessment.heading }),
          /* @__PURE__ */ jsx21("p", { className: "mt-1 text-sm text-gray-700", children: result.assessment.recommendation }),
          result.assessment.reasons.length > 0 && /* @__PURE__ */ jsx21("ul", { className: "mt-3 list-disc space-y-1 pl-5 text-xs text-gray-600", children: result.assessment.reasons.map((reason) => /* @__PURE__ */ jsx21("li", { children: reason }, reason)) })
        ] }),
        result.fallbackReason && /* @__PURE__ */ jsx21("p", { className: "rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800", children: result.fallbackReason }),
        /* @__PURE__ */ jsxs21(StatGrid, { children: [
          /* @__PURE__ */ jsx21(
            Stat,
            {
              label: "Parcel receive score",
              value: result.successRate == null ? "No data" : `${result.successRate}%`,
              tone: result.successRate == null ? "default" : result.successRate >= 75 ? "emerald" : "red"
            }
          ),
          /* @__PURE__ */ jsx21(
            Stat,
            {
              label: "Operational risk score",
              value: result.riskScore == null ? "No data" : `${result.riskScore}/100`,
              tone: result.riskScore == null ? "default" : result.riskScore >= 70 ? "red" : "emerald"
            }
          ),
          /* @__PURE__ */ jsx21(Stat, { label: "Previous delivered", value: String(result.delivered), tone: "emerald" }),
          /* @__PURE__ */ jsx21(Stat, { label: "Cancelled / returned", value: String(result.cancelled), tone: "red" }),
          /* @__PURE__ */ jsx21(Stat, { label: "Repeated failed attempts", value: String(result.repeatedAttempts) }),
          /* @__PURE__ */ jsx21(Stat, { label: "Confidence", value: result.confidence })
        ] }),
        /* @__PURE__ */ jsx21(OutputBox, { title: "Courier-wise parcel history", children: result.byCourier.length ? /* @__PURE__ */ jsx21("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs21("table", { className: "w-full min-w-[480px] text-sm", children: [
          /* @__PURE__ */ jsx21("thead", { children: /* @__PURE__ */ jsxs21("tr", { className: "text-left text-xs text-gray-400", children: [
            /* @__PURE__ */ jsx21("th", { className: "pb-2 font-medium", children: "Courier" }),
            /* @__PURE__ */ jsx21("th", { className: "pb-2 text-right font-medium", children: "Orders" }),
            /* @__PURE__ */ jsx21("th", { className: "pb-2 text-right font-medium", children: "Delivered" }),
            /* @__PURE__ */ jsx21("th", { className: "pb-2 text-right font-medium", children: "Failed" }),
            /* @__PURE__ */ jsx21("th", { className: "pb-2 text-right font-medium", children: "Receive score" })
          ] }) }),
          /* @__PURE__ */ jsx21("tbody", { children: result.byCourier.map((courier) => /* @__PURE__ */ jsxs21("tr", { className: "border-t border-gray-100", children: [
            /* @__PURE__ */ jsxs21("td", { className: "py-2 font-medium capitalize text-gray-800", children: [
              courier.courier,
              courier.ratingBased && /* @__PURE__ */ jsx21("span", { className: "block text-[10px] font-normal text-gray-400", children: "rating-based" })
            ] }),
            /* @__PURE__ */ jsx21("td", { className: "py-2 text-right text-gray-600", children: courier.total }),
            /* @__PURE__ */ jsx21("td", { className: "py-2 text-right text-emerald-700", children: courier.delivered }),
            /* @__PURE__ */ jsx21("td", { className: "py-2 text-right text-red-600", children: courier.failed }),
            /* @__PURE__ */ jsx21("td", { className: "py-2 text-right font-semibold text-gray-900", children: courier.successRate == null ? courier.rating ?? "No data" : `${courier.successRate}%` })
          ] }, courier.courier)) })
        ] }) }) : /* @__PURE__ */ jsx21("p", { className: "py-4 text-center text-sm text-gray-400", children: "No courier-specific history was returned." }) }),
        /* @__PURE__ */ jsxs21(OutputBox, { title: "Data quality & source", children: [
          /* @__PURE__ */ jsxs21("dl", { className: "space-y-2 text-xs text-gray-600", children: [
            /* @__PURE__ */ jsxs21("div", { className: "flex justify-between gap-3", children: [
              /* @__PURE__ */ jsx21("dt", { children: "Response source" }),
              /* @__PURE__ */ jsx21("dd", { className: "font-medium", children: result.served })
            ] }),
            /* @__PURE__ */ jsxs21("div", { className: "flex justify-between gap-3", children: [
              /* @__PURE__ */ jsx21("dt", { children: "Checked at" }),
              /* @__PURE__ */ jsx21("dd", { className: "font-medium", children: new Date(result.checkedAt).toLocaleString("en-BD") })
            ] }),
            /* @__PURE__ */ jsxs21("div", { className: "flex justify-between gap-3", children: [
              /* @__PURE__ */ jsx21("dt", { children: "Cache" }),
              /* @__PURE__ */ jsx21("dd", { className: "font-medium", children: result.cached ? "Cached" : "Fresh response" })
            ] }),
            /* @__PURE__ */ jsxs21("div", { className: "flex justify-between gap-3", children: [
              /* @__PURE__ */ jsx21("dt", { children: "Connected sources" }),
              /* @__PURE__ */ jsx21("dd", { className: "text-right font-medium", children: result.sources.map((source) => `${source.courier}${source.success ? "" : " (failed)"}`).join(", ") || "None" })
            ] })
          ] }),
          /* @__PURE__ */ jsx21("p", { className: "mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-500", children: result.legalNote })
        ] })
      ] }) : /* @__PURE__ */ jsx21(OutputBox, { title: "Order risk result", children: /* @__PURE__ */ jsx21("p", { className: "py-8 text-center text-sm text-gray-400", children: "Enter an authorised customer number to see connected courier history and an actionable fulfilment recommendation." }) }),
      /* @__PURE__ */ jsx21(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/ParcelTracking.tsx
import { useState as useState22 } from "react";
import { jsx as jsx22, jsxs as jsxs22 } from "react/jsx-runtime";
var STATUS_TONE = {
  Delivered: "text-emerald-700 bg-emerald-50",
  "Out for Delivery": "text-info bg-info/10",
  "In Transit": "text-gray-700 bg-gray-100",
  "On Hold": "text-amber-700 bg-amber-50",
  Returning: "text-red-700 bg-red-50"
};
function ParcelTracking({
  brand = "Contra Commerce",
  ctaText = "Auto-track every parcel & notify customers with Contra Commerce",
  ctaUrl = "#",
  className = "",
  endpoint = "/api/track",
  settingsUrl = "/courier-settings"
}) {
  const [input3, setInput] = useState22("CS123456\nPTH987654\nRDX555111");
  const [loading, setLoading] = useState22(false);
  const [results, setResults] = useState22(null);
  const [demo, setDemo] = useState22(false);
  const [error, setError] = useState22("");
  const [needsConnection, setNeedsConnection] = useState22(false);
  const track = async () => {
    const trackingNumbers = input3.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    if (!trackingNumbers.length) {
      setResults(null);
      setError("Enter at least one tracking number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ trackingNumbers })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "tracking_failed");
      setResults(data.results);
      setDemo(data.demo);
      setNeedsConnection(false);
    } catch (cause) {
      setResults(null);
      setDemo(false);
      const connectionMissing = cause instanceof Error && cause.message === "courier_connection_required";
      setNeedsConnection(connectionMissing);
      setError(
        connectionMissing ? "" : "Tracking is temporarily unavailable. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs22("div", { className: `grid items-start gap-6 lg:grid-cols-2 ${className}`, children: [
    /* @__PURE__ */ jsxs22(InputCard, { title: "Tracking numbers", children: [
      /* @__PURE__ */ jsx22(
        TextArea,
        {
          label: "One per line",
          value: input3,
          onChange: setInput,
          rows: 6,
          placeholder: "CS123456"
        }
      ),
      /* @__PURE__ */ jsx22(
        "button",
        {
          type: "button",
          onClick: track,
          disabled: loading,
          className: "mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60",
          children: loading ? "Tracking\u2026" : "Track parcels"
        }
      ),
      error && /* @__PURE__ */ jsx22("p", { className: "text-xs text-red-700", children: error }),
      needsConnection && /* @__PURE__ */ jsxs22("div", { className: "rounded-xl border border-amber-200 bg-amber-50 p-3", children: [
        /* @__PURE__ */ jsx22("p", { className: "text-sm font-semibold text-amber-900", children: "Connect a courier account first" }),
        /* @__PURE__ */ jsx22("p", { className: "mt-1 text-xs leading-relaxed text-amber-900", children: "Live parcel status comes from your own courier account, so there is nothing to track until one is connected. This is a one-time setup \u2014 it is not a temporary outage." }),
        /* @__PURE__ */ jsx22(
          "a",
          {
            href: settingsUrl,
            className: "mt-2 inline-block rounded-lg bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white",
            children: "Open courier settings"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs22(ResultsColumn, { children: [
      /* @__PURE__ */ jsx22(OutputBox, { title: "Parcel status", children: results && results.length > 0 ? /* @__PURE__ */ jsxs22("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx22(
          "div",
          {
            className: `rounded-lg px-3 py-2 text-xs ${demo ? "border border-amber-200 bg-amber-50 text-amber-800" : "border border-emerald-200 bg-emerald-50 text-emerald-800"}`,
            children: demo ? "Demo data \u2014 connect the courier backend for live parcel statuses." : "Live courier data"
          }
        ),
        results.map((r) => /* @__PURE__ */ jsxs22("div", { className: "flex items-center justify-between gap-2 border-b border-gray-100 py-2 text-sm", children: [
          /* @__PURE__ */ jsxs22("div", { children: [
            /* @__PURE__ */ jsx22("p", { className: "font-medium text-gray-800", children: r.tracking }),
            /* @__PURE__ */ jsxs22("p", { className: "text-xs text-gray-400", children: [
              r.courier,
              " \xB7 ",
              r.lastUpdate
            ] })
          ] }),
          /* @__PURE__ */ jsx22("span", { className: `rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[r.status] ?? "bg-gray-100 text-gray-700"}`, children: r.status })
        ] }, r.tracking))
      ] }) : /* @__PURE__ */ jsx22("p", { className: "py-8 text-center text-sm text-gray-400", children: "Paste tracking numbers and hit track." }) }),
      /* @__PURE__ */ jsx22(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/StoreHealthChecker.tsx
import { useState as useState23 } from "react";
import { Fragment as Fragment8, jsx as jsx23, jsxs as jsxs23 } from "react/jsx-runtime";
function StoreHealthChecker({
  brand = "Contra Commerce",
  ctaText = "Fix these issues automatically with Contra Commerce",
  ctaUrl = "#",
  className = "",
  endpoint = "/api/store-health"
}) {
  const [url, setUrl] = useState23("");
  const [loading, setLoading] = useState23(false);
  const [result, setResult] = useState23(null);
  const check = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url })
      });
      setResult(await res.json());
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  const good = (result?.score ?? 0) >= 60;
  return /* @__PURE__ */ jsxs23("div", { className: `grid items-start gap-6 lg:grid-cols-2 ${className}`, children: [
    /* @__PURE__ */ jsxs23(InputCard, { title: "Your store URL", children: [
      /* @__PURE__ */ jsx23(TextField, { label: "Website", value: url, onChange: setUrl, placeholder: "myshop.com" }),
      /* @__PURE__ */ jsx23(
        "button",
        {
          type: "button",
          onClick: check,
          disabled: loading,
          className: "mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60",
          children: loading ? "Checking\u2026" : "Check my store"
        }
      ),
      /* @__PURE__ */ jsx23("p", { className: "text-xs text-gray-400", children: "We fetch your homepage and check common conversion & SEO signals." })
    ] }),
    /* @__PURE__ */ jsxs23(ResultsColumn, { children: [
      result ? result.reachable ? /* @__PURE__ */ jsxs23(Fragment8, { children: [
        /* @__PURE__ */ jsx23(
          ResultHero,
          {
            label: "Store health score",
            value: `${result.score} / 100`,
            positive: good,
            sub: `${result.passed} of ${result.total} checks passed`
          }
        ),
        /* @__PURE__ */ jsx23(OutputBox, { title: "Checklist", children: /* @__PURE__ */ jsx23("div", { className: "space-y-1.5", children: result.checks.map((c) => /* @__PURE__ */ jsxs23("div", { className: "flex items-start gap-2 text-sm", children: [
          /* @__PURE__ */ jsx23("span", { children: c.pass ? "\u2705" : "\u274C" }),
          /* @__PURE__ */ jsxs23("span", { className: "text-gray-700", children: [
            /* @__PURE__ */ jsx23("b", { children: c.label }),
            " \u2014 ",
            /* @__PURE__ */ jsx23("span", { className: "text-gray-500", children: c.detail })
          ] })
        ] }, c.label)) }) })
      ] }) : /* @__PURE__ */ jsx23(OutputBox, { title: "Could not reach the site", children: /* @__PURE__ */ jsx23("p", { className: "py-6 text-center text-sm text-gray-500", children: "We couldn't load that URL. Check the address and try again." }) }) : /* @__PURE__ */ jsx23(OutputBox, { title: "Store health score", children: /* @__PURE__ */ jsx23("p", { className: "py-8 text-center text-sm text-gray-400", children: "Enter your store URL to run the check." }) }),
      /* @__PURE__ */ jsx23(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/NameChecker.tsx
import { useMemo as useMemo18, useState as useState24 } from "react";

// src/logic/name-ideas.ts
var SUFFIXES = ["Shop", "Mart", "Hub", "Bazar", "Kart", "Store", "Zone", "Point", "Deals", "BD"];
var PREFIXES = ["My", "The", "Go", "Daily", "Prime"];
var SLOGAN_TEMPLATES = [
  (k) => `${title(k)} \u2014 delivered to your door.`,
  (k) => `Your trusted ${k.toLowerCase()} store in Bangladesh.`,
  (k) => `Quality ${k.toLowerCase()}, honest prices.`,
  (k) => `Shop ${k.toLowerCase()}. Smile more.`
];
function title(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
var PALETTES = [
  [
    { name: "Primary", hex: "#1a73e8" },
    { name: "Accent", hex: "#ff6d00" },
    { name: "Dark", hex: "#0f172a" }
  ],
  [
    { name: "Primary", hex: "#059669" },
    { name: "Accent", hex: "#f59e0b" },
    { name: "Dark", hex: "#1f2937" }
  ],
  [
    { name: "Primary", hex: "#db2777" },
    { name: "Accent", hex: "#7c3aed" },
    { name: "Dark", hex: "#111827" }
  ],
  [
    { name: "Primary", hex: "#e11d48" },
    { name: "Accent", hex: "#0ea5e9" },
    { name: "Dark", hex: "#18181b" }
  ]
];
function generateNames(keyword) {
  const k = (keyword || "").trim();
  if (!k) return { names: [], slugs: [], slogans: [], fbUsernames: [], colors: [] };
  const base = title(k);
  const names = /* @__PURE__ */ new Set();
  for (const suf of SUFFIXES) names.add(`${base} ${suf}`);
  for (const pre of PREFIXES) names.add(`${pre} ${base}`);
  const list = [...names].slice(0, 10);
  const slugs = list.map((n4) => n4.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".com");
  const slogans = SLOGAN_TEMPLATES.map((t) => t(k));
  const root = k.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const fbUsernames = [root, `${root}bd`, `${root}.shop`, `${root}official`, `the${root}`];
  const idx = root.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % PALETTES.length;
  return { names: list, slugs, slogans, fbUsernames, colors: PALETTES[idx] };
}

// src/components/NameChecker.tsx
import { jsx as jsx24, jsxs as jsxs24 } from "react/jsx-runtime";
function NameChecker({
  brand = "Contra Commerce",
  ctaText = "Found a name? Launch your free store on Contra Commerce",
  ctaUrl = "#",
  className = "",
  endpoint = "/api/domain-check"
}) {
  const [keyword, setKeyword] = useState24("shoes");
  const [ideas, setIdeas] = useState24(() => generateNames("shoes"));
  const [domains, setDomains] = useState24([]);
  const [loading, setLoading] = useState24(false);
  const suggestion = useMemo18(() => generateNames(keyword), [keyword]);
  const check = async () => {
    setIdeas(suggestion);
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domains: suggestion.slugs })
      });
      const data = await res.json();
      setDomains(data.results);
    } catch {
      setDomains([]);
    } finally {
      setLoading(false);
    }
  };
  const badge = (a) => a === true ? ["Available", "text-emerald-700 bg-emerald-50"] : a === false ? ["Taken", "text-red-600 bg-red-50"] : ["\u2014", "text-gray-500 bg-gray-100"];
  return /* @__PURE__ */ jsxs24("div", { className: `grid items-start gap-6 lg:grid-cols-2 ${className}`, children: [
    /* @__PURE__ */ jsxs24(InputCard, { title: "Brand keyword", children: [
      /* @__PURE__ */ jsx24(TextField, { label: "Your niche / keyword", value: keyword, onChange: setKeyword, placeholder: "shoes" }),
      /* @__PURE__ */ jsx24(
        "button",
        {
          type: "button",
          onClick: check,
          disabled: loading,
          className: "mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60",
          children: loading ? "Checking domains\u2026" : "Generate names & check domains"
        }
      ),
      /* @__PURE__ */ jsxs24("div", { className: "pt-3", children: [
        /* @__PURE__ */ jsx24("p", { className: "mb-1 text-xs text-gray-500", children: "Slogan ideas" }),
        /* @__PURE__ */ jsx24("div", { className: "space-y-1.5", children: ideas.slogans.map((s) => /* @__PURE__ */ jsx24(CopyField, { value: s }, s)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs24(ResultsColumn, { children: [
      /* @__PURE__ */ jsx24(OutputBox, { title: "Name ideas & domains", children: /* @__PURE__ */ jsx24("div", { className: "space-y-1.5", children: ideas.names.map((name, i) => {
        const dom = domains.find((d) => d.domain === ideas.slugs[i]);
        const [label, cls] = badge(dom?.available ?? null);
        return /* @__PURE__ */ jsxs24("div", { className: "flex items-center justify-between gap-2 border-b border-gray-100 py-1.5 text-sm", children: [
          /* @__PURE__ */ jsxs24("div", { children: [
            /* @__PURE__ */ jsx24("p", { className: "font-medium text-gray-800", children: name }),
            /* @__PURE__ */ jsx24("p", { className: "text-xs text-gray-400", children: ideas.slugs[i] })
          ] }),
          /* @__PURE__ */ jsx24("span", { className: `rounded-full px-2.5 py-1 text-xs font-medium ${cls}`, children: label })
        ] }, name);
      }) }) }),
      /* @__PURE__ */ jsx24(OutputBox, { title: "Facebook page username ideas", children: /* @__PURE__ */ jsx24("div", { className: "flex flex-wrap gap-2", children: ideas.fbUsernames.map((u) => /* @__PURE__ */ jsxs24("span", { className: "rounded-lg bg-gray-100 px-2.5 py-1 text-sm text-gray-700", children: [
        "@",
        u
      ] }, u)) }) }),
      /* @__PURE__ */ jsx24(OutputBox, { title: "Recommended brand colours", children: /* @__PURE__ */ jsx24("div", { className: "flex gap-3", children: ideas.colors.map((c) => /* @__PURE__ */ jsxs24("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx24(
          "span",
          {
            className: "h-8 w-8 rounded-lg border border-gray-200",
            style: { backgroundColor: c.hex }
          }
        ),
        /* @__PURE__ */ jsxs24("span", { className: "text-xs text-gray-500", children: [
          c.name,
          /* @__PURE__ */ jsx24("br", {}),
          c.hex
        ] })
      ] }, c.hex)) }) }),
      /* @__PURE__ */ jsx24(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}

// src/components/DemandSurveyMaker.tsx
import { useEffect as useEffect16, useMemo as useMemo19, useState as useState25 } from "react";

// src/logic/demand-survey.ts
var isBrowser = typeof window !== "undefined";
function toBase64(s) {
  if (isBrowser) return window.btoa(unescape(encodeURIComponent(s)));
  return Buffer.from(s, "utf-8").toString("base64");
}
function fromBase64(s) {
  if (isBrowser) return decodeURIComponent(escape(window.atob(s)));
  return Buffer.from(s, "base64").toString("utf-8");
}
function clean2(survey) {
  return {
    imageUrl: survey.imageUrl?.trim() || void 0,
    questions: (survey.questions || []).map((q) => ({
      question: (q.question || "").slice(0, 200),
      options: q.options.map((o) => o.trim()).filter(Boolean).slice(0, 8)
    })).filter((q) => q.question && q.options.length > 0).slice(0, 10)
  };
}
function encodeSurvey(survey) {
  return toBase64(JSON.stringify(clean2(survey))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decodeSurvey(encoded) {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const parsed = JSON.parse(fromBase64(b64));
    if (!Array.isArray(parsed.questions)) return null;
    return parsed;
  } catch {
    return null;
  }
}
function buildSurveyLink(survey, basePollUrl) {
  return `${basePollUrl}?s=${encodeSurvey(survey)}`;
}

// src/components/DemandSurveyMaker.tsx
import { jsx as jsx25, jsxs as jsxs25 } from "react/jsx-runtime";
var START = [
  { question: "Which colour would you buy?", options: ["Black", "White", "Navy", ""] },
  { question: "What price would you pay?", options: ["\u09F3800", "\u09F31000", "\u09F31200", ""] }
];
function DemandSurveyMaker({
  brand = "Contra Commerce",
  ctaText = "Turn demand into pre-orders with Contra Commerce",
  ctaUrl = "#",
  className = "",
  pollBaseUrl
}) {
  const [imageUrl, setImageUrl] = useState25("");
  const [questions, setQuestions] = useState25(START);
  const [base, setBase] = useState25(pollBaseUrl ?? "/poll");
  useEffect16(() => setBase(pollBaseUrl ?? `${window.location.origin}/poll`), [pollBaseUrl]);
  const survey = useMemo19(
    () => ({
      imageUrl: imageUrl.trim() || void 0,
      questions: questions.map((q) => ({ question: q.question, options: q.options.filter((o) => o.trim()) })).filter((q) => q.question && q.options.length > 0)
    }),
    [imageUrl, questions]
  );
  const link = useMemo19(() => buildSurveyLink(survey, base), [survey, base]);
  const setQ = (qi, patch) => setQuestions((prev) => prev.map((q, i) => i === qi ? { ...q, ...patch } : q));
  const setOpt = (qi, oi, v) => setQuestions(
    (prev) => prev.map((q, i) => i === qi ? { ...q, options: q.options.map((o, j) => j === oi ? v : o) } : q)
  );
  const addOpt = (qi) => setQ(qi, { options: [...questions[qi].options, ""] });
  const addQuestion = () => setQuestions((prev) => [...prev, { question: "", options: ["", ""] }]);
  const removeQuestion = (qi) => setQuestions((prev) => prev.filter((_, i) => i !== qi));
  return /* @__PURE__ */ jsxs25("div", { className: `grid items-start gap-6 lg:grid-cols-2 ${className}`, children: [
    /* @__PURE__ */ jsxs25(InputCard, { title: "Build your survey", children: [
      /* @__PURE__ */ jsx25(TextField, { label: "Product image URL (optional)", value: imageUrl, onChange: setImageUrl, placeholder: "https://\u2026/product.jpg" }),
      questions.map((q, qi) => /* @__PURE__ */ jsxs25("div", { className: "rounded-xl border border-gray-200 p-3", children: [
        /* @__PURE__ */ jsxs25("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx25(
            "input",
            {
              className: "flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm",
              placeholder: `Question ${qi + 1}`,
              value: q.question,
              onChange: (e) => setQ(qi, { question: e.target.value })
            }
          ),
          questions.length > 1 && /* @__PURE__ */ jsx25("button", { type: "button", onClick: () => removeQuestion(qi), className: "px-1 text-gray-400 hover:text-red-600", "aria-label": "Remove question", children: "\u2715" })
        ] }),
        /* @__PURE__ */ jsx25("div", { className: "mt-2 space-y-1.5", children: q.options.map((o, oi) => /* @__PURE__ */ jsx25(
          "input",
          {
            className: "w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm",
            placeholder: `Option ${oi + 1}`,
            value: o,
            onChange: (e) => setOpt(qi, oi, e.target.value)
          },
          oi
        )) }),
        /* @__PURE__ */ jsx25("button", { type: "button", onClick: () => addOpt(qi), className: "mt-1.5 text-xs font-medium text-blue-600 hover:text-blue-800", children: "+ Add option" })
      ] }, qi)),
      /* @__PURE__ */ jsx25("button", { type: "button", onClick: addQuestion, className: "text-sm font-medium text-blue-600 hover:text-blue-800", children: "+ Add question" })
    ] }),
    /* @__PURE__ */ jsxs25(ResultsColumn, { children: [
      /* @__PURE__ */ jsxs25(OutputBox, { title: "Your shareable poll link", children: [
        /* @__PURE__ */ jsx25(CopyField, { value: link }),
        /* @__PURE__ */ jsx25("p", { className: "mt-2 text-xs text-gray-400", children: "Share on Facebook or WhatsApp \u2014 anyone can open and vote, no login." })
      ] }),
      /* @__PURE__ */ jsxs25(OutputBox, { title: "Preview", children: [
        survey.imageUrl && // eslint-disable-next-line @next/next/no-img-element
        /* @__PURE__ */ jsx25("img", { src: survey.imageUrl, alt: "Product", className: "mb-3 max-h-40 rounded-lg" }),
        survey.questions.map((q, i) => /* @__PURE__ */ jsxs25("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx25("p", { className: "font-medium text-gray-900", children: q.question }),
          /* @__PURE__ */ jsx25("div", { className: "mt-1.5 space-y-1", children: q.options.map((o) => /* @__PURE__ */ jsx25("div", { className: "rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700", children: o }, o)) })
        ] }, i))
      ] }),
      /* @__PURE__ */ jsx25(CtaCard, { href: ctaUrl, text: ctaText, brand })
    ] })
  ] });
}
export {
  AdCopyGenerator,
  AddressFormatter,
  AdsBreakeven,
  BD_DISTRICTS,
  CAMPAIGN_GOALS,
  COURIER_RATES,
  CalculatorShell,
  CalculatorToolsStudio,
  CampaignOfferBuilder,
  CareerToolsStudio,
  CbmCalculator,
  CodSettlementCalculator,
  CopyField,
  CourierChargeComparison,
  CreatorToolsStudio,
  CtaCard,
  DISTRICT_OPTIONS,
  DeadStockCalculator,
  DemandSurveyMaker,
  DeveloperToolsStudio,
  DiscountCalculator,
  DropdownControl,
  EducationToolsStudio,
  FraudChecker,
  HealthToolsStudio,
  HomeToolsStudio,
  ImageToolsStudio,
  InputCard,
  InvoiceGenerator,
  LaunchToolSuite,
  NameChecker,
  NumberField,
  OutputBox,
  Panel,
  ParcelTracking,
  PdfDocumentStudio,
  ProductDescriptionGenerator,
  ProductivityToolsStudio,
  ProfitCalculator,
  QR_TYPE_OPTIONS,
  QrGenerator,
  ResultHero,
  ResultsColumn,
  ReturnLossCalculator,
  SIZE_PRESETS,
  SelectField,
  SellingPriceCalculator,
  SizeRatioCalculator,
  Stat,
  StatGrid,
  StoreHealthChecker,
  TextArea,
  TextField,
  TextUtilityStudio,
  TravelToolsStudio,
  WebsiteSeoStudio,
  WhatsappLinkGenerator,
  ZONE_OPTIONS,
  assessOperationalOrderRisk,
  bdt,
  buildCampaignOffer,
  buildQrContent,
  buildSurveyLink,
  buildWhatsappLink,
  calcAdsBreakeven,
  calcCbm,
  calcCodSettlement,
  calcDeadStock,
  calcDiscount,
  calcInvoice,
  calcProfit,
  calcReturnLoss,
  calcSellingPrice,
  calcSizeRatio,
  compareCourierCharges,
  dec,
  decodeSurvey,
  detectCourierZone,
  encodeSurvey,
  generateNames,
  normalizeBdPhone,
  num,
  parseAddress,
  pct,
  useResultTracking
};
