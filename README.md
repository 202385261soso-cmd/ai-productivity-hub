# Attic — AI Workplace Productivity Assistant

An integrated, single-platform AI assistant for everyday office work: drafting emails, summarising meetings, planning tasks, researching questions and chatting through work problems — all in one professional SaaS-style dashboard.

## Overview

Attic is a responsive web application built with React 19, TanStack Start and Tailwind CSS v4. It presents five AI-powered tools inside one workspace with a persistent left sidebar on desktop and a scrollable pill navigation on mobile. All AI calls are executed server-side; no API key ever reaches the browser.

## Problem statement

Knowledge workers lose hours every week to repetitive written work: composing routine emails, rewriting messy meeting notes into decisions and action items, re-planning a day that has already slipped, and hunting for a quick structured explanation of an unfamiliar topic. These tasks are usually spread across half a dozen disconnected tools and browser tabs.

Attic consolidates them into one coherent workspace with consistent inputs, consistent output handling (edit, copy, clear) and consistent responsible-AI guardrails, so the assistant is genuinely usable in a workplace rather than being another set of isolated demos.

## Features

- **Smart Email Generator** — purpose, recipient/context, tone (Formal, Friendly, Professional, Persuasive) and length (Short, Medium, Detailed); produces a complete editable email with a subject line.
- **Meeting Notes Summarizer** — paste raw notes or a transcript; returns Summary, Key Decisions, Action Items (with owners), Deadlines and Open Questions in separate sections.
- **AI Task Planner** — tasks, available working hours, priority level and Daily/Weekly period; returns a priority order plus a realistic time-blocked schedule.
- **AI Research Assistant** — a workplace question plus a response type (Summary, Key Insights, Recommendations); returns the answer alongside a confidence/limitations section and an explicit "what to verify" list. No sources or citations are ever fabricated.
- **AI Workplace Chatbot** — a session-based conversational assistant for writing, planning, summarising, brainstorming and professional communication, with full conversation context sent on every turn.
- **Dashboard** — welcome header, four productivity statistic cards, a tool tray with a featured tool, quick actions and a recent-activity feed.
- **Settings** — appearance (light/dark), AI response preferences, responsible-AI information and app details.
- Shared UX across every tool: instructions, validation, loading skeletons, error states, empty states, editable output, copy and clear.

## Technologies used

| Area | Choice |
| --- | --- |
| Framework | React 19 + TanStack Start (SSR, file-based routing) |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 (CSS-first design tokens in `src/styles.css`) |
| Typography | Fraunces (display) + Inter (body) |
| Icons | lucide-react |
| Notifications | sonner |
| Validation | zod |
| Language | TypeScript |

## AI tools / APIs used

AI requests go through the **Lovable AI Gateway** (OpenAI-compatible Responses API) from a TanStack Start server function. The default model is `openai/gpt-5.6-terra`. The gateway is called with streaming enabled and the response text is accumulated server-side before being returned to the client.

Nothing about the model call happens in the browser: prompts, model id and the API key live in `src/lib/ai.server.ts`, which is server-only.

## Prompt engineering approach

Every tool uses a dedicated structured system prompt (see `src/lib/ai.server.ts`), and each prompt defines six things explicitly:

1. **Role** — e.g. "professional workplace communication assistant", "meticulous meeting analyst".
2. **Context** — what situation the user is in and what raw material they supply.
3. **Task** — the precise transformation to perform.
4. **Required output format** — exact headings and bullet shapes, so results render consistently and are easy to scan.
5. **Quality requirements** — plain professional English, skimmable structure, no meta-commentary.
6. **Responsible-AI constraints** — a shared block appended to every prompt.

System prompts are never exposed to end users, and the models are instructed never to reveal or discuss them.

## Responsible AI approach

- A visible Responsible AI disclaimer appears on every page: *"AI-generated content may contain errors or omissions. Review and verify important information before using it for workplace decisions, communications, research, or other consequential purposes."*
- Prompt-level safeguards forbid fabricating facts, statistics, citations, sources, URLs or quotes; forbid presenting uncertain information as certain; and require refusal of harmful, discriminatory, deceptive or otherwise inappropriate workplace content.
- The Research Assistant explicitly states it has no browsing capability, produces no citations, and always ends with a "What To Verify" section.
- Output is labelled **AI generated** in the UI; demo output is labelled **Demo** and states plainly that it did not come from an AI model.
- User input is not stored on a server; chat history exists only for the current session and preferences/activity stay in the browser's local storage.

## Installation / setup

```bash
git clone <your-repo-url>
cd <project-directory>
npm install
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `LOVABLE_API_KEY` | yes (for live AI) | Server-side credential for the Lovable AI Gateway. |

Create a `.env` file in the project root:

```bash
LOVABLE_API_KEY=your_key_here
```

The key is read only inside a server function handler (`process.env['LOVABLE_API_KEY']`). It is never prefixed with `VITE_`, never sent to the client and never committed — keep `.env` in `.gitignore`.

**Demo mode:** if no key is configured, the app does not fake AI output. Each tool returns a clearly labelled "DEMO MODE — this text was not produced by an AI model" placeholder instead.

## How to run

```bash
npm run dev      # start the dev server (http://localhost:8080)
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # lint the codebase
```

## Testing

Manual test checklist used for this MVP:

- Submit each tool with empty inputs → friendly validation message, no request sent.
- Submit valid inputs → loading skeleton, then structured output in the result panel.
- Edit the generated output, switch to preview, copy to clipboard, clear the result.
- Disconnect the network / remove the API key → error state and demo mode behave as documented.
- Chat: send several turns and confirm earlier context is reflected in later answers; start a new conversation.
- Resize from 1440px to 375px and confirm the sidebar collapses to pill navigation and all grids stack.
- Keyboard-only pass: every control reachable with visible focus rings.

No automated test suite ships with this MVP; adding Vitest + Testing Library for the prompt builders and form validation is the first planned addition.

## Future improvements

- Persistent accounts and a database so statistics, history and saved drafts survive across devices.
- Streaming token-by-token output in the UI instead of waiting for the complete response.
- Export to PDF/Docx and direct send via an email provider.
- Team workspaces with shared templates and tone-of-voice presets.
- Calendar integration so the Task Planner schedules around real meetings.
- Automated tests (unit tests for prompt construction, end-to-end tests for each tool flow).
- Multi-language support.
