import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { Pager } from "@/components/pager";
import { getHandbook } from "@/lib/handbook";

export const metadata: Metadata = {
  title: "Team Management System",
};

export default function ProjectPage() {
  const part = getHandbook().parts.find((item) => item.kind === "project");
  if (!part) notFound();

  return (
    <article className="page">
      <header className="page-header">
        <p className="eyebrow">Part {part.number}</p>
        <h1>Team Management System</h1>
        <p className="lede">Build this once, and add to it as each chapter gives you a new piece.</p>
      </header>
      <Markdown source={part.body.replace(/^## Team Management System\n+/, "")} />
      <Pager href="/project" />
    </article>
  );
}
