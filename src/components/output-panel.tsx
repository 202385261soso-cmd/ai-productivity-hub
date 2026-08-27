import { useState } from "react";
import { Copy, Check, Pencil, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Markdown } from "./markdown";
import { Button, Pill } from "./ui-kit";

export function OutputPanel({
  output,
  onChange,
  onClear,
  loading,
  error,
  demo,
  emptyHint,
}: {
  output: string;
  onChange: (value: string) => void;
  onClear: () => void;
  loading: boolean;
  error: string | null;
  demo: boolean;
  emptyHint: string;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not access the clipboard");
    }
  };

  return (
    <section aria-label="AI output" className="flex min-h-[320px] flex-col rounded-2xl bg-brand-soft/30 p-4 ring-1 ring-line">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-brand">Result</span>
          {demo ? <Pill tone="accent">Demo</Pill> : output ? <Pill tone="brand">AI generated</Pill> : null}
        </div>
        {output && !loading ? (
          <div className="flex gap-1.5">
            <Button variant="outline" className="h-8 rounded-full px-3 text-[12px]" onClick={() => setEditing((v) => !v)}>
              {editing ? <Eye className="size-3.5" aria-hidden /> : <Pencil className="size-3.5" aria-hidden />}
              {editing ? "Preview" : "Edit"}
            </Button>
            <Button variant="outline" className="h-8 rounded-full px-3 text-[12px]" onClick={copy}>
              {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
              Copy
            </Button>
            <Button variant="quiet" className="h-8 rounded-full px-3 text-[12px]" onClick={onClear} aria-label="Clear result">
              <Trash2 className="size-3.5" aria-hidden />
            </Button>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-2.5" aria-live="polite" aria-busy="true">
          <p className="text-[12px] text-muted-foreground">Generating…</p>
          {["w-3/4", "w-full", "w-5/6", "w-2/3", "w-full", "w-1/2"].map((w, i) => (
            <div key={i} className={`shimmer h-3 rounded-full ${w}`} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-[13px] font-medium text-destructive">Generation failed</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{error}</p>
        </div>
      ) : output ? (
        editing ? (
          <textarea
            value={output}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[320px] w-full flex-1 resize-y rounded-xl border border-line bg-surface p-3 font-mono text-[12.5px] leading-relaxed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="Edit generated text"
          />
        ) : (
          <div className="fade-up flex-1 overflow-auto rounded-xl bg-surface p-4 ring-1 ring-line">
            <Markdown text={output} />
          </div>
        )
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface/60 p-6 text-center">
          <div className="mb-2 grid size-11 place-items-center rounded-full bg-brand-soft font-display font-semibold text-brand">
            ✦
          </div>
          <p className="text-[14px] font-medium">Nothing generated yet</p>
          <p className="mt-1 max-w-[34ch] text-[12px] leading-relaxed text-muted-foreground">{emptyHint}</p>
        </div>
      )}
    </section>
  );
}
