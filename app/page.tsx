import type { Metadata } from "next";
import Link from "next/link";
import { ContinueLink, Place } from "@/components/home-actions";
import { Markdown } from "@/components/markdown";
import { getHandbook, learningPath, numberedChapters, partLabel } from "@/lib/handbook";

export const metadata: Metadata = {
  title: "Backend Development",
  description: "Self-study handbook for frontend developers moving into backend development.",
};

export default function HomePage() {
  const book = getHandbook();
  const steps = learningPath(book);

  return (
    <div className="page wide">
      <header className="hero">
        <p className="eyebrow">Self-study handbook</p>
        <h1>Backend Development</h1>
        <p className="lede">{book.subtitle}</p>
        <ul className="stack">
          {book.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="format">
          {book.level}. {book.format}.
        </p>
        <ContinueLink steps={steps} />
        <Place slugs={numberedChapters(book).map((chapter) => chapter.slug)} />
      </header>

      <Markdown source={book.intro} />

      <section className="path">
        <h2>The path</h2>
        <p className="quiet">{numberedChapters(book).length} chapters, then one project you keep building.</p>
        {book.parts.map((part) => (
          <article key={part.number} className="part">
            <p className="part-kicker">Part {part.number}</p>
            <div>
              <h3>{partLabel(part.title)}</h3>
              {part.kind === "curriculum" ? (
                <ol className="chapters">
                  {part.chapters.map((chapter) => (
                    <li key={chapter.slug}>
                      <Link href={`/learn/${chapter.slug}`}>
                        <span>{chapter.kind === "topic" ? "PM" : String(chapter.number).padStart(2, "0")}</span>
                        {chapter.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>
                  <Link href={part.kind === "project" ? "/project" : part.kind === "assessment" ? "/check" : "/resources"}>
                    {part.kind === "project"
                      ? "Open the Team Management System"
                      : part.kind === "assessment"
                        ? "Open the self-assessment"
                        : "Open the learning resources"}
                  </Link>
                </p>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="closing">
        <h2>Final message to learners</h2>
        <Markdown source={book.closing} />
      </section>
    </div>
  );
}
