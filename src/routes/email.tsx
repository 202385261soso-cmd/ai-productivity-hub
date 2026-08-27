import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ToolFrame } from "@/components/tool-frame";
import { OutputPanel } from "@/components/output-panel";
import { Button, Field, SelectInput, TextArea, TextInput } from "@/components/ui-kit";
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Attic" },
      { name: "description", content: "Draft professional workplace emails with a chosen tone and length." },
      { property: "og:title", content: "Smart Email Generator — Attic" },
      { property: "og:description", content: "Turn a purpose and recipient into a polished, editable workplace email." },
    ],
  }),
  component: EmailTool,
});

const TONES = ["Professional", "Formal", "Friendly", "Persuasive"] as const;
const LENGTHS = ["Short", "Medium", "Detailed"] as const;

function EmailTool() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Professional");
  const [length, setLength] = useState<(typeof LENGTHS)[number]>("Medium");

  const label = useCallback((p: string) => `Generated an email: ${p.slice(0, 48)}`, []);
  const { output, setOutput, demo, loading, error, generate, reset } = useGenerate("email", label);

  const onGenerate = () => {
    if (!purpose.trim()) return toast.error("Tell the assistant what the email is for.");
    if (!recipient.trim()) return toast.error("Add who the email is going to.");
    void generate({ tool: "email", purpose: purpose.trim(), recipient: recipient.trim(), tone, length }, purpose.trim());
  };

  const clearAll = () => {
    setPurpose("");
    setRecipient("");
    setTone("Professional");
    setLength("Medium");
    reset();
  };

  return (
    <AppShell>
      <ToolFrame
        title="Smart Email Generator"
        intro="Describe the purpose and who it's for, pick a tone and length, and the assistant drafts a complete email — subject line included. Edit the draft before you send it."
        form={
          <div className="space-y-3">
            <Field label="Purpose of the email" htmlFor="purpose" hint="e.g. Request a design review before Thursday's launch">
              <TextArea
                id="purpose"
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="What do you need this email to achieve?"
              />
            </Field>
            <Field label="Recipient / context" htmlFor="recipient">
              <TextInput
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Priya — design lead, works closely with our team"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tone" htmlFor="tone">
                <SelectInput id="tone" value={tone} onChange={(e) => setTone(e.target.value as typeof tone)}>
                  {TONES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Length" htmlFor="length">
                <SelectInput id="length" value={length} onChange={(e) => setLength(e.target.value as typeof length)}>
                  {LENGTHS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
            <div className="flex gap-2 pt-1">
              <Button className="flex-1" onClick={onGenerate} disabled={loading}>
                {loading ? "Generating…" : "Generate email"}
              </Button>
              <Button variant="outline" onClick={clearAll} disabled={loading}>
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
            emptyHint="Fill in the purpose and recipient, then generate. Your draft appears here, ready to edit and copy."
          />
        }
      />
    </AppShell>
  );
}
