import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { Location } from "@/interfaces/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ONLY use SQLite
import { getAllLocations, toggleFavoriteSQL } from "@/database/locationSQL";

const LocationDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // State
  const [location, setLocation] = useState<Location | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [theme, setTheme] = useState("white");
  const [textColor, setTextColor] = useState("black");
  const [subColor, setSubColor] = useState<string>("black");

  // Load data EVERY TIME screen is focused
  useFocusEffect(() => {
    const themeLoad = async () => {
      const themeSaved = await AsyncStorage.getItem("theme");
      const textSaved = await AsyncStorage.getItem("textColor");
      const subSaved = await AsyncStorage.getItem("subColor");
      if(themeSaved){
        setTheme(themeSaved)
      }

      if (textSaved) {
        setTextColor(textSaved);
      }

      if (subSaved){
        setSubColor(subSaved);
      }

    };

    themeLoad();
    loadData();
    return () => {};
  });

  // Get location directly from SQLite
  const loadData = async () => {
    const allLocations = await getAllLocations();

    const found = allLocations.find((loc) => loc.id === id);

    if (found) {
      setLocation(found);
      setIsFavorited(found.isFavorite === 1);
    }
  };

  // Toggle favorite using SQLite
  const handleFavoriteToggle = async () => {
    if (!location) return;

    await toggleFavoriteSQL(location.id, location.isFavorite ?? 0);

    // Reload fresh data so EVERYTHING stays in sync
    const updated = await getAllLocations();
    const updatedLocation = updated.find((loc) => loc.id === id);

    if (updatedLocation) {
      setLocation(updatedLocation);
      setIsFavorited(updatedLocation.isFavorite === 1);
    }
  };

  // Loading fallback
  if (!location) {
    return (
      <View style={[styles.container, styles.centered,]}>
        <Text>Loading restaurant details...</Text>
      </View>
    );
  }

  const { name, description, latitude, longitude } = location;

  return (
     <View style={[styles.container, { backgroundColor: theme }]}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content} >
    

      
      {/* Map Preview */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            pinColor={isFavorited ? "gold" : "red"}
          />
        </MapView>
      </View>

      {/* Info Card */}
      <View style={[styles.card, { backgroundColor: subColor }]}>
        <Text style={[styles.locationName,{ color: textColor }]}>{name}</Text>

        <View style={styles.divider} />

        <Text style={[styles.sectionLabel, { color: textColor }]}>About</Text>
        <Text style={[styles.description, {color: textColor}]}>{description}</Text>

        <View style={styles.divider} />

        <Text style={[styles.sectionLabel, { color: textColor }]}>Coordinates</Text>
        <View style={styles.coordRow}>
          <View style={[styles.coordBadge, {backgroundColor: theme}]}>
            <Text style={[styles.coordLabel,{ color: textColor }]}>Latitude</Text>
            <Text style={[styles.coordValue,{ color: textColor }]}>{latitude.toFixed(4)}</Text>
          </View>

          <View style={[styles.coordBadge, {backgroundColor: theme}]}>
            <Text style={[styles.coordLabel,{ color: textColor }]}>Longitude</Text>
            <Text style={[styles.coordValue, { color: textColor }]}>{longitude.toFixed(4)}</Text>
          </View>
        </View>
      </View>

      {/* Favorite Button */}
      <TouchableOpacity
        style={[styles.favoriteButton, isFavorited && styles.favoritedButton]}
        onPress={handleFavoriteToggle}
      >
        <Text style={[styles.favoriteButtonText, { color: textColor }]}>
          {isFavorited ? "★ Remove from Favorites" : "☆ Add to Favorites"}
        </Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backButtonText, { color: textColor }]}>← Back to Map</Text>
      </TouchableOpacity>

    </ScrollView>
    </View>
  );
};

export default LocationDetail;

const styles = StyleSheet.create({
  container: { flex: 1 },

  centered: { justifyContent: "center", alignItems: "center", padding: 20 },

  content: { paddingBottom: 40 },

  mapContainer: { height: 220, width: "100%" },

  map: { flex: 1 },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },

  locationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#660000",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
  },

  description: {
    fontSize: 15,
    color: "#333",
  },

  coordRow: {
    flexDirection: "row",
    gap: 12,
  },

  coordBadge: {
    flex: 1,
    backgroundColor: "#f9f0e7",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },

  coordLabel: {
    fontSize: 11,
    color: "#888",
  },

  coordValue: {
    fontSize: 15,
    color: "#660000",
    fontWeight: "bold",
  },

  favoriteButton: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#660000",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },

  favoritedButton: {
    backgroundColor: "#bfa87c",
  },

  favoriteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  backButton: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#660000",
    borderRadius: 12,
  },

  backButtonText: {
    color: "#660000",
    fontWeight: "600",
  },
});