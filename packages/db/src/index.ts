import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as schema from "./schema.js"

function createDb(connectionString: string) {
  const pool = new pg.Pool({ connectionString });

  return drizzle(pool, { schema });
}

type DataBase = ReturnType<typeof createDb>;
export * from "./schema.js";

export {createDb, type DataBase}
