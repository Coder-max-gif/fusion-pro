"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="grid min-h-[100svh] place-items-center px-5 text-center">
      <div>
        <p className="eyebrow !text-danger">Something went wrong</p>
        <h1 className="display mt-4 text-3xl font-semibold sm:text-4xl">Signal lost.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">This page failed to load. You can try again or return home.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-ghost">
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
