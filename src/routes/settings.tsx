import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button, Card, Field, SectionTitle, SelectInput, ResponsibleAiNote } from "@/components/ui-kit";
import { clearActivity } from "@/lib/activity";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Attic" },
      { name: "description", content: "Appearance, AI response preferences and responsible-AI information for Attic." },
      { property: "og:title", content: "Settings — Attic" },
      { property: "og:description", content: "Control appearance and default AI response preferences." },
    ],
  }),
  component: SettingsPage,
});

type Prefs = { appearance: "Light" | "Dark"; detail: "Concise" | "Balanced" | "Detailed"; tone: string };

const DEFAULTS: Prefs = { appearance: "Light", detail: "Balanced", tone: "Professional" };
const KEY = "attic.prefs.v1";

function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...(JSON.parse(raw) as Prefs) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", prefs.appearance === "Dark");
  }, [prefs.appearance]);

  const update = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    toast.success("Preference saved");
  };

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="font-display text-[26px] leading-tight lg:text-[30px]">Settings</h1>
        <p className="mt-1.5 max-w-[68ch] text-[13px] leading-relaxed text-muted-foreground">
          Preferences are stored in this browser only. No account or database is connected.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <SectionTitle>Appearance</SectionTitle>
          <Field label="Theme" htmlFor="appearance">
            <SelectInput
              id="appearance"
              value={prefs.appearance}
              onChange={(e) => update({ appearance: e.target.value as Prefs["appearance"] })}
            >
              <option>Light</option>
              <option>Dark</option>
            </SelectInput>
          </Field>
        </Card>

        <Card className="p-4">
          <SectionTitle>AI response preferences</SectionTitle>
          <div className="space-y-3">
            <Field label="Default level of detail" htmlFor="detail" hint="Used as the starting point in the tools.">
              <SelectInput id="detail" value={prefs.detail} onChange={(e) => update({ detail: e.target.value as Prefs["detail"] })}>
                <option>Concise</option>
                <option>Balanced</option>
                <option>Detailed</option>
              </SelectInput>
            </Field>
            <Field label="Default writing tone" htmlFor="tone">
              <SelectInput id="tone" value={prefs.tone} onChange={(e) => update({ tone: e.target.value })}>
                <option>Professional</option>
                <option>Formal</option>
                <option>Friendly</option>
                <option>Persuasive</option>
              </SelectInput>
            </Field>
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle>Responsible AI</SectionTitle>
          <ul className="space-y-1.5 pl-4 text-[13px] leading-relaxed text-muted-foreground">
            <li className="list-disc marker:text-brand">Every prompt forbids fabricating facts, sources or citations.</li>
            <li className="list-disc marker:text-brand">Uncertainty is stated plainly instead of being smoothed over.</li>
            <li className="list-disc marker:text-brand">Harmful or inappropriate workplace content is refused.</li>
            <li className="list-disc marker:text-brand">All output is labelled as AI-generated and unverified.</li>
            <li className="list-disc marker:text-brand">Your inputs are not stored on a server or used for training.</li>
          </ul>
        </Card>

        <Card className="p-4">
          <SectionTitle>About</SectionTitle>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Attic</span> is an integrated AI workplace productivity
            assistant: email drafting, meeting summarisation, task planning, research support and a workplace chatbot in
            one workspace. Built with React, TanStack Start and Tailwind CSS. AI requests run server-side, so API keys
            are never exposed in the browser.
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                clearActivity();
                toast.success("Local activity cleared");
              }}
            >
              Clear local activity data
            </Button>
          </div>
        </Card>
      </div>

      <ResponsibleAiNote className="mt-6" />
    </AppShell>
  );
}
