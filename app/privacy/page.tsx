import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Privacy Policy (placeholder)", robots: { index: false } };

export default function Page() {
  return (
    <LegalPlaceholder
      title="Privacy Policy"
      items={[
        "The legal entity responsible for processing personal data",
        "What data is collected, why, and the legal basis for it",
        "Cookies and analytics (this site currently sets no tracking cookies)",
        "Data retention, sharing and international transfers",
        "Your rights and how to contact the data controller",
      ]}
    />
  );
}
