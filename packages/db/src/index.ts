import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pg from "pg";
import * as schema from "./schema.js";
import { projects, type Project } from "./schema.js";

function createDb(connectionString: string) {
  const pool = new pg.Pool({ connectionString });

  return drizzle(pool, { schema });
}

type DataBase = ReturnType<typeof createDb>;

async function listProjects(
  db: DataBase,
  filter: { status?: Project["status"] } = {},
): Promise<Project[]> {
  if (filter.status) {
    return db.select().from(projects).where(eq(projects.status, filter.status));
  }
  return db.select().from(projects);
}

export * from "./schema.js";
export { createDb, listProjects, type DataBase };
