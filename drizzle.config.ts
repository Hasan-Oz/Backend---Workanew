import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts', // Points to your schema file
  out: './drizzle',             // Where migration files are stored
  dialect: 'sqlite',            // We are using SQLite
  dbCredentials: {
    url: 'sqlite.db',           // The name of your DB file
  },
});