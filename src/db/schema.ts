export const registrations = sqliteTable('registrations', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  workshopId: integer('workshop_id').references(() => workshops.id),
});

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// 1. USERS TABLE
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username'),
  email: text('email').unique().notNull(),
  
  // CHANGE 1: Remove .notNull() so Google users don't need a password
  password: text('password'), 
  
  role: text('role').default('student'),

  // CHANGE 2: Add these new columns for Social Login
  googleId: text('google_id'),
  facebookId: text('facebook_id'),
});

// 2. WORKSHOPS TABLE
export const workshops = sqliteTable('workshops', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  topic: text('topic').notNull(),
  status: text('status').default('draft'), // 'draft' | 'public' | 'hidden'
  // CLEANUP: Added foreign key to link workshop to a user (teacher)
  creatorId: integer('creator_id').references(() => users.id).notNull(),
});