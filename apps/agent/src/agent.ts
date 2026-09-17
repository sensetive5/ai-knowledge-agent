import OpenAI from "openai";
import { createDb } from "@agent/db";
import { toolDefinitions, createToolHandlers } from "./tools.js";

process.loadEnvFile("../../.env");

const { LLM_BASE_URL, LLM_API_KEY, LLM_MODEL, DATABASE_URL } = process.env;

if (
  typeof LLM_BASE_URL === "undefined" ||
  typeof LLM_API_KEY === "undefined" ||
  typeof LLM_MODEL === "undefined" ||
  typeof DATABASE_URL === "undefined"
) {
  throw new Error(
    "LLM_BASE_URL, LLM_API_KEY, LLM_MODEL and DATABASE_URL must be set",
  );
}

const client = new OpenAI({ baseURL: LLM_BASE_URL, apiKey: LLM_API_KEY });
const db = createDb(DATABASE_URL);
const handlers = createToolHandlers(db);

const SYSTEM = `
  Ты — ассистент инженерной команды. Отвечай кратко, по-русски.
Если нужны данные о проектах — вызови инструмент, не выдумывай.
По умолчанию вызывай БЕЗ status. Фильтруй только если пользователь явно назвал статус.
Если вызвал инструмент с фильтром — скажи об этом пользователю.
`;

const userMessage = process.argv.at(2) ?? "Какие проекты у нас в системе?";

const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
  { role: "system", content: SYSTEM },
  {
    role: "user",
    content: userMessage
  },
];

while (true) {
  const response = await client.chat.completions.create({
    model: LLM_MODEL,
    max_tokens: 1024,
    reasoning_effort: "none",
    tools: toolDefinitions,
    messages,
  });

  const message = response.choices[0].message;
  messages.push(message);

  if (!message.tool_calls?.length) {
    console.log("\n" + message.content);
    break;
  }

  for (const call of message.tool_calls) {
    if (call.type !== "function") continue;
    console.log(`[tool] ${call.function.name}(${call.function.arguments})`);
    const handler = handlers[call.function.name as keyof typeof handlers];
    let content: string;
    try {
      content = await handler(JSON.parse(call.function.arguments));
    } catch (error) {
      content = `Ошибка: ${error instanceof Error ? error.message : String(error)}`;
    }
    messages.push({ role: "tool", tool_call_id: call.id, content });
  }
}

process.exit(0);
