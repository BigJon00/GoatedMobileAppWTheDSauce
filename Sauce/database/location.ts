import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCATIONS_KEY } from '@/constants/keys';

// Get locations
export const getLocations = async () => {
    try {
        const data = await AsyncStorage.getItem(LOCATIONS_KEY)
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.log("There was an issue with getting locations: ", e);
        return [];
    }
}

// Save locations
export const saveLocations = async (locations: any[]) => {
    try {
        await AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));
    } catch (e) {
        console.log("An error saving locations: ", e)
    }
}

// Get a single location by ID
export const getLocationById = async (id: string) => {
    const locations = await getLocations();
    return locations.find((l: any) => l.id === id);
}