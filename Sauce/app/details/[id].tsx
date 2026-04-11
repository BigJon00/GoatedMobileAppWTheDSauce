import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { getFavorites, toggleFavorite } from "@/database/favorites";
import { Location } from "@/interfaces/interfaces";

const LocationDetail = () => {
  const { id, name, description, latitude, longitude } = useLocalSearchParams<{
    id: string;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
  }>();

  const router = useRouter();

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  // Favorite state
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Check if this location is already favorited on mount
  useEffect(() => {
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    const favs = await getFavorites();
    setIsFavorited(favs.some((f) => f.id === id));
  };

  const locationObj: Location = {
    id,
    name,
    description,
    latitude: lat,
    longitude: lng,
  };

  const handleFavoriteToggle = async () => {
    await toggleFavorite(locationObj);
    setIsFavorited((prev) => !prev);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Mini Map Preview */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{ latitude: lat, longitude: lng }}
            pinColor={isFavorited ? "gold" : "red"}
          />
        </MapView>
      </View>

      {/* Location Info Card */}
      <View style={styles.card}>
        <Text style={styles.locationName}>{name}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>About</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Coordinates</Text>
        <View style={styles.coordRow}>
          <View style={styles.coordBadge}>
            <Text style={styles.coordLabel}>Latitude</Text>
            <Text style={styles.coordValue}>{lat.toFixed(4)}</Text>
          </View>
          <View style={styles.coordBadge}>
            <Text style={styles.coordLabel}>Longitude</Text>
            <Text style={styles.coordValue}>{lng.toFixed(4)}</Text>
          </View>
        </View>
      </View>

      {/* Favorite Button */}
      <TouchableOpacity
        style={[styles.favoriteButton, isFavorited && styles.favoritedButton]}
        onPress={handleFavoriteToggle}
      >
        <Text style={styles.favoriteButtonText}>
          {isFavorited ? "★  Remove from Favorites" : "☆  Add to Favorites"}
        </Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back to Map</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LocationDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    paddingBottom: 40,
  },

  mapContainer: {
    height: 220,
    width: "100%",
  },

  map: {
    flex: 1,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  locationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#660000",
    marginBottom: 12,
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
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },

  description: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
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
    fontWeight: "600",
    marginBottom: 4,
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
    paddingVertical: 14,
    alignItems: "center",
  },

  favoritedButton: {
    backgroundColor: "#bfa87c",
  },

  favoriteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  backButton: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#660000",
    borderRadius: 12,
  },

  backButtonText: {
    color: "#660000",
    fontWeight: "600",
    fontSize: 15,
  },
});
