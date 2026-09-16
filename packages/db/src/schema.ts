import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status", {
    enum: ["active", "paused", "archived"],
  }).notNull(),
  owner: text("owner").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

type Project = typeof projects.$inferSelect;
type NewProject = typeof projects.$inferInsert;

export { projects, type Project, type NewProject };
