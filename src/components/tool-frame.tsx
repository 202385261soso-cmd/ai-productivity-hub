import type { ReactNode } from "react";
import { Card, ResponsibleAiNote } from "./ui-kit";

export function ToolFrame({
  title,
  intro,
  form,
  output,
}: {
  title: string;
  intro: string;
  form: ReactNode;
  output: ReactNode;
}) {
  return (
    <>
      <header className="mb-5">
        <h1 className="font-display text-[26px] leading-tight lg:text-[30px]">{title}</h1>
        <p className="mt-1.5 max-w-[68ch] text-pretty text-[13px] leading-relaxed text-muted-foreground">{intro}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4">{form}</Card>
        {output}
      </div>

      <ResponsibleAiNote className="mt-6" />
    </>
  );
}
