import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, CalendarClock, Compass, MessagesSquare } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, Pill, ResponsibleAiNote, SectionTitle, Button } from "@/components/ui-kit";
import { useActivity, timeAgo, type ToolKey } from "@/lib/activity";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Attic — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "One workspace for AI-assisted email drafting, meeting summaries, task planning, research and workplace chat.",
      },
      { property: "og:title", content: "Attic — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarise meetings, plan tasks and research faster — in one integrated AI workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/meetings",
    letter: "M",
    icon: NotebookPen,
    title: "Meeting Summarizer",
    blurb: "Decisions, actions & deadlines",
  },
  { to: "/tasks", letter: "T", icon: CalendarClock, title: "Task Planner", blurb: "Time-blocked daily & weekly plans" },
  { to: "/research", letter: "R", icon: Compass, title: "Research Assistant", blurb: "Structured, source-aware answers" },
  { to: "/chat", letter: "C", icon: MessagesSquare, title: "Workplace Chatbot", blurb: "Ask about writing, planning, more" },
] as const;

const TOOL_LETTER: Record<ToolKey, string> = { email: "E", meeting: "M", task: "T", research: "R", chat: "C" };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { totals, entries, session } = useActivity();
  const now = new Date();

  const stats = [
    { label: "Emails generated", value: totals.email, note: `${session.email} this session` },
    { label: "Meetings summarized", value: totals.meeting, note: `${session.meeting} this session` },
    { label: "Tasks planned", value: totals.task, note: `${session.task} this session` },
    { label: "Research sessions", value: totals.research, note: `${session.research} this session` },
  ];

  return (
    <AppShell>
      <section className="mb-5">
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {now.toLocaleDateString(undefined, { weekday: "long" })},{" "}
          {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
        </p>
        <h1 className="mt-1 max-w-[22ch] text-balance font-display text-[28px] leading-tight lg:text-[34px]">
          {greeting()}. Your desk is ready.
        </h1>
        <p className="mt-1.5 max-w-[62ch] text-pretty text-[13px] leading-relaxed text-muted-foreground">
          Attic is one integrated AI workspace for everyday office work — drafting, summarising, planning, researching
          and thinking out loud. Five labelled tools, within reach.
        </p>
      </section>

      <section className="mb-6" aria-label="Productivity statistics">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  {s.label}
                </span>
                <Pill>Demo</Pill>
              </div>
              <p className="mt-2 font-display text-[30px] leading-none font-semibold">{s.value}</p>
              <p className="mt-1.5 text-[12px] text-muted-foreground">{s.note}</p>
            </Card>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Statistics start from demo baselines and increase with your own usage in this browser.
        </p>
      </section>

      <section className="mb-6">
        <SectionTitle aside="5 tools">Tool tray</SectionTitle>

        <Card className="fade-up overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand font-display text-sm font-semibold text-primary-foreground">
              E
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-medium leading-tight">Email Generator</p>
              <p className="truncate text-[12px] text-muted-foreground">Draft workplace mail in your tone</p>
            </div>
            <Link to="/email" className="ml-auto shrink-0 text-[11px] font-semibold text-brand">
              Open
            </Link>
          </div>
          <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="space-y-2 p-4">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Give the purpose and recipient, choose a tone and length, and get a complete, ready-to-send draft you
                can edit and copy.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Formal", "Friendly", "Professional", "Persuasive"].map((t) => (
                  <span key={t} className="rounded-full bg-foreground/5 px-2.5 py-1 text-[11px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <div className="pt-2">
                <Link to="/email">
                  <Button className="w-full sm:w-auto">
                    <Mail className="size-4" aria-hidden />
                    Draft an email
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-brand-soft/30 p-4">
              <p className="mb-2 text-[12px] font-medium text-brand">What you get</p>
              <ul className="space-y-1.5 pl-4 text-[13px] leading-relaxed">
                <li className="list-disc marker:text-brand">Subject line and full body</li>
                <li className="list-disc marker:text-brand">Editable output with one-click copy</li>
                <li className="list-disc marker:text-brand">Tone and length you control</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-card ring-1 ring-line transition-colors hover:bg-foreground/[0.02]"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                <tool.icon className="size-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium">{tool.title}</p>
                <p className="truncate text-[12px] text-muted-foreground">{tool.blurb}</p>
              </div>
              <span aria-hidden className="shrink-0 text-[16px] text-muted-foreground">
                &rsaquo;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-6" aria-label="Quick actions">
        <SectionTitle>Quick actions</SectionTitle>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Link to="/email">
            <Button className="w-full">Draft email</Button>
          </Link>
          <Link to="/meetings">
            <Button variant="outline" className="w-full">
              Summarize notes
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="outline" className="w-full">
              Plan my day
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-6" aria-label="Recent activity">
        <SectionTitle>Recent activity</SectionTitle>
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-5 text-center">
            <div className="mx-auto mb-2 grid size-11 place-items-center rounded-full bg-brand-soft font-display font-semibold text-brand">
              +
            </div>
            <p className="text-[14px] font-medium">No activity yet</p>
            <p className="mt-0.5 text-pretty text-[12px] text-muted-foreground">
              Anything you generate will show up here. Try the Email Generator above.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.id} className="flex items-center gap-3 rounded-xl bg-surface p-3 ring-1 ring-line">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent/20 font-display text-[12px] font-semibold text-accent">
                  {TOOL_LETTER[entry.tool]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{entry.label}</p>
                  <p className="text-[11px] text-muted-foreground">{timeAgo(entry.at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ResponsibleAiNote />
    </AppShell>
  );
}
