import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SendHorizonal, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Markdown } from "@/components/markdown";
import { Button, Card, Pill, ResponsibleAiNote, TextArea } from "@/components/ui-kit";
import { generateWithAi } from "@/lib/ai.functions";
import { recordActivity } from "@/lib/activity";
import type { ChatTurn } from "@/lib/ai-types";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — Attic" },
      { name: "description", content: "Ask an AI assistant about writing, planning, summarising and workplace productivity." },
      { property: "og:title", content: "AI Workplace Chatbot — Attic" },
      { property: "og:description", content: "A session-based workplace assistant for writing, planning and brainstorming." },
    ],
  }),
  component: ChatTool,
});

const SUGGESTIONS = [
  "Help me brainstorm agenda items for a team retro",
  "How do I politely decline a meeting invite?",
  "Rewrite this update to be clearer and shorter",
  "What's a good way to prioritise a messy backlog?",
];

function ChatTool() {
  const run = useServerFn(generateWithAi);
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content) {
      toast.error("Type a question first.");
      return;
    }
    const next: ChatTurn[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { tool: "chat", messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: result.text }]);
      recordActivity("chat", `Asked the chatbot: ${content.slice(0, 44)}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "The assistant could not respond. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] leading-tight lg:text-[30px]">AI Workplace Chatbot</h1>
          <p className="mt-1.5 max-w-[68ch] text-pretty text-[13px] leading-relaxed text-muted-foreground">
            Ask about writing, planning, summarising, brainstorming or professional communication. The conversation is
            kept for this session only — it is not saved anywhere.
          </p>
        </div>
        {messages.length > 0 ? (
          <Button
            variant="outline"
            className="h-9 text-[13px]"
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
          >
            <RotateCcw className="size-3.5" aria-hidden />
            New conversation
          </Button>
        ) : null}
      </header>

      <Card className="flex min-h-[440px] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4" role="log" aria-live="polite">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <div className="mb-2 grid size-11 place-items-center rounded-full bg-brand-soft font-display font-semibold text-brand">
                ✦
              </div>
              <p className="text-[14px] font-medium">Ask me anything work-related</p>
              <p className="mt-1 max-w-[40ch] text-[12px] leading-relaxed text-muted-foreground">
                Start with one of these, or type your own question below.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border border-line bg-background/60 px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[80%] rounded-2xl rounded-br-md bg-brand px-3.5 py-2.5 text-[13px] leading-relaxed text-primary-foreground">
                  {m.content}
                </p>
              </div>
            ) : (
              <div key={i} className="fade-up max-w-[92%]">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-brand">Attic</span>
                  <Pill tone="muted">AI generated</Pill>
                </div>
                <div className="rounded-2xl rounded-bl-md bg-brand-soft/40 px-3.5 py-2 ring-1 ring-line">
                  <Markdown text={m.content} />
                </div>
              </div>
            ),
          )}

          {loading ? (
            <div className="max-w-[60%] space-y-2" aria-busy="true">
              <div className="shimmer h-3 w-3/4 rounded-full" />
              <div className="shimmer h-3 w-full rounded-full" />
              <div className="shimmer h-3 w-2/3 rounded-full" />
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-[12.5px] text-destructive">{error}</p>
            </div>
          ) : null}

          <div ref={endRef} />
        </div>

        <form
          className="flex items-end gap-2 border-t border-line bg-background/40 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <TextArea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Ask about writing, planning, summarising…"
            aria-label="Message"
            className="flex-1 bg-surface"
            disabled={loading}
          />
          <Button type="submit" disabled={loading} aria-label="Send message">
            <SendHorizonal className="size-4" aria-hidden />
            Send
          </Button>
        </form>
      </Card>

      <ResponsibleAiNote className="mt-6" />
    </AppShell>
  );
}
