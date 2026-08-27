import { createServerFn } from "@tanstack/react-start";
import { parseGenerateInput, runGeneration, type GenerateResult } from "./ai.server";

export const generateWithAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => parseGenerateInput(input))
  .handler(async ({ data, signal }): Promise<GenerateResult> => runGeneration(data, signal));
