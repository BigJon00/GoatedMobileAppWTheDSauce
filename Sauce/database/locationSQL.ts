import { db } from "./db";
import { Location } from "@/interfaces/interfaces";


// This is needed for when we insert or update a location
export const insertLocation = async (location: Location) => {
  await db.runAsync(
    `INSERT OR REPLACE INTO locations 
     (id, name, description, latitude, longitude, isFavorite)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      location.id,
      location.name,
      location.description,
      location.latitude,
      location.longitude,
      0
    ]
  );
};

// Gets all of the locations from the DB
export const getAllLocations = async (): Promise<Location[]> => {
  const rows = await db.getAllAsync(`SELECT * FROM locations`);
  return rows as Location[];
};

// Toggles the status of a location
export const toggleFavoriteSQL = async (id: string, current: number) => {
  await db.runAsync(
    `UPDATE locations SET isFavorite = ? WHERE id = ?`,
    [current ? 0 : 1, id]
  );
};

// This function specifically gets favortied locations
export const getFavoritesSQL = async (): Promise<Location[]> => {
  const rows = await db.getAllAsync(
    `SELECT * FROM locations WHERE isFavorite = 1`
  );
  return rows as Location[];
};