import fs from "node:fs";
import path from "node:path";

export type Chapter = {
  slug: string;
  number: number;
  title: string;
  body: string;
  exercise: string | null;
  partNumber: number;
  partTitle: string;
  kind: "chapter" | "topic";
};

export type AssessmentGroup = {
  title: string;
  questions: string[];
};

export type PartKind = "curriculum" | "project" | "assessment" | "resources";

export type Part = {
  number: number;
  title: string;
  kind: PartKind;
  chapters: Chapter[];
  body: string;
  lead: string;
  assessment: AssessmentGroup[];
};

export type Step = {
  href: string;
  label: string;
  kicker: string;
  slug?: string;
};

export type NavItem = {
  href: string;
  label: string;
  slug?: string;
  index: string;
};

export type NavGroup = {
  id: string;
  kicker: string;
  title: string;
  items: NavItem[];
};

export type Handbook = {
  title: string;
  subtitle: string;
  technology: string;
  format: string;
  level: string;
  stack: string[];
  intro: string;
  closing: string;
  parts: Part[];
  chapters: Chapter[];
};

const FILE = path.join(process.cwd(), "selflearn.md");

let cache: { mtime: number; data: Handbook } | null = null;

function slugify(n: number, title: string) {
  const base = title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${n}-${base}`;
}

function stripTail(markdown: string) {
  return markdown.replace(/\n+---\s*$/g, "").trim();
}

function splitExercise(markdown: string) {
  const marker = "\n### Exercise\n";
  const index = markdown.indexOf(marker);
  if (index === -1) {
    return { body: stripTail(markdown), exercise: null };
  }
  return {
    body: stripTail(markdown.slice(0, index)),
    exercise: stripTail(markdown.slice(index + marker.length)),
  };
}

function kindFor(n: number): PartKind {
  if (n === 8) return "project";
  if (n === 9) return "assessment";
  if (n === 10) return "resources";
  return "curriculum";
}

function leadOf(body: string) {
  const index = body.search(/\n## /);
  return (index === -1 ? body : body.slice(0, index)).trim();
}

function parseAssessment(body: string): AssessmentGroup[] {
  const groups: AssessmentGroup[] = [];
  for (const chunk of body.split(/\n(?=## )/)) {
    if (!chunk.startsWith("## ")) continue;
    const lines = chunk.trim().split("\n");
    const title = lines[0].replace(/^##\s+/, "").trim();
    const questions = lines
      .filter((line) => line.startsWith("- "))
      .map((line) => line.slice(2).trim());
    if (title && questions.length) groups.push({ title, questions });
  }
  return groups;
}

function topicSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseChapters(partNumber: number, partTitle: string, body: string) {
  return body
    .split(/\n(?=## (?:Chapter |Topic: ))/)
    .filter((chunk) => chunk.startsWith("## Chapter ") || chunk.startsWith("## Topic: "))
    .map((chunk) => {
      const lines = chunk.trim().split("\n");
      const heading = lines[0];
      const { body: lessonBody, exercise } = splitExercise(lines.slice(1).join("\n"));
      const topic = /^## Topic:\s+(.+)$/.exec(heading);
      if (topic) {
        const title = topic[1].trim();
        const lesson: Chapter = {
          slug: topicSlug(title),
          number: 0,
          title,
          body: lessonBody,
          exercise,
          partNumber,
          partTitle,
          kind: "topic",
        };
        return lesson;
      }

      const match = /^## Chapter (\d+):\s+(.+)$/.exec(heading);
      if (!match) throw new Error(`Bad chapter heading: ${heading}`);
      const number = Number(match[1]);
      const title = match[2].trim();
      const lesson: Chapter = {
        slug: slugify(number, title),
        number,
        title,
        body: lessonBody,
        exercise,
        partNumber,
        partTitle,
        kind: "chapter",
      };
      return lesson;
    });
}

function field(block: string, label: string) {
  const match = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`).exec(block);
  return match ? match[1].trim() : "";
}

