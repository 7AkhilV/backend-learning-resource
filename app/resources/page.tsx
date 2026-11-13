import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { Pager } from "@/components/pager";
import { getHandbook } from "@/lib/handbook";

export const metadata: Metadata = {
  title: "Learning resources",
};

export default function ResourcesPage() {
  const part = getHandbook().parts.find((item) => item.kind === "resources");
  if (!part) notFound();

  return (
    <article className="page">
      <header className="page-header">
        <p className="eyebrow">Part {part.number}</p>
        <h1>Learning resources</h1>
      </header>
      <Markdown source={part.body} />
      <Pager href="/resources" />
    </article>
  );
}
