import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ToolFrame } from "@/components/tool-frame";
import { OutputPanel } from "@/components/output-panel";
import { Button, Field, SelectInput, TextArea } from "@/components/ui-kit";
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Attic" },
      { name: "description", content: "Structured summaries, insights and recommendations with clear verification notes." },
      { property: "og:title", content: "AI Research Assistant — Attic" },
      { property: "og:description", content: "Ask a workplace question and get a structured answer that flags what to verify." },
    ],
  }),
  component: ResearchTool,
});

const TYPES = ["Summary", "Key Insights", "Recommendations"] as const;

function ResearchTool() {
  const [topic, setTopic] = useState("");
  const [responseType, setResponseType] = useState<(typeof TYPES)[number]>("Summary");

  const label = useCallback((p: string) => `Researched: ${p.slice(0, 48)}`, []);
  const { output, setOutput, demo, loading, error, generate, reset } = useGenerate("research", label);

  const onGenerate = () => {
    if (topic.trim().length < 3) return toast.error("Enter a topic or question to research.");
    void generate({ tool: "research", topic: topic.trim(), responseType }, topic.trim());
  };

  return (
    <AppShell>
      <ToolFrame
        title="AI Research Assistant"
        intro="Ask a workplace or business question and choose how you want the answer shaped. The assistant answers from general knowledge only — it has no browsing access and will never invent sources or citations."
        form={
          <div className="space-y-3">
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-3">
              <p className="text-[12px] leading-relaxed text-foreground">
                <span className="font-semibold">Unverified by design.</span> Everything below is AI-generated, not
                retrieved from verified sources. Confirm anything consequential against authoritative material before
                acting on it.
              </p>
            </div>
            <Field label="Research topic or question" htmlFor="topic">
              <TextArea
                id="topic"
                rows={5}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How do teams usually structure a hybrid-work policy?"
              />
            </Field>
            <Field label="Response type" htmlFor="rtype">
              <SelectInput id="rtype" value={responseType} onChange={(e) => setResponseType(e.target.value as typeof responseType)}>
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </SelectInput>
            </Field>
            <div className="flex gap-2 pt-1">
              <Button className="flex-1" onClick={onGenerate} disabled={loading}>
                {loading ? "Researching…" : "Generate response"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTopic("");
                  reset();
                }}
                disabled={loading}
              >
                Clear
              </Button>
            </div>
          </div>
        }
        output={
          <OutputPanel
            output={output}
            onChange={setOutput}
            onClear={reset}
            loading={loading}
            error={error}
            demo={demo}
            emptyHint="Ask a question on the left. The answer arrives with a confidence section and a list of things to verify."
          />
        }
      />
    </AppShell>
  );
}
