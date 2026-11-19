import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-[100svh] place-items-center px-5 text-center">
      <div>
        <LogoMark className="mx-auto h-14 w-14" />
        <p className="eyebrow mt-8">Error 404</p>
        <h1 className="display mt-4 text-4xl font-semibold sm:text-5xl">Lost in the asteroid field.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">The page you were looking for does not exist or has moved.</p>
        <Link href="/" className="btn btn-primary mt-8">
          Return home
        </Link>
      </div>
    </main>
  );
}
