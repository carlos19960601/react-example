import { sql } from "drizzle-orm";
import { int, text } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { mysqlTable } from "./noodle_table";

export const waitlist = mysqlTable("waitlist", {
    id: int("id").primaryKey().autoincrement(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    reason: text("reason", { enum: ["student", "project", "both"] }).notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    invitationSentAt: text("invitationSentAt"),
})


export const insertWaitlist = createInsertSchema(waitlist).omit({
    id: true,
    createdAt: true,
})