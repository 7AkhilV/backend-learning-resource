"use client";

import { createContext, useContext, useEffect, useState } from "react";

const KEY = "nest-learn-progress";

type Progress = {
  done: Record<string, boolean>;
  checks: Record<string, boolean>;
};

type ProgressApi = Progress & {
  ready: boolean;
  toggleChapter: (slug: string) => void;
  toggleCheck: (id: string) => void;
};

const EMPTY: Progress = { done: {}, checks: {} };

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Progress>;
        setProgress({
          done: parsed.done ?? {},
          checks: parsed.checks ?? {},
        });
      }
    } catch {
      /* keep the empty record */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(progress));
  }, [progress, ready]);

  const api: ProgressApi = {
    ...progress,
    ready,
    toggleChapter: (slug) =>
      setProgress((current) => ({
        ...current,
        done: { ...current.done, [slug]: !current.done[slug] },
      })),
    toggleCheck: (id) =>
      setProgress((current) => ({
        ...current,
        checks: { ...current.checks, [id]: !current.checks[id] },
      })),
  };

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
