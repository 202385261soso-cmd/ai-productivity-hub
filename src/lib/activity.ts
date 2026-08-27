/**
 * Lightweight session/local activity tracker.
 * No database is configured, so dashboard statistics start from clearly
 * labelled demo baselines and increase as the user actually uses the tools.
 */
import { useSyncExternalStore } from "react";

export type ToolKey = "email" | "meeting" | "task" | "research" | "chat";

export type ActivityEntry = {
  id: string;
  tool: ToolKey;
  label: string;
  at: number;
};

type State = {
  counts: Record<ToolKey, number>;
  entries: ActivityEntry[];
};

const STORAGE_KEY = "attic.activity.v1";

const DEMO_BASELINE: Record<ToolKey, number> = {
  email: 128,
  meeting: 34,
  task: 56,
  research: 19,
  chat: 12,
};

let state: State = { counts: { email: 0, meeting: 0, task: 0, research: 0, chat: 0 }, entries: [] };
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...state, ...(JSON.parse(raw) as State) };
  } catch {
    /* ignore corrupt storage */
  }
  emit();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable */
  }
}

export function recordActivity(tool: ToolKey, label: string) {
  hydrate();
  state = {
    counts: { ...state.counts, [tool]: (state.counts[tool] ?? 0) + 1 },
    entries: [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, tool, label, at: Date.now() }, ...state.entries].slice(0, 12),
  };
  persist();
  emit();
}

export function clearActivity() {
  state = { counts: { email: 0, meeting: 0, task: 0, research: 0, chat: 0 }, entries: [] };
  persist();
  emit();
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const SERVER_SNAPSHOT: State = {
  counts: { email: 0, meeting: 0, task: 0, research: 0, chat: 0 },
  entries: [],
};

export function useActivity() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_SNAPSHOT,
  );

  return {
    entries: snapshot.entries,
    session: snapshot.counts,
    totals: {
      email: DEMO_BASELINE.email + snapshot.counts.email,
      meeting: DEMO_BASELINE.meeting + snapshot.counts.meeting,
      task: DEMO_BASELINE.task + snapshot.counts.task,
      research: DEMO_BASELINE.research + snapshot.counts.research,
      chat: DEMO_BASELINE.chat + snapshot.counts.chat,
    },
  };
}

export function timeAgo(ts: number) {
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} d ago`;
}
