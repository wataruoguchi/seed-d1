import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});
export const insertUserSchema = createInsertSchema(users, {
  id: (schema) => schema.id.uuid(),
  name: (schema) => schema.name.min(1),
  email: (schema) => schema.email.email(),
});
