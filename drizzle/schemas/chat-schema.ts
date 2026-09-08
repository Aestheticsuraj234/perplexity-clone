import { integer, text, boolean, pgTable, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const chat = pgTable("chat", {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });

  export const message = pgTable("message", {
    id: text("id").primaryKey(),
    chatId: text("chat_id")
      .notNull()
      .references(() => chat.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: text("content"),
    sources: text("sources"),
    imageUrl: text("image_url"),
    followUps: text("follow_ups"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });