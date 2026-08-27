import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl bg-surface ring-1 ring-line shadow-card", className)}>{children}</div>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="font-display text-[17px] font-semibold">{children}</h2>
      {aside ? <span className="text-[12px] text-muted-foreground">{aside}</span> : null}
    </div>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-[12px] font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

const controlClass =
  "w-full rounded-xl border border-line bg-background/60 px-3 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlClass, "h-11", props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(controlClass, "resize-y py-2.5 leading-relaxed", props.className)} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(controlClass, "h-11", props.className)} />;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "brand" | "outline" | "quiet" };

export function Button({ variant = "brand", className, ...props }: BtnProps) {
  const styles = {
    brand: "bg-brand text-primary-foreground hover:bg-brand/90 active:bg-brand/85",
    outline: "border border-line bg-surface text-foreground hover:bg-foreground/5",
    quiet: "text-muted-foreground hover:bg-foreground/5",
  }[variant];

  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60",
        styles,
        className,
      )}
    />
  );
}

export function Pill({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "accent" | "muted" }) {
  const styles = {
    brand: "bg-brand-soft text-brand",
    accent: "bg-accent/15 text-accent",
    muted: "bg-foreground/5 text-muted-foreground",
  }[tone];
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]", styles)}>
      {children}
    </span>
  );
}

export function ResponsibleAiNote({ className }: { className?: string }) {
  return (
    <aside className={cn("rounded-2xl bg-foreground p-4 text-background", className)}>
      <div className="flex gap-2.5">
        <span aria-hidden className="mt-0.5 shrink-0 text-[14px]">
          &#9432;
        </span>
        <p className="text-[12px] leading-relaxed">
          <span className="font-semibold">Responsible AI.</span> AI-generated content may contain errors or omissions.
          Review and verify important information before using it for workplace decisions, communications, research, or
          other consequential purposes.
        </p>
      </div>
    </aside>
  );
}
