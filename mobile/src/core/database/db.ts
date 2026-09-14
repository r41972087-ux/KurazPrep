import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';
import * as schema from './schema';

// Open the SQLite database synchronously.
// Ensure WAL mode for better concurrency and performance.
export const expoDb = openDatabaseSync('kurazprep.db', { enableChangeListener: true });

// Execute PRAGMA statements
expoDb.execSync('PRAGMA journal_mode = WAL;');
expoDb.execSync('PRAGMA foreign_keys = ON;');

// Initialize Drizzle ORM
export const db = drizzle(expoDb, { schema });
