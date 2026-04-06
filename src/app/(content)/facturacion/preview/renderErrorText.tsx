import React from "react";

export function renderErrorText(text: string): React.ReactNode {
  const parts = text.split(/\[guia:([^\]|]+)\|([^\]]+)\]/);
  if (parts.length === 1) return text;
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) nodes.push(parts[i]);
    if (parts[i + 1] && parts[i + 2]) {
      nodes.push(
        <a
          key={i}
          href={parts[i + 1]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:no-underline whitespace-nowrap"
          style={{ color: "#1e7a9c" }}>
          {parts[i + 2]}
        </a>,
      );
    }
  }
  return nodes;
}
