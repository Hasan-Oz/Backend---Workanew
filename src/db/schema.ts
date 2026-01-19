import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique().notNull(), // Matches source 1
  password: text('password'),              // Matches source 1: password_hash
  role: text('role').default('student'),   // Matches source 1
  username: text('username'),              // Maps to first_name/last_name
});

export const workshops = sqliteTable('workshops', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),          // Matches source 4
  topic: text('topic').notNull(),          // kept for frontend compatibility
  description: text('description'),        // Matches source 4
  date: text('date').notNull(),            // Matches source 4: date_time
  
  // NEW COLUMNS FROM YOUR TEAM'S SCRIPT
  room: text('room').default('Online'),    // Matches source 4
  language: text('language').default('EN'),// Matches source 4
  
  duration: integer('duration').default(60), // Matches source 4: duration_minutes
  status: text('status').default('Public'),  // Matches source 4
  
  creatorId: integer('creator_id').references(() => users.id), // Matches source 4: teacher_id
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()), // Matches source 4
});

export const registrations = sqliteTable('registrations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),       // Matches source 7
  workshopId: integer('workshop_id').references(() => workshops.id), // Matches source 7
  joinedAt: integer('joined_at', { mode: 'timestamp' }).$defaultFn(() => new Date()), // Matches source 7
});