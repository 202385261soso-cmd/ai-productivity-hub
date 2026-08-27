import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runGeneration, type GenerateRequest, type GenerateResult } from "./ai.server";

const chatTurn = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const generateInput = z.discriminatedUnion("tool", [
  z.object({
    tool: z.literal("email"),
    purpose: z.string().min(1).max(2000),
    recipient: z.string().min(1).max(1000),
    tone: z.enum(["Formal", "Friendly", "Professional", "Persuasive"]),
    length: z.enum(["Short", "Medium", "Detailed"]),
  }),
  z.object({
    tool: z.literal("meeting"),
    notes: z.string().min(20).max(20000),
  }),
  z.object({
    tool: z.literal("task"),
    tasks: z.string().min(1).max(6000),
    hours: z.string().min(1).max(200),
    priority: z.enum(["Low", "Medium", "High", "Critical"]),
    period: z.enum(["Daily", "Weekly"]),
  }),
  z.object({
    tool: z.literal("research"),
    topic: z.string().min(3).max(2000),
    responseType: z.enum(["Summary", "Key Insights", "Recommendations"]),
  }),
  z.object({
    tool: z.literal("chat"),
    messages: z.array(chatTurn).min(1).max(40),
  }),
]);

export const generateWithAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => generateInput.parse(input))
  .handler(async ({ data, signal }): Promise<GenerateResult> => {
    return runGeneration(data as GenerateRequest, signal);
  });
