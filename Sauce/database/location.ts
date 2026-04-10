import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCATIONS_KEY } from '@/constants/keys';

// In this Function, we're simply getting all of the saved locations
export const getLocations = async () => {
    try{
        const data = await AsyncStorage.getItem(LOCATIONS_KEY)
        return data ? JSON.parse(data) : []; 
    } catch (e){
        console.log("There was an issue with getting locations: ", e);
        return [];
    }
}


// This function will simply save locations
export const saveLocations = async (locations: any[]) => {
    try{
        await AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));
    } catch (e) {
        console.log("An error saving locations: ", e)
    }
}