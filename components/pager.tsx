import Link from "next/link";
import { stepsAround } from "@/lib/handbook";

export function Pager({ href }: { href: string }) {
  const { prev, next } = stepsAround(href);

  return (
    <nav className="pager" aria-label="Chapter">
      {prev ? (
        <Link href={prev.href}>
          <small>Previous</small>
          <span>
            {prev.kicker}. {prev.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="next">
          <small>Next</small>
          <span>
            {next.kicker}. {next.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
