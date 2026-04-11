import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";

// Importing both functions from database
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

  // Existing state 
  const [locations, setLocations] = useState<Location[]>([]);
  const [favorites, setFavorites] = useState<Location[]>([]);

  // Modal visibility state 
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Controlled form state (one useState per field) 
  const [formName, setFormName] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formLatitude, setFormLatitude] = useState<string>("");
  const [formLongitude, setFormLongitude] = useState<string>("");

  // Validation error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  const { lat, lng } = useLocalSearchParams();
  const latitude = Number(lat);
  const longitude = Number(lng);

  //AsyncStorage data getting intialized
  //Loads saved favorite
  useEffect(() => {
    initializeLocations();
    loadFavorites();
  }, []);

  // Animate map when navigated to with params
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

  // Check if a location is favorited
  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  // Load default locations into AsyncStorage and state
  const initializeLocations = async () => {
    await saveLocations(defaultLocations);
    setLocations(defaultLocations);
  };

  // Load saved favorites from AsyncStorage
  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  // Toggle favorite and persist
  const handleToggleFavorite = async (location: Location) => {
    const updated = await toggleFavorite(location);
    setFavorites(updated);
  };

  // Zoom map to a location
  const zoomToLocation = (location: Location) => {
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // Reset all form fields and errors
  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormLatitude("");
    setFormLongitude("");
    setErrors({});
  };

  // Validate all fields — returns true if valid
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formName.trim()) {
      newErrors.name = "Location name is required.";
    }

    if (!formDescription.trim()) {
      newErrors.description = "Description is required.";
    }

    const parsedLat = parseFloat(formLatitude);
    if (!formLatitude.trim()) {
      newErrors.latitude = "Latitude is required.";
    } else if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      newErrors.latitude = "Enter a valid latitude (-90 to 90).";
    }

    const parsedLng = parseFloat(formLongitude);
    if (!formLongitude.trim()) {
      newErrors.longitude = "Longitude is required.";
    } else if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      newErrors.longitude = "Enter a valid longitude (-180 to 180).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleAddLocation = async () => {
    if (!validateForm()) return;

    // Build new Location object
    const newLocation: Location = {
      id: Date.now().toString(),
      name: formName.trim(),
      description: formDescription.trim(),
      latitude: parseFloat(formLatitude),
      longitude: parseFloat(formLongitude),
    };

    // Update state and persist to AsyncStorage
    const updated = [...locations, newLocation];
    setLocations(updated);
    await saveLocations(updated);

    // Close modal, reset form, and zoom to new pin
    setModalVisible(false);
    resetForm();
    zoomToLocation(newLocation);
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
            pinColor={isFavorite(location.id) ? "gold" : "red"}
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

      {/* Floating Add Pin Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Pin</Text>
      </TouchableOpacity>

      {/* Horizontal location list */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={locations}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              // Zoom the map AND navigate to the dynamic detail route
              zoomToLocation(item);
              router.push({
                pathname: `/details/${item.id}` as any,
                params: {
                  name: item.name,
                  description: item.description,
                  latitude: item.latitude.toString(),
                  longitude: item.longitude.toString(),
                },
              });
            }}
          >
            <Text style={styles.listTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.listDesc} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.listHint}>Tap for details →</Text>
          </TouchableOpacity>
        )}
      />

      {/* Add Location Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Pin</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Location Name — controlled TextInput */}
            <Text style={styles.label}>Location Name *</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="e.g. Husk Restaurant"
              placeholderTextColor="#aaa"
              value={formName}
              onChangeText={setFormName}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            {/* Description — controlled TextInput */}
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description ? styles.inputError : null,
              ]}
              placeholder="Brief description of the spot"
              placeholderTextColor="#aaa"
              value={formDescription}
              onChangeText={setFormDescription}
              multiline
              numberOfLines={3}
            />
            {errors.description ? (
              <Text style={styles.errorText}>{errors.description}</Text>
            ) : null}

            {/* Lat / Lng row */}
            <View style={styles.coordRow}>
              <View style={styles.coordField}>
                <Text style={styles.label}>Latitude *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.latitude ? styles.inputError : null,
                  ]}
                  placeholder="32.7804"
                  placeholderTextColor="#aaa"
                  value={formLatitude}
                  onChangeText={setFormLatitude}
                  keyboardType="numeric"
                />
                {errors.latitude ? (
                  <Text style={styles.errorText}>{errors.latitude}</Text>
                ) : null}
              </View>

              <View style={styles.coordField}>
                <Text style={styles.label}>Longitude *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.longitude ? styles.inputError : null,
                  ]}
                  placeholder="-79.9300"
                  placeholderTextColor="#aaa"
                  value={formLongitude}
                  onChangeText={setFormLongitude}
                  keyboardType="numeric"
                />
                {errors.longitude ? (
                  <Text style={styles.errorText}>{errors.longitude}</Text>
                ) : null}
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddLocation}
            >
              <Text style={styles.submitText}>Add Location</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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

  addButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#660000",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 8,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
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

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#660000",
  },

  modalClose: {
    fontSize: 20,
    color: "#555",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    marginTop: 10,
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111",
    backgroundColor: "#fafafa",
  },

  inputError: {
    borderColor: "#cc0000",
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  errorText: {
    color: "#cc0000",
    fontSize: 11,
    marginTop: 3,
  },

  coordRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },

  coordField: {
    flex: 1,
  },

  submitButton: {
    backgroundColor: "#660000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 22,
  },

  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  listHint: {
    fontSize: 11,
    color: "#bfa87c",
    marginTop: 4,
    fontWeight: "600",
  },
});