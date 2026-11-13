import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Assessment } from "@/components/assessment";
import { Pager } from "@/components/pager";
import { getHandbook } from "@/lib/handbook";

export const metadata: Metadata = {
  title: "Self-assessment",
};

export default function CheckPage() {
  const part = getHandbook().parts.find((item) => item.kind === "assessment");
  if (!part) notFound();

  return (
    <article className="page">
      <header className="page-header">
        <p className="eyebrow">Part {part.number}</p>
        <h1>Self-assessment</h1>
        <p className="lede">{part.lead}</p>
      </header>
      <Assessment groups={part.assessment} />
      <Pager href="/check" />
    </article>
  );
}
