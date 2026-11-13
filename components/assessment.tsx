"use client";

import type { AssessmentGroup } from "@/lib/handbook";
import { useProgress } from "./progress";

export function Assessment({
  groups,
}: {
  groups: AssessmentGroup[];
}) {
  const { checks, toggleCheck } = useProgress();
  const total = groups.reduce((sum, group) => sum + group.questions.length, 0);
  const marked = Object.values(checks).filter(Boolean).length;

  return (
    <div className="check">
      <p className="place">
        {marked} of {total} marked as something you can explain.
      </p>
      {groups.map((group, groupIndex) => (
        <section key={group.title} className="check-group">
          <h2>{group.title}</h2>
          <ul>
            {group.questions.map((question, questionIndex) => {
              const id = `${groupIndex}-${questionIndex}`;
              return (
                <li key={id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(checks[id])}
                      onChange={() => toggleCheck(id)}
                    />
                    <span>{question}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
