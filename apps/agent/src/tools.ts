import { z } from "zod";
import type OpenAI from "openai";
import { listProjects, type DataBase } from "@agent/db";

const ListProjectsInput = z.object({
  status: z.enum(["active", "paused", "archived"]).optional(),
});

export const toolDefinitions: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_projects",
      description: `
        Возвращает список проектов компании из базы данных.
        Вызывай, когда пользователь спрашивает о проектах, их статусах или владельцах.
        Можно отфильтровать по статусу.
      `,
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["active", "paused", "archived"],
            description: "Фильтр по статусу. Не указывай, если нужны все проекты.",
          },
        },
        additionalProperties: false,
      },
    },
  },
];

export function createToolHandlers(db: DataBase) {
  return {
    async list_projects(rawInput: unknown): Promise<string> {
      const input = ListProjectsInput.parse(rawInput);
      const rows = await listProjects(db, input);
      return JSON.stringify(rows);
    },
  } satisfies Record<string, (input: unknown) => Promise<string>>;
}
