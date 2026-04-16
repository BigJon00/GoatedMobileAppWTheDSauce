import * as SQLite from 'expo-sqlite';

// Create DB and export
export const db = SQLite.openDatabaseSync("locations.db");


// Initialize DB table
export const initDB = async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        description TEXT,
        latitude REAL,
        longitude REAL,
        isFavorite INTEGER
      );
    `);
  };