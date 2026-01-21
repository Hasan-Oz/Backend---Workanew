import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique().notNull(), 
  password: text('password'),              // password_hash
  role: text('role').default('student'),    
  username: text('username'),              // first_name/last_name
});

export const workshops = sqliteTable('workshops', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),          
  topic: text('topic').notNull(),          // kept for frontend compatibility
  description: text('description'),        
  date: text('date').notNull(),            // date_time
  
  room: text('room').default('Online'),    
  language: text('language').default('EN'),
  
  duration: integer('duration').default(60), // duration_minutes
  status: text('status').default('Public'),   
  
  creatorId: integer('creator_id').references(() => users.id), // teacher_id
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()), 
});

export const registrations = sqliteTable('registrations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),       
  workshopId: integer('workshop_id').references(() => workshops.id), 
  joinedAt: integer('joined_at', { mode: 'timestamp' }).$defaultFn(() => new Date()), 
});