export function getHandbook(): Handbook {
  const stat = fs.statSync(FILE);
  if (cache && cache.mtime === stat.mtimeMs) return cache.data;

  const raw = fs.readFileSync(FILE, "utf8").replace(/\r\n/g, "\n");
  const chunks = raw.split(/\n(?=# )/);
  const header = chunks[0] ?? "";
  const title = (/^#\s+(.+)$/m.exec(header)?.[1] ?? "Backend Development").trim();
  const subtitle = (/^###\s+(.+)$/m.exec(header)?.[1] ?? "").trim();
  const technology = field(header, "Technology");
  const format = field(header, "Learning format");
  const level = field(header, "Level");
  const stack = technology
    .replace(/\s+and\s+/gi, ", ")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  let intro = "";
  let closing = "";
  const parts: Part[] = [];

  for (const chunk of chunks.slice(1)) {
    const [first, ...rest] = chunk.split("\n");
    const heading = first.replace(/^#\s+/, "").trim();
    const body = rest.join("\n").trim();

    if (heading.startsWith("Welcome")) {
      intro = body;
      continue;
    }
    if (heading.startsWith("Final message")) {
      closing = body;
      continue;
    }

    const partMatch = /^PART\s+(\d+)\s+[–—-]\s+(.+)$/.exec(heading);
    if (!partMatch) continue;

    const number = Number(partMatch[1]);
    const partTitle = partMatch[2].trim();
    const kind = kindFor(number);
    parts.push({
      number,
      title: partTitle,
      kind,
      chapters: kind === "curriculum" ? parseChapters(number, partTitle, body) : [],
      body: kind === "curriculum" ? "" : body,
      lead: leadOf(body),
      assessment: kind === "assessment" ? parseAssessment(body) : [],
    });
  }

  const data: Handbook = {
    title,
    subtitle,
    technology,
    format,
    level,
    stack,
    intro,
    closing,
    parts,
    chapters: parts.flatMap((part) => part.chapters),
  };
  cache = { mtime: stat.mtimeMs, data };
  return data;
}

export function getChapter(slug: string) {
  return getHandbook().chapters.find((chapter) => chapter.slug === slug) ?? null;
}

export function numberedChapters(book = getHandbook()) {
  return book.chapters.filter((chapter) => chapter.kind === "chapter");
}

export function learningPath(book = getHandbook()): Step[] {
  const steps: Step[] = book.chapters.map((chapter) => ({
    href: `/learn/${chapter.slug}`,
    label: chapter.title,
    kicker: chapter.kind === "topic" ? "Topic" : `Chapter ${chapter.number}`,
    slug: chapter.slug,
  }));

  for (const part of book.parts) {
    if (part.kind === "project") {
      steps.push({ href: "/project", label: "Team Management System", kicker: "Final project" });
    }
    if (part.kind === "assessment") {
      steps.push({ href: "/check", label: "Self-assessment", kicker: "Check yourself" });
    }
    if (part.kind === "resources") {
      steps.push({ href: "/resources", label: "Learning resources", kicker: "References" });
    }
  }

  return steps;
}

export function stepsAround(href: string) {
  const steps = learningPath();
  const index = steps.findIndex((step) => step.href === href);
  return {
    prev: index > 0 ? steps[index - 1] : null,
    next: index >= 0 && index < steps.length - 1 ? steps[index + 1] : null,
  };
}

export function navigation(book = getHandbook()): NavGroup[] {
  const groups: NavGroup[] = book.parts
    .filter((part) => part.kind === "curriculum")
    .map((part) => ({
      id: `part-${part.number}`,
      kicker: `Part ${part.number}`,
      title: partLabel(part.title),
      items: part.chapters.map((chapter) => ({
        href: `/learn/${chapter.slug}`,
        label: chapter.title,
        slug: chapter.slug,
        index: chapter.kind === "topic" ? "PM" : String(chapter.number).padStart(2, "0"),
      })),
    }));

  groups.push({
    id: "practice",
    kicker: "Practice",
    title: "Use what you learned",
    items: book.parts
      .filter((part) => part.kind !== "curriculum")
      .map((part) => {
        if (part.kind === "project") {
          return { href: "/project", label: "Team Management System", index: "P" };
        }
        if (part.kind === "assessment") {
          return { href: "/check", label: "Self-assessment", index: "A" };
        }
        return { href: "/resources", label: "Learning resources", index: "R" };
      }),
  });

  return groups;
}

const SMALL = new Set(["and", "for", "of"]);
const SPECIAL: Record<string, string> = {
  http: "HTTP",
  rest: "REST",
  api: "API",
  apis: "APIs",
  nestjs: "NestJS",
  sql: "SQL",
  typescript: "TypeScript",
  postgresql: "PostgreSQL",
  node: "Node",
};

export function partLabel(title: string) {
  return title.toLowerCase().replace(/[a-z]+/g, (word, offset: number) => {
    if (SPECIAL[word]) return SPECIAL[word];
    if (SMALL.has(word) && offset > 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
}

export function readingMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
