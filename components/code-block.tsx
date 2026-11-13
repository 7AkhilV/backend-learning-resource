import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import http from "highlight.js/lib/languages/http";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import { CopyButton } from "./copy-button";

let ready = false;

function ensure() {
  if (ready) return;
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("sql", sql);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("http", http);
  ready = true;
}

const ALIASES: Record<string, string> = {
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  sql: "sql",
  json: "json",
  http: "http",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function CodeBlock({ language, code }: { language: string; code: string }) {
  ensure();
  const alias = ALIASES[language];
  const html =
    alias && hljs.getLanguage(alias)
      ? hljs.highlight(code, { language: alias }).value
      : escapeHtml(code);

  return (
    <figure className={language === "text" ? "code diagram" : "code"}>
      <figcaption>
        <span>{language}</span>
        <CopyButton text={code} />
      </figcaption>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  );
}
