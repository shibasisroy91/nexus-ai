// lib/db/schema.ts
import { pgTable, text, timestamp, serial, varchar } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(), // Auto-incrementing integer ID
  sessionId: varchar("session_id", { length: 256 }).notNull(), // To link messages in a conversation
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
