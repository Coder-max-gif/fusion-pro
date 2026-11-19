"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      custom={delay}
    >
      {children}
    </M>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  id?: string;
}) {
  return (
    <Reveal as="header" className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display mt-4 text-[clamp(2rem,5vw,3.6rem)] font-semibold text-balance">
        {title}
      </h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">{intro}</p>}
    </Reveal>
  );
}
