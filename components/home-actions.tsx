"use client";

import Link from "next/link";
import type { Step } from "@/lib/handbook";
import { useProgress } from "./progress";

export function ContinueLink({ steps }: { steps: Step[] }) {
  const { done, ready } = useProgress();
  const chapters = steps.filter((step) => step.slug);
  const finished = chapters.filter((step) => step.slug && done[step.slug]).length;
  const nextChapter = chapters.find((step) => step.slug && !done[step.slug]);
  const target = !ready || finished === 0 ? chapters[0] : (nextChapter ?? steps.find((step) => !step.slug) ?? chapters[0]);
  const label = !ready || finished === 0 ? "Start with chapter 1" : nextChapter ? "Continue" : "Review the project";

  return (
    <Link className="button" href={target.href}>
      {label}
    </Link>
  );
}

export function Place({ slugs }: { slugs: string[] }) {
  const { done, ready } = useProgress();
  const finished = slugs.filter((slug) => done[slug]).length;
  if (!ready || finished === 0) return null;

  return (
    <p className="place">
      {finished} of {slugs.length} chapters marked complete in this browser.
    </p>
  );
}
