import Link from "next/link";
import { Logo } from "./Logo";

const NAV = [
  ["Home", "#top"],
  ["Technology", "#technology"],
  ["AI Bots", "#bots"],
  ["Compare", "#compare"],
  ["FAQ", "#faq"],
];

export function Footer({ base = "" }: { base?: string }) {
  return (
    <footer className="safe-x relative border-t border-line bg-void/80 px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href={`${base}#top`} aria-label="FUSION AI — back to top">
              <Logo />
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Three AI trading strategy profiles, one experience. Illustrative targets only — trading can result in the
              partial or total loss of capital.
            </p>
            <a
              href={`${base}#risk`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-danger underline-offset-4 hover:underline"
            >
              Read the full risk disclosure <span aria-hidden="true">→</span>
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">Explore</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {NAV.map(([l, h]) => (
                <li key={h}>
                  <a href={`${base}${h}`} className="text-muted transition-colors hover:text-ink">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">Legal &amp; contact</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-muted transition-colors hover:text-ink">
                  Privacy Policy <span className="text-dim">(placeholder)</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted transition-colors hover:text-ink">
                  Terms of Use <span className="text-dim">(placeholder)</span>
                </Link>
              </li>
              <li className="text-dim">Contact details — to be published</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-6 text-xs leading-relaxed text-dim">
          <p>
            Risk warning: Trading involves substantial risk. The monthly target ranges shown are illustrative, not
            guaranteed, and do not represent actual performance. You may lose some or all of the capital allocated to
            trading. Nothing on this website is investment advice.
          </p>
          <p className="mt-4">© [Year] [Legal entity name — to be confirmed]. FUSION AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
