"use client";

import { useProgress } from "./progress";

export function ChapterDone({ slug, topic = false }: { slug: string; topic?: boolean }) {
  const { done, toggleChapter } = useProgress();
  const complete = Boolean(done[slug]);

  return (
    <button
      type="button"
      className={complete ? "done-btn is-done" : "done-btn"}
      onClick={() => toggleChapter(slug)}
    >
      {complete ? "Completed" : topic ? "Mark topic complete" : "Mark chapter complete"}
    </button>
  );
}
