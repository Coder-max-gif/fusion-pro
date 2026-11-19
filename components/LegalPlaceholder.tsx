import Link from "next/link";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { SpaceCanvas } from "./SpaceCanvas";

export function LegalPlaceholder({ title, items }: { title: string; items: string[] }) {
  return (
    <>
      <SpaceCanvas />
      <Nav base="/" />
      <main id="main" className="px-5 pb-24 pt-36 sm:px-8">
        <article className="mx-auto max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="display mt-4 text-4xl font-semibold sm:text-5xl">{title}</h1>
          <div className="mt-8 rounded-2xl border border-dashed border-warm/40 bg-warm/[0.05] p-6">
            <p className="font-semibold text-warm">Placeholder — approved copy not yet supplied</p>
            <p className="mt-2 leading-relaxed text-muted">
              This page is intentionally incomplete. The final {title} must be written and approved by qualified legal
              professionals for each jurisdiction in which FUSION AI operates, before launch.
            </p>
          </div>
          <h2 className="mt-12 text-lg font-bold">Expected to cover</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            {items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <Link href="/" className="btn btn-ghost mt-12">
            ← Back to home
          </Link>
        </article>
      </main>
      <Footer base="/" />
    </>
  );
}
