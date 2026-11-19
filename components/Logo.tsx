export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="14" r="9.5" fill="none" stroke="#3fd8ff" strokeWidth="2.2" />
      <circle cx="13.5" cy="25" r="9.5" fill="none" stroke="#9478ff" strokeWidth="2.2" />
      <circle cx="26.5" cy="25" r="9.5" fill="none" stroke="#ff8a3d" strokeWidth="2.2" />
      <circle cx="20" cy="21.5" r="3.2" fill="#fff" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-[15px] font-semibold tracking-[0.08em]">
        FUSION<span className="text-safe"> AI</span>
      </span>
    </span>
  );
}
