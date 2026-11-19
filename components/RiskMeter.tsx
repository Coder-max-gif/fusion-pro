export function RiskMeter({ tier, color, label }: { tier: 1 | 2 | 3; color: string; label: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex gap-1" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className="h-2 w-6 rounded-full"
            style={{ background: n <= tier ? color : "rgb(255 255 255 / 0.1)" }}
          />
        ))}
      </span>
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em]" style={{ color }}>
        {label} risk
      </span>
    </span>
  );
}
