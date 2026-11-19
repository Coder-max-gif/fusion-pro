import { BOT_ACCENT, BOTS } from "@/lib/bots";
import { RiskMeter } from "./RiskMeter";
import { Reveal } from "./Reveal";

export function Risk() {
  return (
    <section id="risk" data-shot="risk" aria-labelledby="risk-title" className="safe-x relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-danger/30 bg-[linear-gradient(180deg,rgb(255_107_107/0.08),rgb(9_13_36/0.92)_40%)] p-6 sm:p-10 lg:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-danger/20 blur-3xl"
            />
            <div className="relative flex flex-wrap items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-danger/15 text-danger">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M12 3 2 20h20L12 3Zm0 6v5m0 3v.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="eyebrow !text-danger">Chapter 08 · Risk disclosure</p>
              <span className="ml-auto rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                Draft · pending legal &amp; compliance review
              </span>
            </div>

            <h2 id="risk-title" className="display relative mt-6 max-w-3xl text-[clamp(1.9rem,4.6vw,3.2rem)] font-semibold text-balance">
              Trading involves substantial risk. You could lose all of it.
            </h2>

            <div className="relative mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div className="space-y-4 text-[1.05rem] leading-relaxed text-ink/90">
                <p>
                  The proposed monthly target ranges shown on this website are illustrative figures supplied for
                  describing the three strategy profiles. They are{" "}
                  <strong>not guaranteed returns, promises, or representations of actual performance</strong>.
                </p>
                <p>
                  Actual results may be negative. <strong>You may lose some or all of the capital allocated to trading.</strong>{" "}
                  The high-risk FUSION NOVA profile carries a particularly elevated risk of substantial or total account
                  loss.
                </p>
                <p>
                  Past performance, if supplied in the future, would not guarantee future results. Only consider trading
                  with money you can afford to lose, and seek independent financial advice where appropriate.
                </p>
                <p className="rounded-xl border border-line bg-white/[0.03] p-4 text-sm text-muted">
                  The content on this website is for general information only. It is not individualised investment,
                  financial, legal or tax advice, and it is not an offer or solicitation to buy or sell any financial
                  product.
                </p>
              </div>

              <ul className="grid content-start gap-3" aria-label="Downside by profile">
                {BOTS.map((b) => (
                  <li key={b.id} className="rounded-2xl border border-line bg-void/60 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold" style={{ color: BOT_ACCENT[b.id].color }}>
                        {b.name}
                      </span>
                      <RiskMeter tier={b.riskTier} color={BOT_ACCENT[b.id].color} label={b.risk} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{b.downside}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
