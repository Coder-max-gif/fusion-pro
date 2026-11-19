import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

const display = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", weight: ["500", "600", "700"], display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", weight: ["400", "600"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "FUSION AI — Three Minds. One Fusion.", template: "%s · FUSION AI" },
  description:
    "Explore three AI-assisted trading strategy profiles — SAFE, CORE and NOVA — each with a different illustrative target and risk level. Targets are not guaranteed; capital is at risk.",
  openGraph: {
    title: "FUSION AI — Three Minds. One Fusion.",
    description: "Three AI trading strategy profiles with distinct approaches to risk. Illustrative targets only; capital at risk.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04050d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // draw under the notch; content is padded with env(safe-area-inset-*)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
