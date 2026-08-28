import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ToolFrame } from "@/components/tool-frame";
import { OutputPanel } from "@/components/output-panel";
import { Button, Field, TextArea } from "@/components/ui-kit";
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Attic" },
      { name: "description", content: "Turn messy meeting notes into a summary with decisions, actions and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer — Attic" },
      { property: "og:description", content: "Extract key decisions, action items, owners and deadlines from raw notes." },
    ],
  }),
  component: MeetingTool,
});

function MeetingTool() {
  const [notes, setNotes] = useState("");
  const label = useCallback(() => "Summarized meeting notes", []);
  const { output, setOutput, demo, loading, error, generate, reset } = useGenerate("meeting", label);

  const onGenerate = () => {
    if (notes.trim().length < 20) {
      toast.error("Paste at least a few lines of meeting notes first.");
      return;
    }
    void generate({ tool: "meeting", notes: notes.trim() }, notes.trim());
  };

  return (
    <AppShell>
      <ToolFrame
        title="Meeting Notes Summarizer"
        intro="Paste raw notes or a transcript. You get a short summary plus key decisions, action items with owners, deadlines and anything still unclear — extracted only from what your notes actually say."
        form={
          <div className="space-y-3">
            <Field
              label="Meeting notes or transcript"
              htmlFor="notes"
              hint="Rough bullet points are fine. Nothing is stored on a server."
            >
              <TextArea
                id="notes"
                rows={16}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={"Paste your notes here…\n\n- Ade: Q3 launch slipping to Oct 4\n- Finance approved extra contractor budget\n- Priya to send revised timeline by Friday"}
              />
            </Field>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{notes.trim().length} characters</span>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={onGenerate} disabled={loading}>
                {loading ? "Summarizing…" : "Summarize notes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNotes("");
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
            emptyHint="Paste your notes on the left. The summary, decisions, action items and deadlines appear here in separate sections."
          />
        }
      />
    </AppShell>
  );
}
