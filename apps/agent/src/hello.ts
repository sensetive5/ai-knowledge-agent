import OpenAI from "openai";

process.loadEnvFile("../../.env");

const { LLM_BASE_URL, LLM_API_KEY, LLM_MODEL } = process.env;

if (
  typeof LLM_BASE_URL === "undefined" ||
  typeof LLM_API_KEY === "undefined" ||
  typeof LLM_MODEL === "undefined"
) {
  throw new Error("LLM_BASE_URL, LLM_API_KEY and LLM_MODEL must be set");
}

const client = new OpenAI({ baseURL: LLM_BASE_URL, apiKey: LLM_API_KEY });

const response = await client.chat.completions.create({
  model: LLM_MODEL,
  max_tokens: 1000,
  messages: [
    { role: "system", content: "Отвечай одним предложением, по-русски." },
    { role: "user", content: "Что такое эмбеддинг?" },
  ],
  reasoning_effort: "none"
});

console.log(response.choices[0].message);
console.log(response.usage);
