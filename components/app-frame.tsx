"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { NavGroup } from "@/lib/handbook";
import { ProgressProvider, useProgress } from "./progress";

function Frame({
  groups,
  trackedSlugs,
  children,
}: {
  groups: NavGroup[];
  trackedSlugs: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { done, ready } = useProgress();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const finished = trackedSlugs.filter((slug) => done[slug]).length;
  const chapterCount = trackedSlugs.length;
  const needle = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!needle) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(needle)),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, needle]);

  return (
    <div className="app">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="topbar">
        <button type="button" className="menu" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          {open ? "Close" : "Contents"}
        </button>
        <Link href="/">Nest Learn</Link>
      </header>
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <Link href="/" onClick={() => setOpen(false)}>
            <span className="mark">N</span>
            <span>
              <strong>Nest Learn</strong>
              <small>Backend, one chapter at a time</small>
            </span>
          </Link>
        </div>
        <div className="meter">
          <div className="meter-row">
            <span>{ready ? finished : 0} of {chapterCount}</span>
            <span>chapters</span>
          </div>
          <div className="track" aria-hidden="true">
            <span style={{ width: `${chapterCount ? ((ready ? finished : 0) / chapterCount) * 100 : 0}%` }} />
          </div>
        </div>
        <label className="find">
          <span className="sr">Find a chapter</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a chapter"
          />
        </label>
        <nav className="nav" aria-label="Handbook">
          {visible.map((group) => (
            <section key={group.id}>
              <p>
                <span>{group.kicker}</span>
                {group.title}
              </p>
              <ul>
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  const complete = item.slug ? Boolean(done[item.slug]) : false;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={active ? "active" : undefined}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        <span className={complete ? "idx done" : "idx"}>{complete ? "✓" : item.index}</span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {visible.length === 0 ? <p className="empty">No chapter matches.</p> : null}
        </nav>
        <p className="side-note">Progress stays in this browser.</p>
      </aside>
      {open ? <button type="button" className="scrim" aria-label="Close contents" onClick={() => setOpen(false)} /> : null}
      <main id="content" className="main">
        {children}
      </main>
    </div>
  );
}

export function AppFrame({
  groups,
  trackedSlugs,
  children,
}: {
  groups: NavGroup[];
  trackedSlugs: string[];
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      <Frame groups={groups} trackedSlugs={trackedSlugs}>
        {children}
      </Frame>
    </ProgressProvider>
  );
}
