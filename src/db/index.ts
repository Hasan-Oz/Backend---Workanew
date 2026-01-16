import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema'; // We import your schema (tables) here

// This line creates (or opens) the 'sqlite.db' file in your project root
// Matches "Database: SQLite - file-based" from Design Doc 4.3
const sqlite = new Database('sqlite.db'); 

// We export 'db' so you can use it in your routes (e.g., db.select().from(users))
export const db = drizzle(sqlite, { schema });