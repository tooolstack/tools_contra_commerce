# @contra/tools-kit

Contra Commerce-এর ফ্রি বিজনেস টুলগুলোর **drop-in React component + pure logic** প্যাকেজ।
এক লাইন `import` করে যেকোনো Next.js + Tailwind অ্যাপে বসানো যায় — SaaS-এর কোড ছুঁতে হয় না।

```tsx
import { ProfitCalculator } from '@contra/tools-kit';

export default function Page() {
  return <ProfitCalculator brand="Contra Commerce" ctaUrl="/signup" />;
}
```

---

## Boss-এর জন্য: SaaS-এ বসানোর ৩ ধাপ (Next.js + Tailwind)

> এই package **source (TSX) হিসেবে** ship হয়, তাই কোনো build step লাগে না — শুধু নিচের
> ৩ লাইন।

### ১. Install

GitHub Packages থেকে (একবার `.npmrc`-এ registry সেট করে নিন):

```bash
# .npmrc (SaaS repo-র root-এ)
@contra:registry=https://npm.pkg.github.com
```

```bash
npm install @contra/tools-kit
```

### ২. `next.config` — এই package transpile করতে বলুন

```js
// next.config.mjs
const nextConfig = {
  transpilePackages: ['@contra/tools-kit'], // ⬅️ এই এক লাইন
};
export default nextConfig;
```

### ৩. `tailwind.config` — content path যোগ করুন

Tailwind ডিফল্টভাবে `node_modules` scan করে না, তাই এই লাইনটা না দিলে component-এর
class গুলো CSS-এ generate হবে না (styling ভেঙে যাবে):

```ts
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{ts,tsx}',
    './node_modules/@contra/tools-kit/src/**/*.{ts,tsx}', // ⬅️ এই এক লাইন
  ],
  // ...
};
```

**ব্যস।** এখন যেকোনো page/component-এ `<ProfitCalculator />` বসানো যাবে।

---

## বিকল্প: Tailwind config ছুঁতে না চাইলে (Method B — compiled CSS)

boss যদি Tailwind `content` edit না করতে চান, তাহলে prebuilt stylesheet ব্যবহার করুন।
এটা preflight ছাড়া build হয়, তাই host-এর base style রিসেট করে না:

```bash
npm run build:css   # dist/styles.css তৈরি করে
```

```tsx
// app layout-এ একবার import করলেই হলো:
import '@contra/tools-kit/styles.css';
```

---

## `<ProfitCalculator />` props

| prop        | type                                          | default              | কাজ                                   |
| ----------- | --------------------------------------------- | -------------------- | ------------------------------------- |
| `brand`     | `string`                                      | `'Contra Commerce'`  | CTA-তে ব্র্যান্ড নাম                   |
| `ctaText`   | `string`                                      | (Bangla default)     | CTA-র হেডলাইন                         |
| `ctaUrl`    | `string`                                      | `'#'`                | CTA বাটন কোথায় নিয়ে যাবে (signup)     |
| `className` | `string`                                      | `''`                 | বাইরের wrapper-এ extra class           |
| `onResult`  | `(result, input) => void`                     | —                    | প্রতিবার হিসাব হলে fire — lead capture / analytics-এর hook |

`onResult` দিয়ে boss চাইলে ফলাফল নিজের PostgreSQL-এ lead হিসেবে সেভ করতে পারেন:

```tsx
<ProfitCalculator
  onResult={(result, input) => {
    // মোবাইল/ইমেইল নিয়ে নিজের API-তে POST করুন
  }}
/>
```

---

## শুধু logic লাগলে (UI ছাড়া)

হিসাবের নিয়ম একটাই জায়গায় — server-এও চালানো যায়:

```ts
import { calcProfit } from '@contra/tools-kit/logic/profit';

const r = calcProfit({
  productCost: 300, sellingPrice: 800, adCostPerOrder: 120,
  forwardCharge: 70, returnCharge: 70, packagingCost: 20,
  codChargePct: 1, returnRatePct: 20, monthlyOrders: 500,
});
// r.netProfitPerDelivered, r.breakEvenPrice, r.maxAdCostPerOrder, r.monthly ...
```

---

## Dev

```bash
npm run test        # vitest — logic-এর unit test
npm run build       # tsup — optional dist build (non-Next হোস্টের জন্য)
npm run build:css   # standalone dist/styles.css
```
