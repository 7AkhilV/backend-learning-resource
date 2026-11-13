import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterDone } from "@/components/chapter-done";
import { ChapterFigure } from "@/components/figures";
import { Markdown } from "@/components/markdown";
import { Pager } from "@/components/pager";
import { getChapter, getHandbook, partLabel, readingMinutes } from "@/lib/handbook";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getHandbook().chapters.map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return { title: "Chapter" };
  if (chapter.kind === "topic") return { title: chapter.title };
  return { title: `Chapter ${chapter.number}: ${chapter.title}` };
}

export default async function ChapterPage({ params }: Props) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const minutes = readingMinutes(`${chapter.body}\n${chapter.exercise ?? ""}`);

  const isTopic = chapter.kind === "topic";

  return (
    <article className="page">
      <header className="page-header">
        <p className="eyebrow">
          Part {chapter.partNumber} · {partLabel(chapter.partTitle)}
        </p>
        <h1>
          <span className="ch-no">{isTopic ? "Topic" : String(chapter.number).padStart(2, "0")}</span>
          {chapter.title}
        </h1>
        <p className="quiet">
          {minutes} min read{chapter.exercise ? " · exercise at the end" : ""}
        </p>
      </header>
      <ChapterFigure number={chapter.number} slug={chapter.slug} />
      <Markdown source={chapter.body} />
      {chapter.exercise ? (
        <section className="exercise">
          <p className="stamp">Exercise</p>
          <Markdown source={chapter.exercise} />
        </section>
      ) : null}
      <ChapterDone slug={chapter.slug} topic={isTopic} />
      <Pager href={`/learn/${chapter.slug}`} />
    </article>
  );
}
