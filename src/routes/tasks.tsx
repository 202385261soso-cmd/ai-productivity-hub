import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ToolFrame } from "@/components/tool-frame";
import { OutputPanel } from "@/components/output-panel";
import { Button, Field, SelectInput, TextArea, TextInput } from "@/components/ui-kit";
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Attic" },
      { name: "description", content: "Turn a task list and available hours into a prioritised, time-blocked plan." },
      { property: "og:title", content: "AI Task Planner — Attic" },
      { property: "og:description", content: "Prioritise by urgency and importance, then schedule realistic time blocks." },
    ],
  }),
  component: TaskTool,
});

const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
const PERIODS = ["Daily", "Weekly"] as const;

function TaskTool() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("6 hours, 09:00–16:00 with a lunch break");
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]>("Medium");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Daily");

  const label = useCallback((p: string) => `Planned tasks (${p})`, []);
  const { output, setOutput, demo, loading, error, generate, reset } = useGenerate("task", label);

  const onGenerate = () => {
    if (!tasks.trim()) return toast.error("List at least one task to plan.");
    if (!hours.trim()) return toast.error("Tell the planner how much time you have.");
    void generate(
      { tool: "task", tasks: tasks.trim(), hours: hours.trim(), priority, period },
      period.toLowerCase(),
    );
  };

  return (
    <AppShell>
      <ToolFrame
        title="AI Task Planner"
        intro="List what needs doing and how much time you actually have. The planner ranks work by urgency and importance, then lays it out in realistic time blocks you can edit."
        form={
          <div className="space-y-3">
            <Field label="Your tasks" htmlFor="tasks" hint="One per line works best.">
              <TextArea
                id="tasks"
                rows={8}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"Finish Q3 report\nReview two pull requests\nPrep Thursday client call\nBook team offsite venue"}
              />
            </Field>
            <Field label="Available working hours" htmlFor="hours">
              <TextInput id="hours" value={hours} onChange={(e) => setHours(e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Priority level" htmlFor="priority">
                <SelectInput id="priority" value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
                  {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Planning period" htmlFor="period">
                <SelectInput id="period" value={period} onChange={(e) => setPeriod(e.target.value as typeof period)}>
                  {PERIODS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
            <div className="flex gap-2 pt-1">
              <Button className="flex-1" onClick={onGenerate} disabled={loading}>
                {loading ? "Planning…" : `Generate ${period.toLowerCase()} plan`}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTasks("");
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
            emptyHint="Add your tasks and available hours. Your prioritised schedule with time blocks appears here."
          />
        }
      />
    </AppShell>
  );
}
