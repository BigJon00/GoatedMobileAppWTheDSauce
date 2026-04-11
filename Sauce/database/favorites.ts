import AsyncStorage from "@react-native-async-storage/async-storage";
import { FAVORITES_KEY } from "@/constants/keys";
import { Location } from "@/interfaces/interfaces";

// Getting Favorites
export const getFavorites = async (): Promise<Location[]> => {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
};

// Saving Favs
export const saveFavorites = async (favorites: Location[]) => {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

// Toggle Favs
export const toggleFavorite = async (location: Location) => {
    const favorites = await getFavorites();

    const exist = favorites.find(f => f.id === location.id);

    let updated;

    if (exist) {
        updated = favorites.filter(f => f.id !== location.id);
    } else {
        updated = [...favorites, location];
    }

    await saveFavorites(updated)
    return updated;
}