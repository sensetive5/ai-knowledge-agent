import { createDb, projects, type NewProject } from "./index.js";

process.loadEnvFile("../../.env");

const rows: NewProject[] = [
  {
    name: "Alpha",
    description: "Internal knowledge assistant with RAG over engineering docs",
    status: "active",
    owner: "Alex",
  },
  {
    name: "Beta",
    description: "Customer support chatbot for the billing team",
    status: "active",
    owner: "Maria",
  },
  {
    name: "Gamma",
    description: "Legacy reporting service, migration to NestJS on hold",
    status: "paused",
    owner: "Ivan",
  },
  {
    name: "Delta",
    description: "Mobile app prototype, discontinued after pilot",
    status: "archived",
    owner: "Alex",
  },
];

if (process.env.DATABASE_URL === undefined) {
  throw new Error("Empty DATABASE_URL variable");
}

const db = createDb(process.env.DATABASE_URL);

await db.delete(projects);
const inserted = await db.insert(projects).values(rows).returning();
console.log(`Seeded ${inserted.length} projects`);

process.exit(0);
