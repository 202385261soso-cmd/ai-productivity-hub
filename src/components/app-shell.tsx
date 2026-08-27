import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  CalendarClock,
  Compass,
  MessagesSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/", label: "Dashboard", short: "Home", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", short: "Email", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", short: "Meetings", icon: NotebookPen },
  { to: "/tasks", label: "Task Planner", short: "Tasks", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", short: "Research", icon: Compass },
  { to: "/chat", label: "AI Chatbot", short: "Chat", icon: MessagesSquare },
  { to: "/settings", label: "Settings", short: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand font-display text-sm font-semibold text-primary-foreground">
        A
      </div>
      <div className="leading-tight">
        <p className="font-display text-[15px] font-semibold">Attic</p>
        <p className="-mt-0.5 text-[11px] text-muted-foreground">Workplace AI desk</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-surface/70 px-4 py-5 lg:flex">
        <Brand />
        <nav aria-label="Primary" className="mt-7 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-brand-soft text-brand"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          AI output is unverified. Review before acting on it.
        </p>
      </aside>

      {/* Mobile / tablet top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-background/95 backdrop-blur-sm lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Brand />
        </div>
        <nav aria-label="Primary" className="no-scrollbar flex gap-1.5 overflow-x-auto px-3 pb-3">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 shrink-0 items-center rounded-full px-3.5 text-[13px] font-medium transition-colors",
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-foreground/5",
                )}
              >
                {item.short}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="px-4 pb-14 pt-5 lg:ml-64 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-[980px]">{children}</div>
      </main>
    </div>
  );
}
