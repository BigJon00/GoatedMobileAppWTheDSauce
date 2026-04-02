import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useRef } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";

// I took this code from Map-Notification HW and implemented it here.

type Event = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

const events: Event[] = [
  {
    id: 1,
    name: "Walmart",
    description: "Shaq is doing a meet n greet.",
    latitude: 32.7802,
    longitude: -79.9412,
  },
  {
    id: 2,
    name: "Concert at the Campus",
    description: "Live concert on Campus by Weird Al Yankovic",
    latitude: 32.7887,
    longitude: -79.9357,
  },
  {
    id: 3,
    name: "Parade",
    description: "A fun parade, celebrating things, yay!",
    latitude: 32.7807,
    longitude: -79.9307,
  },
];

const Search = () => {
  const mapRef = useRef<MapView | null>(null);

  const { lat, lng } = useLocalSearchParams();
  const latitude = Number(lat);
  const longitude = Number(lng);

  const fitAllEvents = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        events.map((event) => ({
          latitude: event.latitude,
          longitude: event.longitude,
        })),
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  };

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
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.title}>{event.name}</Text>
                <Text>{event.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Fit All Events" onPress={fitAllEvents} />
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: "100%",
    height: "100%",
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
    color: "#660000"
  },

  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#660000",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    
  },
});