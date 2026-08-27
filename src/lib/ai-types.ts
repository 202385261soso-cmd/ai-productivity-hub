/** Client-safe shared types for the AI tools. */
export type ChatTurn = { role: "user" | "assistant"; content: string };

export type GenerateRequest =
  | { tool: "email"; purpose: string; recipient: string; tone: string; length: string }
  | { tool: "meeting"; notes: string }
  | { tool: "task"; tasks: string; hours: string; priority: string; period: string }
  | { tool: "research"; topic: string; responseType: string }
  | { tool: "chat"; messages: ChatTurn[] };

export type GenerateResult = { text: string; demo: boolean };
