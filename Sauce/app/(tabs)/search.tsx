import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";

// Importing both functions from 
import { getLocations, saveLocations } from "@/database/location";
import { getFavorites, toggleFavorite } from "@/database/favorites";


// Importing from interfaces
import { Location } from "@/interfaces/interfaces";

// Here is our hard coded locations
const defaultLocations: Location[] = [
  {
    id: "1",
    name: "Sabatino's NYC Pizza",
    description: "Pizza Focused Restaurant",
    latitude: 32.7856,
    longitude: -79.9367,
  },
  {
    id: "2",
    name: "Iron Rose",
    description: "Bar & Restaurant with a wide vareity of exquisite cuisines.",
    latitude: 32.7777,
    longitude: -79.9317,
  },
  {
    id: "3",
    name: "The Peacock",
    description: "Unique culinary creations centered around American designs.",
    latitude: 32.7804,
    longitude: -79.9275,
  },
  {
    id: "4",
    name: "Berkeley's",
    description: "Elevated America comfort food with a influence of Jersey and Philadelphia",
    latitude: 32.8,
    longitude: -79.95,
  },
  {
    id: "5",
    name: "Magnolia's",
    description: "Special culinary focused around Lowcountry dining",
    latitude: 32.7804,
    longitude: -79.93,
  },
];


const Search = () => {
  const mapRef = useRef<MapView | null>(null);

  // useState using Location
  const [locations, setLocations] = useState<Location[]>([]);
  const [favorites, setFavorites] = useState<Location[]>([]);

  const { lat, lng } = useLocalSearchParams();
  const latitude = Number(lat);
  const longitude = Number(lng);

  //AsyncStorage data getting intialized
  useEffect(() => {
    initializeLocations();
    loadFavorites();
  }, []);

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id);
  };
  
  // This is needed for just updating the and checking the locations
  const initializeLocations = async () => {
    await saveLocations(defaultLocations);
    setLocations(defaultLocations);
  };

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const handleToggleFavorite = async (location: Location) => {
    const updated = await toggleFavorite(location);
    setFavorites(updated);
  };

  /* KEEP THIS
  const initializeLocations = async () => {
    const stored = await getLocations();

    if (stored.length === 0 || stored[0].name !== defaultLocations[0].name) {
      await saveLocations(defaultLocations);
      setLocations(defaultLocations);
    } else {
      setLocations(stored);
    }
  };
  */

 /* NOT NEEDED AS OF RIGHT NOW
  const fitAllLocations = () => {
    if (mapRef.current && locations.length > 0) {
      mapRef.current.fitToCoordinates(
        locations.map((loc) => ({
          latitude: loc.latitude,
          longitude: loc.longitude,
        })),
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  };
 */
  useEffect(() => {
    if (!isNaN(latitude) && !isNaN(longitude) && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [latitude, longitude]);

  const zoomToLocation = (location: Location) => {
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: 32.78,
          longitude: -79.93,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            pinColor = {isFavorite(location.id) ? "gold" : "red"}
            onPress={() => handleToggleFavorite(location)}
            
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.title}>{location.name}</Text>
                <Text>{location.description}</Text>

                <Text style={{ marginTop: 10, color: "blue" }}>
                  {isFavorite(location.id) ? "★ Favorited" : "☆ Add Favorite"}
                </Text>
              
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={locations}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => zoomToLocation(item)}>
            <Text style={styles.listTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.listDesc} numberOfLines={2}>
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  callout: {
    backgroundColor: "#bfa87c",
    padding: 20,
    borderRadius: 20,
    width: 200,
  },

  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#660000",
  },

  list: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },

  listContent: {
    paddingHorizontal: 10,
  },

  listItem: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 15,
    width: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  listTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#660000",
  },

  listDesc: {
    fontSize: 12,
    color: "#333",
  },
});