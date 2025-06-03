import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Page builder elements schema (client-side only, no database persistence)
export const ElementType = z.enum([
  'container',
  'columns',
  'image',
  'title',
  'description',
  'price',
  'button',
  'text',
  'rating',
  'gallery'
]);

export const ElementStyle = z.object({
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  textColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  padding: z.object({
    top: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
    left: z.number().optional(),
  }).optional(),
  margin: z.object({
    top: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
    left: z.number().optional(),
  }).optional(),
  borderRadius: z.string().optional(),
  animation: z.object({
    type: z.string().optional(),
    duration: z.number().optional(),
  }).optional(),
});

export const PageElement = z.object({
  id: z.string(),
  type: z.string(),
  content: z.string().optional(),
  style: ElementStyle.optional(),
  props: z.record(z.any()).optional(),
  children: z.array(z.string()).optional(),
  parentId: z.string().optional(),
});

export const PageData = z.object({
  id: z.string(),
  title: z.string(),
  elements: z.array(PageElement),
  lastModified: z.string(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ElementTypeEnum = z.infer<typeof ElementType>;
export type ElementStyleType = z.infer<typeof ElementStyle>;
export type PageElementType = z.infer<typeof PageElement>;
export type PageDataType = z.infer<typeof PageData>;
