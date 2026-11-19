"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Reveal, SectionHeading } from "./Reveal";

const STEPS = [
  {
    title: "Explore the three strategy profiles",
    body: "Meet SAFE, CORE and NOVA and see how each balances its proposed target against risk.",
    href: "#bots",
    cta: "View the bots",
  },
  {
    title: "Understand the risk and limitations",
    body: "Read the risk disclosure in full. Every profile can lose money, and NOVA can lose the entire account.",
    href: "#risk",
    cta: "Read the risk",
  },
  {
    title: "Review the available product information",
    body: "Compare the profiles side by side and check the FAQ. Some product details have not been published yet.",
    href: "#compare",
    cta: "Compare profiles",
  },
  {
    title: "Make an informed decision",
    body: "Only consider trading with money you can afford to lose, and seek independent financial advice where appropriate.",
    href: "#faq",
    cta: "Read the FAQ",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="how" data-shot="how" aria-labelledby="how-title" className="safe-x relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="how-title"
          eyebrow="Chapter 06 · How it works"
          title="A journey built on understanding."
          intro="This is a conceptual path for exploring FUSION AI. Account opening, deposits and live trading are not available on this website."
        />

        <div className="relative mt-16">
          {/* Progress line */}
          <div aria-hidden="true" className="absolute left-[27px] top-0 h-full w-px bg-line lg:left-0 lg:top-[27px] lg:h-px lg:w-full">
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-safe via-core to-nova lg:hidden"
              style={{ scaleY: progress }}
            />
            <motion.div
              className="hidden h-full w-full origin-left bg-gradient-to-r from-safe via-core to-nova lg:block"
              style={{ scaleX: progress }}
            />
          </div>

          <ol ref={ref} className="relative grid gap-5 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1} className="relative pl-20 lg:pl-0 lg:pt-20">
              <span
                className="display absolute left-0 top-0 grid h-14 w-14 place-items-center rounded-full border border-line bg-deep text-lg font-semibold"
                aria-hidden="true"
              >
                0{i + 1}
              </span>
              <div className="panel h-full p-6">
                <h3 className="text-lg font-bold leading-snug">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
                <a
                  href={s.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-safe underline-offset-4 hover:underline"
                >
                  {s.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </Reveal>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
