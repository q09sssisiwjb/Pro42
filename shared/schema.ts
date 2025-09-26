import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const images = pgTable("images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  negativePrompt: text("negative_prompt"),
  model: text("model").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  imageData: text("image_data").notNull(), // base64 encoded image data
  artStyle: text("art_style").notNull(),
  userDisplayName: text("user_display_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  moderationStatus: text("moderation_status").default('approved').notNull(), // 'approved' | 'pending' | 'rejected'
  likeCount: integer("like_count").default(0).notNull(),
});

export const insertImageSchema = createInsertSchema(images).pick({
  prompt: true,
  negativePrompt: true,
  model: true,
  width: true,
  height: true,
  imageData: true,
  artStyle: true,
  userDisplayName: true,
}).extend({
  negativePrompt: z.string().optional().nullable().default(null),
});

export const savedImages = pgTable("saved_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(), // For now just use string, could reference users table later
  prompt: text("prompt").notNull(),
  negativePrompt: text("negative_prompt"),
  model: text("model").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  imageData: text("image_data").notNull(), // base64 encoded image data
  artStyle: text("art_style").notNull(),
  originalImageId: varchar("original_image_id"), // Optional reference to community gallery image
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedImageSchema = createInsertSchema(savedImages).pick({
  userId: true,
  prompt: true,
  negativePrompt: true,
  model: true,
  width: true,
  height: true,
  imageData: true,
  artStyle: true,
  originalImageId: true,
}).extend({
  negativePrompt: z.string().optional().nullable().default(null),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof images.$inferSelect;
export type InsertSavedImage = z.infer<typeof insertSavedImageSchema>;
export type SavedImage = typeof savedImages.$inferSelect;
