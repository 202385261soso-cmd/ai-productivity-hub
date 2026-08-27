import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateWithAi } from "@/lib/ai.functions";
import { recordActivity, type ToolKey } from "@/lib/activity";

type Payload = Parameters<typeof generateWithAi>[0] extends { data: infer D } ? D : never;

export function useGenerate(tool: ToolKey, activityLabel: (input: string) => string) {
  const run = useServerFn(generateWithAi);
  const [output, setOutput] = useState("");
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (payload: Payload, label: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await run({ data: payload });
        setOutput(result.text);
        setDemo(result.demo);
        recordActivity(tool, activityLabel(label));
        toast.success(result.demo ? "Demo response shown" : "Generated successfully");
        return result.text;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Something went wrong. Please try again.";
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [run, tool, activityLabel],
  );

  const reset = useCallback(() => {
    setOutput("");
    setError(null);
    setDemo(false);
  }, []);

  return { output, setOutput, demo, loading, error, generate, reset };
}
