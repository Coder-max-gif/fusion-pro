"use client";

import { useId, useState } from "react";
import { Reveal, SectionHeading } from "./Reveal";

const FAQS: { q: string; a: string[] }[] = [
  {
    q: "Are the monthly targets guaranteed?",
    a: [
      "No. The ranges shown — 1–2% for FUSION SAFE, 5–10% for FUSION CORE and 10–15% for FUSION NOVA — are illustrative, proposed monthly targets used to describe each strategy profile.",
      "They are not guaranteed returns, promises, forecasts or verified results. Actual results may be lower, zero or negative.",
    ],
  },
  {
    q: "Can I lose money?",
    a: [
      "Yes. With any of the three profiles you could lose some or all of the capital allocated to trading. A lower-risk profile reduces the intended level of risk; it does not remove it.",
    ],
  },
  {
    q: "What is the difference between the three bots?",
    a: [
      "Each bot represents a different balance of target, activity and risk. FUSION SAFE is a more conservative profile with the lowest proposed target. FUSION CORE is more active, with higher volatility and a greater possibility of losses. FUSION NOVA is aggressive, with the highest proposed target and very high risk, including possible total loss of the trading account.",
    ],
  },
  {
    q: "Which plan has the highest risk?",
    a: ["FUSION NOVA. It has the highest proposed target range and the highest level of risk of the three profiles."],
  },
  {
    q: "Can the high-risk account be completely lost?",
    a: [
      "Yes. The trading account used with FUSION NOVA could lose a substantial amount or be completely lost. Only consider it with money you can afford to lose entirely.",
    ],
  },
  {
    q: "Is this financial advice?",
    a: [
      "No. This website is for general information only and is not individualised investment, financial, legal or tax advice. Consider seeking independent financial advice before making any trading decision.",
    ],
  },
  {
    q: "Where can I find verified performance information?",
    a: [
      "No verified performance information has been published for FUSION AI at this time. If performance information is published in future, past performance would not guarantee future results.",
    ],
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: string[]; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left text-base font-semibold sm:text-lg"
        >
          <span className="transition-colors group-hover:text-safe">{q}</span>
          <span
            aria-hidden="true"
            className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
              open ? "rotate-45 border-safe bg-safe/10 text-safe" : "border-line text-muted"
            }`}
          >
            <span className="absolute h-0.5 w-3.5 rounded bg-current" />
            <span className="absolute h-3.5 w-0.5 rounded bg-current" />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className="faq-body"
        data-open={open}
        inert={!open}
      >
        <div>
          <div className="space-y-3 pb-6 pr-4 leading-relaxed text-muted sm:pr-12">
            {a.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" data-shot="faq" aria-labelledby="faq-title" className="safe-x relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="faq-title"
            eyebrow="Chapter 09 · FAQ"
            title="Straight answers."
            intro="If a question is not answered here, the information has not been published yet. We would rather say so than guess."
          />
        </div>
        <Reveal delay={0.1}>
          <ul className="border-t border-line">
            {FAQS.map((f, i) => (
              <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
