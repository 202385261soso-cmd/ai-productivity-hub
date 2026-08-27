import { Fragment } from "react";

/** Minimal, dependency-free renderer for the structured markdown the AI returns. */
function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-foreground/5 px-1 py-0.5 text-[12px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: JSX.Element[] = [];
  let list: string[] = [];

  const flush = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-2 space-y-1.5 pl-4">
        {list.map((item, i) => (
          <li key={i} className="list-disc text-[13px] leading-relaxed marker:text-brand">
            {inline(item)}
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((raw, index) => {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.*)$/);

    if (bullet) {
      list.push(bullet[1]);
      return;
    }
    flush();

    if (!line.trim()) return;

    if (line.startsWith("### ")) {
      blocks.push(
        <h4 key={index} className="mt-4 font-display text-[14px] font-semibold">
          {inline(line.slice(4))}
        </h4>,
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h3 key={index} className="mt-4 border-b border-line pb-1 font-display text-[15px] font-semibold text-brand first:mt-0">
          {inline(line.slice(3))}
        </h3>,
      );
    } else if (line.startsWith("# ")) {
      blocks.push(
        <h3 key={index} className="mt-4 font-display text-[16px] font-semibold first:mt-0">
          {inline(line.slice(2))}
        </h3>,
      );
    } else if (ordered) {
      blocks.push(
        <p key={index} className="my-1 pl-4 text-[13px] leading-relaxed -indent-4">
          {inline(line.trim())}
        </p>,
      );
    } else {
      blocks.push(
        <p key={index} className="my-2 text-[13px] leading-relaxed">
          {inline(line)}
        </p>,
      );
    }
  });

  flush();
  return <div className="text-foreground">{blocks}</div>;
}
