import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Terms of Use (placeholder)", robots: { index: false } };

export default function Page() {
  return (
    <LegalPlaceholder
      title="Terms of Use"
      items={[
        "The operating company, registered address and jurisdiction",
        "The nature of the service (software, signals, managed accounts or other)",
        "Approved risk disclosures and limitations of liability",
        "Eligibility, restricted jurisdictions and acceptable use",
        "Governing law and dispute resolution",
      ]}
    />
  );
}
